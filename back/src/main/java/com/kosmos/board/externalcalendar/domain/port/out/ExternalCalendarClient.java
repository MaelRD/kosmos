package com.kosmos.board.externalcalendar.domain.port.out;

import com.kosmos.board.externalcalendar.domain.model.ExternalEvent;
import java.time.OffsetDateTime;
import java.util.List;

public interface ExternalCalendarClient {

    /**
     * Fetches and parses the given calendar's public feed. {@code sourceUrl} accepts a
     * Google Calendar "cid" share link, a bare calendar id, or a direct .ics URL.
     */
    List<ExternalEvent> fetchEvents(String sourceUrl, String sourceLabel, OffsetDateTime from, OffsetDateTime to);
}
