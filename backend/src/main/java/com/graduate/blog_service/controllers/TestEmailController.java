package com.graduate.blog_service.controllers;

import com.graduate.blog_service.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.thymeleaf.context.Context;

import java.time.LocalDate;

@RestController
@RequestMapping("/test-email")
public class TestEmailController {

    @Autowired
    private EmailService emailService;

    @GetMapping
    public String sendTest() throws Exception {
        Context ctx = new Context();
        ctx.setVariable("name", "Ali");
        ctx.setVariable("date", LocalDate.now().plusDays(3));

        emailService.sendHtmlEmail("alifares.cr7aa@gmail.com", "Test Reminder", "reminder", ctx);
        return "Email sent!";
    }
}
