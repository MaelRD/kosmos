CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    name          VARCHAR(120) NOT NULL,
    password_hash VARCHAR(255),
    provider      VARCHAR(10) NOT NULL CHECK (provider IN ('LOCAL', 'GOOGLE')),
    google_sub    VARCHAR(255) UNIQUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT chk_local_has_password CHECK (provider <> 'LOCAL' OR password_hash IS NOT NULL),
    CONSTRAINT chk_google_has_sub CHECK (provider <> 'GOOGLE' OR google_sub IS NOT NULL)
);

CREATE INDEX idx_users_email ON users (email);
