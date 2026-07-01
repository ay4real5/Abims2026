-- Supabase schema for the wedding experience.
-- Run this in the Supabase SQL editor.

-- RSVPs ---------------------------------------------------------------
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  attending boolean not null default true,
  guests text default '1',
  meal text,
  dietary text,
  message text,
  created_at timestamptz not null default now()
);

-- Guestbook -----------------------------------------------------------
create table if not exists public.guestbook (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- Live gallery (store Cloudinary / Storage URLs) ----------------------
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  uploader text,
  created_at timestamptz not null default now()
);

-- Row Level Security: allow public insert + read (guest-facing site).
alter table public.rsvps enable row level security;
alter table public.guestbook enable row level security;
alter table public.gallery enable row level security;

create policy "public insert rsvps" on public.rsvps for insert with check (true);
create policy "public insert guestbook" on public.guestbook for insert with check (true);
create policy "public read guestbook" on public.guestbook for select using (true);
create policy "public insert gallery" on public.gallery for insert with check (true);
create policy "public read gallery" on public.gallery for select using (true);
