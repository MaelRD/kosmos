CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE members (
    name        VARCHAR(40) PRIMARY KEY,
    color_hex   VARCHAR(7) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE labels (
    name        VARCHAR(40) PRIMARY KEY,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tasks (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(200) NOT NULL,
    description      VARCHAR(2000) NOT NULL DEFAULT '',
    type             VARCHAR(10) NOT NULL CHECK (type IN ('STORY', 'TASK', 'BUG')),
    priority         VARCHAR(10) NOT NULL CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
    assignee_name    VARCHAR(40) NOT NULL REFERENCES members (name) ON UPDATE CASCADE ON DELETE RESTRICT,
    board_column     VARCHAR(10) NOT NULL CHECK (board_column IN ('TODO', 'PROGRESS', 'REVIEW', 'DONE')),
    points           INT NOT NULL DEFAULT 0 CHECK (points >= 0),
    label_name       VARCHAR(40) NOT NULL REFERENCES labels (name) ON UPDATE CASCADE ON DELETE RESTRICT,
    resolution_days  INT CHECK (resolution_days IS NULL OR resolution_days >= 0),
    position         INT NOT NULL DEFAULT 0,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tasks_column_position ON tasks (board_column, position);
CREATE INDEX idx_tasks_assignee ON tasks (assignee_name);
CREATE INDEX idx_tasks_priority ON tasks (priority);

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_tasks_set_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();
