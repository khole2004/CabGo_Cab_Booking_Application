package com.cabgo.service;

import com.cabgo.dto.request.DriverStatusUpdateRequest;
import com.cabgo.dto.response.BookingResponse;
import com.cabgo.dto.response.DriverResponse;

import java.util.List;

public interface DriverService {
    DriverResponse getDriverProfile(Long driverId);
    DriverResponse getDriverByUserId(Long userId);
    DriverResponse updateDriverStatus(Long userId, DriverStatusUpdateRequest request);
    List<DriverResponse> getOnlineDrivers();
    List<BookingResponse> getAvailableOrIncomingTrips(Long driverId);
}
