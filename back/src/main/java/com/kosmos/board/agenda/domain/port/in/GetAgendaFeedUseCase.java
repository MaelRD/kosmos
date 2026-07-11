package com.kosmos.board.agenda.domain.port.in;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import com.kosmos.board.users.domain.model.User;
import java.util.List;
import java.util.UUID;

public interface GetAgendaFeedUseCase {

    AgendaFeed getFeed(UUID icalToken);

    record AgendaFeed(User owner, List<AgendaEvent> events) {
    }
}
