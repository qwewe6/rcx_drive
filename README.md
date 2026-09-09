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
  — all run in CI on every PR (see `.github/workflows/ci.yml`); run
  `npm run ci` locally before pushing (see
  [`docs/rules/local-ci-checks.md`](docs/rules/local-ci-checks.md)).
- `eas.json` has a `development` build profile — BLE (Racebox pairing) needs
  an EAS dev client build, not Expo Go. See "Run on your phone" below.

## Run on your phone

Both of us are iPhone users, so this covers iOS. `expo-dev-client` is
already a dependency and `eas.json` already has a `development` build
profile — set up ahead of adding BLE (`react-native-ble-plx`, for Racebox
pairing), since BLE needs a custom dev client and can't run in the plain
Expo Go app from the App Store.

**One-time: build the dev client** (rebuild only when a _native_ dependency
changes — not for regular JS/TSX edits):

```
npx eas login                                      # once per machine
npx eas device:create                              # register your iPhone once
npx eas build --profile development --platform ios
```

This is a cloud build — EAS builds it on Apple's infrastructure and gives
you an install link/QR code when it's done. No Xcode required for this
path.

**Day-to-day**, once the dev client is installed on your phone:

```
npx expo start
```

It detects `expo-dev-client` and targets the dev client automatically;
scan the QR code with your phone's camera or the dev client app's built-in
scanner. Fast Refresh works the same as it would in Expo Go from there —
you only redo the build above when a native dependency changes.

### Platform nuances (Max: macOS / Stephen: WSL2 on Windows)

- **Max (macOS)**: the steps above work as-is. You also have the option of
  `npx expo run:ios` for a local build via Xcode instead of the EAS cloud
  queue — faster iteration once a dev client is installed, though either
  path works fine.
- **Stephen (WSL2 on Windows)**: `expo run:ios` **won't work** — it needs
  Xcode, which only runs on macOS — so the EAS cloud build above isn't just
  the easier path, it's the only one. Separately, WSL2 doesn't share your
  phone's Wi-Fi network by default, so `npx expo start`'s LAN QR code won't
  be reachable from your phone as-is. Fix: run `npx expo start --tunnel`
  instead — a bit slower (routes through ngrok) but reliably reachable.
  (WSL2's newer "mirrored" networking mode can avoid the tunnel and its
  slight lag, but has had reported firewall/stability quirks as of early
  2026 — `--tunnel` is the safer default for now.) Also keep the project on
  the WSL2 Linux filesystem (e.g. `~/projects/...`, not `/mnt/c/...`) —
  Metro's file watching is much slower across the Windows/Linux filesystem
  boundary.

## Auth

Sign-up/login/profile (Milestone 2 — Accounts & Auth) run against
`src/services/auth/`, which has two interchangeable implementations behind
one `AuthService` interface (`src/services/auth/AuthService.ts`):

- **Mock (default)** — `mockAuthService.ts`, backed by `AsyncStorage` on
  the device. No backend required; this is what runs out of the box.
- **Supabase** — `supabaseAuthService.ts`, wired against
  `supabase/migrations/0002_user_profiles.sql`. Activates automatically
  once `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` are
  set (copy `.env.example` to `.env.local` and fill them in) — no code
  changes needed. See `docs/plans/user-data-model.md`.

## Docs

- Research: [`docs/research/`](docs/research/) — the Strava teardown, the
  Phase I map app spec, and stack research feeding the plans below.
- Plans: [`docs/plans/`](docs/plans/) — one plan doc per major initiative,
  starting with [`initial-scaffolding.md`](docs/plans/initial-scaffolding.md)
  and [`user-data-model.md`](docs/plans/user-data-model.md).
- [`docs/DECISIONLOG.md`](docs/DECISIONLOG.md) — open/closed cross-cutting
  decisions.
- [`docs/dev/database-access.md`](docs/dev/database-access.md) — run the
  local Postgres + PostGIS stack and connect DBeaver/pgAdmin to it.
- [`docs/ux/user-personas.md`](docs/ux/user-personas.md) — who each feature
  is for.
- [`CLAUDE.md`](CLAUDE.md) — repo/team conventions, including the changelog
  rule ([`docs/CHANGELOG.md`](docs/CHANGELOG.md)).
- GitHub [milestones/issues](https://github.com/qwewe6/rcx_drive/milestones)
  are the source of truth for feature-level scope.
