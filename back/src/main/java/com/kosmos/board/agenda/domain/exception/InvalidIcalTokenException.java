package com.kosmos.board.agenda.domain.exception;

import java.util.UUID;

public class InvalidIcalTokenException extends RuntimeException {

    public InvalidIcalTokenException(UUID icalToken) {
        super("Invalid iCal feed token: " + icalToken);
    }
}
