#!/usr/bin/env python3
"""Prepara el contenido de la capacitación para cargarlo en Supabase.

El contenido NO vive en el repositorio (es público): se descomprime en una carpeta local y este
script genera un paquete JSON que después carga `scripts/cap/cargar.mjs`.

Uso:
  python3 scripts/cap/preparar.py <carpeta_capacitacion> <salida.json> [preguntas_borrador.json]

<carpeta_capacitacion> es la carpeta `capacitacion/` del zip (modulos.json, modulos/, img/,
examen_final_CONFIDENCIAL.json, fuente_markdown/).
"""

import html as htmllib
import json
import re
import sys
from pathlib import Path

import markdown  # pip install markdown
from PIL import Image  # pip install pillow


def find_div_end(s: str, start: int) -> int:
    """Índice justo después del </div> que cierra el <div ...> que empieza en `start`."""
    depth = 0
    for m in re.finditer(r"<div\b[^>]*>|</div>", s[start:]):
        depth += 1 if m.group(0).startswith("<div") else -1
        if depth == 0:
            return start + m.end()
    raise ValueError("div sin cerrar")


def section_of(s: str, pos: int) -> str | None:
    last = None
    for m in re.finditer(r'<h2 id="([^"]+)"', s):
        if m.start() > pos:
            break
        last = m.group(1)
    return last


def box(s: str, label_re: str):
    """Recuadros .box cuyo título coincide con label_re: (titulo, html_interior, seccion)."""
    out = []
    for m in re.finditer(r'<div class="box box-[a-z]+"><div class="box-label">(' + label_re + r")</div>", s):
        end = find_div_end(s, m.start())
        inner = s[m.end(): end - len("</div>")]
        out.append((htmllib.unescape(m.group(1)), inner.strip(), section_of(s, m.start())))
    return out


def main():
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    drafts = Path(sys.argv[3]) if len(sys.argv) > 3 else None

    index = json.loads((src / "modulos.json").read_text(encoding="utf-8"))
    modules, tasks = [], []

    for i, mod in enumerate(index):
        mid = mod["id"]
        html = (src / "modulos" / f"{mid}.html").read_text(encoding="utf-8")

        if mid == "m12":
            # El examen se presenta en línea: se quita el bloque estático y sus instrucciones de papel
            q = html.find('<div class="quiz">')
            if q >= 0:
                end = find_div_end(html, q)
                html = html[:q] + (
                    '<div class="box box-recuerda"><div class="box-label">Examen en línea</div>'
                    "<p>Presentas el examen de 40 preguntas en esta plataforma, al final del módulo. "
                    "Las preguntas aparecen en orden aleatorio y la calificación es inmediata.</p></div>"
                ) + html[end:]
            html = re.sub(r"<p>Instrucciones: encierra en un círculo[^<]*</p>\s*", "", html)

        heads = re.findall(r'<h2 id="([^"]+)"[^>]*><span class="sn">([^<]*)</span>(.*?)</h2>', html)
        secciones = [
            {"id": hid, "num": num, "titulo": htmllib.unescape(re.sub(r"<[^>]+>", "", t)).strip()}
            for hid, num, t in heads
        ]
        if len(secciones) != len(mod.get("secciones", [])):
            print(f"aviso: {mid} tiene {len(secciones)} secciones en HTML y {len(mod.get('secciones', []))} en el índice")

        modules.append({
            "id": mid,
            "orden": 100 if mid == "anexos" else i,
            "numero": mod.get("numero"),
            "titulo": mod["titulo"],
            "subtitulo": mod.get("subtitulo"),
            "imagen": mod.get("imagen"),
            "tiempo": mod.get("tiempo"),
            "objetivos": mod.get("objetivos", []),
            "secciones": secciones,
            "html": html,
            "es_anexo": mid == "anexos",
        })

        # Tareas abiertas: ejercicios escritos y casos prácticos del Módulo 12
        for n, (label, inner, sec) in enumerate(box(html, r"Ejercicio")):
            tasks.append({
                "id": f"{mid}-ejercicio{n + 1}", "modulo": mid, "orden": n + 1,
                "titulo": f"Ejercicio del módulo {mod.get('numero')}",
                "instrucciones": re.sub(r'<div class="box box-respuestas">.*', "", inner, flags=re.S),
                "seccion": sec,
            })
        if mid == "m12":
            for n, (label, inner, sec) in enumerate(box(html, r"Caso [^<]*")):
                tasks.append({"id": f"m12-caso{n + 1}", "modulo": mid, "orden": n + 1,
                              "titulo": label, "instrucciones": inner, "seccion": sec})

    # Tareas del Módulo 13: lista de 100 y tablero semanal
    tasks += [
        {
            "id": "m13-lista100", "modulo": "m13", "orden": 1, "titulo": "Tu lista de 100",
            "instrucciones": (
                "<p>Arma tu lista de 100 contactos como se explica en la sección 13.5 y clasifica a cada uno como "
                "<strong>A</strong> (podría comprar), <strong>B</strong> (conoce a quien podría comprar) o "
                "<strong>C</strong> (contacto general).</p><p>Súbela como foto o archivo de la hoja, o escríbela aquí "
                "(nombre, relación y letra por renglón). Si ya la tienes en el CRM, sube una captura.</p>"
            ),
            "seccion": "m13-s5",
        },
        {
            "id": "m13-tablero", "modulo": "m13", "orden": 2, "titulo": "Tu tablero semanal",
            "instrucciones": (
                "<p>Llena el tablero semanal de tu primera semana con tus 5 mínimos diarios y tus metas "
                "(secciones 13.4 y 13.12).</p><p>Súbelo como foto o archivo, o escribe aquí tus números de cada día "
                "y lo que ajustarás la próxima semana.</p>"
            ),
            "seccion": "m13-s4",
        },
    ]

    exam = json.loads((src / "examen_final_CONFIDENCIAL.json").read_text(encoding="utf-8"))
    questions = [
        {"origen": "examen", "n": q["n"], "modulo": q["modulo"], "texto": q["pregunta"],
         "opciones": q["opciones"], "correcta": q["correcta"]}
        for q in exam["preguntas"]
    ]
    if drafts and drafts.exists():
        for q in json.loads(drafts.read_text(encoding="utf-8")):
            questions.append({"origen": "generada", "modulo": q["modulo"], "texto": q["pregunta"],
                              "opciones": q["opciones"], "correcta": q["correcta"], "seccion": q.get("seccion")})

    # Clave confidencial (solo panel de administrador)
    md = (src / "fuente_markdown" / "clave_CONFIDENCIAL.md").read_text(encoding="utf-8")
    md = re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S)
    key = "".join(
        f'<div><b>{q["n"]}.</b>{q["correcta"]}</div>' for q in exam["preguntas"]
    )

    def directive(m):
        kind, title, body = m.group(1), (m.group(2) or "").strip(), m.group(3)
        label = {"ejemplo": title or "Ejemplo", "recuerda": title or "Recuerda"}.get(kind, title or kind)
        return (f'<div class="box box-{kind}"><div class="box-label">{htmllib.escape(label)}</div>'
                f"{markdown.markdown(body)}</div>")

    md = md.replace(":::answerkey", f'<div class="key-grid">{key}</div>')
    md = re.sub(r"^:::(\w+)[ \t]*(.*)\n(.*?)\n:::\s*$", directive, md, flags=re.S | re.M)
    clave = markdown.markdown(md)

    # Miniaturas para las tarjetas del tablero (th-<imagen>), se cargan junto con las demás imágenes
    for mod in index:
        if not mod.get("imagen"):
            continue
        im = Image.open(src / "img" / mod["imagen"]).convert("RGB")
        im.thumbnail((720, 720))
        im.save(src / "img" / f"th-{mod['imagen']}", "JPEG", quality=74, optimize=True, progressive=True)

    dest.write_text(json.dumps({"modules": modules, "tasks": tasks, "questions": questions, "clave": clave},
                               ensure_ascii=False), encoding="utf-8")
    print(f"{len(modules)} módulos, {len(tasks)} tareas, {len(questions)} preguntas -> {dest}")


if __name__ == "__main__":
    main()
