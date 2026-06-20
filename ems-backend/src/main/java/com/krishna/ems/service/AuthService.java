package com.krishna.ems.service;

import com.krishna.ems.dto.request.LoginRequest;
import com.krishna.ems.dto.request.RegisterRequest;
import com.krishna.ems.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refresh(String refreshToken);
}
