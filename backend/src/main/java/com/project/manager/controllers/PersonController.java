package com.project.manager.controllers;

import com.project.manager.dto.PersonDTO;
import com.project.manager.models.Person;
import com.project.manager.models.Task;
import com.project.manager.services.PersonService;
import com.project.manager.services.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
public class PersonController {
    @Autowired
    private PersonService personService;
    @Autowired
    private TaskService taskService;

    @GetMapping("/getPerson/{id}")
    public ResponseEntity<Person> getPersonById(@PathVariable Long id) {
        ResponseEntity<Person> personById = personService.getPersonById(id);
        return personById;
    }

    @PostMapping("/addPersonToTask/{taskId}")
    public ResponseEntity<Person> addPersonToTask(@PathVariable Long taskId, @RequestBody PersonDTO personDTO) {
        return personService.addPersonToTask(taskId, personDTO);
    }

    @GetMapping("/task/{taskId}/assignedPerson")
    public ResponseEntity<Person> getAssignedPersonForTask(@PathVariable Long taskId) {
        ResponseEntity<Person> assignedPerson = taskService.getAssignedPersonForTask(taskId);
        return assignedPerson;
    }

    @DeleteMapping("/removePersonFromTask/{personId}/{taskId}")
    public ResponseEntity<Person> removePersonFromTask(@PathVariable Long personId, @PathVariable Long taskId) {
        return personService.removePersonFromTask(personId, taskId);
    }

    @GetMapping("/getAllPersons")
    public ResponseEntity<List<Person>> getAllPersons() {
        ResponseEntity<List<Person>> allPersons = personService.getAllPersons();
        return allPersons;
    }
}
