-- RCxD (RC Crawler Map App) — Phase I schema
-- PostgreSQL 16 + PostGIS 3.4
--
-- Hierarchy per the product spec: Location -> Feature -> Line.
-- Admin creates locations and features. Any user can add a line they've run
-- on a feature, and can check in on a line with photo/video/comment (a public
-- "review" of that line, like the walkthrough in the notes).

CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- for gen_random_uuid(), handy for public-facing ids later

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------
CREATE TABLE users (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    username        TEXT UNIQUE NOT NULL,
    display_name    TEXT NOT NULL,
    email           TEXT UNIQUE,
    avatar_url      TEXT,
    youtube_channel TEXT,                 -- lets the app link a subscriber to the creator's videos
    is_admin        BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Rigs (a user's crawler(s)) — referenced from lines/check-ins so viewers can
-- see "the rig used" the same way the notes describe.
CREATE TABLE rigs (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    owner_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,          -- e.g. "Blue Axial SCX10"
    chassis         TEXT,
    tires           TEXT,
    notes           TEXT,
    photo_url       TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Locations  (top-level map pins — a park, trail system, private property, etc.)
-- ---------------------------------------------------------------------------
CREATE TABLE locations (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name            TEXT NOT NULL,
    description     TEXT,
    address         TEXT,
    geom            GEOGRAPHY(Point, 4326) NOT NULL,
    photo_url       TEXT,
    source_url      TEXT,                   -- original Google Maps link, for provenance
    needs_review    BOOLEAN NOT NULL DEFAULT FALSE,  -- flagged during import (e.g. resolved far from expected area)
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX locations_geom_idx ON locations USING GIST (geom);

-- ---------------------------------------------------------------------------
-- Features  (a specific obstacle / rock formation / trail segment inside a location)
-- ---------------------------------------------------------------------------
CREATE TABLE features (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    location_id     BIGINT NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    geom            GEOGRAPHY(Point, 4326),   -- optional: precise spot within the location
    photo_url       TEXT,
    created_by      BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX features_location_id_idx ON features(location_id);
CREATE INDEX features_geom_idx ON features USING GIST (geom);

-- ---------------------------------------------------------------------------
-- Lines  (a specific route up/through a feature — user-contributed)
-- ---------------------------------------------------------------------------
CREATE TABLE lines (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    feature_id      BIGINT NOT NULL REFERENCES features(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    description     TEXT,
    difficulty      SMALLINT CHECK (difficulty BETWEEN 1 AND 10),
    photo_url       TEXT,
    video_url       TEXT,                     -- e.g. the creator's YouTube video of this line
    created_by      BIGINT NOT NULL REFERENCES users(id),
    rig_id          BIGINT REFERENCES rigs(id),  -- the rig that ran it in the reference photo/video
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX lines_feature_id_idx ON lines(feature_id);
CREATE INDEX lines_created_by_idx ON lines(created_by);

-- ---------------------------------------------------------------------------
-- Check-ins  (a user's visit + attempt of a line — the public "review")
-- ---------------------------------------------------------------------------
CREATE TABLE checkins (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    line_id         BIGINT NOT NULL REFERENCES lines(id) ON DELETE CASCADE,
    user_id         BIGINT NOT NULL REFERENCES users(id),
    rig_id          BIGINT REFERENCES rigs(id),
    comment         TEXT,
    geom            GEOGRAPHY(Point, 4326),   -- where the check-in happened, for "were you actually there" style verification
    checked_in_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX checkins_line_id_idx ON checkins(line_id);
CREATE INDEX checkins_user_id_idx ON checkins(user_id);

-- ---------------------------------------------------------------------------
-- Media  (photos/videos attached to any of the above)
-- ---------------------------------------------------------------------------
CREATE TABLE media (
    id              BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    media_type      TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
    url             TEXT NOT NULL,
    caption         TEXT,
    location_id     BIGINT REFERENCES locations(id) ON DELETE CASCADE,
    feature_id      BIGINT REFERENCES features(id) ON DELETE CASCADE,
    line_id         BIGINT REFERENCES lines(id) ON DELETE CASCADE,
    checkin_id      BIGINT REFERENCES checkins(id) ON DELETE CASCADE,
    uploaded_by     BIGINT REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- exactly one parent must be set
    CONSTRAINT media_one_parent CHECK (
        (CASE WHEN location_id IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN feature_id  IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN line_id     IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN checkin_id  IS NOT NULL THEN 1 ELSE 0 END) = 1
    )
);

-- ---------------------------------------------------------------------------
-- Handy views
-- ---------------------------------------------------------------------------

-- Locations with counts, for the map's list/search view
CREATE VIEW location_summary AS
SELECT
    l.id, l.name, l.address, l.needs_review,
    ST_Y(l.geom::geometry) AS lat,
    ST_X(l.geom::geometry) AS lng,
    COUNT(DISTINCT f.id)  AS feature_count,
    COUNT(DISTINCT ln.id) AS line_count,
    COUNT(DISTINCT c.id)  AS checkin_count
FROM locations l
LEFT JOIN features f ON f.location_id = l.id
LEFT JOIN lines ln ON ln.feature_id = f.id
LEFT JOIN checkins c ON c.line_id = ln.id
GROUP BY l.id;

-- Example "nearby" query (kept here as documentation, not run automatically):
-- SELECT id, name, ST_Distance(geom, ST_MakePoint(:lng, :lat)::geography) AS meters
-- FROM locations
-- ORDER BY geom <-> ST_MakePoint(:lng, :lat)::geography
-- LIMIT 20;
