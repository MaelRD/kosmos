package com.kosmos.board.tasks.domain.port.in;

import com.kosmos.board.tasks.domain.model.Task;
import java.util.List;

public interface ListTasksUseCase {

    List<Task> listTasks();
}
