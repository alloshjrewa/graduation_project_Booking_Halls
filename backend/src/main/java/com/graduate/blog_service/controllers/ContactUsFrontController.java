package com.graduate.blog_service.controllers;

import com.graduate.blog_service.services.ContactUsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/contactUs")
public class ContactUsFrontController {

    @Autowired
    private ContactUsService contactUsService;

    @PostMapping()
    public void contactUs(
            @RequestParam String email,
            @RequestParam String title,
            @RequestParam String message) {

       contactUsService.CreateContactUs(email , title , message);
    }
}
