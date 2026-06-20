package com.krishna.ems.service;

import com.krishna.ems.dto.request.EmployeeRequest;
import com.krishna.ems.dto.request.UpdateProfileRequest;
import com.krishna.ems.dto.response.EmployeeResponse;
import com.krishna.ems.dto.response.PageResponse;
import com.krishna.ems.entity.EmployeeStatus;
import org.springframework.web.multipart.MultipartFile;

public interface EmployeeService {

    EmployeeResponse create(EmployeeRequest request, String performedBy);

    EmployeeResponse update(Long id, EmployeeRequest request, String performedBy);

    void delete(Long id, String performedBy);

    EmployeeResponse getById(Long id);

    PageResponse<EmployeeResponse> search(String search, Long departmentId, EmployeeStatus status,
                                           int page, int size, String sortBy, String sortDir);

    EmployeeResponse getMyProfile(String email);

    EmployeeResponse updateMyProfile(String email, UpdateProfileRequest request);

    EmployeeResponse uploadProfileImage(Long employeeId, MultipartFile file);

    byte[] exportToExcel(String search, Long departmentId, EmployeeStatus status);
}
