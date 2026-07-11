package com.kosmos.board.tasks.infrastructure.rest.dto;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Priority;
import com.kosmos.board.tasks.domain.model.Task;
import com.kosmos.board.tasks.domain.model.TaskType;
import java.util.UUID;

public record TaskResponse(
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
        int position) {

    public static TaskResponse from(Task task) {
        return new TaskResponse(
                task.id(),
                task.title(),
                task.description(),
                task.type(),
                task.priority(),
                task.assignee(),
                task.column(),
                task.points(),
                task.label(),
                task.resolutionDays(),
                task.position());
    }
}
