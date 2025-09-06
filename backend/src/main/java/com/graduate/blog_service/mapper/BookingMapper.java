package com.graduate.blog_service.mapper;


import com.graduate.blog_service.Dto.bookingDto.BookingFrontDto;
import com.graduate.blog_service.models.Booking;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    BookingFrontDto toDto(Booking booking);

}