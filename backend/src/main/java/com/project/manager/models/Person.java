package com.project.manager.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Collection;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString

public class Person implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private Long phoneNumber;
    private boolean isActive;
    private int taskCount;
    private int subtaskCount;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Task> tasks;

    @OneToMany(mappedBy = "person", cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Subtask> subtasks;

}
