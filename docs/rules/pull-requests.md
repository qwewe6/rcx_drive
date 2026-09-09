# Rule: opening pull requests

Conventions for opening a PR in this repo. Applies equally to Max and
Stephen, and to Claude Code sessions working on either of our behalf.

## Basics

- Branch off `main`; open a PR rather than pushing straight to `main` (see
  `docs/plans/initial-scaffolding.md` §5, step 9). Exceptions are rare and
  explicit — e.g. a single-doc change the author says to push directly.
- One issue per PR is the default during this foundational stage, not a hard
  rule — see `DECISIONLOG.md` decision #9 for why, and when it's fine to
  bundle more than one issue into a PR.
- Run `npm run ci` locally before pushing — see
  [`docs/rules/local-ci-checks.md`](local-ci-checks.md).
- Update `docs/CHANGELOG.md` before finishing — see
  [`docs/rules/changelog.md`](changelog.md).

## Closing issues automatically: repeat the keyword per issue

GitHub closes an issue on merge when a PR's description (or a commit message
on the default branch) contains a closing keyword — `closes`, `fixes`,
`resolves` (case-insensitive) — directly followed by the issue reference.
Same mechanism as GitLab.

**The keyword only applies to the issue immediately following it.** Writing

```
Closes #2, #3, #4.
```

only closes **#2**. `#3` and `#4` get linked in the PR sidebar (so you can
see the mention) but do **not** auto-close on merge — a subtle enough
difference that it's easy to not notice until someone checks the milestone
later and finds "done" issues still open.

**Repeat the keyword for every issue you want closed:**

```
Closes #2, closes #3, closes #4.
```

### Why this doc exists

This actually happened: PR #44 said "Closes #1, #2, #3, #4." and only closed
#1; PR #48 said "Closes #5, #6, #7." and only closed #5. Both PRs' work was
genuinely complete, but Milestone 1 and Milestone 2 both sat short of
"complete" on GitHub for a day because of this wording, until it was caught
and the remaining issues (#2–#4, #6, #7) were closed manually. Verify what a
PR will actually close before relying on the milestone view — the PR
sidebar's "Development" section lists the issues GitHub will actually close,
which is the source of truth, not the prose above it.
