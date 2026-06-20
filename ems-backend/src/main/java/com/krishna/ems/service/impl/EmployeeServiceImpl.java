package com.krishna.ems.service.impl;

import com.krishna.ems.dto.request.EmployeeRequest;
import com.krishna.ems.dto.request.UpdateProfileRequest;
import com.krishna.ems.dto.response.EmployeeResponse;
import com.krishna.ems.dto.response.PageResponse;
import com.krishna.ems.entity.Department;
import com.krishna.ems.entity.Employee;
import com.krishna.ems.entity.EmployeeStatus;
import com.krishna.ems.exception.BadRequestException;
import com.krishna.ems.exception.DuplicateResourceException;
import com.krishna.ems.exception.ResourceNotFoundException;
import com.krishna.ems.mapper.EmployeeMapper;
import com.krishna.ems.repository.DepartmentRepository;
import com.krishna.ems.repository.EmployeeRepository;
import com.krishna.ems.repository.spec.EmployeeSpecification;
import com.krishna.ems.service.AuditLogService;
import com.krishna.ems.service.EmployeeService;
import com.krishna.ems.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;
    private final FileStorageService fileStorageService;
    private final ExcelExportService excelExportService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public EmployeeResponse create(EmployeeRequest request, String performedBy) {
        if (employeeRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An employee with email '" + request.getEmail() + "' already exists");
        }

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        String code = "EMP-" + String.format("%05d", employeeRepository.count() + 1);

        Employee employee = Employee.builder()
                .employeeCode(code)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .department(department)
                .designation(request.getDesignation())
                .salary(request.getSalary())
                .joiningDate(request.getJoiningDate())
                .status(parseStatus(request.getStatus()))
                .build();

        Employee saved = employeeRepository.save(employee);
        auditLogService.log(performedBy, "CREATE_EMPLOYEE", "Employee", saved.getId().toString(),
                "Created employee " + saved.getFullName() + " (" + saved.getEmployeeCode() + ")");

        return employeeMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public EmployeeResponse update(Long id, EmployeeRequest request, String performedBy) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));

        employeeRepository.findByEmail(request.getEmail()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Another employee already uses email '" + request.getEmail() + "'");
            }
        });

        Department department = departmentRepository.findById(request.getDepartmentId())
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setEmail(request.getEmail());
        employee.setPhoneNumber(request.getPhoneNumber());
        employee.setDepartment(department);
        employee.setDesignation(request.getDesignation());
        employee.setSalary(request.getSalary());
        employee.setJoiningDate(request.getJoiningDate());
        if (request.getStatus() != null) {
            employee.setStatus(parseStatus(request.getStatus()));
        }

        Employee saved = employeeRepository.save(employee);
        auditLogService.log(performedBy, "UPDATE_EMPLOYEE", "Employee", saved.getId().toString(),
                "Updated employee " + saved.getFullName() + " (" + saved.getEmployeeCode() + ")");

        return employeeMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(Long id, String performedBy) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
        auditLogService.log(performedBy, "DELETE_EMPLOYEE", "Employee", id.toString(),
                "Deleted employee " + employee.getFullName() + " (" + employee.getEmployeeCode() + ")");
    }

    @Override
    public EmployeeResponse getById(Long id) {
        return employeeRepository.findById(id)
                .map(employeeMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + id));
    }

    @Override
    public PageResponse<EmployeeResponse> search(String search, Long departmentId, EmployeeStatus status,
                                                  int page, int size, String sortBy, String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC,
                sortBy != null && !sortBy.isBlank() ? sortBy : "id");
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<Employee> result = employeeRepository.findAll(
                EmployeeSpecification.filterBy(search, departmentId, status), pageable);

        Page<EmployeeResponse> mapped = result.map(employeeMapper::toResponse);
        return PageResponse.from(mapped);
    }

    @Override
    public EmployeeResponse getMyProfile(String email) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));
        return employeeMapper.toResponse(employee);
    }

    @Override
    @Transactional
    public EmployeeResponse updateMyProfile(String email, UpdateProfileRequest request) {
        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee profile not found"));

        employee.setFirstName(request.getFirstName());
        employee.setLastName(request.getLastName());
        employee.setPhoneNumber(request.getPhoneNumber());

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    @Transactional
    public EmployeeResponse uploadProfileImage(Long employeeId, MultipartFile file) {
        Employee employee = employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id: " + employeeId));

        String url = fileStorageService.store(file, employee.getEmployeeCode());
        employee.setProfileImageUrl(url);

        return employeeMapper.toResponse(employeeRepository.save(employee));
    }

    @Override
    public byte[] exportToExcel(String search, Long departmentId, EmployeeStatus status) {
        var employees = employeeRepository.findAll(EmployeeSpecification.filterBy(search, departmentId, status))
                .stream()
                .map(employeeMapper::toResponse)
                .toList();
        return excelExportService.exportEmployees(employees);
    }

    private EmployeeStatus parseStatus(String status) {
        if (status == null || status.isBlank()) {
            return EmployeeStatus.ACTIVE;
        }
        try {
            return EmployeeStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Invalid status value: " + status + ". Must be ACTIVE or INACTIVE");
        }
    }
}
