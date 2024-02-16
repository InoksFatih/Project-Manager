package com.project.manager.controllers;

import com.project.manager.dto.AttachementDTO;
import com.project.manager.models.Attachement;
import com.project.manager.models.Task;
import com.project.manager.services.AttachementService;
import com.project.manager.services.TaskService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;


@RestController
@CrossOrigin("*")
public class AttachementController {

    private final AttachementService attachementService;
    private final TaskService taskService;

    public AttachementController(AttachementService attachementService, TaskService taskService) {
        this.attachementService = attachementService;
        this.taskService = taskService;
    }

    @PostMapping("/uploadFile")
    public ResponseEntity<AttachementDTO> uploadFile(@RequestParam("file") MultipartFile file, @RequestParam("taskId") Long taskId) {
        try {
            ResponseEntity<Task> taskResponse = taskService.getTaskById(taskId);
            if (taskResponse.getStatusCode() == HttpStatus.OK) {
                Task task = taskResponse.getBody();
                if (task == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }

                Attachement attachement = attachementService.saveAttachement(file, taskId);

                String downloadUrl = generateDownloadUrl(attachement.getId());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String formattedUploadDate = attachement.getUploadDate()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .format(formatter);

                AttachementDTO attachementDTO = new AttachementDTO(
                        attachement.getId(),
                        attachement.getFileName(),
                        downloadUrl,
                        file.getContentType(),
                        Long.toString(file.getSize()),
                        formattedUploadDate
                );

                return ResponseEntity.ok().body(attachementDTO);
            } else {
                return ResponseEntity.status(taskResponse.getStatusCode()).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    @GetMapping("/downloadFile/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) {
        try {
            Attachement attachement = attachementService.getAttachement(fileId);

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(attachement.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachement.getFileName() + "\"")
                    .body(new ByteArrayResource(attachement.getData()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @DeleteMapping("/deleteFile/{fileId}")
    public ResponseEntity<String> deleteFile(@PathVariable Long fileId) {
        try {
            attachementService.deleteAttachement(fileId);
            return ResponseEntity.ok().body("Attachment deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting attachment: " + e.getMessage());
        }
    }

    @PutMapping("/updateFile/{fileId}")
    public ResponseEntity<AttachementDTO> updateFile(@PathVariable Long fileId, @RequestParam("file") MultipartFile file, @RequestParam("taskId") Long taskId) {
        try {
            ResponseEntity<Task> taskResponse = taskService.getTaskById(taskId);
            if (taskResponse.getStatusCode() == HttpStatus.OK) {
                Task task = taskResponse.getBody();
                if (task == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
                }

                Attachement updatedAttachement = attachementService.updateAttachement(fileId, file, taskId);

                String downloadUrl = generateDownloadUrl(updatedAttachement.getId());

                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
                String formattedUploadDate = updatedAttachement.getUploadDate()
                        .toInstant()
                        .atZone(ZoneId.systemDefault())
                        .format(formatter);

                AttachementDTO updatedAttachementDTO = new AttachementDTO(
                        updatedAttachement.getId(),
                        updatedAttachement.getFileName(),
                        downloadUrl,
                        file.getContentType(),
                        Long.toString(file.getSize()),
                        formattedUploadDate
                );

                return ResponseEntity.ok().body(updatedAttachementDTO);
            } else {
                return ResponseEntity.status(taskResponse.getStatusCode()).body(null);
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }


    private String generateDownloadUrl(Long fileId) {
        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/" )
                .path(fileId.toString())
                .toUriString();
    }


}
