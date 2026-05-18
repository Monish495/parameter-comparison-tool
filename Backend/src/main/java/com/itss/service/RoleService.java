package com.itss.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.itss.model.Role;
import com.itss.repository.RoleRepository;

@Service
public class RoleService {

    @Autowired
    private RoleRepository repo;

    // CREATE
    public Role createRole(Role role) {
        return repo.save(role);
    }

    // GET ALL
    public List<Role> getAllRoles() {
        return repo.findAll();
    }

    // GET BY ID
    public Role getRoleById(int id) {
        return repo.findById(id).orElse(null);
    }

    // UPDATE
    public Role updateRole(int id, Role roleDetails) {
        Role role = repo.findById(id).orElse(null);

        if (role != null) {
            role.setRoleName(roleDetails.getRoleName());
            role.setRoleDescription(roleDetails.getRoleDescription());
            return repo.save(role);
        }

        return null;
    }

    // DELETE
    public String deleteRole(int id) {
        repo.deleteById(id);
        return "Role deleted successfully";
    }
}