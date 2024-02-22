package com.project.manager.dto;

import com.project.manager.models.Person;
import com.project.manager.models.Priority;
import com.project.manager.models.Status;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SubtaskDTO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String detail;
    private Date dueDate;
    private Person person;
    private String status;
    private String priority;
    private double realDaysConsumed;
    private double plannedDays;
    public Status getStatusEnum() {
        return Status.valueOfLabel(status);
    }

    public Priority getPriorityEnum() {
        return Priority.valueOfLabel(priority);
    }
    private String normalizeLabel(String label) {
        // Normalize the label by converting it to lowercase and removing spaces
        return label.toLowerCase().replaceAll("\\s+", "");
    }
}
