package com.itss.model;

import jakarta.persistence.*;

@Entity
@Table(name = "param_values")
public class ParamValues {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "table_name")
    private String tableName;

    // Constructors
    public ParamValues() {}

    public ParamValues(String tableName) {
        this.tableName = tableName;
    }

    // Getters & Setters
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }
}