package com.itss.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary() {

        String sql = """
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN compared_data = 'MATCH' THEN 1 END) AS matched,
                COUNT(CASE WHEN compared_data = 'MISMATCH' THEN 1 END) AS mismatched,
                COUNT(CASE WHEN compared_data LIKE 'MISSING%' THEN 1 END) AS missing
            FROM comparison_table
        """;

        Map<String, Object> dbResult = jdbcTemplate.queryForMap(sql);

        Map<String, Object> result = new HashMap<>();
        result.put("total", ((Number) dbResult.get("total")).intValue());
        result.put("matched", ((Number) dbResult.get("matched")).intValue());
        result.put("mismatched", ((Number) dbResult.get("mismatched")).intValue());
        result.put("missing", ((Number) dbResult.get("missing")).intValue());

        return result;
    }
    
    @GetMapping("/env-count")
    public Map<String, Integer> getEnvironmentCount() {

        int count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM environments ",
            Integer.class
        );

        Map<String, Integer> result = new HashMap<>();
        result.put("envCount", count);

        return result;
    }	
    
    @GetMapping("/comparison-count")
    public Map<String, Integer> getComparisonCount() {

        int count = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM comparison_runs",
            Integer.class
        );

        return Map.of("count", count);
    }
    
    
    @GetMapping("/recent-runs")
    public List<Map<String, Object>> getRecentRuns() {

        String sql = """
            SELECT run_id, source_env, target_env, table_name,
                   total, matched, mismatched, missing, created_at, runtime_ms
            FROM comparison_runs
            ORDER BY run_id DESC
            LIMIT 5
        """;

        return jdbcTemplate.queryForList(sql);
    }
    
}