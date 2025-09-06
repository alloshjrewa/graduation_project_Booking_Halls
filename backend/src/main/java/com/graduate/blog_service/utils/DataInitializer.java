package com.graduate.blog_service.utils;

import com.graduate.blog_service.models.Role;
import com.graduate.blog_service.models.User;
import com.graduate.blog_service.repositorys.RoleRepository;
import com.graduate.blog_service.repositorys.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;


import java.util.HashSet;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository adminRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    public DataInitializer(RoleRepository roleRepository, UserRepository adminRepository) {
        this.roleRepository = roleRepository;
        this.adminRepository = adminRepository;

    }

    @Override
    public void run(String... args) throws Exception {

        createRoleIfNotExists("ADMIN");
        createRoleIfNotExists("PROVIDER");
        createRoleIfNotExists("USER");


        if (!adminRepository.existsByEmail("alifares.cr7aa@gmail.com")) {
            User admin = new User();
            admin.setName("admin");
            admin.setEmail("alifares.cr7aa@gmail.com");
            admin.setPassword(passwordEncoder.encode("testtest"));
            admin.setPhone(null);
            admin.setImage(null);
            admin.setIsActive(true);




            adminRepository.save(admin);

            Set<Role> roles = new HashSet<>();
            Role role = roleRepository.findByName("ADMIN");
            roles.add(role);
            admin.setRoles(roles);

            adminRepository.save(admin);
        }
    }

    private void createRoleIfNotExists(String name) {
        if (!roleRepository.existsByName(name)) {
            Role role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }
}