package com.cabgo.controller;

import com.cabgo.dto.request.BookingCreateRequest;
import com.cabgo.dto.request.BookingStatusUpdateRequest;
import com.cabgo.dto.response.ApiResponse;
import com.cabgo.dto.response.BookingResponse;
import com.cabgo.security.UserPrincipal;
import com.cabgo.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @Valid @RequestBody BookingCreateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse booking = bookingService.createBooking(request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking confirmed successfully", booking));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(@PathVariable Long id) {
        BookingResponse booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingByReference(@PathVariable String reference) {
        BookingResponse booking = bookingService.getBookingByReference(reference);
        return ResponseEntity.ok(ApiResponse.ok(booking));
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<BookingResponse> bookings = bookingService.getUserBookings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(bookings));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<BookingResponse>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody BookingStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse booking = bookingService.updateBookingStatus(id, request, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking status updated", booking));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<BookingResponse>> cancelBooking(
            @PathVariable Long id,
            @RequestParam(required = false) String reason,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookingResponse booking = bookingService.cancelBooking(id, reason, userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled", booking));
    }
}
