import Link from "next/link";
import { FileText, Key } from "@phosphor-icons/react/dist/ssr";
import { ReviewForm } from "@/components/cap/AdminClient";
import { TaskChip, fechaHora } from "@/components/cap/ui";
import { requireAdmin, withSession } from "@/lib/cap/server";
import type { EntregaAdmin } from "@/lib/cap/types";

const FILTROS = [
  { v: "en_revision", t: "En revisión" },
  { v: "corregir", t: "Por corregir" },
  { v: "aprobado", t: "Aprobadas" },
  { v: "", t: "Todas" },
];

export default async function TareasAdminPage({ searchParams }: { searchParams: Promise<{ estado?: string }> }) {
  await requireAdmin();
  const { estado = "en_revision" } = await searchParams;
  const f = FILTROS.some((x) => x.v === estado) ? estado : "en_revision";
  const entregas = await withSession<EntregaAdmin[]>("admin_tasks", { estado: f });

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {FILTROS.map((x) => (
          <Link
            key={x.v}
            href={`/capacitacion/admin/tareas?estado=${x.v}`}
            className={`cap-chip !px-3.5 !py-1.5 text-xs ${f === x.v ? "bg-navy text-cream" : "bg-white text-navy ring-1 ring-line hover:ring-gold"}`}
          >
            {x.t}
          </Link>
        ))}
      </div>

      {entregas.length ? (
        <div className="mt-6 grid gap-4">
          {entregas.map((e) => (
            <article key={e.id} className="cap-card grid gap-5 p-5 lg:grid-cols-[1.35fr_1fr]">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-navy">{e.tarea.titulo}</p>
                  <TaskChip estado={e.estado} />
                </div>
                <p className="mt-1 text-xs text-muted">
                  <Link href={`/capacitacion/admin/asesor/${e.usuario.id}`} className="font-semibold text-navy hover:underline">
                    {e.usuario.nombre}
                  </Link>{" "}
                  · Módulo {Number(e.tarea.modulo.slice(1))} · enviada {fechaHora(e.enviado_at)}
                  {e.revisado_at && ` · revisada ${fechaHora(e.revisado_at)}`}
                </p>
                {e.texto && <p className="mt-3 max-h-80 overflow-y-auto rounded-xl bg-white p-3.5 text-sm leading-relaxed whitespace-pre-line">{e.texto}</p>}
                {e.archivo && (
                  <a
                    href={`/capacitacion/archivo/${e.archivo.id}`}
                    target="_blank"
                    rel="noopener"
                    className="mt-3 inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-navy hover:border-gold"
                  >
                    <FileText className="size-4" aria-hidden /> {e.archivo.nombre}
                  </a>
                )}
                {e.tarea.modulo === "m12" && (
                  <Link href="/capacitacion/admin/clave" className="mt-3 flex items-center gap-1.5 text-xs text-gold-dk hover:underline">
                    <Key className="size-3.5" aria-hidden /> Ver respuestas esperadas de los casos
                  </Link>
                )}
              </div>
              <ReviewForm entrega={e.id} comentario={e.comentario} estado={e.estado} />
            </article>
          ))}
        </div>
      ) : (
        <p className="cap-card mt-6 p-10 text-center text-sm text-muted">No hay tareas en esta lista.</p>
      )}
    </div>
  );
}
