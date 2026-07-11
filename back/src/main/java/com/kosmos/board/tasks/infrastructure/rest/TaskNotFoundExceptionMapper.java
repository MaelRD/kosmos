package com.kosmos.board.tasks.infrastructure.rest;

import com.kosmos.board.tasks.domain.exception.TaskNotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class TaskNotFoundExceptionMapper implements ExceptionMapper<TaskNotFoundException> {

    @Override
    public Response toResponse(TaskNotFoundException exception) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(new ErrorBody(exception.getMessage()))
                .build();
    }

    record ErrorBody(String message) {
    }
}
