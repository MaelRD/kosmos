package com.kosmos.board.auth.domain.port.in;

public record LoginCommand(String email, String password) {
}
