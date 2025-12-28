package com.glassshop.ai.entity;

import jakarta.persistence.*;

@Entity
public class Glass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;          // 5MM, 8MM, 10MM
    private int thickness;

    // ✅ STORE EXACT USER INPUT (26 1/4, 18 3/8, etc.)
//    private String height;
//    private String width;

    // ✅ UNIT: MM / INCH / FEET
    private String unit;

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

//    public String getHeight() {
//        return height;
//    }
//
//    public void setHeight(String height) {
//        this.height = height;
//    }
//
//    public String getWidth() {
//        return width;
//    }
//
//    public void setWidth(String width) {
//        this.width = width;
//    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }
}
