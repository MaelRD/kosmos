package com.kosmos.board.externalcalendar.domain.exception;

import java.util.UUID;

public class ExternalCalendarSubscriptionNotFoundException extends RuntimeException {

    public ExternalCalendarSubscriptionNotFoundException(UUID id) {
        super("External calendar subscription not found: " + id);
    }
}
