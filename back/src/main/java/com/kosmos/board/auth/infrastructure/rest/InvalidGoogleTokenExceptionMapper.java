package com.kosmos.board.auth.infrastructure.rest;

import com.kosmos.board.auth.domain.exception.InvalidGoogleTokenException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class InvalidGoogleTokenExceptionMapper implements ExceptionMapper<InvalidGoogleTokenException> {

    @Override
    public Response toResponse(InvalidGoogleTokenException exception) {
        return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new ErrorBody(exception.getMessage()))
                .build();
    }

    record ErrorBody(String message) {
    }
}
