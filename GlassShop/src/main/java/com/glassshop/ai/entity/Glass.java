package com.glassshop.ai.entity;

import jakarta.persistence.*;

@Entity
public class Glass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;       // 5MM, 8MM, manual
    private int thickness;

    // ✅ STORE EXACT NUMBER USER ENTERS
    private Integer height;
    private Integer width;

    // ✅ STORE UNIT SEPARATELY
    private String unit;       // MM / INCH / FEET

    private String glassType;

    public String getGlassType() {
        return glassType;
    }

    /* ===== GETTERS & SETTERS ===== */

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getThickness() {
        return thickness;
    }

    public void setThickness(int thickness) {
        this.thickness = thickness;
    }

    public Integer getHeight() {
        return height;
    }

    public void setHeight(Integer height) {
        this.height = height;
    }

    public Integer getWidth() {
        return width;
    }

    public void setWidth(Integer width) {
        this.width = width;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
