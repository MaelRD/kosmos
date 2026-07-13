package com.kosmos.board.tasks.infrastructure.persistence;

import com.kosmos.board.tasks.domain.model.Task;

final class TaskEntityMapper {

    private TaskEntityMapper() {
    }

    static Task toDomain(TaskEntity entity) {
        return new Task(
                entity.id,
                entity.title,
                entity.description,
                entity.type,
                entity.priority,
                entity.assignee,
                entity.column,
                entity.points,
                entity.label,
                entity.resolutionDays,
                entity.position,
                entity.createdAt);
    }

    static TaskEntity toEntity(Task task) {
        TaskEntity entity = new TaskEntity();
        entity.id = task.id();
        entity.title = task.title();
        entity.description = task.description();
        entity.type = task.type();
        entity.priority = task.priority();
        entity.assignee = task.assignee();
        entity.column = task.column();
        entity.points = task.points();
        entity.label = task.label();
        entity.resolutionDays = task.resolutionDays();
        entity.position = task.position();
        return entity;
    }
}
