package com.kosmos.board.tasks.domain.port.out;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Task;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Outbound port. The domain and application layers depend on this interface only —
 * persistence technology lives entirely behind the infrastructure adapter.
 */
public interface TaskRepository {

    List<Task> findAll();

    Optional<Task> findById(UUID id);

    Task save(Task task);

    void deleteById(UUID id);

    int nextPosition(BoardColumn column);
}
