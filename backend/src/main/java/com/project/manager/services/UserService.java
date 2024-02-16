package com.project.manager.services;

import com.project.manager.dto.PersonDTO;
import com.project.manager.dto.UserDTO;
import com.project.manager.models.Person;
import com.project.manager.models.User;
import com.project.manager.repo.PersonRepo;
import com.project.manager.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
@CrossOrigin("*")
@Service
public class UserService {
    @Autowired
    public UserRepo userRepo;
    @Autowired
    public PersonRepo personRepo;

    public ResponseEntity<User> createUser(UserDTO userDTO, PersonDTO personDTO) {
        User user = new User();
        user.setLogin(userDTO.getLogin());
        user.setPassword(userDTO.getPassword());
        Optional<Person> personOptional = personRepo.findByEmail(personDTO.getEmail());
        personOptional.ifPresent(user::setPerson);
        userRepo.save(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    public ResponseEntity<User> updateUser(UserDTO userDTO, PersonDTO personDTO, Long id) {
        Optional<User> oldUser = userRepo.findById(id);
        if (oldUser.isPresent()) {
            User user = oldUser.get();
            user.setLogin(userDTO.getLogin());
            user.setPassword(userDTO.getPassword());
            Optional<Person> personOptional = personRepo.findByEmail(personDTO.getEmail());
            personOptional.ifPresent(user::setPerson);
            userRepo.save(user);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> userList = new ArrayList<>(userRepo.findAll());

            if (userList.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(userList, HttpStatus.OK);

        } catch (Exception ex) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<User> getUserById( Long id) {
        Optional<User> userData = userRepo.findById(id);

        if (userData.isPresent()) {
            return new ResponseEntity<>(userData.get(),HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    public ResponseEntity<HttpStatus> deleteUser( Long id) {
        userRepo.deleteById(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
