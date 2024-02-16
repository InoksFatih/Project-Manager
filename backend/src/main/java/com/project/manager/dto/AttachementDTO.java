package com.project.manager.dto;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AttachementDTO {
    private Long id;
    private String fileName;
    private String downloadUrl;
    private String fileType;
    private String uploadDate;
    private String fileSize;

    public AttachementDTO(String fileName, String fileType, long fileSize, String uploadDate) {
        this.fileName = fileName;
        this.downloadUrl = generateDownloadUrl();
        this.fileType = fileType;
        this.uploadDate = uploadDate;
        this.fileSize = formatFileSize(fileSize);
    }

    private String formatFileSize(long sizeInBytes) {
        if (sizeInBytes < 1024) {
            return sizeInBytes + " B";
        } else if (sizeInBytes < 1024 * 1024) {
            return (sizeInBytes / 1024) + " KB";
        } else {
            return (sizeInBytes / (1024 * 1024)) + " MB";
        }
    }
    private String generateDownloadUrl() {
        return "http://localhost:8080/download/" + this.id;
    }
}

