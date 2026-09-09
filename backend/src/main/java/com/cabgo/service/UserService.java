package com.cabgo.service;

import com.cabgo.dto.request.SavedLocationRequest;
import com.cabgo.dto.response.PromoCouponResponse;
import com.cabgo.dto.response.SavedLocationResponse;
import com.cabgo.dto.response.UserResponse;

import java.util.List;

public interface UserService {
    UserResponse getCurrentUserProfile(Long userId);
    List<SavedLocationResponse> getSavedLocations(Long userId);
    SavedLocationResponse addSavedLocation(Long userId, SavedLocationRequest request);
    void deleteSavedLocation(Long userId, Long locationId);
    PromoCouponResponse verifyPromoCoupon(String code);
}
