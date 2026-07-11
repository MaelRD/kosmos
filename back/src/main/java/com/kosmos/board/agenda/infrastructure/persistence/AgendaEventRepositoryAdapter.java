package com.kosmos.board.agenda.infrastructure.persistence;

import com.kosmos.board.agenda.domain.model.AgendaEvent;
import com.kosmos.board.agenda.domain.port.out.AgendaEventRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class AgendaEventRepositoryAdapter implements AgendaEventRepository {

    private final AgendaEventPanacheRepository panacheRepository;

    public AgendaEventRepositoryAdapter(AgendaEventPanacheRepository panacheRepository) {
        this.panacheRepository = panacheRepository;
    }

    @Override
    public List<AgendaEvent> findBetween(OffsetDateTime from, OffsetDateTime to) {
        return panacheRepository.find("startsAt >= ?1 and startsAt < ?2 order by startsAt", from, to)
                .stream()
                .map(AgendaEventEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<AgendaEvent> findById(UUID id) {
        return panacheRepository.findByIdOptional(id).map(AgendaEventEntityMapper::toDomain);
    }

    @Override
    public AgendaEvent save(AgendaEvent event) {
        AgendaEventEntity entity = AgendaEventEntityMapper.toEntity(event);
        panacheRepository.getEntityManager().merge(entity);
        return event;
    }

    @Override
    public void deleteById(UUID id) {
        panacheRepository.deleteById(id);
    }
}
