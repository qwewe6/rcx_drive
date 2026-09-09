# RCxDrive — repo guide for Claude Code

"Strava for RC Crawlers" — mobile-first social/tracking app for RC crawling,
pairing with Racebox (and future) onboard telemetry hardware. Currently in the
planning/scaffolding phase — see `README.md`.

## Team

Two engineers, both driving most work through Claude Code sessions:

- **Max** (GitHub: `qwewe6`) — backend engineer, power user, RC rock-crawling
  fanatic, deep understanding of the user stories driving this app. Strong Python,
  new to frontend/JS/TS.
- **Stephen** — Senior Frontend Engineer (React expert, geospatial/mapping
  background, government/defense contracting experience), solid backend
  understanding.

Because we work mostly async and lean heavily on agents, the docs below exist
specifically to keep two humans (and their agent sessions) in sync without a lot
of live coordination overhead.

## Required reading before non-trivial work

- [`docs/plans/`](docs/plans/) — one plan doc per major initiative. Start with
  [`initial-scaffolding.md`](docs/plans/initial-scaffolding.md) for stack/repo
  structure decisions.
- [`docs/DECISIONLOG.md`](docs/DECISIONLOG.md) — open/closed cross-cutting
  decisions. Check this before assuming something is settled (e.g. backend
  platform, maps provider — several core stack questions are still open).
- [`docs/ux/user-personas.md`](docs/ux/user-personas.md) — who a feature is for,
  used to prioritize/scope feature work.
- [`docs/research/`](docs/research/) — source research feeding the plans above
  (Strava teardown, stack research).

## Hard rule: update the changelog

**Every session that changes code, docs, schema, or GitHub config (milestones/
issues/CI) must append an entry to [`docs/CHANGELOG.md`](docs/CHANGELOG.md)**
before finishing. Full rule: [`docs/rules/changelog.md`](docs/rules/changelog.md).
If you're an agent finishing a task here, do this as your last step — don't rely
on the human to remember.

## Repo conventions

- GitHub milestones/issues are the source of truth for feature-level scope
  (https://github.com/qwewe6/rcx_drive/milestones). `DECISIONLOG.md` is only for
  smaller cross-cutting decisions that don't warrant their own issue.
- Branch off `main`; open a PR rather than pushing straight to `main` (see the
  scaffolding plan §5, step 9). Full PR conventions, including a closing-issue
  keyword gotcha worth knowing before you write a PR description:
  [`docs/rules/pull-requests.md`](docs/rules/pull-requests.md).
- Docs are Markdown, one topic per file; prefer adding to an existing doc/table
  over creating a near-duplicate.
