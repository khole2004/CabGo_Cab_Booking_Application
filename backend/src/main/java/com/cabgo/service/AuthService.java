package com.cabgo.service;

import com.cabgo.dto.request.LoginRequest;
import com.cabgo.dto.request.RegisterRequest;
import com.cabgo.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
}
