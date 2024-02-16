package com.project.manager.services;

import com.project.manager.models.Attachement;
import com.project.manager.models.Task;
import com.project.manager.repo.AttachementRepo;
import com.project.manager.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.Optional;

import static org.springframework.data.jpa.domain.AbstractPersistable_.id;

@Service
public class AttachementServiceImpl implements AttachementService {

    private final AttachementRepo attachementRepo;
    @Autowired
    private TaskRepo taskRepo;
    public AttachementServiceImpl(AttachementRepo attachementRepo) {
        this.attachementRepo = attachementRepo;
    }

    @Override
    public Attachement saveAttachement(MultipartFile file, Long taskId) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if (fileName.contains("..")) {
                throw new Exception("Filename contains invalid path sequence " + fileName);
            }

            Optional<Task> taskOptional = taskRepo.findById(taskId);
            if (!taskOptional.isPresent()) {
                throw new Exception("Task not found with ID: " + taskId);
            }
            Task task = taskOptional.get();

            Attachement attachement = new Attachement(
                    fileName,
                    file.getContentType(),
                    file.getBytes()
            );
            attachement.setUploadDate(new Date());
            attachement.setFileSize(file.getSize());
            attachement.setTask(task);

            attachement = attachementRepo.save(attachement);

            String downloadUrl = generateDownloadUrl(attachement.getId());
            attachement.setDownloadUrl(downloadUrl);

            task.setAttachement(attachement);
            taskRepo.save(task);

            return attachement;
        } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
        }
    }




    @Override
    public Attachement getAttachement(Long fileId) throws Exception {
        return attachementRepo.findById(fileId)
                .orElseThrow(() -> new Exception("File not found with Id: " + fileId));
    }

    @Override
    public Attachement updateAttachement(Long fileId, MultipartFile file, Long taskId) throws Exception {
        try {
            Attachement existingAttachement = attachementRepo.findById(fileId)
                    .orElseThrow(() -> new Exception("File not found with Id: " + fileId));

            String fileName = StringUtils.cleanPath(file.getOriginalFilename());

            if (fileName.contains("..")) {
                throw new Exception("Filename contains invalid path sequence " + fileName);
            }

            existingAttachement.setFileName(fileName);
            existingAttachement.setFileType(file.getContentType());
            existingAttachement.setData(file.getBytes());
            existingAttachement.setUploadDate(new Date());
            existingAttachement.setFileSize(file.getSize());

            attachementRepo.save(existingAttachement);

            return existingAttachement;
        } catch (Exception e) {
            throw new Exception("Error updating file: " + e.getMessage());
        }
    }

    @Override
    public void deleteAttachement(Long fileId) throws Exception {
        try {
            Attachement attachement = attachementRepo.findById(fileId)
                    .orElseThrow(() -> new Exception("Attachment not found with ID: " + fileId));

            // Disassociate the attachment from the task
            Task task = attachement.getTask();
            if (task != null) {
                task.setAttachement(null);
                taskRepo.save(task);
            }

            // Now delete the attachment
            attachementRepo.deleteById(fileId);
        } catch (Exception e) {
            throw new Exception("Error deleting attachment: " + e.getMessage());
        }
    }


    private String generateDownloadUrl(Long attachementId) {
        return "http://localhost:8080/download/" + attachementId;
    }
}