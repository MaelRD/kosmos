-- Tasks are now assigned to real Kosmos accounts (users table), not the legacy fixed
-- crew roster in `members`. That roster predates auth and is unused elsewhere.
ALTER TABLE tasks DROP CONSTRAINT tasks_assignee_name_fkey;
