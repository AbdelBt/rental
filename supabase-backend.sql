-- Supabase backend pour Drivo (agences)
-- À coller dans le SQL editor Supabase (section SQL)

-- 1) Tables de base

create table if not exists agencies (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  city text,
  phone text,
  created_at timestamptz default now()
);

create table if not exists cars (
  id bigserial primary key,
  agency_id uuid not null references agencies(id) on delete cascade,
  name text not null,
  brand text,
  category text,
  city text,
  price numeric not null,
  price_week numeric,
  price_month numeric,
  fuel text,
  transmission text,
  seats int,
  deposit boolean default false,
  deposit_amount numeric,
  img text,
  rating numeric,
  added_at timestamptz default now()
);

create table if not exists reservations (
  id bigserial primary key,
  agency_id uuid not null references agencies(id) on delete cascade,
  car_id bigint not null references cars(id) on delete cascade,
  client_name text not null,
  client_email text,
  client_phone text,
  date_from date not null,
  date_to date not null,
  days int not null,
  total numeric not null,
  deposit numeric default 0,
  status text check (status in ('pending','confirmed','completed','cancelled')) default 'pending',
  city text,
  note text,
  created_at timestamptz default now()
);

create table if not exists payouts (
  id bigserial primary key,
  agency_id uuid not null references agencies(id) on delete cascade,
  amount_brut numeric not null,
  commission numeric not null,
  amount_net numeric not null,
  status text check (status in ('pending','paid')) default 'pending',
  period_start date,
  period_end date,
  created_at timestamptz default now()
);

create table if not exists blacklist (
  id bigserial primary key,
  agency_id uuid not null references agencies(id) on delete cascade,
  client_name text not null,
  client_phone text,
  reason text,
  severity text check (severity in ('low','medium','high')) default 'medium',
  created_at timestamptz default now()
);

-- Clients finaux (utilisateurs qui réservent)

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  email text unique not null,
  phone text,
  created_at timestamptz default now()
);

-- Documents KYC client (permis, CNI, etc.)

create table if not exists customer_documents (
  id bigserial primary key,
  customer_id uuid references customers(id) on delete cascade,
  doc_type text check (doc_type in ('license','id_front','id_back')) not null,
  url text not null,
  created_at timestamptz default now()
);

-- 2) Policies (RLS) de base : chaque agence ne voit que ses données

alter table agencies enable row level security;
alter table cars enable row level security;
alter table reservations enable row level security;
alter table payouts enable row level security;
alter table blacklist enable row level security;
alter table customers enable row level security;
alter table customer_documents enable row level security;

create policy "agencies: self only"
  on agencies
  for select using (auth.uid() = auth_user_id);

create policy "cars: by agency"
  on cars
  for all using (agency_id in (select id from agencies where auth_user_id = auth.uid()));

create policy "reservations: by agency"
  on reservations
  for all using (agency_id in (select id from agencies where auth_user_id = auth.uid()));

create policy "payouts: by agency"
  on payouts
  for all using (agency_id in (select id from agencies where auth_user_id = auth.uid()));

create policy "blacklist: by agency"
  on blacklist
  for all using (agency_id in (select id from agencies where auth_user_id = auth.uid()));

-- Les clients peuvent lire/écrire leurs propres données (à adapter selon ton besoin)

create policy "customers: self only"
  on customers
  for all using (auth.uid() = auth_user_id);

create policy "customer_documents: by customer"
  on customer_documents
  for all using (
    customer_id in (select id from customers where auth_user_id = auth.uid())
  );

-- 3) Exemple de vue pour le dashboard (revenus / résumé)

create or replace view agency_monthly_stats as
select
  a.id as agency_id,
  date_trunc('month', r.date_from) as month,
  sum(r.total) as revenue_month,
  count(*) as reservations_month
from agencies a
join reservations r on r.agency_id = a.id
group by a.id, date_trunc('month', r.date_from);

