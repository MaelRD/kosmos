package com.kosmos.board.auth.domain.exception;

public class InvalidGoogleTokenException extends RuntimeException {

    public InvalidGoogleTokenException(String reason) {
        super("Invalid Google ID token: " + reason);
    }
}
