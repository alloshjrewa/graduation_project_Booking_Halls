package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.services.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/dashboard/notification")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/list")
    public String NotificationList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Notification");
        model.addAttribute("notifications", notificationService.getAllNotifications());
        return "notification/list";

    }

    @GetMapping("/detail/{id}")
    public String notificationDetailPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Notification Detail");
        model.addAttribute("notification", notificationService.getNotificationById(id));
        return "notification/detail";
    }

    @GetMapping("/delete/{id}")
    public String deleteNotification(@PathVariable("id") Long id, RedirectAttributes redirectAttributes ){
        notificationService.deleteNotification(id);
        redirectAttributes.addFlashAttribute("success", "Notification Deleted Successfully");
        return "redirect:/dashboard/notification/list";
    }



}
