import Link from "next/link";
import { DownloadSimple, Users, HourglassMedium, NotePencil, Question, Certificate } from "@phosphor-icons/react/dist/ssr";
import { ApproveButtons, UsersTable } from "@/components/cap/AdminClient";
import { requireAdmin, withSession } from "@/lib/cap/server";
import type { AdminOverview } from "@/lib/cap/types";

export default async function AdminPage() {
  await requireAdmin();
  const o = await withSession<AdminOverview>("admin_overview");
  const asesores = o.usuarios.filter((u) => u.rol === "asesor");
  const pendientes = o.usuarios.filter((u) => u.estado === "pendiente");
  const stats = [
    { label: "Asesores activos", value: asesores.filter((u) => u.estado === "activo").length, Icon: Users },
    { label: "Registros por aprobar", value: pendientes.length, Icon: HourglassMedium },
    { label: "Tareas en revisión", value: o.pendientes_revision, Icon: NotePencil, href: "/capacitacion/admin/tareas" },
    { label: "Preguntas en borrador", value: o.borradores, Icon: Question, href: "/capacitacion/admin/preguntas" },
    { label: "Certificados emitidos", value: o.usuarios.filter((u) => u.certificado).length, Icon: Certificate },
  ];

  return (
    <div className="grid gap-10">
      <section className="grid grid-cols-2 gap-3 md:grid-cols-5">
        {stats.map((s) => {
          const body = (
            <>
              <s.Icon className="size-5 text-gold-dk" aria-hidden />
              <p className="mt-3 font-serif text-3xl leading-none text-navy">{s.value}</p>
              <p className="mt-1.5 text-xs text-muted">{s.label}</p>
            </>
          );
          return s.href ? (
            <Link key={s.label} href={s.href} className="cap-card p-4 transition hover:border-gold">
              {body}
            </Link>
          ) : (
            <div key={s.label} className="cap-card p-4">
              {body}
            </div>
          );
        })}
      </section>

      {pendientes.length > 0 && (
        <section>
          <h2 className="cap-title text-2xl">Registros por aprobar</h2>
          <ul className="mt-4 grid gap-3">
            {pendientes.map((u) => (
              <li key={u.id} className="cap-card flex flex-wrap items-center justify-between gap-3 border-gold p-4">
                <div>
                  <Link href={`/capacitacion/admin/asesor/${u.id}`} className="font-semibold text-navy hover:underline">
                    {u.nombre}
                  </Link>
                  <p className="text-xs text-muted">
                    {u.correo} · {u.telefono}
                  </p>
                </div>
                <ApproveButtons id={u.id} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 className="cap-title text-2xl">Asesores</h2>
          <a href="/capacitacion/admin/csv" className="cap-btn cap-btn-ghost cap-btn-sm">
            <DownloadSimple className="size-4" aria-hidden /> Exportar CSV
          </a>
        </div>
        <div className="mt-4">
          <UsersTable users={o.usuarios} totalModulos={o.total_modulos} />
        </div>
      </section>
    </div>
  );
}
