package com.itss.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.itss.model.ParamValues;

public interface ParamValuesRepository extends JpaRepository<ParamValues, Integer> {
}