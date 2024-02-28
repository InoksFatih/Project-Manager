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

import java.util.*;

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
        // Retrieve the task based on the provided taskId.
        Optional<Task> taskOptional = taskRepo.findById(taskId);

        // Check if the task exists.
        if (taskOptional.isPresent()) {
            // If the task exists, retrieve it.
            Task task = taskOptional.get();

            // Create a new Subtask instance.
            Subtask subtask = new Subtask();

            // Set subtask attributes with the provided values from subtaskDTO.
            subtask.setTitle(subtaskDTO.getTitle());
            subtask.setStatus(subtaskDTO.getStatus());

            // Set remaining subtask attributes.
            subtask.setDetail(subtaskDTO.getDetail());
            subtask.setPriority(subtaskDTO.getPriority());
            subtask.setTask(task);

            // Assign person to the subtask if it exists in the task.
            Person assignedPerson = task.getPerson();
            if (assignedPerson != null) {
                subtask.setPerson(assignedPerson);
                assignedPerson.setSubtaskCount(assignedPerson.getSubtaskCount() + 1);
                personRepo.save(assignedPerson);
            }

            // Save the subtask to the repository.
            subtaskRepo.save(subtask);

            // Return ResponseEntity with the added subtask and HTTP status OK.
            return new ResponseEntity<>(subtask, HttpStatus.OK);
        } else {
            // If task doesn't exist, return HTTP status NOT_FOUND.
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
        // Retrieve the existing subtask based on the provided id.
        Optional<Subtask> oldSubtaskOptional = subtaskRepo.findById(id);

        // Check if the subtask exists.
        if (oldSubtaskOptional.isPresent()) {
            // If the subtask exists, retrieve it.
            Subtask subtask = oldSubtaskOptional.get();

            // Update subtask attributes with the provided values from subtaskDTO if they are not null.
            if (subtaskDTO.getTitle() != null) {
                subtask.setTitle(subtaskDTO.getTitle());
            }
            if (subtaskDTO.getStatus() != null) {
                subtask.setStatus(subtaskDTO.getStatus());
            }
            if (subtaskDTO.getDetail() != null) {
                subtask.setDetail(subtaskDTO.getDetail());
            }
            if (subtaskDTO.getPriority() != null) {
                subtask.setPriority(subtaskDTO.getPriority());
            }

            // Save the updated subtask to the repository.
            subtaskRepo.save(subtask);

            // Return ResponseEntity with the updated subtask and HTTP status OK.
            return new ResponseEntity<>(subtask, HttpStatus.OK);
        } else {
            // If the subtask doesn't exist, return HTTP status NOT_FOUND.
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    // Method to calculate end date based on start date, end date, old planned days, and new planned days.
    private Date calculateEndDate(Date startDate, Date endDate, double oldPlannedDays, double newPlannedDays) {
        // Check if startDate is null
        if (startDate == null) {
            throw new IllegalArgumentException("Start date must not be null");
        }

        // Calculate the difference in planned days.
        double plannedDaysDifference = newPlannedDays - oldPlannedDays;

        // Convert days difference to milliseconds.
        long millisecondsDifference = (long) (plannedDaysDifference * 24 * 60 * 60 * 1000);

        // Check if endDate is null, if so, initialize it with the startDate
        if (endDate == null) {
            endDate = startDate;
        }

        // Create a Calendar instance and set it to the current end date.
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(endDate);

        // Adjust the end date based on the difference in planned days.
        calendar.add(Calendar.MILLISECOND, (int) millisecondsDifference);

        // Return the updated end date.
        return calendar.getTime();
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
