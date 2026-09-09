# Connecting to the database

How to get a real Postgres + PostGIS instance running with the current
schema applied, and connect a GUI client (DBeaver or pgAdmin) to browse
tables and run ad-hoc queries. Written as Garage schema work ramps up and
`supabase/migrations/` starts changing more often — worth being able to
preview it locally rather than reading migration SQL cold.

## Current state: local only, no hosted project yet

No Supabase project has been provisioned yet (`docs/DECISIONLOG.md` #1/#6
confirm the hybrid Supabase + Python direction, but provisioning itself is
still pending). Until that happens, **the local Supabase CLI stack is the
real database** — it runs the same Postgres + PostGIS engine, applies
everything in `supabase/migrations/` automatically, and needs nothing
beyond Docker. Section 4 below covers connecting to a hosted project once
one exists — the client-side steps are identical, only the connection
details change.

## 1. Prerequisites

- **Docker**: Docker Desktop on macOS (Max); Docker Desktop with WSL2
  integration enabled for your distro on Windows (Stephen) — Settings →
  Resources → WSL Integration. This is what actually runs the local
  Postgres/Studio/Auth containers.
- **Supabase CLI**: already a devDependency (`supabase`, in
  `package.json`) — after `npm install --legacy-peer-deps`, `npx supabase`
  works identically on both platforms. No separate Homebrew/Scoop install
  needed.

## 2. Start the local stack

```
npx supabase start
```

First run pulls the Postgres/Auth/Studio/etc. images (a few minutes,
one-time); after that it's seconds. It runs `supabase/migrations/*.sql` in
order against a fresh database every time — currently
`0001_phase1_map_schema.sql` (the Phase I map schema: `users`, `rigs`,
`locations`, `features`, `lines`, `checkins`, `media`, PostGIS 3.3) and
`0002_user_profiles.sql` (the `profiles` table). Verified this applies
clean with no errors as of this doc.

When it's done, it prints a block of connection info (also available any
time via `npx supabase status` without restarting):

| What            | Value                                                     |
| --------------- | --------------------------------------------------------- |
| Postgres        | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` |
| Studio (web UI) | `http://127.0.0.1:54323`                                  |
| API URL         | `http://127.0.0.1:54321`                                  |

The `postgres`/`postgres` user/password isn't a secret to protect — it's
Supabase's fixed, publicly documented local-dev default, the same on every
machine that runs `supabase start`. Fine to hardcode in a GUI client's
saved connection.

Run `npx supabase stop` when you're done (frees the Docker resources; your
data persists in a Docker volume between `start`/`stop` unless you pass
`--no-backup` — anything in `supabase/migrations/` reapplies from scratch
if you do want a clean slate, e.g. after editing an already-applied
migration during local iteration).

**Fastest option, no install**: Supabase's own web Studio at
`http://127.0.0.1:54323` (table editor, SQL editor, no client setup) covers
a lot of what DBeaver/pgAdmin do, if you just want a quick look.

## 3. Connect a GUI client

### DBeaver (Max, macOS)

1. Download from [dbeaver.io](https://dbeaver.io/) if you don't have it —
   the free Community edition is fine.
2. **Database → New Database Connection → PostgreSQL**.
3. Connection settings:
   - Host: `127.0.0.1`
   - Port: `54322`
   - Database: `postgres`
   - Username: `postgres`
   - Password: `postgres`
4. **Test Connection** — DBeaver will offer to download the PostgreSQL JDBC
   driver the first time; accept.
5. Once connected, `public` schema has the tables listed above; PostGIS
   geometry columns render with DBeaver's built-in spatial viewer.

### pgAdmin (Stephen, Windows — DBeaver doesn't ship a native Windows build)

1. Install [pgAdmin](https://www.pgadmin.org/download/pgadmin-4-windows/)
   natively on Windows (not inside WSL2) — it's a GUI app, and Docker
   Desktop's WSL2 backend forwards container ports to `localhost` on the
   Windows side automatically, so a Windows-native pgAdmin reaches the
   database in WSL2's Docker without any extra networking config. (This is
   a different, simpler mechanism than the Expo/phone LAN issue in the
   README — Docker Desktop handles this one for you.)
2. Right-click **Servers → Register → Server…**
3. **General** tab: Name it anything (e.g. `rcxdrive-local`).
4. **Connection** tab:
   - Host name/address: `localhost` (or `127.0.0.1`)
   - Port: `54322`
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `postgres` (check "Save password" to skip re-entering it)
5. Save. Expand Servers → rcxdrive-local → Databases → postgres → Schemas
   → public → Tables to browse, or use the Query Tool for ad-hoc SQL.

## 4. Once a hosted Supabase project exists

Same client steps in section 3 — only the connection details change.
Get them from the Supabase dashboard: **Project Settings → Database →
Connection string** (use the pooled "Transaction" connection string for
anything serverless-ish; direct connection for a desktop GUI client is
fine either way). Hosted connections require SSL — both DBeaver and
pgAdmin have an SSL mode field in the same connection dialog; set it to
`require`. Never commit a hosted project's password — treat it like any
other production credential.
