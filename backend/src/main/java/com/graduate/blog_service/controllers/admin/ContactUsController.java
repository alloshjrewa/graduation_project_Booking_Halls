package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.services.ContactUsService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/dashboard/contact_us")
public class ContactUsController {

    @Autowired
    private ContactUsService contactUsService;

    @GetMapping("/list")
    public String ContactUsList(HttpServletRequest request, Model model) {

        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Contact Us");
        model.addAttribute("contactUs", contactUsService.getAllContactUs());
        return "contact_us/list";

    }

    @GetMapping("/detail/{id}")
    public String notIficationDetailPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Notification Detail");
        model.addAttribute("contactUs", contactUsService.getContactUsById(id));
        return "contact_us/detail";
    }

    @GetMapping("/delete/{id}")
    public String deleteContactUs(@PathVariable("id") Long id, RedirectAttributes redirectAttributes ){
        contactUsService.deleteContactUs(id);
        redirectAttributes.addFlashAttribute("success", "ContactUs Deleted Successfully");
        return "redirect:/dashboard/contact_us/list";
    }



}
