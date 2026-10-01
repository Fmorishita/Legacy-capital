-- Leads de Legacy Capital: tabla privada + funciones RPC validadas.
-- La tabla NO es accesible con la llave pública (RLS activo, sin políticas).
-- El sitio escribe solo a través de public.submit_lead / public.qualify_lead,
-- que además exigen un secreto que vive únicamente en el servidor (Vercel).

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.settings (
  key text primary key,
  value text not null
);
revoke all on private.settings from public, anon, authenticated;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  nombre text not null check (char_length(nombre) between 2 and 120),
  telefono text not null check (char_length(telefono) between 8 and 25),
  email text check (email is null or char_length(email) <= 160),
  interes text check (interes is null or interes in ('2R', '3R', 'inversion', 'explorando')),
  lote smallint check (lote is null or lote between 1 and 500),
  origen text not null default 'web' check (char_length(origen) <= 40),
  mensaje text check (mensaje is null or char_length(mensaje) <= 1500),
  modo_visita text check (modo_visita is null or modo_visita in ('presencial', 'videollamada')),
  fecha_visita date,
  esquema_pago text check (esquema_pago is null or esquema_pago in ('financiado', 'contado')),
  horizonte_compra text check (horizonte_compra is null or horizonte_compra in ('0-3', '3-6', '6-12', 'explorando')),
  forma_pago text check (forma_pago is null or forma_pago in ('contado', 'credito', 'infonavit', 'usd')),
  uso text check (uso is null or uso in ('vivir', 'retiro', 'renta', 'broker')),
  idioma text not null default 'es' check (idioma in ('es', 'en')),
  utm_source text check (char_length(utm_source) <= 150),
  utm_medium text check (char_length(utm_medium) <= 150),
  utm_campaign text check (char_length(utm_campaign) <= 150),
  utm_content text check (char_length(utm_content) <= 150),
  utm_term text check (char_length(utm_term) <= 150),
  gclid text check (char_length(gclid) <= 300),
  fbclid text check (char_length(fbclid) <= 300),
  pagina text check (char_length(pagina) <= 500),
  referrer text check (char_length(referrer) <= 500),
  user_agent text check (char_length(user_agent) <= 400),
  estatus text not null default 'nuevo'
    check (estatus in ('nuevo', 'contactado', 'calificado', 'visita', 'apartado', 'cerrado', 'descartado')),
  notas text,
  edit_token uuid not null default gen_random_uuid()
);

comment on table public.leads is 'Leads del sitio de Legacy Capital. Escritura solo vía submit_lead / qualify_lead.';

alter table public.leads enable row level security;
revoke all on public.leads from anon, authenticated;

create index if not exists leads_created_at_idx on public.leads (created_at desc);
create index if not exists leads_estatus_idx on public.leads (estatus);
create index if not exists leads_telefono_idx on public.leads (telefono, created_at desc);

-- Alta de lead. Devuelve id + token para el segundo paso opcional (calificación).
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
    nombre, telefono, email, interes, lote, origen, mensaje, modo_visita, fecha_visita,
    esquema_pago, idioma, utm_source, utm_medium, utm_campaign, utm_content, utm_term,
    gclid, fbclid, pagina, referrer, user_agent
  ) values (
    left(trim(payload ->> 'nombre'), 120),
    v_phone,
    nullif(left(lower(trim(payload ->> 'email')), 160), ''),
    nullif(payload ->> 'interes', ''),
    nullif(payload ->> 'lote', '')::smallint,
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

-- Segundo paso opcional: solo actualiza columnas de calificación, con el token del alta, durante 2 días.
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
    updated_at = now()
  where id = (payload ->> 'id')::uuid
    and edit_token = (payload ->> 'token')::uuid
    and created_at > now() - interval '2 days';

  return found;
end;
$$;

revoke all on function public.submit_lead(jsonb) from public;
revoke all on function public.qualify_lead(jsonb) from public;
grant execute on function public.submit_lead(jsonb) to anon, authenticated, service_role;
grant execute on function public.qualify_lead(jsonb) to anon, authenticated, service_role;

-- Nota: el valor de private.settings.lead_secret se inserta fuera de esta migración
-- (no se versiona) y debe coincidir con LEADS_RPC_SECRET en Vercel:
--   insert into private.settings (key, value) values ('lead_secret', '<secreto>')
--   on conflict (key) do update set value = excluded.value;

-- Solo el rol anon (llave publicable usada por el servidor) necesita ejecutar estas funciones.
revoke execute on function public.submit_lead(jsonb) from authenticated;
revoke execute on function public.qualify_lead(jsonb) from authenticated;
comment on function public.submit_lead(jsonb) is 'Expuesta a anon a propósito: exige private.settings.lead_secret, que solo conoce el servidor del sitio.';
comment on function public.qualify_lead(jsonb) is 'Expuesta a anon a propósito: exige lead_secret + edit_token del lead, válido 2 días.';
