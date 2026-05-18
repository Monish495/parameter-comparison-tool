package com.itss.service;
 
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
 
import java.util.LinkedHashMap;
import java.util.Map;
 
@Service
public class ParserService {
 
	public Map<Long, String> parseT24Json(String json, String tableName, String envName) {
 
    	Map<Long, String> result = new LinkedHashMap<>();
 
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(json);
 
            // ✅ GET ARRAYS
            JsonNode fieldsNode = root.get("1");
            JsonNode positionsNode = root.get("3");
 
            if (fieldsNode == null || positionsNode == null) {
                return result;
            }
 
            // ✅ LOOP THROUGH ARRAY
            for (int i = 0; i < fieldsNode.size(); i++) {
 
                String field = fieldsNode.get(i).asText();
                Long position = positionsNode.get(i).asLong();
 
                // ❌ IGNORE ONLY @ID
                if ("@ID".equalsIgnoreCase(field)) {
                    continue;
                }
 
                // ✅ STORE position -> field
                result.put(position, field);
            }
 
        } catch (Exception e) {
            e.printStackTrace();
        }
 
        return result;
    }
}
 