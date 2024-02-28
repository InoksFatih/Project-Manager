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

import java.util.*;
import java.util.concurrent.TimeUnit;

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

    // Method to add a new task to the app.
    public ResponseEntity<Task> addTask(TaskDTO taskDTO, Long projectId) {
        Optional<Project> projectOptional = projectRepo.findById(projectId);

        if (projectOptional.isPresent()) {
            Task task = new Task();
            task.setTitle(taskDTO.getTitle());
            task.setStatus(taskDTO.getStatus());
            task.setDetail(taskDTO.getDetail());
            task.setPriority(taskDTO.getPriority());

            // Set the start date from the DTO
            task.setStartDate(taskDTO.getStartDate());

            if (taskDTO.getPlannedDays() != null) {
                // Use the provided start date for calculation
                Date endDate = calculateEndDate(task.getStartDate(), taskDTO.getPlannedDays());
                task.setEndDate(endDate);
                task.setPlannedDays(taskDTO.getPlannedDays());
            }

            task.setProject(projectOptional.get());
            taskRepo.save(task);
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }




    // Helper method to calculate the end date of the task.
    private Date calculateEndDate(Date startDate, double plannedDays) {
        // Use Calendar to add planned days to the start date and get the end date.
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(startDate);

        // Calculate the number of whole days.
        int wholeDays = (int) plannedDays;

        // Calculate the number of remaining milliseconds for fractional days.
        long remainingMilliseconds = (long) ((plannedDays - wholeDays) * 24 * 60 * 60 * 1000);

        // Add whole days.
        calendar.add(Calendar.DAY_OF_MONTH, wholeDays);

        // Add remaining milliseconds for fractional days.
        calendar.add(Calendar.MILLISECOND, (int) remainingMilliseconds);

        return calendar.getTime();
    }


    public ResponseEntity<Task> getTaskById(Long id) {
        Optional<Task> taskData = taskRepo.findById(id);
        if (taskData.isPresent()) {
            Task task = taskData.get();
            if (task.getAttachement() != null) {
                try {
                    Attachement attachement = attachementService.getAttachement(task.getAttachement().getId());
                    task.setAttachement(attachement);
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
                    Attachement attachement = attachementService.getAttachement(task.getAttachement().getId());
                    task.setAttachement(attachement);
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
                        Attachement attachement = attachementService.getAttachement(task.getAttachement().getId());
                        task.setAttachement(attachement);
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
        // Retrieve the existing task based on the provided id.
        Optional<Task> oldTaskOptional = taskRepo.findById(id);

        // Check if the task exists.
        if (oldTaskOptional.isPresent()) {
            // If the task exists, retrieve it.
            Task task = oldTaskOptional.get();

            // Update task attributes with the provided values from taskDTO if they are not null.
            if (taskDTO.getTitle() != null) {
                task.setTitle(taskDTO.getTitle());
            }
            if (taskDTO.getStatus() != null) {
                task.setStatus(taskDTO.getStatus());
            }
            if (taskDTO.getDetail() != null) {
                task.setDetail(taskDTO.getDetail());
            }
            if (taskDTO.getPriority() != null) {
                task.setPriority(taskDTO.getPriority());
            }
            if (taskDTO.getRealDaysConsumed() != null) {
                task.setRealDaysConsumed(taskDTO.getRealDaysConsumed());
            }

            // Update planned days and recalculate end date if plannedDays is not null.
            if (taskDTO.getPlannedDays() != null) {
                // Update planned days.
                Double oldPlannedDays = task.getPlannedDays() != null ? task.getPlannedDays() : 0.0;
                Double newPlannedDays = taskDTO.getPlannedDays();

                // Recalculate the end date only if planned days are actually updated.
                if (!Objects.equals(oldPlannedDays, newPlannedDays)) {
                    task.setPlannedDays(newPlannedDays);
                    Date endDate = calculateEndDate(task.getStartDate(), newPlannedDays);
                    task.setEndDate(endDate);
                }
            } else {
                // If plannedDays is null in taskDTO, remove planned days from the task.
                task.setPlannedDays(null);
                // You might want to adjust endDate accordingly in this case as well.
            }

            // Save the updated task to the repository.
            taskRepo.save(task);

            // Return ResponseEntity with the updated task and HTTP status OK.
            return new ResponseEntity<>(task, HttpStatus.OK);
        } else {
            // If the task doesn't exist, return HTTP status NOT_FOUND.
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    private Date calculateEndDate(Date startDate, Date endDate, double oldPlannedDays, double newPlannedDays) {
        if (startDate == null) {
            throw new IllegalArgumentException("Start date must not be null");
        }

        // If plannedDays is 0, set endDate to the same as startDate.
        if (newPlannedDays == 0) {
            return startDate;
        }

        // Calculate the difference in planned days.
        double plannedDaysDifference = newPlannedDays - oldPlannedDays;

        if (endDate == null) {
            endDate = startDate;
        }

        Calendar calendar = Calendar.getInstance();
        calendar.setTime(endDate);

        // Convert planned days difference to hours.
        int hoursDifference = (int) (plannedDaysDifference * 24);

        // Add the hours difference to the end date.
        calendar.add(Calendar.HOUR_OF_DAY, hoursDifference);

        return calendar.getTime();
    }

    public ResponseEntity<List<Project>> getProjectsForPerson(Long personId) {
        Optional<Person> personOptional = personRepo.findById(personId);

        if (personOptional.isPresent()) {
            Person person = personOptional.get();

            List<Task> tasks = taskRepo.findByPerson(person);
            Set<Project> projectsSet = new HashSet<>();

            for (Task task : tasks) {
                projectsSet.add(task.getProject());
            }

            List<Project> projects = new ArrayList<>(projectsSet);

            return new ResponseEntity<>(projects, HttpStatus.OK);
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
                return ResponseEntity.ok(assignedPerson);
            } else {
                // Return an empty response or a default person object
                return ResponseEntity.ok(null); // Or return ResponseEntity.ok(new Person());
            }
        } else {
            // Return an empty response or a default person object
            return ResponseEntity.ok(null); // Or return ResponseEntity.ok(new Person());
        }
    }
    public ResponseEntity<List<Task>> getTasksByProjectAndPerson(Long projectId, Long personId) {
        Optional<Project> projectOptional = projectRepo.findById(projectId);
        Optional<Person> personOptional = personRepo.findById(personId);

        if (projectOptional.isPresent() && personOptional.isPresent()) {
            Project project = projectOptional.get();
            Person person = personOptional.get();

            List<Task> tasks = taskRepo.findByProjectAndPerson(project, person);
            for (Task task : tasks) {
                List<Subtask> subtasks = subtaskRepo.findByTask(task);
                task.setSubtasks(subtasks);
            }

            return new ResponseEntity<>(tasks, HttpStatus.OK);
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