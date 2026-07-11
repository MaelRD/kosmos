package com.kosmos.board.externalcalendar.domain.port.in;

import java.util.UUID;

public interface RemoveExternalCalendarSubscriptionUseCase {

    void removeSubscription(String ownerEmail, UUID id);
}
