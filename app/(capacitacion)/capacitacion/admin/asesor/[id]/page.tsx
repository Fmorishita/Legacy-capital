import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, WhatsappLogo, FileText } from "@phosphor-icons/react/dist/ssr";
import { EditUserForm, EstadoChip, ReviewForm, UserActions } from "@/components/cap/AdminClient";
import { StateChip, TaskChip, fecha, fechaHora, moduleLabel } from "@/components/cap/ui";
import { CapError, requireAdmin, withSession } from "@/lib/cap/server";
import type { AdminUserDetail, EntregaAdmin } from "@/lib/cap/types";

export default async function AsesorPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireAdmin();
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/.test(id)) notFound();
  let d: AdminUserDetail;
  try {
    d = await withSession<AdminUserDetail>("admin_user", { usuario: id });
  } catch (e) {
    if (e instanceof CapError && e.code === "no_encontrado") notFound();
    throw e;
  }
  const entregas = (await withSession<EntregaAdmin[]>("admin_tasks")).filter((e) => e.usuario.id === id);
  const u = d.usuario;
  const wa = u.telefono.replace(/\D/g, "");
  const cursos = d.modulos.filter((m) => !m.es_anexo);
  const hechos = cursos.filter((m) => m.estado === "completado").length;

  return (
    <div className="grid gap-8">
      <Link href="/capacitacion/admin" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-navy">
        <ArrowLeft className="size-4" aria-hidden /> Todos los asesores
      </Link>

      <section className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="cap-card p-6">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="cap-title text-3xl">{u.nombre}</h2>
            <EstadoChip estado={u.estado} />
          </div>
          <p className="mt-2 text-sm text-ink">
            {u.correo} ·{" "}
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-navy hover:underline">
              <WhatsappLogo className="size-4" aria-hidden /> {u.telefono}
            </a>
          </p>
          <p className="mt-1 text-xs text-muted">
            Registro: {fecha(u.creado_at)} · Último acceso: {fechaHora(u.ultimo_acceso)} · Intentos extra de examen: {u.intentos_extra}
          </p>
          <div className="mt-6">
            <UserActions id={u.id} estado={u.estado} nombre={u.nombre} telefono={u.telefono} esYo={u.id === me.id} />
          </div>
        </div>
        <div className="cap-card p-6">
          <p className="cap-kicker">Certificado</p>
          {d.certificado ? (
            <p className="mt-2 text-sm">
              Emitido · folio{" "}
              <Link href={`/certificados/${d.certificado}`} className="font-semibold tracking-wider text-gold-dk hover:underline">
                {d.certificado}
              </Link>
            </p>
          ) : (
            <ul className="mt-3 grid gap-1.5 text-sm text-ink">
              <li>
                Módulos: {hechos}/{cursos.length}
              </li>
              <li>Examen final: {d.elegibilidad.examen_aprobado ? "aprobado" : "pendiente"}</li>
              <li>Tareas sin aprobar: {d.elegibilidad.tareas_pendientes.length}</li>
            </ul>
          )}
          <div className="mt-6 border-t border-line pt-5">
            <EditUserForm id={u.id} nombre={u.nombre} telefono={u.telefono} />
          </div>
        </div>
      </section>

      <section>
        <h3 className="cap-title text-2xl">Avance por módulo</h3>
        <div className="cap-card mt-4 overflow-x-auto">
          <table className="cap-table min-w-[640px]">
            <thead>
              <tr>
                <th>Módulo</th>
                <th>Estado</th>
                <th>Secciones</th>
                <th>Quiz / examen</th>
                <th>Tareas</th>
              </tr>
            </thead>
            <tbody>
              {d.modulos.map((m) => (
                <tr key={m.id}>
                  <td>
                    <span className="text-xs text-muted">{moduleLabel(m.numero, m.es_anexo)}</span>
                    <p className="font-medium text-navy">{m.titulo}</p>
                  </td>
                  <td>
                    <StateChip estado={m.estado} />
                  </td>
                  <td>
                    {m.leidas}/{m.total}
                  </td>
                  <td>{m.quiz_requerido ? (m.quiz_aprobado ? <span className="text-ok">Aprobado</span> : "Pendiente") : "—"}</td>
                  <td>{m.tareas_total ? `${m.tareas_enviadas}/${m.tareas_total} enviadas` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 className="cap-title text-2xl">Intentos de quiz y examen</h3>
        {d.intentos.length ? (
          <div className="cap-card mt-4 overflow-x-auto">
            <table className="cap-table min-w-[560px]">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Tipo</th>
                  <th>Módulo</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {d.intentos.map((i, n) => (
                  <tr key={n}>
                    <td>{fechaHora(i.fecha)}</td>
                    <td className="capitalize">{i.tipo === "examen" ? "Examen final" : "Quiz"}</td>
                    <td>{i.modulo}</td>
                    <td className={i.aprobado ? "font-semibold text-ok" : "text-bad"}>
                      {Math.round(i.porcentaje)}% ({i.correctas}/{i.total}) · {i.aprobado ? "aprobado" : "no aprobado"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">Todavía no presenta ningún quiz.</p>
        )}
      </section>

      <section>
        <h3 className="cap-title text-2xl">Tareas entregadas</h3>
        {entregas.length ? (
          <div className="mt-4 grid gap-4">
            {entregas.map((e) => (
              <article key={e.id} className="cap-card grid gap-4 p-5 lg:grid-cols-[1.3fr_1fr]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-navy">{e.tarea.titulo}</p>
                    <TaskChip estado={e.estado} />
                  </div>
                  <p className="mt-1 text-xs text-muted">Enviada {fechaHora(e.enviado_at)}</p>
                  {e.texto && <p className="mt-3 max-h-72 overflow-y-auto rounded-xl bg-white p-3 text-sm whitespace-pre-line">{e.texto}</p>}
                  {e.archivo && (
                    <a href={`/capacitacion/archivo/${e.archivo.id}`} target="_blank" rel="noopener" className="mt-3 inline-flex items-center gap-2 text-sm text-navy hover:underline">
                      <FileText className="size-4" aria-hidden /> {e.archivo.nombre}
                    </a>
                  )}
                </div>
                <ReviewForm entrega={e.id} comentario={e.comentario} estado={e.estado} />
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">Sin entregas todavía.</p>
        )}
      </section>
    </div>
  );
}
