package com.kosmos.board.agenda.infrastructure.rest.dto;

import com.kosmos.board.users.domain.model.User;

public record AgendaFeedUrlResponse(String feedPath) {

    public static AgendaFeedUrlResponse from(User user) {
        return new AgendaFeedUrlResponse("/api/agenda-feed/" + user.icalToken() + ".ics");
    }
}
