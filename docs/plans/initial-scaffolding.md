# Initial Scaffolding Plan — RCxDrive

Status: **Repo + GitHub board live — pending sign-off on §6 open decisions before any feature code is written**

Repo: https://github.com/qwewe6/rcx_drive
Milestones/issues: all 11 milestones from §7 are created with an initial issue breakdown
(35 issues total) — see https://github.com/qwewe6/rcx_drive/milestones
Owner: Kk + SR Dev
Source material: `docs/research/strava-teardown.md` (the Strava analysis / RCxDrive translation doc)

## 1. Goal of this plan

Get the repo, tooling, and project structure in place so the team can start building
features "piece by piece" against a shared GitHub milestone/issue board. This plan
covers scaffolding only — no feature code is written until this plan and the resulting
GitHub milestones/issues are reviewed and approved.

## 2. Platform decision

- **Framework:** React Native via **Expo** (managed workflow + **EAS dev builds**), not a
  bare web app. One codebase targets iOS and Android.
- **Why Expo over bare RN CLI:** Expo's managed workflow with `expo-dev-client` /
  EAS Build still supports custom native modules — including BLE (`react-native-ble-plx`
  or `react-native-ble-manager`) needed for Racebox pairing — while giving us much faster
  scaffolding, OTA updates for JS-only changes, and simpler CI/CD via EAS. Bare RN CLI
  would only be worth the extra maintenance overhead if we hit a native requirement Expo's
  config-plugin system can't handle, which we don't expect for BLE + GPS + camera.
- **Language:** TypeScript throughout (app + shared types), strict mode on.

## 3. Core tech stack (proposed)

| Concern            | Choice                                                    | Notes                                                    |
| ------------------ | --------------------------------------------------------- | -------------------------------------------------------- |
| App framework      | Expo (SDK, latest stable) + `expo-router`                 | File-based routing, works for mobile-first nav           |
| Language           | TypeScript                                                | Strict mode                                              |
| Navigation         | `expo-router` (built on React Navigation)                 |                                                          |
| State management   | Zustand (or Redux Toolkit if team prefers)                | Lightweight, minimal boilerplate                         |
| Backend / DB       | **Open decision — see §6**                                | Needs Postgres + PostGIS for spatial/segment matching    |
| Auth               | Backend-dependent (Supabase Auth, or custom JWT)          |                                                          |
| Maps               | Mapbox GL (or MapLibre GL for open-source/no-cost option) | Needed for heatmap + line/segment rendering              |
| BLE (Racebox)      | `react-native-ble-plx`                                    | Requires EAS dev client, not Expo Go                     |
| Background GPS     | `expo-location` (background mode)                         | For continuous track recording during a crawl            |
| Push notifications | `expo-notifications`                                      | Kudos/social loop, "someone stole your KOM" style alerts |
| CI/CD              | EAS Build + EAS Submit, GitHub Actions for lint/test      |                                                          |
| Testing            | Jest + React Native Testing Library                       |                                                          |

## 4. Repo / folder structure

```
rcxdrive/
├── app/                    # expo-router screens (file-based routing)
│   ├── (auth)/
│   ├── (tabs)/
│   │   ├── feed.tsx
│   │   ├── map.tsx
│   │   ├── garage.tsx
│   │   └── profile.tsx
│   └── activity/[id].tsx
├── src/
│   ├── components/         # shared/reusable UI components
│   ├── features/           # feature-scoped logic (garage, telemetry, social, map, ...)
│   ├── services/           # API clients, BLE service, GPS service
│   ├── hooks/
│   ├── store/               # Zustand stores
│   ├── types/
│   └── utils/
├── assets/
├── docs/
│   ├── plans/               # THIS directory — planning docs, one per major initiative
│   └── research/             # source research (Strava teardown, market notes)
├── .github/
│   └── ISSUE_TEMPLATE/
├── app.config.ts
├── eas.json
├── package.json
└── tsconfig.json
```

## 5. Scaffolding steps (once this plan is approved)

1. `npx create-expo-app@latest rcxdrive --template expo-template-blank-typescript`
2. Add `expo-router`, set up the `(tabs)` layout skeleton (Feed / Map / Garage / Profile — one screen per core loop from the research doc).
3. Install core deps: navigation, state (zustand), maps SDK, `expo-location`, `expo-notifications`, `react-native-ble-plx`.
4. Configure `eas.json` with a `development` build profile (needed immediately since BLE requires a dev client, not Expo Go).
5. Set up ESLint + Prettier + TypeScript strict config.
6. Set up Jest baseline + one smoke test.
7. Set up GitHub Actions workflow: install, typecheck, lint, test on PR.
8. Wire up `.env` handling (`expo-constants` / `app.config.ts`) with placeholders for backend URL + Mapbox token — no real secrets committed.
9. First commit: "Initial Expo scaffold" — reviewed via PR, not pushed straight to main.

## 6. Open decisions (need answers before/while scaffolding)

- **Backend:** Supabase (hosted Postgres + PostGIS + Auth + Realtime — fastest path to an MVP) vs. a custom Node/Express + Postgres service (more control, more setup). Recommendation: start with Supabase for MVP velocity; revisit if we outgrow it.
- **Maps provider:** Mapbox (better heatmap/style tooling, has a free tier then paid) vs. MapLibre (open-source, no vendor lock-in, more setup work for heatmaps). Recommendation: Mapbox for MVP speed, given the Global Heatmap / route-building features are core to the product.
- **Monorepo vs. single app:** Given a future "web dashboard" (per the research doc, à la Strava's desktop analytics view) is planned but out of scope for MVP, we'll keep this a single Expo app now and revisit a monorepo (e.g. Turborepo) only when the web dashboard becomes real work.

## 7. Proposed GitHub milestones (for review — created after this plan is approved)

Derived from the feature loops in `docs/research/strava-teardown.md`. Each becomes a
GitHub milestone; issues are filed inside each milestone as the team scopes them out
piece by piece.

1. **Foundation & Scaffolding** — repo, Expo app, CI, lint/test, navigation skeleton (this plan).
2. **Accounts & Auth** — sign up/login, profile, user model.
3. **Garage** — rig CRUD, mods/upgrades, brand info, per-rig stats.
4. **Racebox / Telemetry Ingestion** — BLE pairing, live telemetry capture (GPS, speed, incline/lean angle, motor temp, etc.), session recording & upload.
5. **Map & Route/Line Discovery** — global heatmap, line/route creation and browsing, saved routes.
6. **Feature/Segment Matching & Crawler Score** — GPS-to-feature matching engine, leaderboard scoring logic.
7. **Social Feed & Kudos** — activity feed, kudos-equivalent, comments, notifications.
8. **Gamification & Leaderboards** — public leaderboards, "someone beat your score" notifications, badges.
9. **Monetization — Subscription** — premium gating for advanced telemetry/leaderboards/route builder.
10. **Monetization — Sponsored Challenges & Affiliate** — brand challenge system, affiliate links for parts/mods.
11. **Web Dashboard** (post-MVP) — desktop analytics view.

Created as GitHub milestones 1–11 with an initial issue breakdown per milestone (see repo link above). Treat this first pass as a starting layout, not a fixed spec — reorder, split, or merge issues as the team scopes each milestone out for real.

## 8. Explicit non-goals of this plan

- No feature code, no backend provisioning, no design work happens as part of this
  scaffolding plan. Those are tracked as issues inside their respective milestones above.
