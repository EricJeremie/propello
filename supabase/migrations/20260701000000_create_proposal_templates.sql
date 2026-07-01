-- Company proposal templates users upload so Propello can match their format.
-- Files live in a private, owner-scoped bucket; a metadata row per upload lets
-- them appear in the template picker. Mirrors the proposal-briefs setup.

-- ---------- Storage bucket ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'proposal-templates',
  'proposal-templates',
  false,
  12582912,
  array[
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "proposal_templates_insert_own" on storage.objects;
create policy "proposal_templates_insert_own"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'proposal-templates'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "proposal_templates_select_own" on storage.objects;
create policy "proposal_templates_select_own"
on storage.objects for select to authenticated
using (
  bucket_id = 'proposal-templates'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "proposal_templates_delete_own" on storage.objects;
create policy "proposal_templates_delete_own"
on storage.objects for delete to authenticated
using (
  bucket_id = 'proposal-templates'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- ---------- Metadata table ----------
create table if not exists public.user_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  file_bucket text not null default 'proposal-templates',
  file_path text not null,
  file_name text,
  mime_type text,
  extracted_text text,
  created_at timestamptz not null default now()
);

create index if not exists user_templates_user_id_created_idx
  on public.user_templates (user_id, created_at desc);

alter table public.user_templates enable row level security;

drop policy if exists "user_templates_select_own" on public.user_templates;
create policy "user_templates_select_own"
on public.user_templates for select to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "user_templates_insert_own" on public.user_templates;
create policy "user_templates_insert_own"
on public.user_templates for insert to authenticated
with check (user_id = (select auth.uid()));

drop policy if exists "user_templates_delete_own" on public.user_templates;
create policy "user_templates_delete_own"
on public.user_templates for delete to authenticated
using (user_id = (select auth.uid()));
