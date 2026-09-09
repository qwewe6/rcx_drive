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
- Investigated the CI failure on PR #49
  ([run 34186209546](https://github.com/qwewe6/rcx_drive/actions/runs/34186209546)),
  reported as a possible Node.js version misconfiguration. It isn't: Node is
  correctly pinned (`node-version: 22`) and runs fine — the "Node 20
  deprecated" line is an unrelated GitHub Actions platform-wide notice about
  the runner's own internal Node, not the project's. The actual failure is
  the `Format check` step (`prettier --check .`) failing on 8
  never-formatted files (docs + one `.geojson`), and it turns out **every**
  push to `main` so far (#44, #48, #49) has failed the same way — a gap from
  Milestone 1 issue #3 (CI baseline added without ever running
  `prettier --write .` against existing docs). Filed
  [issue #50](https://github.com/qwewe6/rcx_drive/issues/50) in Milestone 1
  with the full root-cause writeup and a proposed fix, assigned to Stephen.
- Resolved merge conflicts on PR #47 (`docs/sprint-planning-1`, the
  2026-09-07 sprint-planning docs sync below) against everything that landed
  on `main` since it was opened (#48, #49, #51) — conflicts were in this file
  and `docs/DECISIONLOG.md`, reconciled by keeping the newer/authoritative
  resolutions for decisions #1/#2/#6 already on `main` and carrying forward
  the additive entries (#7's reconfirmation note, #9, #10) that only existed
  on the branch. Pushed as a new commit rather than force-pushing.
- Opened PR #52 to close out Milestone 1 for real (#50's `format:check` fix,
  `npm run ci`, `docs/rules/local-ci-checks.md`) — still pending review as of
  this entry. While verifying it, found that PR #44 ("Closes #1, #2, #3, #4.")
  and PR #48 ("Closes #5, #6, #7.") each only auto-closed the first issue
  listed — GitHub only honors a closing keyword for the issue immediately
  following it, not a comma-separated list. Manually closed #6 and #7 (work
  was done in #48, just never actually closed), confirmed via the GitHub
  API that PR #52 correctly repeats the keyword per issue for #2/#3/#4/#50,
  and added [`docs/rules/pull-requests.md`](rules/pull-requests.md)
  (cross-linked from `CLAUDE.md`) documenting the gotcha so it isn't missed
  again. Pushed this doc directly to `main` (Stephen's call, single-doc
  change).

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

### 2026-09-07 — Stephen

- Reformatted `docs/meetings/20260907_sprint_planning.md` (Max & Stephen's first
  sprint planning call) into proper Markdown — structure/formatting only, no
  content changes.
- Updated `docs/ux/user-personas.md` with more detail surfaced on that call:
  Comp Crawler needs telemetry + video evidence to make a claimed score
  provable, not just precise; Community Leader gets a creator/subscriber
  "replay the line I posted" loop and a terrain-scanning revenue angle.
  Reconfirmed (didn't change) the existing "Course Builder / Event Organizer"
  cross-cutting note.
- Added `docs/ux/use-cases-and-differentiators.md`: the detailed use cases from
  the call (segments → features/lines, telemetry+video "social policing",
  creator/subscriber replay loop, terrain mapping as a revenue channel, vehicle
  metrics vs. human biometrics) plus an explicit Strava-vs-RCxDrive
  differentiators table, referencing `docs/research/strava-teardown.md`.
- Updated `docs/DECISIONLOG.md`: closed decision #1 (Supabase primary backend +
  separate Python component) and #6 (Python, not Node, for that component) per
  the call; added notes to #2 (map provider still open, research assigned to
  Stephen) and #7 (terrain-mapping revenue use case reconfirmed); added #9
  (one-issue-per-PR as a foundational-stage _guideline_, not a hard rule —
  corrected after an initial pass called it a "policy") and #10 (build order:
  User → Garage → Map) as new closed decisions. (Decisions #1/#2/#6 were
  independently closed on `main` in the meantime with slightly different
  wording — reconciled when this branch merged; see the 2026-09-08 entries
  above.)
- GitHub: opened issues [#45](https://github.com/qwewe6/rcx_drive/issues/45)
  (research Mapbox vs. MapLibre, Milestone 5) and
  [#46](https://github.com/qwewe6/rcx_drive/issues/46) (photo/video evidence on
  check-ins for crawler-score verification, Milestone 7); added call-context
  comments to #19, #20, #22, #24. This is in addition to the
  `phase1-map-app-incorporation.md`-driven GitHub updates Max already made
  today to #5/#8/#15/#16/#17/#18 and new issues #42/#43 — the call's "align
  project milestones" next step confirmed those stay as-is.
- Did all of the above on branch `docs/sprint-planning-1`, opened as a PR for
  Max to review.

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
