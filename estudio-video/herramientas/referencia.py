#!/usr/bin/env python3
"""Mide un video de referencia para reutilizar su estilo en videos nuevos.

Uso (desde estudio-video/):
  python3 herramientas/referencia.py <video.mp4> <nombre> [--umbral 0.3] [--recorte w:h:x:y] [--transcribir]

Escribe en referencias/<nombre>/ (no se sube al repo: es material de terceros):
  medidas.json        números: duración, cortes, planos, ritmo, loudness, color, voz
  planos/             un fotograma por plano (mitad del plano)
  hojas/hoja-N.jpg    hojas de contacto 4×3 con número de plano y segundo
  informe.md          resumen medido + lista de lo que falta observar a ojo

Después, Claude mira SOLO las hojas de contacto (no el video completo) y escribe
estilos/<nombre>.md con la misma estructura que estilo.md. Ese archivo sí se
sube y es el que se elige como estilo para videos nuevos.
"""
import json
import os
import re
import statistics
import subprocess
import sys

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"


def sh(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def probe(p):
    r = sh(["ffprobe", "-v", "error", "-show_entries", "format=duration:stream=codec_type,codec_name,width,height,r_frame_rate,sample_rate,channels",
            "-of", "json", p])
    j = json.loads(r.stdout)
    v = next((s for s in j["streams"] if s["codec_type"] == "video"), {})
    a = next((s for s in j["streams"] if s["codec_type"] == "audio"), None)
    num, den = (v.get("r_frame_rate", "30/1").split("/") + ["1"])[:2]
    return {"duracion": round(float(j["format"]["duration"]), 3), "ancho": v.get("width"), "alto": v.get("height"),
            "fps": round(float(num) / float(den or 1), 3), "video": v.get("codec_name"),
            "audio": f"{a['codec_name']} {a.get('sample_rate')} Hz {a.get('channels')} canales" if a else None}


def cortes(p, umbral, recorte):
    vf = (f"crop={recorte}," if recorte else "") + f"select='gt(scene,{umbral})',showinfo"
    r = sh(["ffmpeg", "-hide_banner", "-i", p, "-vf", vf, "-an", "-f", "null", "-"])
    ts = [float(x) for x in re.findall(r"pts_time:([\d.]+)", r.stderr)]
    out = []
    for t in ts:  # junta detecciones a menos de 0.25 s (destellos, fundidos)
        if not out or t - out[-1] > 0.25:
            out.append(round(t, 3))
    return out


def loudness(p):
    r = sh(["ffmpeg", "-hide_banner", "-i", p, "-af", "ebur128=peak=true", "-f", "null", "-"])
    s = r.stderr[r.stderr.rfind("Summary:"):]
    g = lambda k: (re.search(k + r":\s+(-?[\d.]+)", s) or [None, None])[1]
    sil = sh(["ffmpeg", "-hide_banner", "-i", p, "-af", "silencedetect=n=-40dB:d=0.25", "-f", "null", "-"])
    silencios = [round(float(x), 2) for x in re.findall(r"silence_start: ([\d.]+)", sil.stderr)]
    return {"lufs_integrada": g("I"), "lra": g("LRA"), "pico_real_dbtp": g("Peak"), "silencios_250ms": silencios}


def fotogramas(p, planos, carpeta, recorte):
    os.makedirs(carpeta, exist_ok=True)
    rutas = []
    for i, (a, b) in enumerate(planos, 1):
        t = (a + b) / 2
        out = os.path.join(carpeta, f"plano-{i:02d}.jpg")
        vf = (f"crop={recorte}," if recorte else "") + "scale=360:-2," + \
            f"drawtext=fontfile={FONT}:text='{i}  {a:.2f}s':x=10:y=10:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6"
        sh(["ffmpeg", "-v", "error", "-y", "-ss", f"{t:.3f}", "-i", p, "-frames:v", "1", "-vf", vf, out])
        rutas.append(out)
    return rutas


def hojas(rutas, carpeta):
    """Hojas de contacto de 4×3 planos (la última se rellena en negro)."""
    os.makedirs(carpeta, exist_ok=True)
    patron = os.path.join(os.path.dirname(rutas[0]), "plano-%02d.jpg")
    sh(["ffmpeg", "-v", "error", "-y", "-start_number", "1", "-i", patron, "-vf",
        "scale=360:640:force_original_aspect_ratio=decrease,pad=360:640:(ow-iw)/2:(oh-ih)/2,tile=4x3:padding=6",
        "-q:v", "4", os.path.join(carpeta, "hoja-%d.jpg")])
    return sorted(os.path.join(carpeta, f) for f in os.listdir(carpeta) if f.startswith("hoja-"))


def color(rutas):
    try:
        from PIL import Image
    except ImportError:
        return None
    px = []
    for r in rutas:
        im = Image.open(r).convert("RGB").resize((36, 64))
        px += list(im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata())
    n = len(px)
    m = [round(sum(p[i] for p in px) / n) for i in range(3)]
    luma = [0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2] for p in px]
    sat = [(max(p) - min(p)) / max(p) if max(p) else 0 for p in px]
    q = Image.new("RGB", (len(px), 1))
    q.putdata(px)
    pal = q.quantize(colors=5)
    cuenta = sorted(pal.getcolors(), reverse=True)
    paleta = pal.getpalette()
    dom = [{"hex": "#%02X%02X%02X" % tuple(paleta[i * 3:i * 3 + 3]), "pct": round(100 * c / n)} for c, i in cuenta]
    return {"rgb_medio": m, "temperatura": "fría" if m[2] > m[0] else "cálida", "luminancia_media": round(statistics.mean(luma)),
            "contraste_desv": round(statistics.pstdev(luma)), "saturacion_media": round(statistics.mean(sat), 2), "dominantes": dom}


def transcribir(p, carpeta):
    out = os.path.join(carpeta, "transcripcion.json")
    r = sh(["npx", "--yes", "hyperframes@0.8.139", "transcribe", p, "--model", "small", "--language", "es", "--output", out])
    if r.returncode != 0 or not os.path.exists(out):
        return {"error": (r.stderr or r.stdout)[-400:]}
    with open(out) as f:
        j = json.load(f)
    palabras = j if isinstance(j, list) else j.get("words", [])
    if not palabras:
        return {"palabras": 0}
    ini = palabras[0].get("start", 0)
    fin = palabras[-1].get("end", 0)
    return {"palabras": len(palabras), "primera_palabra_s": ini, "ppm": round(len(palabras) / max(0.1, (fin - ini)) * 60)}


def main(argv):
    if len(argv) < 3:
        print(__doc__)
        return 1
    video, nombre = argv[1], argv[2]
    opt = {argv[i][2:]: (argv[i + 1] if i + 1 < len(argv) and not argv[i + 1].startswith("--") else "1")
           for i in range(3, len(argv)) if argv[i].startswith("--")}
    base = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "referencias", nombre)
    os.makedirs(base, exist_ok=True)
    umbral = float(opt.get("umbral", 0.3))
    recorte = opt.get("recorte")
    M = {"nombre": nombre, "archivo": os.path.basename(video), "umbral_escena": umbral, "recorte": recorte}
    M.update(probe(video))
    D = M["duracion"]
    cs = cortes(video, umbral, recorte)
    lim = [0.0] + [c for c in cs if 0.2 < c < D - 0.2] + [D]
    planos = [(lim[i], lim[i + 1]) for i in range(len(lim) - 1)]
    dur = [round(b - a, 2) for a, b in planos]
    M["cortes"] = lim[1:-1]
    M["planos"] = [{"n": i + 1, "inicio": round(a, 2), "fin": round(b, 2), "dur": d} for i, ((a, b), d) in enumerate(zip(planos, dur))]
    M["ritmo"] = {"n_planos": len(planos), "media": round(statistics.mean(dur), 2), "mediana": round(statistics.median(dur), 2),
                  "min": min(dur), "max": max(dur), "cortes_por_10s": round(10 * (len(planos) - 1) / D, 2),
                  "cortes_primeros_3s": len([c for c in M["cortes"] if c < 3])}
    print(f"{len(planos)} planos, {M['ritmo']['cortes_por_10s']} cortes/10 s")
    if M.get("audio"):
        M["audio_medido"] = loudness(video)
    rutas = fotogramas(video, planos, os.path.join(base, "planos"), recorte)
    M["hojas"] = [os.path.relpath(h, base) for h in hojas(rutas, os.path.join(base, "hojas"))]
    M["color"] = color(rutas)
    if "transcribir" in opt and M.get("audio"):
        M["voz"] = transcribir(video, base)
    with open(os.path.join(base, "medidas.json"), "w", encoding="utf-8") as f:
        json.dump(M, f, ensure_ascii=False, indent=1)
    r, a, c = M["ritmo"], M.get("audio_medido", {}), M.get("color") or {}
    L = [f"# Referencia «{nombre}» — medidas", "",
         f"- Archivo: {M['archivo']} · {M['ancho']}×{M['alto']} · {M['fps']} fps · {D} s · audio: {M.get('audio') or 'no'}",
         f"- Planos: {r['n_planos']} · duración media {r['media']} s · mediana {r['mediana']} s · mín {r['min']} · máx {r['max']}",
         f"- Cortes por 10 s: {r['cortes_por_10s']} · cortes en los primeros 3 s: {r['cortes_primeros_3s']}",
         f"- Loudness: {a.get('lufs_integrada')} LUFS · pico {a.get('pico_real_dbtp')} dBTP · LRA {a.get('lra')} · silencios > 250 ms: {len(a.get('silencios_250ms', []))}",
         (f"- Color: RGB medio {c['rgb_medio']} ({c['temperatura']}) · luminancia {c['luminancia_media']} · contraste {c['contraste_desv']} · "
          f"saturación {c['saturacion_media']} · dominantes {', '.join(d['hex'] + ' ' + str(d['pct']) + '%' for d in c['dominantes'])}") if c else "- Color: sin PIL",
         (f"- Voz: {M['voz']}" if M.get("voz") else "- Voz: sin transcribir (usa --transcribir)"),
         "", "## Planos", "", "| # | Inicio | Dur. |", "|---|---|---|"]
    L += [f"| {p['n']} | {p['inicio']} | {p['dur']} |" for p in M["planos"]]
    L += ["", "## Para completar mirando las hojas de contacto", "",
          "- Gancho (0–2 s): qué aparece, qué se mueve, qué se dice.",
          "- Subtítulos: fuente, peso, tamaño, color, posición Y, palabras por bloque, animación.",
          "- Textos en pantalla: niveles (titular, cifra, tarjetas), tamaños y posiciones.",
          "- Transiciones: cortes secos vs. efectos (destellos, barridos).",
          "- Movimiento: zooms, paneos, Ken Burns.",
          "- Cierre / CTA: duración y contenido.",
          "", "Revisa si el umbral detectó bien los cortes: con interfaz encima (grabación de pantalla) usa --recorte y baja --umbral."]
    with open(os.path.join(base, "informe.md"), "w", encoding="utf-8") as f:
        f.write("\n".join(L) + "\n")
    print(f"Listo: referencias/{nombre}/ (informe.md, medidas.json, {len(M['hojas'])} hoja(s) de contacto)")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
