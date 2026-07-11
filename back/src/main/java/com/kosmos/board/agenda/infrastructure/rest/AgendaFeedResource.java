package com.kosmos.board.agenda.infrastructure.rest;

import com.kosmos.board.agenda.domain.port.in.GetAgendaFeedUseCase;
import com.kosmos.board.agenda.infrastructure.rest.ical.IcsCalendarWriter;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Response;
import java.util.UUID;

/**
 * Unauthenticated by design: Google Calendar's "From URL" subscription polls this endpoint
 * without credentials, so the {@code icalToken} path segment (a per-user random UUID) is the
 * only access control.
 */
@Path("/api/agenda-feed")
public class AgendaFeedResource {

    private static final String ICAL_MEDIA_TYPE = "text/calendar; charset=utf-8";

    private final GetAgendaFeedUseCase getAgendaFeedUseCase;

    public AgendaFeedResource(GetAgendaFeedUseCase getAgendaFeedUseCase) {
        this.getAgendaFeedUseCase = getAgendaFeedUseCase;
    }

    @GET
    @Path("/{icalToken}.ics")
    @Produces(ICAL_MEDIA_TYPE)
    public Response getFeed(@PathParam("icalToken") UUID icalToken) {
        GetAgendaFeedUseCase.AgendaFeed feed = getAgendaFeedUseCase.getFeed(icalToken);
        String body = IcsCalendarWriter.write("Agenda de " + feed.owner().name() + " — Kosmos", feed.events());
        return Response.ok(body, ICAL_MEDIA_TYPE).build();
    }
}
