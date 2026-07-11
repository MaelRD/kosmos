package com.kosmos.board.tasks.domain.port.in;

import java.util.UUID;

public interface DeleteTaskUseCase {

    void deleteTask(UUID taskId);
}
