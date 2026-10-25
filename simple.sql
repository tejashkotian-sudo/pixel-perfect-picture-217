-- 001_progress.sql
-- Raw, append-only progress events.
-- Derived stats (streak, accuracy, badges, recommendations) are NOT stored;
-- they are computed client-side in src/lib/progress.ts from these rows.

create table if not exists public.progress_events (
  id         uuid primary key default gen_random_uuid(),
  -- default auth.uid() means inserts succeed under RLS even if the client forgets user_id
  user_id    uuid not null default auth.uid() references auth.users (id) on delete cascade,
  kind       text not null check (kind in ('lesson_completed', 'quiz_answered', 'conversation_completed')),
  item_id    text not null check (length(item_id) between 1 and 200),
  correct    boolean,
  score      integer check (score between 0 and 100),
  created_at timestamptz not null default now(),
  -- a quiz answer must say whether it was right
  constraint quiz_answer_has_result check (kind <> 'quiz_answered' or correct is not null)
);

create index if not exists progress_events_user_created_idx
  on public.progress_events (user_id, created_at desc);

-- A lesson or conversation can only be completed once per user (double-clicks are harmless)
create unique index if not exists progress_events_complete_once_idx
  on public.progress_events (user_id, kind, item_id)
  where kind in ('lesson_completed', 'conversation_completed');

-- Row Level Security: owner-only
alter table public.progress_events enable row level security;

drop policy if exists "progress_events_select_own" on public.progress_events;
create policy "progress_events_select_own"
  on public.progress_events for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "progress_events_insert_own" on public.progress_events;
create policy "progress_events_insert_own"
  on public.progress_events for insert to authenticated
  with check (user_id = (select auth.uid()));

-- Needed for a "reset my progress" button. No UPDATE policy: events are append-only.
drop policy if exists "progress_events_delete_own" on public.progress_events;
create policy "progress_events_delete_own"
  on public.progress_events for delete to authenticated
  using (user_id = (select auth.uid()));

grant select, insert, delete on public.progress_events to authenticated;
