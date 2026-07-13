package com.kosmos.board.tasks.domain.model;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

/**
 * Aggregate root of the board. Immutable — every mutation returns a new instance so the
 * application layer stays in control of persistence and event boundaries.
 */
public final class Task {

    private final UUID id;
    private final String title;
    private final String description;
    private final TaskType type;
    private final Priority priority;
    private final String assignee;
    private final BoardColumn column;
    private final int points;
    private final String label;
    private final Integer resolutionDays;
    private final int position;
    private final OffsetDateTime createdAt;

    public Task(
            UUID id,
            String title,
            String description,
            TaskType type,
            Priority priority,
            String assignee,
            BoardColumn column,
            int points,
            String label,
            Integer resolutionDays,
            int position,
            OffsetDateTime createdAt) {
        this.id = Objects.requireNonNull(id, "id");
        this.title = requireNonBlank(title, "title");
        this.description = description == null ? "" : description;
        this.type = Objects.requireNonNull(type, "type");
        this.priority = Objects.requireNonNull(priority, "priority");
        this.assignee = requireNonBlank(assignee, "assignee");
        this.column = Objects.requireNonNull(column, "column");
        this.points = points;
        this.label = requireNonBlank(label, "label");
        this.resolutionDays = resolutionDays;
        this.position = position;
        this.createdAt = createdAt;
    }

    public static Task create(
            String title,
            String description,
            TaskType type,
            Priority priority,
            String assignee,
            BoardColumn column,
            int points,
            String label,
            int position) {
        return new Task(
                UUID.randomUUID(), title, description, type, priority, assignee, column, points, label, null,
                position, null);
    }

    public Task withDetails(String title, String description, TaskType type, Priority priority,
                             String assignee, BoardColumn column, int points, String label) {
        return new Task(id, title, description, type, priority, assignee, column, points, label, resolutionDays,
                position, createdAt);
    }

    public Task movedTo(BoardColumn newColumn, String newAssignee, int newPosition) {
        Integer newResolutionDays = newColumn == BoardColumn.DONE && this.column != BoardColumn.DONE
                ? Integer.valueOf(0)
                : this.resolutionDays;
        return new Task(id, title, description, type, priority, newAssignee, newColumn, points, label,
                newResolutionDays, newPosition, createdAt);
    }

    private static String requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " must not be blank");
        }
        return value;
    }

    public UUID id() {
        return id;
    }

    public String title() {
        return title;
    }

    public String description() {
        return description;
    }

    public TaskType type() {
        return type;
    }

    public Priority priority() {
        return priority;
    }

    public String assignee() {
        return assignee;
    }

    public BoardColumn column() {
        return column;
    }

    public int points() {
        return points;
    }

    public String label() {
        return label;
    }

    public Integer resolutionDays() {
        return resolutionDays;
    }

    public int position() {
        return position;
    }

    public OffsetDateTime createdAt() {
        return createdAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Task task)) return false;
        return id.equals(task.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
