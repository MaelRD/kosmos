package com.kosmos.board.externalcalendar.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "external_calendar_subscriptions")
public class ExternalCalendarSubscriptionEntity extends PanacheEntityBase {

    @Id
    public UUID id;

    @Column(name = "owner_email", nullable = false)
    public String ownerEmail;

    @Column(nullable = false)
    public String label;

    @Column(name = "source_url", nullable = false)
    public String sourceUrl;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public OffsetDateTime createdAt;
}
