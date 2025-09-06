package com.graduate.blog_service.repositorys;

import com.graduate.blog_service.models.Booking;
import com.graduate.blog_service.models.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking , Long> {
    @Query("SELECT b FROM Booking b WHERE b.hall.id = :hallId AND b.startAt < :endAt AND b.endAt > :startAt")
    List<Booking> findOverlappingBookings(@Param("hallId") Long hallId,
                                          @Param("startAt") Date startAt,
                                          @Param("endAt") Date endAt);

    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);


    /// ////////////////////DASHBOARD///////////////////
    long countByCreatedAtBetween(LocalDate start, LocalDate end);
    List<Booking> findTop10ByOrderByCreatedAtDesc();

    /// //////////////////////////////email//////////////////
    @Query("SELECT b FROM Booking b WHERE b.startAt BETWEEN :startDate AND :endDate AND b.status IN :statuses")
    List<Booking> findBookingsByDateRangeAndStatuses(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("statuses") List<BookingStatus> statuses
    );
}
