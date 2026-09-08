# Database assets — Phase I map data

Brought in from the local `rcxd_map_app` prototype per
`docs/plans/phase1-map-app-incorporation.md`. With decision #1/#6 now closed
(Supabase for the app shell), the schema lives at
[`supabase/migrations/0001_phase1_map_schema.sql`](../supabase/migrations/0001_phase1_map_schema.sql)
— apply it via the Supabase CLI (`supabase db push` / `supabase migration up`)
once the project's Supabase instance is provisioned (tracked separately,
not part of Milestone 1).

## Files here

- **`rc_crawling_locations.csv`** / **`.geojson`** — Max's 81 saved "Crawling"
  spots from Google Maps, cleaned and geocoded (title, lat/lng, note,
  distance from Denver, resolved address, `flagged_far_from_denver`). 4 rows
  are flagged for manual review (resolved suspiciously far from the Colorado
  cluster) — see the incorporation plan's proposed follow-up issue.
- **`Crawling.csv`** — the original raw Google Maps export these were built
  from. Kept for provenance.
- **`phase1_seed_reference.sql`** — the original seed script from the local
  prototype (admin user + `COPY ... FROM` import of the CSV above). This
  won't run as-is against Supabase (`COPY FROM` a local file path assumes a
  filesystem the Supabase server doesn't have) — kept as a reference for
  writing the real seed step (most likely a Supabase seed script or a
  one-off data-loading script run against the provisioned database), not as
  something to run directly.

## Not done here

Provisioning an actual Supabase project, running the migration against it,
and loading the seed data are not part of Milestone 1 (Foundation &
Scaffolding) — this commit only brings the schema/data into the repo in a
form ready for that next step.
