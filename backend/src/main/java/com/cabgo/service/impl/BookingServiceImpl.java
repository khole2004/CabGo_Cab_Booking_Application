package com.cabgo.service.impl;

import com.cabgo.dto.request.BookingCreateRequest;
import com.cabgo.dto.request.BookingStatusUpdateRequest;
import com.cabgo.dto.response.BookingResponse;
import com.cabgo.entity.*;
import com.cabgo.exception.BadRequestException;
import com.cabgo.exception.ResourceNotFoundException;
import com.cabgo.mapper.EntityDtoMapper;
import com.cabgo.repository.*;
import com.cabgo.service.BookingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class BookingServiceImpl implements BookingService {

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final VehicleClassRepository vehicleClassRepository;
    private final PromoCouponRepository promoCouponRepository;
    private final EntityDtoMapper mapper;
    private final Random random = new SecureRandom();

    public BookingServiceImpl(BookingRepository bookingRepository,
                              UserRepository userRepository,
                              DriverRepository driverRepository,
                              VehicleClassRepository vehicleClassRepository,
                              PromoCouponRepository promoCouponRepository,
                              EntityDtoMapper mapper) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.vehicleClassRepository = vehicleClassRepository;
        this.promoCouponRepository = promoCouponRepository;
        this.mapper = mapper;
    }

    @Override
    @Transactional
    public BookingResponse createBooking(BookingCreateRequest request, Long passengerId) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new ResourceNotFoundException("Passenger not found with id: " + passengerId));

        VehicleClass vc = vehicleClassRepository.findByCode(request.getVehicleClassCode())
                .orElseThrow(() -> new ResourceNotFoundException("Invalid vehicle class: " + request.getVehicleClassCode()));

        BigDecimal baseFare = vc.getBaseFare();
        BigDecimal distanceFare = vc.getPerKmRate().multiply(request.getDistanceKm()).setScale(2, RoundingMode.HALF_UP);
        BigDecimal platformFee = new BigDecimal("15.00");
        BigDecimal subTotal = baseFare.add(distanceFare).add(platformFee);
        BigDecimal taxFare = subTotal.multiply(new BigDecimal("0.05")).setScale(2, RoundingMode.HALF_UP);

        BigDecimal discountFare = BigDecimal.ZERO;
        if (request.getPromoCode() != null && !request.getPromoCode().trim().isEmpty()) {
            PromoCoupon coupon = promoCouponRepository.findByCodeIgnoreCaseAndIsActiveTrue(request.getPromoCode().trim())
                    .orElse(null);
            if (coupon != null && subTotal.compareTo(coupon.getMinRideAmount()) >= 0) {
                if ("PERCENTAGE".equalsIgnoreCase(coupon.getDiscountType())) {
                    discountFare = subTotal.multiply(coupon.getDiscountValue().divide(new BigDecimal("100"), 4, RoundingMode.HALF_UP));
                    if (coupon.getMaxDiscount() != null && discountFare.compareTo(coupon.getMaxDiscount()) > 0) {
                        discountFare = coupon.getMaxDiscount();
                    }
                } else {
                    discountFare = coupon.getDiscountValue();
                }
            }
        }

        BigDecimal carbonOffset = request.getCarbonOffsetFee() != null ? request.getCarbonOffsetFee() : BigDecimal.ZERO;
        BigDecimal totalFare = subTotal.add(taxFare).add(carbonOffset).subtract(discountFare);
        if (totalFare.compareTo(BigDecimal.ZERO) < 0) {
            totalFare = BigDecimal.ZERO;
        }

        // Auto-assign first available online driver or default driver
        List<Driver> onlineDrivers = driverRepository.findByIsOnlineTrue();
        Driver assignedDriver = onlineDrivers.stream()
                .filter(d -> request.getVehicleClassCode().equalsIgnoreCase(d.getVehicleClassCode()))
                .findFirst()
                .orElse(onlineDrivers.isEmpty() ? null : onlineDrivers.get(0));

        Booking booking = new Booking();
        booking.setBookingReference("CG-" + (100000 + random.nextInt(900000)));
        booking.setPassenger(passenger);
        booking.setDriver(assignedDriver);
        booking.setVehicleClassCode(vc.getCode());
        booking.setTripType(request.getTripType() != null ? request.getTripType() : "CITY");
        booking.setPickupAddress(request.getPickupAddress());
        booking.setPickupLat(request.getPickupLat());
        booking.setPickupLng(request.getPickupLng());
        booking.setDropoffAddress(request.getDropoffAddress());
        booking.setDropoffLat(request.getDropoffLat());
        booking.setDropoffLng(request.getDropoffLng());
        booking.setDistanceKm(request.getDistanceKm());
        booking.setDurationMinutes(request.getDurationMinutes());
        booking.setBaseFare(baseFare);
        booking.setDistanceFare(distanceFare);
        booking.setPlatformFee(platformFee);
        booking.setTaxFare(taxFare);
        booking.setDiscountFare(discountFare);
        booking.setCarbonOffsetFee(carbonOffset);
        booking.setTotalFare(totalFare);
        booking.setPaymentMethod(request.getPaymentMethod() != null ? request.getPaymentMethod() : "UPI");
        booking.setPaymentStatus("PAID");
        booking.setStatus(assignedDriver != null ? BookingStatus.DRIVER_ARRIVING : BookingStatus.REQUESTED);
        booking.setOtpCode(String.format("%04d", random.nextInt(10000)));

        booking = bookingRepository.save(booking);

        if (assignedDriver != null) {
            assignedDriver.setCurrentStatus("ON_TRIP");
            driverRepository.save(assignedDriver);
        }

        return mapper.toBookingResponse(booking);
    }

    @Override
    public BookingResponse getBookingById(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));
        return mapper.toBookingResponse(booking);
    }

    @Override
    public BookingResponse getBookingByReference(String reference) {
        Booking booking = bookingRepository.findByBookingReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));
        return mapper.toBookingResponse(booking);
    }

    @Override
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByPassengerIdOrderByCreatedAtDesc(userId).stream()
                .map(mapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<BookingResponse> getDriverBookings(Long driverId) {
        return bookingRepository.findByDriverIdOrderByCreatedAtDesc(driverId).stream()
                .map(mapper::toBookingResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public BookingResponse updateBookingStatus(Long id, BookingStatusUpdateRequest request, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        BookingStatus newStatus;
        try {
            newStatus = BookingStatus.valueOf(request.getStatus().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + request.getStatus());
        }

        if (newStatus == BookingStatus.IN_PROGRESS) {
            if (request.getOtpCode() == null || !request.getOtpCode().equals(booking.getOtpCode())) {
                throw new BadRequestException("Invalid passenger OTP code. Trip cannot be started.");
            }
            booking.setStartTime(LocalDateTime.now());
        } else if (newStatus == BookingStatus.COMPLETED) {
            booking.setEndTime(LocalDateTime.now());
            if (booking.getDriver() != null) {
                Driver d = booking.getDriver();
                d.setCurrentStatus("IDLE");
                d.setCompletedTripsToday(d.getCompletedTripsToday() + 1);
                d.setTodayEarnings(d.getTodayEarnings().add(booking.getTotalFare()));
                d.setTotalRides(d.getTotalRides() + 1);
                driverRepository.save(d);
            }
        }

        booking.setStatus(newStatus);
        booking = bookingRepository.save(booking);
        return mapper.toBookingResponse(booking);
    }

    @Override
    @Transactional
    public BookingResponse cancelBooking(Long id, String reason, Long userId) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + id));

        if (booking.getStatus() == BookingStatus.COMPLETED) {
            throw new BadRequestException("Completed bookings cannot be cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancellationReason(reason != null ? reason : "Cancelled by user");

        if (booking.getDriver() != null) {
            Driver d = booking.getDriver();
            d.setCurrentStatus("IDLE");
            driverRepository.save(d);
        }

        booking = bookingRepository.save(booking);
        return mapper.toBookingResponse(booking);
    }
}
