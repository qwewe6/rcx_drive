# Research: Python Backend + React Native Mobile — Stack Fit

Status: **Research / opinion doc — feeds decisions #1 and #6 in `docs/DECISIONLOG.md`, not a final call.**

Author: Stephen, 2026-09-06.

## 1. Why this doc exists

The mobile frontend is already decided (React Native via Expo, TypeScript —
`docs/plans/initial-scaffolding.md` §2), and that's not in question here. The
backend is still an open decision (`DECISIONLOG.md` #1), currently framed as
"Supabase vs. a custom Node/Express service." This doc adds a third option to that
comparison — a custom **Python** backend — and gives an opinion, because:

- **Both Max and I are most comfortable in Python.** Max is a backend engineer
  first, new to JS/TS; keeping his primary contribution surface in Python (rather
  than asking him to ramp on Node/Express _and_ learn RN/TS at the same time) is a
  real team-velocity argument, not just a preference.
- **The product has real analytics/ETL/geospatial workload**, independent of
  whatever serves the mobile app's CRUD/auth needs: telemetry ingestion and
  cleanup (M4), GPS-to-feature/segment matching and Crawler Score computation
  (M6), and — new as of today — a drone-photogrammetry-to-3D-terrain-map pipeline
  for the course-builder idea (see §5 and the new GitHub milestone). This is
  squarely Python's strength (GDAL, rasterio, PDAL, GeoPandas, shapely, numpy/
  pandas, scikit-learn, and the open-source photogrammetry tooling in §5), not
  Node's.

## 2. Framing: this isn't really "Python vs. Supabase," it's two separate questions

1. **Who serves the mobile app's day-to-day needs** (auth, profile, garage CRUD,
   feed, kudos, realtime-ish updates)? This is CRUD-shaped, high request volume,
   low computational complexity per request.
2. **Who does the heavy geospatial/analytics/ETL work** (telemetry processing,
   segment matching, Crawler Score, and eventually photogrammetry reconstruction)?
   This is batch/async-shaped, computationally heavy, low request volume, and
   benefits enormously from Python's geospatial/data ecosystem.

Trying to answer both with one tool is what makes this feel like an all-or-nothing
choice. It doesn't have to be.

## 3. Options

| Option                                                                                                                                       | What it is                                                                                                                                                                                                                                                                                                                                   | Strengths                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Weaknesses                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **A. Supabase only** (original plan doc's MVP recommendation)                                                                                | Hosted Postgres + PostGIS + Auth + Realtime; app talks to it directly (+ Supabase Edge Functions, which run Deno/TS, for light server logic).                                                                                                                                                                                                | Fastest to MVP; auth, DB, and realtime come free; PostGIS is there if we need it directly.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Edge Functions are TypeScript/Deno, not Python — so segment matching, scoring, and photogrammetry logic can't live there. Heavy geospatial/ETL work would need to happen somewhere else anyway (a separate worker), or get awkwardly forced into SQL/PostGIS functions.                                                              |
| **B. Custom Node/Express backend** (the plan doc's other original option)                                                                    | A hand-rolled API service in Node.                                                                                                                                                                                                                                                                                                           | More control than A; one language across mobile + backend (both TS).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Neither of us is a strong Node/TS backend engineer today; loses the "play to our strengths" advantage; Node's geospatial/scientific-computing ecosystem is much thinner than Python's (this matters a lot once photogrammetry/ETL work starts).                                                                                      |
| **C. Custom Python backend only (FastAPI + Postgres/PostGIS)**                                                                               | Max builds the whole API in FastAPI; Postgres+PostGIS self-hosted or managed (e.g. RDS, Neon, or Supabase's Postgres used _just_ as a database, without its API layer).                                                                                                                                                                      | Plays fully to Max's strengths; one language (Python) for API + ETL + geospatial + eventual photogrammetry pipeline; FastAPI + `geoalchemy2`/`asyncpg` + PostGIS is a solid, well-trodden geospatial-API stack; async support is good for telemetry ingestion.                                                                                                                                                                                                                                                                                                                                                              | We give up Supabase's free Auth/Realtime — have to build/own auth (or bolt on something like `fastapi-users` or Auth0/Clerk) and realtime (websockets or polling) ourselves. More infra to stand up and operate day one, which slows the CRUD-shaped MVP screens (Accounts, Garage, Feed) that don't need Python's strengths at all. |
| **D. Hybrid — Supabase (or managed Postgres+PostGIS) for the app shell, + a separate Python service for heavy work** _(recommended, see §4)_ | Supabase (Auth + Postgres/PostGIS + Realtime + simple CRUD via its auto-generated API) serves the mobile app directly for accounts/garage/feed/social. A separate FastAPI service, reading/writing the _same_ Postgres/PostGIS database, owns telemetry ingestion, segment matching, Crawler Score, and the photogrammetry/terrain pipeline. | Gets MVP velocity from Supabase for the boring CRUD 80% of the app, while giving the analytics/geospatial 20% (the actually hard, actually Python-shaped part) a proper Python home. Both engineers get to work where they're strongest — Max owns the FastAPI service end-to-end in Python; I mostly consume its outputs from RN and can still read/review the geospatial logic given my mapping background. Scales cleanly: the photogrammetry pipeline in particular is heavy/async/likely needs a job queue and possibly GPU workers — you want that isolated from the request/response app API regardless of language. | Two services instead of one — more moving parts operationally (two things to deploy/monitor), and a bit of care needed so both sides agree on the DB schema/migrations (one source of truth for migrations, ideally owned by the Python side since PostGIS/geospatial schema is the harder part).                                    |

## 4. Opinion / recommendation

**Go with Option D (hybrid).** Concretely:

- Keep Supabase (Postgres + PostGIS + Auth + Realtime) as the system of record and
  the thing the RN app talks to directly for Accounts & Auth (M2), Garage (M3),
  Social Feed & Kudos (M7) — all CRUD-shaped, all fine to build fast without
  Python.
- Stand up a FastAPI service (Max's primary surface) that connects to the same
  Postgres/PostGIS database, and owns:
  - Telemetry ingestion/ETL from Racebox sessions (M4).
  - GPS-to-feature matching + Crawler Score computation (M6) — this is exactly
    the kind of geometry/numeric-heavy work Python's geospatial stack
    (`shapely`, `geopandas`, PostGIS functions called from Python) is built for.
  - The drone-photogrammetry → 3D terrain pipeline (§5, new milestone) — this
    one _needs_ to be an async job-queue-driven Python service regardless of
    what the CRUD backend is, because photogrammetry reconstruction is
    minutes-to-hours of compute per job, not a request/response API call.
- This doesn't fully close decision #1 — it reframes it as "Supabase serves the
  app directly; Python service augments it for analytics/geospatial," which
  I think is the right shape, but it's still worth Max weighing in given he owns
  the Python side day to day, and both of us should agree on this before locking
  the CI/deploy setup around it. Recommend confirming this at the next sync,
  then closing decision #1/#6 in the decision log.
- If Max would rather not split services and prefers to own one Python backend
  end-to-end (Option C), that's a completely reasonable call given he's doing
  most of the backend build — flagging that as a real alternative, not just
  paying lip service to it. The main cost is rebuilding what Supabase gives away
  free (auth, realtime), so worth an explicit time-cost gut check before deciding.

## 5. The drone-photogrammetry → 3D terrain map idea

New idea from today's discussion, tracked as GitHub Milestone "Terrain Mapping —
Drone & Crowdsourced Photogrammetry" (see issues filed there) and decision log
entries #7 and #8. Rough pipeline, all very Python-native:

1. **Capture:** drone flight over a course/venue captures overlapping aerial
   imagery (this is a data-collection/ops task, not a software one — flight
   planning apps like Pix4Dcapture/DroneDeploy or a simple manual grid pattern).
2. **Reconstruction (open-source, Python-adjacent):**
   - **OpenDroneMap (ODM)** — the leading open-source drone photogrammetry
     toolkit, purpose-built for exactly this (aerial imagery → orthomosaic,
     DSM/DTM, textured 3D mesh, point cloud). Ships as a Docker image with a
     Python-based pipeline (`NodeODM`/`WebODM` for a job-queue UI on top). This
     is the strong default choice over general-purpose SfM tools like COLMAP or
     Meshroom/AliceVision, which are more suited to object-scale scans than
     large-area terrain.
   - Output formats (GeoTIFF orthomosaic, point cloud, mesh) load directly into
     a PostGIS-backed pipeline via `rasterio`/`PDAL`/`GDAL`.
3. **Serve as a 3D terrain map:** the reconstructed terrain needs a tiled
   3D/terrain viewer. Options: **Cesium** (mature, open-source-friendly,
   3D Tiles standard, has both web and native bindings) or a lighter-weight
   **Potree**-style point-cloud viewer for the web dashboard (M11); for the RN
   mobile app, plan on serving a simplified/pre-rendered asset (e.g. a textured
   mesh or a 2.5D heightmap-driven view) rather than trying to run a full
   photogrammetry viewer inside React Native — full 3D terrain exploration is
   likely a Web Dashboard (M11) feature, with mobile getting a lighter view.
4. **Crowdsourced smartphone version (paywalled power-user feature, per the
   product idea):** iOS devices with LiDAR (iPhone/iPad Pro) can use
   ARKit/RealityKit Object Capture for scan-quality mesh capture over smaller
   areas; Android/non-LiDAR devices would need photo-based photogrammetry
   (feed a phone's photo burst through the same ODM/Meshroom-style pipeline
   server-side). This is meaningfully more complex than the drone path — flag
   as its own scoping issue once the drone path is proven out, not both at once.
5. **Storage:** user-submitted images need short-term cloud storage during
   processing (decision #8) — object storage (S3-compatible; Supabase Storage
   is a fine fit given the hybrid stack in §4) with a retention/cleanup policy,
   since raw capture imagery is large and only needed until reconstruction
   completes.

This whole pipeline is async/batch/GPU-friendly and computationally heavy — a
strong argument on its own for the FastAPI + job-queue service in §4, independent
of how the CRUD backend question resolves.

## 6. Next steps

- [ ] Max: sanity-check the hybrid framing in §4 against real FastAPI/Supabase
      interop experience — anything that makes owning two services more painful
      than it sounds here?
- [ ] Decide auth story concretely if we go hybrid: Supabase Auth issuing JWTs
      that FastAPI validates (recommended — avoids building auth twice).
- [ ] Close decision #1/#6 in `docs/DECISIONLOG.md` once agreed.
- [ ] Scope the drone-photogrammetry milestone's first issue (likely: prove out
      an ODM pipeline against one test flight's imagery, before any app-side
      integration work).
