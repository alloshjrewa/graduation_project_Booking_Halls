package com.graduate.blog_service.controllers;

import com.graduate.blog_service.models.Decor;
import com.graduate.blog_service.services.DecorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/decors")
public class DecorFrontController {
    @Autowired
    private DecorService decorService;

    @GetMapping
    public ResponseEntity<?> getAllDecors(){
        List<Decor> decors = decorService.getAllDecorsFront();
        return ResponseEntity.ok().body(decors);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getDecorById(@PathVariable("id") Long id){

        Decor decor = decorService.getDecorByIdForFront(id);

        return ResponseEntity.ok().body(decor);
    }
}
