package com.kosmos.board.agenda.infrastructure.persistence;

import com.kosmos.board.agenda.domain.model.AgendaEvent;

final class AgendaEventEntityMapper {

    private AgendaEventEntityMapper() {
    }

    static AgendaEvent toDomain(AgendaEventEntity entity) {
        return new AgendaEvent(
                entity.id, entity.title, entity.description, entity.startsAt, entity.endsAt, entity.assigneeEmail);
    }

    static AgendaEventEntity toEntity(AgendaEvent event) {
        AgendaEventEntity entity = new AgendaEventEntity();
        entity.id = event.id();
        entity.title = event.title();
        entity.description = event.description();
        entity.startsAt = event.startsAt();
        entity.endsAt = event.endsAt();
        entity.assigneeEmail = event.assigneeEmail();
        return entity;
    }
}
