package com.glassshop.ai.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.glassshop.ai.entity.AuditLog;
import com.glassshop.ai.entity.Shop;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

	List<AuditLog> findTop10ByShopIdOrderByTimestampDesc(Long shopId);

	List<AuditLog> findByShop(Shop shop);
	
	List<AuditLog> findTop3ByShopIdOrderByTimestampDesc(Long shopId);
	
	List<AuditLog> findTop3ByShopOrderByTimestampDesc(Shop shop);

}
