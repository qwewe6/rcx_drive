-- Seed data: an admin user + the initial 81 locations imported from the
-- user's Google Maps "Crawling" saved list.
-- Runs automatically on first container start (docker-entrypoint-initdb.d),
-- after 01_schema.sql. The CSV is mounted alongside this file.

INSERT INTO users (username, display_name, is_admin)
VALUES ('max', 'Max', TRUE)
ON CONFLICT (username) DO NOTHING;

CREATE TEMP TABLE staging_locations (
    id                       INT,
    title                    TEXT,
    lat                      DOUBLE PRECISION,
    lng                      DOUBLE PRECISION,
    note                     TEXT,
    comment                  TEXT,
    flagged_far_from_denver  TEXT,
    miles_from_denver        DOUBLE PRECISION,
    resolved_label           TEXT,
    source_url               TEXT
);

COPY staging_locations FROM '/docker-entrypoint-initdb.d/rc_crawling_locations.csv' WITH (FORMAT csv, HEADER true);

INSERT INTO locations (name, description, address, geom, source_url, needs_review, created_by)
SELECT
    CASE WHEN s.title IS NULL OR s.title = '' OR s.title = 'Dropped pin'
         THEN COALESCE(NULLIF(s.resolved_label, ''), 'Unnamed spot #' || s.id)
         ELSE s.title
    END,
    NULLIF(s.note, ''),
    NULLIF(s.resolved_label, ''),
    ST_SetSRID(ST_MakePoint(s.lng, s.lat), 4326)::geography,
    s.source_url,
    COALESCE(s.flagged_far_from_denver = 'YES', FALSE),
    (SELECT id FROM users WHERE username = 'max')
FROM staging_locations s
ORDER BY s.id;
