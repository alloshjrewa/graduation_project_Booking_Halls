package com.graduate.blog_service.controllers;

import com.graduate.blog_service.models.Notification;
import com.graduate.blog_service.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationFrontController {

    @Autowired
    private NotificationService notificationService;

    // Get all notifications for a user
    @GetMapping("/{userEmail}")
    public ResponseEntity<List<Notification>> getUserNotifications(@PathVariable String userEmail) {
        return ResponseEntity.ok().body(notificationService.getUserNotifications(userEmail));
    }


    @DeleteMapping("/{notificationId}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long notificationId) {

        notificationService.DeleteNotification(notificationId);
        return ResponseEntity.ok().build();
    }
}
