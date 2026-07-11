package com.kosmos.board.agenda.domain.exception;

import java.util.UUID;

public class AgendaEventNotFoundException extends RuntimeException {

    public AgendaEventNotFoundException(UUID id) {
        super("Agenda event not found: " + id);
    }
}
