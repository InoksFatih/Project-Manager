package com.project.manager.controllers;

import com.project.manager.dto.PersonDTO;
import com.project.manager.dto.UserDTO;

import com.project.manager.models.User;
import com.project.manager.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("*")
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/addUser")
    public ResponseEntity<User> addUser(@RequestBody UserDTO userDTO, PersonDTO personDTO) {
        return userService.createUser(userDTO,personDTO);
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        ResponseEntity<User> userById = userService.getUserById(id);
        return userById;
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<User>> getAllUsers() {
        ResponseEntity<List<User>> allUsers = userService.getAllUsers();
        return allUsers;
    }

    @PutMapping("/updateUser/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO, PersonDTO personDTO) {
        return userService.updateUser(userDTO,personDTO,id);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable Long id) {
        ResponseEntity<HttpStatus> deletedUser = userService.deleteUser(id);
        return deletedUser;
    }
}
