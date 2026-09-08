# Decision Log

A single running table of cross-cutting decisions that don't belong to one plan
doc or GitHub issue — architecture/stack choices, naming, conventions. Larger
efforts (a whole feature area, a milestone's worth of design) stay scoped to their
own plan doc or GitHub issue; this doc is for the smaller, easy-to-lose "wait, did
we decide X?" items, and for tracking status on the handful of bigger open
questions until they're formally closed.

Add a row whenever a decision needs to be made or is made. Update `docs/CHANGELOG.md`
whenever a row here changes (per `docs/rules/changelog.md`).

| # | Decision | Status | Created by | Closed by | Resolution |
|---|---|---|---|---|---|
| 1 | Backend platform: Supabase (hosted Postgres + PostGIS + Auth + Realtime) vs. a custom backend service (more control, more setup). See `docs/plans/initial-scaffolding.md` §6 for original framing; `docs/research/python-backend-react-native-stack.md` (2026-09-06) adds a Python/FastAPI custom-backend option to weigh, given both engineers' Python background and upcoming geospatial/ETL work. | Closed | Max | Max | **Hybrid confirmed (2026-09-07):** Supabase (Postgres + PostGIS + Auth + Realtime) serves the mobile app directly for CRUD/auth (Accounts & Auth, Garage, Social Feed & Kudos). A separate Python/FastAPI service is kept as its own service (not merged into Supabase) for telemetry ingestion, GPS-to-feature matching/Crawler Score, and the photogrammetry pipeline — per Option D in `docs/research/python-backend-react-native-stack.md`. |
| 2 | Maps provider: Mapbox (better heatmap/style tooling, paid tiers) vs. MapLibre (open-source, no vendor lock-in, more setup work). | Closed | Max | Stephen | **MapLibre GL JS**, paired with Esri World Imagery (satellite/terrain basemap, 2M free tile requests/month) and a hosted vector-tile provider (MapTiler or Stadia Maps free tier) for road/place context. Reasoning: no navigation/geocoding-autocomplete need (the bulk of what Mapbox's price buys), off-road terrain visibility matters more than street styling for this audience, and both engineers' Postgres/PostGIS + Python fluency makes a self-hosted tile pipeline a realistic fallback if a provider's free tier gets tight. Revisit if we need turn-by-turn navigation or Mapbox Studio-grade style tooling later. See `docs/research/mapbox-vs-maplibre.md`. |
| 3 | Monorepo vs. single Expo app. Plan doc's recommendation is to stay single-app for MVP and revisit (e.g. Turborepo) only once the Web Dashboard (Milestone 11) becomes real work — treating that as a lean-to, not yet a formal close, since it's bundled with the still-open items above pending sign-off. | Open | Max | — | — |
| 4 | State management library: Zustand vs. Redux Toolkit. | Open | Max | — | — |
| 5 | Naming: what RCxDrive calls the "kudos"/like-equivalent social reaction (raised in `docs/research/strava-teardown.md` notes — "Kudos become whatever word RCxD uses for likes"). Feeds directly into Social Feed & Kudos (Milestone 7, issue #24). | Open | Max | — | — |
| 6 | Backend language/framework reconsideration: Python (FastAPI) vs. Node/TypeScript for the custom-backend option in decision #1, specifically weighing the team's Python fluency and the analytics/geospatial-ETL workload (drone photogrammetry → 3D terrain pipeline). Written up in `docs/research/python-backend-react-native-stack.md`. | Closed | Stephen | Max | Python (FastAPI), confirmed alongside decision #1 — the separate geospatial/ETL/photogrammetry service is Python, kept as its own service rather than folded into Supabase Edge Functions or a Node backend. |
| 7 | Scope and delivery model for the drone-photogrammetry / 3D terrain-map course-builder idea: drone-captured imagery vs. crowdsourced smartphone LiDAR/photogrammetry, which open-source Python mapping/photogrammetry library to standardize on, and whether/how it's paywalled. Tracked as GitHub Milestone "Terrain Mapping — Drone & Crowdsourced Photogrammetry." | Open | Stephen | — | — |
| 8 | Cloud storage/retention policy for user-submitted photogrammetry images (short-term storage to process a 3D scan, then presumably deleted/archived) — cost, privacy, and whether this is per-user quota-limited as part of the paywall in decision #7. | Open | Stephen | — | — |
