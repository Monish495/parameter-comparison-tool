package com.itss.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.itss.model.Environment;

public interface EnvironmentRepository extends JpaRepository<Environment, Integer> {
}