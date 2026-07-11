package com.kosmos.board.agenda.domain.port.in;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import java.time.OffsetDateTime;
import java.util.List;

public interface ListAgendaEventsUseCase {

    List<AgendaEvent> listBetween(OffsetDateTime from, OffsetDateTime to);
}
