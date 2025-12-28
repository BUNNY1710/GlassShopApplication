package com.glassshop.ai.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.glassshop.ai.dto.StockTransferRequest;
import com.glassshop.ai.entity.AuditLog;
import com.glassshop.ai.entity.Glass;
import com.glassshop.ai.entity.Shop;
import com.glassshop.ai.entity.Stock;
import com.glassshop.ai.entity.User;
import com.glassshop.ai.repository.AuditLogRepository;
import com.glassshop.ai.repository.GlassRepository;
import com.glassshop.ai.repository.StockRepository;
import com.glassshop.ai.repository.UserRepository;

@Service
public class StockTransferService {

    @Autowired private StockRepository stockRepository;
    @Autowired private GlassRepository glassRepository;
    @Autowired private AuditLogRepository auditLogRepository;
    @Autowired private UserRepository userRepository;

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

//        int thickness = Integer.parseInt(request.getGlassType().replace("MM", ""));
        int thickness;
        try {
            thickness = Integer.parseInt(
                request.getGlassType().replaceAll("[^0-9]", "")
            );
        } catch (Exception e) {
            return "❌ Invalid glass type format";
        }


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

        if (fromStock == null || fromStock.getQuantity() < request.getQuantity()) {
            return "❌ Not enough stock in source stand";
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

        fromStock.setQuantity(fromStock.getQuantity() - request.getQuantity());
        toStock.setQuantity(toStock.getQuantity() + request.getQuantity());

        stockRepository.save(fromStock);
        stockRepository.save(toStock);

        // ✅ AUDIT LOG
        AuditLog log = new AuditLog();
        log.setUsername(user.getUserName());
        log.setRole(user.getRole());
        log.setAction("TRANSFER");
        log.setGlassType(glass.getType());
        log.setQuantity(request.getQuantity());
        log.setFromStand(request.getFromStand());
        log.setToStand(request.getToStand());
        log.setHeight(request.getHeight());
        log.setWidth(request.getWidth());
        log.setUnit(request.getUnit());
        log.setShop(shop);
        log.setTimestamp(LocalDateTime.now());

        auditLogRepository.save(log);

        return "✅ Stock transferred successfully";
    }


}
