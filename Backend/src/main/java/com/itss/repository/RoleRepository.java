package com.itss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itss.model.Role;

public interface RoleRepository extends JpaRepository<Role, Integer> {

}