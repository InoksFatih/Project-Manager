package com.project.manager.repo;


import com.project.manager.models.ProjectClient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

import org.springframework.web.bind.annotation.CrossOrigin;


@RepositoryRestResource
@CrossOrigin("*")
public interface ProjectClientRepo extends JpaRepository<ProjectClient, Long> {

}
