import { NextResponse, type NextRequest } from "next/server";
import { CapError, withSession } from "@/lib/cap/server";
import type { AdminOverview } from "@/lib/cap/types";

const cell = (v: unknown) => {
  const s = v == null ? "" : String(v);
  // Evita que Excel interprete fórmulas
  const safe = /^[=+\-@\t\r]/.test(s) && !/^\+?[\d\s()-]+$/.test(s) ? `'${s}` : s;
  return /[",\n;]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};
const fecha = (iso: string | null) => (iso ? new Date(iso).toISOString().slice(0, 16).replace("T", " ") : "");

export async function GET(req: NextRequest) {
  let o: AdminOverview;
  try {
    o = await withSession<AdminOverview>("admin_overview");
  } catch (e) {
    if (e instanceof CapError && (e.code === "sin_sesion" || e.code === "prohibido"))
      return NextResponse.redirect(new URL("/capacitacion/entrar", req.url));
    throw e;
  }
  const head = [
    "Nombre", "Correo", "Teléfono", "Rol", "Estado", "Registro", "Último acceso", "Código", "Módulos completados",
    "Total módulos", "Quizzes aprobados", "Intentos examen", "Mejor examen (%)", "Examen aprobado", "Tareas en revisión",
    "Tareas aprobadas", "Folio certificado",
  ];
  const rows = o.usuarios.map((u) => [
    u.nombre, u.correo, u.telefono, u.rol, u.estado, fecha(u.creado_at), fecha(u.ultimo_acceso), u.codigo, u.completados,
    o.total_modulos, u.quizzes_aprobados, u.examen_intentos, u.examen_mejor ?? "", u.examen_aprobado ? "Sí" : "No",
    u.tareas_revision, u.tareas_aprobadas, u.certificado ?? "",
  ]);
  const csv = "﻿" + [head, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const hoy = new Date().toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="asesores-capacitacion-${hoy}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
