package com.graduate.blog_service.services.payment;

import com.graduate.blog_service.Dto.PaymentRequest.StripeRequest;
import com.graduate.blog_service.models.*;
import com.graduate.blog_service.repositorys.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class StripeService {
    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private PaymentHistoryRepository paymentHistoryRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private DecorRepository decorRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Transactional
    public Map<String, Object> createPaymentIntent(StripeRequest stripeRequest) throws Exception {
        System.out.println(stripeRequest );
        if (stripeRequest.getSource() == null || stripeRequest.getSource().isEmpty()) {
            throw new IllegalArgumentException("Source token must be provided.");
        }
        if (stripeRequest.getCurrency() == null) {
            throw new IllegalArgumentException("Currency must be provided.");
        }

        long overallTotal = (long) stripeRequest.getPayedPrice();

        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(overallTotal * 100)
                .setCurrency(stripeRequest.getCurrency())
                .setDescription("Booking for " + stripeRequest.getClientName())
                .setReceiptEmail(stripeRequest.getClientEmail())
                .setPaymentMethod(stripeRequest.getSource()) // Pass the PaymentMethod ID
                .putMetadata("services", stripeRequest.getService().toString())
                .putMetadata("decorations", stripeRequest.getDecors().toString())
                .build();

        // Update the booking status to completed
        Booking booking = bookingRepository.findById(stripeRequest.getBookingID())
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if(stripeRequest.getHorror()){
            booking.setStatus(BookingStatus.InProgress);
        }else {
            booking.setStatus(BookingStatus.Completed);
        }
        booking.setTotalPrice(stripeRequest.getTotalPrice());

        List<Services> services = serviceRepository.findAllById(stripeRequest.getService().stream().map(Services::getId).collect(Collectors.toList()));

        booking.setServicesList(services);

        List<Decor> decors = decorRepository.findAllById(stripeRequest.getDecors().stream().map(Decor::getId).collect(Collectors.toList()));

        booking.setDecorList(decors);


        Booking savedBooking = bookingRepository.save(booking);

        // Save booking

        /////////////////////////////////////////////
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        Payment payment = new Payment();
        payment.setBooking(savedBooking);
        payment.setPaymentMethod(stripeRequest.getPaymentMethod());
        payment.setAmount(stripeRequest.getPayedPrice());
        payment.setCurrency(stripeRequest.getCurrency());
        payment.setTransactionId(paymentIntent.getId());
        payment.setClientName(stripeRequest.getClientName());
        payment.setClientEmail(stripeRequest.getClientEmail());
        payment.setHorror(stripeRequest.getHorror());
        payment.setStatus(PaymentStatus.Completed);
        payment.setCreatedAt(LocalDateTime.now());
        Payment savedPayment = paymentRepository.save(payment);
        // Save payment history
        PaymentHistory paymentHistory = new PaymentHistory();
        paymentHistory.setPayment(savedPayment);
        paymentHistory.setUser(booking.getUser());
        paymentHistory.setTimestamp(LocalDateTime.now().toString());
        paymentHistory.setDetails("Payment successful");

        paymentHistoryRepository.save(paymentHistory);

        Map<String, Object> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        return response;
    }
    @Transactional
    public void refundBooking(Payment payment) throws StripeException {
        Booking booking = payment.getBooking();

        if (booking.getTotalPrice() == null) {
            throw new IllegalArgumentException("Total price is null, cannot refund");
        }

        String paymentIntentId = payment.getTransactionId(); // Assuming transaction id is stored here
        if (paymentIntentId == null) {
            throw new IllegalArgumentException("PaymentIntent ID not found for booking");
        }
        if (payment.getHorror() == false) {
            try {
                Stripe.apiKey = System.getenv("STRIPE_SECRET_KEY");// Replace with your secret key

                // 1. Retrieve the PaymentIntent
                PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);

                // 2. Get the Charge ID from the PaymentIntent
                String chargeId = paymentIntent.getLatestCharge();

                // 3. Retrieve the Charge object
                Charge charge = Charge.retrieve(chargeId);

                // 4. Calculate the maximum refundable amount
                long maxRefundableAmount = charge.getAmount() - charge.getAmountRefunded();

                // 5. Calculate the intended refund amount (70% of total price)
                long intendedRefundAmount = (long) (booking.getTotalPrice() * 0.7 * 100);

                // 6. Adjust the refund amount if it exceeds the maximum
                long refundAmount = Math.min(intendedRefundAmount, maxRefundableAmount);

                if (refundAmount <= 0) {
                    throw new IllegalArgumentException("No amount available to refund.");
                }

                // 7. Create Refund parameters
                RefundCreateParams params = RefundCreateParams.builder()
                        .setPaymentIntent(paymentIntentId)
                        .setAmount(refundAmount)
                        .build();

                // 8. Create the Refund
                Refund refund = Refund.create(params);

                // Update booking status to "Cancelled" in your database
                booking.setStatus(BookingStatus.Cancelled);
                bookingRepository.save(booking);
                payment.setStatus(PaymentStatus.Refunded);
                paymentRepository.save(payment);

            } catch (StripeException e) {
                System.err.println("Error during refund: " + e.getMessage());
                e.printStackTrace();
                throw e; // Re-throw the exception
            } catch (IllegalArgumentException e) {
                System.err.println("Error: " + e.getMessage());
                throw e; // Re-throw the exception
            }
        }
    }
}