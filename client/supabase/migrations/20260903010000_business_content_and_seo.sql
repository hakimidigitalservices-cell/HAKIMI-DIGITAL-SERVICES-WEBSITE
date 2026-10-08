-- Hakimi Digital Services: editable services, prices, offers, reviews, Instagram feed and SEO settings
create table if not exists public.service_catalog (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,2),
  old_price numeric(12,2),
  badge text,
  category text,
  icon text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  service_name text,
  discount_text text,
  price numeric(12,2),
  old_price numeric(12,2),
  starts_at timestamptz,
  ends_at timestamptz,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  rating integer not null check (rating between 1 and 5),
  review_text text not null,
  source text not null default 'Website',
  avatar_url text,
  source_url text,
  is_featured boolean not null default true,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  site_title text not null default 'Hakimi Digital Services',
  seo_title text not null default 'Hakimi Digital Services | Business Registration, Licenses & Compliance',
  seo_description text not null default 'Hakimi Digital Services provides business registrations, licenses, certificates and compliance assistance across India.',
  seo_keywords text not null default 'business registration, GST, FSSAI, Udyam, Shop Act, trademark, documentation services India',
  og_image_url text,
  google_site_verification text,
  google_analytics_id text,
  instagram_username text,
  instagram_profile_url text,
  google_place_id text,
  google_reviews_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (true) on conflict (id) do nothing;

alter table public.service_catalog enable row level security;
alter table public.offers enable row level security;
alter table public.customer_reviews enable row level security;
alter table public.site_settings enable row level security;

-- Public website can read only published content.
drop policy if exists "public_read_active_services" on public.service_catalog;
create policy "public_read_active_services" on public.service_catalog for select to anon, authenticated using (is_active = true);

drop policy if exists "public_read_active_offers" on public.offers;
create policy "public_read_active_offers" on public.offers for select to anon, authenticated using (is_active = true);

drop policy if exists "public_read_active_reviews" on public.customer_reviews;
create policy "public_read_active_reviews" on public.customer_reviews for select to anon, authenticated using (is_active = true and is_featured = true);

drop policy if exists "public_read_site_settings" on public.site_settings;
create policy "public_read_site_settings" on public.site_settings for select to anon, authenticated using (true);

-- Admins can manage all content.
drop policy if exists "admins_manage_services" on public.service_catalog;
create policy "admins_manage_services" on public.service_catalog for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_manage_offers" on public.offers;
create policy "admins_manage_offers" on public.offers for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_manage_reviews" on public.customer_reviews;
create policy "admins_manage_reviews" on public.customer_reviews for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins_manage_site_settings" on public.site_settings;
create policy "admins_manage_site_settings" on public.site_settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.service_catalog (name,slug,description,price,old_price,badge,category,sort_order)
values
('Udyam Registration','udyam-registration','MSME / Udyam Registration assistance.',499,null,'Popular','Registration',1),
('GST Registration','gst-registration','New GST Registration for businesses and traders.',999,null,'Popular','Tax & Compliance',2),
('FSSAI License','fssai-license','FSSAI registration and license assistance for food businesses.',999,null,'','License',3),
('Shop Act License','shop-act-license','Shop & Establishment License assistance across India.',999,null,'','License',4),
('Company Registration','company-registration','Private Limited, LLP and OPC registration assistance.',2499,null,'','Business Registration',5),
('Trademark Registration','trademark-registration','Trademark filing and brand protection assistance.',2499,null,'','Intellectual Property',6)
on conflict (slug) do nothing;

create index if not exists service_catalog_active_order_idx on public.service_catalog(is_active, sort_order);
create index if not exists offers_active_order_idx on public.offers(is_active, sort_order);
create index if not exists reviews_active_featured_idx on public.customer_reviews(is_active, is_featured, created_at desc);
