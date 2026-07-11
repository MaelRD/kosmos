package com.kosmos.board.externalcalendar.infrastructure.http;

import com.kosmos.board.externalcalendar.domain.model.ExternalEvent;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Minimal RFC 5545 reader for the subset Google Calendar's public .ics export uses. Does not
 * expand RRULE recurrences — a recurring series shows only its first occurrence.
 */
final class IcsCalendarParser {

    private static final Logger LOG = Logger.getLogger(IcsCalendarParser.class.getName());
    private static final DateTimeFormatter DATE_TIME = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss");
    private static final DateTimeFormatter DATE_ONLY = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final Pattern MEET_URL = Pattern.compile("https://meet\\.google\\.com/[a-z0-9-]+");

    private IcsCalendarParser() {
    }

    static List<ExternalEvent> parse(String icsText, String sourceLabel) {
        List<ExternalEvent> events = new ArrayList<>();
        for (String block : unfold(icsText).split("BEGIN:VEVENT")) {
            int end = block.indexOf("END:VEVENT");
            if (end < 0) {
                continue;
            }
            try {
                ExternalEvent event = parseEvent(block.substring(0, end), sourceLabel);
                if (event != null) {
                    events.add(event);
                }
            } catch (RuntimeException e) {
                LOG.log(Level.WARNING, "Skipping unparseable VEVENT from " + sourceLabel, e);
            }
        }
        return events;
    }

    private static ExternalEvent parseEvent(String block, String sourceLabel) {
        String uid = null;
        String summary = null;
        String description = null;
        String location = null;
        String conferenceUrl = null;
        OffsetDateTime start = null;
        OffsetDateTime end = null;
        for (String line : block.split("\r\n|\n")) {
            if (line.isBlank()) {
                continue;
            }
            int colon = line.indexOf(':');
            if (colon < 0) {
                continue;
            }
            String[] nameAndParams = line.substring(0, colon).split(";");
            String name = nameAndParams[0];
            String value = line.substring(colon + 1).trim();
            switch (name) {
                case "UID" -> uid = value;
                case "SUMMARY" -> summary = unescape(value);
                case "DESCRIPTION" -> description = unescape(value);
                case "LOCATION" -> location = unescape(value);
                case "URL", "X-GOOGLE-CONFERENCE", "CONFERENCE" -> conferenceUrl = value;
                case "DTSTART" -> start = parseDateTime(value, nameAndParams);
                case "DTEND" -> end = parseDateTime(value, nameAndParams);
                default -> {
                }
            }
        }
        if (start == null || end == null) {
            return null;
        }
        String meetUrl = findMeetUrl(conferenceUrl, description, location);
        return new ExternalEvent(
                uid,
                summary == null || summary.isBlank() ? "(sin título)" : summary,
                start,
                end,
                sourceLabel,
                description,
                location,
                meetUrl);
    }

    private static String findMeetUrl(String... candidates) {
        for (String candidate : candidates) {
            if (candidate == null) {
                continue;
            }
            Matcher matcher = MEET_URL.matcher(candidate);
            if (matcher.find()) {
                return matcher.group();
            }
        }
        return null;
    }

    private static OffsetDateTime parseDateTime(String value, String[] nameAndParams) {
        if (value.endsWith("Z")) {
            return LocalDateTime.parse(value.substring(0, value.length() - 1), DATE_TIME).atOffset(ZoneOffset.UTC);
        }
        String tzid = findParam(nameAndParams, "TZID");
        if (value.length() == 8) {
            LocalDate date = LocalDate.parse(value, DATE_ONLY);
            ZoneId zone = tzid != null ? ZoneId.of(tzid) : ZoneOffset.UTC;
            return date.atStartOfDay(zone).toOffsetDateTime();
        }
        LocalDateTime local = LocalDateTime.parse(value, DATE_TIME);
        ZoneId zone = tzid != null ? ZoneId.of(tzid) : ZoneOffset.UTC;
        return local.atZone(zone).toOffsetDateTime();
    }

    private static String findParam(String[] nameAndParams, String paramName) {
        for (String param : nameAndParams) {
            if (param.startsWith(paramName + "=")) {
                return param.substring(paramName.length() + 1);
            }
        }
        return null;
    }

    private static String unescape(String value) {
        return value.replace("\\n", "\n").replace("\\,", ",").replace("\\;", ";").replace("\\\\", "\\");
    }

    /** Reverses RFC 5545 §3.1 line folding: continuation lines start with a space or tab. */
    private static String unfold(String icsText) {
        return icsText.replaceAll("\r\n[ \t]", "").replaceAll("\n[ \t]", "");
    }
}
