package com.kosmos.board.agenda.domain.port.in;

import java.time.OffsetDateTime;

public record CreateAgendaEventCommand(
        String title, String description, OffsetDateTime startsAt, OffsetDateTime endsAt, String assigneeEmail) {
}
