-- Run this once in Supabase: Dashboard → SQL Editor → New query.
-- The API uses SUPABASE_SERVICE_ROLE_KEY on the server only, so RLS remains
-- enabled and no public browser access is granted to customer data.

create table if not exists public.quotes (
  id text primary key,
  email text not null,
  whatsapp text not null,
  message text not null default '',
  created_at timestamptz not null default now(),
  email_notification jsonb not null default '{"status":"pending","updatedAt":null}'::jsonb
);

create table if not exists public.custom_orders (
  id text primary key,
  email text not null,
  notes text not null default '',
  image_paths jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  meshy_task_id text,
  preview_token text not null,
  email_notification jsonb not null default '{"status":"pending","updatedAt":null}'::jsonb
);

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists custom_orders_created_at_idx on public.custom_orders (created_at desc);

alter table public.quotes enable row level security;
alter table public.custom_orders enable row level security;

-- Private bucket: images are only returned through short-lived signed URLs
-- after an authenticated admin request.
insert into storage.buckets (id, name, public)
values ('reference-images', 'reference-images', false)
on conflict (id) do update set public = false;
