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
  (one-issue-per-PR as a foundational-stage *guideline*, not a hard rule —
  corrected after an initial pass called it a "policy") and #10 (build order:
  User → Garage → Map) as new closed decisions.
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
