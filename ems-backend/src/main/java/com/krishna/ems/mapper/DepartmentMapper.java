package com.krishna.ems.mapper;

import com.krishna.ems.dto.response.DepartmentResponse;
import com.krishna.ems.entity.Department;
import org.springframework.stereotype.Component;

@Component
public class DepartmentMapper {

    public DepartmentResponse toResponse(Department d) {
        return DepartmentResponse.builder()
                .id(d.getId())
                .name(d.getName())
                .description(d.getDescription())
                .employeeCount(d.getEmployees() != null ? d.getEmployees().size() : 0)
                .build();
    }
}
