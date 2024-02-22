package com.project.manager.services;

import com.project.manager.dto.ProjectClientDTO;
import com.project.manager.dto.ProjectDTO;
import com.project.manager.models.*;
import com.project.manager.repo.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;


import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@Service
public class ProjectService {

    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private TaskRepo taskRepo;
    @Autowired
    private SubtaskRepo subtaskRepo;
    @Autowired
    private PersonRepo personRepo;
    @Autowired
    private ProjectClientRepo projectClientRepo;

    public ResponseEntity<Project> addProject(ProjectDTO projectDTO, Long projectClientId) {
        Optional<ProjectClient> projectClientOptional = projectClientRepo.findById(projectClientId);

        if (projectClientOptional.isPresent()) {
            Project project = new Project();
            project.setTitle(projectDTO.getTitle());
            project.setStatus(Status.valueOfLabel(projectDTO.getStatus()));
            project.setDueDate(projectDTO.getDueDate());
            project.setDetail(projectDTO.getDetail());
            project.setPriority(Priority.valueOfLabel(projectDTO.getPriority()));
            project.setProjectClient(projectClientOptional.get());
            project.setPlannedDays(projectDTO.getPlannedDays());
            projectRepo.save(project);
            return new ResponseEntity<>(project, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    public ResponseEntity<Project> getProjectById(Long id) {
        Optional<Project> projectData = projectRepo.findById(id);

        if (projectData.isPresent()) {
            return new ResponseEntity<>(projectData.get(),HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<List<Project>> getAllProjects() {
        try {
            List<Project> projects = new ArrayList<>(projectRepo.findAll());
            if (projects.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(projects, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Project> updateProject(Long id, ProjectDTO projectDTO) {
        Optional<Project> oldProjectOptional = projectRepo.findById(id);

        if (oldProjectOptional.isPresent()) {
            Project updatedProject = oldProjectOptional.get();
            updatedProject.setTitle(projectDTO.getTitle());
            updatedProject.setStatus((Status.valueOfLabel(projectDTO.getStatus())));
            updatedProject.setDueDate(projectDTO.getDueDate());
            updatedProject.setDetail(projectDTO.getDetail());
            updatedProject.setPriority((Priority.valueOfLabel(projectDTO.getPriority())));
            updatedProject.setPlannedDays(projectDTO.getPlannedDays());
            updatedProject.setRealDaysConsumed(projectDTO.getRealDaysConsumed());
            projectRepo.save(updatedProject);
            return new ResponseEntity<>(updatedProject, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    public ResponseEntity<HttpStatus> deleteProject(Long id) {
        Optional<Project> projectOptional = projectRepo.findById(id);

        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();

            project.setProjectClient(null);

            Collection<Task> tasks = project.getTasks();
            for (Task task : tasks) {
                Person assignedPerson = task.getPerson();
                if (assignedPerson != null) {
                    assignedPerson.setTaskCount(assignedPerson.getTaskCount() - 1);
                    assignedPerson.setSubtaskCount(assignedPerson.getSubtaskCount() - task.getSubtasks().size());
                    personRepo.save(assignedPerson);
                }
                task.getSubtasks().forEach(subtask -> subtaskRepo.deleteById(subtask.getId()));
            }
            taskRepo.deleteAll(tasks);

            projectRepo.deleteById(id);

            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<ProjectClient>> getAllClients() {
        try {
            List<ProjectClient> clients = new ArrayList<>(projectClientRepo.findAll());

            if (clients.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(clients, HttpStatus.OK);

        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
