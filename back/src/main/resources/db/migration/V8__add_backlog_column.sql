ALTER TABLE tasks DROP CONSTRAINT tasks_board_column_check;
ALTER TABLE tasks ADD CONSTRAINT tasks_board_column_check
    CHECK (board_column IN ('BACKLOG', 'TODO', 'PROGRESS', 'REVIEW', 'DONE'));
