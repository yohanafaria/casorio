-- =============================================================================
-- DANIEL & YOHANA — SCHEMA POSTGRESQL / SUPABASE COMPLETO
-- Execute este script no SQL Editor do Supabase (https://supabase.com)
-- =============================================================================

-- 1. Tabela de Presentes (Experiências da Lua de Mel)
create table if not exists gifts (
  id text primary key,
  name text not null,
  description text not null,
  long_description text,
  category text not null default 'Lua de mel',
  image text not null,
  price numeric(10,2) not null check (price >= 0),
  available_quantity integer not null default 1 check (available_quantity >= 0),
  allow_partial_contribution boolean not null default false,
  suggested_contributions numeric[] default '{}',
  active boolean not null default true,
  badge text,
  musical_note text,
  created_at timestamptz default now()
);

-- 2. Tabela de Confirmação de Presença (RSVP)
create table if not exists rsvps (
  id uuid primary key default gen_random_uuid(),
  token text unique not null,
  full_name text not null,
  email text not null,
  phone text not null,
  invite_code text,
  attending text not null check (attending in ('yes', 'no')),
  companions_count integer not null default 0 check (companions_count >= 0 and companions_count <= 10),
  companions jsonb not null default '[]'::jsonb,
  dietary_restrictions text,
  notes text,
  consent_accepted boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_rsvps_token on rsvps (token);
create index if not exists idx_rsvps_email_lower on rsvps (lower(email));

-- 3. Tabela de Pedidos de Presentes
create table if not exists orders (
  id text primary key,
  items jsonb not null,
  buyer_name text not null,
  buyer_email text not null,
  buyer_phone text not null,
  message text,
  subtotal numeric(10,2) not null check (subtotal >= 0),
  total numeric(10,2) not null check (total >= 0),
  status text not null default 'awaiting_payment' check (
    status in (
      'created',
      'awaiting_payment',
      'pending_confirmation',
      'paid_confirmed_by_backend',
      'rejected',
      'cancelled'
    )
  ),
  created_at timestamptz default now()
);

-- 4. Tabela de Pagamentos (Mercado Pago)
create table if not exists payments (
  payment_id text primary key,
  order_id text references orders(id) on delete cascade,
  status text not null,
  status_detail text,
  amount numeric(10,2) not null check (amount >= 0),
  payment_method text,
  verified_by_backend boolean not null default false,
  created_at timestamptz default now()
);

create index if not exists idx_payments_order_id on payments (order_id);
