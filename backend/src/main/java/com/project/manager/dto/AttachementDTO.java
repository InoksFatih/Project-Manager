package com.project.manager.dto;

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

    public AttachementDTO(Long id, String fileName, String downloadUrl, String fileType, long fileSize, String uploadDate) {
        this.id = id;
        this.fileName = fileName;
        this.downloadUrl = downloadUrl;
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
        return "http://localhost:8080/downloadFile/" + this.id;
    }
}
