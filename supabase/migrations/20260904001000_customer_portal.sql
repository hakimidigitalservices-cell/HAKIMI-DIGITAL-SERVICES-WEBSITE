-- Hakimi Digital Services: customer portal, ownership and support tickets
alter table public.applications add column if not exists user_id uuid references auth.users(id) on delete set null;
alter table public.applications add column if not exists updated_at timestamptz not null default now();
create index if not exists applications_user_id_idx on public.applications(user_id);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null,
  message text not null,
  status text not null default 'Open',
  admin_reply text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.support_tickets enable row level security;

drop policy if exists "Customers read own applications" on public.applications;
create policy "Customers read own applications" on public.applications
for select to authenticated using (auth.uid() = user_id);

drop policy if exists "Customers create own support tickets" on public.support_tickets;
create policy "Customers create own support tickets" on public.support_tickets
for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "Customers read own support tickets" on public.support_tickets;
create policy "Customers read own support tickets" on public.support_tickets
for select to authenticated using (auth.uid() = user_id);
grant select on public.applications to authenticated;
grant select, insert on public.support_tickets to authenticated;

-- Replace the application RPC so logged-in customers automatically own their application.
create or replace function public.submit_application(
  p_service text,
  p_full_name text,
  p_mobile_number text,
  p_whatsapp_number text,
  p_email text,
  p_state text,
  p_city text,
  p_document_url text default null,
  p_document_name text default null
) returns text
language plpgsql security definer set search_path = public
as $$
declare new_application_id text;
begin
  insert into public.applications (
    user_id, service, full_name, mobile_number, whatsapp_number, email,
    state, city, document_url, document_name
  ) values (
    auth.uid(), p_service, p_full_name, p_mobile_number, p_whatsapp_number, p_email,
    p_state, p_city, p_document_url, p_document_name
  ) returning application_id into new_application_id;
  return new_application_id;
end;
$$;
revoke all on function public.submit_application(text,text,text,text,text,text,text,text,text) from public;
grant execute on function public.submit_application(text,text,text,text,text,text,text,text,text) to anon, authenticated;

-- Admin access for the new support table.
drop policy if exists "Admins read support tickets" on public.support_tickets;
create policy "Admins read support tickets" on public.support_tickets
for select to authenticated using (public.is_admin());
drop policy if exists "Admins update support tickets" on public.support_tickets;
create policy "Admins update support tickets" on public.support_tickets
for update to authenticated using (public.is_admin()) with check (public.is_admin());
grant update on public.support_tickets to authenticated;
