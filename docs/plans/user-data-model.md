# User data model — Milestone 2 (Accounts & Auth)

Resolves issue #5 ("Design user data model") under
[Milestone 2 — Accounts & Auth](https://github.com/qwewe6/rcx_drive/milestone/2).

## Goals

- One canonical `profiles` row per app user, separate from Supabase's
  managed `auth.users` table (per Supabase convention — `auth.users` is
  owned by the Auth service and shouldn't carry app-specific columns).
- Fields needed by the screens this milestone ships: display name,
  username (handle), avatar, short bio, home location (for the "far from
  Denver" flag pattern already used in the Phase I location data).
- A clean seam for Garage (Milestone 3) and Social Feed (Milestone 7) to
  hang off of later, without having to migrate this table again.

## Schema

`profiles` (see `supabase/migrations/0002_user_profiles.sql` for the
runnable migration):

| column                  | type                                 | notes                                                                                                                       |
| ----------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `id`                    | `uuid primary key`                   | same value as `auth.users.id` — 1:1, not a separate identity                                                                |
| `username`              | `text unique not null`               | handle, e.g. for profile URLs/@mentions later                                                                               |
| `display_name`          | `text`                               | shown in feed/leaderboards                                                                                                  |
| `avatar_url`            | `text`                               | nullable; Supabase Storage URL once Storage is wired up                                                                     |
| `bio`                   | `text`                               | nullable, short free text                                                                                                   |
| `home_lat` / `home_lng` | `double precision`                   | nullable; same shape as `locations.lat/lng` in the Phase I schema, reused so distance-based features can compare against it |
| `created_at`            | `timestamptz not null default now()` |                                                                                                                             |
| `updated_at`            | `timestamptz not null default now()` | bumped by trigger on update                                                                                                 |

## Key decisions

1. **`profiles.id` = `auth.users.id`, not a surrogate key.** Auth provider
   linkage (email, OAuth identities, password) stays entirely inside
   Supabase Auth's own tables — `profiles` never duplicates credentials or
   provider metadata. This is the standard Supabase pattern and keeps
   Milestone 2 from having to model OAuth providers itself.
2. **Row auto-created on sign-up**, not by the client. A
   `handle_new_user()` trigger on `auth.users` inserts a starter
   `profiles` row (username defaulted from the email local-part,
   display_name null) the moment a user is created — including via OAuth
   providers added later — so the app never has a signed-up user with no
   profile row to read.
3. **Garage/rigs relationship is a future FK, not modeled yet.** Milestone
   3 (Garage) will add a `rigs` table with `owner_id uuid references
profiles(id)`. Nothing in this migration needs to anticipate rig
   columns — `profiles.id` being stable is the only thing that future
   table depends on.
4. **RLS from day one.** `profiles` ships with row-level security enabled:
   anyone can `select` (profiles are public-by-default, matching a
   Strava-style social app), but `insert`/`update` are restricted to
   `auth.uid() = id`. This mirrors the RLS pattern in mind for the
   Phase I geospatial tables, which don't have RLS yet — this is the
   first table in the repo to actually turn it on.

## What this milestone does and doesn't do

Same caveat as the Phase I schema in Milestone 1: this migration is
correct and ready to run, but **actually provisioning a Supabase project
and applying it is separate work**, tracked outside Milestone 2 (you
confirmed on 2026-09-07 that a real project isn't set up yet). Until
then, the app runs against `src/services/auth/mockAuthService.ts` — see
`docs/plans/initial-scaffolding.md` update and the auth service code for
how the two implementations are swapped in without touching screen code.
