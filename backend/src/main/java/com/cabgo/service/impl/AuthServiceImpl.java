package com.cabgo.service.impl;

import com.cabgo.dto.request.LoginRequest;
import com.cabgo.dto.request.RegisterRequest;
import com.cabgo.dto.response.AuthResponse;
import com.cabgo.entity.Driver;
import com.cabgo.entity.Role;
import com.cabgo.entity.User;
import com.cabgo.exception.BadRequestException;
import com.cabgo.mapper.EntityDtoMapper;
import com.cabgo.repository.DriverRepository;
import com.cabgo.repository.UserRepository;
import com.cabgo.security.JwtUtil;
import com.cabgo.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final DriverRepository driverRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EntityDtoMapper mapper;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           DriverRepository driverRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil,
                           EntityDtoMapper mapper) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.driverRepository = driverRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.mapper = mapper;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getIdentifier(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(authentication);

        User user = userRepository.findByEmail(request.getIdentifier())
                .or(() -> userRepository.findByPhoneNumber(request.getIdentifier()))
                .orElseThrow(() -> new BadRequestException("User not found"));

        Driver driver = null;
        if (user.getRole() == Role.ROLE_DRIVER) {
            driver = driverRepository.findByUserId(user.getId()).orElse(null);
        }

        return new AuthResponse(jwt, mapper.toUserResponse(user, driver));
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already registered: " + request.getEmail());
        }

        if (userRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new BadRequestException("Phone number already registered: " + request.getPhoneNumber());
        }

        Role assignedRole = "ROLE_DRIVER".equalsIgnoreCase(request.getRole()) ? Role.ROLE_DRIVER : Role.ROLE_PASSENGER;

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setRole(assignedRole);
        user.setWalletBalance(new BigDecimal("100.00")); // Welcome bonus
        user = userRepository.save(user);

        Driver driver = null;
        if (assignedRole == Role.ROLE_DRIVER) {
            driver = new Driver();
            driver.setUser(user);
            driver.setLicenseNumber(request.getLicenseNumber() != null ? request.getLicenseNumber() : "DL-PENDING");
            driver.setVehicleModel(request.getVehicleModel() != null ? request.getVehicleModel() : "Sedan Standard");
            driver.setVehiclePlateNumber(request.getVehiclePlateNumber() != null ? request.getVehiclePlateNumber() : "DL 01 XX 0000");
            driver.setVehicleClassCode(request.getVehicleClassCode() != null ? request.getVehicleClassCode() : "SEDAN");
            driver.setIsOnline(true);
            driver.setCurrentStatus("IDLE");
            driver = driverRepository.save(driver);
        }

        String jwt = jwtUtil.generateTokenFromUsername(user.getEmail());
        return new AuthResponse(jwt, mapper.toUserResponse(user, driver));
    }
}
