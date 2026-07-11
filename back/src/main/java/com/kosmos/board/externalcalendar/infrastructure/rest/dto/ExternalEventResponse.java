package com.kosmos.board.externalcalendar.infrastructure.rest.dto;

import com.kosmos.board.externalcalendar.domain.model.ExternalEvent;
import java.time.OffsetDateTime;

public record ExternalEventResponse(
        String uid,
        String title,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        String sourceLabel,
        String description,
        String location,
        String meetUrl) {

    public static ExternalEventResponse from(ExternalEvent event) {
        return new ExternalEventResponse(
                event.uid(),
                event.title(),
                event.startsAt(),
                event.endsAt(),
                event.sourceLabel(),
                event.description(),
                event.location(),
                event.meetUrl());
    }
}
