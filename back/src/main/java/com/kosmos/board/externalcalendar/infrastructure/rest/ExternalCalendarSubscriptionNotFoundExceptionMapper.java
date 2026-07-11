package com.kosmos.board.externalcalendar.infrastructure.rest;

import com.kosmos.board.externalcalendar.domain.exception.ExternalCalendarSubscriptionNotFoundException;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

@Provider
public class ExternalCalendarSubscriptionNotFoundExceptionMapper
        implements ExceptionMapper<ExternalCalendarSubscriptionNotFoundException> {

    @Override
    public Response toResponse(ExternalCalendarSubscriptionNotFoundException exception) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity(new ErrorBody(exception.getMessage()))
                .build();
    }

    record ErrorBody(String message) {
    }
}
