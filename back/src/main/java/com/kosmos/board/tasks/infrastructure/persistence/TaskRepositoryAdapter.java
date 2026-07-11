package com.kosmos.board.tasks.infrastructure.persistence;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Task;
import com.kosmos.board.tasks.domain.port.out.TaskRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class TaskRepositoryAdapter implements TaskRepository {

    private final TaskPanacheRepository panacheRepository;

    public TaskRepositoryAdapter(TaskPanacheRepository panacheRepository) {
        this.panacheRepository = panacheRepository;
    }

    @Override
    public List<Task> findAll() {
        return panacheRepository.listAll().stream().map(TaskEntityMapper::toDomain).toList();
    }

    @Override
    public Optional<Task> findById(UUID id) {
        return panacheRepository.findByIdOptional(id).map(TaskEntityMapper::toDomain);
    }

    @Override
    public Task save(Task task) {
        TaskEntity entity = TaskEntityMapper.toEntity(task);
        panacheRepository.getEntityManager().merge(entity);
        return task;
    }

    @Override
    public void deleteById(UUID id) {
        panacheRepository.delete("id", id);
    }

    @Override
    public int nextPosition(BoardColumn column) {
        return (int) panacheRepository.count("column", column);
    }
}
