package com.glassshop.ai.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class StockHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long glassId;
    private int standNo;
    private int quantity;
    private String action; // ADD or REMOVE
    
    @ManyToOne
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;


    private LocalDateTime createdAt = LocalDateTime.now();

    /* GETTERS & SETTERS */
    public Long getId() { return id; }

    public Long getGlassId() { return glassId; }
    public void setGlassId(Long glassId) { this.glassId = glassId; }

    public int getStandNo() { return standNo; }
    public void setStandNo(int standNo) { this.standNo = standNo; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    
    

    public Shop getShop() {
		return shop;
	}

	public void setShop(Shop shop) {
		this.shop = shop;
	}

	public LocalDateTime getCreatedAt() { return createdAt; }
}
