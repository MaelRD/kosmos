package com.kosmos.board.tasks.infrastructure.persistence;

import com.kosmos.board.tasks.domain.model.BoardColumn;
import com.kosmos.board.tasks.domain.model.Priority;
import com.kosmos.board.tasks.domain.model.TaskType;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;
import java.util.UUID;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Entity
@Table(name = "tasks")
public class TaskEntity extends PanacheEntityBase {

    @Id
    public UUID id;

    @Column(nullable = false)
    public String title;

    @Column(length = 2000)
    public String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public TaskType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public Priority priority;

    @Column(name = "assignee_name", nullable = false)
    public String assignee;

    @Enumerated(EnumType.STRING)
    @Column(name = "board_column", nullable = false)
    public BoardColumn column;

    @Column(nullable = false)
    public int points;

    @Column(name = "label_name", nullable = false)
    public String label;

    @Column(name = "resolution_days")
    public Integer resolutionDays;

    @Column(nullable = false)
    public int position;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    public OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    public OffsetDateTime updatedAt;
}
