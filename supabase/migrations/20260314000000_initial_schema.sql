-- Visago — initial Supabase schema
-- Run in Supabase SQL Editor, or: supabase db push

create extension if not exists "pgcrypto";

-- Enums
do $$ begin
  create type public.user_role as enum ('b2b', 'b2c');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.application_status as enum (
    'draft', 'submitted', 'pending_docs', 'pending_payment', 'paid', 'approved', 'rejected'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_status as enum ('pending', 'success', 'failed', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.payment_method as enum ('upi', 'card', 'netbanking', 'wallet', 'demo');
exception when duplicate_object then null;
end $$;

-- Profiles (1:1 with auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role public.user_role not null default 'b2c',
  full_name text not null,
  email text not null,
  mobile text,
  company_name text,
  wallet_balance numeric(12,2) not null default 0 check (wallet_balance >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_details (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  gst_no text,
  pan_no text,
  tan_no text,
  address text,
  city text,
  state text,
  country text default 'INDIA',
  pin text,
  invoice_frequency text default 'Daily',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.evisa_countries (
  id text primary key,
  name text not null,
  region text not null,
  processing text,
  validity text,
  entry text,
  summary text,
  visa_fee numeric(12,2) not null default 0,
  handling_fee numeric(12,2) not null default 0,
  bank_charge_percent numeric(5,2) not null default 0,
  upi_bank_charge_percent numeric(5,2) not null default 0,
  required_docs jsonb not null default '[]'::jsonb,
  form_fields jsonb not null default '[]'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.visa_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  country_id text not null references public.evisa_countries (id),
  applicant_name text not null,
  passport_no text not null,
  email text not null,
  mobile text not null,
  address text,
  dob date,
  nationality text,
  departure_date date,
  return_date date,
  extra_fields jsonb not null default '{}'::jsonb,
  status public.application_status not null default 'draft',
  visa_fee numeric(12,2) not null default 0,
  handling_fee numeric(12,2) not null default 0,
  bank_charges numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.visa_applications (id) on delete cascade,
  doc_type text not null,
  file_name text not null,
  file_path text not null,
  mime_type text,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  application_id uuid references public.visa_applications (id) on delete set null,
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'INR',
  method public.payment_method not null default 'upi',
  status public.payment_status not null default 'pending',
  purpose text not null,
  provider text not null default 'razorpay',
  provider_payment_id text,
  created_at timestamptz not null default now()
);

create index if not exists idx_visa_applications_user on public.visa_applications (user_id);
create index if not exists idx_visa_applications_status on public.visa_applications (status);
create index if not exists idx_payments_user on public.payments (user_id);
create index if not exists idx_application_documents_app on public.application_documents (application_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated on public.profiles;
create trigger trg_profiles_updated
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_agent_details_updated on public.agent_details;
create trigger trg_agent_details_updated
before update on public.agent_details
for each row execute function public.set_updated_at();

drop trigger if exists trg_visa_applications_updated on public.visa_applications;
create trigger trg_visa_applications_updated
before update on public.visa_applications
for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, role, full_name, email, mobile, company_name)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'b2c'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    new.raw_user_meta_data->>'mobile',
    new.raw_user_meta_data->>'company_name'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.agent_details enable row level security;
alter table public.evisa_countries enable row level security;
alter table public.visa_applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.payments enable row level security;

-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Agent details
drop policy if exists "agent_details_select_own" on public.agent_details;
create policy "agent_details_select_own" on public.agent_details
  for select using (auth.uid() = user_id);

drop policy if exists "agent_details_upsert_own" on public.agent_details;
create policy "agent_details_insert_own" on public.agent_details
  for insert with check (auth.uid() = user_id);

drop policy if exists "agent_details_update_own" on public.agent_details;
create policy "agent_details_update_own" on public.agent_details
  for update using (auth.uid() = user_id);

-- Countries are public read
drop policy if exists "evisa_countries_public_read" on public.evisa_countries;
create policy "evisa_countries_public_read" on public.evisa_countries
  for select using (is_active = true);

-- Applications
drop policy if exists "visa_applications_select_own" on public.visa_applications;
create policy "visa_applications_select_own" on public.visa_applications
  for select using (auth.uid() = user_id);

drop policy if exists "visa_applications_insert_own" on public.visa_applications;
create policy "visa_applications_insert_own" on public.visa_applications
  for insert with check (auth.uid() = user_id);

drop policy if exists "visa_applications_update_own" on public.visa_applications;
create policy "visa_applications_update_own" on public.visa_applications
  for update using (auth.uid() = user_id);

-- Documents (via owning application)
drop policy if exists "application_documents_select_own" on public.application_documents;
create policy "application_documents_select_own" on public.application_documents
  for select using (
    exists (
      select 1 from public.visa_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

drop policy if exists "application_documents_insert_own" on public.application_documents;
create policy "application_documents_insert_own" on public.application_documents
  for insert with check (
    exists (
      select 1 from public.visa_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

-- Payments
drop policy if exists "payments_select_own" on public.payments;
create policy "payments_select_own" on public.payments
  for select using (auth.uid() = user_id);

drop policy if exists "payments_insert_own" on public.payments;
create policy "payments_insert_own" on public.payments
  for insert with check (auth.uid() = user_id);

-- Storage bucket for application documents (run once)
insert into storage.buckets (id, name, public)
values ('visa-documents', 'visa-documents', false)
on conflict (id) do nothing;

drop policy if exists "visa_docs_upload_own" on storage.objects;
create policy "visa_docs_upload_own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'visa-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "visa_docs_read_own" on storage.objects;
create policy "visa_docs_read_own" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'visa-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
