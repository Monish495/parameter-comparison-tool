package com.itss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.*;

@Service
public class ComparisonService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private EnvironmentService environmentService;

    // ================= STRUCTURE COMPARISON =================
    public void compareAndStore() {

        long start = System.currentTimeMillis();

        jdbcTemplate.update("TRUNCATE TABLE comparison_table");

        String sql = """
            INSERT INTO comparison_table(position, fields, pos_match, compared_data, table_name, created_by, created_date)
            SELECT
                s.position,
                s.field,

                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM target t
                        WHERE t.position = s.position
                        AND t.table_name = s.table_name
                    )
                    THEN 'POS_MATCH'
                    ELSE 'POS_MISMATCH'
                END,

                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM target t
                        WHERE t.position = s.position
                        AND t.table_name = s.table_name
                        AND t.field = s.field
                    )
                    THEN 'MATCH'
                    ELSE 'MISMATCH'
                END,

                s.table_name,
                'SYSTEM',
                CURRENT_TIMESTAMP

            FROM source s
            ORDER BY s.table_name, s.position
        """;

        jdbcTemplate.update(sql);
        
        jdbcTemplate.update("""
        	    INSERT INTO comparison_history
        	    (table_name, position, field_name, pos_match, compared_data, created_at)
        	    SELECT 
        	        table_name,
        	        position,
        	        fields,
        	        pos_match,
        	        compared_data,
        	        CURRENT_TIMESTAMP
        	    FROM comparison_table
        	""");

        // ✅ SUMMARY
        Map<String, Object> summary = jdbcTemplate.queryForMap("""
            SELECT 
                COUNT(*) AS total,
                COUNT(CASE WHEN compared_data = 'MATCH' THEN 1 END) AS matched,
                COUNT(CASE WHEN compared_data = 'MISMATCH' THEN 1 END) AS mismatched,
                COUNT(CASE WHEN compared_data LIKE 'MISSING%' THEN 1 END) AS missing
            FROM comparison_table
        """);

        // ✅ CALCULATE RUNTIME BEFORE INSERT
        long end = System.currentTimeMillis();
        long runtime = end - start;

        // ✅ INSERT WITH runtime_ms
        jdbcTemplate.update("""
            INSERT INTO comparison_runs 
            (user_id, source_env, target_env, table_name, total, matched, mismatched, missing, runtime_ms)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
            7,
            "T24_SOURCE",
            "T24_TARGET",
            "F_STANDARD_SELECTION",
            ((Number) summary.get("total")).intValue(),
            ((Number) summary.get("matched")).intValue(),
            ((Number) summary.get("mismatched")).intValue(),
            ((Number) summary.get("missing")).intValue(),
            runtime   // ✅ CORRECT
        );

        System.out.println("Runtime: " + runtime + " ms");
    }

    public List<Map<String, Object>> getAllComparisons() {
        return jdbcTemplate.queryForList(
                "SELECT * FROM comparison_table ORDER BY table_name, position"
        );
    }

    // ================= VALUE COMPARISON =================
    public List<Map<String, Object>> getValueComparison(
            String recid,
            String table,
            JdbcTemplate sourceJdbc,
            JdbcTemplate targetJdbc) throws Exception {

        String sql = "SELECT xmlrecord FROM public.\"" + table + "\" WHERE recid = ?";

        String sourceJson = sourceJdbc.query(
                sql,
                rs -> rs.next() ? rs.getString("xmlrecord") : null,
                recid
        );

        String targetJson = targetJdbc.query(
                sql,
                rs -> rs.next() ? rs.getString("xmlrecord") : null,
                recid
        );

        ObjectMapper mapper = new ObjectMapper();

        Map<String, Object> sourceMap = sourceJson != null
                ? mapper.readValue(sourceJson, Map.class)
                : new HashMap<>();

        Map<String, Object> targetMap = targetJson != null
                ? mapper.readValue(targetJson, Map.class)
                : new HashMap<>();

        List<Map<String, Object>> fields = jdbcTemplate.queryForList(
                "SELECT position, field FROM source WHERE table_name = ? ORDER BY position",
                table.replace("F_", "").replace("_", ".")
        );

        List<Map<String, Object>> result = new ArrayList<>();

        // 🔥 @ID row
        Map<String, Object> idRow = new HashMap<>();
        idRow.put("position", 0);
        idRow.put("fieldName", "@ID");
        idRow.put("db1_value", recid);
        idRow.put("db2_value", recid);
        idRow.put("status", "MATCH");
        result.add(idRow);

        // 🔥 fields
        for (Map<String, Object> f : fields) {

            int pos = ((Number) f.get("position")).intValue();
            String fieldName = String.valueOf(f.get("field"));

            if (pos <= 0 || "@ID".equalsIgnoreCase(fieldName)) continue;

            String key = String.valueOf(pos);

            String val1 = formatValue(sourceMap.get(key));
            String val2 = formatValue(targetMap.get(key));

            Map<String, Object> row = new HashMap<>();
            row.put("position", pos);
            row.put("fieldName", fieldName);
            row.put("db1_value", val1);
            row.put("db2_value", val2);
            row.put("status", val1.equals(val2) ? "MATCH" : "MISMATCH");

            result.add(row);
        }

        return result;
    }

    // ================= ALL TABLES + RECIDS =================
    public List<Map<String, Object>> getAllValueComparison(
            int sourceEnvId,
            int targetEnvId) {

        List<Map<String, Object>> finalResult = new ArrayList<>();

        JdbcTemplate sourceJdbc = environmentService.getJdbcTemplate(sourceEnvId);
        JdbcTemplate targetJdbc = environmentService.getJdbcTemplate(targetEnvId);

        List<String> tables = sourceJdbc.queryForList("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND LOWER(table_name) LIKE 'f_%'
        """, String.class);

        for (String table : tables) {

            List<String> recids = sourceJdbc.queryForList(
                    "SELECT recid FROM public.\"" + table + "\"",
                    String.class
            );

            for (String recid : recids) {
                try {
                    List<Map<String, Object>> rows =
                            getValueComparison(recid, table, sourceJdbc, targetJdbc);

                    for (Map<String, Object> row : rows) {
                        row.put("table", table);
                        row.put("recid", recid);
                        finalResult.add(row);
                    }

                } catch (Exception ignored) {}
            }
        }

        return finalResult;
    }

    // ================= FORMAT =================
    private String formatValue(Object value) {

        if (value == null) return "-";

        if (value instanceof Collection<?>) {
            Collection<?> list = (Collection<?>) value;

            if (list.isEmpty()) return "-";

            return list.stream()
                    .map(Object::toString)
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("-");
        }

        String str = value.toString().trim();

        if (str.contains(".") && !str.contains(",") && str.length() > 15) {
            return str.replace(".", ", ");
        }

        return str;
    }
    
    public List<Map<String, Object>> getValueComparisonAndStore(
            String recid,
            String table,
            JdbcTemplate sourceJdbc,
            JdbcTemplate targetJdbc) throws Exception {

        long runId = System.currentTimeMillis();

        List<Map<String, Object>> result =
                getValueComparison(recid, table, sourceJdbc, targetJdbc);


        String insertSql = """
            INSERT INTO value_comparison_history
            (run_id, table_name, recid, position, field_name, db1_value, db2_value, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
            """;

        for (Map<String, Object> row : result) {

            try {
                // ✅ SAFE POSITION
                int position = 0;
                Object posObj = row.get("position");

                if (posObj != null) {
                    position = Integer.parseInt(posObj.toString());
                }

                // ✅ SAFE VALUES
                String fieldName = row.get("fieldName") != null ? row.get("fieldName").toString() : "";
                String db1 = row.get("db1_value") != null ? row.get("db1_value").toString() : "";
                String db2 = row.get("db2_value") != null ? row.get("db2_value").toString() : "";
                String status = row.get("status") != null ? row.get("status").toString() : "";

                // 🔍 DEBUG (IMPORTANT)
                System.out.println("INSERTING → " + position + " | " + fieldName);

                // ✅ INSERT
                jdbcTemplate.update(insertSql,
                        runId,
                        table,
                        recid,
                        position,
                        fieldName,
                        db1,
                        db2,
                        status
                );

            } catch (Exception e) {
                // 🔥 THIS PREVENTS 500 ERROR
                System.out.println("ERROR inserting row: " + row);
                e.printStackTrace();
            }
        }

        return result;
    }
    
    
    public void storeAllValueComparisons(int sourceEnvId, int targetEnvId) {

        JdbcTemplate sourceJdbc = environmentService.getJdbcTemplate(sourceEnvId);
        JdbcTemplate targetJdbc = environmentService.getJdbcTemplate(targetEnvId);

        List<String> tables = sourceJdbc.queryForList("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'
            AND LOWER(table_name) LIKE 'f_%'
        """, String.class);

        long runId = System.currentTimeMillis();

        String insertSql = """
            INSERT INTO value_comparison_history
            (run_id, table_name, recid, position, field_name, db1_value, db2_value, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        """;

        for (String table : tables) {

            List<String> recids = sourceJdbc.queryForList(
                    "SELECT recid FROM public.\"" + table + "\"",
                    String.class
            );

            for (String recid : recids) {
                try {
                    List<Map<String, Object>> rows =
                            getValueComparison(recid, table, sourceJdbc, targetJdbc);

                    for (Map<String, Object> row : rows) {

                        int position = Integer.parseInt(row.get("position") + "");
                        String fieldName = row.get("fieldName") + "";
                        String db1 = row.get("db1_value") + "";
                        String db2 = row.get("db2_value") + "";
                        String status = row.get("status") + "";

                        jdbcTemplate.update(insertSql,
                                runId,
                                table,
                                recid,
                                position,
                                fieldName,
                                db1,
                                db2,
                                status
                        );
                    }

                } catch (Exception e) {
                    System.out.println("ERROR: " + table + " | " + recid);
                    e.printStackTrace();
                }
            }
        }

        System.out.println("✅ ALL VALUE COMPARISONS STORED");
    }
}