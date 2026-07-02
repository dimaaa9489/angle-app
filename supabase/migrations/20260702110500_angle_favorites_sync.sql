create table if not exists public.favorite_folders (
  user_id uuid not null references auth.users(id) on delete cascade,
  id text not null,
  name text not null,
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  primary key (user_id, id)
);

create table if not exists public.favorite_items (
  user_id uuid not null references auth.users(id) on delete cascade,
  pose_id text not null,
  folder_id text not null,
  saved_at timestamptz not null default now(),
  primary key (user_id, pose_id, folder_id),
  foreign key (user_id, folder_id)
    references public.favorite_folders(user_id, id)
    on delete cascade
);

create index if not exists favorite_folders_user_created_idx
  on public.favorite_folders (user_id, created_at desc);

create index if not exists favorite_items_user_saved_idx
  on public.favorite_items (user_id, saved_at desc);

alter table public.favorite_folders enable row level security;
alter table public.favorite_items enable row level security;

create policy "favorite_folders_select_own" on public.favorite_folders
  for select using (auth.uid() = user_id);

create policy "favorite_folders_insert_own" on public.favorite_folders
  for insert with check (auth.uid() = user_id);

create policy "favorite_folders_update_own" on public.favorite_folders
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "favorite_folders_delete_own" on public.favorite_folders
  for delete using (auth.uid() = user_id);

create policy "favorite_items_select_own" on public.favorite_items
  for select using (auth.uid() = user_id);

create policy "favorite_items_insert_own" on public.favorite_items
  for insert with check (auth.uid() = user_id);

create policy "favorite_items_update_own" on public.favorite_items
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "favorite_items_delete_own" on public.favorite_items
  for delete using (auth.uid() = user_id);
