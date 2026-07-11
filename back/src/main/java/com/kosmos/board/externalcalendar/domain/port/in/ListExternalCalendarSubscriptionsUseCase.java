package com.kosmos.board.externalcalendar.domain.port.in;

import com.kosmos.board.externalcalendar.domain.model.ExternalCalendarSubscription;
import java.util.List;

public interface ListExternalCalendarSubscriptionsUseCase {

    List<ExternalCalendarSubscription> listSubscriptions(String ownerEmail);
}
