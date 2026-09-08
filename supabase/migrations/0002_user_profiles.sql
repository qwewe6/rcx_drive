-- Milestone 2 (Accounts & Auth) — user profiles
-- Resolves issue #5 ("Design user data model").
-- See docs/plans/user-data-model.md for the rationale behind these choices.
--
-- NOT applied yet: this repo doesn't have a provisioned Supabase project
-- as of this migration landing (see docs/plans/user-data-model.md). Apply
-- with `supabase db push` / `supabase migration up` once one exists, same
-- as 0001_phase1_map_schema.sql.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text not null unique,
  display_name text,
  avatar_url text,
  bio text,
  home_lat double precision,
  home_lng double precision,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint username_length check (char_length(username) between 3 and 30),
  constraint home_lat_range check (home_lat is null or home_lat between -90 and 90),
  constraint home_lng_range check (home_lng is null or home_lng between -180 and 180)
);

comment on table public.profiles is
  'One row per app user, 1:1 with auth.users.id. Public fields only — '
  'auth provider linkage and credentials stay in auth.users.';

-- Keep updated_at current on every update.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row
  execute function public.set_updated_at();

-- Auto-create a starter profile row whenever a new auth user is created
-- (covers email/password sign-up and any OAuth provider added later).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'user_' || substr(new.id::text, 1, 8))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- RLS: profiles are publicly readable (social app — usernames/avatars are
-- meant to be seen), but only the owning user can create or edit their own.
alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by everyone" on public.profiles;
create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create index if not exists profiles_username_idx on public.profiles (username);
