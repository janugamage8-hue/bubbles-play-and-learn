-- ==============================================================================
-- Bubbles Play & Learn Co. - Supabase Database Schema
-- Table: orders
-- Description: Stores customer orders placed through the website checkout flow
-- ==============================================================================

-- 1. Create the orders table if it doesn't already exist
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  customer_address text not null,
  district text not null,
  delivery_notes text,
  items jsonb not null default '[]'::jsonb,
  total_amount numeric(12, 2) not null default 0,
  payment_method text not null default 'cod',
  status text not null default 'Pending'
);

-- Ensure all required columns exist even if the table was previously created with fewer columns
alter table public.orders add column if not exists order_number text;
alter table public.orders add column if not exists customer_name text;
alter table public.orders add column if not exists customer_phone text;
alter table public.orders add column if not exists customer_email text;
alter table public.orders add column if not exists customer_address text;
alter table public.orders add column if not exists district text;
alter table public.orders add column if not exists delivery_notes text;
alter table public.orders add column if not exists items jsonb default '[]'::jsonb;
alter table public.orders add column if not exists total_amount numeric(12, 2) default 0;
alter table public.orders add column if not exists payment_method text default 'cod';
alter table public.orders add column if not exists status text default 'Pending';

-- 2. Documentation comments
comment on table public.orders is 'Customer orders placed on Bubbles Play & Learn website';
comment on column public.orders.items is 'JSONB array of ordered items, quantities, and pricing breakdown';
comment on column public.orders.status is 'Order fulfillment status: Pending, Packed, Handed to Courier, Delivered, Cancelled';

-- 3. Create indexes for fast querying in Admin Dashboard
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_customer_phone_idx on public.orders (customer_phone);
create index if not exists orders_district_idx on public.orders (district);

-- 4. Grant table access to anon and authenticated roles
grant usage on schema public to anon, authenticated;
grant all on table public.orders to anon, authenticated;

-- 5. Enable Row Level Security (RLS)
alter table public.orders enable row level security;

-- 6. Row Level Security Policies
-- Policy A: Anyone (public / anonymous customers) can insert new orders during checkout
drop policy if exists "Allow public to place orders" on public.orders;
create policy "Allow public to place orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

-- Policy B: Allow reading orders for Admin Dashboard and order confirmation
drop policy if exists "Allow reading orders" on public.orders;
drop policy if exists "Allow authenticated admins to read orders" on public.orders;
create policy "Allow reading orders"
  on public.orders
  for select
  to anon, authenticated
  using (true);

-- Policy C: Allow updating order fulfillment status
drop policy if exists "Allow updating orders" on public.orders;
drop policy if exists "Allow authenticated admins to update orders" on public.orders;
create policy "Allow updating orders"
  on public.orders
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Policy D: Allow deleting orders if needed
drop policy if exists "Allow deleting orders" on public.orders;
drop policy if exists "Allow authenticated admins to delete orders" on public.orders;
create policy "Allow deleting orders"
  on public.orders
  for delete
  to anon, authenticated
  using (true);

-- 7. Enable Realtime updates for live order notifications in Admin Dashboard
do $$
begin
  if exists (
    select 1 from pg_publication where pubname = 'supabase_realtime'
  ) then
    alter publication supabase_realtime add table public.orders;
  end if;
end $$;
