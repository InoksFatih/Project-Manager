package com.project.manager.services;

import com.project.manager.dto.ProjectDTO;
import com.project.manager.dto.TaskDTO;
import com.project.manager.models.*;
import com.project.manager.repo.PersonRepo;
import com.project.manager.repo.ProjectRepo;
import com.project.manager.repo.SubtaskRepo;
import com.project.manager.repo.TaskRepo;

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
public class TaskService {
    @Autowired
    private TaskRepo taskRepo;
    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private SubtaskRepo subtaskRepo;
    @Autowired
    private PersonRepo personRepo;
    @Autowired
    private AttachementService attachementService;

    public ResponseEntity<Task> addTask(TaskDTO taskDTO, Long projectId) {
        Optional<Project> projectOptional = projectRepo.findById(projectId);

        if (projectOptional.isPresent()) {
            Task task = new Task();
            task.setTitle(taskDTO.getTitle());
            task.setStatus(Status.valueOfLabel(taskDTO.getStatus()));
            task.setDueDate(taskDTO.getDueDate());
            task.setDetail(taskDTO.getDetail());
            task.setPriority(Priority.valueOfLabel(taskDTO.getPriority()));
            task.setPlannedDays(taskDTO.getPlannedDays());
            task.setProject(projectOptional.get());
            projectOptional.ifPresent(task::setProject);
            taskRepo.save(task);
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




    public ResponseEntity<Task> getTaskById(Long id) {
        Optional<Task> taskData = taskRepo.findById(id);
        if (taskData.isPresent()) {
            Task task = taskData.get();
            if (task.getAttachement() != null) {
                try {
                    Attachement attachment = attachementService.getAttachement(task.getAttachement().getId());
                    task.setAttachement(attachment);
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<Task>> getAllTasks() {
        List<Task> taskList = new ArrayList<>(taskRepo.findAll());
        if (taskList.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        for (Task task : taskList) {
            if (task.getAttachement() != null) {
                try {
                    Attachement attachment = attachementService.getAttachement(task.getAttachement().getId());
                    task.setAttachement(attachment);
                } catch (Exception e) {
                    return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
        return new ResponseEntity<>(taskList, HttpStatus.OK);
    }

    public ResponseEntity<List<Task>> getTasksByProject(Long projectId) {
        Optional<Project> projectOptional = projectRepo.findById(projectId);
        if (projectOptional.isPresent()) {
            List<Task> tasks = taskRepo.findByProject(projectOptional.get());
            for (Task task : tasks) {
                if (task.getAttachement() != null) {
                    try {
                        Attachement attachment = attachementService.getAttachement(task.getAttachement().getId());
                        task.setAttachement(attachment);
                    } catch (Exception e) {
                        return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }
            }
            return new ResponseEntity<>(tasks, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Task> updateTask(Long id, TaskDTO taskDTO) {
        Optional<Task> oldTask = taskRepo.findById(id);
        if (oldTask.isPresent()) {
            Task task = oldTask.get();
            task.setTitle(taskDTO.getTitle());
            task.setStatus(Status.valueOfLabel(taskDTO.getStatus()));
            task.setDueDate(taskDTO.getDueDate());
            task.setDetail(taskDTO.getDetail());
            task.setPriority(Priority.valueOfLabel(taskDTO.getPriority()));
            task.setPlannedDays(taskDTO.getPlannedDays());
            task.setRealDaysConsumed(taskDTO.getRealDaysConsumed());
            taskRepo.save(task);
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<Person> getAssignedPersonForTask(Long taskId) {
        Optional<Task> taskOptional = taskRepo.findById(taskId);
        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            Person assignedPerson = task.getPerson();
            if (assignedPerson != null) {
                return new ResponseEntity<>(assignedPerson, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<HttpStatus> deleteTask(Long id) {
        Optional<Task> taskOptional = taskRepo.findById(id);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            Person assignedPerson = task.getPerson();

            int subtaskCount = task.getSubtasks().size();

            Collection<Subtask> subtasks = task.getSubtasks();
            for (Subtask subtask : subtasks) {
                subtaskRepo.deleteById(subtask.getId());
            }

            if (assignedPerson != null) {
                assignedPerson.setTaskCount(assignedPerson.getTaskCount() - 1);
                assignedPerson.setSubtaskCount(assignedPerson.getSubtaskCount() - subtaskCount);
                personRepo.save(assignedPerson);
            }

            taskRepo.deleteById(id);

            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}