package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.services.PaymentHistoryService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
@RequestMapping("/dashboard/history")
public class PaymentHistoryController {

    @Autowired
    private PaymentHistoryService paymentHistoryService;
    @GetMapping("/list")
    public String listBookings(Model model, HttpServletRequest request) {

        model.addAttribute("payments_history", paymentHistoryService.getAllHistory());
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Payments History");

        return "payment_history/list";
    }

}
