package com.itss.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.itss.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {

    User findByUserName(String userName);  // 🔥 must match field name
}