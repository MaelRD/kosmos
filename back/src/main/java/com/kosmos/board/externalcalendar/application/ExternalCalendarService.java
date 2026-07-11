package com.kosmos.board.externalcalendar.application;

import com.kosmos.board.externalcalendar.domain.exception.ExternalCalendarSubscriptionNotFoundException;
import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;
import com.kosmos.board.externalcalendar.domain.model.ExternalEvent;
import com.kosmos.board.externalcalendar.domain.port.in.AddExternalCalendarSubscriptionUseCase;
import com.kosmos.board.externalcalendar.domain.port.in.ListExternalCalendarSubscriptionsUseCase;
import com.kosmos.board.externalcalendar.domain.port.in.ListExternalEventsUseCase;
import com.kosmos.board.externalcalendar.domain.port.in.RemoveExternalCalendarSubscriptionUseCase;
import com.kosmos.board.externalcalendar.domain.port.out.ExternalCalendarClient;
import com.kosmos.board.externalcalendar.domain.port.out.ExternalCalendarSubscriptionRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ExternalCalendarService implements
        ListExternalCalendarSubscriptionsUseCase,
        AddExternalCalendarSubscriptionUseCase,
        RemoveExternalCalendarSubscriptionUseCase,
        ListExternalEventsUseCase {

    private final ExternalCalendarSubscriptionRepository subscriptionRepository;
    private final ExternalCalendarClient externalCalendarClient;

    public ExternalCalendarService(
            ExternalCalendarSubscriptionRepository subscriptionRepository, ExternalCalendarClient externalCalendarClient) {
        this.subscriptionRepository = subscriptionRepository;
        this.externalCalendarClient = externalCalendarClient;
    }

    @Override
    public List<ExternalCalendarSubscription> listSubscriptions(String ownerEmail) {
        return subscriptionRepository.findByOwnerEmail(ownerEmail.toLowerCase());
    }

    @Override
    @Transactional
    public ExternalCalendarSubscription addSubscription(AddExternalCalendarSubscriptionCommand command) {
        ExternalCalendarSubscription subscription =
                ExternalCalendarSubscription.create(command.ownerEmail(), command.label(), command.sourceUrl());
        return subscriptionRepository.save(subscription);
    }

    @Override
    @Transactional
    public void removeSubscription(String ownerEmail, UUID id) {
        ExternalCalendarSubscription subscription = subscriptionRepository.findById(id)
                .filter(s -> s.ownerEmail().equalsIgnoreCase(ownerEmail))
                .orElseThrow(() -> new ExternalCalendarSubscriptionNotFoundException(id));
        subscriptionRepository.deleteById(subscription.id());
    }

    @Override
    public List<ExternalEvent> listExternalEvents(String ownerEmail, OffsetDateTime from, OffsetDateTime to) {
        return subscriptionRepository.findByOwnerEmail(ownerEmail.toLowerCase()).stream()
                .flatMap(sub -> externalCalendarClient.fetchEvents(sub.sourceUrl(), sub.label(), from, to).stream())
                .toList();
    }
}
