package com.kosmos.board.agenda.infrastructure.rest;

import com.kosmos.board.agenda.domain.exception.AgendaEventNotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class AgendaEventNotFoundExceptionMapper implements ExceptionMapper<AgendaEventNotFoundException> {

    @Override
    public Response toResponse(AgendaEventNotFoundException exception) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(new ErrorBody(exception.getMessage()))
                .build();
    }

    record ErrorBody(String message) {
    }
}
