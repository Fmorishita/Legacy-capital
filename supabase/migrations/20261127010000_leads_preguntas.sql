-- Preguntas de filtro por pasos: propósito (vivir / descanso / inversión), plazo (se agrega "más de
-- un año") y fuente de pago (recursos propios / crédito / ambos). Se conservan los valores anteriores.
-- El último paso también puede traer el correo (cuando pide el material por email).

alter table public.leads drop constraint if exists leads_uso_check;
alter table public.leads add constraint leads_uso_check
  check (uso is null or uso in ('vivir', 'descanso', 'inversion', 'segunda_casa', 'renta', 'retiro', 'broker'));

alter table public.leads drop constraint if exists leads_horizonte_compra_check;
alter table public.leads add constraint leads_horizonte_compra_check
  check (horizonte_compra is null or horizonte_compra in ('0-3', '3-6', '6-12', '12+', 'explorando'));

alter table public.leads drop constraint if exists leads_forma_pago_check;
alter table public.leads add constraint leads_forma_pago_check
  check (forma_pago is null or forma_pago in ('propios', 'credito', 'ambos', 'contado', 'infonavit', 'usd'));

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
    email = coalesce(nullif(left(payload ->> 'email', 160), ''), email),
    updated_at = now()
  where id = (payload ->> 'id')::uuid
    and edit_token = (payload ->> 'token')::uuid
    and created_at > now() - interval '2 days';

  return found;
end;
$$;

revoke all on function public.qualify_lead(jsonb) from public;
revoke execute on function public.qualify_lead(jsonb) from authenticated;
grant execute on function public.qualify_lead(jsonb) to anon, service_role;
