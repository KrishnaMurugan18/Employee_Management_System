package com.krishna.ems.service.impl;

import com.krishna.ems.dto.request.DepartmentRequest;
import com.krishna.ems.dto.response.DepartmentResponse;
import com.krishna.ems.entity.Department;
import com.krishna.ems.exception.BadRequestException;
import com.krishna.ems.exception.DuplicateResourceException;
import com.krishna.ems.exception.ResourceNotFoundException;
import com.krishna.ems.mapper.DepartmentMapper;
import com.krishna.ems.repository.DepartmentRepository;
import com.krishna.ems.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    @Transactional
    public DepartmentResponse create(DepartmentRequest request) {
        if (departmentRepository.existsByNameIgnoreCase(request.getName())) {
            throw new DuplicateResourceException("Department '" + request.getName() + "' already exists");
        }
        Department dept = Department.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();
        return departmentMapper.toResponse(departmentRepository.save(dept));
    }

    @Override
    @Transactional
    public DepartmentResponse update(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        departmentRepository.findByNameIgnoreCase(request.getName()).ifPresent(existing -> {
            if (!existing.getId().equals(id)) {
                throw new DuplicateResourceException("Department '" + request.getName() + "' already exists");
            }
        });

        dept.setName(request.getName());
        dept.setDescription(request.getDescription());
        return departmentMapper.toResponse(departmentRepository.save(dept));
    }

    @Override
    @Transactional
    public void delete(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        if (!dept.getEmployees().isEmpty()) {
            throw new BadRequestException("Cannot delete a department with assigned employees. Reassign them first.");
        }
        departmentRepository.delete(dept);
    }

    @Override
    public DepartmentResponse getById(Long id) {
        return departmentRepository.findById(id)
                .map(departmentMapper::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
    }

    @Override
    public List<DepartmentResponse> getAll() {
        return departmentRepository.findAll().stream()
                .map(departmentMapper::toResponse)
                .toList();
    }
}
