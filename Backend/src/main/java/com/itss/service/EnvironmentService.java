package com.itss.service;

import java.util.List;
import java.sql.Connection;
import java.sql.DriverManager;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.stereotype.Service;

import com.itss.model.Environment;
import com.itss.repository.EnvironmentRepository;

@Service
public class EnvironmentService {

    @Autowired
    private EnvironmentRepository repo;

    // ✅ CREATE
    public Environment create(Environment env) {
        return repo.save(env);
    }

    // ✅ GET ALL
    public List<Environment> getAll() {
        return repo.findAll();
    }

    // ✅ GET BY ID
    public Environment getById(int id) {
        return repo.findById(id).orElse(null);
    }

    // ✅ UPDATE
    public Environment update(int id, Environment env) {

        Environment existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Environment not found"));

        existing.setName(env.getName());
        existing.setType(env.getType());
        existing.setDatabaseType(env.getDatabaseType());
        existing.setStatus(env.getStatus());
        existing.setUsername(env.getUsername());
        existing.setPassword(env.getPassword());
        existing.setIpAddress(env.getIpAddress());
        existing.setPort(env.getPort());
        existing.setDatabaseName(env.getDatabaseName());
        existing.setDescription(env.getDescription());

        return repo.save(existing);
    }

    // ✅ DELETE
    public void delete(int id) {
        repo.deleteById(id);
    }

    // ✅ TEST CONNECTION
    public String testConnection(Environment env) {
        try {
            String url = "";

            if (env.getDatabaseType().equalsIgnoreCase("PostgreSQL")) {
                url = "jdbc:postgresql://" + env.getIpAddress() + ":" + env.getPort() + "/" + env.getDatabaseName();
            } else if (env.getDatabaseType().equalsIgnoreCase("MySQL")) {
                url = "jdbc:mysql://" + env.getIpAddress() + ":" + env.getPort() + "/" + env.getDatabaseName();
            } else {
                return "Unsupported DB Type";
            }

            Connection conn = DriverManager.getConnection(
                    url,
                    env.getUsername(),
                    env.getPassword()
            );

            if (conn != null) {
                conn.close();
                return "SUCCESS";
            }

        } catch (Exception e) {
            return e.getMessage();
        }

        return "FAILED";
    }

    // ✅ DYNAMIC DB CONNECTION (IMPORTANT FOR YOUR PROJECT)
    public JdbcTemplate getJdbcTemplate(int envId) {

        Environment env = repo.findById(envId)
                .orElseThrow(() -> new RuntimeException("Environment not found"));

        DriverManagerDataSource ds = new DriverManagerDataSource();

        if (env.getDatabaseType().equalsIgnoreCase("PostgreSQL")) {
            ds.setUrl("jdbc:postgresql://" + env.getIpAddress() + ":" + env.getPort() + "/" + env.getDatabaseName());
        } else if (env.getDatabaseType().equalsIgnoreCase("MySQL")) {
            ds.setUrl("jdbc:mysql://" + env.getIpAddress() + ":" + env.getPort() + "/" + env.getDatabaseName());
        } else {
            throw new RuntimeException("Unsupported DB Type");
        }

        ds.setUsername(env.getUsername());
        ds.setPassword(env.getPassword());

        return new JdbcTemplate(ds);
    }
}