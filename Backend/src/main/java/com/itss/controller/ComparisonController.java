package com.itss.controller;

import java.util.*;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.itss.service.ComparisonService;
import com.itss.service.EnvironmentService;
import com.itss.service.FileProcessingService;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ComparisonController {

    @Autowired
    private ComparisonService comparisonService;

    @Autowired
    private FileProcessingService fileProcessingService;

    @Autowired
    private EnvironmentService environmentService;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    // ================= STRUCTURE COMPARISON =================

    @PostMapping("/comparison/run")
    public String runComparison() {
        fileProcessingService.processCsvDynamic();
        return "Comparison completed";
    }

    @GetMapping("/comparison/results")
    public List<Map<String, Object>> getResults() {
        return comparisonService.getAllComparisons();
    }

    // ================= VALUE APIs =================

    // ✅ GET TABLES
    @GetMapping("/value/tables")
    public List<String> getTables() {

        JdbcTemplate tempJdbc = new JdbcTemplate(
                new org.springframework.jdbc.datasource.DriverManagerDataSource(
                        "jdbc:postgresql://localhost:5432/t24",
                        "postgres",
                        "admin123"
                )
        );

        String sql = """
                SELECT table_name
                FROM information_schema.tables
                WHERE table_schema = 'public'
                AND LOWER(table_name) LIKE 'f_%'
                ORDER BY table_name
                """;

        return tempJdbc.queryForList(sql, String.class);
    }

    // ✅ GET RECIDS
    @GetMapping("/value/recids/{table}")
    public List<String> getRecids(@PathVariable String table) {

        JdbcTemplate tempJdbc = new JdbcTemplate(
                new org.springframework.jdbc.datasource.DriverManagerDataSource(
                        "jdbc:postgresql://localhost:5432/t24",
                        "postgres",
                        "admin123"
                )
        );

        String sql = "SELECT recid FROM public.\"" + table.toUpperCase() + "\" ORDER BY recid";

        return tempJdbc.queryForList(sql, String.class);
    }

    // ✅ VALUE COMPARISON (SOURCE vs TARGET)
    @GetMapping("/value/compare/{recid}")
    public List<Map<String, Object>> compare(
            @PathVariable String recid,
            @RequestParam String table,
            @RequestParam int sourceEnvId,
            @RequestParam int targetEnvId) throws Exception {

        JdbcTemplate sourceJdbc = environmentService.getJdbcTemplate(sourceEnvId);
        JdbcTemplate targetJdbc = environmentService.getJdbcTemplate(targetEnvId);

        return comparisonService.getValueComparison(
                recid, table, sourceJdbc, targetJdbc
        );
    }

    // ================= EXCEL DOWNLOAD (MULTI SHEET) =================

    @GetMapping("/value/download-excel")
    public void downloadExcel(
            @RequestParam String table,
            @RequestParam int sourceEnvId,
            @RequestParam int targetEnvId,
            HttpServletResponse response) throws Exception {

        response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        response.setHeader("Content-Disposition",
                "attachment; filename=" + table + "_comparison.xlsx");

        Workbook workbook = new XSSFWorkbook();

        JdbcTemplate sourceJdbc = environmentService.getJdbcTemplate(sourceEnvId);
        JdbcTemplate targetJdbc = environmentService.getJdbcTemplate(targetEnvId);

        // 🔥 Get all recids
        String recidSql = "SELECT recid FROM public.\"" + table + "\" ORDER BY recid";
        List<String> recids = sourceJdbc.queryForList(recidSql, String.class);

        for (String recid : recids) {

            Sheet sheet = workbook.createSheet(recid);

            List<Map<String, Object>> rows =
                    comparisonService.getValueComparison(
                            recid, table, sourceJdbc, targetJdbc
                    );

            // HEADER
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Position");
            header.createCell(1).setCellValue("Field");
            header.createCell(2).setCellValue("DB1");
            header.createCell(3).setCellValue("DB2");
            header.createCell(4).setCellValue("Status");

            int rowNum = 1;

            for (Map<String, Object> row : rows) {
                Row r = sheet.createRow(rowNum++);

                r.createCell(0).setCellValue(String.valueOf(row.get("position")));
                r.createCell(1).setCellValue(String.valueOf(row.get("fieldName")));
                r.createCell(2).setCellValue(String.valueOf(row.get("db1_value")));
                r.createCell(3).setCellValue(String.valueOf(row.get("db2_value")));
                r.createCell(4).setCellValue(String.valueOf(row.get("status")));
            }
        }

        workbook.write(response.getOutputStream());
        workbook.close();
    }
    
    @GetMapping("/value/compare-store/{recid}")
    public List<Map<String, Object>> compareAndStore(
            @PathVariable String recid,
            @RequestParam String table,
            @RequestParam int sourceEnvId,
            @RequestParam int targetEnvId) throws Exception {

        JdbcTemplate sourceJdbc = environmentService.getJdbcTemplate(sourceEnvId);
        JdbcTemplate targetJdbc = environmentService.getJdbcTemplate(targetEnvId);

        return comparisonService.getValueComparisonAndStore(
                recid, table, sourceJdbc, targetJdbc
        );
    }
    
    
    @PostMapping("/run-all")
    public String runAllComparison(
            @RequestParam int sourceEnvId,
            @RequestParam int targetEnvId) {

        comparisonService.storeAllValueComparisons(sourceEnvId, targetEnvId);

        return "✅ All value comparisons stored successfully";
    }
    
    @GetMapping("/reports/value")
    public List<Map<String, Object>> getValueReport(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam int page,
            @RequestParam int size,
            @RequestParam(required = false) String table,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String recid) {

        int offset = page * size;

        StringBuilder sql = new StringBuilder("""
            SELECT *
            FROM value_comparison_history
            WHERE created_at >= ?::timestamp
              AND created_at <= ?::timestamp
        """);

        List<Object> params = new ArrayList<>();
        params.add(from + " 00:00:00");
        params.add(to + " 23:59:59");

        if (table != null && !table.isEmpty()) {
            sql.append(" AND table_name = ?");
            params.add(table);
        }

        if (status != null && !status.isEmpty()) {
            sql.append(" AND status = ?");
            params.add(status);
        }

        if (recid != null && !recid.isEmpty()) {
            sql.append(" AND recid LIKE ?");
            params.add("%" + recid + "%");
        }

        sql.append(" ORDER BY run_id DESC, id ASC LIMIT ? OFFSET ?");
        params.add(size);
        params.add(offset);

        return jdbcTemplate.queryForList(sql.toString(), params.toArray());
    }
}