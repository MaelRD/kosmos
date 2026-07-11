CREATE TABLE agenda_events (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(200) NOT NULL,
    description     VARCHAR(2000) NOT NULL DEFAULT '',
    starts_at       TIMESTAMPTZ NOT NULL,
    ends_at         TIMESTAMPTZ NOT NULL,
    assignee_email  VARCHAR(255) NOT NULL REFERENCES users (email) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_agenda_event_time_order CHECK (ends_at > starts_at)
);

CREATE INDEX idx_agenda_events_starts_at ON agenda_events (starts_at);
CREATE INDEX idx_agenda_events_assignee ON agenda_events (assignee_email);
