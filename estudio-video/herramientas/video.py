#!/usr/bin/env python3
"""Sistema de edición por ficha para videos HyperFrames.

Un video se describe en `video.json` (escenas, textos, imágenes, voz, música,
SFX) más archivos pequeños por escena (`escenas/<id>.html` y `escenas/<id>.js`).
Esta herramienta genera todo lo demás, así que un cambio toca solo el campo o
el archivo de la escena afectada y solo se vuelve a renderizar ese tramo.

Uso (desde estudio-video/):
  python3 herramientas/video.py construir <dir>          index.html completo
  python3 herramientas/video.py ficha <dir>              FICHA.md + ficha.json
  python3 herramientas/video.py segmentos <dir>          qué tramos cambiaron
  python3 herramientas/video.py render <dir> [--calidad draft|high] [--nota "..."]
                                                          renderiza solo lo cambiado y arma la versión
  python3 herramientas/video.py audio <dir>              solo la mezcla de audio
  python3 herramientas/video.py proxy <dir> [archivo]    copia ligera para el revisor
  python3 herramientas/video.py versiones <dir>          historial de renders
  python3 herramientas/video.py sala <dir>               documento de la ficha para la Sala de Revisión

Convenciones de escena:
  tipo "foto"    fondo con imagen (Ken Burns), sombra, titular opcional
  tipo "grafico" fondo crema del sistema de infografías (+ pie de marca si "pie": true)
  tipo "libre"   solo el contenedor; el estilo lo pone el CSS de su id
  "js": código con tiempos RELATIVOS al inicio de la escena. Variables:
        S (línea de tiempo de la escena), D (duración), up(sel,t,opts), pop(sel,t,opts)
"""
import hashlib
import html as htmllib
import json
import math
import os
import re
import shutil
import subprocess
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser

HF = "hyperframes@0.8.139"
GSAP = "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"
EPS = 1e-6


# ---------------------------------------------------------------- carga

def cargar(d):
    d = os.path.abspath(d)
    with open(os.path.join(d, "video.json"), encoding="utf-8") as f:
        v = json.load(f)
    v["_dir"] = d
    fps = v["lienzo"]["fps"]
    v["_frames"] = round(v["duracion"] * fps)
    for e in v["escenas"]:
        e["f0"] = frame_de(e["inicio"], fps)
        e["f1"] = frame_de(e["fin"], fps)
        for k in ("html", "js"):
            if e.get(k):
                e["_" + k] = leer(d, e[k])
    if v.get("palabras"):
        with open(os.path.join(d, v["palabras"]), encoding="utf-8") as f:
            v["_palabras"] = json.load(f)
    else:
        v["_palabras"] = []
    v["_css"] = leer(d, v["css"]) if v.get("css") else ""
    validar(v)
    return v


def leer(d, rel):
    with open(os.path.join(d, rel), encoding="utf-8") as f:
        return f.read()


def frame_de(t, fps):
    """Primer frame cuyo instante es >= t (los cortes caen en la rejilla de frames)."""
    return math.ceil(t * fps - EPS)


def validar(v):
    ids = set()
    prev = None
    for e in sorted(v["escenas"], key=lambda e: e["inicio"]):
        if e["id"] in ids:
            sys.exit(f"Escena repetida: {e['id']}")
        ids.add(e["id"])
        if e["fin"] <= e["inicio"]:
            sys.exit(f"{e['id']}: fin <= inicio")
        if prev and e["inicio"] < prev["fin"] - EPS:
            sys.exit(f"{e['id']} empieza antes de que termine {prev['id']}")
        prev = e


def r3(x):
    return round(x + 0.0, 3)


def t4(x):
    """Tiempo truncado a 0.1 ms: un clip nunca empieza después ni termina después de su frame."""
    return math.floor(x * 10000 + 1e-6) / 10000


# ---------------------------------------------------------------- subtítulos

def grupos_subtitulos(v):
    """Agrupa palabras en bloques (misma regla del build original del Doctor V6)."""
    cfg = v.get("subtitulos", {})
    maxp = cfg.get("max_palabras", 3)
    maxc = cfg.get("max_caracteres", 20)
    margen = cfg.get("margen_salida", 0.6)
    tramos = []
    for e in v["escenas"]:
        s = e.get("subtitulos")
        if s:
            tramos.append((e["inicio"], s.get("hasta", e["fin"]), s["y"], e["id"]))
    grupos = []
    for a, b, y, sid in sorted(tramos):
        cur = []
        for w in v["_palabras"]:
            if not (a - 0.06 <= w[1] < b - 0.06):
                continue
            if cur and (len(cur) >= maxp or len(" ".join(x[0] for x in cur)) + len(w[0]) > maxc
                        or cur[-1][0][-1] in ",.:;?"):
                grupos.append((cur, y, b, sid))
                cur = []
            cur.append(w)
        if cur:
            grupos.append((cur, y, b, sid))
    out = [{"top": y, "end": min(b, g[-1][2] + margen), "escena": sid, "w": [list(x) for x in g]}
           for g, y, b, sid in grupos]
    # fin efectivo: el bloque se apaga cuando empieza el siguiente
    for i, g in enumerate(out):
        g["st"] = max(0, g["w"][0][1] - 0.05)
        nx = out[i + 1] if i + 1 < len(out) else None
        g["fin"] = min(g["end"], nx["w"][0][1] - 0.05) if nx else g["end"]
    return out


# ---------------------------------------------------------------- construcción

def escena_html(v, e, off):
    sid = e["id"]
    a = t4(e["f0"] / v["lienzo"]["fps"] - off)
    dur = t4((e["f1"] - e["f0"]) / v["lienzo"]["fps"])
    tipo = e.get("tipo", "foto")
    cls = {"foto": "clip bg", "grafico": "clip gfx", "libre": "clip"}[tipo]
    p = [f'<div id="{sid}" class="{cls}" data-start="{a}" data-duration="{dur}" data-track-index="0">']
    if tipo == "foto":
        st = f'object-position:{e.get("encuadre", "50% 50%")}'
        if e.get("filtro"):
            st = f'filter:{e["filtro"]}'
        p.append(f'<div class="kb" data-layout-allow-overflow><img src="{e["imagen"]}" style="{st}" alt="" /></div>')
        if e.get("sombra", True):
            p.append('<div class="shade"></div>')
    if e.get("pie"):
        p.append('<div class="gfoot"><img src="assets/crest.png" alt="" /><div>LEGACY CAPITAL</div></div>')
    hl = e.get("titular")
    if hl:
        sm = f'<div class="sm">{hl["sm"]}</div>' if hl.get("sm") else ""
        p.append(f'<div class="hl" id="{sid}-hl"><div class="l1">{hl["l1"]}</div><div class="l2">{hl["l2"]}</div><div class="rule"></div>{sm}</div>')
    if e.get("_html"):
        p.append(e["_html"].strip())
    p.append("</div>")
    return "".join(p)


def escena_js(v, e):
    """JS de una escena en tiempo ABSOLUTO del video (la ventana se aplica aparte)."""
    sid = e["id"]
    fps = v["lienzo"]["fps"]
    a = r3(e["f0"] / fps)
    d = r3((e["f1"] - e["f0"]) / fps)
    out = []
    mov = e.get("movimiento", "empuje")
    if mov == "empuje":
        out.append(f'tl.fromTo("#{sid} .kb",{{scale:1.04}},{{scale:{r3(1.04 + 0.022 * d)},duration:{d},ease:"none"}},{a});')
    elif mov == "paneo":
        out.append(f'tl.fromTo("#{sid} .kb",{{scale:1.1,xPercent:-2}},{{scale:1.1,xPercent:2,duration:{d},ease:"none"}},{a});')
    hl = e.get("titular")
    if hl:
        out.append(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,x:-40}},{{opacity:1,x:0,duration:0.25,ease:"power3.out"}},{r3(a + 0.08)});'
                   f'tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-40}},{{opacity:1,x:0,duration:0.25,ease:"power3.out"}},{r3(a + 0.2)});'
                   f'tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.3,ease:"power2.out"}},{r3(a + 0.3)});')
        if hl.get("sm"):
            out.append(f'tl.fromTo("#{sid}-hl .sm",{{opacity:0}},{{opacity:1,duration:0.3}},{r3(a + 0.45)});')
    if e.get("_js"):
        out.append(f'{{const S=gsap.timeline(),D={d},up=mkUp(S),pop=mkPop(S);\n{e["_js"].strip()}\ntl.add(S,{a});}}')
    return "\n".join(out)


def segmentos(v):
    """Tramos renderizables por separado: se corta en el inicio de cada escena,
    salvo si una capa (light leak, etc.) lo cruza."""
    fps = v["lienzo"]["fps"]
    cortes = sorted({e["f0"] for e in v["escenas"] if e["f0"] > 0})
    capas = [(frame_de(c["inicio"], fps), frame_de(c["inicio"] + c["duracion"], fps)) for c in v.get("capas", [])]
    cortes = [c for c in cortes if not any(a < c < b for a, b in capas)]
    lim = [0] + cortes + [v["_frames"]]
    segs = []
    for i in range(len(lim) - 1):
        f0, f1 = lim[i], lim[i + 1]
        esc = [e["id"] for e in v["escenas"] if e["f0"] < f1 and e["f1"] > f0]
        segs.append({"n": i + 1, "f0": f0, "f1": f1, "escenas": esc})
    return segs


def documento(v, f0=0, f1=None, con_audio=True):
    """Genera la composición completa (f0=0, f1=None) o una ventana [f0, f1)."""
    fps = v["lienzo"]["fps"]
    W, H = v["lienzo"]["ancho"], v["lienzo"]["alto"]
    if f1 is None:
        f1 = v["_frames"]
    ventana = not (f0 == 0 and f1 == v["_frames"])
    A, B = f0 / fps, f1 / fps
    # duración de la ventana truncada al milisegundo: el render redondea hacia arriba
    DUR = math.floor((f1 - f0) / fps * 1000) / 1000 if ventana else v["duracion"]
    off = A
    dentro = lambda a, b: a < B - EPS and b > A + EPS
    P = []
    P.append(f'<!doctype html>\n<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width={W}, height={H}" />\n'
             f'<title>{htmllib.escape(v["titulo"])}</title>\n<script src="{GSAP}"></script>\n<style>\n{v["_css"]}</style></head><body>\n'
             f'<div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="{W}" data-height="{H}">')
    escenas = [e for e in v["escenas"] if dentro(e["f0"] / fps, e["f1"] / fps)]
    for e in escenas:
        P.append(escena_html(v, e, off))
    P.append(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
    for c in v.get("capas", []):
        if dentro(c["inicio"], c["inicio"] + c["duracion"]):
            P.append(f'<div id="{c["id"]}" class="clip" data-composition-id="{c["id"]}" data-composition-src="{c["composicion"]}" '
                     f'data-start="{r3(c["inicio"] - off)}" data-duration="{c["duracion"]}" data-width="{W}" data-height="{H}" data-track-index="{c.get("pista", 6)}"></div>')
    if con_audio and not ventana:
        P.extend(audio_html(v))
    P.append('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
    P.append('const mkPop=T=>(s,t,o)=>T.fromTo(s,{opacity:0,scale:0.6},Object.assign({opacity:1,scale:1,duration:0.3,ease:"back.out(2)"},o||{}),t);'
             'const mkUp=T=>(s,t,o)=>T.fromTo(s,{opacity:0,y:30},Object.assign({opacity:1,y:0,duration:0.3,ease:"power3.out"},o||{}),t);')
    caps = [g for g in grupos_subtitulos(v) if dentro(g["st"], g["fin"])]
    P.append("const CAPS=" + json.dumps([{"top": g["top"], "end": g["end"], "w": g["w"]} for g in caps], ensure_ascii=False) + ";")
    color = v.get("subtitulos", {}).get("color_activo", "#FFD086")
    P.append('const host=document.getElementById("captions");\n'
             'CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";\n'
             'g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);if(wi<g.w.length-1)line.appendChild(document.createTextNode(" "));});\n'
             'host.appendChild(line);const st=Math.max(0,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);\n'
             f'g.w.forEach(([,t,e],wi)=>{{tl.to("#cap-"+gi+"-"+wi,{{color:"{color}",duration:0.06,ease:"none"}},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to("#cap-"+gi+"-"+wi,{{color:"#ffffff",duration:0.06,ease:"none"}},nx[1]-0.04);}});\n'
             'const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});')
    for e in escenas:
        P.append(escena_js(v, e))
    if ventana:
        # La línea de tiempo se arma en tiempo absoluto y la ventana la recorre de A a B:
        # cada frame de la ventana es idéntico al mismo frame del render completo.
        P.append(f'tl.to({{}},{{duration:{r3(B + 1)}}},0);\n'
                 f'const win=gsap.timeline({{paused:true}});win.add(tl.tweenFromTo({r3(A)},{r3(B)},{{duration:{DUR},ease:"none"}}),0);'
                 f'win.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=win;\n</script></body></html>')
    else:
        P.append(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
    return "\n".join(P)


def audio_html(v):
    out = []
    vz = v.get("voz")
    if vz:
        out.append(f'<audio id="voz" src="{vz["archivo"]}" data-start="{vz["inicio"]}" data-duration="{vz["duracion"]}" data-track-index="{vz.get("pista", 8)}" data-volume="{vz["volumen"]}"></audio>')
    m = v.get("musica")
    if m:
        auto = ""
        if m.get("fundido_salida"):
            a, b = m["fundido_salida"]
            auto = (' data-automation=\'{"version":1,"lanes":[{"target":"volume","points":[{"t":0,"v":1},'
                    f'{{"t":{a},"v":1}},{{"t":{b},"v":0}}]}}]}}\'')
        out.append(f'<audio id="musica" src="{m["archivo"]}" data-start="{m["inicio"]}" data-duration="{m["duracion"]}" data-media-start="{m.get("desde", 0)}" data-track-index="{m.get("pista", 9)}" data-volume="{m["volumen"]}"{auto}></audio>')
    for s in v.get("sfx", []):
        out.append(f'<audio id="{s["id"]}" src="{s["archivo"]}" data-start="{s["inicio"]}" data-duration="{s["duracion"]}" data-track-index="{s.get("pista", 10)}" data-volume="{s["volumen"]}"></audio>')
    return out


def cmd_construir(d):
    v = cargar(d)
    with open(os.path.join(v["_dir"], "index.html"), "w", encoding="utf-8") as f:
        f.write(documento(v))
    print(f"index.html: {len(v['escenas'])} escenas, {v['_frames']} frames, {len(segmentos(v))} segmentos")


# ---------------------------------------------------------------- ficha

class _Textos(HTMLParser):
    """Textos visibles de un fragmento HTML, cada uno con el selector de su elemento."""
    VACIOS = ("br", "img", "path", "line", "rect", "circle", "polygon")
    EN_LINEA = ("b", "i", "span", "strong", "em", "small")

    def __init__(self):
        super().__init__()
        self.pila, self.out, self.n = [], [], 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        sel = ("#" + a["id"]) if a.get("id") else ("." + a["class"].split()[0]) if a.get("class") else tag
        if tag == "img" and a.get("src"):
            self.out.append({"texto": f"[imagen] {a['src']}", "donde": sel, "_n": -1})
        if tag in self.VACIOS or (tag in self.EN_LINEA and self.pila):
            return
        self.n += 1
        self.pila.append((sel, self.n, tag))

    def handle_endtag(self, tag):
        if self.pila and self.pila[-1][2] == tag:
            self.pila.pop()

    def handle_data(self, data):
        t = " ".join(data.split())
        if not t or not self.pila:
            return
        idp = next((x[0] for x in reversed(self.pila) if x[0].startswith("#")), "")
        dentro, n, _ = self.pila[-1]
        donde = f"{idp} {dentro}".strip() if dentro.startswith(".") and idp and idp != dentro else (idp or dentro)
        if self.out and self.out[-1]["_n"] == n:
            self.out[-1]["texto"] += " " + t
        else:
            self.out.append({"texto": t, "donde": donde, "_n": n})


def _args(s, i):
    """Devuelve (lista de argumentos de primer nivel, índice tras el paréntesis)."""
    nivel, args, cur, q = 0, [], "", None
    while i < len(s):
        ch = s[i]
        if q:
            cur += ch
            if ch == q and s[i - 1] != "\\":
                q = None
        elif ch in "\"'`":
            q = ch
            cur += ch
        elif ch in "([{":
            nivel += 1
            cur += ch
        elif ch in ")]}":
            if nivel == 0:
                args.append(cur.strip())
                return args, i + 1
            nivel -= 1
            cur += ch
        elif ch == "," and nivel == 0:
            args.append(cur.strip())
            cur = ""
        else:
            cur += ch
        i += 1
    return args, i


PROPS = {"scale": "escala", "opacity": "opacidad", "x": "posición", "y": "posición", "xPercent": "posición", "yPercent": "posición",
         "clipPath": "revelado", "stroke-dashoffset": "trazo de línea", "scaleX": "ancho", "filter": "desenfoque", "color": "color",
         "boxShadow": "pulso", "rotation": "giro"}


def humanizar(obj):
    claves = re.findall(r'["\']?([\w-]+)["\']?\s*:', obj)
    vistos = []
    for k in claves:
        w = PROPS.get(k)
        if w and w not in vistos:
            vistos.append(w)
    dur = re.search(r"duration:\s*([\d.]+)", obj)
    rep = re.search(r"repeat:\s*(\d+)", obj)
    txt = ", ".join(vistos) or "propiedades"
    if dur:
        txt += f" en {float(dur.group(1)):g} s"
    if rep:
        txt += f" ×{int(rep.group(1)) + 1}"
    return txt


VERBOS = {"up": "sube y aparece", "pop": "aparece con rebote", "S.fromTo": "anima", "S.to": "anima", "S.set": "cambia"}


def animaciones(js, base):
    out = []
    for m in re.finditer(r'(up|pop|S\.fromTo|S\.to|S\.set)\(\s*"([^"]+)"', js):
        args, _ = _args(js, m.start(0) + len(m.group(1)) + 1)
        t = args[-1] if args else ""
        try:
            tt = r3(base + float(t))
        except ValueError:
            tt = None
        props = ""
        if m.group(1).startswith("S.") and len(args) >= 2:
            props = humanizar(args[-2])
        out.append({"t": tt, "elemento": m.group(2), "que": VERBOS[m.group(1)] + (f" {props}" if props else "")})
    for c in re.findall(r"//\s*(.+)", js):
        out.insert(0, {"t": None, "elemento": "", "que": c.strip()})
    return out


def ficha_datos(v):
    fps = v["lienzo"]["fps"]
    grupos = grupos_subtitulos(v)
    segs = segmentos(v)
    escenas = []
    for e in v["escenas"]:
        a, b = e["f0"] / fps, e["f1"] / fps
        subs = [{"texto": " ".join(w[0] for w in g["w"]), "inicio": r3(g["st"]), "fin": r3(g["fin"])}
                for g in grupos if g["escena"] == e["id"]]
        palabras = [w[0] for w in v["_palabras"] if a - 0.06 <= w[1] < b - 0.06]
        voz = e.get("voz") or (" ".join(palabras) if palabras else "")
        textos = []
        if e.get("titular"):
            hl = e["titular"]
            textos.append({"texto": hl["l1"], "donde": f"#{e['id']}-hl .l1"})
            textos.append({"texto": hl["l2"], "donde": f"#{e['id']}-hl .l2"})
            if hl.get("sm"):
                textos.append({"texto": hl["sm"], "donde": f"#{e['id']}-hl .sm"})
        if e.get("_html"):
            p = _Textos()
            p.feed(e["_html"])
            textos.extend({"texto": x["texto"], "donde": x["donde"]} for x in p.out)
        anim = []
        mov = e.get("movimiento", "empuje")
        if e.get("tipo", "foto") == "foto":
            anim.append({"t": r3(a), "elemento": f"#{e['id']} .kb", "que": {
                "empuje": f"Ken Burns: empuje lento de 104 % a {r3(104 + 2.2 * (b - a))} %",
                "paneo": "Ken Burns: paneo lateral −2 % → +2 % a 110 %",
                "ninguno": "sin movimiento automático (lo define su JS)"}.get(mov, mov)})
        if e.get("titular"):
            anim.append({"t": r3(a + 0.08), "elemento": f"#{e['id']}-hl", "que": "titular entra desde la izquierda (l1, l2 +0.12 s, regla +0.22 s)"})
        if e.get("_js"):
            anim.extend(animaciones(e["_js"], a))
        sfx = [{"id": s["id"], "archivo": os.path.basename(s["archivo"]), "inicio": s["inicio"], "volumen": s["volumen"]}
               for s in v.get("sfx", []) if a - 0.3 <= s["inicio"] < b - 0.3]
        capas = [c["id"] + (f" ({c['nota']})" if c.get("nota") else "") for c in v.get("capas", [])
                 if c["inicio"] < b and c["inicio"] + c["duracion"] > a]
        seg = next(s["n"] for s in segs if e["id"] in s["escenas"])
        escenas.append({
            "id": e["id"], "tipo": e.get("tipo", "foto"), "inicio": r3(a), "fin": r3(b), "duracion": r3(b - a),
            "frame_inicio": e["f0"], "frame_fin": e["f1"] - 1, "segmento": seg,
            "imagen": e.get("imagen"), "encuadre": e.get("encuadre"), "movimiento": mov if e.get("tipo", "foto") == "foto" else None,
            "filtro": e.get("filtro"), "voz": voz, "subtitulos": subs,
            "subtitulos_y": (e.get("subtitulos") or {}).get("y"), "textos": textos, "animaciones": anim,
            "sfx": sfx, "capas": capas, "archivos": [x for x in (e.get("html"), e.get("js")) if x], "nota": e.get("nota", ""),
        })
    guion = ""
    if v.get("guion"):
        try:
            guion = leer(v["_dir"], v["guion"]).strip()
        except OSError:
            pass
    return {
        "id": v["id"], "titulo": v["titulo"], "version": v.get("version", ""), "fps": fps,
        "duracion": v["duracion"], "frames": v["_frames"], "ancho": v["lienzo"]["ancho"], "alto": v["lienzo"]["alto"],
        "estilo": v.get("estilo", ""), "guion": guion,
        "voz": {k: v["voz"][k] for k in ("archivo", "motor", "volumen") if k in v.get("voz", {})},
        "musica": {k: v["musica"][k] for k in ("archivo", "titulo", "volumen", "desde") if k in v.get("musica", {})},
        "segmentos": segs, "escenas": escenas,
    }


def cmd_ficha(d):
    v = cargar(d)
    F = ficha_datos(v)
    fps = F["fps"]
    with open(os.path.join(v["_dir"], "ficha.json"), "w", encoding="utf-8") as f:
        json.dump(F, f, ensure_ascii=False, indent=1)
    L = [f"# Ficha — {F['titulo']}", "",
         f"Generada por `herramientas/video.py ficha` desde `video.json`. No se edita a mano: se regenera.", "",
         f"- Duración: {F['duracion']} s · {F['frames']} frames a {fps} fps · {F['ancho']}×{F['alto']}",
         f"- Escenas: {len(F['escenas'])} · Segmentos de render: {len(F['segmentos'])}",
         f"- Estilo: {F['estilo']}",
         f"- Voz: {F['voz'].get('motor', '')} (`{F['voz'].get('archivo', '')}`, volumen {F['voz'].get('volumen', '')})",
         f"- Música: {F['musica'].get('titulo', F['musica'].get('archivo', ''))} (desde {F['musica'].get('desde', 0)} s, volumen {F['musica'].get('volumen', '')})",
         "", "## Guion (voz)", "", F["guion"] or "(sin guion enlazado)", "", "## Escenas", ""]
    L.append("| # | Escena | Tiempo | Frames | Tipo | Imagen | Titular / textos | Voz |")
    L.append("|---|---|---|---|---|---|---|---|")
    for i, e in enumerate(F["escenas"], 1):
        tx = " · ".join(t["texto"] for t in e["textos"] if not t["texto"].startswith("["))
        L.append(f"| {i} | `{e['id']}` | {e['inicio']:.2f}–{e['fin']:.2f} s | {e['frame_inicio']}–{e['frame_fin']} | {e['tipo']} | "
                 f"{os.path.basename(e['imagen']) if e['imagen'] else '—'} | {tx[:80] or '—'} | {e['voz'][:70] or '—'} |")
    for e in F["escenas"]:
        L += ["", f"### `{e['id']}` · {e['inicio']:.2f}–{e['fin']:.2f} s · frames {e['frame_inicio']}–{e['frame_fin']} · {e['duracion']} s · segmento {e['segmento']}", ""]
        if e["imagen"]:
            L.append(f"- **Imagen:** `{e['imagen']}` · encuadre {e['encuadre'] or '—'} · movimiento {e['movimiento']}" + (f" · filtro {e['filtro']}" if e["filtro"] else ""))
        if e["voz"]:
            L.append(f"- **Voz:** {e['voz']}")
        if e["subtitulos"]:
            L.append(f"- **Subtítulos** (y = {e['subtitulos_y']} px): " + " / ".join(f"«{s['texto']}» {s['inicio']:.2f}" for s in e["subtitulos"]))
        if e["textos"]:
            L.append("- **En pantalla:**")
            L += [f"  - {t['texto']} `{t['donde']}`" for t in e["textos"]]
        if e["animaciones"]:
            L.append("- **Animaciones:**")
            L += [f"  - {('%.2f s' % a['t']) if a['t'] is not None else '·'} {a['que']}" + (f" `{a['elemento']}`" if a["elemento"] else "") for a in e["animaciones"]]
        if e["sfx"]:
            L.append("- **SFX:** " + ", ".join(f"{s['id']} {s['archivo']} @{s['inicio']} s" for s in e["sfx"]))
        if e["capas"]:
            L.append("- **Capas:** " + ", ".join(e["capas"]))
        if e["archivos"]:
            L.append("- **Archivos:** " + ", ".join(f"`{x}`" for x in e["archivos"]))
        if e["nota"]:
            L.append(f"- **Nota:** {e['nota']}")
    L += ["", "## Segmentos de render", "", "Un cambio vuelve a renderizar solo los segmentos de las escenas tocadas.", "",
          "| Seg. | Frames | Escenas |", "|---|---|---|"]
    L += [f"| {s['n']} | {s['f0']}–{s['f1'] - 1} | {', '.join(s['escenas'])} |" for s in F["segmentos"]]
    with open(os.path.join(v["_dir"], "FICHA.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")
    print(f"FICHA.md y ficha.json: {len(F['escenas'])} escenas")


# ---------------------------------------------------------------- render por segmentos

def sha_archivo(p, cache={}):
    if p in cache:
        return cache[p]
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for b in iter(lambda: f.read(1 << 20), b""):
            h.update(b)
    cache[p] = h.hexdigest()[:16]
    return cache[p]


def referencias(d, texto, vistos=None):
    vistos = vistos if vistos is not None else set()
    refs = set(re.findall(r'(?:src|data-composition-src)="([^"]+)"', texto)) | set(re.findall(r'url\("([^"]+)"\)', texto))
    out = []
    for r in sorted(refs):
        if r.startswith(("http:", "https:", "data:")) or r in vistos:
            continue
        vistos.add(r)
        p = os.path.join(d, r)
        if os.path.exists(p):
            out.append((r, sha_archivo(p)))
            if r.endswith(".html"):
                out += referencias(d, leer(d, r), vistos)
        else:
            out.append((r, "FALTA"))
    return out


def huella(v, seg):
    doc = documento(v, seg["f0"], seg["f1"], con_audio=False)
    refs = referencias(v["_dir"], doc)
    h = hashlib.sha256(doc.encode())
    for r, s in refs:
        h.update(f"{r}:{s}".encode())
    return h.hexdigest()[:20], doc, [r for r, s in refs if s == "FALTA"]


def dir_renders(v):
    p = os.path.join(v["_dir"], "renders")
    os.makedirs(os.path.join(p, "segmentos"), exist_ok=True)
    return p


def leer_versiones(v):
    p = os.path.join(dir_renders(v), "versiones.json")
    if os.path.exists(p):
        with open(p, encoding="utf-8") as f:
            return json.load(f)
    return []


def cmd_segmentos(d, calidad="high"):
    v = cargar(d)
    rd = dir_renders(v)
    vers = leer_versiones(v)
    ult = {s["n"]: s["huella"] for s in vers[-1]["segmentos"]} if vers else {}
    print(f"{'seg':>3}  {'frames':>11}  estado      escenas")
    for s in segmentos(v):
        hu, _, faltan = huella(v, s)
        hecho = os.path.exists(os.path.join(rd, "segmentos", f"{hu}-{calidad}.mp4"))
        estado = "listo" if hecho else ("CAMBIÓ" if s["n"] in ult and ult[s["n"]] != hu else "pendiente")
        extra = f"  (faltan: {', '.join(faltan)})" if faltan else ""
        print(f"{s['n']:>3}  {s['f0']:>5}–{s['f1'] - 1:<5}  {estado:<10}  {', '.join(s['escenas'])}{extra}")


def correr(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        sys.stderr.write(r.stdout[-3000:] + r.stderr[-3000:])
        sys.exit(f"Falló: {' '.join(cmd[:4])}…")
    return r


def frames_de(p):
    r = correr(["ffprobe", "-v", "error", "-select_streams", "v:0", "-count_packets", "-show_entries",
                "stream=nb_read_packets", "-of", "csv=p=0", p])
    return int(r.stdout.strip() or 0)


def render_segmento(v, seg, hu, doc, calidad):
    rd = dir_renders(v)
    out = os.path.join(rd, "segmentos", f"{hu}-{calidad}.mp4")
    tmp_html = os.path.join(v["_dir"], f"_ventana-{seg['n']:02d}.html")
    with open(tmp_html, "w", encoding="utf-8") as f:
        f.write(doc)
    q = "draft" if calidad == "draft" else "high"
    try:
        correr(["npx", "--yes", HF, "render", v["_dir"], "-c", os.path.basename(tmp_html), "-o", out + ".tmp.mp4",
                "--quality", q, "--fps", str(v["lienzo"]["fps"]), "--quiet"], cwd=v["_dir"])
    finally:
        os.remove(tmp_html)
    # sin audio: el audio se mezcla aparte para todo el video
    correr(["ffmpeg", "-y", "-v", "error", "-i", out + ".tmp.mp4", "-an", "-c", "copy", out])
    os.remove(out + ".tmp.mp4")
    n = frames_de(out)
    esperado = seg["f1"] - seg["f0"]
    if n != esperado:
        print(f"  ⚠ segmento {seg['n']}: {n} frames (se esperaban {esperado})")
    return out


def cmd_audio(d, salida=None):
    v = cargar(d)
    rd = dir_renders(v)
    salida = salida or os.path.join(rd, "audio-mezcla.wav")
    D = v["duracion"]
    ent, filtros, n = [], [], 0

    def pista(archivo, inicio, dur, vol, desde=0, fade=None):
        nonlocal n
        p = os.path.join(v["_dir"], archivo)
        if not os.path.exists(p):
            print(f"  ⚠ falta audio: {archivo}")
            return
        ent.extend(["-i", p])
        f = f"[{n}:a]atrim=start={desde}:duration={dur},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,volume={vol}"
        if fade:
            f += f",afade=t=out:st={r3(fade[0] - inicio)}:d={r3(fade[1] - fade[0])}"
        ms = int(round(inicio * 1000))
        f += f",adelay={ms}|{ms}[a{n}]"
        filtros.append(f)
        n += 1

    if v.get("voz"):
        z = v["voz"]
        pista(z["archivo"], z["inicio"], z["duracion"], z["volumen"])
    if v.get("musica"):
        m = v["musica"]
        pista(m["archivo"], m["inicio"], m["duracion"], m["volumen"], m.get("desde", 0), m.get("fundido_salida"))
    for s in v.get("sfx", []):
        pista(s["archivo"], s["inicio"], s["duracion"], s["volumen"])
    if not n:
        print("Sin pistas de audio.")
        return None
    mezcla = "".join(f"[a{i}]" for i in range(n)) + f"amix=inputs={n}:normalize=0:duration=longest,apad,atrim=0:{D}"
    fc = ";".join(filtros + [mezcla + "[m]"])
    tmp = salida + ".crudo.wav"
    correr(["ffmpeg", "-y", "-v", "error"] + ent + ["-filter_complex", fc, "-map", "[m]", tmp])
    # loudness: −14 LUFS integrada, pico real ≤ −1 dBTP (CLAUDE.md)
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", tmp, "-af", "loudnorm=I=-14:TP=-1:LRA=11:print_format=json", "-f", "null", "-"],
                       capture_output=True, text=True)
    mj = json.loads(r.stderr[r.stderr.rfind("{"):r.stderr.rfind("}") + 1])
    ln = (f"loudnorm=I=-14:TP=-1:LRA=11:measured_I={mj['input_i']}:measured_TP={mj['input_tp']}:"
          f"measured_LRA={mj['input_lra']}:measured_thresh={mj['input_thresh']}:offset={mj['target_offset']}:linear=true")
    correr(["ffmpeg", "-y", "-v", "error", "-i", tmp, "-af", ln + ",aresample=48000", "-ar", "48000", salida])
    os.remove(tmp)
    print(f"Audio: {n} pistas → {os.path.relpath(salida, v['_dir'])} (medido antes {mj['input_i']} LUFS)")
    return salida


def cmd_render(d, calidad="high", nota="", solo=None):
    v = cargar(d)
    rd = dir_renders(v)
    vers = leer_versiones(v)
    segs = segmentos(v)
    if solo:
        segs_obj = [s for s in segs if s["n"] in solo]
    else:
        segs_obj = segs
    nuevos, reusados, partes = [], [], []
    for s in segs:
        hu, doc, faltan = huella(v, s)
        p = os.path.join(rd, "segmentos", f"{hu}-{calidad}.mp4")
        if faltan:
            print(f"  ⚠ segmento {s['n']}: faltan {', '.join(faltan)}")
        if not os.path.exists(p):
            if s not in segs_obj:
                sys.exit(f"Segmento {s['n']} sin render y fuera de --solo")
            print(f"→ render segmento {s['n']} ({', '.join(s['escenas'])}) frames {s['f0']}–{s['f1'] - 1}…", flush=True)
            render_segmento(v, s, hu, doc, calidad)
            nuevos.append(s["n"])
        else:
            reusados.append(s["n"])
        partes.append({"n": s["n"], "f0": s["f0"], "f1": s["f1"], "escenas": s["escenas"], "huella": hu, "archivo": os.path.relpath(p, rd)})
    lista = os.path.join(rd, "segmentos", "_lista.txt")
    with open(lista, "w") as f:
        f.writelines(f"file '{os.path.basename(x['archivo'])}'\n" for x in partes)
    solo_video = os.path.join(rd, "_video.mp4")
    correr(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lista, "-c", "copy", solo_video])
    audio = cmd_audio(d)
    num = len(vers) + 1
    nombre = f"{v['id']}-{v.get('version', 'v')}-r{num:02d}{'-borrador' if calidad == 'draft' else ''}.mp4"
    final = os.path.join(rd, nombre)
    cmd = ["ffmpeg", "-y", "-v", "error", "-i", solo_video]
    if audio:
        cmd += ["-i", audio, "-map", "0:v", "-map", "1:a", "-c:a", "aac", "-b:a", "192k"]
    cmd += ["-c:v", "copy", "-t", str(v["duracion"]), "-movflags", "+faststart", final]
    correr(cmd)
    os.remove(solo_video)
    vers.append({"render": num, "archivo": nombre, "calidad": calidad, "fecha": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC"),
                 "nota": nota, "renderizados": nuevos, "reusados": reusados, "segmentos": partes})
    with open(os.path.join(rd, "versiones.json"), "w", encoding="utf-8") as f:
        json.dump(vers, f, ensure_ascii=False, indent=1)
    print(f"✔ {nombre}: renderizados {nuevos or 'ninguno'} · reusados {len(reusados)} de {len(segs)}")
    return final


def cmd_proxy(d, archivo=None):
    v = cargar(d)
    rd = dir_renders(v)
    if not archivo:
        vers = leer_versiones(v)
        if not vers:
            sys.exit("No hay renders todavía")
        archivo = os.path.join(rd, vers[-1]["archivo"])
    out = os.path.splitext(archivo)[0] + "-revision.mp4"
    correr(["ffmpeg", "-y", "-v", "error", "-i", archivo, "-vf", "scale=540:960:flags=lanczos", "-c:v", "libx264", "-crf", "27",
            "-preset", "medium", "-g", "15", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-movflags", "+faststart", out])
    mb = os.path.getsize(out) / 1e6
    print(f"Proxy de revisión: {os.path.relpath(out, v['_dir'])} ({mb:.1f} MB)")
    if mb > 14:  # el Artifact acepta hasta 15 MB por archivo: se sube en partes (campo `partes`)
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from bajar import partir
        print("Más de 14 MB: súbelo en estas partes y guarda sus ids en orden en `partes` (con proxy: null):")
        partir(out)
    return out


def cmd_sala(d):
    """Documento para la Sala de Revisión (colección `videos`, id = id del video).
    Se sube con ArtifactData update/set usando file_path; no toca el campo `proxy`."""
    v = cargar(d)
    F = ficha_datos(v)
    vers = leer_versiones(v)
    doc = {"titulo": v["titulo"], "version": v.get("version", ""), "render": f"r{vers[-1]['render']:02d}" if vers else "",
           "fps": F["fps"], "frames": F["frames"], "duracion": F["duracion"], "ficha": F,
           "actualizado": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")}
    out = os.path.join(dir_renders(v), "sala.json")
    with open(out, "w", encoding="utf-8") as f:
        json.dump(doc, f, ensure_ascii=False)
    print(f"{out}  ({os.path.getsize(out) // 1024} KB) → colección videos, doc_id {v['id']}")


def cmd_versiones(d):
    v = cargar(d)
    for x in leer_versiones(v):
        print(f"r{x['render']:02d} {x['fecha']} {x['calidad']:<5} {x['archivo']}  nuevos {x['renderizados']}  {x['nota']}")


def main(argv):
    if len(argv) < 3 or argv[1] not in ("construir", "ficha", "segmentos", "render", "audio", "proxy", "versiones", "sala"):
        print(__doc__)
        return 1
    cmd, d, rest = argv[1], argv[2], argv[3:]
    opt = {}
    i = 0
    pos = []
    while i < len(rest):
        if rest[i].startswith("--"):
            opt[rest[i][2:]] = rest[i + 1] if i + 1 < len(rest) else ""
            i += 2
        else:
            pos.append(rest[i])
            i += 1
    if cmd == "construir":
        cmd_construir(d)
    elif cmd == "ficha":
        cmd_ficha(d)
    elif cmd == "segmentos":
        cmd_segmentos(d, opt.get("calidad", "high"))
    elif cmd == "render":
        solo = [int(x) for x in opt["solo"].split(",")] if opt.get("solo") else None
        cmd_render(d, opt.get("calidad", "high"), opt.get("nota", ""), solo)
    elif cmd == "audio":
        cmd_audio(d)
    elif cmd == "proxy":
        cmd_proxy(d, pos[0] if pos else None)
    elif cmd == "versiones":
        cmd_versiones(d)
    elif cmd == "sala":
        cmd_sala(d)
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
