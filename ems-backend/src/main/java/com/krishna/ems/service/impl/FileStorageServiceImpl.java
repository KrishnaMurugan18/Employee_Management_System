package com.krishna.ems.service.impl;

import com.krishna.ems.exception.BadRequestException;
import com.krishna.ems.service.FileStorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Set;
import java.util.UUID;

@Service
public class FileStorageServiceImpl implements FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    private static final Set<String> ALLOWED_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    @Override
    public String store(MultipartFile file, String employeeCode) {
        if (file.isEmpty()) {
            throw new BadRequestException("Uploaded file is empty");
        }
        if (!ALLOWED_TYPES.contains(file.getContentType())) {
            throw new BadRequestException("Only JPEG, PNG, or WEBP images are allowed");
        }

        try {
            Path dirPath = Path.of(uploadDir);
            Files.createDirectories(dirPath);

            String extension = switch (file.getContentType()) {
                case "image/png" -> ".png";
                case "image/webp" -> ".webp";
                default -> ".jpg";
            };
            String filename = employeeCode + "-" + UUID.randomUUID() + extension;
            Path targetPath = dirPath.resolve(filename);

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            return "/uploads/profile-images/" + filename;
        } catch (IOException ex) {
            throw new BadRequestException("Failed to store uploaded file: " + ex.getMessage());
        }
    }
}
