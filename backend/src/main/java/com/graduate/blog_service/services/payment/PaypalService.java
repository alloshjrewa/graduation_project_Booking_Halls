package com.graduate.blog_service.services.payment;

import com.graduate.blog_service.Dto.PaymentRequest.PaypalRequest;
import com.graduate.blog_service.models.*;
import com.graduate.blog_service.models.PaymentHistory;
import com.graduate.blog_service.repositorys.*;
import com.paypal.api.payments.*;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaypalService {
    @Autowired
    private APIContext apiContext;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private DecorRepository decorRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;



    public Payment createPayment(@RequestBody PaypalRequest paypalRequest) throws PayPalRESTException {
        if (paypalRequest.getBookingID() == null) {
            throw new IllegalArgumentException("Booking ID must not be null.");
        }
        System.out.println(paypalRequest );
        if (paypalRequest.getCurrency() == null) {
            throw new IllegalArgumentException("Currency must be provided.");
        }
        float overallTotal = (float) (paypalRequest.getPayedPrice() * 100); // Convert to cents

        Amount amount = new Amount();
        amount.setCurrency(paypalRequest.getCurrency());
        amount.setTotal(String.format(Locale.forLanguageTag(paypalRequest.getCurrency()),"%.2f",overallTotal));
        Transaction transaction = new Transaction();

        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod("PAYPAL");

        Payment payment = new Payment();
        payment.setIntent(paypalRequest.getSource());
        payment.setPayer(payer);
        payment.setTransactions(transactions);


        // Add redirect URLs
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl(paypalRequest.getCancelUrl());
        redirectUrls.setReturnUrl(paypalRequest.getReturnUrl());
        payment.setRedirectUrls(redirectUrls);


        // Create the payment before getting the ID
        Payment createdPayment = payment.create(apiContext);

        Booking booking = bookingRepository.findById(paypalRequest.getBookingID())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if(paypalRequest.getHorror()){
            booking.setStatus(BookingStatus.InProgress);
        }else {
            booking.setStatus(BookingStatus.Completed);
        }
        booking.setTotalPrice(paypalRequest.getTotalPrice());

        List<Services> services = serviceRepository.findAllById(paypalRequest.getService().stream().map(Services::getId).collect(Collectors.toList()));

        booking.setServicesList(services);

        List<Decor> decors = decorRepository.findAllById(paypalRequest.getDecors().stream().map(Decor::getId).collect(Collectors.toList()));

        booking.setDecorList(decors);


        Booking savedBooking = bookingRepository.save(booking);

        // Save booking

        /////////////////////////////////////////////

        com.graduate.blog_service.models.Payment payments = new com.graduate.blog_service.models.Payment();
        payments.setBooking(savedBooking);
        payments.setPaymentMethod(paypalRequest.getPaymentMethod());
        payments.setAmount(paypalRequest.getPayedPrice());
        payments.setCurrency(paypalRequest.getCurrency());
        payments.setTransactionId(paypalRequest.getPayerId()); // Set to null initially
        payments.setClientName(paypalRequest.getClientName());
        payments.setClientEmail(paypalRequest.getClientEmail());
        payments.setHorror(paypalRequest.getHorror());
        payments.setStatus(PaymentStatus.Completed);
        payments.setClientEmail(payments.getClientEmail());
        payments.setClientName(payments.getClientName());
        payments.setCreatedAt(LocalDateTime.now());

        com.graduate.blog_service.models.Payment savedPayment = paymentRepository.save(payments);
        // Save payment history
        com.graduate.blog_service.models.PaymentHistory paymentHistory = new PaymentHistory();
        paymentHistory.setPayment(savedPayment);
        paymentHistory.setUser(booking.getUser());
        paymentHistory.setTimestamp(LocalDateTime.now().toString());
        paymentHistory.setDetails("Payment successful");

        paymentHistoryRepository.save(paymentHistory);

        return payment.create(apiContext);
    }

    public void refundBooking(com.graduate.blog_service.models.Payment payment) throws IOException {
        Booking booking = payment.getBooking();

        if (booking.getTotalPrice() == null) {
            throw new IllegalArgumentException("Total price is null, cannot refund");
        }

        String captureId = payment.getTransactionId(); // Use the capture ID for refunds
        if (captureId == null) {
            throw new IllegalArgumentException("Capture ID not found for booking");
        }

        // Log the capture ID
        System.out.println("Attempting refund for capture ID: " + captureId);

        // Check the horror logic
        if (payment.getHorror() == false) {
            // Determine the refund amount
            double refundAmountValue = booking.getTotalPrice() * 0.7; // Full refund

            try {
                // Create a RefundRequest object
                RefundRequest refundRequest = new RefundRequest();

                // Optionally, set the amount to refund (for partial refunds)
                // If you want to do a full refund, you can skip this part
                Amount amount = new Amount();
                amount.setCurrency(payment.getCurrency()); // Get currency from your Payment model
                amount.setTotal(String.valueOf(refundAmountValue)); // Get amount from your Payment model
                refundRequest.setAmount(amount);

                // Create a Capture object
                Capture capture = new Capture();
                capture.setId(captureId);

                // Refund the capture
                Refund refund = capture.refund(apiContext, refundRequest);

                // Print refund details
                System.out.println("Refund ID: " + refund.getId());
                System.out.println("Refund State: " + refund.getState());
                payment.setStatus(PaymentStatus.Refunded);
                paymentRepository.save(payment);
            } catch (PayPalRESTException e) {
                System.err.println("Error during refund: " + e.getMessage());
                e.printStackTrace();
            }
        }
    }


}