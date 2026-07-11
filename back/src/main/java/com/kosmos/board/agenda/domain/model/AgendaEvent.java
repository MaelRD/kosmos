package com.kosmos.board.agenda.domain.model;

import java.time.OffsetDateTime;
import java.util.Objects;
import java.util.UUID;

public final class AgendaEvent {

    private final UUID id;
    private final String title;
    private final String description;
    private final OffsetDateTime startsAt;
    private final OffsetDateTime endsAt;
    private final String assigneeEmail;

    public AgendaEvent(
            UUID id,
            String title,
            String description,
            OffsetDateTime startsAt,
            OffsetDateTime endsAt,
            String assigneeEmail) {
        this.id = Objects.requireNonNull(id, "id");
        this.title = requireNonBlank(title, "title");
        this.description = description == null ? "" : description;
        this.startsAt = Objects.requireNonNull(startsAt, "startsAt");
        this.endsAt = Objects.requireNonNull(endsAt, "endsAt");
        if (!endsAt.isAfter(startsAt)) {
            throw new IllegalArgumentException("endsAt must be after startsAt");
        }
        this.assigneeEmail = requireNonBlank(assigneeEmail, "assigneeEmail").toLowerCase();
    }

    public static AgendaEvent create(
            String title, String description, OffsetDateTime startsAt, OffsetDateTime endsAt, String assigneeEmail) {
        return new AgendaEvent(UUID.randomUUID(), title, description, startsAt, endsAt, assigneeEmail);
    }

    public AgendaEvent withDetails(
            String title, String description, OffsetDateTime startsAt, OffsetDateTime endsAt, String assigneeEmail) {
        return new AgendaEvent(id, title, description, startsAt, endsAt, assigneeEmail);
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

    public String title() {
        return title;
    }

    public String description() {
        return description;
    }

    public OffsetDateTime startsAt() {
        return startsAt;
    }

    public OffsetDateTime endsAt() {
        return endsAt;
    }

    public String assigneeEmail() {
        return assigneeEmail;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AgendaEvent that)) return false;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
