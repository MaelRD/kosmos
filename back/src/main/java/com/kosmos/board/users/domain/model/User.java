package com.kosmos.board.users.domain.model;

import java.util.Objects;
import java.util.UUID;

public final class User {

    private final UUID id;
    private final String email;
    private final String name;
    private final String passwordHash;
    private final AuthProvider provider;
    private final String googleSub;
    private final UUID icalToken;

    public User(
            UUID id,
            String email,
            String name,
            String passwordHash,
            AuthProvider provider,
            String googleSub,
            UUID icalToken) {
        this.id = Objects.requireNonNull(id, "id");
        this.email = requireNonBlank(email, "email").toLowerCase();
        this.name = requireNonBlank(name, "name");
        this.passwordHash = passwordHash;
        this.provider = Objects.requireNonNull(provider, "provider");
        this.googleSub = googleSub;
        this.icalToken = Objects.requireNonNull(icalToken, "icalToken");
    }

    public static User localUser(String email, String name, String passwordHash) {
        return new User(UUID.randomUUID(), email, name, passwordHash, AuthProvider.LOCAL, null, UUID.randomUUID());
    }

    public static User googleUser(String email, String name, String googleSub) {
        return new User(UUID.randomUUID(), email, name, null, AuthProvider.GOOGLE, googleSub, UUID.randomUUID());
    }

    private static String requireNonBlank(String value, String field) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(field + " must not be blank");
        }
        return value;
    }

    public UUID id() {
        return id;
    }

    public String email() {
        return email;
    }

    public String name() {
        return name;
    }

    public String passwordHash() {
        return passwordHash;
    }

    public AuthProvider provider() {
        return provider;
    }

    public String googleSub() {
        return googleSub;
    }

    public UUID icalToken() {
        return icalToken;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User user)) return false;
        return id.equals(user.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
