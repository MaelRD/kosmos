package com.kosmos.board.externalcalendar.domain.model;

import java.time.OffsetDateTime;

public record ExternalEvent(
        String uid,
        String title,
        OffsetDateTime startsAt,
        OffsetDateTime endsAt,
        String sourceLabel,
        String description,
        String location,
        String meetUrl) {
}
