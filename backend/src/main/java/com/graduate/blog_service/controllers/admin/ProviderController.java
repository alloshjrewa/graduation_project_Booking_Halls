package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.Dto.providerDto.ProviderDto;
import com.graduate.blog_service.Dto.providerDto.UpdateProviderDto;
import com.graduate.blog_service.exceptions.EmailAlreadyExistsException;
import com.graduate.blog_service.services.ProviderService;
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
@RequestMapping("/dashboard/provider")
public class ProviderController {

    @Autowired
    private ProviderService providerService;

    @GetMapping("/list")
    public String getProviderList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Provider");
        model.addAttribute("providers", providerService.getAllProviders());
        return "provider/list";

    }

    @GetMapping("/create")
    public String createProvider(HttpServletRequest request, Model model, @ModelAttribute("ProviderDto") ProviderDto providerDto) {
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Create New Provider");
        return "provider/create";
    }


    @PostMapping("/store")
    public String storeProvider(@Valid @ModelAttribute("ProviderDto") ProviderDto providerDto, @RequestParam("images") MultipartFile[] images, BindingResult bindingResult, RedirectAttributes redirectAttributes) {
        if (bindingResult.hasErrors()) {
            // Store the field errors as a Map
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("ProviderDto", providerDto);
            return "redirect:/dashboard/provider/create";
        }
        try {
            providerService.createProvider(providerDto,images);
            redirectAttributes.addFlashAttribute("success", "Provider Created Successfully");
            return "redirect:/dashboard/provider/list";
        } catch (EmailAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("emailError", e.getMessage());
            redirectAttributes.addFlashAttribute("ProviderDto", providerDto);
            return "redirect:/dashboard/provider/create"; // Redirect back with error
        }


    }

    @GetMapping("/edit/{id}")
    public String editProviderPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Update Provider");
        model.addAttribute("provider",providerService.getProviderById(id));
        return "provider/edit";
    }
    @PostMapping("/update/{id}")
    public String UpdateProvider(@PathVariable("id") Long id , @Valid @ModelAttribute("ProviderDto") UpdateProviderDto updateProviderDto,
                                 BindingResult bindingResult, RedirectAttributes redirectAttributes){
        if (bindingResult.hasErrors()) {
            // Store the field errors as a Map
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("ProviderDto", updateProviderDto);
            return "redirect:/dashboard/provider/edit/{id}";
        }
        try {
            providerService.updateProvider(updateProviderDto , id);
            redirectAttributes.addFlashAttribute("success", "Provider Created Successfully");
            return "redirect:/dashboard/provider/list";
        } catch (EmailAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("emailError", e.getMessage());
            redirectAttributes.addFlashAttribute("ProviderDto", updateProviderDto);
            return "redirect:/dashboard/provider/edit/{id}"; // Redirect back with error
        }catch (IllegalArgumentException exception){
            redirectAttributes.addFlashAttribute("passwordError", exception.getMessage());
            redirectAttributes.addFlashAttribute("ProviderDto", updateProviderDto);
            return "redirect:/dashboard/provider/edit/{id}"; // Redirect back with error
        }

    }

    @GetMapping("/delete/{id}")
    public String deleteProvider(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        providerService.deleteProvider(id);
        redirectAttributes.addFlashAttribute("success", "Provider Deleted Successfully");
        return "redirect:/dashboard/provider/list";
    }

}
