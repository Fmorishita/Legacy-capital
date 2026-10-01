import "server-only";
import type { Seccion, Tarea } from "@/lib/cap/types";

// Divide el HTML de un módulo en secciones (una por <h2>) e intercala los formularios de tareas
// donde el manual tenía el recuadro del ejercicio o del caso práctico.

export type Part =
  | { kind: "html"; html: string }
  | { kind: "task"; id: string }
  | { kind: "answers"; task: string; html: string }
  | { kind: "exam" };

export type SectionParts = Seccion & { parts: Part[] };

const MARK = "\u0000";

function divEnd(s: string, start: number) {
  const re = /<div\b[^>]*>|<\/div>/g;
  re.lastIndex = start;
  let depth = 0;
  for (let m = re.exec(s); m; m = re.exec(s)) {
    depth += m[0].startsWith("<div") ? 1 : -1;
    if (depth === 0) return m.index + m[0].length;
  }
  return s.length;
}

/** Reemplaza cada recuadro cuyo título coincide con `label` por lo que devuelva `fn`. */
function replaceBoxes(html: string, label: RegExp, fn: (inner: string, n: number) => string) {
  const re = new RegExp(`<div class="box box-[a-z]+"><div class="box-label">(?:${label.source})</div>`, "g");
  let out = "";
  let last = 0;
  let n = 0;
  for (let m = re.exec(html); m; m = re.exec(html)) {
    const end = divEnd(html, m.index);
    out += html.slice(last, m.index) + fn(html.slice(m.index, end), n++);
    last = end;
    re.lastIndex = end;
  }
  return out + html.slice(last);
}

export function splitModule(moduleId: string, html: string, secciones: Seccion[], tareas: Tarea[]) {
  const ids = new Set(tareas.map((t) => t.id));
  let lastTask = "";

  // Tablas desplazables en celular
  let h = html.replace(/<table\b/g, '<div class="table-wrap"><table').replace(/<\/table>/g, "</table></div>");

  // Ejercicios escritos → formulario de entrega; sus respuestas solo se muestran después de enviar
  let ejercicios = 0;
  h = replaceBoxes(h, /Ejercicio|Respuestas/, (box) => {
    if (box.includes('box-label">Respuestas<')) return `${MARK}answers:${lastTask}:${Buffer.from(box).toString("base64")}${MARK}`;
    const id = `${moduleId}-ejercicio${++ejercicios}`;
    if (!ids.has(id)) return box;
    lastTask = id;
    return `${MARK}task:${id}${MARK}`;
  });

  if (moduleId === "m12") {
    h = replaceBoxes(h, /Caso [^<]*/, (box, n) => (ids.has(`m12-caso${n + 1}`) ? `${MARK}task:m12-caso${n + 1}${MARK}` : box));
    h = replaceBoxes(h, /Examen en línea/, (box) => `${box}${MARK}exam${MARK}`);
  }

  const toParts = (chunk: string): Part[] =>
    chunk.split(MARK).flatMap((piece, i): Part[] => {
      if (i % 2 === 0) return piece.trim() ? [{ kind: "html", html: piece }] : [];
      if (piece === "exam") return [{ kind: "exam" }];
      if (piece.startsWith("task:")) return [{ kind: "task", id: piece.slice(5) }];
      const [, task, b64] = piece.split(":");
      return [{ kind: "answers", task, html: Buffer.from(b64, "base64").toString("utf8") }];
    });

  // Cortes por <h2 id="...">
  const cuts = [...h.matchAll(/<h2 id="([^"]+)"/g)].map((m) => ({ id: m[1], at: m.index ?? 0 }));
  const intro = toParts(cuts.length ? h.slice(0, cuts[0].at) : h);
  const byId = new Map(secciones.map((s) => [s.id, s]));
  const sections: SectionParts[] = cuts.map((c, i) => {
    const s = byId.get(c.id) ?? { id: c.id, num: "", titulo: "" };
    return { ...s, parts: toParts(h.slice(c.at, cuts[i + 1]?.at ?? h.length)) };
  });

  // Tareas sin recuadro en el manual (Módulo 13): al final de su sección
  const placed = new Set(sections.flatMap((s) => s.parts.filter((p) => p.kind === "task").map((p) => (p as { id: string }).id)));
  for (const t of tareas) {
    if (placed.has(t.id)) continue;
    const target = sections.find((s) => s.id === t.seccion) ?? sections[sections.length - 1];
    target?.parts.push({ kind: "task", id: t.id });
  }

  return { intro, sections, hasExamSlot: h.includes(`${MARK}exam${MARK}`) };
}
