package com.project.manager.repo;

import com.project.manager.models.Person;
import com.project.manager.models.Project;
import com.project.manager.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;
import java.util.Optional;

@RepositoryRestResource
@CrossOrigin("*")
public interface TaskRepo extends JpaRepository<Task, Long> {
    List<Task> findByProjectAndPerson(Project project, Person person);
    List<Task> findByProject(Project project);
    List<Task> findByPerson(Person person);
}
