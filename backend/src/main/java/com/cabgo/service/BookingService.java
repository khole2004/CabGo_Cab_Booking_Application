package com.cabgo.service;

import com.cabgo.dto.request.BookingCreateRequest;
import com.cabgo.dto.request.BookingStatusUpdateRequest;
import com.cabgo.dto.response.BookingResponse;

import java.util.List;

public interface BookingService {
    BookingResponse createBooking(BookingCreateRequest request, Long passengerId);
    BookingResponse getBookingById(Long id);
    BookingResponse getBookingByReference(String reference);
    List<BookingResponse> getUserBookings(Long userId);
    List<BookingResponse> getDriverBookings(Long driverId);
    BookingResponse updateBookingStatus(Long id, BookingStatusUpdateRequest request, Long userId);
    BookingResponse cancelBooking(Long id, String reason, Long userId);
}
