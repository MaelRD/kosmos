ALTER TABLE users ADD COLUMN ical_token UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE users ADD CONSTRAINT uq_users_ical_token UNIQUE (ical_token);
