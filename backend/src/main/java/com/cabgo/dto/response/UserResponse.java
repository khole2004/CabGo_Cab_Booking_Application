package com.cabgo.dto.response;

import java.math.BigDecimal;

public class UserResponse {
    private Long id;
    private String email;
    private String fullName;
    private String phoneNumber;
    private String role;
    private String avatarUrl;
    private BigDecimal walletBalance;
    private BigDecimal rating;
    private DriverResponse driverProfile;

    public UserResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public BigDecimal getWalletBalance() { return walletBalance; }
    public void setWalletBalance(BigDecimal walletBalance) { this.walletBalance = walletBalance; }
    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }
    public DriverResponse getDriverProfile() { return driverProfile; }
    public void setDriverProfile(DriverResponse driverProfile) { this.driverProfile = driverProfile; }
}
