package com.graduate.blog_service.services;

import com.graduate.blog_service.exceptions.ResourceNotFoundException;
import com.graduate.blog_service.models.Notification;
import com.graduate.blog_service.models.User;
import com.graduate.blog_service.repositorys.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public void createNotification(User user, String title, String message) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setTitle(title);
        notification.setMessage(message);
        notificationRepository.save(notification);
    }

    public List<Notification> getAllNotifications(){
        return notificationRepository.findAll();
    }
    public  Notification getNotificationById(Long id){
        return notificationRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Notification" , "id" , id));
    }

    public void deleteNotification(Long id){
        notificationRepository.deleteById(id);
    }

    /// ///////////////////////////front////////////////////////////
    public List<Notification> getUserNotifications(String email) {
        return notificationRepository.findByUserEmailOrderByCreatedAtDesc(email);
    }
    public void DeleteNotification(Long id) {
        Notification notification = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification" , "id" , id));
        notificationRepository.deleteById(id);
    }
}
