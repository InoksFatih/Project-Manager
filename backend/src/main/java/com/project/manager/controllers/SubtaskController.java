package com.project.manager.controllers;

import com.project.manager.dto.SubtaskDTO;
import com.project.manager.models.Subtask;
import com.project.manager.models.Task;
import com.project.manager.services.SubtaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
public class SubtaskController {
    @Autowired
    private SubtaskService subtaskService;

    @PostMapping("/addSubtask/{taskId}")
    public ResponseEntity<Subtask> addSubtask(@RequestBody SubtaskDTO subtaskDTO, @PathVariable Long taskId) {
        return subtaskService.addSubtask(subtaskDTO, taskId);
    }

    @GetMapping("/getSubtask/{id}")
    public ResponseEntity<Subtask> getSubtaskById(@PathVariable Long id) {
        ResponseEntity<Subtask> subtaskById = subtaskService.getSubtaskById(id);
        return subtaskById;
    }

    @GetMapping("/getAllSubtasks")
    public ResponseEntity<List<Subtask>> getAllSubtasks() {
        ResponseEntity<List<Subtask>> allSubtasks = subtaskService.getAllSubtasks();
        return allSubtasks;
    }

    @GetMapping("/getSubtasksByTask/{taskId}")
    public ResponseEntity<List<Subtask>> getSubtasksByTask(@PathVariable Long taskId) {
        ResponseEntity<List<Subtask>> subtasksByTask = subtaskService.getSubtasksByTask(taskId);
        return subtasksByTask;
    }

    @PutMapping("/updateSubtask/{id}")
    public ResponseEntity<Subtask> updateSubtask(@PathVariable Long id, @RequestBody SubtaskDTO subtaskDTO) {
        return subtaskService.updateSubtask(id, subtaskDTO);
    }

    @DeleteMapping("/deleteSubtask/{id}")
    public ResponseEntity<HttpStatus> deleteSubtask(@PathVariable Long id) {
        ResponseEntity<HttpStatus> deletedSubtask = subtaskService.deleteSubtask(id);
        return deletedSubtask;
    }
}
