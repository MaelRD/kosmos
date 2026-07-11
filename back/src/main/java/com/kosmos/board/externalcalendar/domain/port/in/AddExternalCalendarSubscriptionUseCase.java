package com.kosmos.board.externalcalendar.domain.port.in;

import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;

public interface AddExternalCalendarSubscriptionUseCase {

    ExternalCalendarSubscription addSubscription(AddExternalCalendarSubscriptionCommand command);

    record AddExternalCalendarSubscriptionCommand(String ownerEmail, String label, String sourceUrl) {
    }
}
