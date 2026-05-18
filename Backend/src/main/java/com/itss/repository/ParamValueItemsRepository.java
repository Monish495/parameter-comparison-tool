package com.itss.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.itss.model.ParamValueItems;

public interface ParamValueItemsRepository extends JpaRepository<ParamValueItems, Integer> {

    List<ParamValueItems> findByParamId(int paramId);
}