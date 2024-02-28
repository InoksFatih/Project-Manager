package com.project.manager.services;


import com.project.manager.dto.PersonDTO;
import com.project.manager.dto.ProjectDTO;
import com.project.manager.models.Person;
import com.project.manager.models.Project;
import com.project.manager.models.Subtask;
import com.project.manager.models.Task;
import com.project.manager.repo.PersonRepo;
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
public class PersonService {

    @Autowired
    private PersonRepo personRepo;

    @Autowired
    private TaskRepo taskRepo;

    @Autowired
    private SubtaskRepo subtaskRepo;

    public ResponseEntity<Person> getPersonById(Long id) {
        Optional<Person> personData = personRepo.findById(id);

        if (personData.isPresent()) {
            return new ResponseEntity<>(personData.get(),HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    public ResponseEntity<List<Person>> getAllPersons() {
        try {
            List<Person> personList = new ArrayList<>(personRepo.findAll());

            if (personList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(personList, HttpStatus.OK);

        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    public ResponseEntity<Person> addPersonToTask(Long taskId, PersonDTO personDTO) {
        Optional<Task> taskOptional = taskRepo.findById(taskId);

        if (taskOptional.isPresent()) {
            Task task = taskOptional.get();
            Optional<Person> existingPersonOptional = personRepo.findByEmail(personDTO.getEmail());

            if (existingPersonOptional.isPresent()) {
                Person existingPerson = existingPersonOptional.get();

                if (task.getPerson() != null) {

                    Person previousPerson = task.getPerson();
                    previousPerson.setTaskCount(previousPerson.getTaskCount() - 1);
                    personRepo.save(previousPerson);

                    task.getSubtasks().forEach(subtask -> {
                        subtask.setPerson(null);
                        subtaskRepo.save(subtask);
                    });
                    previousPerson.setSubtaskCount(previousPerson.getSubtaskCount() - task.getSubtasks().size());
                    personRepo.save(previousPerson);
                }

                task.setPerson(existingPerson);
                taskRepo.save(task);

                existingPerson.setTaskCount(existingPerson.getTaskCount() + 1);
                personRepo.save(existingPerson);

                task.getSubtasks().forEach(subtask -> {
                    subtask.setPerson(existingPerson);
                    subtaskRepo.save(subtask);
                });
                existingPerson.setSubtaskCount(existingPerson.getSubtaskCount() + task.getSubtasks().size());
                personRepo.save(existingPerson);

                return new ResponseEntity<>(existingPerson, HttpStatus.OK);
            } else {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }



    public ResponseEntity<Person> removePersonFromTask(Long personId, Long taskId) {
        Optional<Person> personOptional = personRepo.findById(personId);
        Optional<Task> taskOptional = taskRepo.findById(taskId);

        if (personOptional.isPresent() && taskOptional.isPresent()) {
            Person person = personOptional.get();
            Task task = taskOptional.get();

            if (task.getPerson() != null && task.getPerson().equals(person)) {

                task.setPerson(null);
                taskRepo.save(task);


                person.setTaskCount(person.getTaskCount() - 1);
                personRepo.save(person);


                task.getSubtasks().forEach(subtask -> {
                    subtask.setPerson(null);
                    subtaskRepo.save(subtask);
                });


                person.setSubtaskCount(person.getSubtaskCount() - task.getSubtasks().size());
                personRepo.save(person);

                return new ResponseEntity<>(person, HttpStatus.OK);
            } else {
                // Task is not assigned to the person
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
        } else {
            // Person or Task not found
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}
