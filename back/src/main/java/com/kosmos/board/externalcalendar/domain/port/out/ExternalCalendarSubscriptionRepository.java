package com.kosmos.board.externalcalendar.domain.port.out;

import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ExternalCalendarSubscriptionRepository {

    List<ExternalCalendarSubscription> findByOwnerEmail(String ownerEmail);

    Optional<ExternalCalendarSubscription> findById(UUID id);

    ExternalCalendarSubscription save(ExternalCalendarSubscription subscription);

    void deleteById(UUID id);
}
