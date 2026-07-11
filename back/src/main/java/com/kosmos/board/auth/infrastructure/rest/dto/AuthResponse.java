package com.kosmos.board.auth.infrastructure.rest.dto;

import com.kosmos.board.auth.domain.model.AuthResult;
import java.util.UUID;

public record AuthResponse(String token, UserResponse user) {

    public record UserResponse(UUID id, String email, String name) {
    }

    public static AuthResponse from(AuthResult result) {
        return new AuthResponse(
                result.token(),
                new UserResponse(result.user().id(), result.user().email(), result.user().name()));
    }
}
