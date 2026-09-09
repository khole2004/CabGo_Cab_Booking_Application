package com.cabgo.dto.request;

import jakarta.validation.constraints.NotBlank;

public class BookingStatusUpdateRequest {
    @NotBlank(message = "Status is required")
    private String status; // DRIVER_ASSIGNED, DRIVER_ARRIVING, IN_PROGRESS, COMPLETED, CANCELLED

    private String otpCode; // Required when transitioning to IN_PROGRESS
    private String cancellationReason;

    public BookingStatusUpdateRequest() {}

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getOtpCode() { return otpCode; }
    public void setOtpCode(String otpCode) { this.otpCode = otpCode; }
    public String getCancellationReason() { return cancellationReason; }
    public void setCancellationReason(String cancellationReason) { this.cancellationReason = cancellationReason; }
}
