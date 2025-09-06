package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.Dto.decorDto.DecorDto;
import com.graduate.blog_service.Dto.decorDto.UpdatedDecor;
import com.graduate.blog_service.exceptions.DecorAlreadyExistsException;
import com.graduate.blog_service.services.DecorService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.HashMap;
import java.util.Map;

@Controller
@RequestMapping("/dashboard/decor")
public class DecorController {

    @Autowired
    private DecorService decorService;

    @GetMapping("/list")
    public String getDecorList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Decor");
        model.addAttribute("decors", decorService.getAllDecors());
        return "decor/list";

    }

    @GetMapping("/create")
    public String createDecor(@ModelAttribute("decor") DecorDto decorDto, HttpServletRequest request, Model model) {
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Create New Decor");
        return "decor/create";
    }

    @PostMapping("/store")
    public String storeDecor(@Valid @ModelAttribute("decor") DecorDto decorDto,
                            @RequestParam("images") MultipartFile[] images,
                            BindingResult bindingResult,
                            RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            System.out.println("Validation errors: " + bindingResult.getAllErrors()); // Debugging
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("decor", decorDto);
            return "redirect:/dashboard/decor/create";
        }

        try {
            decorService.createDecor(decorDto, images);
            redirectAttributes.addFlashAttribute("success", "Decor Created Successfully");
            return "redirect:/dashboard/decor/list";
        } catch (DecorAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("decorError", e.getMessage());
            redirectAttributes.addFlashAttribute("decor", decorDto);
            return "redirect:/dashboard/decor/create";
        }
    }

    @GetMapping("/edit/{id}")
    public String editDecorPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Update Decor");
        model.addAttribute("updatedDecor", decorService.getDecorById(id));

        return "decor/edit";
    }
    @PostMapping("/update/{id}")
    public String updateDecor(
            @PathVariable Long id,
            @ModelAttribute @Valid UpdatedDecor updatedDecor,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.updatedDecor", bindingResult);
            redirectAttributes.addFlashAttribute("updatedDecor", updatedDecor);
            return "redirect:/dashboard/decor/edit/" + id;
        }

        try {
            decorService.updateDecor(id, updatedDecor);
            redirectAttributes.addFlashAttribute("success", "Decor updated successfully");
            return "redirect:/dashboard/decor/list"; // Change to your list page
        } catch (DecorAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("decorError", e.getMessage());
            return "redirect:/dashboard/decor/edit/" + id;
        }
    }

    @GetMapping("/delete/{id}")
    public String deleteHall(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        decorService.deleteDecor(id);
        redirectAttributes.addFlashAttribute("success", "Decor Deleted Successfully");
        return "redirect:/dashboard/decor/list";
    }

}
