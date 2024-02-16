package com.project.manager.models;

public enum Priority {
    IMPORTANT("Important"),
    ESSENTIAL("Essential"),
    SECONDAIRE("Secondaire");

    private final String label;

    Priority(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static Priority valueOfLabel(String label) {
        for (Priority priority : values()) {
            if (priority.label.equalsIgnoreCase(label)) {
                return priority;
            }
        }
        throw new IllegalArgumentException("Invalid priority label: " + label);
    }
}
