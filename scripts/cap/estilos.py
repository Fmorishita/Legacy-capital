#!/usr/bin/env python3
"""Adapta manual-styles.css (hecho para imprimir) a pantalla.

- Quita @page, @font-face y reglas de impresión (break-*, orphans, widows, page:).
- Aísla todo bajo .manual para que no afecte al resto de la app.
- Convierte pt a una unidad de pantalla (--pt) que se ajusta en celular.
- Usa las tipografías cargadas con next/font (EB Garamond y Montserrat).

Uso: python3 scripts/cap/estilos.py <manual-styles.css> app/(capacitacion)/manual.css
"""

import re
import sys

PRINT_PROPS = (
    "break-after", "break-before", "break-inside", "page-break-after", "page-break-before",
    "page-break-inside", "orphans", "widows", "page", "-webkit-print-color-adjust", "print-color-adjust",
)
SKIP_SELECTORS = (".cover", ".modcover", ".backcover", ".toc", ".front", ".strip", ".letter", ".notes")


def strip_blocks(css: str, at: str) -> str:
    """Elimina bloques @at{...} con llaves anidadas."""
    out, i = [], 0
    while True:
        j = css.find(at, i)
        if j < 0:
            out.append(css[i:])
            return "".join(out)
        out.append(css[i:j])
        k = css.index("{", j)
        depth = 0
        for n in range(k, len(css)):
            if css[n] == "{":
                depth += 1
            elif css[n] == "}":
                depth -= 1
                if depth == 0:
                    i = n + 1
                    break


def clean_decls(body: str) -> str:
    decls = [d.strip() for d in body.split(";")]
    keep = [d for d in decls if d and d.split(":", 1)[0].strip() not in PRINT_PROPS]
    out = "; ".join(keep)
    return re.sub(r"(-?\d*\.?\d+)pt\b", lambda m: f"calc({m.group(1)} * var(--pt))", out)


def scope(sel: str) -> str:
    parts = []
    for s in sel.split(","):
        s = s.strip()
        if s in (":root", "body"):
            parts.append(".manual")
        else:
            parts.append(f".manual {s}")
    return ", ".join(parts)


def main():
    css = open(sys.argv[1], encoding="utf-8").read()
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    css = re.sub(r"@font-face\s*\{[^}]*\}", "", css)
    css = strip_blocks(css, "@page")

    rules = []
    for m in re.finditer(r"([^{}]+)\{([^{}]*)\}", css):
        sel, body = m.group(1).strip(), m.group(2)
        if not sel or sel == "html" or any(x in sel for x in SKIP_SELECTORS):
            continue
        body = clean_decls(body)
        if not body:
            continue
        rules.append(f"{scope(sel)} {{ {body}; }}")

    head = """/* Generado por scripts/cap/estilos.py a partir de manual-styles.css. No editar a mano. */
.manual { --pt: 1.72px; }
@media (max-width: 640px) {
  .manual { --pt: 1.62px; }
}
"""
    out = head + "\n".join(rules)
    # Las tipografías del original se sustituyen por las que carga next/font
    out += """
.manual {
  --serif: var(--font-ebg), "EB Garamond", Georgia, serif;
  --sans: var(--font-mont), "Montserrat", "Helvetica Neue", Arial, sans-serif;
}"""
    out += RESPONSIVE
    open(sys.argv[2], "w", encoding="utf-8").write(out)
    print(f"{len(rules)} reglas -> {sys.argv[2]}")


RESPONSIVE = """

/* ---- Pantalla y celular ---- */
.manual { overflow-wrap: anywhere; }
.manual h2 { scroll-margin-top: 96px; }
.manual img { height: auto; }
.manual .table-wrap { overflow-x: auto; margin: calc(6 * var(--pt)) 0 calc(12 * var(--pt)); -webkit-overflow-scrolling: touch; }
.manual .table-wrap table { margin: 0; min-width: 520px; }
.manual .flow { grid-auto-flow: row; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); }
@media (max-width: 640px) {
  .manual .cols, .manual .stats, .manual .fig-row, .manual .wa { flex-direction: column; }
  .manual .cards > .card, .manual .cards.c3 > .card { flex: 1 1 100%; }
  .manual .flow, .manual .flow.c3, .manual .flow.c4, .manual .flow.c5 { grid-template-columns: 1fr; }
  .manual .flow .step::after { display: none; }
  .manual .wa-meta { flex: none; }
  .manual .q .opts { grid-template-columns: 1fr; }
  .manual .legend-grid { grid-template-columns: 1fr; }
  .manual .key-grid { grid-template-columns: repeat(2, 1fr); }
  .manual figure.half, .manual figure.w60, .manual figure.w70, .manual figure.w85 { width: 100%; }
  .manual .persona-h { flex-direction: column; align-items: flex-start; gap: 6px; }
  .manual .persona-h .pq { max-width: none; text-align: left; }
  .manual .g-line { flex-direction: column; gap: 2px; }
  .manual .g-n { margin-left: 0; }
  .manual .tl-when { width: 64px; flex-basis: 64px; }
  .manual .tl-item:not(:last-child)::before { left: 81px; }
  .manual .obj-h { flex-direction: column; gap: 2px; }
}
"""

if __name__ == "__main__":
    main()
