package com.kosmos.board.agenda.domain.port.in;

import java.time.OffsetDateTime;
import java.util.UUID;

public record UpdateAgendaEventCommand(
        UUID id,
        String title,
        String description,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        String assigneeEmail) {
}
