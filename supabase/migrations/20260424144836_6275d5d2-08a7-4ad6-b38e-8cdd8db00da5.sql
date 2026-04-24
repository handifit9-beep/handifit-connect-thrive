
-- Profiles table
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  disability_type text check (disability_type in ('visual','hearing','both','none')) default 'none',
  voice_enabled boolean default true,
  high_contrast boolean default false,
  fitness_level text check (fitness_level in ('beginner','intermediate','advanced')) default 'beginner',
  preferred_language text default 'fr',
  goals text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users view own profile" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "Users insert own profile" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "Users update own profile" on public.profiles
  for update to authenticated using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
