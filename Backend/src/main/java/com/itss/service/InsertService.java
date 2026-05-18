package com.itss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class InsertService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void clearTables() {
        jdbcTemplate.update("TRUNCATE TABLE source RESTART IDENTITY");
        jdbcTemplate.update("TRUNCATE TABLE target RESTART IDENTITY");
        jdbcTemplate.update("TRUNCATE TABLE comparison_table RESTART IDENTITY");
    }

    public void insertData(String table, String type, String envName, Map<Long, String> data) {

        String sql;

        if ("SOURCE".equalsIgnoreCase(type)) {
            sql = "INSERT INTO source(position, field, table_name, environment_name) VALUES (?, ?, ?, ?)";
        } else {
            sql = "INSERT INTO target(position, field, table_name, environment_name) VALUES (?, ?, ?, ?)";
        }

        // 🔥 FIX: SORT BEFORE INSERT
        data.entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey())
                .forEach(entry -> {

                    Long position = entry.getKey();
                    String field = entry.getValue();

                    jdbcTemplate.update(sql, position, field, table, envName);
                });
    }
}