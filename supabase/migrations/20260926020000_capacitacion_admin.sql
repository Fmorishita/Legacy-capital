-- Capacitación: funciones extra del panel de administrador.
--   admin_update_user: corrige nombre y teléfono (el nombre también se corrige en su certificado).
--   admin_questions_bulk: aprueba o descarta de una vez los borradores de un módulo.

create or replace function cap.fn_admin_update_user(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  a cap.usuarios := cap.admin(p);
  v_id uuid := (p ->> 'usuario')::uuid;
  v_nombre text := btrim(p ->> 'nombre');
  v_tel text := btrim(p ->> 'telefono');
begin
  if v_nombre is null or char_length(v_nombre) < 2 or char_length(v_nombre) > 120 then return cap.err('nombre_invalido'); end if;
  if v_tel is null or char_length(regexp_replace(v_tel, '\D', '', 'g')) < 7 or char_length(v_tel) > 25 then return cap.err('telefono_invalido'); end if;
  update cap.usuarios set nombre = v_nombre, telefono = v_tel where id = v_id;
  if not found then return cap.err('no_encontrado'); end if;
  update cap.certificados set nombre = v_nombre where usuario_id = v_id;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_admin_questions_bulk(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); v_n int;
begin
  if p ->> 'estado' not in ('aprobada', 'descartada') then return cap.err('estado_invalido'); end if;
  update cap.preguntas set estado = p ->> 'estado', actualizado_at = now()
  where modulo = p ->> 'modulo' and origen = 'generada' and estado = 'borrador';
  get diagnostics v_n = row_count;
  return jsonb_build_object('ok', true, 'actualizadas', v_n);
end $$;

revoke execute on function cap.fn_admin_update_user(jsonb), cap.fn_admin_questions_bulk(jsonb) from public, anon, authenticated;

create or replace function public.cap_rpc(payload jsonb) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare fn text := payload ->> 'fn';
begin
  if coalesce(payload ->> 'secret', '') <> coalesce((select value from private.settings where key = 'cap_secret'), '#') then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  case fn
    when 'public_config' then return cap.fn_public_config(payload);
    when 'register' then return cap.fn_register(payload);
    when 'login' then return cap.fn_login(payload);
    when 'logout' then return cap.fn_logout(payload);
    when 'me' then return cap.fn_me(payload);
    when 'change_password' then return cap.fn_change_password(payload);
    when 'dashboard' then return cap.fn_dashboard(payload);
    when 'module' then return cap.fn_module(payload);
    when 'read' then return cap.fn_read(payload);
    when 'quiz_start' then return cap.fn_quiz_start(payload);
    when 'quiz_submit' then return cap.fn_quiz_submit(payload);
    when 'submit_task' then return cap.fn_submit_task(payload);
    when 'file' then return cap.fn_file(payload);
    when 'image' then return cap.fn_image(payload);
    when 'certificate' then return cap.fn_certificate(payload);
    when 'verify' then return cap.fn_verify(payload);
    when 'admin_overview' then return cap.fn_admin_overview(payload);
    when 'admin_user' then return cap.fn_admin_user(payload);
    when 'admin_update_user' then return cap.fn_admin_update_user(payload);
    when 'admin_set_estado' then return cap.fn_admin_set_estado(payload);
    when 'admin_reset_password' then return cap.fn_admin_reset_password(payload);
    when 'admin_extra_attempt' then return cap.fn_admin_extra_attempt(payload);
    when 'admin_codes' then return cap.fn_admin_codes(payload);
    when 'admin_create_code' then return cap.fn_admin_create_code(payload);
    when 'admin_toggle_code' then return cap.fn_admin_toggle_code(payload);
    when 'admin_set_config' then return cap.fn_admin_set_config(payload);
    when 'admin_tasks' then return cap.fn_admin_tasks(payload);
    when 'admin_review' then return cap.fn_admin_review(payload);
    when 'admin_questions' then return cap.fn_admin_questions(payload);
    when 'admin_question_save' then return cap.fn_admin_question_save(payload);
    when 'admin_questions_bulk' then return cap.fn_admin_questions_bulk(payload);
    when 'admin_clave' then return cap.fn_admin_clave(payload);
    when 'admin_modules' then return cap.fn_admin_modules(payload);
    when 'seed_module' then return cap.fn_seed_module(payload);
    when 'seed_image' then return cap.fn_seed_image(payload);
    when 'seed_question' then return cap.fn_seed_question(payload);
    when 'seed_task' then return cap.fn_seed_task(payload);
    when 'seed_clave' then return cap.fn_seed_clave(payload);
    when 'seed_admin' then return cap.fn_seed_admin(payload);
    else raise exception 'fn_desconocida';
  end case;
end $$;

revoke all on function public.cap_rpc(jsonb) from public;
revoke execute on function public.cap_rpc(jsonb) from authenticated;
grant execute on function public.cap_rpc(jsonb) to anon, service_role;
