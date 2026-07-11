package com.kosmos.board.auth.domain.port.in;

public record RegisterCommand(String email, String name, String password) {
}
