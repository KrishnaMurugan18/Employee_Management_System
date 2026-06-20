package com.krishna.ems.service.impl;

import com.krishna.ems.dto.response.EmployeeResponse;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.List;

@Service
public class ExcelExportService {

    private static final String[] HEADERS = {
            "Employee Code", "First Name", "Last Name", "Email", "Phone",
            "Department", "Designation", "Salary", "Joining Date", "Status"
    };

    public byte[] exportEmployees(List<EmployeeResponse> employees) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Employees");

            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < HEADERS.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(HEADERS[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 1;
            for (EmployeeResponse e : employees) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(e.getEmployeeCode());
                row.createCell(1).setCellValue(e.getFirstName());
                row.createCell(2).setCellValue(e.getLastName());
                row.createCell(3).setCellValue(e.getEmail());
                row.createCell(4).setCellValue(e.getPhoneNumber() != null ? e.getPhoneNumber() : "");
                row.createCell(5).setCellValue(e.getDepartmentName() != null ? e.getDepartmentName() : "");
                row.createCell(6).setCellValue(e.getDesignation() != null ? e.getDesignation() : "");
                row.createCell(7).setCellValue(e.getSalary() != null ? e.getSalary().doubleValue() : 0);
                row.createCell(8).setCellValue(e.getJoiningDate() != null ? e.getJoiningDate().toString() : "");
                row.createCell(9).setCellValue(e.getStatus());
            }

            for (int i = 0; i < HEADERS.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out.toByteArray();
        } catch (IOException ex) {
            throw new UncheckedIOException("Failed to generate Excel export", ex);
        }
    }
}
