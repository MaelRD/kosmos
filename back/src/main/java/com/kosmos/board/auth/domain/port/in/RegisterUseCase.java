package com.kosmos.board.auth.domain.port.in;

import com.kosmos.board.auth.domain.model.AuthResult;

public interface RegisterUseCase {

    AuthResult register(RegisterCommand command);
}
