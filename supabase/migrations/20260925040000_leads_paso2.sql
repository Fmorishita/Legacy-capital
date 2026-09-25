-- Formulario por pasos: el alta guarda nombre y WhatsApp; el segundo paso completa interés,
-- modalidad y fecha de visita y mensaje con el mismo token de edición (válido 2 días).
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

revoke all on function public.qualify_lead(jsonb) from public;
revoke execute on function public.qualify_lead(jsonb) from authenticated;
grant execute on function public.qualify_lead(jsonb) to anon, service_role;
