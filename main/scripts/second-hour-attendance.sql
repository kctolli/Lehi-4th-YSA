-- Run once against the Neon database to back the 2nd hour attendance page.
CREATE TABLE IF NOT EXISTS second_hour_attendance (
    id SERIAL PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    class TEXT NOT NULL CHECK (class IN ('Elders Quorum', 'Relief Society', 'Sunday School')),
    visiting BOOLEAN NOT NULL DEFAULT false,
    attendance_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS second_hour_attendance_date_idx ON second_hour_attendance (attendance_date DESC);
