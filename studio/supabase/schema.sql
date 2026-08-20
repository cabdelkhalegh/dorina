-- Dorina Studio — approvals backend
-- Apply with: supabase db push, or paste into the SQL editor, or
--   mcp apply_migration(project_id, 'dorina_studio_init', <this file>)
--
-- Design notes:
--  * Everything lives in its own `dorina` schema so it can sit in a shared project
--    without touching anything else.
--  * The Studio page is public (unlisted). The ONLY thing standing between a
--    stranger and Dorina's LinkedIn is this RLS policy — so writes require a
--    signed-in user whose email is explicitly allow-listed. No anonymous writes.
--  * The scheduled publisher uses the service-role key and bypasses RLS.

create schema if not exists dorina;

-- ---------------------------------------------------------------- who may act
create table if not exists dorina.allowed_editors (
  email      text primary key,
  label      text,
  created_at timestamptz not null default now()
);

comment on table dorina.allowed_editors is
  'Allow-list of emails that may read and write approvals. Add Dorina and AK only.';

-- ------------------------------------------------------------------ approvals
create table if not exists dorina.post_approvals (
  post_id    text primary key,
  status     text not null default 'waiting'
             check (status in ('waiting','approved','edits','held')),
  note       text default '',
  title      text,
  lang       text,
  updated_at timestamptz not null default now(),
  updated_by text
);

comment on table dorina.post_approvals is
  'One row per queued post. The publisher acts on status = approved and nothing else.';

create or replace function dorina.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.jwt() ->> 'email', new.updated_by);
  return new;
end $$;

drop trigger if exists post_approvals_touch on dorina.post_approvals;
create trigger post_approvals_touch
  before insert or update on dorina.post_approvals
  for each row execute function dorina.touch_updated_at();

-- ---------------------------------------------------------------- publish log
create table if not exists dorina.publish_log (
  id           bigserial primary key,
  post_id      text not null,
  platform     text not null,
  status       text not null check (status in ('published','failed','skipped')),
  remote_id    text,
  detail       text,
  published_at timestamptz not null default now()
);

comment on table dorina.publish_log is
  'Append-only record of every publish attempt. The Studio reads it to show what went out.';

-- Never publish the same post to the same platform twice.
create unique index if not exists publish_log_once
  on dorina.publish_log (post_id, platform)
  where status = 'published';

-- ------------------------------------------------------------------------ RLS
alter table dorina.allowed_editors enable row level security;
alter table dorina.post_approvals  enable row level security;
alter table dorina.publish_log     enable row level security;

create or replace function dorina.is_editor()
returns boolean language sql stable security definer set search_path = dorina, public as $$
  select exists (
    select 1 from dorina.allowed_editors e
    where lower(e.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists approvals_read  on dorina.post_approvals;
drop policy if exists approvals_write on dorina.post_approvals;
create policy approvals_read  on dorina.post_approvals
  for select to authenticated using (dorina.is_editor());
create policy approvals_write on dorina.post_approvals
  for all    to authenticated using (dorina.is_editor()) with check (dorina.is_editor());

drop policy if exists log_read on dorina.publish_log;
create policy log_read on dorina.publish_log
  for select to authenticated using (dorina.is_editor());
-- No insert policy: only the service-role publisher writes the log.

drop policy if exists editors_read on dorina.allowed_editors;
create policy editors_read on dorina.allowed_editors
  for select to authenticated using (dorina.is_editor());

-- ------------------------------------------------- expose the schema to PostgREST
grant usage on schema dorina to anon, authenticated;
grant select, insert, update on dorina.post_approvals to authenticated;
grant select on dorina.publish_log to authenticated;
grant select on dorina.allowed_editors to authenticated;
grant usage, select on all sequences in schema dorina to authenticated;

-- Remember: add "dorina" to Settings → API → Exposed schemas, or PostgREST
-- will not serve these tables and the Studio will get a 404 on every call.

-- ------------------------------------------------------------------ seed
-- Replace with the real addresses before running:
-- insert into dorina.allowed_editors (email, label) values
--   ('dorina@example.com', 'Dorina'),
--   ('c.abdel.khalegh@gmail.com', 'AK')
-- on conflict (email) do nothing;
