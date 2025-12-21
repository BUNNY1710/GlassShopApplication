package com.glassshop.ai.dto;

public class StockUpdateRequest {

    private String glassType;
    private int standNo;
    private int quantity;
    private String action;

    private int height;
    private int width;
    private String unit;

    // ===== GETTERS & SETTERS =====

    public String getGlassType() {
        return glassType;
    }

    public void setGlassType(String glassType) {
        this.glassType = glassType;
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

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }

    public int getWidth() {
        return width;
    }

    public void setWidth(int width) {
        this.width = width;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
