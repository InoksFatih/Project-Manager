package com.project.manager.controllers;

import com.project.manager.dto.ProjectDTO;
import com.project.manager.models.Project;
import com.project.manager.models.ProjectClient;
import com.project.manager.services.ProjectService;
import com.project.manager.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin("*")
@RestController
public class ProjectController {

    @Autowired
    private ProjectService projectService;
    @Autowired
    private TaskService taskService;

    @PostMapping("/addProject/{projectClientId}")
    public ResponseEntity<Project> addProject(@RequestBody ProjectDTO projectDTO, @PathVariable Long projectClientId) {
        return projectService.addProject(projectDTO, projectClientId);
    }

    @GetMapping("/getProject/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        ResponseEntity<Project> projectById = projectService.getProjectById(id);
        return projectById;
    }
    @GetMapping("/getProjectsByPerson/{personId}")
    public ResponseEntity<List<Project>> getProjectsByPerson(@PathVariable Long personId) {
        ResponseEntity<List<Project>> projectsByPerson = taskService.getProjectsForPerson(personId);
        return projectsByPerson;
    }
    @GetMapping("/getAllProjects")
    public ResponseEntity<List<Project>> getAllProjects() {
        ResponseEntity<List<Project>> allProjects = projectService.getAllProjects();
        return allProjects;
    }

    @PutMapping("/updateProject/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        return projectService.updateProject(id, projectDTO );
    }

    @DeleteMapping("/deleteProject/{id}")
    public ResponseEntity<HttpStatus> deleteProject(@PathVariable Long id) {
        ResponseEntity<HttpStatus> deletedProject = projectService.deleteProject(id);
        return deletedProject;
    }

    @GetMapping("/getAllClients")
    public ResponseEntity<List<ProjectClient>> getAllClients() {
        ResponseEntity<List<ProjectClient>> allClients = projectService.getAllClients();
        return allClients;
    }
}
