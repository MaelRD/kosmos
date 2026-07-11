package com.kosmos.board.tasks.domain.port.in;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Priority;
import com.kosmos.board.tasks.domain.model.TaskType;

public record CreateTaskCommand(
        String title,
        String description,
        TaskType type,
        Priority priority,
        String assignee,
        BoardColumn column,
        int points,
        String label) {
}
