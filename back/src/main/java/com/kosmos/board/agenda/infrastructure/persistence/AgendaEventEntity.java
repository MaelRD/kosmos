package com.kosmos.board.agenda.infrastructure.persistence;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "agenda_events")
public class AgendaEventEntity extends PanacheEntityBase {

    @Id
    public UUID id;

    @Column(nullable = false)
    public String title;

    @Column(length = 2000)
    public String description;

    @Column(name = "starts_at", nullable = false)
    public OffsetDateTime startsAt;

    @Column(name = "ends_at", nullable = false)
    public OffsetDateTime endsAt;

    @Column(name = "assignee_email", nullable = false)
    public String assigneeEmail;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public OffsetDateTime createdAt;
}
