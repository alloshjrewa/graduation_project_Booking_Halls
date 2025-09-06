package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.Dto.servicesDto.ServicesDto;
import com.graduate.blog_service.Dto.servicesDto.UpdatedServicesDto;
import com.graduate.blog_service.exceptions.ServiceAlreadyExistsException;
import com.graduate.blog_service.models.Provider;
import com.graduate.blog_service.repositorys.ProviderRepository;
import com.graduate.blog_service.services.ServicesService;
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
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/dashboard/service")
public class ServicesController {

    @Autowired
    private ServicesService servicesService;

    @Autowired
    private ProviderRepository providerRepository;

    @GetMapping("/list")
    public String getServiceList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Service");
        model.addAttribute("services", servicesService.getAllServices());
        return "service/list";

    }

    @GetMapping("/create")
    public String createService(@ModelAttribute("service") ServicesDto servicesDto, HttpServletRequest request, Model model) {
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Create New Service");
        List<Provider> providers = providerRepository.findAll();
        model.addAttribute("providers", providers);
        return "service/create";
    }

    @PostMapping("/store")
    public String storeService(@Valid @ModelAttribute("service") ServicesDto servicesDto,
                            @RequestParam("images") MultipartFile[] images,
                            BindingResult bindingResult,
                            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            for (FieldError error : bindingResult.getFieldErrors()) {
                errors.put(error.getField(), error.getDefaultMessage());
            }
            redirectAttributes.addFlashAttribute("fieldErrors", errors);
            redirectAttributes.addFlashAttribute("service", servicesDto);
            return "redirect:/dashboard/service/create";
        }

        try {
            servicesService.createService(servicesDto, images);
            redirectAttributes.addFlashAttribute("success", "Service Created Successfully");
            return "redirect:/dashboard/service/list";
        } catch (ServiceAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("serviceError", e.getMessage());
            redirectAttributes.addFlashAttribute("service", servicesDto);
            return "redirect:/dashboard/service/create";
        }
    }

    @GetMapping("/edit/{id}")
    public String editServicePage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Update Service");
        List<Provider> providers = providerRepository.findAll();
        model.addAttribute("providers", providers);
        model.addAttribute("updatedService", servicesService.getServiceById(id));
        return "service/edit";
    }
    @PostMapping("/update/{id}")
    public String updateService(
            @PathVariable Long id,
            @ModelAttribute @Valid UpdatedServicesDto updatedServicesDto,
            BindingResult bindingResult,
            RedirectAttributes redirectAttributes) {

        if (bindingResult.hasErrors()) {
            redirectAttributes.addFlashAttribute("org.springframework.validation.BindingResult.updatedServicesDto", bindingResult);
            redirectAttributes.addFlashAttribute("updatedService", updatedServicesDto);
            return "redirect:/dashboard/service/edit/" + id;
        }

        try {
            servicesService.updateService(id, updatedServicesDto);
            redirectAttributes.addFlashAttribute("success", "Service updated successfully");
            return "redirect:/dashboard/service/list"; // Change to your list page
        } catch (ServiceAlreadyExistsException e) {
            redirectAttributes.addFlashAttribute("serviceError", e.getMessage());
            return "redirect:/dashboard/service/edit/" + id;
        }
    }

    @GetMapping("/delete/{id}")
    public String deleteService(@PathVariable("id") Long id,RedirectAttributes redirectAttributes ){
        servicesService.deleteService(id);
        redirectAttributes.addFlashAttribute("success", "Service Deleted Successfully");
        return "redirect:/dashboard/service/list";
    }

}
