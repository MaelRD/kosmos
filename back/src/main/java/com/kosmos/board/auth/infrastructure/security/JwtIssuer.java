package com.kosmos.board.auth.infrastructure.security;

import com.kosmos.board.users.domain.model.User;
import com.kosmos.board.auth.domain.port.out.TokenIssuer;
import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.Duration;
import java.util.Set;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class JwtIssuer implements TokenIssuer {

    @ConfigProperty(name = "mp.jwt.verify.issuer")
    String issuer;

    @ConfigProperty(name = "kosmos.jwt.expiration-seconds", defaultValue = "86400")
    long expirationSeconds;

    @Override
    public String issueToken(User user) {
        return Jwt.issuer(issuer)
                .subject(user.id().toString())
                .groups(Set.of("user"))
                .claim("email", user.email())
                .claim("name", user.name())
                .expiresIn(Duration.ofSeconds(expirationSeconds))
                .sign();
    }
}
