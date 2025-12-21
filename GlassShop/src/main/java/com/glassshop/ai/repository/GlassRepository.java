package com.glassshop.ai.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.glassshop.ai.entity.Glass;

public interface GlassRepository extends JpaRepository<Glass, Long> {

	Glass findByType(String type);
}
