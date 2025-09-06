package com.graduate.blog_service.mapper;

import com.graduate.blog_service.Dto.apriori.BookingItemsDto;
import com.graduate.blog_service.models.Booking;
import com.graduate.blog_service.models.Decor;
import com.graduate.blog_service.models.Services;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class AprioriBookingMapper {
    public BookingItemsDto toBookingItemsDto(Booking booking) {
        List<String> services = booking.getServicesList()
                .stream()
                .map(Services::getName)  // assuming Services has getName()
                .collect(Collectors.toList());

        List<String> decors = booking.getDecorList()
                .stream()
                .map(Decor::getName)  // assuming Decor has getName()
                .collect(Collectors.toList());

        return new BookingItemsDto(services, decors);
    }

    public List<BookingItemsDto> toBookingItemsDtos(List<Booking> bookings) {
        return bookings.stream()
                .map(this::toBookingItemsDto)
                .collect(Collectors.toList());
    }
}
