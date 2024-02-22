package com.project.manager.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Attachement implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "download_url", nullable = false)
    private String downloadUrl;

    private Date uploadDate;
    private String fileName;
    private String fileType;
    private String fileSize;

    @Lob
    @Column(columnDefinition = "LONGBLOB")
    @JsonIgnore
    private byte[] data;

    @OneToOne
    @JoinColumn(name = "task_id")
    @JsonIgnore
    private Task task;

    public Attachement(String fileName, String fileType, byte[] data) {
        this.fileName = fileName;
        this.fileType = fileType;
        this.data = data;
        this.downloadUrl = generateDownloadUrl();
    }

    private String generateDownloadUrl() {
        return "http://localhost:8080/downloadFile/" + this.id;
    }
}
