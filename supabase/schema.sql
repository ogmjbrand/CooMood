-- CooMood commerce schema
-- Run against a Supabase project (SQL Editor or `supabase db push`).
-- Extends Supabase's built-in auth.users; do not create a custom users table.

create extension if not exists "pgcrypto";

-- ─── Customers ──────────────────────────────────────────────────────────────
create table if not exists public.customers (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  phone text,
  rewards_points integer not null default 0,
  referral_code text unique default substr(md5(random()::text), 1, 8),
  created_at timestamptz not null default now()
);

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid not null references public.customers (id) on delete cascade,
  label text,
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null default 'US',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Catalog ────────────────────────────────────────────────────────────────
create table if not exists public.collections (
  slug text primary key,
  name text not null,
  tagline text,
  description text,
  image_url text,
  mood text[] not null default '{}'
);

create table if not exists public.products (
  slug text primary key,
  name text not null,
  category text not null,
  collection_slug text references public.collections (slug),
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  image_url text,
  gallery text[] not null default '{}',
  description text,
  story text,
  notes_top text[] not null default '{}',
  notes_middle text[] not null default '{}',
  notes_base text[] not null default '{}',
  mood text[] not null default '{}',
  gender text not null default 'unisex',
  season text[] not null default '{}',
  longevity text,
  occasion text[] not null default '{}',
  size text,
  in_stock boolean not null default true,
  inventory_count integer not null default 0,
  featured boolean not null default false,
  is_new boolean not null default false,
  bestseller boolean not null default false,
  rating numeric(2, 1) not null default 0,
  review_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_slug text not null references public.products (slug) on delete cascade,
  customer_id uuid references public.customers (id) on delete set null,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  title text,
  body text,
  verified boolean not null default false,
  video_url text,
  created_at timestamptz not null default now()
);

-- ─── Custom Scent Builder ───────────────────────────────────────────────────
create table if not exists public.custom_scents (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.customers (id) on delete cascade,
  name text,
  bottle text not null,
  cap text not null,
  glass_color text not null,
  top_notes text[] not null default '{}',
  middle_notes text[] not null default '{}',
  base_notes text[] not null default '{}',
  size text not null,
  packaging text not null,
  gift_message text,
  price numeric(10, 2) not null,
  created_at timestamptz not null default now()
);

-- ─── Orders ─────────────────────────────────────────────────────────────────
create sequence if not exists public.order_number_seq start 10000;

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default 'CM-' || to_char(nextval('public.order_number_seq'), 'FM10000'),
  customer_id uuid references public.customers (id) on delete set null,
  email text not null,
  status text not null default 'pending', -- pending | processing | shipped | delivered | cancelled
  stripe_checkout_session_id text,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null default 0,
  tax numeric(10, 2) not null default 0,
  discount numeric(10, 2) not null default 0,
  total numeric(10, 2) not null,
  shipping_address jsonb,
  gift_wrap boolean not null default false,
  gift_message text,
  tracking_number text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_slug text references public.products (slug),
  custom_scent_id uuid references public.custom_scents (id),
  name text not null,
  unit_price numeric(10, 2) not null,
  quantity integer not null default 1,
  size text
);

-- ─── Marketing ──────────────────────────────────────────────────────────────
create table if not exists public.coupons (
  code text primary key,
  percent_off numeric(5, 2),
  amount_off numeric(10, 2),
  active boolean not null default true,
  expires_at timestamptz
);

create table if not exists public.gift_cards (
  code text primary key,
  balance numeric(10, 2) not null,
  issued_to_email text,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  email text primary key,
  subscribed_at timestamptz not null default now()
);

-- ─── Row Level Security ─────────────────────────────────────────────────────
alter table public.customers enable row level security;
alter table public.addresses enable row level security;
alter table public.reviews enable row level security;
alter table public.custom_scents enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.products enable row level security;
alter table public.collections enable row level security;

create policy "Public can read products" on public.products for select using (true);
create policy "Public can read collections" on public.collections for select using (true);
create policy "Public can read reviews" on public.reviews for select using (true);

create policy "Customers manage their own profile" on public.customers
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Customers manage their own addresses" on public.addresses
  for all using (auth.uid() = customer_id) with check (auth.uid() = customer_id);

create policy "Customers manage their own custom scents" on public.custom_scents
  for all using (auth.uid() = customer_id) with check (auth.uid() = customer_id);

create policy "Customers view their own orders" on public.orders
  for select using (auth.uid() = customer_id);

create policy "Customers view their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.customer_id = auth.uid()
    )
  );
