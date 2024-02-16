package com.project.manager.repo;

import com.project.manager.models.Subtask;
import com.project.manager.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
@CrossOrigin("*")
public interface SubtaskRepo extends JpaRepository<Subtask, Long> {
    List<Subtask> findByTask(Task task);
}
