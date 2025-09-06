package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.services.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/dashboard/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;
    @GetMapping("/list")
    public String listBookings(Model model, HttpServletRequest request) {

        model.addAttribute("payments", paymentService.getAllPayments());
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Payments");

        return "payment/list";
    }

}
