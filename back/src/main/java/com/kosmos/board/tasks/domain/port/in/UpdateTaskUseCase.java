package com.kosmos.board.tasks.domain.port.in;

import com.kosmos.board.tasks.domain.model.Task;

public interface UpdateTaskUseCase {

    Task updateTask(UpdateTaskCommand command);
}
