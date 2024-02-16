package com.project.manager.repo;

import com.project.manager.models.Attachement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import org.springframework.web.bind.annotation.CrossOrigin;

@RepositoryRestResource
@CrossOrigin("*")
public interface AttachementRepo extends JpaRepository<Attachement, Long> {
}
