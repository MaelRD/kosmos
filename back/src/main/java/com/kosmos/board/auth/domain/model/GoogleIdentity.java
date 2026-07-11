package com.kosmos.board.auth.domain.model;

public record GoogleIdentity(String sub, String email, String name, boolean emailVerified) {
}
