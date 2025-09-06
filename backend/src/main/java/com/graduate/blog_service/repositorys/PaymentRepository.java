package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {


    List<Payment> findByBookingIdAndHorror(Long bookingId, Boolean horror);

    /// ////////////////////dashboard////////////////////

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p")
    double sumAllPayments();

    @Query("SELECT COALESCE(SUM(p.amount), 0) " +
            "FROM Payment p " +
            "WHERE p.createdAt BETWEEN :start AND :end")
    double getTotalPaymentBetween(@Param("start") LocalDateTime start,
                                  @Param("end") LocalDateTime end);
}
