package com.glassshop.ai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glassshop.ai.entity.AuditLog;
import com.glassshop.ai.entity.User;
import com.glassshop.ai.repository.AuditLogRepository;
import com.glassshop.ai.repository.UserRepository;
@RestController
@RequestMapping("/audit")
@PreAuthorize("hasRole('ADMIN')")
public class AuditController {

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/recent")
    public List<AuditLog> recentLogs(Authentication authentication) {

        // ✅ Get logged-in admin
        User admin = userRepository
                .findByUserName(authentication.getName())
                .orElseThrow();

        // ✅ Ensure shop exists
        if (admin.getShop() == null) {
            throw new RuntimeException("Admin has no shop assigned");
        }

        // ✅ FETCH ONLY THIS SHOP'S LOGS
        return auditLogRepository
                .findTop10ByShopIdOrderByTimestampDesc(
                        admin.getShop().getId()
                );
    }
}
