package com.kosmos.board.externalcalendar.infrastructure.persistence;

import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;

final class ExternalCalendarSubscriptionEntityMapper {

    private ExternalCalendarSubscriptionEntityMapper() {
    }

    static ExternalCalendarSubscription toDomain(ExternalCalendarSubscriptionEntity entity) {
        return new ExternalCalendarSubscription(entity.id, entity.ownerEmail, entity.label, entity.sourceUrl);
    }

    static ExternalCalendarSubscriptionEntity toEntity(ExternalCalendarSubscription subscription) {
        ExternalCalendarSubscriptionEntity entity = new ExternalCalendarSubscriptionEntity();
        entity.id = subscription.id();
        entity.ownerEmail = subscription.ownerEmail();
        entity.label = subscription.label();
        entity.sourceUrl = subscription.sourceUrl();
        return entity;
    }
}
