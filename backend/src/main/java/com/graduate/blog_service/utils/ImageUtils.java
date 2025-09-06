package com.graduate.blog_service.utils;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;


@Service
public class ImageUtils {

    @Value("${file.upload.dir}") // Inject the property value
    private String uploadDir;


    public String saveImage(MultipartFile image,String dirName) {
        try {
            String dir = uploadDir+dirName;
            // Generate a unique file name
            String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
            Path filePath = Paths.get(dir, fileName);
            // Create the directory if it doesn't exist
            File directory = new File(dir);
            if (!directory.exists()) {
                directory.mkdirs();
            }

            // Save the file
            Files.copy(image.getInputStream(), filePath);

            // Return the relative path to access the image
            return dirName + fileName;  // This is the URL path
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }

    public void deleteImage(String imagePath) {
        // Construct the full file path
        Path filePath = Paths.get(uploadDir, imagePath); // Use the upload directory
        File file = filePath.toFile(); // Convert Path to File

        // Check if the file exists before attempting to delete
        if (file.exists()) {
            boolean deleted = file.delete();
            if (!deleted) {
                throw new RuntimeException("Failed to delete image: " + imagePath);
            }
        } else {
            System.out.println("Image not found: " + imagePath);
        }
    }
}