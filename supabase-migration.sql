-- cloud-vibe Supabase Migration
-- Run this in Supabase Dashboard → SQL Editor

-- Table 1: Store encrypted Cursor API keys
create table if not exists cursor_api_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  key_name text not null default 'Default',
  encrypted_key text not null,
  created_at timestamptz default now(),
  unique(user_id, key_name)
);

alter table cursor_api_keys enable row level security;

create policy "Users manage own keys"
  on cursor_api_keys for all
  using (auth.uid() = user_id);

-- Table 2: Repository list cache (strict rate limit on Cursor API)
create table if not exists repo_cache (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  repositories jsonb not null default '[]',
  cached_at timestamptz default now()
);

alter table repo_cache enable row level security;

create policy "Users manage own repo cache"
  on repo_cache for all
  using (auth.uid() = user_id);

-- Table 3: Agent bookmarks (optional labels/notes on agents)
create table if not exists agent_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  agent_id text not null,
  label text,
  pinned boolean default false,
  notes text,
  created_at timestamptz default now(),
  unique(user_id, agent_id)
);

alter table agent_bookmarks enable row level security;

create policy "Users manage own bookmarks"
  on agent_bookmarks for all
  using (auth.uid() = user_id);
