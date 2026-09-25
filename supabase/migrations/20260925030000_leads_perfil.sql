-- Perfil del comprador (según la sección de la página desde donde llega) e intenciones de compra
-- de segunda casa / para vivir. Cambios solo aditivos: ningún valor existente deja de ser válido.

alter table public.leads
  add column if not exists perfil text
  check (perfil is null or perfil in ('ensenada', 'california', 'mexicoamericano', 'monterrey', 'cdmx', 'guadalajara'));

alter table public.leads drop constraint if exists leads_interes_check;
alter table public.leads add constraint leads_interes_check
  check (interes is null or interes in ('2R', '3R', 'inversion', 'segunda_casa', 'vivir', 'explorando'));

alter table public.leads drop constraint if exists leads_uso_check;
alter table public.leads add constraint leads_uso_check
  check (uso is null or uso in ('segunda_casa', 'renta', 'vivir', 'retiro', 'broker'));

comment on column public.leads.perfil is 'Perfil de comprador elegido en la sección "Para quién" (ciudad u origen).';

create or replace function public.submit_lead(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_token uuid;
  v_phone text := left(trim(payload ->> 'telefono'), 25);
  v_recent int;
begin
  if coalesce(payload ->> 'secret', '') <> coalesce((select value from private.settings where key = 'lead_secret'), '#') then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  select count(*) into v_recent
  from public.leads
  where telefono = v_phone and created_at > now() - interval '10 minutes';
  if v_recent >= 3 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;

  insert into public.leads (
    nombre, telefono, email, interes, perfil, origen, mensaje, modo_visita, fecha_visita,
    esquema_pago, idioma, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    gclid, fbclid, pagina, referrer, user_agent
  ) values (
    left(trim(payload ->> 'nombre'), 120),
    v_phone,
    nullif(left(lower(trim(payload ->> 'email')), 160), ''),
    nullif(payload ->> 'interes', ''),
    nullif(payload ->> 'perfil', ''),
    coalesce(nullif(left(payload ->> 'origen', 40), ''), 'web'),
    nullif(left(payload ->> 'mensaje', 1500), ''),
    nullif(payload ->> 'modo_visita', ''),
    nullif(payload ->> 'fecha_visita', '')::date,
    nullif(payload ->> 'esquema_pago', ''),
    coalesce(nullif(payload ->> 'idioma', ''), 'es'),
    nullif(left(payload ->> 'utm_source', 150), ''),
    nullif(left(payload ->> 'utm_medium', 150), ''),
    nullif(left(payload ->> 'utm_campaign', 150), ''),
    nullif(left(payload ->> 'utm_content', 150), ''),
    nullif(left(payload ->> 'utm_term', 150), ''),
    nullif(left(payload ->> 'gclid', 300), ''),
    nullif(left(payload ->> 'fbclid', 300), ''),
    nullif(left(payload ->> 'pagina', 500), ''),
    nullif(left(payload ->> 'referrer', 500), ''),
    nullif(left(payload ->> 'user_agent', 400), '')
  )
  returning id, edit_token into v_id, v_token;

  return jsonb_build_object('id', v_id, 'token', v_token);
end;
$$;

-- create or replace conserva los permisos existentes; se reafirman por claridad
revoke all on function public.submit_lead(jsonb) from public;
revoke execute on function public.submit_lead(jsonb) from authenticated;
grant execute on function public.submit_lead(jsonb) to anon, service_role;
