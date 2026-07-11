package com.kosmos.board.tasks.infrastructure.rest;

import com.kosmos.board.tasks.domain.model.Task;
import com.kosmos.board.tasks.domain.port.in.CreateTaskCommand;
import com.kosmos.board.tasks.domain.port.in.CreateTaskUseCase;
import com.kosmos.board.tasks.domain.port.in.DeleteTaskUseCase;
import com.kosmos.board.tasks.domain.port.in.ListTasksUseCase;
import com.kosmos.board.tasks.domain.port.in.MoveTaskCommand;
import com.kosmos.board.tasks.domain.port.in.MoveTaskUseCase;
import com.kosmos.board.tasks.domain.port.in.UpdateTaskCommand;
import com.kosmos.board.tasks.domain.port.in.UpdateTaskUseCase;
import com.kosmos.board.tasks.infrastructure.rest.dto.MoveTaskRequest;
import com.kosmos.board.tasks.infrastructure.rest.dto.TaskRequest;
import com.kosmos.board.tasks.infrastructure.rest.dto.TaskResponse;
import io.quarkus.security.Authenticated;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.util.List;
import java.util.UUID;

@Path("/api/tasks")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class TaskResource {

    private final ListTasksUseCase listTasksUseCase;
    private final CreateTaskUseCase createTaskUseCase;
    private final UpdateTaskUseCase updateTaskUseCase;
    private final MoveTaskUseCase moveTaskUseCase;
    private final DeleteTaskUseCase deleteTaskUseCase;

    public TaskResource(
            ListTasksUseCase listTasksUseCase,
            CreateTaskUseCase createTaskUseCase,
            UpdateTaskUseCase updateTaskUseCase,
            MoveTaskUseCase moveTaskUseCase,
            DeleteTaskUseCase deleteTaskUseCase) {
        this.listTasksUseCase = listTasksUseCase;
        this.createTaskUseCase = createTaskUseCase;
        this.updateTaskUseCase = updateTaskUseCase;
        this.moveTaskUseCase = moveTaskUseCase;
        this.deleteTaskUseCase = deleteTaskUseCase;
    }

    @GET
    public List<TaskResponse> listTasks() {
        return listTasksUseCase.listTasks().stream().map(TaskResponse::from).toList();
    }

    @POST
    public Response createTask(@Valid TaskRequest request) {
        Task created = createTaskUseCase.createTask(new CreateTaskCommand(
                request.title(), request.description(), request.type(), request.priority(),
                request.assignee(), request.column(), request.points(), request.label()));
        return Response.created(URI.create("/api/tasks/" + created.id()))
                .entity(TaskResponse.from(created))
                .build();
    }

    @PUT
    @Path("/{id}")
    public TaskResponse updateTask(@PathParam("id") UUID id, @Valid TaskRequest request) {
        Task updated = updateTaskUseCase.updateTask(new UpdateTaskCommand(
                id, request.title(), request.description(), request.type(), request.priority(),
                request.assignee(), request.column(), request.points(), request.label()));
        return TaskResponse.from(updated);
    }

    @PUT
    @Path("/{id}/move")
    public TaskResponse moveTask(@PathParam("id") UUID id, @Valid MoveTaskRequest request) {
        Task moved = moveTaskUseCase.moveTask(new MoveTaskCommand(
                id, request.targetColumn(), request.targetAssignee(), request.targetPosition()));
        return TaskResponse.from(moved);
    }

    @DELETE
    @Path("/{id}")
    public Response deleteTask(@PathParam("id") UUID id) {
        deleteTaskUseCase.deleteTask(id);
        return Response.noContent().build();
    }
}
