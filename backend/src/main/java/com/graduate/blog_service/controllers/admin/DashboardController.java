package com.graduate.blog_service.controllers.admin;

import com.graduate.blog_service.services.BookingService;
import com.graduate.blog_service.services.PaymentService;
import com.graduate.blog_service.services.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @GetMapping("/login")
    public String login() {
        return "/auth/login";
    }

    @PostMapping("/login")
    public String auth_login() {
        return "redirect:/dashboard";
    }

    @GetMapping()
    public String dash_board(@RequestParam(value = "year", required = false) Integer year,
                             HttpServletRequest request, Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return "redirect:/dashboard/login";
        } else {
            HttpSession session = request.getSession(true);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            session.setAttribute("user", userDetails);

            Set<String> authorities = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            // Check if user has either admin or provider role
            if (authorities.contains("ROLE_ADMIN") || authorities.contains("ROLE_PROVIDER")) {
                model.addAttribute("currentURI", request.getRequestURI());
                model.addAttribute("title", "Dashboard");
                // Use current year if year param is null
                if (year == null) {
                    year = LocalDate.now().getYear();
                }

                model.addAttribute("year", year);
                model.addAttribute("currentYear", LocalDate.now().getYear());
                model.addAttribute("TotalBooking", bookingService.getTotalBooking());
                model.addAttribute("TodayBooking", bookingService.getTodayBooking());
                model.addAttribute("TotalPayment", paymentService.getTotalPayment());
                model.addAttribute("TodayPayment", paymentService.getTodayPayment());
                model.addAttribute("TotalCustomer", userService.getTotalCustomer());
                model.addAttribute("TodayCustomer", userService.getTodayCustomer());
                model.addAttribute("LatestOrder", bookingService.getLatestBooking());

                // Monthly stats
                List<Long> totalCustomerMonth = new ArrayList<>();
                List<Long> totalBookingMonth = new ArrayList<>();
                List<Double> totalPaymentMonth = new ArrayList<>();
                double totalAmount = 0;

                for (int month = 1; month <= 12; month++) {
                    LocalDate startDate = LocalDate.of(year, month, 1);
                    LocalDate endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());

                    totalCustomerMonth.add(userService.getTotalCustomerMonth(startDate, endDate));
                    totalBookingMonth.add(bookingService.getTotalBookingMonth(startDate, endDate));
                    double payment = paymentService.getTotalPaymentMonth(startDate, endDate);
                    totalPaymentMonth.add(payment);
                    totalAmount += payment;
                }

                model.addAttribute("getTotalCustomerMonth", totalCustomerMonth);
                model.addAttribute("getTotalOrderMonth", totalBookingMonth);
                model.addAttribute("getTotalPaymentMonth", totalPaymentMonth);
                model.addAttribute("totalAmount", totalAmount);

                return "/dashboard";

            } else {
                return "redirect:/dashboard/login?admin"; // Redirect to user dashboard or another page

            }
        }
    }

    @GetMapping({"/logout", "/login?logout"})
    public String logout(HttpServletRequest request, HttpServletResponse response) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            HttpSession session = request.getSession(false); // Get the current session
            if (session != null) {
                session.invalidate(); // Invalidate the session
            }
            // Explicitly set the cookie to be deleted
            Cookie cookie = new Cookie("JSESSIONID", null);
            cookie.setPath("/");
            cookie.setMaxAge(0);
            response.addCookie(cookie);
        }
        return "redirect:/dashboard/login?logout"; // Redirect to login page
    }


}
