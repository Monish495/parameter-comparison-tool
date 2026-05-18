package com.itss.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itss.model.Role;
import com.itss.model.User;
import com.itss.repository.RoleRepository;
import com.itss.repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

//    @Autowired
//    private RoleRepository roleRepository;

    // CREATE USER
    @Autowired
    private RoleRepository roleRepo;

    public User createUser(User user) {

        // 🔥 FETCH ROLE FROM DB
        Role role = roleRepo.findById(user.getRole().getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        user.setRole(role);

        return repo.save(user);
    }

    // GET ALL USERS
    public List<User> getAllUsers() {
        return repo.findAll();
    }

    // GET USER BY ID
    public User getUserById(int id) {
        return repo.findById(id).orElse(null);
    }

    // UPDATE USER
    public User updateUser(int id, User user) {

        User existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existing.setUserName(user.getUserName());
        existing.setPassword(user.getPassword());
        existing.setFullName(user.getFullName());
        existing.setEmail(user.getEmail());

        Role role = roleRepo.findById(user.getRole().getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        existing.setRole(role);

        return repo.save(existing);
    }

    // DELETE USER
    public void deleteUser(int id) {
        repo.deleteById(id);
    }
    
    public User findByUserName(String userName) {
        return repo.findByUserName(userName);
    }
    
    
    
}