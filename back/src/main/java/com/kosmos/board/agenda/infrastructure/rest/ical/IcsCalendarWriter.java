package com.kosmos.board.agenda.infrastructure.rest.ical;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.List;

public final class IcsCalendarWriter {

    private static final DateTimeFormatter UTC_STAMP = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'");

    private IcsCalendarWriter() {
    }

    public static String write(String calendarName, List<AgendaEvent> events) {
        StringBuilder sb = new StringBuilder();
        line(sb, "BEGIN:VCALENDAR");
        line(sb, "VERSION:2.0");
        line(sb, "PRODID:-//Kosmos//Agenda//ES");
        line(sb, "CALSCALE:GREGORIAN");
        line(sb, "METHOD:PUBLISH");
        line(sb, "X-WR-CALNAME:" + escape(calendarName));
        line(sb, "X-PUBLISHED-TTL:PT1H");
        String stamp = OffsetDateTime.now(ZoneOffset.UTC).format(UTC_STAMP);
        for (AgendaEvent event : events) {
            line(sb, "BEGIN:VEVENT");
            line(sb, "UID:" + event.id() + "@kosmos.dev");
            line(sb, "DTSTAMP:" + stamp);
            line(sb, "DTSTART:" + event.startsAt().withOffsetSameInstant(ZoneOffset.UTC).format(UTC_STAMP));
            line(sb, "DTEND:" + event.endsAt().withOffsetSameInstant(ZoneOffset.UTC).format(UTC_STAMP));
            line(sb, "SUMMARY:" + escape(event.title()));
            if (!event.description().isBlank()) {
                line(sb, "DESCRIPTION:" + escape(event.description()));
            }
            line(sb, "END:VEVENT");
        }
        line(sb, "END:VCALENDAR");
        return sb.toString();
    }

    private static String escape(String value) {
        return value
                .replace("\\", "\\\\")
                .replace(";", "\\;")
                .replace(",", "\\,")
                .replace("\n", "\\n");
    }

    /** Folds each line to 75 octets per RFC 5545 §3.1 before appending it, CRLF-terminated. */
    private static void line(StringBuilder sb, String content) {
        int limit = 75;
        int start = 0;
        boolean first = true;
        while (start < content.length()) {
            int chunkLimit = first ? limit : limit - 1;
            int end = Math.min(content.length(), start + chunkLimit);
            if (!first) {
                sb.append(' ');
            }
            sb.append(content, start, end).append("\r\n");
            start = end;
            first = false;
        }
        if (content.isEmpty()) {
            sb.append("\r\n");
        }
    }
}
