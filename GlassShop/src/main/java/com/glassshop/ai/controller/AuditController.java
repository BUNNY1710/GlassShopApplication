package com.glassshop.ai.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
    @PreAuthorize("hasRole('ADMIN')")
    public List<AuditLog> recentLogs() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        User admin = userRepository.findByUserName(auth.getName())
                .orElseThrow();

        Long shopId = admin.getShop().getId();

        return auditLogRepository.findTop3ByShopIdOrderByTimestampDesc(shopId);
    }

}
