package com.kosmos.board.users.infrastructure.rest.dto;

import com.kosmos.board.users.domain.model.User;
import java.util.List;
import java.util.UUID;

public record MemberResponse(UUID id, String name, String email, String initial, String colorHex) {

    // Fixed brand palette — a member's color is derived from their id, so it stays stable
    // across requests without needing a dedicated column.
    private static final List<String> PALETTE =
            List.of("#9B7BFF", "#3E8EDE", "#FFCB3D", "#FF6FA5", "#2EC4B6", "#FFB238", "#FF4D4D");

    public static MemberResponse from(User user) {
        int index = Math.floorMod(user.id().hashCode(), PALETTE.size());
        return new MemberResponse(
                user.id(),
                user.name(),
                user.email(),
                user.name().substring(0, 1).toUpperCase(),
                PALETTE.get(index));
    }
}
