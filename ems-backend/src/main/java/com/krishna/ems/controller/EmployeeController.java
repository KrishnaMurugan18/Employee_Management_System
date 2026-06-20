package com.krishna.ems.controller;

import com.krishna.ems.dto.request.EmployeeRequest;
import com.krishna.ems.dto.request.UpdateProfileRequest;
import com.krishna.ems.dto.response.ApiResponse;
import com.krishna.ems.dto.response.EmployeeResponse;
import com.krishna.ems.dto.response.PageResponse;
import com.krishna.ems.entity.EmployeeStatus;
import com.krishna.ems.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Employee CRUD, search and self-service operations")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a new employee (Admin only)")
    public ResponseEntity<ApiResponse<EmployeeResponse>> create(@Valid @RequestBody EmployeeRequest request,
                                                                  Authentication auth) {
        EmployeeResponse response = employeeService.create(request, auth.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Employee created successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update an existing employee (Admin only)")
    public ResponseEntity<ApiResponse<EmployeeResponse>> update(@PathVariable Long id,
                                                                  @Valid @RequestBody EmployeeRequest request,
                                                                  Authentication auth) {
        EmployeeResponse response = employeeService.update(id, request, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Employee updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete an employee (Admin only)")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id, Authentication auth) {
        employeeService.delete(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Employee deleted successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get employee details by id")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Employee fetched", employeeService.getById(id)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Search, filter, sort and paginate employees (Admin only)")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> search(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) EmployeeStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        PageResponse<EmployeeResponse> result =
                employeeService.search(search, departmentId, status, page, size, sortBy, sortDir);
        return ResponseEntity.ok(ApiResponse.success("Employees fetched", result));
    }

    @GetMapping("/me")
    @Operation(summary = "Get the logged-in employee's own profile")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getMyProfile(Authentication auth) {
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", employeeService.getMyProfile(auth.getName())));
    }

    @PutMapping("/me")
    @Operation(summary = "Update the logged-in employee's own profile")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateMyProfile(@Valid @RequestBody UpdateProfileRequest request,
                                                                           Authentication auth) {
        EmployeeResponse response = employeeService.updateMyProfile(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PostMapping(value = "/{id}/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload a profile picture for an employee")
    public ResponseEntity<ApiResponse<EmployeeResponse>> uploadImage(@PathVariable Long id,
                                                                       @RequestParam("file") MultipartFile file) {
        EmployeeResponse response = employeeService.uploadProfileImage(id, file);
        return ResponseEntity.ok(ApiResponse.success("Profile image uploaded successfully", response));
    }

    @GetMapping("/export")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Export filtered employee list to an Excel file (Admin only)")
    public ResponseEntity<byte[]> export(@RequestParam(required = false) String search,
                                          @RequestParam(required = false) Long departmentId,
                                          @RequestParam(required = false) EmployeeStatus status) {
        byte[] data = employeeService.exportToExcel(search, departmentId, status);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=employees.xlsx")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(data);
    }
}
