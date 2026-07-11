package com.kosmos.board.externalcalendar.infrastructure.http;

import com.kosmos.board.externalcalendar.domain.model.ExternalEvent;
import com.kosmos.board.externalcalendar.domain.port.out.ExternalCalendarClient;
import jakarta.enterprise.context.ApplicationScoped;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Instant;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Level;
import java.util.logging.Logger;

@ApplicationScoped
public class HttpExternalCalendarClient implements ExternalCalendarClient {

    private static final Logger LOG = Logger.getLogger(HttpExternalCalendarClient.class.getName());
    private static final Duration CACHE_TTL = Duration.ofMinutes(15);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(10);

    private final HttpClient httpClient = HttpClient.newBuilder().connectTimeout(REQUEST_TIMEOUT).build();
    private final Map<String, CachedFeed> cache = new ConcurrentHashMap<>();

    @Override
    public List<ExternalEvent> fetchEvents(String sourceUrl, String sourceLabel, OffsetDateTime from, OffsetDateTime to) {
        try {
            String icsText = fetchIcsText(sourceUrl);
            return IcsCalendarParser.parse(icsText, sourceLabel).stream()
                    .filter(event -> event.startsAt().isBefore(to) && event.endsAt().isAfter(from))
                    .toList();
        } catch (Exception e) {
            LOG.log(Level.WARNING, "Could not fetch external calendar '" + sourceLabel + "'", e);
            return List.of();
        }
    }

    private String fetchIcsText(String sourceUrl) throws Exception {
        String icsUrl = GoogleCalendarUrlResolver.resolveIcsUrl(sourceUrl);
        CachedFeed cached = cache.get(icsUrl);
        if (cached != null && cached.fetchedAt.plus(CACHE_TTL).isAfter(Instant.now())) {
            return cached.body;
        }
        HttpRequest request = HttpRequest.newBuilder(URI.create(icsUrl)).timeout(REQUEST_TIMEOUT).GET().build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());
        if (response.statusCode() != 200) {
            throw new IllegalStateException("Fetching " + icsUrl + " returned HTTP " + response.statusCode());
        }
        cache.put(icsUrl, new CachedFeed(response.body(), Instant.now()));
        return response.body();
    }

    private record CachedFeed(String body, Instant fetchedAt) {
    }
}
