package com.cabgo.mapper;

import com.cabgo.dto.response.*;
import com.cabgo.entity.*;
import org.springframework.stereotype.Component;

@Component
public class EntityDtoMapper {

    public UserResponse toUserResponse(User user, Driver driver) {
        if (user == null) return null;
        UserResponse res = new UserResponse();
        res.setId(user.getId());
        res.setEmail(user.getEmail());
        res.setFullName(user.getFullName());
        res.setPhoneNumber(user.getPhoneNumber());
        res.setRole(user.getRole().name());
        res.setAvatarUrl(user.getAvatarUrl());
        res.setWalletBalance(user.getWalletBalance());
        res.setRating(user.getRating());
        if (driver != null) {
            res.setDriverProfile(toDriverResponse(driver));
        }
        return res;
    }

    public DriverResponse toDriverResponse(Driver driver) {
        if (driver == null) return null;
        DriverResponse res = new DriverResponse();
        res.setId(driver.getId());
        if (driver.getUser() != null) {
            res.setUserId(driver.getUser().getId());
            res.setFullName(driver.getUser().getFullName());
            res.setAvatarUrl(driver.getUser().getAvatarUrl());
        }
        res.setLicenseNumber(driver.getLicenseNumber());
        res.setVehicleModel(driver.getVehicleModel());
        res.setVehiclePlateNumber(driver.getVehiclePlateNumber());
        res.setVehicleClassCode(driver.getVehicleClassCode());
        res.setIsOnline(driver.getIsOnline());
        res.setCurrentStatus(driver.getCurrentStatus());
        res.setCurrentLatitude(driver.getCurrentLatitude());
        res.setCurrentLongitude(driver.getCurrentLongitude());
        res.setTodayEarnings(driver.getTodayEarnings());
        res.setCompletedTripsToday(driver.getCompletedTripsToday());
        res.setAcceptanceRate(driver.getAcceptanceRate());
        res.setRating(driver.getRating());
        res.setTotalRides(driver.getTotalRides());
        return res;
    }

    public VehicleClassResponse toVehicleClassResponse(VehicleClass vc) {
        if (vc == null) return null;
        VehicleClassResponse res = new VehicleClassResponse();
        res.setId(vc.getId());
        res.setCode(vc.getCode());
        res.setName(vc.getName());
        res.setDescription(vc.getDescription());
        res.setCapacity(vc.getCapacity());
        res.setBaseFare(vc.getBaseFare());
        res.setPerKmRate(vc.getPerKmRate());
        res.setEtaMinutes(vc.getEtaMinutes());
        res.setIconName(vc.getIconName());
        res.setIsPopular(vc.getIsPopular());
        return res;
    }

    public BookingResponse toBookingResponse(Booking b) {
        if (b == null) return null;
        BookingResponse res = new BookingResponse();
        res.setId(b.getId());
        res.setBookingReference(b.getBookingReference());
        if (b.getPassenger() != null) {
            res.setPassengerId(b.getPassenger().getId());
            res.setPassengerName(b.getPassenger().getFullName());
            res.setPassengerPhone(b.getPassenger().getPhoneNumber());
        }
        if (b.getDriver() != null) {
            res.setDriver(toDriverResponse(b.getDriver()));
        }
        res.setVehicleClassCode(b.getVehicleClassCode());
        res.setTripType(b.getTripType());
        res.setPickupAddress(b.getPickupAddress());
        res.setPickupLat(b.getPickupLat());
        res.setPickupLng(b.getPickupLng());
        res.setDropoffAddress(b.getDropoffAddress());
        res.setDropoffLat(b.getDropoffLat());
        res.setDropoffLng(b.getDropoffLng());
        res.setDistanceKm(b.getDistanceKm());
        res.setDurationMinutes(b.getDurationMinutes());
        res.setBaseFare(b.getBaseFare());
        res.setDistanceFare(b.getDistanceFare());
        res.setPlatformFee(b.getPlatformFee());
        res.setTaxFare(b.getTaxFare());
        res.setDiscountFare(b.getDiscountFare());
        res.setCarbonOffsetFee(b.getCarbonOffsetFee());
        res.setTotalFare(b.getTotalFare());
        res.setPaymentMethod(b.getPaymentMethod());
        res.setPaymentStatus(b.getPaymentStatus());
        res.setStatus(b.getStatus().name());
        res.setOtpCode(b.getOtpCode());
        res.setCreatedAt(b.getCreatedAt());
        return res;
    }

    public PaymentResponse toPaymentResponse(Payment p) {
        if (p == null) return null;
        PaymentResponse res = new PaymentResponse();
        res.setId(p.getId());
        if (p.getBooking() != null) {
            res.setBookingId(p.getBooking().getId());
        }
        res.setTransactionReference(p.getTransactionReference());
        res.setPaymentMethod(p.getPaymentMethod());
        res.setAmount(p.getAmount());
        res.setStatus(p.getStatus());
        res.setCreatedAt(p.getCreatedAt());
        return res;
    }

    public SavedLocationResponse toSavedLocationResponse(SavedLocation sl) {
        if (sl == null) return null;
        SavedLocationResponse res = new SavedLocationResponse();
        res.setId(sl.getId());
        res.setTitle(sl.getTitle());
        res.setAddress(sl.getAddress());
        res.setIcon(sl.getIcon());
        res.setLatitude(sl.getLatitude());
        res.setLongitude(sl.getLongitude());
        return res;
    }

    public PromoCouponResponse toPromoCouponResponse(PromoCoupon pc) {
        if (pc == null) return null;
        PromoCouponResponse res = new PromoCouponResponse();
        res.setId(pc.getId());
        res.setCode(pc.getCode());
        res.setDescription(pc.getDescription());
        res.setDiscountType(pc.getDiscountType());
        res.setDiscountValue(pc.getDiscountValue());
        res.setMinRideAmount(pc.getMinRideAmount());
        res.setMaxDiscount(pc.getMaxDiscount());
        return res;
    }
}
