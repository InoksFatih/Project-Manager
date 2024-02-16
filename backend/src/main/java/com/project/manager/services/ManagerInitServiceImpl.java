package com.project.manager.services;

import java.util.Date;
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


    @Override
    public void initAttachement() {

    }
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
    @Transactional
    @Override
    public void initProject() {
        Stream.of("Project1","Project2","Project3","Project4").forEach(title->{
            Project project=new Project();
            project.setTitle(title);
            project.setDetail("details");
            project.setDueDate(new Date());
            project.setStatus(Status.PENDING);
            project.setPriority(Priority.ESSENTIAL);
            projectRepo.save(project);
        });
    }

    @Override
    @Transactional
    public void initTask() {
        projectRepo.findAll().forEach(p->{
            Stream.of("Task1","Task2","Task3","Task4").forEach(title->{
                Task task=new Task();
                task.setTitle(title);
                task.setDetail("Details");
                task.setDueDate(new Date());
                task.setPriority(Priority.ESSENTIAL);
                task.setStatus(Status.PENDING);
                task.setProject(p);
                taskRepo.save(task);
            });
        });
    }
    @Override
    @Transactional
    public void initSubtask() {
        taskRepo.findAll().forEach(task->{
            Stream.of("subtask1", "subtask2", "subtask3", "subtask4").forEach(title -> {
                Subtask subtask = new Subtask();
                subtask.setTitle(title);
                subtask.setDetail("Details2");
                subtask.setDueDate(new Date());
                subtask.setPriority(Priority.ESSENTIAL);
                subtask.setStatus(Status.PENDING);
                subtask.setTask(task);
                subtaskRepo.save(subtask);
            });
        });
    }
    @Override
    public void initUser() {

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
