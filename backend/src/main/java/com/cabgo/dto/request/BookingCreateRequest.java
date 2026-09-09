package com.cabgo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class BookingCreateRequest {
    @NotBlank(message = "Vehicle class is required")
    private String vehicleClassCode;

    private String tripType = "CITY";

    @NotBlank(message = "Pickup address is required")
    private String pickupAddress;
    private BigDecimal pickupLat;
    private BigDecimal pickupLng;

    @NotBlank(message = "Dropoff address is required")
    private String dropoffAddress;
    private BigDecimal dropoffLat;
    private BigDecimal dropoffLng;

    @NotNull(message = "Distance is required")
    private BigDecimal distanceKm;

    @NotNull(message = "Duration is required")
    private Integer durationMinutes;

    private BigDecimal carbonOffsetFee = BigDecimal.ZERO;
    private String promoCode;
    private String paymentMethod = "UPI";

    public BookingCreateRequest() {}

    public String getVehicleClassCode() { return vehicleClassCode; }
    public void setVehicleClassCode(String vehicleClassCode) { this.vehicleClassCode = vehicleClassCode; }
    public String getTripType() { return tripType; }
    public void setTripType(String tripType) { this.tripType = tripType; }
    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }
    public BigDecimal getPickupLat() { return pickupLat; }
    public void setPickupLat(BigDecimal pickupLat) { this.pickupLat = pickupLat; }
    public BigDecimal getPickupLng() { return pickupLng; }
    public void setPickupLng(BigDecimal pickupLng) { this.pickupLng = pickupLng; }
    public String getDropoffAddress() { return dropoffAddress; }
    public void setDropoffAddress(String dropoffAddress) { this.dropoffAddress = dropoffAddress; }
    public BigDecimal getDropoffLat() { return dropoffLat; }
    public void setDropoffLat(BigDecimal dropoffLat) { this.dropoffLat = dropoffLat; }
    public BigDecimal getDropoffLng() { return dropoffLng; }
    public void setDropoffLng(BigDecimal dropoffLng) { this.dropoffLng = dropoffLng; }
    public BigDecimal getDistanceKm() { return distanceKm; }
    public void setDistanceKm(BigDecimal distanceKm) { this.distanceKm = distanceKm; }
    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }
    public BigDecimal getCarbonOffsetFee() { return carbonOffsetFee; }
    public void setCarbonOffsetFee(BigDecimal carbonOffsetFee) { this.carbonOffsetFee = carbonOffsetFee; }
    public String getPromoCode() { return promoCode; }
    public void setPromoCode(String promoCode) { this.promoCode = promoCode; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
