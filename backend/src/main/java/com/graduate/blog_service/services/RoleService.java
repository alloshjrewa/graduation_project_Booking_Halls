package com.graduate.blog_service.services;

import com.graduate.blog_service.Dto.RoleDto;
import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.mapper.RoleMapper;
import com.graduate.blog_service.models.Role;
import com.graduate.blog_service.repositorys.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    private final RoleMapper roleMapper;

    public String createRole(RoleDto roleDto) {
        Role role = roleMapper.toEntity(roleDto);
        roleRepository.save(role);
        return "Role Created Successfully";
    }

    public RoleDto getRoleById(Long id) {
        Role role = roleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role" , " id " , id));
        return roleMapper.toDto(role);
    }
    public String updateRole(RoleDto roleDto, Long id) {
        Role role1 = roleRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Role" , " id " , id));
        role1.setName(roleDto.roleName());
        roleRepository.save(role1);

        return "Role Updated Successfully";
    }

    public List<RoleDto> getAllRoles() {
        return roleRepository.findAll().stream().map(roleMapper::toDto).toList();
    }

    @Transactional
    public String deleteRole(Long id) {
        boolean exists = roleRepository.findById(id).isPresent();
        System.out.println("Checking if role exists...");
        if (exists) {
            roleRepository.deleteById(id);
            System.out.println("Role deleted successfully.");
            return "Role Deleted Successfully";
        } else {
            System.out.println("Role not found.");
            throw new ResourceNotFoundException("Role", "id", id);
        }
}}
