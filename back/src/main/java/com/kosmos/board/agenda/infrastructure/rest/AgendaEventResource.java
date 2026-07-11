package com.kosmos.board.agenda.infrastructure.rest;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import com.kosmos.board.agenda.domain.port.in.CreateAgendaEventCommand;
import com.kosmos.board.agenda.domain.port.in.CreateAgendaEventUseCase;
import com.kosmos.board.agenda.domain.port.in.DeleteAgendaEventUseCase;
import com.kosmos.board.agenda.domain.port.in.ListAgendaEventsUseCase;
import com.kosmos.board.agenda.domain.port.in.UpdateAgendaEventCommand;
import com.kosmos.board.agenda.domain.port.in.UpdateAgendaEventUseCase;
import com.kosmos.board.agenda.infrastructure.rest.dto.AgendaEventRequest;
import com.kosmos.board.agenda.infrastructure.rest.dto.AgendaEventResponse;
import io.quarkus.security.Authenticated;
import jakarta.validation.Valid;
import jakarta.ws.rs.BadRequestException;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
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

@Path("/api/agenda-events")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@Authenticated
public class AgendaEventResource {

    private final ListAgendaEventsUseCase listAgendaEventsUseCase;
    private final CreateAgendaEventUseCase createAgendaEventUseCase;
    private final UpdateAgendaEventUseCase updateAgendaEventUseCase;
    private final DeleteAgendaEventUseCase deleteAgendaEventUseCase;

    public AgendaEventResource(
            ListAgendaEventsUseCase listAgendaEventsUseCase,
            CreateAgendaEventUseCase createAgendaEventUseCase,
            UpdateAgendaEventUseCase updateAgendaEventUseCase,
            DeleteAgendaEventUseCase deleteAgendaEventUseCase) {
        this.listAgendaEventsUseCase = listAgendaEventsUseCase;
        this.createAgendaEventUseCase = createAgendaEventUseCase;
        this.updateAgendaEventUseCase = updateAgendaEventUseCase;
        this.deleteAgendaEventUseCase = deleteAgendaEventUseCase;
    }

    @GET
    public List<AgendaEventResponse> listEvents(@QueryParam("from") String from, @QueryParam("to") String to) {
        if (from == null || to == null) {
            throw new BadRequestException("Both 'from' and 'to' query params are required (ISO-8601 instants)");
        }
        OffsetDateTime fromDate = OffsetDateTime.parse(from);
        OffsetDateTime toDate = OffsetDateTime.parse(to);
        return listAgendaEventsUseCase.listBetween(fromDate, toDate).stream().map(AgendaEventResponse::from).toList();
    }

    @POST
    public Response createEvent(@Valid AgendaEventRequest request) {
        AgendaEvent created = createAgendaEventUseCase.createEvent(new CreateAgendaEventCommand(
                request.title(), request.description(), request.startsAt(), request.endsAt(), request.assigneeEmail()));
        return Response.created(URI.create("/api/agenda-events/" + created.id()))
                .entity(AgendaEventResponse.from(created))
                .build();
    }

    @PUT
    @Path("/{id}")
    public AgendaEventResponse updateEvent(@PathParam("id") UUID id, @Valid AgendaEventRequest request) {
        AgendaEvent updated = updateAgendaEventUseCase.updateEvent(new UpdateAgendaEventCommand(
                id, request.title(), request.description(), request.startsAt(), request.endsAt(), request.assigneeEmail()));
        return AgendaEventResponse.from(updated);
    }

    @DELETE
    @Path("/{id}")
    public Response deleteEvent(@PathParam("id") UUID id) {
        deleteAgendaEventUseCase.deleteEvent(id);
        return Response.noContent().build();
    }
}
