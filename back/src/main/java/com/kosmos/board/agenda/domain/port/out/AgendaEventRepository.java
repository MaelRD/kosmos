package com.kosmos.board.agenda.domain.port.out;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface AgendaEventRepository {

    List<AgendaEvent> findBetween(OffsetDateTime from, OffsetDateTime to);

    Optional<AgendaEvent> findById(UUID id);

    AgendaEvent save(AgendaEvent event);

    void deleteById(UUID id);
}
