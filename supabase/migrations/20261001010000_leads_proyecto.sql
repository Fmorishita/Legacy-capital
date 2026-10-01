-- Portafolio con dos proyectos: preventa en El Sauzal y Viñedos del Mar (entrega inmediata).
-- Cada lead guarda de qué proyecto viene. Cambios solo aditivos y compatibles con la versión
-- anterior del sitio: si el formulario no manda proyecto, se registra como 'preventa' (hasta hoy
-- todas las páginas eran de la preventa).

alter table public.leads
  add column if not exists proyecto text
  check (proyecto is null or proyecto in ('preventa', 'vinedos', 'general'));

update public.leads set proyecto = 'preventa' where proyecto is null;

comment on column public.leads.proyecto is
  'Proyecto de interés: preventa (casas con roof garden en El Sauzal), vinedos (Viñedos del Mar, entrega inmediata) o general (aún no elige).';

-- Modelos y tipos de producto de Viñedos del Mar
alter table public.leads drop constraint if exists leads_interes_check;
alter table public.leads add constraint leads_interes_check
  check (interes is null or interes in (
    '2R', '3R', 'inversion', 'segunda_casa', 'vivir', 'explorando',
    'depa', 'ph', 'casa', 'palomino', 'palomino_ph', 'azur', 'teide'
  ));

create index if not exists leads_proyecto_idx on public.leads (proyecto, created_at desc);

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
    nombre, telefono, email, interes, perfil, proyecto, origen, mensaje, modo_visita, fecha_visita,
    esquema_pago, idioma, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    gclid, fbclid, pagina, referrer, user_agent
  ) values (
    left(trim(payload ->> 'nombre'), 120),
    v_phone,
    nullif(left(lower(trim(payload ->> 'email')), 160), ''),
    nullif(payload ->> 'interes', ''),
    nullif(payload ->> 'perfil', ''),
    coalesce(nullif(payload ->> 'proyecto', ''), 'preventa'),
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

-- El segundo paso del formulario también puede precisar el proyecto (desde la página principal)
create or replace function public.qualify_lead(payload jsonb)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(payload ->> 'secret', '') <> coalesce((select value from private.settings where key = 'lead_secret'), '#') then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  update public.leads set
    horizonte_compra = coalesce(nullif(payload ->> 'horizonte_compra', ''), horizonte_compra),
    forma_pago = coalesce(nullif(payload ->> 'forma_pago', ''), forma_pago),
    uso = coalesce(nullif(payload ->> 'uso', ''), uso),
    interes = coalesce(nullif(payload ->> 'interes', ''), interes),
    proyecto = coalesce(nullif(payload ->> 'proyecto', ''), proyecto),
    modo_visita = coalesce(nullif(payload ->> 'modo_visita', ''), modo_visita),
    fecha_visita = coalesce(nullif(payload ->> 'fecha_visita', '')::date, fecha_visita),
    mensaje = coalesce(nullif(left(payload ->> 'mensaje', 1500), ''), mensaje),
    updated_at = now()
  where id = (payload ->> 'id')::uuid
    and edit_token = (payload ->> 'token')::uuid
    and created_at > now() - interval '2 days';

  return found;
end;
$$;

revoke all on function public.submit_lead(jsonb) from public;
revoke execute on function public.submit_lead(jsonb) from authenticated;
grant execute on function public.submit_lead(jsonb) to anon, service_role;
revoke all on function public.qualify_lead(jsonb) from public;
revoke execute on function public.qualify_lead(jsonb) from authenticated;
grant execute on function public.qualify_lead(jsonb) to anon, service_role;
