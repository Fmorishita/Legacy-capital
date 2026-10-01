import { CodeToggle, ConfigForm, CreateCodeForm } from "@/components/cap/AdminClient";
import { fecha } from "@/components/cap/ui";
import { requireAdmin, withSession } from "@/lib/cap/server";
import type { AdminOverview, Codigo } from "@/lib/cap/types";

export default async function RegistroAdminPage() {
  await requireAdmin();
  const [o, codes] = await Promise.all([withSession<AdminOverview>("admin_overview"), withSession<Codigo[]>("admin_codes")]);
  const now = Date.now();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
      <section className="cap-card h-fit p-6">
        <h2 className="cap-title text-2xl">Configuración</h2>
        <div className="mt-5">
          <ConfigForm config={o.config} />
        </div>
      </section>

      <section className="grid h-fit gap-6">
        <div className="cap-card p-6">
          <h2 className="cap-title text-2xl">Códigos de invitación</h2>
          <p className="mt-1 text-sm text-muted">Con un código vigente, el asesor entra en cuanto se registra.</p>
          <div className="mt-5">
            <CreateCodeForm />
          </div>
        </div>
        <div className="cap-card overflow-x-auto">
          <table className="cap-table min-w-[560px]">
            <thead>
              <tr>
                <th>Código</th>
                <th>Usos</th>
                <th>Vence</th>
                <th>Nota</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => {
                const vencido = c.expira_at && new Date(c.expira_at).getTime() < now;
                const agotado = c.usos >= c.usos_max;
                return (
                  <tr key={c.codigo} className={!c.activo || vencido || agotado ? "opacity-60" : ""}>
                    <td className="font-mono tracking-wider text-navy">{c.codigo}</td>
                    <td>
                      {c.usos}/{c.usos_max}
                    </td>
                    <td className="text-xs">{c.expira_at ? `${fecha(c.expira_at)}${vencido ? " (vencido)" : ""}` : "Sin límite"}</td>
                    <td className="text-xs">{c.nota ?? "—"}</td>
                    <td className="text-right">{!agotado && !vencido && <CodeToggle codigo={c.codigo} activo={c.activo} />}</td>
                  </tr>
                );
              })}
              {!codes.length && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted">
                    Aún no hay códigos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
