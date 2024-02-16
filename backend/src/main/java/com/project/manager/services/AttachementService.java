package com.project.manager.services;

import com.project.manager.models.Attachement;
import org.springframework.web.multipart.MultipartFile;

public interface AttachementService {
        Attachement saveAttachement(MultipartFile file, Long taskId) throws Exception;
        Attachement getAttachement(Long fileId) throws Exception;
        void deleteAttachement(Long fileId) throws Exception;
        Attachement updateAttachement(Long fileId, MultipartFile file, Long taskId) throws Exception;
}
