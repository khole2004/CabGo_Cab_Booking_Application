package com.cabgo.controller;

import com.cabgo.dto.request.SavedLocationRequest;
import com.cabgo.dto.response.ApiResponse;
import com.cabgo.dto.response.PromoCouponResponse;
import com.cabgo.dto.response.SavedLocationResponse;
import com.cabgo.dto.response.UserResponse;
import com.cabgo.security.UserPrincipal;
import com.cabgo.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = userService.getCurrentUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/saved-locations")
    public ResponseEntity<ApiResponse<List<SavedLocationResponse>>> getSavedLocations(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SavedLocationResponse> locations = userService.getSavedLocations(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.ok(locations));
    }

    @PostMapping("/saved-locations")
    public ResponseEntity<ApiResponse<SavedLocationResponse>> addSavedLocation(
            @Valid @RequestBody SavedLocationRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        SavedLocationResponse location = userService.addSavedLocation(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Location saved successfully", location));
    }

    @DeleteMapping("/saved-locations/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSavedLocation(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        userService.deleteSavedLocation(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok("Location deleted successfully", null));
    }

    @GetMapping("/verify-coupon/{code}")
    public ResponseEntity<ApiResponse<PromoCouponResponse>> verifyCoupon(@PathVariable String code) {
        PromoCouponResponse coupon = userService.verifyPromoCoupon(code);
        return ResponseEntity.ok(ApiResponse.ok("Coupon valid", coupon));
    }
}
