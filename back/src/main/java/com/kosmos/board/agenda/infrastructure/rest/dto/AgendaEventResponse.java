package com.kosmos.board.agenda.infrastructure.rest.dto;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import java.time.OffsetDateTime;
import java.util.UUID;

public record AgendaEventResponse(
        UUID id, String title, String description, OffsetDateTime startsAt, OffsetDateTime endsAt, String assigneeEmail) {

    public static AgendaEventResponse from(AgendaEvent event) {
        return new AgendaEventResponse(
                event.id(), event.title(), event.description(), event.startsAt(), event.endsAt(), event.assigneeEmail());
    }
}
