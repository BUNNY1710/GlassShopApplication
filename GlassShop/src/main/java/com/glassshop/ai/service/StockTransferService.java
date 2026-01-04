package com.glassshop.ai.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.glassshop.ai.dto.StockTransferRequest;
import com.glassshop.ai.entity.AuditLog;
import com.glassshop.ai.entity.Glass;
import com.glassshop.ai.entity.Shop;
import com.glassshop.ai.entity.Stock;
import com.glassshop.ai.entity.StockHistory;
import com.glassshop.ai.entity.User;
import com.glassshop.ai.repository.AuditLogRepository;
import com.glassshop.ai.repository.GlassRepository;
import com.glassshop.ai.repository.StockHistoryRepository;
import com.glassshop.ai.repository.StockRepository;
import com.glassshop.ai.repository.UserRepository;

@Service
public class StockTransferService {

    @Autowired private StockRepository stockRepository;
    @Autowired private GlassRepository glassRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private StockHistoryRepository stockHistoryRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public String transferStock(StockTransferRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUserName(auth.getName()).orElse(null);

        if (user == null || user.getShop() == null) {
            return "❌ User or shop not found";
        }

        Shop shop = user.getShop();

        if (request.getFromStand() == request.getToStand()) {
            return "❌ From stand and To stand cannot be same";
        }

        // Parse glass thickness from type (e.g., "10MM" -> 10)
        int thickness;
        try {
            thickness = Integer.parseInt(
                request.getGlassType().replaceAll("[^0-9]", "")
            );
        } catch (Exception e) {
            return "❌ Invalid glass type format";
        }

        // Find or create glass type
        Glass glass = glassRepository
                .findByTypeAndThicknessAndUnit(
                        request.getGlassType(),
                        thickness,
                        request.getUnit()
                )
                .orElse(null);

        if (glass == null) {
            return "❌ Glass type not found";
        }

        Stock fromStock = stockRepository
                .findByGlassAndHeightAndWidthAndStandNoAndShop(
                        glass,
                        request.getHeight(),
                        request.getWidth(),
                        request.getFromStand(),
                        shop
                )
                .orElse(null);
        
        // Validate source stock exists
        if (fromStock == null) {
            return "❌ Source stock not found for Stand " + request.getFromStand();
        }
        
        // Validate sufficient quantity
        if (fromStock.getQuantity() < request.getQuantity()) {
            return "❌ Not enough stock in source stand. Available: " + fromStock.getQuantity() + ", Requested: " + request.getQuantity();
        }
        
        // Validate quantity is positive
        if (request.getQuantity() <= 0) {
            return "❌ Transfer quantity must be greater than zero";
        }

        Stock toStock = stockRepository
                .findByGlassAndHeightAndWidthAndStandNoAndShop(
                        glass,
                        request.getHeight(),
                        request.getWidth(),
                        request.getToStand(),
                        shop
                )
                .orElseGet(() -> {
                    Stock s = new Stock();
                    s.setGlass(glass);
                    s.setHeight(request.getHeight());
                    s.setWidth(request.getWidth());
                    s.setStandNo(request.getToStand());
                    s.setQuantity(0);
                    s.setMinQuantity(5);
                    s.setShop(shop);
                    return s;
                });

        // Store original quantities for audit log
        int originalFromQuantity = fromStock.getQuantity();
        int originalToQuantity = toStock.getQuantity();
        
        // Calculate new quantities
        int newFromQuantity = originalFromQuantity - request.getQuantity();
        int newToQuantity = originalToQuantity + request.getQuantity();
        
        // Validate no negative quantities (extra safety check)
        if (newFromQuantity < 0) {
            return "❌ Transfer would result in negative quantity in source stand";
        }
        
        // Update quantities
        fromStock.setQuantity(newFromQuantity);
        toStock.setQuantity(newToQuantity);
        
        // Save both stock records (updated_at will be set automatically by @UpdateTimestamp)
        Stock savedFromStock = stockRepository.save(fromStock);
        Stock savedToStock = stockRepository.save(toStock);
        
        // Verify saves were successful
        if (savedFromStock == null || savedToStock == null) {
            throw new RuntimeException("Failed to save stock records during transfer");
        }
        
        // Verify quantities were updated correctly
        if (savedFromStock.getQuantity() != newFromQuantity || savedToStock.getQuantity() != newToQuantity) {
            throw new RuntimeException("Stock quantities were not updated correctly during transfer");
        }

        // ✅ UPDATE EXISTING AUDIT LOG - Update the most recent entry for source stand
        // Find the entry that was created when stock was added to Stand 1 (e.g., ADD with 111)
        // and update it to show TRANSFER action with new quantity after transfer (e.g., 100)
        Optional<AuditLog> existingFromLogOpt = auditLogRepository
                .findTopByShopAndGlassTypeAndStandNoAndHeightAndWidthOrderByTimestampDesc(
                        shop, glass.getType(), request.getFromStand(), 
                        request.getHeight(), request.getWidth());
        
        if (existingFromLogOpt.isPresent()) {
            // Update existing entry with new quantity and set action to TRANSFER
            AuditLog existingFromLog = existingFromLogOpt.get();
            existingFromLog.setAction("TRANSFER"); // Set action to TRANSFER
            existingFromLog.setQuantity(newFromQuantity); // Update quantity to NEW REMAINING quantity (e.g., 80)
            existingFromLog.setStandNo(request.getFromStand()); // Ensure standNo is correct (source stand)
            existingFromLog.setFromStand(request.getFromStand()); // Set from stand
            existingFromLog.setToStand(request.getToStand()); // Set to stand
            existingFromLog.setTimestamp(LocalDateTime.now()); // Update timestamp
            auditLogRepository.save(existingFromLog);
        } else {
            // If no existing entry found for source stand, create new one with updated quantity
            AuditLog fromLog = new AuditLog();
            fromLog.setUsername(user.getUserName());
            fromLog.setRole(user.getRole());
            fromLog.setAction("TRANSFER");
            fromLog.setGlassType(glass.getType());
            fromLog.setQuantity(newFromQuantity); // Set to NEW REMAINING quantity (e.g., 80)
            fromLog.setStandNo(request.getFromStand()); // Source stand
            fromLog.setFromStand(request.getFromStand());
            fromLog.setToStand(request.getToStand());
            fromLog.setHeight(request.getHeight());
            fromLog.setWidth(request.getWidth());
            fromLog.setUnit(request.getUnit());
            fromLog.setShop(shop);
            fromLog.setTimestamp(LocalDateTime.now());
            auditLogRepository.save(fromLog);
        }
        
        // ✅ UPDATE EXISTING AUDIT LOG - Update or create entry for destination stand
        Optional<AuditLog> existingToLogOpt = auditLogRepository
                .findTopByShopAndGlassTypeAndStandNoAndHeightAndWidthOrderByTimestampDesc(
                        shop, glass.getType(), request.getToStand(), 
                        request.getHeight(), request.getWidth());
        
        if (existingToLogOpt.isPresent()) {
            // Update existing entry with new quantity and set action to TRANSFER
            AuditLog existingToLog = existingToLogOpt.get();
            existingToLog.setAction("TRANSFER"); // Set action to TRANSFER
            existingToLog.setQuantity(newToQuantity); // Update quantity to NEW TOTAL quantity (e.g., 10)
            existingToLog.setStandNo(request.getToStand()); // Ensure standNo is correct (destination stand)
            existingToLog.setFromStand(request.getFromStand()); // Set from stand
            existingToLog.setToStand(request.getToStand()); // Set to stand
            existingToLog.setTimestamp(LocalDateTime.now()); // Update timestamp
            auditLogRepository.save(existingToLog);
        } else {
            // Create new entry with TRANSFER action if it doesn't exist
            AuditLog toLog = new AuditLog();
            toLog.setUsername(user.getUserName());
            toLog.setRole(user.getRole());
            toLog.setAction("TRANSFER"); // Set action to TRANSFER
            toLog.setGlassType(glass.getType());
            toLog.setQuantity(newToQuantity); // Set to NEW TOTAL quantity (e.g., 10)
            toLog.setStandNo(request.getToStand()); // Destination stand
            toLog.setFromStand(request.getFromStand()); // Set from stand
            toLog.setToStand(request.getToStand()); // Set to stand
            toLog.setHeight(request.getHeight());
            toLog.setWidth(request.getWidth());
            toLog.setUnit(request.getUnit());
            toLog.setShop(shop);
            toLog.setTimestamp(LocalDateTime.now());
            auditLogRepository.save(toLog);
        }

        // ✅ STOCK HISTORY - Record REMOVE from source stand
        StockHistory fromHistory = new StockHistory();
        fromHistory.setGlassId(glass.getId());
        fromHistory.setStandNo(request.getFromStand());
        fromHistory.setQuantity(request.getQuantity());
        fromHistory.setAction("REMOVE");
        fromHistory.setShop(shop);
        stockHistoryRepository.save(fromHistory);
        
        // ✅ STOCK HISTORY - Record ADD to destination stand
        StockHistory toHistory = new StockHistory();
        toHistory.setGlassId(glass.getId());
        toHistory.setStandNo(request.getToStand());
        toHistory.setQuantity(request.getQuantity());
        toHistory.setAction("ADD");
        toHistory.setShop(shop);
        stockHistoryRepository.save(toHistory);

        return "✅ Stock transferred successfully: " + request.getQuantity() + " units from Stand " + 
               request.getFromStand() + " to Stand " + request.getToStand();
    }


}
