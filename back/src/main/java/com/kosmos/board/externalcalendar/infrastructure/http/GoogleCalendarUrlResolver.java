package com.kosmos.board.externalcalendar.infrastructure.http;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Turns whatever a user pastes from Google Calendar — a "cid=" share link, a bare calendar id,
 * or an already-direct .ics URL — into the public .ics feed URL.
 */
final class GoogleCalendarUrlResolver {

    private static final Pattern CID_PARAM = Pattern.compile("[?&]cid=([^&]+)");

    private GoogleCalendarUrlResolver() {
    }

    static String resolveIcsUrl(String rawInput) {
        String input = rawInput.trim();
        if (input.endsWith(".ics")) {
            return input;
        }
        Matcher matcher = CID_PARAM.matcher(input);
        String calendarId;
        if (matcher.find()) {
            String cid = java.net.URLDecoder.decode(matcher.group(1), StandardCharsets.UTF_8);
            calendarId = decodeBase64(cid);
        } else {
            calendarId = input;
        }
        String encoded = java.net.URLEncoder.encode(calendarId, StandardCharsets.UTF_8);
        return "https://calendar.google.com/calendar/ical/" + encoded + "/public/basic.ics";
    }

    private static String decodeBase64(String value) {
        String padded = value + "=".repeat((4 - value.length() % 4) % 4);
        try {
            return new String(Base64.getDecoder().decode(padded), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException e) {
            return value;
        }
    }
}
