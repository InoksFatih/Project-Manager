package com.project.manager.services;

import com.project.manager.dto.SubtaskDTO;
import com.project.manager.models.*;
import com.project.manager.repo.PersonRepo;
import com.project.manager.repo.SubtaskRepo;

import com.project.manager.repo.TaskRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static com.project.manager.models.Status.*;

@CrossOrigin("*")
@Service
public class SubtaskService {
    @Autowired
    private SubtaskRepo subtaskRepo;
    @Autowired
    private TaskRepo taskRepo;
    @Autowired
    private PersonRepo personRepo;

    public ResponseEntity<Subtask> addSubtask(SubtaskDTO subtaskDTO, Long taskId) {
        Optional<Task> taskOptional = taskRepo.findById(taskId);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            Subtask subtask = new Subtask();
            subtask.setTitle(subtaskDTO.getTitle());
            subtask.setStatus(Status.valueOfLabel(subtaskDTO.getStatus()));
            subtask.setDueDate(subtaskDTO.getDueDate());
            subtask.setDetail(subtaskDTO.getDetail());
            subtask.setPriority(Priority.valueOfLabel(subtaskDTO.getPriority()));
            subtask.setPlannedDays(subtaskDTO.getPlannedDays());
            subtask.setTask(task);

            Person assignedPerson = task.getPerson();
            if (assignedPerson != null) {
                subtask.setPerson(assignedPerson);

                assignedPerson.setSubtaskCount(assignedPerson.getSubtaskCount() + 1);
                personRepo.save(assignedPerson);
            }

            subtaskRepo.save(subtask);

            return new ResponseEntity<>(subtask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }





    public ResponseEntity<Subtask> getSubtaskById( Long id) {
        Optional<Subtask> subtaskData = subtaskRepo.findById(id);

        if (subtaskData.isPresent()) {
            return new ResponseEntity<>(subtaskData.get(),HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<List<Subtask>> getAllSubtasks() {
        try {
            List<Subtask> subtaskList = new ArrayList<>(subtaskRepo.findAll());

            if (subtaskList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(subtaskList, HttpStatus.OK);

        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public ResponseEntity<List<Subtask>> getSubtasksByTask(Long taskId) {
        Optional<Task> taskOptional = taskRepo.findById(taskId);

        if (taskOptional.isPresent()) {
            List<Subtask> subtasks = subtaskRepo.findByTask(taskOptional.get());
            return new ResponseEntity<>(subtasks, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public ResponseEntity<Subtask> updateSubtask(Long id, SubtaskDTO subtaskDTO) {
        Optional<Subtask> oldSubtask = subtaskRepo.findById(id);
        if (oldSubtask.isPresent()) {
            Subtask subtask = oldSubtask.get();
            subtask.setTitle(subtaskDTO.getTitle());
            subtask.setStatus(Status.valueOfLabel(subtaskDTO.getStatus()));
            subtask.setDueDate(subtaskDTO.getDueDate());
            subtask.setDetail(subtaskDTO.getDetail());
            subtask.setPriority(Priority.valueOfLabel(subtaskDTO.getPriority()));
            subtask.setPlannedDays(subtaskDTO.getPlannedDays());
            subtask.setRealDaysConsumed(subtaskDTO.getRealDaysConsumed());
            subtaskRepo.save(subtask);
            return new ResponseEntity<>(subtask, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    public ResponseEntity<HttpStatus> deleteSubtask(Long id) {
        Optional<Subtask> subtaskOptional = subtaskRepo.findById(id);
        if (subtaskOptional.isPresent()) {
            Subtask subtask = subtaskOptional.get();
            Person assignedPerson = subtask.getPerson();
            if (assignedPerson != null) {
                assignedPerson.setSubtaskCount(assignedPerson.getSubtaskCount() - 1);
                personRepo.save(assignedPerson);
            }

            subtaskRepo.deleteById(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

}
