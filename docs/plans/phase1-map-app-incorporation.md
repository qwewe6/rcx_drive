# Phase I Map App — Incorporation Plan

Status: **Draft — for review/approval. No files have been moved and no GitHub
issues have been changed yet; this document only proposes what to do.**

Source: `~/Desktop/rcxd_map_app` on your Mac (a loose folder, not currently a
git repo). This predates the `rcx_drive` scaffold — it's the "Phase I: A
Killer RC Crawler Map" work referenced in your original notes ("it all starts
with a killer map, I've got the base materials... just gotta map it").

## 1. What's actually there

This isn't just notes — it's a verified schema and a real dataset:

- **`instructions.md`** — a detailed Phase I product spec for the map: a
  `Location → Feature → Line` hierarchy. Admin creates locations and
  features; any user can add a line they've run on a feature; a "check-in"
  (photo/video/comment) is the public review, the same loop your original
  Strava teardown called the Social Validation Loop. Also captures the idea
  of a subscriber going to try the line from one of your videos and
  comparing results — a concrete version of the "YouTuber as funnel" idea
  from the original research doc.
- **`database/schema.sql`** (mirrored as `database/init/01_schema.sql`) — a
  working PostgreSQL 16 + PostGIS 3.4 schema implementing that hierarchy:
  `users`, `rigs`, `locations`, `features`, `lines`, `checkins`, `media`
  (polymorphic photo/video attachments), and a `location_summary` view for a
  map list/search screen. GIST spatial indexes on `locations` and `features`.
  Its README says it's been verified against a real Postgres+PostGIS
  instance including a full `pg_dump`/restore round-trip.
- **`database/rcxd_dev_dump.sql`** — a full schema+data dump of the
  already-seeded database, so it can be restored directly without re-running
  the import.
- **`database/docker-compose.yml`** + **`database/init/`** — one-command
  local Postgres+PostGIS via Docker, auto-seeded on first boot.
- **`rc_crawling_locations.csv`** / **`.geojson`** — your 81 saved "Crawling"
  spots from Google Maps, cleaned and geocoded (title, lat/lng, note,
  distance from Denver, resolved address). 4 of the 81 are flagged
  `needs_review` (resolved suspiciously far from your Colorado cluster) —
  worth a manual look before they're treated as reliable. `Crawling.csv` is
  the original raw Google Maps export these were built from, kept for
  provenance.
- **`docs/plans/`, `docs/rules/`, `docs/reference/`, `docs/change_log/`** —
  empty. Scaffolded but never used. Nothing to carry over from these except
  possibly the folder convention itself, if you want it (optional, see §5).

Net: real prior work, not a prototype to discard. It's the concrete
implementation of the map feature your instincts said to start with.

## 2. How it lines up against the current milestones/issues

| Phase I asset | Current milestone | Current issue(s) | Assessment |
|---|---|---|---|
| `users` table | Accounts & Auth | #5 Design user data model | Strong starting point — username, display name, email, avatar, `youtube_channel`, `is_admin`. Will need to be reconciled with whatever auth provider we pick (e.g. Supabase Auth expects its own `auth.users` + a linked `profiles` table) rather than dropped in as-is. |
| `rigs` table | Garage | #8 Design garage database schema | Covers the core rig record (name, chassis, tires, notes, photo). Does **not** yet have structured fields for mods/upgrades or brand info that the Garage milestone calls for — needs extending, not replacing. |
| `locations`, `features` + GIST indexes | Map & Route/Line Discovery | #15 Integrate map SDK, #16 Global heatmap | This largely **is** #15/#16's data layer already. `location_summary` view is close to what a map list/search screen needs out of the box. |
| `lines` table | Map & Route/Line Discovery | #17 Route/line creation flow, #18 Route/line browsing | Directly models a "line" as user-contributed, tied to a feature and optionally a rig/video — matches #17/#18's intent closely. |
| `features`/`lines` as a matching target | Feature/Segment Matching & Crawler Score | #19 GPS-to-feature matching engine, #20 Crawler score formula | Schema gives us the tables to match a GPS trail against and to store a result in, but the actual matching algorithm and score formula are **not** implemented here — still real design work, just no longer starting from a blank schema. |
| `checkins` + `media` | Social Feed & Kudos | #22 Activity feed data model, #24 Kudos + comments | A check-in (comment + optional photo/video, tied to a line) is effectively a single-line "review," close in spirit to a kudos/comment. It is not a general cross-feature activity feed — #22 likely still needs its own feed table that check-ins (and eventually other activity types) feed into. |
| 81-location seed dataset + `02_seed.sql` | Map & Route/Line Discovery | #16 Global heatmap | Directly solves the "no real data yet" gap — this is real seed content, not placeholder rows. |

Nothing here closes an issue outright, but several (#5, #8, #15, #16, #17,
#18) go from "design from scratch" to "review and extend an existing,
verified design" — which is a meaningfully different, smaller task.

## 3. What this does (and doesn't) resolve from the scaffolding plan's open decisions

- **Backend (Supabase vs. custom Node/Postgres):** this doesn't force the
  choice, but it removes a reason to hesitate on Supabase — Supabase is
  hosted Postgres with PostGIS available as a toggled-on extension, and this
  schema already targets Postgres 16 + PostGIS 3.4 with no vendor-specific
  syntax. `schema.sql` should apply to a Supabase project close to
  unmodified. If we go custom Node/Postgres instead, it applies exactly as
  written today. Recommend keeping the existing Supabase recommendation.
- **Maps provider (Mapbox vs. MapLibre):** no effect either way — the data's
  in GeoJSON, which both consume natively.

## 4. Proposed integration steps

1. **Bring the schema in as the first migration**, not a loose SQL file.
   If we confirm Supabase: `supabase/migrations/0001_phase1_schema.sql`
   (via `supabase db diff` or a hand-placed migration), using the Supabase
   CLI's local dev stack instead of the standalone `docker-compose.yml`
   (Supabase's local stack already runs Postgres+PostGIS the same way).
   If custom Postgres: keep `docker-compose.yml` + `init/` close to as-is
   under `database/`.
2. **Carry over the seed data**: `rc_crawling_locations.csv` (cleaned) and
   `02_seed.sql`'s import logic, adapted to whichever migration tool we use.
   Keep `Crawling.csv` (raw export) and the `.geojson` alongside it under
   `docs/reference/` or `database/` for provenance — small files, worth
   keeping.
3. **Extend, don't replace, `rigs`**: add the mods/upgrades and brand-info
   structure the Garage milestone wants (likely a `rig_mods` child table
   rather than free-text `notes`) before treating #8 as done.
4. **Fold `instructions.md` into `docs/research/`** alongside the existing
   Strava teardown, as the concrete Phase I map spec — it has detail (e.g.
   the subscriber-replays-my-line idea) that isn't in the current plan doc
   and should inform how #17/#18/#22 get scoped out.
5. **Update GitHub issues** rather than closing them silently:
   - Comment on #5, #8, #15, #16, #17, #18 linking to the incoming schema
     and noting they're now "extend existing design" not "design from
     scratch."
   - Open one new issue: **"Resolve the 4 `needs_review` locations"**
     (quick manual pass, blocks trusting the seed data fully) under Map &
     Route/Line Discovery.
   - Open one new issue: **"Extend `rigs` schema for mods/brand info"**
     under Garage, since that gap is now concrete instead of implicit.
6. **Leave the empty `docs/plans/rules/reference/change_log` folders
   behind** — nothing to migrate, and the current repo already has its own
   `docs/plans` and `docs/research` convention.

## 5. Open questions before I execute this

- OK to fold `instructions.md` into `docs/research/` verbatim (lightly
  reformatted to markdown), the same way the Strava teardown was carried
  over?
- Confirm Supabase (vs. custom Postgres) so I know whether the schema lands
  as a Supabase migration or stays as the Docker Compose setup as-is.
- OK with extending `rigs` (new columns/child table) rather than treating
  the Garage schema issue as fully done?
- Any objection to filing the two new issues in §4.5, or would you rather
  fold those into existing issues instead of adding new ones?

Once you sign off, I'll move the actual files into `rcx_drive`, adjust the
schema as agreed, and update the GitHub issues/milestones accordingly.
