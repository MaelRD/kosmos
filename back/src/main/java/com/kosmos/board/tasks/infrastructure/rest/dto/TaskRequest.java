package com.kosmos.board.tasks.infrastructure.rest.dto;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Priority;
import com.kosmos.board.tasks.domain.model.TaskType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskRequest(
        @NotBlank String title,
        String description,
        @NotNull TaskType type,
        @NotNull Priority priority,
        @NotBlank String assignee,
        @NotNull BoardColumn column,
        @Min(0) int points,
        @NotBlank String label) {
}
