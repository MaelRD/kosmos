CREATE TABLE external_calendar_subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_email     VARCHAR(255) NOT NULL REFERENCES users (email) ON UPDATE CASCADE ON DELETE CASCADE,
    label           VARCHAR(100) NOT NULL,
    source_url      VARCHAR(2000) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_external_calendar_subscriptions_owner ON external_calendar_subscriptions (owner_email);
