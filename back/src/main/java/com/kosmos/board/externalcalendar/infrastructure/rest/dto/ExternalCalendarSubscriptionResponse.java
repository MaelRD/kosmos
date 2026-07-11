package com.kosmos.board.externalcalendar.infrastructure.rest.dto;

import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;
import java.util.UUID;

public record ExternalCalendarSubscriptionResponse(UUID id, String label, String sourceUrl) {

    public static ExternalCalendarSubscriptionResponse from(ExternalCalendarSubscription subscription) {
        return new ExternalCalendarSubscriptionResponse(subscription.id(), subscription.label(), subscription.sourceUrl());
    }
}
