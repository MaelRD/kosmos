package com.kosmos.board.auth.domain.port.out;

import com.kosmos.board.users.domain.model.User;

public interface TokenIssuer {

    String issueToken(User user);
}
