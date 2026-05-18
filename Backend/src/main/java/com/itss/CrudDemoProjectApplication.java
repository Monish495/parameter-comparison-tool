package com.itss;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@EnableAsync
@SpringBootApplication
public class CrudDemoProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(CrudDemoProjectApplication.class, args);
    }
}