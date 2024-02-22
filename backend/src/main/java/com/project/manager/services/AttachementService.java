package com.project.manager.services;

import com.project.manager.models.Attachement;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
@CrossOrigin("*")

public interface AttachementService {
        Attachement saveAttachement(MultipartFile file, Long taskId) throws Exception;
        Attachement getAttachement(Long fileId) throws Exception;
        void deleteAttachementByTaskId(Long taskId) throws Exception;
        Attachement updateAttachement(Long fileId, MultipartFile file, Long taskId) throws Exception;
        List<Attachement> getAllAttachements() throws Exception;
        Attachement getAttachementByTask(Long taskId) throws Exception;
}
