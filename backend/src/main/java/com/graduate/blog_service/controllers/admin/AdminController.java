package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.Dto.adminDto.AdminDto;
import com.graduate.blog_service.Dto.adminDto.UpdateAdminDto;
import com.graduate.blog_service.exceptions.EmailAlreadyExistsException;
import com.graduate.blog_service.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/dashboard/admin")
public class AdminController {

    @Autowired
    private UserService userService;

    @GetMapping("/list")
    public String getAdminList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Admin");
        model.addAttribute("admins", userService.getAllAdmins());
        return "admin/list";

    }

    @GetMapping("/create")
    public String createAdmin(@ModelAttribute("AdminDto") AdminDto adminDto,HttpServletRequest request, Model model) {
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Create New Admin");
        return "admin/create";
    }


    @PostMapping("/store")
    public String store(@Valid @ModelAttribute("AdminDto") AdminDto adminDto, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            // Store the field errors as a Map
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("AdminDto", adminDto);
            return "redirect:/dashboard/admin/create";
        }
        try {
            userService.createAdmin(adminDto);
            redirectAttributes.addFlashAttribute("success", "Admin Created Successfully");
            return "redirect:/dashboard/admin/list";
        } catch (EmailAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("emailError", e.getMessage());
            redirectAttributes.addFlashAttribute("AdminDto", adminDto);
            return "redirect:/dashboard/admin/create"; // Redirect back with error
        }


    }

    @GetMapping("/edit/{id}")
    public String editAdminPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Update Admin");
        model.addAttribute("admin",userService.getAdminById(id));
        return "admin/edit";
    }
    @PostMapping("/update/{id}")
    public String UpdateAdmin(@PathVariable("id") Long id , @Valid @ModelAttribute("AdminDto") UpdateAdminDto updateAdminDto,
                              BindingResult bindingResult, RedirectAttributes redirectAttributes){
        if (bindingResult.hasErrors()) {
            // Store the field errors as a Map
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("AdminDto", updateAdminDto);
            return "redirect:/dashboard/admin/edit/{id}";
        }
        try {
            userService.updateAdmin(updateAdminDto , id);
            redirectAttributes.addFlashAttribute("success", "Admin Created Successfully");
            return "redirect:/dashboard/admin/list";
        } catch (EmailAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("emailError", e.getMessage());
            redirectAttributes.addFlashAttribute("AdminDto", updateAdminDto);
            return "redirect:/dashboard/admin/edit/{id}"; // Redirect back with error
        }catch (IllegalArgumentException exception){
            redirectAttributes.addFlashAttribute("passwordError", exception.getMessage());
            redirectAttributes.addFlashAttribute("AdminDto", updateAdminDto);
            return "redirect:/dashboard/admin/edit/{id}"; // Redirect back with error
        }

    }

    @GetMapping("/delete/{id}")
    public String deleteAdmin(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        userService.deleteAdmin(id);
        redirectAttributes.addFlashAttribute("success", "Admin Deleted Successfully");
        return "redirect:/dashboard/admin/list";
    }

}
