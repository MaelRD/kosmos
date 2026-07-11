package com.kosmos.board.agenda.domain.port.in;

import java.util.UUID;

public interface DeleteAgendaEventUseCase {

    void deleteEvent(UUID id);
}
