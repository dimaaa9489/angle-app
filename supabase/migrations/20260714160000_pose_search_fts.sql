-- Full-text search index for Pinterest-style server-side pose search.
-- search_document is maintained by trigger (to_tsvector is not immutable for GENERATED columns).

create or replace function public.poses_refresh_search_document()
returns trigger
language plpgsql
as $$
begin
  new.search_document :=
    setweight(to_tsvector('simple', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(array_to_string(new.keywords, ' '), '')), 'B') ||
    setweight(
      to_tsvector(
        'simple',
        coalesce(new.category, '') || ' ' ||
        coalesce(new.shot_type, '') || ' ' ||
        coalesce(replace(new.shot_type, '-', ' '), '') || ' ' ||
        coalesce(array_to_string(new.locations, ' '), '') || ' ' ||
        coalesce(array_to_string(new.people_count, ' '), '') || ' ' ||
        coalesce(array_to_string(new.session_types, ' '), '') || ' ' ||
        coalesce(array_to_string(new.styles, ' '), '')
      ),
      'C'
    );
  return new;
end;
$$;

alter table public.poses
  add column if not exists search_document tsvector;

drop trigger if exists poses_search_document_refresh on public.poses;

create trigger poses_search_document_refresh
  before insert or update of title, keywords, category, shot_type, locations, people_count, session_types, styles
  on public.poses
  for each row
  execute function public.poses_refresh_search_document();

-- Backfill existing rows.
update public.poses
set search_document =
  setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(array_to_string(keywords, ' '), '')), 'B') ||
  setweight(
    to_tsvector(
      'simple',
      coalesce(category, '') || ' ' ||
      coalesce(shot_type, '') || ' ' ||
      coalesce(replace(shot_type, '-', ' '), '') || ' ' ||
      coalesce(array_to_string(locations, ' '), '') || ' ' ||
      coalesce(array_to_string(people_count, ' '), '') || ' ' ||
      coalesce(array_to_string(session_types, ' '), '') || ' ' ||
      coalesce(array_to_string(styles, ' '), '')
    ),
    'C'
  )
where search_document is null;

create index if not exists poses_search_document_gin
  on public.poses using gin (search_document);

create index if not exists poses_category_idx on public.poses (category);
create index if not exists poses_shot_type_idx on public.poses (shot_type);
create index if not exists poses_locations_gin on public.poses using gin (locations);
create index if not exists poses_people_count_gin on public.poses using gin (people_count);
create index if not exists poses_session_types_gin on public.poses using gin (session_types);
create index if not exists poses_styles_gin on public.poses using gin (styles);
create index if not exists poses_published_created_idx
  on public.poses (is_published, created_at desc);

create or replace function public.search_poses(
  p_query text default '',
  p_categories text[] default '{}',
  p_locations text[] default '{}',
  p_shot_types text[] default '{}',
  p_people_count text[] default '{}',
  p_session_types text[] default '{}',
  p_styles text[] default '{}',
  p_terms text[] default '{}',
  p_limit int default 48,
  p_offset int default 0
)
returns table (
  id uuid,
  image_url text,
  image_key text,
  title text,
  keywords text[],
  category text,
  shot_type text,
  locations text[],
  people_count text[],
  session_types text[],
  styles text[],
  is_published boolean,
  created_at timestamptz,
  rank real,
  total_count bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_has_text boolean;
begin
  v_has_text := length(trim(coalesce(p_query, ''))) > 0
    or coalesce(array_length(p_terms, 1), 0) > 0;

  return query
  with filtered as (
    select
      p.*,
      case
        when not v_has_text then 0::real
        when length(trim(coalesce(p_query, ''))) > 0
          and p.search_document @@ plainto_tsquery('simple', trim(p_query))
          then ts_rank(p.search_document, plainto_tsquery('simple', trim(p_query)))
        else 0::real
      end as base_rank
    from public.poses p
    where p.is_published = true
      and (
        coalesce(array_length(p_categories, 1), 0) = 0
        or p.category = any(p_categories)
      )
      and (
        coalesce(array_length(p_locations, 1), 0) = 0
        or p.locations && p_locations
      )
      and (
        coalesce(array_length(p_shot_types, 1), 0) = 0
        or p.shot_type = any(p_shot_types)
      )
      and (
        coalesce(array_length(p_people_count, 1), 0) = 0
        or p.people_count && p_people_count
      )
      and (
        coalesce(array_length(p_session_types, 1), 0) = 0
        or p.session_types && p_session_types
      )
      and (
        coalesce(array_length(p_styles, 1), 0) = 0
        or p.styles && p_styles
      )
      and (
        not v_has_text
        or (
          length(trim(coalesce(p_query, ''))) > 0
          and p.search_document @@ plainto_tsquery('simple', trim(p_query))
        )
        or exists (
          select 1
          from unnest(coalesce(p_terms, '{}'::text[])) as t(term)
          where length(trim(t.term)) >= 2
            and p.search_document @@ plainto_tsquery('simple', trim(t.term))
        )
      )
  ),
  ranked as (
    select
      f.*,
      greatest(
        f.base_rank,
        coalesce((
          select max(
            ts_rank(f.search_document, plainto_tsquery('simple', trim(t.term)))
          )
          from unnest(coalesce(p_terms, '{}'::text[])) as t(term)
          where length(trim(t.term)) >= 2
            and f.search_document @@ plainto_tsquery('simple', trim(t.term))
        ), 0)
      ) as rank
    from filtered f
  )
  select
    r.id,
    r.image_url,
    r.image_key,
    r.title,
    r.keywords,
    r.category,
    r.shot_type,
    r.locations,
    r.people_count,
    r.session_types,
    r.styles,
    r.is_published,
    r.created_at,
    r.rank,
    count(*) over() as total_count
  from ranked r
  order by r.rank desc, r.created_at desc
  limit greatest(p_limit, 1)
  offset greatest(p_offset, 0);
end;
$$;

grant execute on function public.search_poses(
  text, text[], text[], text[], text[], text[], text[], text[], int, int
) to anon, authenticated;
