package com.graduate.blog_service.scheduled;

import com.graduate.blog_service.models.Booking;
import com.graduate.blog_service.models.BookingStatus;
import com.graduate.blog_service.repositorys.BookingRepository;
import com.graduate.blog_service.services.EmailService;
import com.graduate.blog_service.services.NotificationService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;

import java.time.*;
import java.util.List;

@Component
public class BookingReminderJob {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    // Run every minute (for testing)
    @Scheduled(cron = "2 0 0 * * ?")
//    @Scheduled(cron = "2 0 10,23 * * ?")
    public void sendReminders() {
        LocalDate today = LocalDate.now();
        LocalDate targetDate = today.plusDays(3);

        // الفترة من اليوم حتى 3 أيام قادمة
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = targetDate.atTime(LocalTime.MAX);

        List<BookingStatus> statuses = List.of(BookingStatus.InProgress, BookingStatus.Pending);

        List<Booking> upcomingBookings = bookingRepository.findBookingsByDateRangeAndStatuses(
                startOfDay,
                endOfDay,
                statuses
        );

        System.out.println("✅ Upcoming bookings in next 3 days:");
        upcomingBookings.forEach(b ->
                System.out.println("Booking " + b.getId() + " at " + b.getStartAt())
        );

        for (Booking booking : upcomingBookings) {
            String email = booking.getUser().getEmail();

            // Prepare template variables
            Context ctx = new Context();
            ctx.setVariable("name", booking.getUser().getName());
            ctx.setVariable("date", booking.getStartAt());

            try {
                emailService.sendHtmlEmail(
                        email,
                        "Reminder for Your Upcoming Booking",
                        "reminder",   // template: resources/templates/email/reminder.html
                        ctx
                );
            } catch (MessagingException e) {
                e.printStackTrace(); // log error
            }

            // Save notification in DB
            notificationService.createNotification(
                    booking.getUser(),
                    "Booking Reminder",
                    "You have a booking on " + booking.getStartAt() +
                            " that is still " + booking.getStatus() + "."
            );
        }
    }
}
