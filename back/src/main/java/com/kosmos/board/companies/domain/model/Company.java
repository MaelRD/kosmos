package com.kosmos.board.companies.domain.model;

import java.util.Objects;
import java.util.UUID;

public final class Company {

    private final UUID id;
    private final String name;

    public Company(UUID id, String name) {
        this.id = Objects.requireNonNull(id, "id");
        this.name = requireNonBlank(name, "name");
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

    public String name() {
        return name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Company company)) return false;
        return id.equals(company.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
