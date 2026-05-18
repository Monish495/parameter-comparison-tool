package com.itss.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.itss.model.Environment;
import com.itss.service.EnvironmentService;

@RestController
@RequestMapping({"/api/environment", "/environments"})
@CrossOrigin(origins = {"http://localhost:5173", "*"})
public class EnvironmentController {

    @Autowired
    private EnvironmentService service;

    // CREATE
    @PostMapping
    public Environment create(@RequestBody Environment env) {
        return service.create(env);
    }

    // READ ALL
    @GetMapping
    public List<Environment> getAll() {
        return service.getAll();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Environment getById(@PathVariable int id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Environment update(@PathVariable int id, @RequestBody Environment env) {
        return service.update(id, env);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable int id) {
        service.delete(id);
        return "Environment deleted successfully";
    }

    // TEST CONNECTION
    @PostMapping("/test-connection")
    public String testConnection(@RequestBody Environment env) {
        return service.testConnection(env);
    }
}