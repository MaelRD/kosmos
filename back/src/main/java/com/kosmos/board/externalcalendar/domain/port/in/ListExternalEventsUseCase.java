package com.kosmos.board.externalcalendar.domain.port.in;

import com.kosmos.board.externalcalendar.domain.model.ExternalEvent;
import java.time.OffsetDateTime;
import java.util.List;

public interface ListExternalEventsUseCase {

    List<ExternalEvent> listExternalEvents(String ownerEmail, OffsetDateTime from, OffsetDateTime to);
}
