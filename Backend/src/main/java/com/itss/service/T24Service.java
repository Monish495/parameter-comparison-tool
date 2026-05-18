package com.itss.service;

import org.springframework.stereotype.Service;

import java.sql.*;

@Service
public class T24Service {

    // 🔵 SOURCE → t24
    public String fetchFromSource(String tableName) {

        String url = "jdbc:postgresql://127.0.0.1:5432/t24";
        String username = "postgres";
        String password = "admin123";

        String sql = "SELECT xmlrecord FROM public.\"F_STANDARD_SELECTION\" WHERE LOWER(recid)=LOWER(?)";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            System.out.println("🔵 SOURCE → " + tableName);

            ps.setString(1, tableName);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getString("xmlrecord");
            } else {
                System.out.println("⚠️ SOURCE no data: " + tableName);
            }

        } catch (Exception e) {
            System.out.println("❌ SOURCE ERROR: " + tableName);
            e.printStackTrace();
        }

        return null;
    }

    // 🟢 TARGET → t24copy
    public String fetchFromTarget(String tableName) {

        String url = "jdbc:postgresql://127.0.0.1:5432/t24copy";
        String username = "postgres";
        String password = "admin123";

        String sql = "SELECT xmlrecord FROM public.\"F_STANDARD_SELECTION\" WHERE LOWER(recid)=LOWER(?)";

        try (Connection conn = DriverManager.getConnection(url, username, password);
             PreparedStatement ps = conn.prepareStatement(sql)) {

            System.out.println("🟢 TARGET → " + tableName);

            ps.setString(1, tableName);

            ResultSet rs = ps.executeQuery();

            if (rs.next()) {
                return rs.getString("xmlrecord");
            } else {
                System.out.println("⚠️ TARGET no data: " + tableName);
            }

        } catch (Exception e) {
            System.out.println("❌ TARGET ERROR: " + tableName);
            e.printStackTrace();
        }

        return null;
    }
}