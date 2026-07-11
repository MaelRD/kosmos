package com.kosmos.board.agenda.domain.port.in;

import com.kosmos.board.agenda.domain.model.AgendaEvent;

public interface UpdateAgendaEventUseCase {

    AgendaEvent updateEvent(UpdateAgendaEventCommand command);
}
