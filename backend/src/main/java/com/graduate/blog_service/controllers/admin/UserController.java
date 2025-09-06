package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
@RequestMapping("/dashboard/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public String getUsersList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "User");
        model.addAttribute("users", userService.getAllUsers());
        return "user/list";

    }

    @GetMapping("/delete/{id}")
    public String deleteUser(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        userService.deleteUser(id);
        redirectAttributes.addFlashAttribute("success", "User Deleted Successfully");
        return "redirect:/dashboard/user/list";
    }

}
