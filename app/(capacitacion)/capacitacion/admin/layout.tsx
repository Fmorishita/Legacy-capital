import type { Metadata } from "next";
import { Shell } from "@/components/cap/Shell";
import { AdminTabs } from "@/components/cap/AdminTabs";
import { requireAdmin, withSession } from "@/lib/cap/server";
import type { AdminOverview } from "@/lib/cap/types";

export const metadata: Metadata = { title: "Administración" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const me = await requireAdmin();
  const o = await withSession<AdminOverview>("admin_overview");
  return (
    <Shell me={me} wide>
      <main className="cap-wrap max-w-[90rem] py-8">
        <p className="cap-kicker">Panel de administración</p>
        <h1 className="cap-title mt-1 text-[2.2rem]">Capacitación de asesores</h1>
        <div className="mt-6">
          <AdminTabs
            tareas={o.pendientes_revision}
            borradores={o.borradores}
            pendientes={o.usuarios.filter((u) => u.estado === "pendiente").length}
          />
        </div>
        <div className="pt-8">{children}</div>
      </main>
    </Shell>
  );
}
