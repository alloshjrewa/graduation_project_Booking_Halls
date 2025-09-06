package com.graduate.blog_service.controllers.admin;


import com.graduate.blog_service.models.Booking;
import com.graduate.blog_service.services.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.LocalDate;
import java.util.List;


@Controller
@RequestMapping("/dashboard/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;
    @GetMapping("/list")
    public String listBookings(@RequestParam(required = false) String name,
                               @RequestParam(required = false) String email,
                               @RequestParam(required = false) String phone,
                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startAt,
                               @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endAt,
                               Model model, HttpServletRequest request) {

        boolean hasSearch = (name != null && !name.trim().isEmpty()) ||
                (email != null && !email.trim().isEmpty()) ||
                (phone != null && !phone.trim().isEmpty()) ||
                startAt != null || endAt != null;

        List<Booking> bookings = hasSearch ?
                bookingService.searchBookings(name, email, phone, startAt, endAt) :
                bookingService.getAllBookings();

        model.addAttribute("bookings", bookings);
        model.addAttribute("bookingCount", bookings.size());
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Booking");
        model.addAttribute("name", name);
        model.addAttribute("email", email);
        model.addAttribute("phone", phone);
        model.addAttribute("startAt", startAt);
        model.addAttribute("endAt", endAt);

        return "booking/list";
    }



    @GetMapping("/detail/{id}")
    public String BookingDetailPage(@PathVariable("id") Long id , Model model,HttpServletRequest request){
        model.addAttribute("currentURI", request.getRequestURI());
        model.addAttribute("title", "Booking Detail");
        model.addAttribute("booking", bookingService.getBookingById(id));
        return "booking/detail";
    }

    @GetMapping("/delete/{id}")
    public String deleteBooking(@PathVariable("id") Long id, RedirectAttributes redirectAttributes ){
        bookingService.deleteBooking(id);
        redirectAttributes.addFlashAttribute("success", "Booking Deleted Successfully");
        return "redirect:/dashboard/booking/list";
    }

}
