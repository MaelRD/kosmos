package com.kosmos.board.auth.infrastructure.rest;

import com.kosmos.board.auth.domain.exception.EmailAlreadyRegisteredException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class EmailAlreadyRegisteredExceptionMapper implements ExceptionMapper<EmailAlreadyRegisteredException> {

    @Override
    public Response toResponse(EmailAlreadyRegisteredException exception) {
        return Response.status(Response.Status.CONFLICT)
                .entity(new ErrorBody(exception.getMessage()))
                .build();
    }

    record ErrorBody(String message) {
    }
}
