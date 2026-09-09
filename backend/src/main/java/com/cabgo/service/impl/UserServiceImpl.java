package com.cabgo.service.impl;

import com.cabgo.dto.request.SavedLocationRequest;
import com.cabgo.dto.response.PromoCouponResponse;
import com.cabgo.dto.response.SavedLocationResponse;
import com.cabgo.dto.response.UserResponse;
import com.cabgo.entity.Driver;
import com.cabgo.entity.PromoCoupon;
import com.cabgo.entity.SavedLocation;
import com.cabgo.entity.User;
import com.cabgo.exception.ResourceNotFoundException;
import com.cabgo.mapper.EntityDtoMapper;
import com.cabgo.repository.DriverRepository;
import com.cabgo.repository.PromoCouponRepository;
import com.cabgo.repository.SavedLocationRepository;
import com.cabgo.repository.UserRepository;
import com.cabgo.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final SavedLocationRepository savedLocationRepository;
    private final PromoCouponRepository promoCouponRepository;
    private final EntityDtoMapper mapper;

    public UserServiceImpl(UserRepository userRepository,
                           DriverRepository driverRepository,
                           SavedLocationRepository savedLocationRepository,
                           PromoCouponRepository promoCouponRepository,
                           EntityDtoMapper mapper) {
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.savedLocationRepository = savedLocationRepository;
        this.promoCouponRepository = promoCouponRepository;
        this.mapper = mapper;
    }

    @Override
    public UserResponse getCurrentUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Driver driver = driverRepository.findByUserId(userId).orElse(null);
        return mapper.toUserResponse(user, driver);
    }

    @Override
    public List<SavedLocationResponse> getSavedLocations(Long userId) {
        return savedLocationRepository.findByUserId(userId).stream()
                .map(mapper::toSavedLocationResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SavedLocationResponse addSavedLocation(Long userId, SavedLocationRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        SavedLocation sl = new SavedLocation();
        sl.setUser(user);
        sl.setTitle(request.getTitle());
        sl.setAddress(request.getAddress());
        sl.setIcon(request.getIcon() != null ? request.getIcon() : "bookmark");
        sl.setLatitude(request.getLatitude());
        sl.setLongitude(request.getLongitude());

        sl = savedLocationRepository.save(sl);
        return mapper.toSavedLocationResponse(sl);
    }

    @Override
    @Transactional
    public void deleteSavedLocation(Long userId, Long locationId) {
        SavedLocation sl = savedLocationRepository.findById(locationId)
                .orElseThrow(() -> new ResourceNotFoundException("Location not found"));
        if (sl.getUser().getId().equals(userId)) {
            savedLocationRepository.delete(sl);
        }
    }

    @Override
    public PromoCouponResponse verifyPromoCoupon(String code) {
        PromoCoupon coupon = promoCouponRepository.findByCodeIgnoreCaseAndIsActiveTrue(code)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid or expired promo coupon code: " + code));
        return mapper.toPromoCouponResponse(coupon);
    }
}
