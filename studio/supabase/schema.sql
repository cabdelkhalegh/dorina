-- Dorina Studio — approvals backend.  ** APPLIED AND LIVE **
--
-- Project: trxifnxyrncsoxgklwcq  (shared project, migration "dorina_studio_init")
--
-- Namespaced with a dorina_ prefix inside `public` rather than its own schema:
-- PostgREST only serves schemas listed under Settings -> API -> Exposed schemas,
-- and that is a dashboard setting. Prefixing keeps the tables isolated and the
-- setup reachable entirely from code.
--
-- To move to a dedicated project later: run this file there, then change
-- studio/supabase/config.js and the SUPABASE_* GitHub secrets. Nothing else.
-- To remove entirely: drop the three dorina_* tables and the two dorina_* functions.

create table if not exists public.dorina_allowed_editors (
  email      text primary key,
  label      text,
  created_at timestamptz not null default now()
);

comment on table public.dorina_allowed_editors is
  'Allow-list of emails that may read and write approvals. Add Dorina and AK only.';

-- ------------------------------------------------------------------ approvals
create table if not exists public.dorina_post_approvals (
  post_id    text primary key,
  status     text not null default 'waiting'
             check (status in ('waiting','approved','edits','held')),
  note       text default '',
  title      text,
  lang       text,
  updated_at timestamptz not null default now(),
  updated_by text
);

comment on table public.dorina_post_approvals is
  'One row per queued post. The publisher acts on status = approved and nothing else.';

create or replace function public.dorina_touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.jwt() ->> 'email', new.updated_by);
  return new;
end $$;

drop trigger if exists dorina_post_approvals_touch on public.dorina_post_approvals;
create trigger dorina_post_approvals_touch
  before insert or update on public.dorina_post_approvals
  for each row execute function public.dorina_touch_updated_at();

-- ---------------------------------------------------------------- publish log
create table if not exists public.dorina_publish_log (
  id           bigserial primary key,
  post_id      text not null,
  platform     text not null,
  status       text not null check (status in ('published','failed','skipped')),
  remote_id    text,
  detail       text,
  published_at timestamptz not null default now()
);

comment on table public.dorina_publish_log is
  'Append-only record of every publish attempt. The Studio reads it to show what went out.';

-- Never publish the same post to the same platform twice.
create unique index if not exists dorina_publish_log_once
  on public.dorina_publish_log (post_id, platform)
  where status = 'published';

-- ------------------------------------------------------------------------ RLS
alter table public.dorina_allowed_editors enable row level security;
alter table public.dorina_post_approvals  enable row level security;
alter table public.dorina_publish_log     enable row level security;

create or replace function public.dorina_is_editor()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.dorina_allowed_editors e
    where lower(e.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

drop policy if exists dorina_approvals_read  on public.dorina_post_approvals;
drop policy if exists dorina_approvals_write on public.dorina_post_approvals;
create policy dorina_approvals_read  on public.dorina_post_approvals
  for select to authenticated using (public.dorina_is_editor());
create policy dorina_approvals_write on public.dorina_post_approvals
  for all    to authenticated using (public.dorina_is_editor()) with check (public.dorina_is_editor());

drop policy if exists dorina_log_read on public.dorina_publish_log;
create policy dorina_log_read on public.dorina_publish_log
  for select to authenticated using (public.dorina_is_editor());
-- No insert policy: only the service-role publisher writes the log.

drop policy if exists dorina_editors_read on public.dorina_allowed_editors;
create policy dorina_editors_read on public.dorina_allowed_editors
  for select to authenticated using (public.dorina_is_editor());

-- ----------------------------------------------------------------- grants
grant select, insert, update on public.dorina_post_approvals to authenticated;
grant select on public.dorina_publish_log to authenticated;
grant select on public.dorina_allowed_editors to authenticated;

-- ------------------------------------------------------------------ seed
-- AK is already seeded. Add Dorina's real address before she signs in —
-- without a row here, RLS denies her everything even after a valid magic link:
--
--   insert into public.dorina_allowed_editors (email, label)
--   values ('her-real-address@example.com', 'Dorina')
--   on conflict (email) do nothing;
insert into public.dorina_allowed_editors (email, label)
values ('c.abdel.khalegh@gmail.com', 'AK')
on conflict (email) do nothing;
