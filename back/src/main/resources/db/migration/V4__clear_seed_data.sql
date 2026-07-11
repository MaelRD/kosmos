-- The fictional crew (Nova, Orión, Vega, Lyra, Kepler) and their demo tasks were only ever
-- placeholder seed data. Real crew now comes from the `users` table (see UserResource), so
-- this data is dead weight — clear it rather than leave it looking like real content.
DELETE FROM tasks;
DELETE FROM members;
