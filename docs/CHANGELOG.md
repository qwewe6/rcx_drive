# Changelog

A running, human-and-agent-readable log of work done on RCxDrive. Max and Stephen
are working on separate machines/sessions (much of it via Claude Code) — this file
is the cheapest way for either of us, or an agent picking up a session, to see what
changed recently without re-reading every diff or issue thread.

**Rule:** any work session (code, docs, schema, GitHub config) ends with an entry
here. See [`docs/rules/changelog.md`](rules/changelog.md). Coding agents should
add/update the entry for the current session as part of finishing the task.

## Entry format

```
### YYYY-MM-DD — <Name>
- Brief, plain-language description of what changed and why. Link an issue/PR/doc
  if one exists. One line per notable change; skip the trivial stuff (typo fixes,
  formatting-only commits).
```

Keep entries short — this is a sync log, not a release-notes doc. If a change needs
more explanation than 1-2 lines, it probably deserves its own plan doc or ADR-style
entry in [`DECISIONLOG.md`](DECISIONLOG.md), linked from here.

---

## [Unreleased]

### 2026-09-08 — Stephen (via Claude)

- Added `docs/research/mapbox-vs-maplibre.md`: cost/capability research for
  decision #2, per the 2026-09-07 sprint planning call's action item and
  [issue #45](https://github.com/qwewe6/rcx_drive/issues/45). Verified current
  Mapbox pricing (25K MAU/month free on mobile, ~$4/1,000 MAU after; 50K web
  map loads free) against MapLibre-based alternatives (Esri World Imagery's
  2M free tile requests/month for satellite, MapTiler/Stadia Maps for vector
  tiles, or self-hosting via Protomaps/PMTiles).
- Closed decision #2 in `docs/DECISIONLOG.md`: **MapLibre GL JS** + Esri World
  Imagery + a hosted vector-tile provider, given no navigation/geocoding need
  and off-road terrain visibility mattering more than street styling for this
  product. Revisit if that changes.
- Opened as PR on branch `docs/45-map-lib-decision` -> `main`, tagged Max for
  review, closes issue #45 on merge.

### 2026-09-08 — Max (via Claude)

- Merged PR #44 (Milestone 1: Foundation & Scaffolding) into `main`.
- Clarified with Max that "Milestone 1" in the prior request meant the first
  _feature_ milestone from his perspective — GitHub's actual
  [Milestone 2, "Accounts & Auth"](https://github.com/qwewe6/rcx_drive/milestone/2)
  — not the scaffolding work, which stands as-is under its own Milestone 1.
- Completed Milestone 2 (Accounts & Auth), closing issues #5–#7:
  - **#5 Design user data model** — `docs/plans/user-data-model.md` +
    `supabase/migrations/0002_user_profiles.sql` (a `profiles` table 1:1 with
    `auth.users`, RLS, auto-create-on-signup trigger).
  - **#6 Sign up / login flow** — `src/services/auth/` (an `AuthService`
    interface with a default `mockAuthService` backed by AsyncStorage, and a
    ready-but-unwired `supabaseAuthService`), `src/hooks/useAuth.tsx`
    (context provider + session state), auth-gated routing in
    `app/_layout.tsx`, and `(auth)/login.tsx` + `(auth)/sign-up.tsx` screens.
  - **#7 Build profile screen** — `(tabs)/profile.tsx` now does real
    view/edit of display name and bio, plus sign-out.
  - No Supabase project is provisioned yet (per Max, 2026-09-07), so the app
    runs on `mockAuthService` by default; flipping to `supabaseAuthService`
    is just setting `EXPO_PUBLIC_SUPABASE_URL`/`EXPO_PUBLIC_SUPABASE_ANON_KEY`
    (see `.env.example`), no code change.
  - Added `@supabase/supabase-js` and `@react-native-async-storage/async-storage`
    as dependencies; added Jest coverage for `mockAuthService`.
  - Opened as PR `max-milestone2-accounts-auth` -> `main` for Max and Stephen
    to review.

### 2026-09-07 — Max (via Claude)

- Reviewed `~/Desktop/rcxd_map_app` (prior local work: a verified PostgreSQL 16 +
  PostGIS 3.4 schema, an 81-location seed dataset from Max's Google Maps
  "Crawling" list, and a Phase I map product spec) and wrote up
  `docs/plans/phase1-map-app-incorporation.md` proposing how to bring it into
  this repo. Maps the existing schema against milestones/issues #5, #8, #15–#22,
  cross-references it against decision #1/#6 and the new Milestone 12 (Terrain
  Mapping). No files moved and no issues changed yet — pending sign-off from
  Max and Stephen.
- Max approved the Phase I incorporation plan and confirmed the backend
  direction (hybrid: Supabase for the app shell, a genuinely separate
  Python/FastAPI service for telemetry/geospatial/ETL/photogrammetry work)
  - closed decisions #1 and #6 in `docs/DECISIONLOG.md` accordingly.
- Brought the Phase I map schema/data into the repo: schema as
  `supabase/migrations/0001_phase1_map_schema.sql`, the 81-location seed
  dataset + raw export under `database/`, and the Phase I product spec as
  `docs/research/phase1-map-app-spec.md`. Provisioning Supabase and running
  the migration/seed against it is tracked separately, not done here.
- Completed Milestone 1 (Foundation & Scaffolding), closing issues #1-#4:
  Expo app scaffold (TypeScript + expo-router, `(tabs)` skeleton), EAS
  `development` build profile + expo-dev-client, ESLint/Prettier/TypeScript
  strict/Jest baseline (all four checks passing), and GitHub Actions CI.
  Opened as PR `max-milestone1-scaffold` -> `main` for Max and Stephen to
  review.

## Prior to this changelog

Backfilled from git history, for continuity:

### 2026-09-06/07 — Max

- Initial commit: repo created, LICENSE added.
- Added `docs/plans/initial-scaffolding.md` and `docs/research/strava-teardown.md`
  (the Strava architecture/loop/revenue teardown and its RCxDrive translation).
- Created all 11 GitHub milestones (Foundation & Scaffolding through Web Dashboard)
  with a 35-issue initial breakdown across them.
- Marked the scaffolding plan status as "repo + GitHub board live," pending
  sign-off on the plan's §6 open decisions before feature code starts.
