package com.project.manager.controllers;

import com.project.manager.dto.TaskDTO;
import com.project.manager.models.Task;
import com.project.manager.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
public class TaskController {
    @Autowired
    private TaskService taskService;

    @PostMapping("/addTask/{projectId}")
    public ResponseEntity<Task> addTask(@RequestBody TaskDTO taskDTO, @PathVariable Long projectId) {
        return taskService.addTask(taskDTO, projectId);
    }

    @GetMapping("/getTask/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        ResponseEntity<Task> taskById = taskService.getTaskById(id);
        return taskById;
    }

    @GetMapping("/getAllTasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        ResponseEntity<List<Task>> allTasks = taskService.getAllTasks();
        return allTasks;
    }

    @GetMapping("/getTasksByProject/{projectId}")
    public ResponseEntity<List<Task>> getTasksByProject(@PathVariable Long projectId) {
        ResponseEntity<List<Task>> tasksByProject = taskService.getTasksByProject(projectId);
        return tasksByProject;
    }


    @PutMapping("/updateTask/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        return taskService.updateTask(id, taskDTO);
    }

    @DeleteMapping("/deleteTask/{id}")
    public ResponseEntity<HttpStatus> deleteTask(@PathVariable Long id) {
        ResponseEntity<HttpStatus> deletedTask = taskService.deleteTask(id);
        return deletedTask;
    }
}
