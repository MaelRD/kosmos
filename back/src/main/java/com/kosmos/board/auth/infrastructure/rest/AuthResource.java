package com.kosmos.board.auth.infrastructure.rest;

import com.kosmos.board.auth.domain.port.in.GoogleAuthCommand;
import com.kosmos.board.auth.domain.port.in.GoogleAuthUseCase;
import com.kosmos.board.auth.domain.port.in.LoginCommand;
import com.kosmos.board.auth.domain.port.in.LoginUseCase;
import com.kosmos.board.auth.domain.port.in.RegisterCommand;
import com.kosmos.board.auth.domain.port.in.RegisterUseCase;
import com.kosmos.board.auth.infrastructure.rest.dto.AuthResponse;
import com.kosmos.board.auth.infrastructure.rest.dto.GoogleAuthRequest;
import com.kosmos.board.auth.infrastructure.rest.dto.LoginRequest;
import com.kosmos.board.auth.infrastructure.rest.dto.RegisterRequest;
import jakarta.validation.Valid;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {

    private final RegisterUseCase registerUseCase;
    private final LoginUseCase loginUseCase;
    private final GoogleAuthUseCase googleAuthUseCase;

    public AuthResource(RegisterUseCase registerUseCase, LoginUseCase loginUseCase, GoogleAuthUseCase googleAuthUseCase) {
        this.registerUseCase = registerUseCase;
        this.loginUseCase = loginUseCase;
        this.googleAuthUseCase = googleAuthUseCase;
    }

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest request) {
        var result = registerUseCase.register(new RegisterCommand(request.email(), request.name(), request.password()));
        return Response.status(Response.Status.CREATED).entity(AuthResponse.from(result)).build();
    }

    @POST
    @Path("/login")
    public AuthResponse login(@Valid LoginRequest request) {
        var result = loginUseCase.login(new LoginCommand(request.email(), request.password()));
        return AuthResponse.from(result);
    }

    @POST
    @Path("/google")
    public AuthResponse google(@Valid GoogleAuthRequest request) {
        var result = googleAuthUseCase.authenticateWithGoogle(new GoogleAuthCommand(request.idToken()));
        return AuthResponse.from(result);
    }
}
