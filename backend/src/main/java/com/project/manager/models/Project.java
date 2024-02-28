package com.project.manager.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class Project implements Serializable {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    @Column(columnDefinition = "TEXT")
    private String detail;

    @Enumerated(EnumType.STRING)
    private Status status;
    @Enumerated(EnumType.STRING)
    private Priority priority;
    private Double realDaysConsumed;
    private Double plannedDays;
    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL)
    @JsonIgnore
    private Collection<Task> tasks;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "projectClient_id")
    private ProjectClient projectClient;
}