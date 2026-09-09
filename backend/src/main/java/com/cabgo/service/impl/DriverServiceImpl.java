package com.cabgo.service.impl;

import com.cabgo.dto.request.DriverStatusUpdateRequest;
import com.cabgo.dto.response.BookingResponse;
import com.cabgo.dto.response.DriverResponse;
import com.cabgo.entity.Booking;
import com.cabgo.entity.BookingStatus;
import com.cabgo.entity.Driver;
import com.cabgo.exception.ResourceNotFoundException;
import com.cabgo.mapper.EntityDtoMapper;
import com.cabgo.repository.BookingRepository;
import com.cabgo.repository.DriverRepository;
import com.cabgo.service.DriverService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DriverServiceImpl implements DriverService {

    private final DriverRepository driverRepository;
    private final BookingRepository bookingRepository;
    private final EntityDtoMapper mapper;

    public DriverServiceImpl(DriverRepository driverRepository,
                             BookingRepository bookingRepository,
                             EntityDtoMapper mapper) {
        this.driverRepository = driverRepository;
        this.bookingRepository = bookingRepository;
        this.mapper = mapper;
    }

    @Override
    public DriverResponse getDriverProfile(Long driverId) {
        Driver driver = driverRepository.findById(driverId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver not found with id: " + driverId));
        return mapper.toDriverResponse(driver);
    }

    @Override
    public DriverResponse getDriverByUserId(Long userId) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found for user: " + userId));
        return mapper.toDriverResponse(driver);
    }

    @Override
    @Transactional
    public DriverResponse updateDriverStatus(Long userId, DriverStatusUpdateRequest request) {
        Driver driver = driverRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Driver profile not found for user: " + userId));

        if (request.getIsOnline() != null) {
            driver.setIsOnline(request.getIsOnline());
            if (!request.getIsOnline()) {
                driver.setCurrentStatus("OFFLINE");
            } else if ("OFFLINE".equals(driver.getCurrentStatus())) {
                driver.setCurrentStatus("IDLE");
            }
        }
        if (request.getCurrentStatus() != null) {
            driver.setCurrentStatus(request.getCurrentStatus());
        }
        if (request.getCurrentLatitude() != null) {
            driver.setCurrentLatitude(request.getCurrentLatitude());
        }
        if (request.getCurrentLongitude() != null) {
            driver.setCurrentLongitude(request.getCurrentLongitude());
        }

        driver = driverRepository.save(driver);
        return mapper.toDriverResponse(driver);
    }

    @Override
    public List<DriverResponse> getOnlineDrivers() {
        return driverRepository.findByIsOnlineTrue().stream()
                .map(mapper::toDriverResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getAvailableOrIncomingTrips(Long driverId) {
        List<Booking> requested = bookingRepository.findByStatus(BookingStatus.REQUESTED);
        List<Booking> assignedToMe = bookingRepository.findByDriverIdOrderByCreatedAtDesc(driverId).stream()
                .filter(b -> b.getStatus() == BookingStatus.DRIVER_ASSIGNED || b.getStatus() == BookingStatus.DRIVER_ARRIVING || b.getStatus() == BookingStatus.IN_PROGRESS)
                .collect(Collectors.toList());

        assignedToMe.addAll(requested);
        return assignedToMe.stream().map(mapper::toBookingResponse).collect(Collectors.toList());
    }
}
