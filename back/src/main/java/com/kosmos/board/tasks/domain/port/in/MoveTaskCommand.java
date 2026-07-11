package com.kosmos.board.tasks.domain.port.in;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import java.util.UUID;

/**
 * Mirrors the frontend drag-and-drop gesture: a task moves to a target column
 * (status view) or a target assignee (person view), landing at a given position.
 */
public record MoveTaskCommand(UUID taskId, BoardColumn targetColumn, String targetAssignee, int targetPosition) {
}
