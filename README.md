# RCxDrive

"Strava for RC Crawlers" — a mobile-first social/tracking app for the RC crawling
community, pairing with Racebox (and future) onboard telemetry hardware.

Stack: React Native via Expo (managed workflow + EAS dev builds), TypeScript,
expo-router. Backend: Supabase (Postgres + PostGIS + Auth + Realtime) for the
app shell, with a separate Python/FastAPI service for telemetry/geospatial/ETL
work — see `docs/DECISIONLOG.md` #1/#6.

## Getting started

```
npm install --legacy-peer-deps
npm start
```

(`--legacy-peer-deps` is required — some of expo-router's transitive web
dependencies have peer conflicts that npm's default resolver won't settle;
this is a known Expo ecosystem issue, not specific to this repo.)

- `npm run typecheck` / `npm run lint` / `npm run format:check` / `npm test`
  — all run in CI on every PR (see `.github/workflows/ci.yml`).
- `eas.json` has a `development` build profile — BLE (Racebox pairing) needs
  an EAS dev client build, not Expo Go.

## Docs

- Research: [`docs/research/`](docs/research/) — the Strava teardown, the
  Phase I map app spec, and stack research feeding the plans below.
- Plans: [`docs/plans/`](docs/plans/) — one plan doc per major initiative,
  starting with [`initial-scaffolding.md`](docs/plans/initial-scaffolding.md).
- [`docs/DECISIONLOG.md`](docs/DECISIONLOG.md) — open/closed cross-cutting
  decisions.
- [`docs/ux/user-personas.md`](docs/ux/user-personas.md) — who each feature
  is for.
- [`CLAUDE.md`](CLAUDE.md) — repo/team conventions, including the changelog
  rule ([`docs/CHANGELOG.md`](docs/CHANGELOG.md)).
- GitHub [milestones/issues](https://github.com/qwewe6/rcx_drive/milestones)
  are the source of truth for feature-level scope.
