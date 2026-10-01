-- Plataforma privada de capacitación de asesores.
-- Todo vive en el esquema `cap`, que PostgREST no expone. Las tablas tienen RLS activado y sin
-- políticas. El único punto de entrada es public.cap_rpc(payload), que exige el secreto del
-- servidor (private.settings.cap_secret) y despacha a funciones internas. Cada función que lee
-- datos de un asesor resuelve primero su sesión, así que nadie puede ver lo de otro.

create extension if not exists pgcrypto with schema extensions;
create schema if not exists cap;
revoke all on schema cap from public, anon, authenticated;

-- ---------------------------------------------------------------- Tablas
create table if not exists cap.config (
  clave text primary key,
  valor jsonb not null
);
insert into cap.config (clave, valor) values
  ('modo_registro', '"ambos"'),
  ('intentos_examen', '3'),
  ('aprobatorio', '80')
on conflict (clave) do nothing;

create table if not exists cap.usuarios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 120),
  correo text not null unique check (correo = lower(correo) and char_length(correo) <= 160),
  telefono text not null check (char_length(telefono) between 7 and 25),
  pass_hash text not null,
  rol text not null default 'asesor' check (rol in ('asesor', 'admin')),
  estado text not null default 'pendiente' check (estado in ('pendiente', 'activo', 'suspendido')),
  debe_cambiar boolean not null default false,
  codigo text,
  intentos_extra int not null default 0,
  creado_at timestamptz not null default now(),
  aprobado_at timestamptz,
  ultimo_acceso timestamptz
);

create table if not exists cap.sesiones (
  hash text primary key,
  usuario_id uuid not null references cap.usuarios on delete cascade,
  creado_at timestamptz not null default now(),
  expira_at timestamptz not null
);
create index if not exists sesiones_usuario_idx on cap.sesiones (usuario_id);

create table if not exists cap.login_intentos (
  id bigserial primary key,
  correo text not null,
  ok boolean not null,
  creado_at timestamptz not null default now()
);
create index if not exists login_intentos_idx on cap.login_intentos (correo, creado_at desc);

create table if not exists cap.codigos (
  codigo text primary key,
  usos_max int not null default 1 check (usos_max between 1 and 500),
  usos int not null default 0,
  expira_at timestamptz,
  activo boolean not null default true,
  nota text,
  creado_at timestamptz not null default now()
);

create table if not exists cap.modulos (
  id text primary key,
  orden int not null unique,
  numero text,
  titulo text not null,
  subtitulo text,
  imagen text,
  tiempo text,
  objetivos jsonb not null default '[]',
  secciones jsonb not null default '[]',
  html text not null default '',
  es_anexo boolean not null default false
);

create table if not exists cap.imagenes (
  nombre text primary key,
  tipo text not null,
  datos bytea not null
);

create table if not exists cap.preguntas (
  id serial primary key,
  modulo text not null references cap.modulos,
  texto text not null,
  opciones jsonb not null,
  correcta text not null check (correcta in ('a', 'b', 'c', 'd')),
  origen text not null check (origen in ('examen', 'generada')),
  estado text not null default 'borrador' check (estado in ('aprobada', 'borrador', 'descartada')),
  n_examen int unique,
  seccion text,
  actualizado_at timestamptz not null default now()
);
create index if not exists preguntas_modulo_idx on cap.preguntas (modulo, estado);

create table if not exists cap.lecturas (
  usuario_id uuid not null references cap.usuarios on delete cascade,
  modulo text not null references cap.modulos,
  seccion text not null,
  leido_at timestamptz not null default now(),
  primary key (usuario_id, modulo, seccion)
);

create table if not exists cap.intentos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references cap.usuarios on delete cascade,
  tipo text not null check (tipo in ('quiz', 'examen')),
  modulo text not null references cap.modulos,
  preguntas int[] not null,
  respuestas jsonb,
  correctas int,
  total int not null,
  porcentaje numeric(5, 2),
  aprobado boolean,
  iniciado_at timestamptz not null default now(),
  enviado_at timestamptz
);
create index if not exists intentos_usuario_idx on cap.intentos (usuario_id, modulo, tipo);

create table if not exists cap.tareas (
  id text primary key,
  modulo text not null references cap.modulos,
  orden int not null,
  titulo text not null,
  instrucciones text not null,
  seccion text
);

create table if not exists cap.archivos (
  id uuid primary key default gen_random_uuid(),
  usuario_id uuid not null references cap.usuarios on delete cascade,
  nombre text not null,
  tipo text not null,
  tamano int not null check (tamano <= 4500000),
  datos bytea not null,
  creado_at timestamptz not null default now()
);

create table if not exists cap.entregas (
  id uuid primary key default gen_random_uuid(),
  tarea_id text not null references cap.tareas,
  usuario_id uuid not null references cap.usuarios on delete cascade,
  texto text check (char_length(texto) <= 20000),
  archivo_id uuid references cap.archivos on delete set null,
  estado text not null default 'en_revision' check (estado in ('en_revision', 'aprobado', 'corregir')),
  comentario text,
  enviado_at timestamptz not null default now(),
  revisado_at timestamptz,
  unique (tarea_id, usuario_id)
);

create table if not exists cap.completados (
  usuario_id uuid not null references cap.usuarios on delete cascade,
  modulo text not null references cap.modulos,
  completado_at timestamptz not null default now(),
  primary key (usuario_id, modulo)
);

create table if not exists cap.certificados (
  folio text primary key,
  usuario_id uuid not null unique references cap.usuarios on delete cascade,
  nombre text not null,
  emitido_at timestamptz not null default now(),
  valido boolean not null default true
);

create table if not exists cap.clave (
  id int primary key default 1 check (id = 1),
  html text not null
);

do $$
declare t text;
begin
  foreach t in array array['config','usuarios','sesiones','login_intentos','codigos','modulos','imagenes','preguntas',
    'lecturas','intentos','tareas','archivos','entregas','completados','certificados','clave'] loop
    execute format('alter table cap.%I enable row level security', t);
    execute format('revoke all on cap.%I from public, anon, authenticated', t);
  end loop;
end $$;

-- ---------------------------------------------------------------- Utilidades
create or replace function cap.err(code text) returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object('error', code)
$$;

create or replace function cap.cfg(k text) returns jsonb language sql stable set search_path = '' as $$
  select valor from cap.config where clave = k
$$;

-- Usuario activo de la sesión (o excepción sin_sesion)
create or replace function cap.usuario(p jsonb) returns cap.usuarios
language plpgsql set search_path = '' as $$
declare u cap.usuarios;
begin
  select usr.* into u
  from cap.sesiones s join cap.usuarios usr on usr.id = s.usuario_id
  where s.hash = p ->> 'sesion' and s.expira_at > now() and usr.estado = 'activo';
  if u.id is null then
    raise exception 'sin_sesion';
  end if;
  return u;
end $$;

create or replace function cap.admin(p jsonb) returns cap.usuarios
language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p);
begin
  if u.rol <> 'admin' then
    raise exception 'prohibido';
  end if;
  return u;
end $$;

create or replace function cap.random_code(n int) returns text language sql volatile set search_path = '' as $$
  select string_agg(substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', 1 + floor(random() * 32)::int, 1), '')
  from generate_series(1, n)
$$;

-- Preguntas que cuentan para el quiz de un módulo (el m12 usa el examen completo)
create or replace function cap.quiz_requerido(mod text) returns boolean language sql stable set search_path = '' as $$
  select case when mod = 'm12' then true
    else exists (select 1 from cap.preguntas where modulo = mod and estado = 'aprobada') end
$$;

-- Marca como completados los módulos que ya cumplen: secciones leídas, quiz aprobado y tareas enviadas
create or replace function cap.recalc(uid uuid) returns void language plpgsql set search_path = '' as $$
declare m record; leidas int; quiz_ok boolean; tareas_ok boolean;
begin
  for m in select * from cap.modulos order by orden loop
    continue when exists (select 1 from cap.completados where usuario_id = uid and modulo = m.id);
    select count(*) into leidas from cap.lecturas where usuario_id = uid and modulo = m.id;
    if m.id = 'm12' then
      quiz_ok := exists (select 1 from cap.intentos where usuario_id = uid and tipo = 'examen' and aprobado);
    elsif m.es_anexo or not cap.quiz_requerido(m.id) then
      quiz_ok := true;
    else
      quiz_ok := exists (select 1 from cap.intentos where usuario_id = uid and modulo = m.id and tipo = 'quiz' and aprobado);
    end if;
    tareas_ok := not exists (
      select 1 from cap.tareas t
      where t.modulo = m.id
        and not exists (select 1 from cap.entregas e where e.tarea_id = t.id and e.usuario_id = uid)
    );
    if leidas >= jsonb_array_length(m.secciones) and quiz_ok and tareas_ok then
      insert into cap.completados (usuario_id, modulo) values (uid, m.id) on conflict do nothing;
    end if;
  end loop;
end $$;

-- Estado de cada módulo para un usuario
create or replace function cap.estados(uid uuid, es_admin boolean default false)
returns table (
  id text, orden int, numero text, titulo text, subtitulo text, imagen text, tiempo text, es_anexo boolean,
  total int, leidas int, estado text, completado_at timestamptz, quiz_requerido boolean, quiz_aprobado boolean,
  tareas_total int, tareas_enviadas int
) language sql stable set search_path = '' as $$
  with base as (
    select m.*,
      jsonb_array_length(m.secciones) as n_total,
      (select count(*)::int from cap.lecturas l where l.usuario_id = uid and l.modulo = m.id) as n_leidas,
      (select c.completado_at from cap.completados c where c.usuario_id = uid and c.modulo = m.id) as comp_at,
      lag(m.id) over (partition by m.es_anexo order by m.orden) as previo
    from cap.modulos m
  )
  select b.id, b.orden, b.numero, b.titulo, b.subtitulo, b.imagen, b.tiempo, b.es_anexo, b.n_total, b.n_leidas,
    case
      when b.comp_at is not null then 'completado'
      when not (b.es_anexo or es_admin or b.previo is null
        or exists (select 1 from cap.completados c where c.usuario_id = uid and c.modulo = b.previo)) then 'bloqueado'
      when b.n_leidas > 0
        or exists (select 1 from cap.intentos i where i.usuario_id = uid and i.modulo = b.id)
        or exists (select 1 from cap.entregas e join cap.tareas t on t.id = e.tarea_id where e.usuario_id = uid and t.modulo = b.id)
        then 'en_curso'
      else 'disponible'
    end,
    b.comp_at,
    (not b.es_anexo) and cap.quiz_requerido(b.id),
    exists (select 1 from cap.intentos i where i.usuario_id = uid and i.modulo = b.id and i.aprobado),
    (select count(*)::int from cap.tareas t where t.modulo = b.id),
    (select count(*)::int from cap.entregas e join cap.tareas t on t.id = e.tarea_id where e.usuario_id = uid and t.modulo = b.id)
  from base b
  order by b.orden
$$;

-- Requisitos del certificado
create or replace function cap.elegibilidad(uid uuid) returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object(
    'modulos_faltantes', (
      select coalesce(jsonb_agg(m.id order by m.orden), '[]')
      from cap.modulos m
      where not m.es_anexo and not exists (select 1 from cap.completados c where c.usuario_id = uid and c.modulo = m.id)
    ),
    'examen_aprobado', exists (select 1 from cap.intentos i where i.usuario_id = uid and i.tipo = 'examen' and i.aprobado),
    'tareas_pendientes', (
      select coalesce(jsonb_agg(jsonb_build_object('id', t.id, 'titulo', t.titulo, 'estado', coalesce(e.estado, 'sin_enviar')) order by t.modulo, t.orden), '[]')
      from cap.tareas t
      left join cap.entregas e on e.tarea_id = t.id and e.usuario_id = uid
      where coalesce(e.estado, '') <> 'aprobado'
    )
  )
$$;

-- ---------------------------------------------------------------- Cuenta y sesión
create or replace function cap.fn_public_config(p jsonb) returns jsonb language sql stable set search_path = '' as $$
  select jsonb_build_object('modo_registro', cap.cfg('modo_registro') #>> '{}')
$$;

create or replace function cap.fn_register(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  v_nombre text := btrim(p ->> 'nombre');
  v_correo text := lower(btrim(p ->> 'correo'));
  v_tel text := btrim(p ->> 'telefono');
  v_pass text := p ->> 'password';
  v_code text := upper(nullif(btrim(p ->> 'codigo'), ''));
  v_modo text := cap.cfg('modo_registro') #>> '{}';
  v_ok boolean := false;
  v_estado text;
begin
  if v_nombre is null or char_length(v_nombre) < 2 or char_length(v_nombre) > 120 then return cap.err('nombre_invalido'); end if;
  if v_correo is null or v_correo !~ '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' or char_length(v_correo) > 160 then return cap.err('correo_invalido'); end if;
  if v_tel is null or char_length(regexp_replace(v_tel, '\D', '', 'g')) < 7 or char_length(v_tel) > 25 then return cap.err('telefono_invalido'); end if;
  if char_length(coalesce(v_pass, '')) < 8 or char_length(v_pass) > 200 then return cap.err('password_corta'); end if;
  if exists (select 1 from cap.usuarios where correo = v_correo) then return cap.err('correo_registrado'); end if;

  if v_modo in ('codigo', 'ambos') and v_code is not null then
    update cap.codigos set usos = usos + 1
    where codigo = v_code and activo and usos < usos_max and (expira_at is null or expira_at > now())
    returning true into v_ok;
    if not coalesce(v_ok, false) then return cap.err('codigo_invalido'); end if;
    v_estado := 'activo';
  elsif v_modo = 'codigo' then
    return cap.err('codigo_requerido');
  else
    v_estado := 'pendiente';
  end if;

  insert into cap.usuarios (nombre, correo, telefono, pass_hash, estado, codigo, aprobado_at)
  values (v_nombre, v_correo, v_tel, extensions.crypt(v_pass, extensions.gen_salt('bf', 10)), v_estado,
    case when v_ok then v_code end, case when v_estado = 'activo' then now() end);
  return jsonb_build_object('estado', v_estado);
end $$;

create or replace function cap.fn_login(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  v_correo text := lower(btrim(p ->> 'correo'));
  v_pass text := coalesce(p ->> 'password', '');
  u cap.usuarios;
begin
  if (select count(*) from cap.login_intentos where correo = v_correo and not ok and creado_at > now() - interval '15 minutes') >= 8 then
    return cap.err('demasiados_intentos');
  end if;
  select * into u from cap.usuarios where correo = v_correo;
  if u.id is null or u.pass_hash <> extensions.crypt(v_pass, u.pass_hash) then
    insert into cap.login_intentos (correo, ok) values (coalesce(v_correo, ''), false);
    return cap.err('credenciales');
  end if;
  if u.estado = 'pendiente' then return cap.err('pendiente'); end if;
  if u.estado = 'suspendido' then return cap.err('suspendido'); end if;
  if char_length(coalesce(p ->> 'sesion', '')) <> 64 then return cap.err('sesion_invalida'); end if;

  delete from cap.sesiones where usuario_id = u.id and expira_at < now();
  insert into cap.sesiones (hash, usuario_id, expira_at) values (p ->> 'sesion', u.id, now() + interval '30 days');
  insert into cap.login_intentos (correo, ok) values (v_correo, true);
  update cap.usuarios set ultimo_acceso = now() where id = u.id;
  return jsonb_build_object('ok', true, 'rol', u.rol, 'debe_cambiar', u.debe_cambiar);
end $$;

create or replace function cap.fn_logout(p jsonb) returns jsonb language sql set search_path = '' as $$
  delete from cap.sesiones where hash = p ->> 'sesion';
  select jsonb_build_object('ok', true);
$$;

create or replace function cap.fn_me(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p);
begin
  update cap.usuarios set ultimo_acceso = now() where id = u.id and (ultimo_acceso is null or ultimo_acceso < now() - interval '5 minutes');
  return jsonb_build_object('id', u.id, 'nombre', u.nombre, 'correo', u.correo, 'rol', u.rol, 'debe_cambiar', u.debe_cambiar);
end $$;

create or replace function cap.fn_change_password(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p); v_new text := coalesce(p ->> 'nueva', '');
begin
  if u.pass_hash <> extensions.crypt(coalesce(p ->> 'actual', ''), u.pass_hash) then return cap.err('credenciales'); end if;
  if char_length(v_new) < 8 or char_length(v_new) > 200 then return cap.err('password_corta'); end if;
  update cap.usuarios set pass_hash = extensions.crypt(v_new, extensions.gen_salt('bf', 10)), debe_cambiar = false where id = u.id;
  delete from cap.sesiones where usuario_id = u.id and hash <> p ->> 'sesion';
  return jsonb_build_object('ok', true);
end $$;

-- ---------------------------------------------------------------- Contenido y avance
create or replace function cap.fn_dashboard(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p); v_mods jsonb;
begin
  perform cap.recalc(u.id);
  select jsonb_agg(to_jsonb(e) order by e.orden) into v_mods from cap.estados(u.id, false) e;
  return jsonb_build_object(
    'modulos', v_mods,
    'completados', (select count(*) from cap.completados c join cap.modulos m on m.id = c.modulo where c.usuario_id = u.id and not m.es_anexo),
    'total', (select count(*) from cap.modulos where not es_anexo),
    'certificado', (select folio from cap.certificados where usuario_id = u.id and valido)
  );
end $$;

create or replace function cap.fn_module(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  u cap.usuarios := cap.usuario(p);
  m cap.modulos;
  est record;
  v_max int;
  v_usados int;
  v_ultimo jsonb;
begin
  select * into m from cap.modulos where id = p ->> 'modulo';
  if m.id is null then return cap.err('no_encontrado'); end if;
  select * into est from cap.estados(u.id, u.rol = 'admin') e where e.id = m.id;
  if est.estado = 'bloqueado' then return cap.err('bloqueado'); end if;

  v_max := (cap.cfg('intentos_examen') #>> '{}')::int + u.intentos_extra;
  select count(*) into v_usados from cap.intentos where usuario_id = u.id and tipo = 'examen' and enviado_at is not null;
  select jsonb_build_object('porcentaje', i.porcentaje, 'aprobado', i.aprobado, 'fecha', i.enviado_at) into v_ultimo
  from cap.intentos i where i.usuario_id = u.id and i.modulo = m.id and i.enviado_at is not null
  order by i.aprobado desc, i.porcentaje desc limit 1;

  return jsonb_build_object(
    'id', m.id, 'numero', m.numero, 'titulo', m.titulo, 'subtitulo', m.subtitulo, 'imagen', m.imagen, 'tiempo', m.tiempo,
    'objetivos', m.objetivos, 'secciones', m.secciones, 'html', m.html, 'es_anexo', m.es_anexo,
    'estado', est.estado,
    'leidas', (select coalesce(jsonb_agg(l.seccion), '[]') from cap.lecturas l where l.usuario_id = u.id and l.modulo = m.id),
    'quiz', jsonb_build_object(
      'requerido', est.quiz_requerido,
      'aprobado', est.quiz_aprobado,
      'preguntas', case when m.id = 'm12' then (select count(*) from cap.preguntas where origen = 'examen')
                   else (select count(*) from cap.preguntas where modulo = m.id and estado = 'aprobada') end,
      'mejor', v_ultimo,
      'intentos_usados', case when m.id = 'm12' then v_usados end,
      'intentos_max', case when m.id = 'm12' then v_max end
    ),
    'tareas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', t.id, 'titulo', t.titulo, 'instrucciones', t.instrucciones, 'seccion', t.seccion,
        'entrega', case when e.id is null then null else jsonb_build_object(
          'texto', e.texto, 'estado', e.estado, 'comentario', e.comentario, 'enviado_at', e.enviado_at,
          'revisado_at', e.revisado_at, 'archivo', case when a.id is null then null else jsonb_build_object('id', a.id, 'nombre', a.nombre, 'tamano', a.tamano) end
        ) end
      ) order by t.orden), '[]')
      from cap.tareas t
      left join cap.entregas e on e.tarea_id = t.id and e.usuario_id = u.id
      left join cap.archivos a on a.id = e.archivo_id
      where t.modulo = m.id
    )
  );
end $$;

create or replace function cap.fn_read(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p); m cap.modulos; est record;
begin
  select * into m from cap.modulos where id = p ->> 'modulo';
  if m.id is null then return cap.err('no_encontrado'); end if;
  select * into est from cap.estados(u.id, u.rol = 'admin') e where e.id = m.id;
  if est.estado = 'bloqueado' then return cap.err('bloqueado'); end if;
  if not exists (select 1 from jsonb_array_elements(m.secciones) s where s ->> 'id' = p ->> 'seccion') then
    return cap.err('seccion_invalida');
  end if;
  insert into cap.lecturas (usuario_id, modulo, seccion) values (u.id, m.id, p ->> 'seccion') on conflict do nothing;
  perform cap.recalc(u.id);
  return jsonb_build_object('ok', true,
    'completado', exists (select 1 from cap.completados where usuario_id = u.id and modulo = m.id));
end $$;

create or replace function cap.fn_quiz_start(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  u cap.usuarios := cap.usuario(p);
  m cap.modulos;
  est record;
  v_tipo text;
  v_ids int[];
  v_id uuid;
  v_max int;
  v_usados int;
begin
  select * into m from cap.modulos where id = p ->> 'modulo';
  if m.id is null or m.es_anexo then return cap.err('no_encontrado'); end if;
  select * into est from cap.estados(u.id, u.rol = 'admin') e where e.id = m.id;
  if est.estado = 'bloqueado' then return cap.err('bloqueado'); end if;

  if m.id = 'm12' then
    v_tipo := 'examen';
    if exists (select 1 from cap.intentos where usuario_id = u.id and tipo = 'examen' and aprobado) then return cap.err('ya_aprobado'); end if;
    v_max := (cap.cfg('intentos_examen') #>> '{}')::int + u.intentos_extra;
    select count(*) into v_usados from cap.intentos where usuario_id = u.id and tipo = 'examen' and enviado_at is not null;
    if v_usados >= v_max then return cap.err('sin_intentos'); end if;
    -- Reanuda un intento abierto en las últimas 3 horas (mismas preguntas, mismo orden)
    select id, preguntas into v_id, v_ids from cap.intentos
    where usuario_id = u.id and tipo = 'examen' and enviado_at is null and iniciado_at > now() - interval '3 hours'
    order by iniciado_at desc limit 1;
    if v_id is null then
      select array_agg(id order by random()) into v_ids from cap.preguntas where origen = 'examen';
    end if;
  else
    v_tipo := 'quiz';
    if est.leidas < est.total then return cap.err('faltan_secciones'); end if;
    select array_agg(id order by random()) into v_ids from cap.preguntas where modulo = m.id and estado = 'aprobada';
  end if;
  if v_ids is null or cardinality(v_ids) = 0 then return cap.err('sin_preguntas'); end if;

  if v_id is null then
    insert into cap.intentos (usuario_id, tipo, modulo, preguntas, total)
    values (u.id, v_tipo, m.id, v_ids, cardinality(v_ids)) returning id into v_id;
  end if;

  return jsonb_build_object(
    'intento', v_id, 'tipo', v_tipo,
    'preguntas', (
      select jsonb_agg(jsonb_build_object('id', q.id, 'texto', q.texto, 'opciones', q.opciones) order by x.ord)
      from unnest(v_ids) with ordinality as x(qid, ord) join cap.preguntas q on q.id = x.qid
    )
  );
end $$;

create or replace function cap.fn_quiz_submit(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  u cap.usuarios := cap.usuario(p);
  i cap.intentos;
  v_resp jsonb := coalesce(p -> 'respuestas', '{}');
  v_ok int;
  v_pct numeric;
  v_aprobado boolean;
  v_max int;
  v_usados int;
begin
  select * into i from cap.intentos where id = (p ->> 'intento')::uuid and usuario_id = u.id;
  if i.id is null then return cap.err('no_encontrado'); end if;
  if i.enviado_at is not null then return cap.err('ya_enviado'); end if;
  if i.iniciado_at < now() - interval '6 hours' then return cap.err('expirado'); end if;

  select count(*) into v_ok
  from unnest(i.preguntas) as qid join cap.preguntas q on q.id = qid
  where v_resp ->> qid::text = q.correcta;
  v_pct := round(100.0 * v_ok / i.total, 2);
  v_aprobado := v_pct >= (cap.cfg('aprobatorio') #>> '{}')::numeric;

  update cap.intentos set respuestas = v_resp, correctas = v_ok, porcentaje = v_pct, aprobado = v_aprobado, enviado_at = now()
  where id = i.id;
  perform cap.recalc(u.id);

  v_max := (cap.cfg('intentos_examen') #>> '{}')::int + u.intentos_extra;
  select count(*) into v_usados from cap.intentos where usuario_id = u.id and tipo = 'examen' and enviado_at is not null;

  -- La respuesta correcta solo se revela al aprobar; en los quizzes de módulo nunca se revelan
  -- las preguntas que también forman parte del examen final.
  return jsonb_build_object(
    'correctas', v_ok, 'total', i.total, 'porcentaje', v_pct, 'aprobado', v_aprobado, 'tipo', i.tipo,
    'intentos_restantes', case when i.tipo = 'examen' then greatest(v_max - v_usados, 0) end,
    'falladas', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', q.id, 'texto', q.texto, 'opciones', q.opciones, 'tu_respuesta', v_resp ->> q.id::text,
        'correcta', case when v_aprobado and (i.tipo = 'examen' or q.origen = 'generada') then q.correcta end
      ) order by x.ord), '[]')
      from unnest(i.preguntas) with ordinality as x(qid, ord) join cap.preguntas q on q.id = x.qid
      where coalesce(v_resp ->> q.id::text, '') <> q.correcta
    )
  );
end $$;

create or replace function cap.fn_submit_task(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare
  u cap.usuarios := cap.usuario(p);
  t cap.tareas;
  est record;
  e cap.entregas;
  v_texto text := nullif(btrim(coalesce(p ->> 'texto', '')), '');
  v_arch jsonb := p -> 'archivo';
  v_archivo uuid;
  v_datos bytea;
begin
  select * into t from cap.tareas where id = p ->> 'tarea';
  if t.id is null then return cap.err('no_encontrado'); end if;
  select * into est from cap.estados(u.id, u.rol = 'admin') x where x.id = t.modulo;
  if est.estado = 'bloqueado' then return cap.err('bloqueado'); end if;
  if v_texto is not null and char_length(v_texto) > 20000 then return cap.err('texto_largo'); end if;

  select * into e from cap.entregas where tarea_id = t.id and usuario_id = u.id;
  if e.estado = 'aprobado' then return cap.err('ya_aprobada'); end if;

  if v_arch is not null and jsonb_typeof(v_arch) = 'object' then
    if coalesce(v_arch ->> 'tipo', '') not in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain',
      'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') then
      return cap.err('tipo_archivo');
    end if;
    v_datos := decode(v_arch ->> 'base64', 'base64');
    if octet_length(v_datos) > 4500000 then return cap.err('archivo_grande'); end if;
    insert into cap.archivos (usuario_id, nombre, tipo, tamano, datos)
    values (u.id, left(coalesce(v_arch ->> 'nombre', 'archivo'), 160), v_arch ->> 'tipo', octet_length(v_datos), v_datos)
    returning id into v_archivo;
  end if;

  if v_texto is null and v_archivo is null and (e.id is null or (e.texto is null and e.archivo_id is null)) then
    return cap.err('vacia');
  end if;

  insert into cap.entregas (tarea_id, usuario_id, texto, archivo_id, estado, comentario, enviado_at, revisado_at)
  values (t.id, u.id, v_texto, v_archivo, 'en_revision', null, now(), null)
  on conflict (tarea_id, usuario_id) do update set
    texto = coalesce(excluded.texto, cap.entregas.texto),
    archivo_id = coalesce(excluded.archivo_id, cap.entregas.archivo_id),
    estado = 'en_revision', enviado_at = now(), revisado_at = null;
  perform cap.recalc(u.id);
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_file(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p); a cap.archivos;
begin
  select * into a from cap.archivos where id = (p ->> 'archivo')::uuid;
  if a.id is null or (a.usuario_id <> u.id and u.rol <> 'admin') then return cap.err('no_encontrado'); end if;
  return jsonb_build_object('nombre', a.nombre, 'tipo', a.tipo, 'base64', encode(a.datos, 'base64'));
end $$;

create or replace function cap.fn_image(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p); img cap.imagenes;
begin
  select * into img from cap.imagenes where nombre = p ->> 'nombre';
  if img.nombre is null then return cap.err('no_encontrado'); end if;
  return jsonb_build_object('tipo', img.tipo, 'base64', encode(img.datos, 'base64'));
end $$;

-- ---------------------------------------------------------------- Certificado
create or replace function cap.fn_certificate(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare u cap.usuarios := cap.usuario(p); v_el jsonb; c cap.certificados; v_folio text;
begin
  perform cap.recalc(u.id);
  select * into c from cap.certificados where usuario_id = u.id and valido;
  if c.folio is null then
    v_el := cap.elegibilidad(u.id);
    if jsonb_array_length(v_el -> 'modulos_faltantes') > 0 or not (v_el ->> 'examen_aprobado')::boolean
       or jsonb_array_length(v_el -> 'tareas_pendientes') > 0 then
      return jsonb_build_object('elegible', false, 'requisitos', v_el);
    end if;
    loop
      v_folio := 'LC-' || to_char(now(), 'YYYY') || '-' || cap.random_code(6);
      exit when not exists (select 1 from cap.certificados where folio = v_folio);
    end loop;
    insert into cap.certificados (folio, usuario_id, nombre) values (v_folio, u.id, u.nombre) returning * into c;
  end if;
  return jsonb_build_object('elegible', true, 'folio', c.folio, 'nombre', c.nombre, 'emitido_at', c.emitido_at);
end $$;

create or replace function cap.fn_verify(p jsonb) returns jsonb language sql stable set search_path = '' as $$
  select coalesce(
    (select jsonb_build_object('folio', folio, 'nombre', nombre, 'emitido_at', emitido_at, 'valido', valido)
     from cap.certificados where folio = upper(btrim(p ->> 'folio'))),
    cap.err('no_encontrado'))
$$;

-- ---------------------------------------------------------------- Administración
create or replace function cap.fn_admin_overview(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  return jsonb_build_object(
    'config', jsonb_build_object('modo_registro', cap.cfg('modo_registro') #>> '{}', 'intentos_examen', (cap.cfg('intentos_examen') #>> '{}')::int),
    'total_modulos', (select count(*) from cap.modulos where not es_anexo),
    'pendientes_revision', (select count(*) from cap.entregas where estado = 'en_revision'),
    'borradores', (select count(*) from cap.preguntas where estado = 'borrador'),
    'usuarios', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'id', x.id, 'nombre', x.nombre, 'correo', x.correo, 'telefono', x.telefono, 'rol', x.rol, 'estado', x.estado,
        'creado_at', x.creado_at, 'ultimo_acceso', x.ultimo_acceso, 'codigo', x.codigo, 'intentos_extra', x.intentos_extra,
        'completados', (select count(*) from cap.completados c join cap.modulos m on m.id = c.modulo where c.usuario_id = x.id and not m.es_anexo),
        'quizzes_aprobados', (select count(distinct modulo) from cap.intentos i where i.usuario_id = x.id and i.tipo = 'quiz' and i.aprobado),
        'examen_intentos', (select count(*) from cap.intentos i where i.usuario_id = x.id and i.tipo = 'examen' and i.enviado_at is not null),
        'examen_mejor', (select max(porcentaje) from cap.intentos i where i.usuario_id = x.id and i.tipo = 'examen'),
        'examen_aprobado', exists (select 1 from cap.intentos i where i.usuario_id = x.id and i.tipo = 'examen' and i.aprobado),
        'tareas_revision', (select count(*) from cap.entregas e where e.usuario_id = x.id and e.estado = 'en_revision'),
        'tareas_aprobadas', (select count(*) from cap.entregas e where e.usuario_id = x.id and e.estado = 'aprobado'),
        'certificado', (select folio from cap.certificados c where c.usuario_id = x.id and c.valido)
      ) order by (x.estado = 'pendiente') desc, x.creado_at desc), '[]')
      from cap.usuarios x
    )
  );
end $$;

create or replace function cap.fn_admin_user(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); x cap.usuarios;
begin
  select * into x from cap.usuarios where id = (p ->> 'usuario')::uuid;
  if x.id is null then return cap.err('no_encontrado'); end if;
  perform cap.recalc(x.id);
  return jsonb_build_object(
    'usuario', jsonb_build_object('id', x.id, 'nombre', x.nombre, 'correo', x.correo, 'telefono', x.telefono, 'rol', x.rol,
      'estado', x.estado, 'creado_at', x.creado_at, 'ultimo_acceso', x.ultimo_acceso, 'intentos_extra', x.intentos_extra),
    'modulos', (select jsonb_agg(to_jsonb(e) order by e.orden) from cap.estados(x.id, false) e),
    'intentos', (
      select coalesce(jsonb_agg(jsonb_build_object('modulo', i.modulo, 'tipo', i.tipo, 'porcentaje', i.porcentaje,
        'correctas', i.correctas, 'total', i.total, 'aprobado', i.aprobado, 'fecha', i.enviado_at) order by i.enviado_at desc), '[]')
      from cap.intentos i where i.usuario_id = x.id and i.enviado_at is not null
    ),
    'elegibilidad', cap.elegibilidad(x.id),
    'certificado', (select folio from cap.certificados c where c.usuario_id = x.id and c.valido)
  );
end $$;

create or replace function cap.fn_admin_set_estado(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); v_estado text := p ->> 'estado';
begin
  if v_estado not in ('activo', 'pendiente', 'suspendido') then return cap.err('estado_invalido'); end if;
  if (p ->> 'usuario')::uuid = a.id then return cap.err('no_a_ti_mismo'); end if;
  update cap.usuarios set estado = v_estado, aprobado_at = case when v_estado = 'activo' then coalesce(aprobado_at, now()) else aprobado_at end
  where id = (p ->> 'usuario')::uuid;
  if v_estado <> 'activo' then delete from cap.sesiones where usuario_id = (p ->> 'usuario')::uuid; end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_admin_reset_password(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); v_pass text := cap.random_code(4) || '-' || cap.random_code(4) || '-' || cap.random_code(4);
begin
  update cap.usuarios set pass_hash = extensions.crypt(v_pass, extensions.gen_salt('bf', 10)), debe_cambiar = true
  where id = (p ->> 'usuario')::uuid;
  if not found then return cap.err('no_encontrado'); end if;
  delete from cap.sesiones where usuario_id = (p ->> 'usuario')::uuid;
  return jsonb_build_object('ok', true, 'temporal', v_pass);
end $$;

create or replace function cap.fn_admin_extra_attempt(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  update cap.usuarios set intentos_extra = intentos_extra + 1 where id = (p ->> 'usuario')::uuid;
  return jsonb_build_object('ok', found);
end $$;

create or replace function cap.fn_admin_codes(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  return (select coalesce(jsonb_agg(to_jsonb(c) order by c.creado_at desc), '[]') from cap.codigos c);
end $$;

create or replace function cap.fn_admin_create_code(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); v_code text; v_dias int := nullif(p ->> 'dias', '')::int;
begin
  loop
    v_code := cap.random_code(4) || '-' || cap.random_code(4);
    exit when not exists (select 1 from cap.codigos where codigo = v_code);
  end loop;
  insert into cap.codigos (codigo, usos_max, expira_at, nota)
  values (v_code, greatest(1, least(coalesce(nullif(p ->> 'usos', '')::int, 1), 500)),
    case when v_dias is not null and v_dias > 0 then now() + make_interval(days => v_dias) end,
    left(nullif(btrim(p ->> 'nota'), ''), 120));
  return jsonb_build_object('ok', true, 'codigo', v_code);
end $$;

create or replace function cap.fn_admin_toggle_code(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  update cap.codigos set activo = coalesce((p ->> 'activo')::boolean, false) where codigo = p ->> 'codigo';
  return jsonb_build_object('ok', found);
end $$;

create or replace function cap.fn_admin_set_config(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  if p ? 'modo_registro' then
    if p ->> 'modo_registro' not in ('codigo', 'aprobacion', 'ambos') then return cap.err('valor_invalido'); end if;
    update cap.config set valor = to_jsonb(p ->> 'modo_registro') where clave = 'modo_registro';
  end if;
  if p ? 'intentos_examen' then
    if (p ->> 'intentos_examen')::int not between 1 and 20 then return cap.err('valor_invalido'); end if;
    update cap.config set valor = to_jsonb((p ->> 'intentos_examen')::int) where clave = 'intentos_examen';
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_admin_tasks(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); v_estado text := nullif(p ->> 'estado', '');
begin
  return (
    select coalesce(jsonb_agg(jsonb_build_object(
      'id', e.id, 'estado', e.estado, 'texto', e.texto, 'comentario', e.comentario, 'enviado_at', e.enviado_at, 'revisado_at', e.revisado_at,
      'tarea', jsonb_build_object('id', t.id, 'titulo', t.titulo, 'modulo', t.modulo),
      'usuario', jsonb_build_object('id', x.id, 'nombre', x.nombre, 'correo', x.correo),
      'archivo', case when f.id is null then null else jsonb_build_object('id', f.id, 'nombre', f.nombre, 'tamano', f.tamano) end
    ) order by (e.estado = 'en_revision') desc, e.enviado_at desc), '[]')
    from cap.entregas e
    join cap.tareas t on t.id = e.tarea_id
    join cap.usuarios x on x.id = e.usuario_id
    left join cap.archivos f on f.id = e.archivo_id
    where v_estado is null or e.estado = v_estado
  );
end $$;

create or replace function cap.fn_admin_review(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  if p ->> 'estado' not in ('aprobado', 'corregir') then return cap.err('estado_invalido'); end if;
  update cap.entregas set estado = p ->> 'estado', comentario = left(nullif(btrim(p ->> 'comentario'), ''), 4000), revisado_at = now()
  where id = (p ->> 'entrega')::uuid;
  return jsonb_build_object('ok', found);
end $$;

create or replace function cap.fn_admin_questions(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  return (
    select coalesce(jsonb_agg(to_jsonb(q) order by m.orden, (q.origen = 'generada'), q.n_examen, q.id), '[]')
    from cap.preguntas q join cap.modulos m on m.id = q.modulo
    where nullif(p ->> 'modulo', '') is null or q.modulo = p ->> 'modulo'
  );
end $$;

create or replace function cap.fn_admin_question_save(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p); v_op jsonb := p -> 'opciones';
begin
  if coalesce(btrim(p ->> 'texto'), '') = '' then return cap.err('texto_vacio'); end if;
  if p ->> 'correcta' not in ('a', 'b', 'c', 'd') then return cap.err('correcta_invalida'); end if;
  if jsonb_typeof(v_op) <> 'object' or coalesce(btrim(v_op ->> 'a'), '') = '' or coalesce(btrim(v_op ->> 'b'), '') = ''
     or coalesce(btrim(v_op ->> 'c'), '') = '' or coalesce(btrim(v_op ->> 'd'), '') = '' then
    return cap.err('opciones_invalidas');
  end if;
  if p ->> 'estado' not in ('aprobada', 'borrador', 'descartada') then return cap.err('estado_invalido'); end if;
  update cap.preguntas set texto = btrim(p ->> 'texto'),
    opciones = jsonb_build_object('a', btrim(v_op ->> 'a'), 'b', btrim(v_op ->> 'b'), 'c', btrim(v_op ->> 'c'), 'd', btrim(v_op ->> 'd')),
    correcta = p ->> 'correcta',
    estado = case when origen = 'examen' then 'aprobada' else p ->> 'estado' end,
    actualizado_at = now()
  where id = (p ->> 'id')::int;
  return jsonb_build_object('ok', found);
end $$;

create or replace function cap.fn_admin_clave(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  return jsonb_build_object('html', (select html from cap.clave where id = 1));
end $$;

create or replace function cap.fn_admin_modules(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare a cap.usuarios := cap.admin(p);
begin
  return (select jsonb_agg(jsonb_build_object('id', id, 'numero', numero, 'titulo', titulo) order by orden) from cap.modulos);
end $$;

-- ---------------------------------------------------------------- Carga de contenido (solo desde el script de carga)
create or replace function cap.fn_seed_module(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
begin
  insert into cap.modulos (id, orden, numero, titulo, subtitulo, imagen, tiempo, objetivos, secciones, html, es_anexo)
  values (p ->> 'id', (p ->> 'orden')::int, p ->> 'numero', p ->> 'titulo', p ->> 'subtitulo', p ->> 'imagen', p ->> 'tiempo',
    coalesce(p -> 'objetivos', '[]'), coalesce(p -> 'secciones', '[]'), coalesce(p ->> 'html', ''), coalesce((p ->> 'es_anexo')::boolean, false))
  on conflict (id) do update set orden = excluded.orden, numero = excluded.numero, titulo = excluded.titulo,
    subtitulo = excluded.subtitulo, imagen = excluded.imagen, tiempo = excluded.tiempo, objetivos = excluded.objetivos,
    secciones = excluded.secciones, html = excluded.html, es_anexo = excluded.es_anexo;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_seed_image(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
begin
  insert into cap.imagenes (nombre, tipo, datos) values (p ->> 'nombre', p ->> 'tipo', decode(p ->> 'base64', 'base64'))
  on conflict (nombre) do update set tipo = excluded.tipo, datos = excluded.datos;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_seed_question(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
begin
  if (p ->> 'origen') = 'examen' then
    insert into cap.preguntas (modulo, texto, opciones, correcta, origen, estado, n_examen)
    values (p ->> 'modulo', p ->> 'texto', p -> 'opciones', p ->> 'correcta', 'examen', 'aprobada', (p ->> 'n')::int)
    on conflict (n_examen) do update set modulo = excluded.modulo, texto = excluded.texto, opciones = excluded.opciones,
      correcta = excluded.correcta, actualizado_at = now();
  elsif not exists (select 1 from cap.preguntas where modulo = p ->> 'modulo' and texto = p ->> 'texto') then
    insert into cap.preguntas (modulo, texto, opciones, correcta, origen, estado, seccion)
    values (p ->> 'modulo', p ->> 'texto', p -> 'opciones', p ->> 'correcta', 'generada', 'borrador', p ->> 'seccion');
  end if;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_seed_task(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
begin
  insert into cap.tareas (id, modulo, orden, titulo, instrucciones, seccion)
  values (p ->> 'id', p ->> 'modulo', (p ->> 'orden')::int, p ->> 'titulo', p ->> 'instrucciones', p ->> 'seccion')
  on conflict (id) do update set modulo = excluded.modulo, orden = excluded.orden, titulo = excluded.titulo,
    instrucciones = excluded.instrucciones, seccion = excluded.seccion;
  return jsonb_build_object('ok', true);
end $$;

create or replace function cap.fn_seed_clave(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
begin
  insert into cap.clave (id, html) values (1, p ->> 'html') on conflict (id) do update set html = excluded.html;
  return jsonb_build_object('ok', true);
end $$;

-- Crea la cuenta de administrador si no existe y devuelve una contraseña temporal
create or replace function cap.fn_seed_admin(p jsonb) returns jsonb language plpgsql set search_path = '' as $$
declare v_correo text := lower(btrim(p ->> 'correo')); v_pass text;
begin
  if exists (select 1 from cap.usuarios where correo = v_correo) then
    update cap.usuarios set rol = 'admin', estado = 'activo' where correo = v_correo;
    return jsonb_build_object('ok', true, 'existente', true);
  end if;
  v_pass := cap.random_code(4) || '-' || cap.random_code(4) || '-' || cap.random_code(4);
  insert into cap.usuarios (nombre, correo, telefono, pass_hash, rol, estado, debe_cambiar, aprobado_at)
  values (p ->> 'nombre', v_correo, p ->> 'telefono', extensions.crypt(v_pass, extensions.gen_salt('bf', 10)), 'admin', 'activo', true, now());
  return jsonb_build_object('ok', true, 'temporal', v_pass);
end $$;

-- ---------------------------------------------------------------- Punto de entrada
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

revoke execute on all functions in schema cap from public, anon, authenticated;
revoke all on function public.cap_rpc(jsonb) from public;
revoke execute on function public.cap_rpc(jsonb) from authenticated;
grant execute on function public.cap_rpc(jsonb) to anon, service_role;
comment on function public.cap_rpc(jsonb) is 'Capacitación: expuesta a anon a propósito; exige private.settings.cap_secret, que solo conoce el servidor del sitio.';

-- Nota: el valor de private.settings.cap_secret se inserta fuera de esta migración y debe
-- coincidir con CAP_RPC_SECRET en Vercel.
