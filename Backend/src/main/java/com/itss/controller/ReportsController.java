package com.itss.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletResponse;

import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class ReportsController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/reports/structure")
    public List<Map<String, Object>> getStructure(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String table,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String field) {

        int offset = page * size;

        StringBuilder sql = new StringBuilder("""
            SELECT *
            FROM comparison_history
            WHERE created_at >= ?::timestamp
              AND created_at <= ?::timestamp
        """);

        List<Object> params = new ArrayList<>();
        params.add(from + " 00:00:00");
        params.add(to + " 23:59:59");

        // 🔍 TABLE FILTER
        if (table != null && !table.isEmpty()) {
            sql.append(" AND table_name = ?");
            params.add(table);
        }

        // 🔍 STATUS FILTER
        if (status != null && !status.isEmpty()) {
            sql.append(" AND compared_data = ?");
            params.add(status);
        }

        // 🔍 FIELD FILTER
        if (field != null && !field.isEmpty()) {
            sql.append(" AND field_name ILIKE ?");
            params.add("%" + field + "%");
        }

        // ✅ KEEP DB ORDER (IMPORTANT)
        sql.append(" ORDER BY id ASC LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
    
    @GetMapping("/reports/export")
    public void exportAllReports(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) String structureTable,
            @RequestParam(required = false) String structureStatus,
            @RequestParam(required = false) String structureField,
            @RequestParam(required = false) String valueTable,
            @RequestParam(required = false) String valueStatus,
            @RequestParam(required = false) String recid,
            HttpServletResponse response) {

        try {
            response.setContentType("text/csv");
            response.setHeader("Content-Disposition", "attachment; filename=report.csv");

            PrintWriter writer = response.getWriter();

            // ================= STRUCTURE =================
            List<Map<String, Object>> structure = jdbcTemplate.queryForList("""
                SELECT 
                    '' AS recid,
                    table_name,
                    position,
                    field_name,
                    '' AS db1_value,
                    '' AS db2_value,
                    compared_data AS status,
                    created_at
                FROM comparison_history
                WHERE created_at >= ?::timestamp
                  AND created_at <= ?::timestamp
                ORDER BY id ASC
            """, from + " 00:00:00", to + " 23:59:59");

            // 🔹 STRUCTURE HEADER
            writer.println("===== STRUCTURE HISTORY =====");
            writer.println("TABLE,POSITION,FIELD,STATUS,DATE");

            for (Map<String, Object> row : structure) {
                writer.println(
                        csv(row.get("table_name")) + ","
                        + csv(row.get("position")) + ","
                        + csv(row.get("field_name")) + ","
                        + csv(row.get("status")) + ","
                        + csv(formatDate(row.get("created_at")))   // ✅ FIX
                );
            }

            // 🔹 EMPTY LINE
            writer.println("");

            // ================= VALUE =================
            List<Map<String, Object>> value = jdbcTemplate.queryForList("""
                SELECT recid, table_name, position, field_name,
                       db1_value, db2_value, status, created_at
                FROM value_comparison_history
                WHERE created_at >= ?::timestamp
                  AND created_at <= ?::timestamp
                ORDER BY id ASC
            """, from + " 00:00:00", to + " 23:59:59");

            // 🔹 VALUE HEADER
            writer.println("===== VALUE COMPARISON HISTORY =====");
            writer.println("RECID,TABLE,POSITION,FIELD,DB1,DB2,STATUS,DATE");

            for (Map<String, Object> row : value) {
                writer.println(
                        csv(row.get("recid")) + ","
                        + csv(row.get("table_name")) + ","
                        + csv(row.get("position")) + ","
                        + csv(row.get("field_name")) + ","
                        + csv(row.get("db1_value")) + ","
                        + csv(row.get("db2_value")) + ","
                        + csv(row.get("status")) + ","
                        + csv(formatDate(row.get("created_at")))   // ✅ FIX
                );
            }

            writer.flush();
            writer.close();

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
    private String formatDate(Object date) {
        if (date == null) return "";

        String str = date.toString().replace("T", " ");

        // remove milliseconds
        if (str.contains(".")) {
            str = str.substring(0, str.indexOf("."));
        }

        // convert to DD-MM-YYYY HH:mm:ss
        String[] parts = str.split(" ");
        String[] d = parts[0].split("-");

        String formatted = d[2] + "-" + d[1] + "-" + d[0] + " " + parts[1];

        // 🔥 FORCE TEXT IN EXCEL
        return "=\"" + formatted + "\"";
    }
    
    private String csv(Object value) {
        if (value == null) return "";
        String str = value.toString().replace("\"", "\"\"");
        return "\"" + str + "\"";
    }
    
}