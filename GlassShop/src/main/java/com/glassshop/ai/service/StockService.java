
package com.glassshop.ai.service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.glassshop.ai.dto.StockActivityDto;
import com.glassshop.ai.dto.StockUpdateRequest;
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
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private GlassRepository glassRepository;

    @Autowired
    private StockHistoryRepository historyRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    /* ===============================
       ADD / REMOVE STOCK
       =============================== */
    public String updateStock(StockUpdateRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUserName(auth.getName()).orElseThrow();

        // ✅ CRITICAL: User must belong to a shop
        Shop shop = user.getShop();
        if (shop == null) {
            return "❌ User is not linked to any shop";
        }

        /* ---------- GLASS ---------- */
        int thickness;
        try {
            thickness = Integer.parseInt(request.getGlassType().replace("MM", ""));
        } catch (Exception e) {
            return "❌ Invalid glass type";
        }

        Glass glass = glassRepository.findByType(request.getGlassType());
        if (glass == null) {
            glass = new Glass();
            glass.setType(request.getGlassType());
        }

        glass.setThickness(thickness);
        glass.setHeight(request.getHeight());
        glass.setWidth(request.getWidth());
        glass.setUnit(request.getUnit());
        glass = glassRepository.save(glass);

        /* ---------- STOCK ---------- */
        Stock stock = stockRepository
                .findByGlass_Id(glass.getId())
                .orElse(null);

        if (stock == null) {
            stock = new Stock();
            stock.setGlass(glass);
            stock.setStandNo(request.getStandNo());
            stock.setQuantity(0);
            stock.setMinQuantity(5);
            stock.setShop(shop); // ✅ VERY IMPORTANT
        }

        if ("ADD".equalsIgnoreCase(request.getAction())) {
            stock.setQuantity(stock.getQuantity() + request.getQuantity());
        } else if ("REMOVE".equalsIgnoreCase(request.getAction())) {
            if (stock.getQuantity() < request.getQuantity()) {
                return "❌ Not enough stock to remove";
            }
            stock.setQuantity(stock.getQuantity() - request.getQuantity());
        }

        stockRepository.save(stock);

        /* ---------- AUDIT LOG ---------- */
        AuditLog log = new AuditLog();
        log.setUsername(user.getUserName());
        log.setRole(user.getRole());
        log.setAction(request.getAction());
        log.setGlassType(glass.getType());
        log.setQuantity(request.getQuantity());
        log.setStandNo(request.getStandNo());
        log.setHeight(request.getHeight());
        log.setWidth(request.getWidth());
        log.setUnit(request.getUnit());
        log.setTimestamp(LocalDateTime.now());
        log.setShop(shop);

        auditLogRepository.save(log);

        /* ---------- HISTORY (UNDO) ---------- */
        StockHistory history = new StockHistory();
        history.setGlassId(glass.getId());
        history.setStandNo(stock.getStandNo());
        history.setQuantity(request.getQuantity());
        history.setAction(request.getAction());
        history.setShop(shop);

        historyRepository.save(history);

        /* ---------- LOW STOCK EMAIL ---------- */
        if (stock.getQuantity() < stock.getMinQuantity()) {

            try {
                emailService.sendLowStockAlert(
                    shop.getEmail(),   // ✅ SHOP ADMIN EMAIL
                    "LOW STOCK ALERT 🚨\n\n" +
                    "Shop: " + shop.getShopName() + "\n" +
                    "Glass: " + glass.getType() + "\n" +
                    "Stand: " + stock.getStandNo() + "\n" +
                    "Quantity Left: " + stock.getQuantity()
                );
            } catch (Exception e) {
                System.out.println("Email sending failed: " + e.getMessage());
            }
        }


        return "✅ Stock updated successfully";
    }

    /* ===============================
       VIEW STOCK (SHOP ISOLATED)
       =============================== */
    public List<Stock> getAllStock() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUserName(auth.getName()).orElseThrow();

        if (user.getShop() == null) {
            throw new RuntimeException("User has no shop assigned");
        }

        return stockRepository.findByShopId(user.getShop().getId());
    }
    
    public String getLowStockData() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        User user =
                userRepository.findByUserName(auth.getName()).orElseThrow();

        Shop shop = user.getShop();
        if (shop == null) {
            return "No shop assigned";
        }

        List<Stock> stocks =
                stockRepository.findLowStockByShopId(shop.getId());

        if (stocks.isEmpty()) {
            return "No glass is currently low in stock.";
        }

        StringBuilder sb = new StringBuilder();

        for (Stock s : stocks) {
            sb.append("Glass: ")
              .append(s.getGlass().getType())
              .append(", Qty: ")
              .append(s.getQuantity())
              .append(", Stand: ")
              .append(s.getStandNo())
              .append("\n");
        }

        return sb.toString();
    }
    
    public String getAvailableStock(String glassType) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        User user =
                userRepository.findByUserName(auth.getName()).orElseThrow();

        Shop shop = user.getShop();
        if (shop == null) {
            return "No shop assigned";
        }

        List<Stock> stocks;

        if (glassType == null || glassType.isEmpty()) {
            stocks = stockRepository.findByShopId(shop.getId());
        } else {
            stocks = stockRepository
                    .findByShopId(shop.getId());
        }

        if (stocks.isEmpty()) {
            return "No stock available.";
        }

        StringBuilder sb = new StringBuilder();

        for (Stock s : stocks) {
            sb.append("Glass: ")
              .append(s.getGlass().getType())
              .append(", Thickness: ")
              .append(s.getGlass().getThickness())
              .append("mm, Qty: ")
              .append(s.getQuantity())
              .append("\n");
        }

        return sb.toString();
    }
    
    public String undoLastAction() {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        User user = userRepository
                .findByUserName(auth.getName())
                .orElseThrow();

        Shop shop = user.getShop();

        // ✅ Find last action ONLY for this shop
        StockHistory last = historyRepository
                .findTopByShopIdOrderByCreatedAtDesc(shop.getId());

        if (last == null) {
            return "❌ No action to undo";
        }

        Stock stock = stockRepository
                .findByGlass_Id(last.getGlassId())
                .orElseThrow();

        if ("ADD".equalsIgnoreCase(last.getAction())) {
            if (stock.getQuantity() < last.getQuantity()) {
                return "❌ Cannot undo. Stock already changed.";
            }
            stock.setQuantity(stock.getQuantity() - last.getQuantity());
        }
        else if ("REMOVE".equalsIgnoreCase(last.getAction())) {
            stock.setQuantity(stock.getQuantity() + last.getQuantity());
        }

        stockRepository.save(stock);
        historyRepository.delete(last);

        return "✅ Last action undone successfully";
    }


    public List<StockActivityDto> getRecentStockActivity(int limit) {

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        String username = auth.getName();

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Shop shop = user.getShop();
        if (shop == null) {
            return List.of();
        }

        return auditLogRepository
                .findTop3ByShopOrderByTimestampDesc(shop)
                .stream()
                .map(log -> new StockActivityDto(
                        log.getUsername(),
                        log.getAction(),
                        log.getGlassType(),
                        log.getQuantity(),
                        log.getStandNo(),
                        log.getTimestamp()
                ))
                .toList();
    }




}
