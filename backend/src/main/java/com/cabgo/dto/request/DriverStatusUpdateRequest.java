package com.cabgo.dto.request;

import java.math.BigDecimal;

public class DriverStatusUpdateRequest {
    private Boolean isOnline;
    private String currentStatus; // IDLE, ON_TRIP, OFFLINE
    private BigDecimal currentLatitude;
    private BigDecimal currentLongitude;

    public DriverStatusUpdateRequest() {}

    public Boolean getIsOnline() { return isOnline; }
    public void setIsOnline(Boolean isOnline) { this.isOnline = isOnline; }
    public String getCurrentStatus() { return currentStatus; }
    public void setCurrentStatus(String currentStatus) { this.currentStatus = currentStatus; }
    public BigDecimal getCurrentLatitude() { return currentLatitude; }
    public void setCurrentLatitude(BigDecimal currentLatitude) { this.currentLatitude = currentLatitude; }
    public BigDecimal getCurrentLongitude() { return currentLongitude; }
    public void setCurrentLongitude(BigDecimal currentLongitude) { this.currentLongitude = currentLongitude; }
}
