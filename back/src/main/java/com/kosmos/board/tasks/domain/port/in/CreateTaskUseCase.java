package com.kosmos.board.tasks.domain.port.in;

import com.kosmos.board.tasks.domain.model.Task;

public interface CreateTaskUseCase {

    Task createTask(CreateTaskCommand command);
}
