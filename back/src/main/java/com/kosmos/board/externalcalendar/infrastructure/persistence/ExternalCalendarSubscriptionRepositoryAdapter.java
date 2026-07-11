package com.kosmos.board.externalcalendar.infrastructure.persistence;

import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;
import com.kosmos.board.externalcalendar.domain.port.out.ExternalCalendarSubscriptionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class ExternalCalendarSubscriptionRepositoryAdapter implements ExternalCalendarSubscriptionRepository {

    private final ExternalCalendarSubscriptionPanacheRepository panacheRepository;

    public ExternalCalendarSubscriptionRepositoryAdapter(ExternalCalendarSubscriptionPanacheRepository panacheRepository) {
        this.panacheRepository = panacheRepository;
    }

    @Override
    public List<ExternalCalendarSubscription> findByOwnerEmail(String ownerEmail) {
        return panacheRepository.find("ownerEmail", ownerEmail).stream()
                .map(ExternalCalendarSubscriptionEntityMapper::toDomain)
                .toList();
    }

    @Override
    public Optional<ExternalCalendarSubscription> findById(UUID id) {
        return panacheRepository.findByIdOptional(id).map(ExternalCalendarSubscriptionEntityMapper::toDomain);
    }

    @Override
    public ExternalCalendarSubscription save(ExternalCalendarSubscription subscription) {
        ExternalCalendarSubscriptionEntity entity = ExternalCalendarSubscriptionEntityMapper.toEntity(subscription);
        panacheRepository.getEntityManager().merge(entity);
        return subscription;
    }

    @Override
    public void deleteById(UUID id) {
        panacheRepository.deleteById(id);
    }
}
