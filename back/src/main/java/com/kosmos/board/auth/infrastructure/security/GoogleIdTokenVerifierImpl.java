package com.kosmos.board.auth.infrastructure.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kosmos.board.auth.domain.exception.InvalidGoogleTokenException;
import com.kosmos.board.auth.domain.model.GoogleIdentity;
import com.kosmos.board.auth.domain.port.out.GoogleIdTokenVerifier;
import jakarta.enterprise.context.ApplicationScoped;
import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.eclipse.microprofile.config.inject.ConfigProperty;

/**
 * Verifies Google Sign-In ID tokens against Google's tokeninfo endpoint. That endpoint already
 * validates the token's signature and expiry — this class only has to check that the token was
 * actually issued for *this* app (the audience claim), since tokeninfo has no notion of that.
 */
@ApplicationScoped
public class GoogleIdTokenVerifierImpl implements GoogleIdTokenVerifier {

    private static final String TOKENINFO_URL = "https://oauth2.googleapis.com/tokeninfo?id_token=";

    @ConfigProperty(name = "kosmos.google.client-id")
    String googleClientId;

    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public GoogleIdentity verify(String idToken) {
        if (idToken == null || idToken.isBlank()) {
            throw new InvalidGoogleTokenException("missing token");
        }

        JsonNode payload;
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(TOKENINFO_URL + URLEncoder.encode(idToken, StandardCharsets.UTF_8)))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                throw new InvalidGoogleTokenException("token rejected by Google (status " + response.statusCode() + ")");
            }
            payload = objectMapper.readTree(response.body());
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            throw new InvalidGoogleTokenException("could not reach Google: " + e.getMessage());
        }

        String iss = payload.path("iss").asText("");
        if (!iss.equals("accounts.google.com") && !iss.equals("https://accounts.google.com")) {
            throw new InvalidGoogleTokenException("unexpected issuer: " + iss);
        }

        String aud = payload.path("aud").asText("");
        if (!aud.equals(googleClientId)) {
            throw new InvalidGoogleTokenException("audience mismatch");
        }

        if (!payload.path("email_verified").asBoolean(false)) {
            throw new InvalidGoogleTokenException("email not verified");
        }

        return new GoogleIdentity(
                payload.path("sub").asText(),
                payload.path("email").asText(),
                payload.path("name").asText(payload.path("email").asText()),
                true);
    }
}
