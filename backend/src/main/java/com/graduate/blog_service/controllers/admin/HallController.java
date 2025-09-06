package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.Dto.hallDto.HallDto;
import com.graduate.blog_service.Dto.hallDto.UpdatedHall;
import com.graduate.blog_service.exceptions.HallAlreadyExistsException;

import com.graduate.blog_service.services.HallService;
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
@RequestMapping("/dashboard/hall")
public class HallController {

    @Autowired
    private HallService hallService;

    @GetMapping("/list")
    public String getHallList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Hall");
        model.addAttribute("halls", hallService.getAllHalls());
        return "hall/list";

    }

    @GetMapping("/create")
    public String createHall(@ModelAttribute("hall") HallDto hall,HttpServletRequest request, Model model) {
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Create New Hall");
        return "hall/create";
    }

    @PostMapping("/store")
    public String storeHall(@Valid @ModelAttribute("hall") HallDto hall,
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
            redirectAttributes.addFlashAttribute("hall", hall);
            return "redirect:/dashboard/hall/create";
        }

        try {
            hallService.createHall(hall, images);
            redirectAttributes.addFlashAttribute("success", "Hall Created Successfully");
            return "redirect:/dashboard/hall/list";
        } catch (HallAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("hallError", e.getMessage());
            redirectAttributes.addFlashAttribute("hall", hall);
            return "redirect:/dashboard/hall/create";
        }
    }

    @GetMapping("/edit/{id}")
    public String editHallPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Update Hall");
        model.addAttribute("updatedHall", hallService.getHallById(id));
        return "hall/edit";
    }
    @PostMapping("/update/{id}")
    public String updateHall(
            @PathVariable Long id,
            @ModelAttribute @Valid UpdatedHall updatedHall,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.updatedHall", bindingResult);
            redirectAttributes.addFlashAttribute("updatedHall", updatedHall);
            return "redirect:/dashboard/hall/edit/" + id;
        }

        try {
            hallService.updateHall(id, updatedHall);
            redirectAttributes.addFlashAttribute("success", "Hall updated successfully");
            return "redirect:/dashboard/hall/list"; // Change to your list page
        } catch (HallAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("hallError", e.getMessage());
            return "redirect:/dashboard/hall/edit/" + id;
        }
    }

    @GetMapping("/delete/{id}")
    public String deleteHall(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        hallService.deleteHall(id);
        redirectAttributes.addFlashAttribute("success", "Hall Deleted Successfully");
        return "redirect:/dashboard/hall/list";
    }

}
