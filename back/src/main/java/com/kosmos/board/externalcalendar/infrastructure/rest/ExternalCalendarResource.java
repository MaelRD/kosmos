package com.kosmos.board.externalcalendar.infrastructure.rest;

import com.kosmos.board.externalcalendar.domain.port.in.AddExternalCalendarSubscriptionUseCase;
import com.kosmos.board.externalcalendar.domain.port.in.AddExternalCalendarSubscriptionUseCase.AddExternalCalendarSubscriptionCommand;
import com.kosmos.board.externalcalendar.domain.port.in.ListExternalCalendarSubscriptionsUseCase;
import com.kosmos.board.externalcalendar.domain.port.in.ListExternalEventsUseCase;
import com.kosmos.board.externalcalendar.domain.port.in.RemoveExternalCalendarSubscriptionUseCase;
import com.kosmos.board.externalcalendar.infrastructure.rest.dto.ExternalCalendarSubscriptionRequest;
import com.kosmos.board.externalcalendar.infrastructure.rest.dto.ExternalCalendarSubscriptionResponse;
import com.kosmos.board.externalcalendar.infrastructure.rest.dto.ExternalEventResponse;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/external-calendars")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class ExternalCalendarResource {

    private final ListExternalCalendarSubscriptionsUseCase listSubscriptionsUseCase;
    private final AddExternalCalendarSubscriptionUseCase addSubscriptionUseCase;
    private final RemoveExternalCalendarSubscriptionUseCase removeSubscriptionUseCase;
    private final ListExternalEventsUseCase listExternalEventsUseCase;

    @Inject
    JsonWebToken jwt;

    public ExternalCalendarResource(
            ListExternalCalendarSubscriptionsUseCase listSubscriptionsUseCase,
            AddExternalCalendarSubscriptionUseCase addSubscriptionUseCase,
            RemoveExternalCalendarSubscriptionUseCase removeSubscriptionUseCase,
            ListExternalEventsUseCase listExternalEventsUseCase) {
        this.listSubscriptionsUseCase = listSubscriptionsUseCase;
        this.addSubscriptionUseCase = addSubscriptionUseCase;
        this.removeSubscriptionUseCase = removeSubscriptionUseCase;
        this.listExternalEventsUseCase = listExternalEventsUseCase;
    }

    private String currentUserEmail() {
        return jwt.<String>getClaim("email").toLowerCase();
    }

    @GET
    public List<ExternalCalendarSubscriptionResponse> listSubscriptions() {
        return listSubscriptionsUseCase.listSubscriptions(currentUserEmail()).stream()
                .map(ExternalCalendarSubscriptionResponse::from)
                .toList();
    }

    @POST
    public Response addSubscription(@Valid ExternalCalendarSubscriptionRequest request) {
        var created = addSubscriptionUseCase.addSubscription(
                new AddExternalCalendarSubscriptionCommand(currentUserEmail(), request.label(), request.sourceUrl()));
        return Response.created(URI.create("/api/external-calendars/" + created.id()))
                .entity(ExternalCalendarSubscriptionResponse.from(created))
                .build();
    }

    @DELETE
    @Path("/{id}")
    public Response removeSubscription(@PathParam("id") UUID id) {
        removeSubscriptionUseCase.removeSubscription(currentUserEmail(), id);
        return Response.noContent().build();
    }

    @GET
    @Path("/events")
    public List<ExternalEventResponse> listEvents(@QueryParam("from") String from, @QueryParam("to") String to) {
        if (from == null || to == null) {
            throw new BadRequestException("Both 'from' and 'to' query params are required (ISO-8601 instants)");
        }
        OffsetDateTime fromDate = OffsetDateTime.parse(from);
        OffsetDateTime toDate = OffsetDateTime.parse(to);
        return listExternalEventsUseCase.listExternalEvents(currentUserEmail(), fromDate, toDate).stream()
                .map(ExternalEventResponse::from)
                .toList();
    }
}
