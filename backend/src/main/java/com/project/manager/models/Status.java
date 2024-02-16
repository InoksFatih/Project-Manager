package com.project.manager.models;

public enum Status {
    COMPLETED("Completed"),
    PENDING("Pending"),
    NOTSTARTED("Not Started", "NotStarted");

    private final String[] labels;

    Status(String... labels) {
        this.labels = labels;
    }

    public static Status valueOfLabel(String label) {
        for (Status status : values()) {
            for (String validLabel : status.labels) {
                if (validLabel.equalsIgnoreCase(label)) {
                    return status;
                }
            }
        }
        throw new IllegalArgumentException("Invalid status label: " + label);
    }
}
