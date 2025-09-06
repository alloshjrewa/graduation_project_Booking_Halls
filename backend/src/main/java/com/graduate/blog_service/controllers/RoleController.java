package com.graduate.blog_service.controllers;

import com.graduate.blog_service.Dto.RoleDto;
import com.graduate.blog_service.services.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor
public class RoleController {

    private final RoleService roleService;

    @PostMapping
    public ResponseEntity<String> createRole (@RequestBody RoleDto roleDto){
        return ResponseEntity.ok().body(roleService.createRole(roleDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoleDto> getRoleById(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(roleService.getRoleById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> UpdateRole (@RequestBody RoleDto role ,@PathVariable("id") Long id){
        return ResponseEntity.ok().body(roleService.updateRole(role , id));
    }

    @GetMapping
    public ResponseEntity<List<RoleDto>> getAllRoles(){
        return ResponseEntity.ok().body(roleService.getAllRoles());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRole(@PathVariable("id") Long id){
        return ResponseEntity.ok().body(roleService.deleteRole(id));
    }
}
