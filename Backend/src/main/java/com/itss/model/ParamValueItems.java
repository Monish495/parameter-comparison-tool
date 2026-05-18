package com.itss.model;

import jakarta.persistence.*;

@Entity
@Table(name = "param_value_items")
public class ParamValueItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "param_id")
    private int paramId;

    @Column(name = "value")
    private String value;

    // Constructors
    public ParamValueItems() {}

    public ParamValueItems(int paramId, String value) {
        this.paramId = paramId;
        this.value = value;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getParamId() {
        return paramId;
    }

    public void setParamId(int paramId) {
        this.paramId = paramId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }
}