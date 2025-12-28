package com.glassshop.ai.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class AuditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    
    @Column(nullable = false)
    private String role;

    private String action;        // ADD / REMOVE
    private String glassType;

    private int quantity;
    private int standNo;

    // ✅ NEW FIELDS
    private String height;
    private String width;
    private String unit;
    
    // Price per unit (optional, for tracking actual sale price)
    private Double price;
    
    @ManyToOne
    @JoinColumn(name = "shop_id")
    private Shop shop;

    private LocalDateTime timestamp;
    
    @Column(name = "from_stand")
    private Integer fromStand;

    @Column(name = "to_stand")
    private Integer toStand;



    /* ================= GETTERS & SETTERS ================= */

    
    
    public Long getId() {
        return id;
    }

    public Integer getFromStand() {
		return fromStand;
	}

	public void setFromStand(Integer fromStand) {
		this.fromStand = fromStand;
	}

	public Integer getToStand() {
		return toStand;
	}

	public void setToStand(Integer toStand) {
		this.toStand = toStand;
	}

	public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}

	public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getGlassType() {
        return glassType;
    }

    public void setGlassType(String glassType) {
        this.glassType = glassType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getStandNo() {
        return standNo;
    }

    public void setStandNo(int standNo) {
        this.standNo = standNo;
    }

    public String getHeight() {
        return height;
    }

    public void setHeight(String height) {
        this.height = height;
    }

    public String getWidth() {
        return width;
    }

    public void setWidth(String width) {
        this.width = width;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }
}
