"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminTabs({ tareas, borradores, pendientes }: { tareas: number; borradores: number; pendientes: number }) {
  const path = usePathname();
  const tabs = [
    { href: "/capacitacion/admin", label: "Asesores", badge: pendientes },
    { href: "/capacitacion/admin/tareas", label: "Tareas", badge: tareas },
    { href: "/capacitacion/admin/preguntas", label: "Preguntas", badge: borradores },
    { href: "/capacitacion/admin/registro", label: "Registro y códigos" },
    { href: "/capacitacion/admin/clave", label: "Clave de respuestas" },
  ];
  return (
    <nav aria-label="Administración" className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <ul className="flex min-w-max gap-1 border-b border-line">
        {tabs.map((t) => {
          const on = t.href === "/capacitacion/admin" ? path === t.href || path.startsWith("/capacitacion/admin/asesor") : path.startsWith(t.href);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={`relative inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition ${
                  on ? "text-navy after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:bg-gold" : "text-muted hover:text-navy"
                }`}
              >
                {t.label}
                {!!t.badge && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[0.65rem] font-bold text-navy">{t.badge}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
