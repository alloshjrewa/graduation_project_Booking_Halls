package com.graduate.blog_service.Dto.bookingDto;

import com.graduate.blog_service.models.BookingStatus;
import com.graduate.blog_service.models.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingFrontDto implements Serializable {

    private Long id;

    private String type;

    private Double hallBookingPrice;

    private Double totalPrice;

    private Date startAt;

    private Date endAt;

    private BookingStatus status;    // Pending , Inprogress , Completed , Cancelled

    private Date createdAt;

}
