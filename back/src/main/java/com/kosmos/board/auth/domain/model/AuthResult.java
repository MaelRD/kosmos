package com.kosmos.board.auth.domain.model;

import com.kosmos.board.users.domain.model.User;

public record AuthResult(String token, User user) {
}
