-- Perfiles por ciudad: se agregan Tijuana y Mexicali (se conservan los anteriores).
alter table public.leads drop constraint if exists leads_perfil_check;
alter table public.leads add constraint leads_perfil_check
  check (perfil is null or perfil in ('tijuana', 'mexicali', 'california', 'cdmx', 'monterrey', 'guadalajara', 'ensenada', 'mexicoamericano'));
