-- Angle app schema (run in Supabase SQL editor)

create table if not exists public.poses (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  image_key text,
  title text not null default '',
  keywords text[] not null default '{}',
  category text not null default 'women',
  shot_type text not null default 'portrait',
  locations text[] not null default '{}',
  people_count text[] not null default '{}',
  session_types text[] not null default '{}',
  styles text[] not null default '{}',
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.poses enable row level security;

create policy "poses_public_read" on public.poses
  for select using (is_published = true);

create policy "poses_authenticated_insert" on public.poses
  for insert to authenticated with check (true);

create index if not exists poses_created_at_idx on public.poses (created_at desc);
