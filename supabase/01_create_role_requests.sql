-- Migration: create role_requests table and RLS for Xdose

-- 1. Table for role requests
create table if not exists public.role_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  user_email text not null,
  status text not null default 'pending', -- 'pending', 'accepted', 'rejected'
  created_at timestamp with time zone default timezone('utc', now())
);

-- 2. Add role field to users (optional, for custom roles)
alter table auth.users add column if not exists role text default 'spectateur';

-- 3. Enable RLS
alter table public.role_requests enable row level security;

-- 4. RLS policies
-- Only the user can see/insert their own requests
create policy "Users can view their own role requests" on public.role_requests
  for select using (auth.uid() = user_id);

create policy "Users can insert their own role requests" on public.role_requests
  for insert with check (auth.uid() = user_id);

-- Only admin can update status
create policy "Admins can update status" on public.role_requests
  for update using (auth.role() = 'service_role');

-- 5. (Optional) RLS for users.role
alter table auth.users enable row level security;
create policy "Users can view their own role" on auth.users
  for select using (auth.uid() = id);

-- 6. Grant access to authenticated users
grant select, insert on public.role_requests to authenticated;
