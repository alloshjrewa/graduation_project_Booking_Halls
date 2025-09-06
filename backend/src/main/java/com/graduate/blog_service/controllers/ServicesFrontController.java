package com.graduate.blog_service.controllers;

import com.graduate.blog_service.models.Services;
import com.graduate.blog_service.repositorys.ServiceRepository;
import com.graduate.blog_service.services.ServicesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/services")
public class ServicesFrontController {

    @Autowired
    private ServicesService  servicesService;

    @Autowired
    private ServiceRepository serviceRepository;

    @GetMapping()
    public ResponseEntity<?> getAllServices(){

        return ResponseEntity.ok().body(servicesService.getAllServicesFront());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getServiceById(@PathVariable("id") Long id){

        Services service = servicesService.getServiceByIdForFront(id);

        return ResponseEntity.ok().body(service);
    }
}
