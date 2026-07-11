package com.kosmos.board.users.infrastructure.rest;

import com.kosmos.board.users.domain.model.User;
import com.kosmos.board.users.domain.port.in.ListUsersUseCase;
import com.kosmos.board.agenda.infrastructure.rest.dto.AgendaFeedUrlResponse;
import com.kosmos.board.users.infrastructure.rest.dto.MemberResponse;
import io.quarkus.security.Authenticated;
import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.NotFoundException;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import java.util.List;
import org.eclipse.microprofile.jwt.JsonWebToken;

@Path("/api/users")
@Produces(MediaType.APPLICATION_JSON)
@Authenticated
public class UserResource {

    private final ListUsersUseCase listUsersUseCase;

    @Inject
    JsonWebToken jwt;

    public UserResource(ListUsersUseCase listUsersUseCase) {
        this.listUsersUseCase = listUsersUseCase;
    }

    @GET
    public List<MemberResponse> listUsers() {
        return listUsersUseCase.listUsers().stream().map(MemberResponse::from).toList();
    }

    @GET
    @Path("/me/agenda-feed")
    public AgendaFeedUrlResponse getMyAgendaFeed() {
        String email = jwt.getClaim("email");
        User user = listUsersUseCase.listUsers().stream()
                .filter(u -> u.email().equalsIgnoreCase(email))
                .findFirst()
                .orElseThrow(NotFoundException::new);
        return AgendaFeedUrlResponse.from(user);
    }
}
