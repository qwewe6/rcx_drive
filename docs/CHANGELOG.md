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

### 2026-09-06 — Stephen
- Added `docs/ux/user-personas.md`: persona table mapping the three core user types
  (from the Strava teardown doc) to the features/milestones that serve them, for
  prioritization.
- Added this file (`docs/CHANGELOG.md`) and the changelog-update rule at
  `docs/rules/changelog.md`.
- Added `docs/DECISIONLOG.md` — a single running table of open/closed cross-cutting
  decisions, seeded with the open items from `docs/plans/initial-scaffolding.md` §6
  plus a couple new ones raised today.
- Added `docs/research/python-backend-react-native-stack.md`: weighs a Python
  (FastAPI) backend + React Native mobile stack against the Node/Supabase path,
  given both engineers' Python background and upcoming geospatial/ETL/analytics
  needs (drone photogrammetry terrain mapping).
- Opened GitHub [Milestone 12, "Terrain Mapping — Drone & Crowdsourced
  Photogrammetry"](https://github.com/qwewe6/rcx_drive/milestone/12), with an
  initial 5-issue breakdown (#36–#40) for the 3D course-builder idea.
- Added root `CLAUDE.md` with repo/team conventions for Claude Code sessions.
- Did all of the above on branch `stephen-scaffold-2`, opened as a PR for Max to
  review.

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
