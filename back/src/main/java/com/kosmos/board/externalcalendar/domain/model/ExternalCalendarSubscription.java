package com.kosmos.board.externalcalendar.domain.model;

import java.util.Objects;
import java.util.UUID;

public final class ExternalCalendarSubscription {

    private final UUID id;
    private final String ownerEmail;
    private final String label;
    private final String sourceUrl;

    public ExternalCalendarSubscription(UUID id, String ownerEmail, String label, String sourceUrl) {
        this.id = Objects.requireNonNull(id, "id");
        this.ownerEmail = requireNonBlank(ownerEmail, "ownerEmail").toLowerCase();
        this.label = requireNonBlank(label, "label");
        this.sourceUrl = requireNonBlank(sourceUrl, "sourceUrl");
    }

    public static ExternalCalendarSubscription create(String ownerEmail, String label, String sourceUrl) {
        return new ExternalCalendarSubscription(UUID.randomUUID(), ownerEmail, label, sourceUrl);
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

    public String ownerEmail() {
        return ownerEmail;
    }

    public String label() {
        return label;
    }

    public String sourceUrl() {
        return sourceUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ExternalCalendarSubscription that)) return false;
        return id.equals(that.id);
    }

    @Override
    public int hashCode() {
        return id.hashCode();
    }
}
