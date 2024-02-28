package com.project.manager.models;

public enum Status {
    COMPLETED( "Terminé , Completed"),
    PENDING("En cours , Pending"),
    NOTSTARTED("Non commencé , Notstarted");

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
