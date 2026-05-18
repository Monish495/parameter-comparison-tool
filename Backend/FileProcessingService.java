package com.itss.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.*;

@Service
public class FileProcessingService {

    @Autowired
    private T24Service t24Service;

    @Autowired
    private ParserService parserService;

    @Autowired
    private InsertService insertService;

    @Autowired
    private ComparisonService comparisonService;

    // ================= READ CSV =================
    public List<String> readCsvFromResources() throws Exception {

        List<String> tables = new ArrayList<>();

        InputStream is = new FileInputStream(
        	    System.getProperty("user.dir") + "/uploads/paramtable.csv"
        	);
        BufferedReader br = new BufferedReader(
                new InputStreamReader(is, java.nio.charset.StandardCharsets.UTF_8)
        );

        String line;

        while ((line = br.readLine()) != null) {

            String[] data = line.split(",");

            if (data.length > 1) {
                tables.add(data[1].trim());
            }
        }

        br.close();

        return tables;
    }

    // ================= MAIN PROCESS =================
    public void processCsvDynamic() {

        try {

            System.out.println("🚀 HARD-CODED COMPARISON STARTED");

            // 🔥 Clear old data
            insertService.clearTables();

            List<String> tablesList = readCsvFromResources();
            Set<String> tables = new LinkedHashSet<>(tablesList);

            for (String table : tables) {

                System.out.println("➡️ Processing: " + table);

                String sourceData = t24Service.fetchFromSource(table);
                String targetData = t24Service.fetchFromTarget(table);

                if (sourceData == null && targetData == null) {
                    System.out.println("⚠️ No data found for: " + table);
                    continue;
                }

                // ✅ Parse SOURCE
                Map<Long, String> sourceParsed =
                        parserService.parseT24Json(sourceData, table, "SOURCE");

                // ✅ Parse TARGET
                Map<Long, String> targetParsed =
                        parserService.parseT24Json(targetData, table, "TARGET");

                // ✅ Insert SOURCE
                insertService.insertData(table, "SOURCE", "t24", sourceParsed);

                // ✅ Insert TARGET
                insertService.insertData(table, "TARGET", "t24copy", targetParsed);

                System.out.println("✅ Inserted: " + table);
            }

            // 🔥 Compare ONLY ONCE (VERY IMPORTANT)
            comparisonService.compareAndStore();

            System.out.println("🎯 PROCESS COMPLETED SUCCESSFULLY");

        } catch (Exception e) {
            System.out.println("❌ ERROR in processing:");
            e.printStackTrace();
        }
    }
}