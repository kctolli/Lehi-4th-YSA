-- Run once against the Neon database to back the move-in form page.
CREATE TABLE IF NOT EXISTS move_ins (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    member_record_number TEXT,
    birthday DATE NOT NULL,
    address TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS move_ins_created_at_idx ON move_ins (created_at DESC);

-- If the table was already created with a NOT NULL member_record_number, run:
-- ALTER TABLE move_ins ALTER COLUMN member_record_number DROP NOT NULL;
