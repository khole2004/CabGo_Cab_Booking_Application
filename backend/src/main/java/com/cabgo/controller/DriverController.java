package com.cabgo.controller;

import com.cabgo.dto.request.DriverStatusUpdateRequest;
import com.cabgo.dto.response.ApiResponse;
import com.cabgo.dto.response.BookingResponse;
import com.cabgo.dto.response.DriverResponse;
import com.cabgo.security.UserPrincipal;
import com.cabgo.service.DriverService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
public class DriverController {

    private final DriverService driverService;

    public DriverController(DriverService driverService) {
        this.driverService = driverService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<DriverResponse>> getCurrentDriver(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DriverResponse driver = driverService.getDriverByUserId(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(driver));
    }

    @PatchMapping("/status")
    public ResponseEntity<ApiResponse<DriverResponse>> updateDriverStatus(
            @RequestBody DriverStatusUpdateRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DriverResponse driver = driverService.updateDriverStatus(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Driver status updated", driver));
    }

    @GetMapping("/online")
    public ResponseEntity<ApiResponse<List<DriverResponse>>> getOnlineDrivers() {
        List<DriverResponse> drivers = driverService.getOnlineDrivers();
        return ResponseEntity.ok(ApiResponse.ok(drivers));
    }

    @GetMapping("/incoming-requests")
    public ResponseEntity<ApiResponse<List<BookingResponse>>> getIncomingRequests(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        DriverResponse driver = driverService.getDriverByUserId(userPrincipal.getId());
        List<BookingResponse> requests = driverService.getAvailableOrIncomingTrips(driver.getId());
        return ResponseEntity.ok(ApiResponse.ok(requests));
    }
}
