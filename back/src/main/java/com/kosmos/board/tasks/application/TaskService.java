package com.kosmos.board.tasks.application;

import com.kosmos.board.tasks.domain.exception.TaskNotFoundException;
import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.BoardReport;
import com.kosmos.board.tasks.domain.model.Priority;
import com.kosmos.board.tasks.domain.model.Task;
import com.kosmos.board.tasks.domain.port.in.CreateTaskCommand;
import com.kosmos.board.tasks.domain.port.in.CreateTaskUseCase;
import com.kosmos.board.tasks.domain.port.in.DeleteTaskUseCase;
import com.kosmos.board.tasks.domain.port.in.GetBoardReportUseCase;
import com.kosmos.board.tasks.domain.port.in.ListTasksUseCase;
import com.kosmos.board.tasks.domain.port.in.MoveTaskCommand;
import com.kosmos.board.tasks.domain.port.in.MoveTaskUseCase;
import com.kosmos.board.tasks.domain.port.in.UpdateTaskCommand;
import com.kosmos.board.tasks.domain.port.in.UpdateTaskUseCase;
import com.kosmos.board.tasks.domain.port.out.TaskRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class TaskService implements
        ListTasksUseCase,
        CreateTaskUseCase,
        UpdateTaskUseCase,
        MoveTaskUseCase,
        DeleteTaskUseCase,
        GetBoardReportUseCase {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<Task> listTasks() {
        return taskRepository.findAll();
    }

    @Override
    @Transactional
    public Task createTask(CreateTaskCommand command) {
        int position = taskRepository.nextPosition(command.column());
        Task task = Task.create(
                command.title(),
                command.description(),
                command.type(),
                command.priority(),
                command.assignee(),
                command.column(),
                command.points(),
                command.label(),
                position);
        return taskRepository.save(task);
    }

    @Override
    @Transactional
    public Task updateTask(UpdateTaskCommand command) {
        Task existing = taskRepository.findById(command.taskId())
                .orElseThrow(() -> new TaskNotFoundException(command.taskId()));
        Task updated = existing.withDetails(
                command.title(),
                command.description(),
                command.type(),
                command.priority(),
                command.assignee(),
                command.column(),
                command.points(),
                command.label());
        return taskRepository.save(updated);
    }

    @Override
    @Transactional
    public Task moveTask(MoveTaskCommand command) {
        Task existing = taskRepository.findById(command.taskId())
                .orElseThrow(() -> new TaskNotFoundException(command.taskId()));
        BoardColumn targetColumn = command.targetColumn() != null ? command.targetColumn() : existing.column();
        String targetAssignee = command.targetAssignee() != null ? command.targetAssignee() : existing.assignee();
        Task moved = existing.movedTo(targetColumn, targetAssignee, command.targetPosition());
        return taskRepository.save(moved);
    }

    @Override
    @Transactional
    public void deleteTask(UUID taskId) {
        if (taskRepository.findById(taskId).isEmpty()) {
            throw new TaskNotFoundException(taskId);
        }
        taskRepository.deleteById(taskId);
    }

    @Override
    public BoardReport getReport() {
        List<Task> tasks = taskRepository.findAll();
        int total = tasks.size();
        long done = tasks.stream().filter(t -> t.column() == BoardColumn.DONE).count();
        long progress = tasks.stream().filter(t -> t.column() == BoardColumn.PROGRESS).count();
        int percentDone = total == 0 ? 0 : Math.round((done * 100f) / total);
        Double avgResolution = average(tasks.stream()
                .filter(t -> t.column() == BoardColumn.DONE && t.resolutionDays() != null)
                .map(Task::resolutionDays)
                .toList());

        Map<String, List<Task>> byAssignee = tasks.stream().collect(Collectors.groupingBy(Task::assignee));
        String topPerformer = byAssignee.entrySet().stream()
                .max(Comparator.comparingLong(e -> e.getValue().stream().filter(t -> t.column() == BoardColumn.DONE).count()))
                .map(Map.Entry::getKey)
                .orElse(null);
        String mostActive = byAssignee.entrySet().stream()
                .max(Comparator.comparingInt(e -> e.getValue().size()))
                .map(Map.Entry::getKey)
                .orElse(null);

        List<BoardReport.MemberStat> memberStats = byAssignee.entrySet().stream()
                .map(entry -> {
                    List<Task> assigned = entry.getValue();
                    long doneCount = assigned.stream().filter(t -> t.column() == BoardColumn.DONE).count();
                    int pct = assigned.isEmpty() ? 0 : Math.round((doneCount * 100f) / assigned.size());
                    Double avgDays = average(assigned.stream()
                            .filter(t -> t.column() == BoardColumn.DONE && t.resolutionDays() != null)
                            .map(Task::resolutionDays)
                            .toList());
                    return new BoardReport.MemberStat(
                            entry.getKey(),
                            assigned.size(),
                            doneCount,
                            pct,
                            avgDays,
                            entry.getKey().equals(topPerformer),
                            entry.getKey().equals(mostActive));
                })
                .sorted(Comparator.comparingLong(BoardReport.MemberStat::done).reversed())
                .toList();

        List<BoardReport.PriorityStat> priorityStats = List.of(Priority.values()).stream()
                .map(priority -> {
                    long count = tasks.stream().filter(t -> t.priority() == priority).count();
                    int pct = total == 0 ? 0 : Math.round((count * 100f) / total);
                    return new BoardReport.PriorityStat(priority, count, pct);
                })
                .toList();

        return new BoardReport(total, (int) done, (int) progress, percentDone, avgResolution, memberStats, priorityStats);
    }

    private static Double average(List<Integer> values) {
        if (values.isEmpty()) {
            return null;
        }
        return Math.round(values.stream().mapToInt(Integer::intValue).average().orElse(0) * 10) / 10.0;
    }
}
