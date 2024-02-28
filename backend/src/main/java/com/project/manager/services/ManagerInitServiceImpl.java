package com.project.manager.services;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.project.manager.models.*;
import com.project.manager.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.stream.Stream;

@Service
public class ManagerInitServiceImpl implements IManagerService{

    @Autowired
    private ProjectClientRepo projectClientRepo;
    @Autowired
    private PersonRepo personRepo;
    @Autowired
    private ProjectRepo projectRepo;
    @Autowired
    private SubtaskRepo subtaskRepo;
    @Autowired
    private TaskRepo taskRepo;


    private static final Random random = new Random();
    @Transactional
    @Override
    public void initPerson() {
        Stream.of("Jawad","Fatih","Simo","Adam").forEach(firstName->{
            Person person=new Person();
            person.setFirstName(firstName);
            person.setLastName("el " + firstName);
            person.setEmail(firstName.toLowerCase() + "@example.com");
            person.setPhoneNumber((long) (1000000000 + random.nextInt(900000000)));
            person.setActive(random.nextBoolean());
            personRepo.save(person);
        });

    }
    @Override
    @Transactional
    public void initProject() {

        Stream.of("Project1", "Project2", "Project3").forEach(title -> {
            Project project = new Project();
            project.setTitle(title);
            project.setDetail("Test");
            project.setPlannedDays(30.0);
            project.setStatus(Status.PENDING);
            project.setPriority(Priority.ESSENTIAL);

            projectRepo.save(project);
        });
    }
    @Override
    @Transactional
    public void initTask() {
        projectRepo.findAll().forEach(project -> {
            Stream.of("Tâche1", "Tâche2", "Tâche3", "Tâche4").forEach(title -> {
                Task task = new Task();
                task.setTitle(title);
                task.setDetail("Test");
                task.setStartDate(new Date());
                task.setEndDate(new Date());
                task.setPriority(Priority.ESSENTIAL);
                task.setStatus(Status.PENDING);
                task.setProject(project);
                taskRepo.save(task);
            });
        });
    }
    @Override
    @Transactional
    public void initSubtask() {
        taskRepo.findAll().forEach(task->{
            Stream.of("subtâche1", "subtâche2", "subtâche3", "subtâche4").forEach(title -> {
                Subtask subtask = new Subtask();
                subtask.setTitle(title);
                subtask.setDetail("Test");
                subtask.setPriority(Priority.ESSENTIAL);
                subtask.setStatus(Status.PENDING);
                subtask.setTask(task);
                subtaskRepo.save(subtask);
            });
        });
    }
    @Override
    @Transactional
    public void initProjectClient() {
        Stream.of(
                "BMCE", "Crédit du Maroc", "CIH", "ALBARID BANK", "BDSI",
                "ALLIANZ", "SAHAM", "SALAFIN", "FIMATECH", "RMA",
                "MARJANE", "ASWAK ASSALAM", "MR BRICOLAGE", "LABEL’VIE",
                "LYDEC", "LE360", "EURAFRIC", "DIGITAL VIRGO", "JETVIA",
                "MIGROS", "ALINEA"
        ).forEach(clientName -> {
            ProjectClient projectClient = new ProjectClient();
            projectClient.setName(clientName);
            projectClientRepo.save(projectClient);
        });
    }
}
