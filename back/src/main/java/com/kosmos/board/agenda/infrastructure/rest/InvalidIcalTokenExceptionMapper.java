package com.kosmos.board.agenda.infrastructure.rest;

import com.kosmos.board.agenda.domain.exception.InvalidIcalTokenException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class InvalidIcalTokenExceptionMapper implements ExceptionMapper<InvalidIcalTokenException> {

    @Override
    public Response toResponse(InvalidIcalTokenException exception) {
        return Response.status(Response.Status.NOT_FOUND).entity(exception.getMessage()).build();
    }
}
