#!/usr/bin/env python3
"""Doctor V7: aplica la solicitud de cambios del editor sobre el proyecto Doctor V6.

  python3 claude-studio/trabajo/doctor-v7.py <base.json> <voz.words.json> <guion.txt> <salida.json> [--urls urls.json]

- Guion nuevo (voz Edge TTS es-MX-JorgeNeural): rearma tiempos de escenas, subtítulos y SFX.
- Subtítulos con cifras en número, apertura nueva, 2 tomas para el precio, infografía de ubicación,
  plusvalía animada, rendimiento esperado, ahorro con conteo y destello, cierre con escudo sin fondo.
`urls.json` mapea id de asset → url (local para render, /_blob/<id> para el editor en Claude).
"""
import copy
import json
import re
import sys

base, words_p, guion_p, out = sys.argv[1:5]
urls = json.load(open(sys.argv[sys.argv.index("--urls") + 1])) if "--urls" in sys.argv else {}
P = json.load(open(base))
W = json.load(open(words_p))["words"]
TOK = open(guion_p).read().split()
assert len(W) == len(TOK), (len(W), len(TOK))
for w, t in zip(W, TOK):
    w["text"] = t  # texto con puntuación del guion, tiempos de la voz

NAVY, GOLD, CREAM = "#1A2B4C", "#C5A564", "#F5F0E6"
S = {s["id"][-2:]: s for s in P["scenes"]}
sfx_de = {}
for t in P["audioTracks"]:
    if t.get("sceneId"):
        sfx_de.setdefault(t["sceneId"], []).append(t)


def clon(n, nuevo, media):
    s = copy.deepcopy(S[n])
    s["id"] = f"legacy-doctor-{nuevo}"
    s["mediaId"] = media
    return s


# (escena, narración nueva). Las claves con letra son tomas nuevas.
s02b = clon("02", "02b", "image-16")
s06b = clon("06", "06b", "image-17")
PLAN = [
    (S["01"], "Doctor o médico, ¿buscas una casa con vista al mar"),
    (S["02"], "para disfrutar en pareja"),
    (s02b, "o invertir para crecer tu patrimonio?"),
    (S["03"], "En El Sauzal, en la entrada de Ensenada,"),
    (S["04"], "descubre casas de un nivel,"),
    (S["05"], "de dos o tres recámaras,"),
    (S["06"], "desde tres punto nueve"),
    (s06b, "hasta cuatro punto nueve millones de pesos,"),
    (S["07"], "con roof garden privado y vista al mar."),
    (S["08"], "Imagina una pausa en la alberca,"),
    (S["09"], "pickleball con tus amigos,"),
    (S["10"], "tardes de asador y"),
    (S["11"], "cenas con tus seres queridos en las amenidades"),
    (S["12"], "o en tu roof privado."),
    (S["13"], "Cuida tu liquidez con pagos flexibles:"),
    (S["14"], "diez por ciento de enganche,"),
    (S["15"], "diez por ciento distribuido en veinte mensualidades y"),
    (S["16"], "ochenta por ciento contra entrega,"),
    (S["17"], "a mediados de dos mil veintiocho."),
    (S["18"], "Explora su potencial de plusvalía y de"),
    (S["19"], "ingresos por rentas de estancia corta."),
    (S["20"], "Disfruta una smart home: controla luces, minisplit y"),
    (S["21"], "cerradura digital desde tu celular."),
    (S["22"], "Aparta este mes y recibe cocina,"),
    (S["23"], "recámaras,"),
    (S["24"], "baños y"),
    (S["25"], "roof con equipamiento incluido,"),
    (S["26"], "con un ahorro de hasta cuatrocientos cincuenta mil pesos."),
    (S["27"], "Haz clic en el botón de abajo para más información."),
    (S["28"], "Un asesor de Legacy Capital te atenderá."),
]

# ---- tiempos por escena desde la voz
i = 0
viejo_inicio = {s["id"]: s["start"] for s in P["scenes"]}
viejo_inicio[s02b["id"]] = S["02"]["start"]
viejo_inicio[s06b["id"]] = S["06"]["start"]
cap_y = {}
for c in P["captions"]:
    cap_y.setdefault(c["sceneId"], c["y"])
cap_y[s02b["id"]] = cap_y[S["02"]["id"]]
cap_y[s06b["id"]] = cap_y[S["06"]["id"]]
plantilla = copy.deepcopy(P["captions"][0])
palabras_de = []
for s, narr in PLAN:
    n = len(narr.split())
    ws = W[i:i + n]
    assert [w["text"] for w in ws] == narr.split(), (narr, [w["text"] for w in ws])
    i += n
    s["narration"] = narr
    s["_w"] = ws
    palabras_de.append(ws)
assert i == len(W)
FIN = round(W[-1]["end"] + 1.3, 3)
for k, (s, _) in enumerate(PLAN):
    s["start"] = 0 if k == 0 else round(s["_w"][0]["start"] - 0.12, 4)
for k, (s, _) in enumerate(PLAN):
    fin = PLAN[k + 1][0]["start"] if k + 1 < len(PLAN) else FIN
    s["duration"] = round(fin - s["start"], 4)
    s["coreEnd"] = round(fin, 4)
    s["originalVisibleDuration"] = round(s["duration"] + 0.28, 4)
P["scenes"] = [s for s, _ in PLAN]
P["duration"] = FIN

# ---- subtítulos: cifras en número, bloques de hasta 3 palabras
NUM = [("tres punto nueve", "$3.9"), ("cuatro punto nueve", "$4.9"), ("dos o tres", "2 o 3"), ("diez por ciento", "10%"),
       ("ochenta por ciento", "80%"), ("dos mil veintiocho.", "2028."), ("cuatrocientos cincuenta mil", "$450 mil"),
       ("veinte", "20"), ("un nivel,", "1 nivel,")]


def cifras(ws):
    out, k = [], 0
    while k < len(ws):
        for hablado, visto in NUM:
            h = hablado.split()
            if [w["text"].lower() for w in ws[k:k + len(h)]] == h:
                out.append({"text": visto, "start": ws[k]["start"], "end": ws[k + len(h) - 1]["end"]})
                k += len(h)
                break
        else:
            out.append(dict(ws[k]))
            k += 1
    return out


caps = []
for s, _ in PLAN:
    grupo = []
    toks = cifras(s.pop("_w"))
    for t in toks:
        if grupo and (len(grupo) >= 3 or len(" ".join(x["text"] for x in grupo)) + len(t["text"]) > 22 or grupo[-1]["text"][-1] in ",.:?"):
            caps.append((s, grupo))
            grupo = []
        grupo.append(t)
    if grupo:
        caps.append((s, grupo))
P["captions"] = []
for k, (s, g) in enumerate(caps):
    c = copy.deepcopy(plantilla)
    sig = caps[k + 1][1][0]["start"] if k + 1 < len(caps) else FIN
    c.update(id=f"caption-{k:03d}", sceneId=s["id"], start=round(g[0]["start"], 4), end=round(min(sig, g[-1]["end"] + 0.45), 4),
             text=" ".join(x["text"] for x in g), words=[{"text": x["text"], "start": round(x["start"], 4), "end": round(x["end"], 4)} for x in g],
             y=cap_y[s["id"]])
    P["captions"].append(c)

# ---- audio: voz nueva, música a la nueva duración, SFX pegados a su escena
tracks = []
for t in P["audioTracks"]:
    if t["kind"] == "voice":
        t.update(assetId="voice-doctor-v7", duration=FIN, name="Voz · Doctor V7 (Jorge)")
    elif t["kind"] == "music":
        t["duration"] = FIN
    tracks.append(t)
for s, _ in PLAN:
    if s["id"] in (s02b["id"], s06b["id"]):
        for t in sfx_de.get(S[s["id"][-3:-1]]["id"], []):
            n = copy.deepcopy(t)
            n.update(id=t["id"] + "b", sceneId=s["id"])
            tracks.append(n)
for t in tracks:
    if t.get("sceneId"):
        t["start"] = round(t["start"] - viejo_inicio[t["sceneId"]] + next(s["start"] for s, _ in PLAN if s["id"] == t["sceneId"]), 4)
P["audioTracks"] = tracks
P["script"] = P["voiceScript"] = " ".join(TOK)
P["voiceStatus"] = "synced"
for k in ("voiceStale", "timingChanged"):
    P.pop(k, None)


def asset(id, tipo, nombre, w=None, h=None):
    a = {"id": id, "name": nombre, "type": tipo, "url": urls.get(id, f"assets/v7/{id}")}
    if w:
        a.update(width=w, height=h)
    if tipo == "image":
        a["thumbnail"] = a["url"]
    P["assets"] = [x for x in P["assets"] if x["id"] != id] + [a]


asset("voice-doctor-v7", "audio", "Voz Doctor V7 · es-MX-JorgeNeural")
asset("legacy-crest", "image", "Escudo Legacy Capital (sin fondo)", 300, 391)
asset("mapa-zona", "image", "Mapa de la zona (infografía de servicios)", 1034, 1110)
asset("fondo-crema", "image", "Fondo crema", 1080, 1920)


def txt(id, text, x, y, size, color=CREAM, anim="rise", start=0.1, width=864, align="left", font="LegacyDisplay", **kw):
    return dict(id=id, type="text", text=text, x=x, y=y, fontSize=size, color=color, animation=anim, start=start, width=width, align=align,
                fontFamily=font, lineHeight=1.02, opacity=1, enabled=True, **kw)


def rect(id, x, y, w, h, color=NAVY, anim="rise", start=0.1, **kw):
    return dict(id=id, type="rect", x=x, y=y, width=w, height=h, color=color, animation=anim, start=start, enabled=True, **kw)


# ---- apertura: «Doctor o médico» + pregunta; sin precio ni recámaras
fin_ap = S["02"]["start"] + S["02"]["duration"]
nuevos = []
for o in P["overlays"]:
    if o["id"] == "opening-role":
        o.update(text="DOCTOR O MÉDICO", duration=fin_ap)
    elif o["id"] == "opening-price":
        o.update(text="¿Buscas comprar casa\ncon vista al mar?", fontSize=70, color=CREAM, y=290, lineHeight=1.08, animation="rise", start=0.25, duration=fin_ap - 0.25)
    elif o["id"] == "opening-meta":
        continue
    elif o["id"] == "opening-rule":
        o.update(y=455, duration=fin_ap - o.get("start", 0))
    nuevos.append(o)
P["overlays"] = nuevos

# ---- invertir (toma nueva; imagen provisional hasta generar la definitiva)
s02b.update(title="02b · invertir para crecer tu patrimonio", headline="CRECE TU\nPATRIMONIO", layers=[
    txt("d02b-h0", "CRECE TU", 108, 200, 108), txt("d02b-h1", "PATRIMONIO", 108, 310, 108, GOLD, start=0.16),
    dict(id="d02b-rule", type="line", x=108, y=432, width=160, height=7, color=GOLD, animation="wipe", start=0.18, enabled=True)])
s02b["transition"] = {"type": "zoom", "duration": 0.28}

# ---- ubicación: infografía animada con lo que hay alrededor
s3 = S["03"]
s3.update(mediaId="fondo-crema", title="03 · Ubicación y alrededores", headline="EN LA ENTRADA\nDE ENSENADA")
s3["media"].update(motion="none", scale=1, panX=0, panY=0)
pills = [("Punta Morro", "2 min"), ("Soriana", "3 min"), ("CETYS · UABC", "3–5 min"), ("Hospitales", "7 min")]
L = [txt("d03-h0", "EL SAUZAL", 108, 196, 56, GOLD, shadow=False), txt("d03-h1", "EN LA ENTRADA DE ENSENADA", 108, 256, 66, NAVY, start=0.16, shadow=False),
     dict(id="d03-map", type="image", assetId="mapa-zona", x=250, y=350, width=580, animation="pop", start=0.2, animationDuration=0.5, enabled=True)]
for k, (a, b) in enumerate(pills):
    x, y, st = 60 + (k % 2) * 490, 1000 + (k // 2) * 98, 0.75 + k * 0.28
    L += [rect(f"d03-p{k}", x, y, 470, 80, NAVY, start=st, radius=40),
          txt(f"d03-p{k}a", a, x + 28, y + 23, 34, CREAM, start=st, width=300, font="LegacyBold", shadow=False),
          txt(f"d03-p{k}b", b, x + 442, y + 23, 34, GOLD, start=st, width=160, align="right", font="LegacyBold", shadow=False)]
s3["layers"] = L

# ---- precio en dos tomas
for s, a, b in ((S["06"], "DESDE", "$3.9 MDP"), (s06b, "HASTA", "$4.9 MDP")):
    s.update(title=f"{s['id'][-3:].strip('-')} · {a} {b}", headline=f"{a}\n{b}")
    s["layers"] = [txt(s["id"] + "-h0", a, 108, 200, 84), txt(s["id"] + "-h1", b, 108, 290, 150, GOLD, "pop", 0.2),
                   txt(s["id"] + "-h2", "MXN · CASAS DE 2 Y 3 RECÁMARAS", 108, 462, 40, CREAM, start=0.4, font="LegacyBold")]
s06b["transition"] = {"type": "wipe-left", "duration": 0.28}
s06b["media"].update(motion="push-in")

# ---- plusvalía: la línea se dibuja de abajo hacia arriba durante la toma
for l in S["18"]["layers"]:
    if l["type"] == "chart":
        l.update(values=[4, 7, 13, 24, 40, 64, 100], start=0.3, drawDuration=round(S["18"]["duration"] - 0.5, 2), strokeWidth=10)
S["18"]["layers"].append(txt("d18-nota", "Ilustrativo · no es rendimiento garantizado", 108, 760, 30, CREAM, start=0.5, font="LegacyBody"))

# ---- rentas: rendimiento esperado + sensación de dinero sumando
d19 = S["19"]["duration"]
S["19"]["layers"] += [
    rect("d19-card", 84, 500, 912, 330, "#1A2B4CE6", start=0.45, radius=28),
    txt("d19-a", "RENDIMIENTO ESPERADO · ESCENARIO CONSERVADOR", 120, 528, 31, CREAM, start=0.55, font="LegacyBold"),
    txt("d19-b", "18.33%", 120, 575, 150, GOLD, "pop", 0.6, animationDuration=0.6),
    txt("d19-c", "EN 2 AÑOS", 640, 640, 62, CREAM, start=1.1),
    txt("d19-d", "Plusvalía + rentas de estancia corta. Proyección, no garantizada.", 120, 758, 29, CREAM, start=1.2, font="LegacyBody"),
] + [txt(f"d19-m{k}", "+$", 760 + k * 70, 380 - k * 34, 58 + k * 10, GOLD, "rise", 0.9 + k * 0.3, width=200, animationDuration=0.5, duration=min(1.2, d19 - 1.0 - k * 0.3)) for k in range(3)]

# ---- ahorro: conteo, destello y pulso
s26 = S["26"]
dicho = next(c for c in P["captions"] if c["sceneId"] == s26["id"] and "$450" in c["text"])["start"] - s26["start"]
t0 = round(max(0.3, dicho - 0.25), 2)
base26 = [l for l in s26["layers"] if "number" not in l["id"]]
s26["layers"] = base26 + [
    dict(txt("d26-count", "", 108, 250, 170, GOLD, "pop", t0, animationDuration=1.0), type="counter", value=450000, prefix="$", duration=1.0),
    rect("d26-flash", 0, 0, 1080, 1920, "#E2C98F", "none", round(t0 + 1.0, 2), radius=0, opacity=0.5, duration=0.12),
    txt("d26-final", "$450,000", 108, 250, 170, "#E2C98F", "pulse", round(t0 + 1.0, 2), animationDuration=0.05, stroke=GOLD, strokeWidth=2),
    txt("d26-mxn", "MXN DE AHORRO", 108, 430, 54, CREAM, start=round(t0 + 1.1, 2), font="LegacyBold"),
]
for l in s26["layers"]:
    if l.get("text") == "EN EQUIPAMIENTO":
        l.update(y=500, start=round(t0 + 1.25, 2))
    if l.get("text") == "APARTA ESTE MES":
        l.update(y=590)
P["audioTracks"] += [dict(id="sfx-ahorro-golpe", name="Ahorro · impacto", kind="sfx", sceneId=s26["id"], assetId="sfx-quick-zoom-impact-772",
                          start=round(s26["start"] + t0 + 0.92, 3), offset=0, duration=1.2, volume=0.42, fadeIn=0.005, fadeOut=0.2, muted=False),
                     dict(id="sfx-ahorro-subida", name="Ahorro · subida", kind="sfx", sceneId=s26["id"], assetId="sfx-air-zoom-vacuum-2608",
                          start=round(s26["start"] + t0, 3), offset=0, duration=1.0, volume=0.2, fadeIn=0.05, fadeOut=0.1, muted=False)]

# ---- cierre: escudo sin fondo blanco
for n in ("27", "28"):
    lay = []
    for l in S[n]["layers"]:
        if l["type"] == "logo":
            lay += [dict(l, assetId="legacy-crest", x=440, y=130, width=200, height=261),
                    txt(f"d{n}-marca", "LEGACY CAPITAL", 540, 405, 64, CREAM, start=0.12, width=900, align="center"),
                    txt(f"d{n}-re", "REAL ESTATE", 540, 482, 28, GOLD, start=0.2, width=900, align="center", font="LegacyBold")]
        else:
            lay.append(l)
    S[n]["layers"] = lay
P["brand"]["logoAssetId"] = "legacy-crest"

P["title"] = "Doctor V7 · Legacy Capital"
P["version"] = "V7 · Cambios de Fran (15 nov)"
json.dump(P, open(out, "w"), ensure_ascii=False)
print(f"{out}: {len(P['scenes'])} escenas, {len(P['captions'])} subtítulos, {FIN} s")
print([c["text"] for c in P["captions"] if re.search(r"\d", c["text"])])
