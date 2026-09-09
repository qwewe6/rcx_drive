# Rule: run CI checks locally before opening a PR

Run the same checks GitHub Actions runs — **before** pushing, not after seeing
them fail in the Actions tab. This applies equally to Max and Stephen, and to
Claude Code sessions working on either of our behalf.

## Why this rule exists

[Issue #50](https://github.com/qwewe6/rcx_drive/issues/50) is the reason this
doc exists: `main`'s CI failed on every single push from Milestone 1 onward
(`format:check` failing on files nobody had run Prettier against) before
anyone noticed, because nobody was running the checks locally first — CI was
the first time they ran at all. A red run after merge is much more expensive
to untangle than a red check on your own machine before you push: by the time
it's visible in Actions, it's already mixed in with whatever landed on `main`
after it.

## How

Run this before pushing or opening a PR:

```
npm run ci
```

This runs the exact same steps as [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml),
in the same order, with the same flags: `typecheck` → `lint` → `format:check`
→ `test -- --ci`. If it's green locally, CI should be green too — if it isn't,
either the workflow file or this script has drifted and needs fixing (see
below).

If a step fails:

- **`typecheck` / `lint`**: fix the reported errors.
- **`format:check`**: run `npm run format` (not `format:check`) to
  auto-fix, then re-run `npm run ci` to confirm.
- **`test`**: fix the failing test or the code it's testing — never skip or
  delete a test just to get the check green.

## Keeping this in sync with the actual CI workflow

`npm run ci` (in `package.json`) and `.github/workflows/ci.yml` must run the
same checks. The workflow keeps them as separate steps (so a failure is
attributed to a specific check in the Actions UI, not buried in one opaque
step) — if you add, remove, or reorder a check in one place, update the other
in the same PR.

## Scope

This covers the checks that exist today (typecheck/lint/format/test). If a
future PR adds a new CI step (e.g. a build step, an E2E suite), add it to both
`npm run ci` and the workflow, and this doc doesn't need to change — the rule
("run what CI runs, locally, first") stays the same regardless of what the
checks are.
