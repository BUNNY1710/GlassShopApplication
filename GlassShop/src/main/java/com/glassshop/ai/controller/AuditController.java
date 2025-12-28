package com.glassshop.ai.controller;

import java.io.IOException;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.glassshop.ai.entity.AuditLog;
import com.glassshop.ai.entity.Shop;
import com.glassshop.ai.entity.User;
import com.glassshop.ai.repository.AuditLogRepository;
import com.glassshop.ai.repository.UserRepository;

import jakarta.servlet.http.HttpServletResponse;
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

        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        // ✅ no auth / anonymous
        if (auth == null || !auth.isAuthenticated()
                || "anonymousUser".equals(auth.getName())) {
            return List.of();
        }

        String username = auth.getName();

        User user = userRepository.findByUserName(username).orElse(null);

        // ✅ user deleted / token stale
        if (user == null) {
            return List.of();
        }

        Shop shop = user.getShop();
        if (shop == null) {
            return List.of();
        }

        return auditLogRepository
                .findByShopOrderByTimestampDesc(shop);
    }

    
//    @GetMapping("/audit/download")
//    @PreAuthorize("hasRole('ADMIN')")
//    public void downloadAuditLog(HttpServletResponse response) throws IOException {
//
//        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
//        User user = userRepository.findByUserName(auth.getName()).orElseThrow();
//
//        List<AuditLog> logs =
//                auditLogRepository.findByShopOrderByTimestampDesc(user.getShop());
//
//        response.setContentType("text/csv");
//        response.setHeader(
//                "Content-Disposition",
//                "attachment; filename=audit-log-report.csv"
//        );
//
//        CSVPrinter csvPrinter = new CSVPrinter(
//                response.getWriter(),
//                CSVFormat.DEFAULT.withHeader(
//                        "Username",
//                        "Role",
//                        "Action",
//                        "Glass Type",
//                        "Quantity",
//                        "Stand No",
//                        "Height",
//                        "Width",
//                        "Unit",
//                        "Date"
//                )
//        );
//
//        for (AuditLog log : logs) {
//            csvPrinter.printRecord(
//                    log.getUsername(),
//                    log.getRole(),
//                    log.getAction(),
//                    log.getGlassType(),
//                    log.getQuantity(),
//                    log.getStandNo(),
//                    log.getHeight(),
//                    log.getWidth(),
//                    log.getUnit(),
//                    log.getTimestamp()
//            );
//        }
//
//        csvPrinter.flush();
//    }
//

}
