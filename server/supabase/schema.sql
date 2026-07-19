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

create table if not exists public.catalogue_items (
  id text primary key,
  title text not null,
  category text not null default 'Popular',
  description text not null default '',
  material text not null,
  size text not null,
  price text not null,
  turnaround text not null,
  image_path text not null,
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists custom_orders_created_at_idx on public.custom_orders (created_at desc);
create index if not exists catalogue_items_order_idx on public.catalogue_items (display_order asc, created_at asc);

alter table public.quotes enable row level security;
alter table public.custom_orders enable row level security;
alter table public.catalogue_items enable row level security;

-- Private bucket: images are only returned through short-lived signed URLs
-- after an authenticated admin request.
insert into storage.buckets (id, name, public)
values ('reference-images', 'reference-images', false)
on conflict (id) do update set public = false;

-- Public product photos. Customer-uploaded reference images remain private.
insert into storage.buckets (id, name, public)
values ('catalogue-images', 'catalogue-images', true)
on conflict (id) do update set public = true;

-- Initial products keep the current website images. You can replace any image
-- from the admin panel; replacement images are stored in catalogue-images.
insert into public.catalogue_items
  (id, title, category, description, material, size, price, turnaround, image_path, display_order)
values
  ('catalogue-spidey-dino', 'Spidey and Dino', 'Trending', 'Expertly crafted articulated spider and dinosaur skeleton prints that combine precision, creativity, and durability.', 'PLA (multi-color)', '12–18 cm', '₹299', '2–3 days', '/images/spider.jpeg', 1),
  ('catalogue-warrior-holder', 'Incense Stick Holder - Warrior Edition', 'Trending', 'An intricately crafted warrior incense holder that adds a bold, artistic touch to your space while elegantly catching ash.', 'PLA+', '16 cm', '₹249', '2–3 days', '/images/warrior-incence-holder.png', 2),
  ('catalogue-samurai-holder', 'Incense Stick Holder - Samurai Edition', 'Trending', 'An elegantly designed samurai incense holder that blends traditional craftsmanship with modern décor.', 'PLA+', '14 cm', '₹199', '2–3 days', '/images/samurai-incence-stick.png', 3),
  ('catalogue-wardrobe-hanger', 'Wardrobe Hanger', 'Trending', 'A durable and space-saving wardrobe hanger designed to keep clothes organised and easy to access.', 'PLA+', '20 cm', '₹99', '1–2 days', '/images/wardrobe-hanger.png', 4),
  ('catalogue-moai-holder', 'Incense Stick Holder - Moai Edition', 'Trending', 'A Moai-inspired incense holder that brings a minimalist, artistic charm while neatly catching incense ash.', 'PLA+', '13 cm', '₹199', '2–3 days', '/images/maoi-incence-holder.png', 5),
  ('catalogue-leaf-bowl', 'Leaf Bowl', 'Trending', 'A leaf-shaped bowl for décor, jewellery, or small everyday essentials.', 'PLA+', '18 cm', '₹249', '2–3 days', '/images/leaf-bowl.png', 6),
  ('catalogue-keys-bowl', 'Bowl - Coins and Keys', 'Trending', 'A practical catch-all bowl for coins, keys, and everyday essentials.', 'PLA+', '14 cm', '₹199', '2–3 days', '/images/coin-keys-bowl.png', 7),
  ('catalogue-remote-organiser', 'Remote Organiser', 'Trending', 'A practical remote organiser for remotes, gadgets, and everyday essentials.', 'PLA+', '22 cm', '₹349', '2–3 days', '/images/remote-organiser.png', 8),
  ('catalogue-kitchen-organiser', 'Spoon-Fork-Glasses Organiser', 'Trending', 'A versatile organiser for kitchen essentials and countertop storage.', 'PLA+', '18 cm', '₹249', '2–3 days', '/images/spoon-fork-organiser.png', 9)
on conflict (id) do nothing;
