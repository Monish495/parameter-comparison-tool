package com.itss.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class UploadController {

    private static final String UPLOAD_PATH = "uploads/paramtable.csv";

    @PostMapping("/upload")
    public String uploadCsv(@RequestParam("file") MultipartFile file) {

        try {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";

            File folder = new File(uploadDir);
            if (!folder.exists()) {
                folder.mkdirs(); // ✅ create folder
            }

            File dest = new File(uploadDir + "paramtable.csv");

            file.transferTo(dest);

            System.out.println("✅ File saved at: " + dest.getAbsolutePath());

            return "Upload success";

        } catch (Exception e) {
            e.printStackTrace();
            return "Upload failed";
        }
    }
}