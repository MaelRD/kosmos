package com.kosmos.board.agenda.application;

import com.kosmos.board.agenda.domain.exception.AgendaEventNotFoundException;
import com.kosmos.board.agenda.domain.exception.InvalidIcalTokenException;
import com.kosmos.board.agenda.domain.model.AgendaEvent;
import com.kosmos.board.users.domain.model.User;
import com.kosmos.board.agenda.domain.port.in.CreateAgendaEventCommand;
import com.kosmos.board.agenda.domain.port.in.CreateAgendaEventUseCase;
import com.kosmos.board.agenda.domain.port.in.DeleteAgendaEventUseCase;
import com.kosmos.board.agenda.domain.port.in.GetAgendaFeedUseCase;
import com.kosmos.board.agenda.domain.port.in.ListAgendaEventsUseCase;
import com.kosmos.board.agenda.domain.port.in.UpdateAgendaEventCommand;
import com.kosmos.board.agenda.domain.port.in.UpdateAgendaEventUseCase;
import com.kosmos.board.agenda.domain.port.out.AgendaEventRepository;
import com.kosmos.board.users.domain.port.out.UserRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class AgendaEventService implements
        ListAgendaEventsUseCase,
        CreateAgendaEventUseCase,
        UpdateAgendaEventUseCase,
        DeleteAgendaEventUseCase,
        GetAgendaFeedUseCase {

    private static final java.time.Duration FEED_LOOKBACK = java.time.Duration.ofDays(90);
    private static final java.time.Duration FEED_LOOKAHEAD = java.time.Duration.ofDays(180);

    private final AgendaEventRepository agendaEventRepository;
    private final UserRepository userRepository;

    public AgendaEventService(AgendaEventRepository agendaEventRepository, UserRepository userRepository) {
        this.agendaEventRepository = agendaEventRepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<AgendaEvent> listBetween(OffsetDateTime from, OffsetDateTime to) {
        return agendaEventRepository.findBetween(from, to);
    }

    @Override
    @Transactional
    public AgendaEvent createEvent(CreateAgendaEventCommand command) {
        AgendaEvent event = AgendaEvent.create(
                command.title(), command.description(), command.startsAt(), command.endsAt(), command.assigneeEmail());
        return agendaEventRepository.save(event);
    }

    @Override
    @Transactional
    public AgendaEvent updateEvent(UpdateAgendaEventCommand command) {
        AgendaEvent existing = agendaEventRepository.findById(command.id())
                .orElseThrow(() -> new AgendaEventNotFoundException(command.id()));
        AgendaEvent updated = existing.withDetails(
                command.title(), command.description(), command.startsAt(), command.endsAt(), command.assigneeEmail());
        return agendaEventRepository.save(updated);
    }

    @Override
    @Transactional
    public void deleteEvent(UUID id) {
        if (agendaEventRepository.findById(id).isEmpty()) {
            throw new AgendaEventNotFoundException(id);
        }
        agendaEventRepository.deleteById(id);
    }

    @Override
    public AgendaFeed getFeed(UUID icalToken) {
        User owner = userRepository.findByIcalToken(icalToken)
                .orElseThrow(() -> new InvalidIcalTokenException(icalToken));
        OffsetDateTime now = OffsetDateTime.now();
        List<AgendaEvent> events = agendaEventRepository.findBetween(now.minus(FEED_LOOKBACK), now.plus(FEED_LOOKAHEAD))
                .stream()
                .filter(event -> event.assigneeEmail().equals(owner.email()))
                .toList();
        return new AgendaFeed(owner, events);
    }
}
