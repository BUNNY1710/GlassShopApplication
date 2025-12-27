package com.glassshop.ai.entity;


import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
		uniqueConstraints = {
				@UniqueConstraint(columnNames = {"glass_id", "stand_no"})
		}
	)
public class Stock {

	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "glass_id")
    private Glass glass;

    private int standNo;
    private int quantity;
    private int minQuantity;
    
    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;
    
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    
    
    

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
	public Shop getShop() {
		return shop;
	}
	public void setShop(Shop shop) {
		this.shop = shop;
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Glass getGlass() {
		return glass;
	}
	public void setGlass(Glass glass) {
		this.glass = glass;
	}
	
	
	public int getStandNo() {
		return standNo;
	}
	public void setStandNo(int standNo) {
		this.standNo = standNo;
	}
	public int getQuantity() {
		return quantity;
	}
	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}
	public int getMinQuantity() {
		return minQuantity;
	}
	public void setMinQuantity(int minQuantity) {
		this.minQuantity = minQuantity;
	}
    
    
}
