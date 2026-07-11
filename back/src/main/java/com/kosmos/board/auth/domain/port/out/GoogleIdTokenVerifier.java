package com.kosmos.board.auth.domain.port.out;

import com.kosmos.board.auth.domain.exception.InvalidGoogleTokenException;
import com.kosmos.board.auth.domain.model.GoogleIdentity;

public interface GoogleIdTokenVerifier {

    GoogleIdentity verify(String idToken) throws InvalidGoogleTokenException;
}
