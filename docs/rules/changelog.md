# Rule: update the changelog for any work

Every work session on this repo — code, docs, schema, config, GitHub setup (milestones/issues/labels) — ends with an entry appended to
[`docs/CHANGELOG.md`](../CHANGELOG.md) under `## [Unreleased]`, dated and attributed to whoever (or whichever agent session) did the work.

This applies equally to Max and Stephen, and to Claude Code sessions working on
either of our behalf. It's the reason this rule exists: we're two people working
mostly async, often steering an agent rather than typing every line ourselves, so
a coding agent picking up a fresh session (or the other engineer, next time they
sit down) needs a fast way to see what changed recently without replaying the
whole git log or issue history.

## What counts as "work"

- Code changes (features, fixes, refactors) of any real size.
- New or restructured docs.
- Schema/data-model changes.
- New/changed GitHub milestones, issue templates, CI config, or repo settings.
- Decisions logged in `docs/DECISIONLOG.md` (cross-reference the entry).

Trivial, purely mechanical changes (typo fixes, formatting-only commits, a
dependency patch bump with no behavior change) don't need an entry.

## What doesn't

- Nothing — if you're unsure, add the entry. A slightly noisy changelog is cheaper
  than a stale one nobody trusts.

## How

Follow the format documented at the top of `docs/CHANGELOG.md`: a `### YYYY-MM-DD —
<Name>` heading (reuse today's heading if one already exists for you), with brief
bullet points underneath. Link to the relevant issue/PR/doc where useful.

If you're a coding agent finishing a task in this repo, add this as your last step
before ending the session.
