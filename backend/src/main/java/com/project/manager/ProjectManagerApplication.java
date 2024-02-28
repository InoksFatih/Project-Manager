package com.project.manager;

import com.project.manager.services.IManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class ProjectManagerApplication implements CommandLineRunner {
	 @Autowired
	 private IManagerService managerService;

	public static void main(String[] args) {
		SpringApplication.run(ProjectManagerApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		managerService.initProject();
		managerService.initPerson();
		managerService.initTask();
		managerService.initSubtask();
		managerService.initProjectClient();
}
}