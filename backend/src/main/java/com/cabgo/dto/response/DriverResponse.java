package com.cabgo.dto.response;

import java.math.BigDecimal;

public class DriverResponse {
    private Long id;
    private Long userId;
    private String fullName;
    private String avatarUrl;
    private String licenseNumber;
    private String vehicleModel;
    private String vehiclePlateNumber;
    private String vehicleClassCode;
    private Boolean isOnline;
    private String currentStatus;
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;
    private BigDecimal todayEarnings;
    private Integer completedTripsToday;
    private BigDecimal acceptanceRate;
    private BigDecimal rating;
    private Integer totalRides;

    public DriverResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getLicenseNumber() { return licenseNumber; }
    public void setLicenseNumber(String licenseNumber) { this.licenseNumber = licenseNumber; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public String getVehiclePlateNumber() { return vehiclePlateNumber; }
    public void setVehiclePlateNumber(String vehiclePlateNumber) { this.vehiclePlateNumber = vehiclePlateNumber; }
    public String getVehicleClassCode() { return vehicleClassCode; }
    public void setVehicleClassCode(String vehicleClassCode) { this.vehicleClassCode = vehicleClassCode; }
    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }
    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }
    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }
    public BigDecimal getTodayEarnings() { return todayEarnings; }
    public void setTodayEarnings(BigDecimal todayEarnings) { this.todayEarnings = todayEarnings; }
    public Integer getCompletedTripsToday() { return completedTripsToday; }
    public void setCompletedTripsToday(Integer completedTripsToday) { this.completedTripsToday = completedTripsToday; }
    public BigDecimal getAcceptanceRate() { return acceptanceRate; }
    public void setAcceptanceRate(BigDecimal acceptanceRate) { this.acceptanceRate = acceptanceRate; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public Integer getTotalRides() { return totalRides; }
    public void setTotalRides(Integer totalRides) { this.totalRides = totalRides; }
}
