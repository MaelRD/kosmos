package com.kosmos.board.tasks.infrastructure.rest.dto;

import com.kosmos.board.tasks.domain.model.BoardColumn;

public record MoveTaskRequest(BoardColumn targetColumn, String targetAssignee, int targetPosition) {
}
