package com.krishna.ems.service;

import com.krishna.ems.dto.request.ChangePasswordRequest;

public interface UserService {
    void changePassword(String email, ChangePasswordRequest request);
}
