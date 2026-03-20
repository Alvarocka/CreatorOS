create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create type public.creative_item_type as enum (
  'text',
  'audio',
  'image',
  'video',
  'file',
  'link',
  'note'
);

create type public.workflow_status as enum (
  'idea',
  'draft',
  'in_progress',
  'review',
  'ready',
  'published',
  'archived'
);

create type public.visibility_status as enum ('private', 'public');
create type public.creative_note_type as enum ('general', 'mental', 'reference', 'lyric');
create type public.public_entity_type as enum ('item', 'project');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  generated_username text;
begin
  generated_username :=
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      regexp_replace(split_part(new.email, '@', 1), '[^a-zA-Z0-9_]+', '_', 'g') || '_' || substring(new.id::text, 1, 6)
    );

  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    lower(generated_username),
    nullif(new.raw_user_meta_data ->> 'display_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  display_name text,
  bio text,
  avatar_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_username_format check (username ~ '^[a-z0-9_]+$')
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text,
  cover_image_url text,
  status public.workflow_status not null default 'idea',
  visibility public.visibility_status not null default 'private',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.creative_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  content_text text,
  type public.creative_item_type not null,
  file_url text,
  thumbnail_url text,
  description text,
  project_id uuid references public.projects(id) on delete set null,
  status public.workflow_status not null default 'idea',
  visibility public.visibility_status not null default 'private',
  is_favorite boolean not null default false,
  archived_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

comment on column public.creative_items.file_url is 'Can store a Supabase Storage path or an external shared URL such as a public Sora video link.';

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text,
  created_at timestamptz not null default timezone('utc', now()),
  constraint tags_unique_name_per_user unique (user_id, name)
);

create table public.creative_item_tags (
  creative_item_id uuid not null references public.creative_items(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  primary key (creative_item_id, tag_id)
);

create table public.creative_item_notes (
  id uuid primary key default gen_random_uuid(),
  creative_item_id uuid not null references public.creative_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  note_type public.creative_note_type not null default 'general',
  content_text text not null,
  timestamp_seconds integer,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.public_shares (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  entity_type public.public_entity_type not null,
  entity_id uuid not null,
  slug text not null unique,
  created_at timestamptz not null default timezone('utc', now()),
  constraint public_shares_entity_unique unique (entity_type, entity_id)
);

create index projects_user_updated_idx on public.projects (user_id, updated_at desc);
create index projects_visibility_idx on public.projects (visibility, updated_at desc);
create index creative_items_user_updated_idx on public.creative_items (user_id, updated_at desc);
create index creative_items_project_idx on public.creative_items (project_id);
create index creative_items_status_idx on public.creative_items (status);
create index creative_items_visibility_idx on public.creative_items (visibility);
create index creative_items_title_trgm_idx on public.creative_items using gin (title gin_trgm_ops);
create index creative_items_description_trgm_idx on public.creative_items using gin (description gin_trgm_ops);
create index creative_items_content_trgm_idx on public.creative_items using gin (content_text gin_trgm_ops);
create index tags_user_name_idx on public.tags (user_id, name);
create index item_notes_item_idx on public.creative_item_notes (creative_item_id, created_at desc);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger projects_set_updated_at
before update on public.projects
for each row execute procedure public.set_updated_at();

create trigger creative_items_set_updated_at
before update on public.creative_items
for each row execute procedure public.set_updated_at();

create trigger creative_item_notes_set_updated_at
before update on public.creative_item_notes
for each row execute procedure public.set_updated_at();

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.creative_items enable row level security;
alter table public.tags enable row level security;
alter table public.creative_item_tags enable row level security;
alter table public.creative_item_notes enable row level security;
alter table public.public_shares enable row level security;

create policy "profiles_are_publicly_visible"
on public.profiles
for select
using (true);

create policy "users_manage_own_profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "users_view_own_projects"
on public.projects
for select
using (auth.uid() = user_id or visibility = 'public');

create policy "users_insert_own_projects"
on public.projects
for insert
with check (auth.uid() = user_id);

create policy "users_update_own_projects"
on public.projects
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users_delete_own_projects"
on public.projects
for delete
using (auth.uid() = user_id);

create policy "items_visible_to_owner_or_public"
on public.creative_items
for select
using (auth.uid() = user_id or visibility = 'public');

create policy "users_insert_own_items"
on public.creative_items
for insert
with check (auth.uid() = user_id);

create policy "users_update_own_items"
on public.creative_items
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "users_delete_own_items"
on public.creative_items
for delete
using (auth.uid() = user_id);

create policy "users_manage_own_tags"
on public.tags
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_tags_visible_when_attached_to_public_items"
on public.tags
for select
using (
  auth.uid() = user_id
  or exists (
    select 1
    from public.creative_item_tags cit
    join public.creative_items ci on ci.id = cit.creative_item_id
    where cit.tag_id = tags.id
      and ci.visibility = 'public'
  )
);

create policy "users_manage_own_item_tags"
on public.creative_item_tags
for all
using (
  exists (
    select 1
    from public.creative_items ci
    where ci.id = creative_item_tags.creative_item_id
      and ci.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.creative_items ci
    where ci.id = creative_item_tags.creative_item_id
      and ci.user_id = auth.uid()
  )
);

create policy "public_item_tags_visible_when_item_is_public"
on public.creative_item_tags
for select
using (
  exists (
    select 1
    from public.creative_items ci
    where ci.id = creative_item_tags.creative_item_id
      and (ci.user_id = auth.uid() or ci.visibility = 'public')
  )
);

create policy "users_manage_own_item_notes"
on public.creative_item_notes
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "public_shares_are_readable"
on public.public_shares
for select
using (true);

create policy "users_manage_own_public_shares"
on public.public_shares
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('creative-assets', 'creative-assets', false)
on conflict (id) do nothing;

create policy "authenticated_users_upload_own_assets"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'creative-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users_view_own_or_public_assets"
on storage.objects
for select
using (
  bucket_id = 'creative-assets'
  and (
    (auth.role() = 'authenticated' and (storage.foldername(name))[1] = auth.uid()::text)
    or exists (
      select 1
      from public.creative_items ci
      where (ci.file_url = name or ci.thumbnail_url = name)
        and ci.visibility = 'public'
    )
    or exists (
      select 1
      from public.projects p
      where p.cover_image_url = name
        and p.visibility = 'public'
    )
    or exists (
      select 1
      from public.profiles pr
      where pr.avatar_url = name
    )
  )
);

create policy "users_update_own_assets"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'creative-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'creative-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "users_delete_own_assets"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'creative-assets'
  and (storage.foldername(name))[1] = auth.uid()::text
);
