package com.graduate.blog_service.Dto.bookingDto;


import lombok.Data;

import java.io.Serializable;
import java.util.Date;
@Data
public class BookingRequest implements Serializable {
    private Date BookingDate;
    private Date eventDate;
    private Date startTime; // Start time of the booking
    private Date endTime; // End time of the booking

    private Long hallId;


    private String email;
    private String clientName;
    private String phone;
    private String eventType;

    private String status;

}
