package com.kosmos.board.tasks.domain.port.in;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Priority;
import com.kosmos.board.tasks.domain.model.TaskType;
import java.util.UUID;

public record UpdateTaskCommand(
        UUID taskId,
        String title,
        String description,
        TaskType type,
        Priority priority,
        String assignee,
        BoardColumn column,
        int points,
        String label) {
}
