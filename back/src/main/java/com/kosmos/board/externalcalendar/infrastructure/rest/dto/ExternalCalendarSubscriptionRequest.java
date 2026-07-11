package com.kosmos.board.externalcalendar.infrastructure.rest.dto;

import jakarta.validation.constraints.NotBlank;

public record ExternalCalendarSubscriptionRequest(@NotBlank String label, @NotBlank String sourceUrl) {
}
