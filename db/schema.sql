create extension if not exists pgcrypto;
create table users(id uuid primary key default gen_random_uuid(),email text unique not null,password_hash text not null,created_at timestamptz default now());
create table parcels(id uuid primary key default gen_random_uuid(),user_id uuid not null references users(id) on delete cascade,
 dedup_key text not null,courier text,pickup_code text,station text,address text,tracking_no text,
 status text not null check(status in('pending','transit','delivered')),source text not null default 'paste',raw_text text,
 created_at timestamptz default now(),updated_at timestamptz default now(),unique(user_id,dedup_key));
create index on parcels(user_id,status,updated_at desc);
