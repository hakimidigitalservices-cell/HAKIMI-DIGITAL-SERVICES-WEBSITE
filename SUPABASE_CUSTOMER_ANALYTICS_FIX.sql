-- Customer login visibility + service usage + profit analytics for admins.
alter table public.applications add column if not exists charged_amount numeric(12,2);
alter table public.applications add column if not exists cost_amount numeric(12,2);
create index if not exists applications_user_id_idx on public.applications(user_id);

create or replace function public.admin_customer_overview()
returns table (
  user_id uuid,
  full_name text,
  email text,
  mobile_number text,
  whatsapp_number text,
  last_sign_in_at timestamptz,
  application_count bigint,
  services text[]
)
language sql stable security definer set search_path=public
as $$
  select u.id,
    coalesce(nullif(u.raw_user_meta_data->>'full_name',''), nullif(u.raw_user_meta_data->>'name',''), split_part(coalesce(u.email,''),'@',1)) as full_name,
    u.email,
    coalesce(u.raw_user_meta_data->>'mobile_number','') as mobile_number,
    coalesce(u.raw_user_meta_data->>'whatsapp_number',u.raw_user_meta_data->>'mobile_number','') as whatsapp_number,
    u.last_sign_in_at,
    count(a.id) as application_count,
    coalesce(array_agg(distinct a.service) filter (where a.service is not null), '{}') as services
  from auth.users u
  left join public.applications a on a.user_id=u.id
  where public.is_admin()
    and not exists (select 1 from public.admin_users au where au.user_id=u.id)
  group by u.id, u.email, u.raw_user_meta_data, u.last_sign_in_at
  order by u.last_sign_in_at desc nulls last;
$$;
revoke all on function public.admin_customer_overview() from public;
grant execute on function public.admin_customer_overview() to authenticated;

create or replace function public.admin_profit_overview()
returns table (
 service text, customers bigint, applications bigint, revenue numeric, cost numeric, profit numeric
)
language sql stable security definer set search_path=public
as $$
 select a.service,
   count(distinct a.user_id) filter (where a.user_id is not null),
   count(*),
   coalesce(sum(a.charged_amount),0),
   coalesce(sum(a.cost_amount),0),
   coalesce(sum(coalesce(a.charged_amount,0)-coalesce(a.cost_amount,0)),0)
 from public.applications a
 where public.is_admin()
 group by a.service
 order by 6 desc, 3 desc;
$$;
revoke all on function public.admin_profit_overview() from public;
grant execute on function public.admin_profit_overview() to authenticated;

create or replace function public.admin_set_application_finance(p_id uuid,p_charged numeric,p_cost numeric)
returns public.applications
language plpgsql security definer set search_path=public
as $$
declare r public.applications;
begin
 if not public.is_admin() then raise exception 'Not authorized'; end if;
 update public.applications set charged_amount=p_charged,cost_amount=p_cost,updated_at=now() where id=p_id returning * into r;
 return r;
end;
$$;
revoke all on function public.admin_set_application_finance(uuid,numeric,numeric) from public;
grant execute on function public.admin_set_application_finance(uuid,numeric,numeric) to authenticated;
