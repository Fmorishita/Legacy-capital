# Empresario V10 · Legacy Capital · Punta Pacífico. = V9 con las 11 fotos de personas animadas con Seedance 2.5
# (Dreamina, 720p, clips de 4 s en assets/vid/, preparados con preparar_clips.py) y un cierre con el logotipo animado
# hecho en HyperFrames (toma LOGO) después de los 4 s de Fran.
# Antes: Empresario V9 · Genera index.html, layout.json y audio/eventos.json.
# V9 (Fran, 21 nov 2026): voz en off de Fran (Generated Audio 1:18 PM) con pausas cortas en la lista del equipamiento,
# «vista al mar» en el gancho, fotos que cuadran con el guion (brindis, dinero en la mesa, asador, familia con maletas),
# render real del baño (el de Doctor V13) y música más emotiva («Dreaming Big», Mixkit 31) editada para que el clímax
# entre en «Reserva este mes» y el piano final quede bajo el cierre.
# Edición estilo California v9 / Doctor V13: titulares en dos líneas (blanco + dorado), subtítulos palabra por palabra
# en píldora, entrada de cada toma con zoom y desenfoque, destellos, sacudidas en cifras, animaciones de mapa, pagos
# y promoción como en California. Tomas largas (una por frase) y equipamiento con una foto por cosa.
# Regla de Fran (21 nov 2026): ningún texto tapa caras ni lo más relevante de cada foto. Las zonas protegidas salen de
# faces.json (detección YuNet) y protect.json (objetos marcados a mano); los subtítulos y titulares se colocan solos
# donde no tapan nada y qa_textos.mjs lo comprueba en el navegador.
import json, math, random
from PIL import ImageFont

P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-empresario-v10-es/'
FONT = P + 'assets/fonts/'
fcond = lambda s: ImageFont.truetype(FONT + 'OpenSans_Condensed_Bold.ttf', s)
fxb = lambda s: ImageFont.truetype(FONT + 'OpenSans_ExtraBold.ttf', s)
fsb = lambda s: ImageFont.truetype(FONT + 'OpenSans_Semibold.ttf', s)
tw = lambda f, t, ls=0.0: f.getlength(t) + ls * f.size * len(t)

W = json.load(open(P + 'voz.words.json'))  # [texto, inicio, fin]: alineación forzada (alinear.py, MMS_FA) de la voz de Fran
VOFF = 0.0  # la alineación forzada ya da el inicio real de cada palabra
W = [[t, round(s_ + VOFF, 3), round(e_ + VOFF, 3)] for t, s_, e_ in W]
G = open(P + 'guion-voz.txt').read().split()
assert len(W) == len(G), (len(W), len(G))
VOZ_FIN = W[-1][2]
DUR = 57.6  # se recalcula abajo con el final de la música
low = lambda s: s.lower().strip('¿?¡!,.:;…')


def at(txt, after=0.0, nth=1):
    c = 0
    for t, s, e in W:
        if s >= after - 0.01 and low(t) == txt:
            c += 1
            if c == nth:
                return s
    raise KeyError(txt)


# ---------- música: «Dreaming Big» (Ahjay Stelino, Mixkit 31). Golpes medidos en la pista: entrada del ritmo 44.437 s,
# clímax 72.435 s y golpe final del clímax 97.007 s (después solo queda el piano del final).
# El clímax cae en el corte de «Reserva este mes»; en el corte al CTA se salta al golpe final (97.007 s), que tapa el
# empalme, para que el piano final quede bajo el cierre.
M_CLIMAX, M_CUT_A, M_CUT_B, M_END = 72.435, 84.207, 97.007, 105.6
T_DROP = round(at('conoce') - 0.06, 3)          # corte al mapa
T_CLIMAX = round(at('reserva') - 0.06, 3)       # corte a «Reserva este mes» = entra el clímax
MOFF = round(M_CLIMAX - T_CLIMAX, 3)            # segundo de la pista que suena en t=0
TS = round(at('haz') - 0.06, 3)                 # corte al CTA: aquí se salta al golpe final del clímax (97.007 s)
M_CUT_A = round(TS + MOFF, 3)                   # segundo de la pista que suena en el corte
T_STAB2, T_STAB3 = round(TS + (101.912 - M_CUT_B), 3), round(TS + (103.549 - M_CUT_B), 3)  # notas del piano final
DUR = round(TS + (M_END - M_CUT_B), 2)
T_LOGO = round(TS + 4.0, 3)   # termina el clip de 4 s de Fran y entra el cierre con el logotipo
BEAT = round(60 / 135.6, 4)
grid = lambda: [round(T_CLIMAX + BEAT * m, 3) for m in range(-90, 40)]


def cut(txt, after=0.0, nth=1):
    """Corte 0.06 s antes de la palabra; si un pulso de la música cae a menos de 0.12 s (y antes de la palabra), se corta en el pulso."""
    ws = at(txt, after, nth)
    c = round(ws - 0.06, 3)
    best = min(grid(), key=lambda b: abs(b - c))
    return best if (abs(best - c) <= 0.12 and ws - 0.25 <= best <= ws - 0.02) else c


# ---------- tomas
# id, inicio, imagen, (s0, s1, origen x%, origen y%), titular (l1, l2) o None, subtítulos sí/no
SH = [
    ('s01', 0.0, 'a-empresario', (1.04, 1.13, 50, 32), None, True),
    ('s02', cut('con'), 'n-brindis', (1.03, 1.11, 45, 48), ('UNA CASA', 'CON VISTA AL MAR'), True),
    ('s03', cut('y', 5.5), 'o-dinero', (1.02, 1.08, 55, 0), ('PARA DISFRUTAR', 'Y PARA INVERTIR'), False),  # sin subtítulos: no hay lugar sin tapar caras, tablet o dinero
    ('MAP', T_DROP),
    ('s04', cut('con', 12.5), 'd-fachada', (1.10, 1.02, 50, 45), ('CASAS DE UN NIVEL', 'CON ROOF PRIVADO'), True),
    ('s05', cut('desde'), 'i-roof-sofa', (1.02, 1.10, 50, 75), None, False),  # precios
    ('s06', cut('disfrútala'), 'e-asador', (1.03, 1.11, 50, 45), ('DISFRÚTALA', 'EN FAMILIA'), True),
    ('s07', cut('considera'), 'k-familia', (1.04, 1.12, 50, 0), ('RENTAS DE', 'CORTA ESTANCIA'), True),
    ('s08', cut('y', 26.0), 'm-asesoria', (1.11, 1.03, 50, 45), ('CUIDA TU', 'FLUJO DE CAPITAL'), True),
    ('PAY', cut('diez')),
    ('s09', T_CLIMAX, 'b-firma', (1.03, 1.10, 50, 70), ('RESERVA ESTE MES', 'EQUIPAMIENTO INCLUIDO'), True),
    ('e1', cut('como', 39), 'eq-closet', (1.00, 1.07, 50, 50), None, False),
    ('e2', cut('minisplits'), 'eq-minisplit', (1.00, 1.10, 90, 36), None, False),
    ('e3', cut('baños'), 'eq-bano', (1.08, 1.00, 48, 52), None, False),
    ('e4', cut('ruftop'), 'eq-roof', (1.00, 1.06, 50, 30), None, False),
    ('PRO', cut('con', 43.5)),
    ('s10', cut('construye'), 'c-roof-vino', (1.03, 1.11, 35, 45), ('CONSTRUYE PATRIMONIO', 'SIN DEJAR DE DISFRUTARLO'), True),
    ('s11', TS, 'h-fran-cta', (1.00, 1.06, 50, 35), None, False),
    ('LOGO', T_LOGO),
    ('END', DUR),
]
SC = []  # tomas con su fin
for i, sh in enumerate(SH[:-1]):
    nxt = SH[i + 1][1]
    if len(sh) == 2:
        SC.append({'id': sh[0], 'a': round(sh[1], 3), 'b': round(nxt, 3), 'mg': True})
    else:
        sid, a, img, kb, hl, cap = sh
        SC.append({'id': sid, 'a': round(a, 3), 'b': round(nxt, 3), 'img': img, 'kb': kb, 'hl': hl, 'cap': cap, 'mg': False})
SA = {s['id']: s for s in SC}
import os
VID = {s['id'] for s in SC if not s['mg'] and os.path.exists(P + f"assets/vid/{s['id']}.mp4")}

# ---------- zonas protegidas (caras + objetos) en coordenadas de la foto 1080x1920
FACES = json.load(open(P + 'faces.json'))
PROT = json.load(open(P + 'protect.json'))


def prot_boxes(img):
    out = []
    for x, y, w, h, *_ in FACES.get(img, {}).get('yunet', []):  # cara con margen: pelo arriba, barbilla abajo
        out.append(('cara', x - 0.3 * w, y - 0.35 * h, w * 1.6, h * 1.65))
    for x, y, w, h, name in PROT.get(img, {}).get('objects', []):
        out.append((name, x, y, w, h))
    return out


def kb_at(s, t):
    s0, s1, ox, oy = s['kb']
    u = min(1, max(0, (t - s['a']) / max(0.01, (s['b'] - s['a']))))
    return s0 + (s1 - s0) * u, ox / 100 * 1080, oy / 100 * 1920


def screen_box(s, box, t):
    """Caja de la foto vista en pantalla en el instante t (Ken Burns: escala con origen)."""
    sc, ox, oy = kb_at(s, t)
    _, x, y, w, h = box
    return (ox + (x - ox) * sc, oy + (y - oy) * sc, w * sc, h * sc)


def inter(a, b):
    ax, ay, aw, ah = a
    bx, by, bw, bh = b
    dx = min(ax + aw, bx + bw) - max(ax, bx)
    dy = min(ay + ah, by + bh) - max(ay, by)
    return max(0, dx) * max(0, dy)


def clash(s, rect, t0, t1, pad=10):
    """Área tapada (ponderada) de zonas protegidas por un rectángulo de texto entre t0 y t1."""
    r = (rect[0] - pad, rect[1] - pad, rect[2] + 2 * pad, rect[3] + 2 * pad)
    tot = 0
    for b in prot_boxes(s['img']):
        for t in (t0, (t0 + t1) / 2, t1):
            a = inter(r, screen_box(s, b, t))
            tot = max(tot, a * (10 if b[0] == 'cara' else 3))
    return tot


LOG = []
# ---------- titulares: se prueban textos, tamaños y alturas hasta que no tapan nada
HLOPT = {'s04': [('CASAS DE UN NIVEL', 'CON ROOF PRIVADO'), ('CASAS DE', 'UN NIVEL')],
         's06': [('DISFRÚTALA', 'EN FAMILIA'), ('DISFRÚTALA', 'EN FAMILIA', 1)],
         's07': [('RENTAS DE', 'CORTA ESTANCIA'), ('RENTAS DE', 'CORTA ESTANCIA', 1)],
         's10': [('CONSTRUYE PATRIMONIO', 'SIN DEJAR DE DISFRUTARLO'), ('CONSTRUYE', 'PATRIMONIO', 1)]}
HL = {}
for s in SC:
    if s['mg'] or not s['hl']:
        continue
    done = False
    for opt in HLOPT.get(s['id'], [s['hl']]):
        one = len(opt) > 2
        for size in (86, 80, 74):
            f = fcond(size)
            w = tw(f, opt[0] + ' ' + opt[1], 0.01) if one else max(tw(f, opt[0], 0.01), tw(f, opt[1], 0.01))
            if 80 + w > 1005:
                continue
            h = size * 1.12 * (1 if one else 2) + 24
            for top in (290, 300, 315, 330):
                rect = (80, top, w, h)
                if clash(s, rect, s['a'], s['b'], pad=14) == 0:
                    HL[s['id']] = {'size': size, 'rect': rect, 'l1': opt[0], 'l2': opt[1], 'one': one, 'top': top}
                    done = True
                    break
            if done:
                break
        if done:
            break
    if not done:
        LOG.append(f"titular de {s['id']} no cabe sin tapar: se quita")

# ---------- subtítulos: ortografía de pantalla y cifras
REP = {'ruf': 'roof', 'ruftop': 'rooftop', 'gárden': 'garden', 'légasi': 'Legacy', 'cápital': 'Capital'}
MERGE = [(['diez', 'por', 'ciento'], '10%'), (['ochenta', 'por', 'ciento'], '80%'), (['veinte'], '20'),
         (['tres', 'punto', 'nueve'], '$3.9'), (['cuatro', 'punto', 'nueve', 'millones'], '$4.9 millones'),
         (['cuatrocientos', 'cincuenta', 'mil'], '$450,000')]
toks = []
i = 0
while i < len(W):
    for seq, rep in MERGE:
        if [low(x[0]) for x in W[i:i + len(seq)]] == seq:
            tail = G[i + len(seq) - 1]
            toks.append([rep + (tail[-1] if tail[-1] in ',.:;?' else ''), W[i][1], W[i + len(seq) - 1][2]])
            i += len(seq)
            break
    else:
        g = G[i]
        core = low(g)
        if core in REP:
            g = g.replace(g.strip('¿?¡!,.:;…'), REP[core])
        g = g.replace('...', '').replace('…', '')
        toks.append([g, W[i][1], W[i][2]])
        i += 1


def capbox(words, top):
    f = fxb(60)
    w = sum(tw(f, x) for x in words) + 24 * len(words) + 36
    return (540 - w / 2, top, w, 81)


CAND = [1085, 1150, 1165, 1010, 940, 600, 680, 760, 520]
CAPS = []
for s in SC:
    if s['mg'] or not s['cap']:
        continue
    a, b = s['a'], s['b']
    st = at('te') - 0.06 if s['id'] == 's01' else a
    groups, cur = [], []
    for t in toks:
        if not (st - 0.06 <= t[1] < b - 0.06):
            continue
        if cur and (len(cur) >= 4 or len(' '.join(x[0] for x in cur)) + len(t[0]) > 20 or cur[-1][0][-1] in ',.:;?' or t[1] - cur[-1][2] > 0.35):
            groups.append(cur)
            cur = []
        cur.append(t)
    if cur:
        groups.append(cur)
    gl = []
    for k, g in enumerate(groups):
        gs = max(st, g[0][1] - 0.05)
        ge = min(b - 0.02, g[-1][2] + 0.5, (groups[k + 1][0][1] - 0.05) if k + 1 < len(groups) else 99)
        gl.append((g, gs, ge))
    # una sola altura por toma si se puede (que no salte), si no, por grupo
    over = [HL[s['id']]['rect']] if s['id'] in HL else []
    if s['id'] == 's01':
        over.append((60, 835, 960, 230))  # gancho
    if s['id'] == 's07' and 's07' in HL:
        r = HL['s07']['rect']
        over.append((60, r[1] + r[3] + 4, 960, 34))  # leyenda de renta bajo el titular
    def score(top, g, gs, ge):
        r = capbox([x[0] for x in g], top)
        if r[1] + r[3] > 1248 or r[0] < 65 or r[0] + r[2] > 1015:
            return 1e9
        return clash(s, r, gs, ge) + sum(inter(r, o) * 50 for o in over)
    best = min(CAND, key=lambda top: (sum(score(top, *x) for x in gl), CAND.index(top)))
    for g, gs, ge in gl:
        top = best
        if score(best, g, gs, ge) > 0:
            top = min(CAND, key=lambda tp: (score(tp, g, gs, ge), CAND.index(tp)))
            if score(top, g, gs, ge) > 0:
                LOG.append(f"subtítulo «{' '.join(x[0] for x in g)}» tapa algo en {s['id']} (score {score(top, g, gs, ge):.0f})")
        CAPS.append({'top': top, 's': round(gs, 3), 'end': round(ge, 3), 'w': [[x[0], round(x[1], 3)] for x in g], 'shot': s['id']})

# ---------- HTML
H = []
A = H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Empresario V10 — Legacy Capital</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"PPCondensed";src:url("assets/fonts/OpenSans_Condensed_Bold.ttf") format("truetype");}
@font-face{font-family:"PPText";src:url("assets/fonts/OpenSans_Semibold.ttf") format("truetype");}
@font-face{font-family:"PPBold";src:url("assets/fonts/OpenSans_ExtraBold.ttf") format("truetype");}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;font-style:italic;src:url("assets/fonts/cormorant-garamond-latin-600-italic.woff2") format("woff2");}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#071D29}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"PPText",sans-serif;color:#fff}
.clip{position:absolute;inset:0}
.bg{overflow:hidden}.bg .pz,.bg .kb{position:absolute;inset:0}.bg img{width:100%;height:100%;object-fit:cover;display:block}
.fbox{position:absolute;visibility:hidden;pointer-events:none}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.62) 0%,rgba(7,29,41,.3) 22%,rgba(7,29,41,0) 36%,rgba(7,29,41,0) 52%,rgba(7,29,41,.38) 100%)}
.shade.top{background:linear-gradient(180deg,rgba(7,29,41,.78) 0%,rgba(7,29,41,.5) 26%,rgba(7,29,41,.12) 40%,rgba(7,29,41,0) 50%,rgba(7,29,41,.35) 100%)}
.shade.none{background:linear-gradient(180deg,rgba(7,29,41,.35) 0%,rgba(7,29,41,0) 20%,rgba(7,29,41,0) 62%,rgba(7,29,41,.45) 100%)}
.hl{position:absolute;left:80px;top:290px;font-family:"PPCondensed",sans-serif;line-height:1.12;letter-spacing:.01em;text-shadow:0 3px 12px rgba(0,0,0,.55);white-space:nowrap}
.hl .l2{color:#FFD086}.hl span.l2{display:inline-block}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:16px;border-radius:4px}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 18px 8px;border-radius:20px;background:rgba(7,29,41,.55);text-align:center;font-family:"PPBold",sans-serif;font-size:60px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff;display:inline-block;margin:0 12px}
#captions{z-index:7}#logo{z-index:8;pointer-events:none}
#logo-in{position:absolute;left:0;right:0;top:1400px;display:flex;flex-direction:column;align-items:center;gap:6px}
#logo-in img{width:120px;height:auto;display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}#logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:38px;letter-spacing:.14em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 12px rgba(0,0,0,.6)}
#flash{position:absolute;inset:0;background:#FFF6E2;opacity:0;z-index:9;pointer-events:none}
#hook{position:absolute;left:70px;right:70px;top:845px;font-family:"PPCondensed";text-shadow:0 4px 14px rgba(0,0,0,.6)}
#hook .a{font-size:92px;line-height:1.05;white-space:nowrap}
#hook .b{font-size:96px;line-height:1.05;color:#FFD086;display:flex;align-items:center;gap:22px;margin-top:20px;white-space:nowrap}
#hook .ico{width:100px;height:100px;flex:none;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1C9,#E7B54A 55%,#A47611);border:5px solid #FFE7A8;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.4)}
.pr{position:absolute;left:80px;top:290px;text-shadow:0 4px 14px rgba(0,0,0,.6)}
.pr .d{font-family:"PPBold";font-size:40px;line-height:1.2;color:#FFD086;letter-spacing:.12em;margin-top:6px;margin-bottom:16px;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 14px rgba(0,0,0,.55)}
.pr .b{font-family:"PPCondensed";font-size:%PRS%px;line-height:1.18;white-space:nowrap;margin-bottom:22px}.pr .b small{font-size:64px;color:#FFD086;margin-left:16px;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 14px rgba(0,0,0,.55)}
.chk{position:absolute;height:92px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:42px;display:flex;align-items:center;padding:0 34px;box-shadow:0 10px 24px rgba(0,0,0,.4);white-space:nowrap}
.note{position:absolute;left:60px;right:60px;text-align:center;font-family:"PPText";font-size:25px;line-height:1.2;color:#F3E7CF;text-shadow:0 2px 6px rgba(0,0,0,.9)}
.mg{background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%);overflow:hidden}
.mg .eb{position:absolute;left:0;right:0;top:290px;text-align:center;font-family:"PPBold";font-size:32px;letter-spacing:.2em;color:#FFD086}
.mg .tt{position:absolute;left:30px;right:30px;top:352px;text-align:center;font-family:"PPCondensed";line-height:1.05;white-space:nowrap}
.mg .ru{position:absolute;left:465px;width:150px;height:8px;border-radius:4px;background:#FFD086}
.grid{position:absolute;inset:-100px;background-image:linear-gradient(rgba(255,208,134,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(255,208,134,.06) 2px,transparent 2px);background-size:90px 90px}
#mapw{position:absolute;left:90px;top:490px;width:900px;height:731px;border-radius:30px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.5);border:4px solid #FFD086}
#mapw img{width:100%;height:100%;display:block}
#ring{position:absolute;width:92px;height:92px;border-radius:50%;border:9px solid #FFD086}
#pbar{position:absolute;left:65px;right:65px;top:520px;height:110px;border-radius:24px;background:rgba(255,255,255,.08);border:3px solid rgba(255,208,134,.5);overflow:hidden;display:flex}
#pbar div{height:100%}
#pb1{width:10%;background:#FFD086}#pb2{width:10%;background:repeating-linear-gradient(90deg,#E7B54A 0 4px,#C99A2E 4px 8.5px)}#pb3{width:80%;background:linear-gradient(90deg,#2F6E9A,#1D4E74)}
.pcard{position:absolute;left:65px;right:65px;height:165px;border-radius:30px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 34px;box-shadow:0 12px 30px rgba(0,0,0,.4)}
.pcard .n{width:250px;font-family:"PPCondensed";font-size:120px;line-height:1;color:#0E2A4A}
.pcard .tx{flex:1}.pcard .t{font-family:"PPBold";font-size:44px;line-height:1.1}.pcard .s{font-size:30px;line-height:1.3;color:#8A620C;font-family:"PPBold"}
.dots{display:flex;gap:7px;margin-top:8px}.dots i{display:block;width:22px;height:22px;border-radius:50%;background:#E8DDC6}
.thumb{position:absolute;width:440px;height:225px;border-radius:26px;overflow:hidden;border:4px solid #FFD086;box-shadow:0 12px 30px rgba(0,0,0,.5)}
.thumb img{width:100%;height:100%;object-fit:cover;display:block}
.thumb span{position:absolute;left:12px;bottom:12px;height:52px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:28px;display:flex;align-items:center;padding:0 20px;white-space:nowrap}
#promo{position:absolute;left:65px;right:65px;top:836px;height:410px;border-radius:40px;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(23,63,102,.96) 0%,rgba(7,29,41,.96) 80%);border:4px solid #FFD086;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.55)}
#rays{position:absolute;left:-560px;top:-760px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.15) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)}
#promo .a{position:absolute;left:0;right:0;top:12px;line-height:1.1;text-align:center;font-family:"PPCondensed";font-size:54px;letter-spacing:.08em;color:#FFD086}
#pn{position:absolute;left:0;right:0;top:104px;text-align:center;font-family:"PPCondensed";font-size:132px;line-height:1;text-shadow:0 0 30px rgba(255,208,134,.85),0 0 80px rgba(255,208,134,.4);white-space:nowrap}
#pn small{font-size:64px;color:#FFD086;margin-left:14px}
#promo .c{position:absolute;left:0;right:0;top:266px;line-height:1.1;text-align:center;font-family:"PPBold";font-size:40px}
#promo .d{position:absolute;left:0;right:0;top:322px;text-align:center}#promo .d span{display:inline-block;background:#FFD086;color:#071D29;border-radius:999px;padding:6px 32px;font-family:"PPBold";font-size:34px}
#promo .e{position:absolute;left:0;right:0;top:380px;text-align:center;font-family:"PPText";font-size:22px;color:#E9DCC0}
.pt{position:absolute;left:470px;top:150px;width:16px;height:16px;border-radius:50%;background:#FFD086;opacity:0}
#cta-t{position:absolute;left:0;right:0;top:975px;text-align:center;font-family:"PPCondensed";font-size:84px;line-height:1;text-shadow:0 4px 14px rgba(0,0,0,.65)}#cta-t span{color:#FFD086}
#cta{position:absolute;left:110px;right:110px;top:1078px;height:104px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 12px 30px rgba(0,0,0,.45)}
#cta-wa{position:absolute;left:50%;transform:translateX(-50%);top:1192px;padding:2px 22px 4px;border-radius:999px;background:rgba(7,29,41,.62);text-align:center;font-family:"PPBold";font-size:36px;white-space:nowrap;text-shadow:0 2px 8px rgba(0,0,0,.85)}#cta-wa span{color:#FFD086}
.glint{position:absolute;width:60px;height:60px;margin:-30px 0 0 -30px;border-radius:50%;background:radial-gradient(circle,#fff 0%,rgba(255,244,214,.9) 28%,rgba(255,208,134,0) 70%);opacity:0}
.vbg{width:1080px;height:1920px;object-fit:cover}
.halo{position:absolute;border-radius:24px;border:6px solid #FFD086;box-shadow:0 0 24px rgba(255,208,134,.8);opacity:0}
#endc .glow{position:absolute;left:140px;top:240px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(255,208,134,.38) 0%,rgba(255,208,134,.1) 45%,rgba(255,208,134,0) 70%)}
#endc .rays{position:absolute;left:-460px;top:-360px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.10) 0deg 6deg,rgba(255,208,134,0) 6deg 18deg)}
#e-ring{position:absolute;left:330px;top:390px;width:420px;height:420px;border-radius:50%;border:6px solid #FFD086;box-shadow:0 0 30px rgba(255,208,134,.7)}
#e-crest{position:absolute;left:390px;top:420px;width:300px;height:auto;filter:drop-shadow(0 10px 30px rgba(0,0,0,.6))}
#e-sweep{position:absolute;left:390px;top:420px;width:300px;height:360px;overflow:hidden;-webkit-mask:url(assets/crest.png) center/contain no-repeat;mask:url(assets/crest.png) center/contain no-repeat}
#e-sweep i{position:absolute;top:-40px;left:-160px;width:110px;height:460px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0));transform:rotate(18deg)}
#e-name{position:absolute;left:0;right:0;top:830px;text-align:center;font-family:"Cinzel",serif;font-weight:700;font-size:84px;letter-spacing:.12em;white-space:nowrap;color:#fff;text-shadow:0 4px 18px rgba(0,0,0,.6)}
#e-name span{display:inline-block}
#e-re{position:absolute;left:0;right:0;top:944px;text-align:center;font-family:"PPBold";font-size:32px;letter-spacing:.5em;color:#FFD086}
#e-rule{position:absolute;left:440px;top:1000px;width:200px;height:6px;border-radius:3px;background:#FFD086}
#e-tag{position:absolute;left:0;right:0;top:1022px;text-align:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:46px;color:#F3E7CF}
#e-cta{position:absolute;left:150px;right:150px;top:1104px;height:84px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:36px;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 12px 30px rgba(0,0,0,.45)}
#e-wa{position:absolute;left:0;right:0;top:1200px;text-align:center;font-family:"PPBold";font-size:34px;color:#fff;text-shadow:0 2px 8px rgba(0,0,0,.8)}#e-wa span{color:#FFD086}
.ept{position:absolute;left:532px;top:592px;width:14px;height:14px;border-radius:50%;background:#FFD086;opacity:0}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
''')
PRS = 140
fpr = fcond(PRS)
while 80 + tw(fpr, '$4,900,000') + 16 + tw(fcond(64), 'MXN') > 1005:
    PRS -= 4
    fpr = fcond(PRS)
H[0] = H[0].replace('%DUR%', str(DUR)).replace('%PRS%', str(PRS))
BRIEF = '<svg width="58" height="50" viewBox="0 0 58 50" fill="none" stroke="#6B4A08" stroke-width="5" stroke-linejoin="round"><rect x="4" y="13" width="50" height="33" rx="6"/><path d="M20 13V7a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v6M4 27h50"/></svg>'
z = 0
for s in SC:
    z += 1
    sid, a, b = s['id'], s['a'], s['b']
    if s['mg']:
        continue
    img = s['img']
    sh_cls = 'shade top' if sid in ('s05', 's11') else ('shade' if sid in HL else 'shade none')
    marks = ''.join(f'<div class="fbox" data-kind="{"cara" if n == "cara" else "obj"}" data-name="{n}" style="left:{x:.0f}px;top:{y:.0f}px;width:{w:.0f}px;height:{h:.0f}px"></div>' for n, x, y, w, h in prot_boxes(img))
    if sid in VID:  # clip de Seedance 2.5 (sin audio) detrás de la capa de la toma
        A(f'<video id="{sid}-v" class="clip vbg" src="assets/vid/{sid}.mp4" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="1" muted playsinline></video>')
    pic = '' if sid in VID else f'<img src="assets/img/{img}.jpg" alt="" />'
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="0"><div class="pz"><div class="kb" data-layout-allow-overflow>{pic}{marks}</div></div><div class="{sh_cls}"></div>')
    if sid in HL:
        hh = HL[sid]
        if hh['one']:
            A(f'<div class="hl" id="{sid}-hl" style="font-size:{hh["size"]}px;top:{hh["top"]}px"><div class="l1">{hh["l1"]} <span class="l2">{hh["l2"]}</span></div><div class="rule"></div></div>')
        else:
            A(f'<div class="hl" id="{sid}-hl" style="font-size:{hh["size"]}px;top:{hh["top"]}px"><div class="l1">{hh["l1"]}</div><div class="l2">{hh["l2"]}</div><div class="rule"></div></div>')
    if sid == 's01':
        A(f'<div id="hook"><div class="a">DUEÑO O DIRECTOR</div><div class="b"><span class="ico" id="ico">{BRIEF}</span><span>DE EMPRESA</span></div></div>')
    if sid == 's05':
        A(f'<div class="pr" id="pr"><div class="d" id="prd1">DESDE</div><div class="b" id="prb1"><span id="pn1">$3,900,000</span><small>MXN</small></div>'
          f'<div class="d" id="prd2">HASTA</div><div class="b" id="prb2"><span id="pn2">$4,900,000</span><small>MXN</small></div></div>')
    if sid == 's07':
        ny = (HL['s07']['rect'][1] + HL['s07']['rect'][3] + 6) if 's07' in HL else 1204
        A(f'<div class="note" id="n07" style="top:{ny:.0f}px;left:80px;right:auto;text-align:left;font-size:24px">Escenario ilustrativo; ingresos no garantizados.</div>')
    if sid in ('e1', 'e2', 'e3', 'e4'):
        CH = [('k1', 'Clósets', 80, 288), ('k2', 'Minisplits', 420, 288), ('k3', 'Baños', 80, 392), ('k4', 'Rooftop', 360, 392)]
        n = int(sid[1])
        A(''.join(f'<div class="chk" id="{sid}-{k}" style="left:{x}px;top:{y}px">✓ {t}</div>' for k, t, x, y in CH[:n]))
        if sid == 'e2':
            A('<div class="halo" id="halo" style="left:846px;top:640px;width:200px;height:112px"></div>')
    if sid == 's11':
        A('<div id="cta-t">CONOCE <span>MÁS</span></div><div id="cta"><span>Haz clic en el botón de abajo</span><span id="arw">↓</span></div><div id="cta-wa">WhatsApp <span>+52 646 256 3006</span></div>'
          '<div class="glint" id="glint" style="left:540px;top:318px"></div>')
    A('</div>')
# ---------- mapa
ma, mb = SA['MAP']['a'], SA['MAP']['b']
MT = 'ENSENADA, <span style="color:#FFD086">BAJA CALIFORNIA</span>'
mts = 96
while tw(fcond(mts), 'ENSENADA, BAJA CALIFORNIA') > 900:
    mts -= 2
RX, RY = 90 + 0.374 * 900, 490 + 0.733 * 731
A(f'<div id="mapa" class="clip mg" data-start="{ma}" data-duration="{round(mb - ma, 3)}" data-track-index="0"><div class="grid" id="mgrid" data-layout-allow-overflow></div>'
  f'<div class="eb" id="m-eb">NUEVO DESARROLLO RESIDENCIAL</div><div class="tt" id="m-tt" style="font-size:{mts}px">{MT}</div><div class="ru" id="m-ru" style="top:{352 + mts * 1.05 + 14:.0f}px"></div>'
  f'<div id="mapw"><img id="mapi" src="assets/img/mapa.png" alt="" /></div><div id="ring" style="left:{RX - 46:.0f}px;top:{RY - 46:.0f}px"></div></div>')
# ---------- pagos (ejemplo con casa de $3,900,000 MXN)
pa, pb = SA['PAY']['a'], SA['PAY']['b']
A(f'<div id="pagos" class="clip mg" data-start="{pa}" data-duration="{round(pb - pa, 3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="p-eb">ESQUEMA DE PAGO FLEXIBLE</div><div class="tt" id="p-tt" style="font-size:96px">TU PLAN <span style="color:#FFD086">DE PAGOS</span></div><div class="ru" id="p-ru" style="top:467px"></div>')
A('<div id="pbar"><div id="pb1"></div><div id="pb2"></div><div id="pb3"></div></div>')
A('<div class="pcard" id="pc-a" style="top:672px"><div class="n" id="pna">10%</div><div class="tx"><div class="t">de enganche</div><div class="s">A la firma · ej.: $390,000 MXN*</div></div></div>')
A('<div class="pcard" id="pc-b" style="top:852px"><div class="n" id="pnb">10%</div><div class="tx"><div class="t">en 20 mensualidades</div><div class="s">ej.: 20 × $19,500 MXN*</div><div class="dots">' + ''.join(f'<i id="d{i}"></i>' for i in range(20)) + '</div></div></div>')
A('<div class="pcard" id="pc-c" style="top:1032px"><div class="n" id="pnc">80%</div><div class="tx"><div class="t">contra entrega</div><div class="s">Al recibir tu casa</div></div></div>')
A('<div class="note" id="p-note" style="top:1212px;font-size:24px">*Ejemplo con una casa de $3,900,000 MXN.</div></div>')
# ---------- promoción: una foto de cada cosa + valor del equipamiento
qa_, qb_ = SA['PRO']['a'], SA['PRO']['b']
TH = [('eq-closet', 'Clósets', 90, 340, '50% 45%'), ('eq-minisplit', 'Minisplits', 550, 340, '78% 36%'), ('eq-bano', 'Baños', 90, 590, '48% 50%'), ('eq-roof', 'Rooftop', 550, 590, '50% 42%')]
A(f'<div id="promo-sc" class="clip mg" data-start="{qa_}" data-duration="{round(qb_ - qa_, 3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="q-eb">RESERVA ESTE MES</div>')
for k, (img, lb, x, y, pos) in enumerate(TH):
    A(f'<div class="thumb" id="th{k}" style="left:{x}px;top:{y}px"><img src="assets/img/{img}.jpg" alt="" style="object-position:{pos}" /><span>✓ {lb}</span></div>')
A('<div id="promo"><div id="rays"></div><div class="a" id="pa">VALOR DE HASTA</div><div id="pn"><span id="pnv">$0</span><small>MXN</small></div>'
  + ''.join(f'<div class="pt" id="pt{i}"></div>' for i in range(24))
  + '<div class="c" id="pcx">EN EQUIPAMIENTO</div><div class="d" id="pd"><span>Al reservar tu casa este mes</span></div><div class="e" id="pe">Aplican términos, condiciones y vigencia de la promoción.</div></div></div>')
# ---------- cierre con el logotipo (HyperFrames, sin IA)
la_, lb_ = SA['LOGO']['a'], SA['LOGO']['b']
NAME = 'LEGACY CAPITAL'
A(f'<div id="endc" class="clip mg" data-start="{la_}" data-duration="{round(lb_ - la_, 3)}" data-track-index="0"><div class="rays" id="e-rays" data-layout-allow-overflow></div><div class="grid" data-layout-allow-overflow></div><div class="glow" id="e-glow"></div>'
  f'<div id="e-ring"></div><img id="e-crest" src="assets/crest.png" alt="Legacy Capital" /><div id="e-sweep"><i id="e-sw"></i></div>'
  + ''.join(f'<div class="ept" id="ept{i}"></div>' for i in range(20))
  + '<div id="e-name">' + ''.join(f'<span id="en{i}">{c if c != " " else "&nbsp;"}</span>' for i, c in enumerate(NAME)) + '</div>'
  + '<div id="e-re">REAL ESTATE</div><div id="e-rule"></div><div id="e-tag">Building wealth for generations</div>'
  + '<div id="e-cta"><span>Haz clic en el botón de abajo</span><span id="e-arw">↓</span></div><div id="e-wa">WhatsApp <span>+52 646 256 3006</span></div></div>')
# ---------- capas globales
A(f'<div id="logo" class="clip" data-start="0" data-duration="{DUR}" data-track-index="4"><div id="logo-in"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
A(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
A(f'<div id="fx" class="clip" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="flash"></div></div>')
for k, t in (('leak-a', round(SA['s04']['a'] - 0.2, 2)), ('leak-b', round(SA['s11']['a'] - 0.4, 2))):
    A(f'<div id="{k}" class="clip" data-composition-id="{k}" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="{t}" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>')
A(f'<audio id="mezcla" src="assets/mezcla.wav" data-start="0" data-duration="{DUR}" data-track-index="8" data-volume="1"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
A('const CAPS=' + json.dumps(CAPS, ensure_ascii=False) + ';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);});
host.appendChild(line);const st=g.s;tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.8},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t],wi)=>{const id="#cap-"+gi+"-"+wi;tl.to(id,{color:"#FFD086",scale:1.05,duration:0.07,ease:"power2.out"},Math.max(st,t-0.04));const nx=g.w[wi+1];if(nx)tl.to(id,{color:"#ffffff",scale:1,duration:0.07,ease:"none"},nx[1]-0.04);});
tl.set(line,{opacity:0},g.end);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.4},Object.assign({opacity:1,scale:1,duration:0.26,ease:"back.out(2.6)"},o||{}),t);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:50},Object.assign({opacity:1,y:0,duration:0.26,ease:"power3.out"},o||{}),t);
const fade=(s,t,d)=>tl.fromTo(s,{opacity:0},{opacity:1,duration:d||0.25,ease:"none"},t);
const fl=(t,o)=>tl.fromTo("#flash",{opacity:o||0.7},{opacity:0,duration:0.28,ease:"power2.out",immediateRender:false},t);
const shake=(s,t,k)=>{k=k||1;tl.fromTo(s,{x:0,y:0},{keyframes:[{x:-14*k,y:9*k},{x:12*k,y:-10*k},{x:-8*k,y:6*k},{x:6*k,y:-3*k},{x:0,y:0}],duration:0.32,ease:"none",immediateRender:false},t);};
const cnt=(sel,t0,t1,to,fmt)=>{const o={v:0};tl.fromTo(o,{v:0},{v:to,duration:Math.max(0.2,t1-t0),ease:"power2.out",onUpdate:()=>{document.querySelector(sel).textContent=fmt(o.v);}},t0);tl.set(sel,{textContent:fmt(to)},t1+0.01);};
const money=v=>"$"+(Math.round(v/1000)*1000).toLocaleString("en-US");
tl.set("#flash",{opacity:0},0);''')
# Ken Burns y entradas
for s in SC:
    if s['mg']:
        continue
    sid, a, b = s['id'], s['a'], s['b']
    s0, s1, ox, oy = s['kb']
    A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},transformOrigin:"{ox}% {oy}%"}},{{scale:{s1},duration:{round(b - a, 3)},ease:"none"}},{a});')
    if a > 0:
        A(f'tl.fromTo("#{sid} .pz",{{scale:1.14,filter:"blur(6px)"}},{{scale:1,filter:"blur(0px)",duration:0.3,ease:"power3.out"}},{a});')
    if sid in HL:
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,y:40,scale:1.2}},{{opacity:1,y:0,scale:1,duration:0.24,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(a + 0.18, 3)});'
          f'tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-60}},{{opacity:1,x:0,duration:0.24,ease:"power3.out"}},{round(a + 0.29, 3)});'
          f'tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25}},{round(a + 0.38, 3)});')
# logo abajo al centro (como California v9); se oculta en las tomas donde taparía una cara u objeto protegido
LOGO = (311, 1400, 458, 178)
hid = [x for x in SC if not x['mg'] and x['id'] != 's11' and clash(x, LOGO, x['a'], x['b'], pad=8) > 0]
for x in hid:
    prev_h = any(y['b'] == x['a'] for y in hid)
    next_h = any(y['a'] == x['b'] for y in hid)
    if not prev_h:
        A(f'tl.to("#logo-in",{{opacity:0,duration:0.14,ease:"power1.out"}},{round(x["a"] - 0.22, 3)});')  # ya invisible al entrar la toma
    if not next_h:
        A(f'tl.to("#logo-in",{{opacity:1,duration:0.25,ease:"power1.out"}},{round(x["b"], 3)});')
LOG.append('logo oculto en: ' + ', '.join(x['id'] for x in hid))
# destellos en cortes clave (el del mapa cae con el golpe del coro de la música)
FLASH = [SA['MAP']['a'], SA['s05']['a'], SA['PAY']['a'], SA['s09']['a'], SA['PRO']['a'], SA['s10']['a'], SA['s11']['a'], SA['LOGO']['a']]
for t in FLASH:
    A(f'fl({t},0.55);')
# gancho
td, tde = at('dueño'), at('de', 0.9)
A(f'''tl.fromTo("#hook .a",{{opacity:0,scale:1.4,filter:"blur(12px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.32,ease:"power4.out",transformOrigin:"0 50%"}},{round(td - 0.05, 3)});
tl.fromTo("#hook .b",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.26,ease:"back.out(2)"}},{round(tde - 0.04, 3)});
tl.fromTo("#ico",{{rotationY:0,scale:0.3}},{{rotationY:720,scale:1,duration:0.6,ease:"power3.out"}},{round(tde - 0.04, 3)});
tl.to("#ico",{{scale:1.12,duration:0.18,yoyo:true,repeat:3,ease:"sine.inOut"}},{round(tde + 0.7, 3)});
tl.fromTo("#logo-in",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.4,ease:"power2.out"}},0.3);''')
# mapa
A(f'''tl.fromTo("#m-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{ma + 0.05});tl.fromTo("#m-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{ma + 0.1});tl.fromTo("#m-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{ma + 0.3});
tl.fromTo("#mgrid",{{y:0}},{{y:90,duration:{round(mb - ma, 2)},ease:"none"}},{ma});
tl.fromTo("#mapw",{{clipPath:"circle(0% at 37.4% 73.3%)"}},{{clipPath:"circle(140% at 37.4% 73.3%)",duration:0.6,ease:"power3.out"}},{ma + 0.35});
tl.fromTo("#mapi",{{scale:1.5,transformOrigin:"37.4% 73.3%"}},{{scale:1,duration:2.2,ease:"power2.out"}},{ma + 0.35});
tl.to("#mapi",{{scale:1.18,duration:{round(mb - ma - 2.6, 2)},ease:"sine.inOut"}},{ma + 2.55});
[0,1,2,3,4].forEach(i=>tl.fromTo("#ring",{{scale:0.3,opacity:1}},{{scale:2.6,opacity:0,duration:0.5,ease:"power1.out",immediateRender:i===0}},{ma + 0.5}+i*0.6));''')
# precios (el conteo termina cuando la voz dice la cifra)
t39, t49, tmil = at('nueve'), at('nueve', 0, 2), at('millones')
pa5 = SA['s05']['a']
A(f'''up("#prd1",{pa5 + 0.1});tl.fromTo("#prb1",{{opacity:0,scale:0.5}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(at('tres') - 0.1, 2)});
cnt("#pn1",{round(at('tres') - 0.1, 2)},{t39},3900000,money);tl.fromTo("#prb1",{{scale:1.22}},{{scale:1,duration:0.35,ease:"elastic.out(1,0.5)",immediateRender:false}},{t39});shake("#s05 .pz",{t39});fl({t39},0.35);
up("#prd2",{round(at('hasta') - 0.05, 2)});tl.fromTo("#prb2",{{opacity:0,scale:0.5}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(at('cuatro') - 0.1, 2)});
cnt("#pn2",{round(at('cuatro') - 0.1, 2)},{t49},4900000,money);tl.fromTo("#prb2",{{scale:1.22}},{{scale:1,duration:0.35,ease:"elastic.out(1,0.5)",immediateRender:false}},{t49});shake("#s05 .pz",{t49});fl({t49},0.35);
tl.to("#prb1 small,#prb2 small",{{scale:1.25,duration:0.16,yoyo:true,repeat:1,transformOrigin:"0 60%"}},{tmil});''')
# leyenda de renta
A(f'fade("#n07",{round(at("considera") + 0.3, 2)},0.3);')
# pagos
t10, t10b, t20, t80 = at('diez'), at('diez', 0, 2), at('veinte'), at('ochenta')
A(f'''tl.fromTo("#p-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{pa + 0.05});tl.fromTo("#p-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{pa + 0.12});tl.fromTo("#p-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{pa + 0.32});
tl.fromTo("#pbar",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.3}},{round(pa + 0.2, 2)});
tl.fromTo("#pb1",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.3,ease:"power3.out"}},{t10});
tl.fromTo("#pb2",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:1.0,ease:"none"}},{t20});
tl.fromTo("#pb3",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.5,ease:"power3.out"}},{t80});
pop("#pc-a",{t10});pop("#pc-b",{t10b});pop("#pc-c",{t80});
for(let i=0;i<20;i++)tl.to("#d"+i,{{background:"#C99A2E",scale:1.25,duration:0.05}},{t20}+i*0.05);
tl.fromTo("#p-note",{{opacity:0}},{{opacity:1,duration:0.3}},{round(t10 + 0.4, 2)});
const pct=(sel,t,to)=>{{const o={{v:0}};tl.fromTo(o,{{v:0}},{{v:to,duration:0.4,ease:"power2.out",onUpdate:()=>{{document.querySelector(sel).textContent=Math.round(o.v)+"%";}}}},t);tl.set(sel,{{textContent:to+"%"}},t+0.42);}};
pct("#pna",{t10},10);pct("#pnb",{t10b},10);pct("#pnc",{t80},80);shake("#pc-c",{round(t80 + 0.42, 2)});fl({round(t80 + 0.42, 2)},0.25);''')
# equipamiento: una foto por cosa, los ✓ se acumulan
A(f'''pop("#e1-k1",{at('clósets') - 0.03},{{transformOrigin:"0 50%"}});
tl.set("#e2-k1",{{opacity:1}},{SA['e2']['a']});pop("#e2-k2",{at('minisplits') - 0.03},{{transformOrigin:"0 50%"}});
tl.fromTo("#halo",{{opacity:0,scale:1.4}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)"}},{round(at('minisplits') + 0.05, 3)});tl.to("#halo",{{opacity:0,duration:0.2}},{round(SA['e2']['b'] - 0.15, 3)});
tl.set("#e3-k1,#e3-k2",{{opacity:1}},{SA['e3']['a']});pop("#e3-k3",{at('baños') - 0.03},{{transformOrigin:"0 50%"}});
tl.set("#e4-k1,#e4-k2,#e4-k3",{{opacity:1}},{SA['e4']['a']});pop("#e4-k4",{at('ruftop') - 0.03},{{transformOrigin:"0 50%"}});''')
# promoción $450,000 MXN
random.seed(7)
pts = []
for i in range(24):
    ang = i / 24 * 2 * math.pi + random.uniform(-.1, .1)
    r = random.uniform(300, 520)
    pts.append((round(math.cos(ang) * r), round(math.sin(ang) * r * 0.7), round(random.uniform(0.6, 1.6), 2)))
A('const PTS=' + json.dumps(pts) + ';')
TV, T450 = at('valor'), at('mil', 43)
A(f'''tl.fromTo("#q-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{qa_ + 0.05});
[0,1,2,3].forEach(i=>tl.fromTo("#th"+i,{{opacity:0,scale:0.6,y:30}},{{opacity:1,scale:1,y:0,duration:0.3,ease:"back.out(2)"}},{qa_ + 0.05}+i*0.08));
tl.fromTo("#promo",{{opacity:0,scale:0.6}},{{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"}},{round(TV - 0.2, 3)});
tl.fromTo("#rays",{{rotation:0}},{{rotation:60,duration:{round(qb_ - TV + 0.2, 2)},ease:"none"}},{round(TV - 0.2, 3)});
tl.fromTo("#pa",{{opacity:0,y:-30}},{{opacity:1,y:0,duration:0.25}},{round(TV - 0.1, 3)});
const pv={{v:0}};tl.fromTo(pv,{{v:0}},{{v:450000,duration:{round(T450 - TV, 2)},ease:"power2.in",onUpdate:()=>{{document.getElementById("pnv").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}}}},{TV});
tl.set("#pnv",{{textContent:"$450,000"}},{T450});tl.fromTo("#pn",{{scale:1.5}},{{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false}},{T450});
fl({T450},0.75);shake("#promo",{T450});shake("#promo-sc .thumb",{T450},0.6);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{{x:0,y:0,scale:s,opacity:1}},{{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false}},{T450}));
tl.set(".pt",{{opacity:0}},0);up("#pcx",{T450 + 0.2});pop("#pd",{T450 + 0.45});fade("#pe",{T450 + 0.6});tl.to("#pn",{{scale:1.07,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"}},{T450 + 0.5});''')
# CTA
tc = SA['s11']['a']
tb, tleg, tcap = at('botón'), at('légasi'), at('cápital')
NREP = int((DUR - tb - 0.6) / 0.36) // 2 * 2 + 1
A(f'''tl.to("#logo-in",{{opacity:0,duration:0.15,ease:"power1.in"}},{round(tc - 0.15, 3)});tl.set("#logo-in",{{y:-1165,scale:0.55}},{round(tc + 0.01, 3)});tl.to("#logo-in",{{opacity:1,duration:0.3,ease:"power1.out"}},{round(tc + 0.05, 3)});
tl.fromTo("#cta-t",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{round(tc + 0.15, 3)});
pop("#cta",{round(tb - 0.1, 3)});tl.fromTo("#cta-wa",{{opacity:0}},{{opacity:1,duration:0.3}},{round(at('conocer') - 0.1, 3)});
tl.to("#cta",{{scale:1.07,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:{NREP}}},{round(tb + 0.3, 3)});tl.fromTo("#arw",{{y:-6}},{{y:10,duration:0.36,yoyo:true,repeat:{NREP},ease:"power1.inOut"}},{round(tb + 0.3, 3)});
tl.to("#logo-in",{{opacity:0,duration:0.15,ease:"power1.in"}},{round(T_LOGO - 0.16, 3)});''')
# cierre: escudo con destello, anillo, partículas, nombre letra por letra, botón y WhatsApp; golpes del piano final
import math as _m
EPT = [(round(_m.cos(i / 20 * 2 * _m.pi) * (260 + 60 * (i % 3))), round(_m.sin(i / 20 * 2 * _m.pi) * (260 + 60 * (i % 3)))) for i in range(20)]
L0 = T_LOGO
A(f'''tl.fromTo("#e-rays",{{rotation:0,opacity:0}},{{rotation:30,opacity:1,duration:{round(DUR - L0, 2)},ease:"none"}},{L0});
tl.fromTo("#e-glow",{{opacity:0,scale:0.6}},{{opacity:1,scale:1,duration:0.6,ease:"power2.out"}},{L0});
tl.fromTo("#e-crest",{{opacity:0,scale:2.2,filter:"blur(14px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.55,ease:"power4.out",transformOrigin:"50% 50%"}},{L0 + 0.05});
tl.fromTo("#e-ring",{{opacity:1,scale:0.5}},{{opacity:0,scale:1.9,duration:0.9,ease:"power2.out"}},{L0 + 0.45});
{json.dumps(EPT)}.forEach(([x,y],i)=>tl.fromTo("#ept"+i,{{x:0,y:0,opacity:1,scale:1.4}},{{x:x,y:y,opacity:0,scale:0.2,duration:0.9,ease:"power3.out",immediateRender:false}},{L0 + 0.45}));tl.set(".ept",{{opacity:0}},0);
tl.fromTo("#e-sw",{{x:0}},{{x:520,duration:0.7,ease:"power2.inOut"}},{L0 + 0.6});
for(let i=0;i<{len(NAME)};i++)tl.fromTo("#en"+i,{{opacity:0,y:40,rotationX:-90}},{{opacity:1,y:0,rotationX:0,duration:0.35,ease:"back.out(2)"}},{L0 + 0.55}+i*0.035);
tl.fromTo("#e-re",{{opacity:0,scaleX:1.25}},{{opacity:1,scaleX:1,duration:0.5,ease:"power3.out"}},{L0 + 1.0});
tl.fromTo("#e-rule",{{scaleX:0}},{{scaleX:1,duration:0.35,ease:"power2.out"}},{L0 + 1.1});
tl.fromTo("#e-tag",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.45,ease:"power2.out"}},{L0 + 1.25});
pop("#e-cta",{L0 + 1.55});tl.fromTo("#e-wa",{{opacity:0}},{{opacity:1,duration:0.3}},{L0 + 1.8});
tl.to("#e-cta",{{scale:1.06,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:5}},{L0 + 2.0});tl.fromTo("#e-arw",{{y:-6}},{{y:10,duration:0.36,yoyo:true,repeat:5,ease:"power1.inOut"}},{L0 + 2.0});
tl.to("#e-crest",{{scale:1.08,duration:0.18,yoyo:true,repeat:1,ease:"sine.inOut"}},{T_STAB2});fl({T_STAB2},0.25);
tl.fromTo("#e-sw",{{x:0}},{{x:520,duration:0.6,ease:"power2.inOut",immediateRender:false}},{T_STAB3 - 0.1});tl.to("#e-crest",{{scale:1.08,duration:0.18,yoyo:true,repeat:1,ease:"sine.inOut"}},{T_STAB3});fl({T_STAB3},0.3);''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P + 'index.html', 'w').write('\n'.join(H))

# ---------- audio: eventos para mezcla.py (tiempo = momento del golpe del efecto)
SF = json.load(open(P + 'audio/sfx_info.json'))
EV = []  # (archivo, momento del golpe, volumen dB, pan, recorte s, fade s)


def ev(name, hit, db, pan=0.0, dur=None, fade=0.05, ref='peak'):
    EV.append({'f': name, 'hit': round(hit, 3), 'db': db, 'pan': pan, 'dur': dur, 'fade': fade, 'ref': ref})


WH = ['swoosh-cine-1481', 'swoosh-viento-1468', 'whoosh-barrido-2632', 'swoosh-rapido-3115', 'cinematic-whoosh-fast-1492', 'swoosh-acento-1464']
k = 0
for s in SC:
    if s['a'] <= 0:
        continue
    if s['id'] in ('MAP', 'PRO', 's11', 'LOGO'):
        continue
    ev(WH[k % len(WH)], s['a'], -19 if s['id'] in ('e2', 'e3', 'e4') else -16, pan=(-0.35 if k % 2 else 0.35))
    k += 1
ev('syn-boom', 0.03, -14, ref='onset')
ev('quick-zoom-impact-772', at('dueño') + 0.02, -22)
ev('pop-whoosh-3005', at('de', 0.9), -18)
ev('syn-coin', at('de', 0.9) + 0.25, -20)
# ambientes
ev('olas-pajaros-1185', SA['s02']['a'] - 0.2, -27, dur=SA['s03']['b'] - SA['s02']['a'] + 0.4, fade=0.6, ref='onset')
ev('copa-vino-clink-2936', SA['s02']['a'] + 0.4, -21, pan=0.15, ref='onset')   # brindis
ev('monedas-1993', SA['s03']['a'] + 0.25, -24, pan=-0.2, ref='onset')            # dinero en la mesa
ev('whoosh-impacto-1143', T_DROP, -15)
ev('barrido-magico-2638', SA['MAP']['a'] + 0.9, -21)
for i in range(3):
    ev('syn-pop', SA['MAP']['a'] + 0.5 + i * 0.6, -24 - 2 * i, ref='onset')
ev('mar-lejano-1191', SA['s05']['a'] - 0.2, -26, dur=SA['s05']['b'] - SA['s05']['a'] + 0.3, fade=0.5, ref='onset')
for t in (t39, t49):
    ev('syn-thud', t, -15, ref='onset')
    ev('syn-chaching', t + 0.05, -19, ref='onset')
    ev('moneda-oro-1999', t + 0.02, -22, ref='onset')
for i in range(9):
    ev('syn-tick', at('tres') - 0.1 + i * ((t39 - at('tres') + 0.1) / 9), -26, ref='onset')
    ev('syn-tick', at('cuatro') - 0.1 + i * ((t49 - at('cuatro') + 0.1) / 9), -26, ref='onset')
ev('syn-shimmer', tmil, -22, ref='onset')
ev('asador-chisporroteo-123', SA['s06']['a'] - 0.1, -25, dur=SA['s06']['b'] - SA['s06']['a'] + 0.2, fade=0.35, ref='onset')  # asador
ev('ninos-risas-2261', SA['s07']['a'] + 0.2, -31, dur=2.6, fade=0.5, ref='onset')  # familia con hijos llegando
ev('click-dispositivo-2577', at('esquema') - 0.02, -25, pan=0.3, ref='onset')
ev('syn-thud', t10, -16, ref='onset')
ev('syn-pop', t10b, -18, ref='onset')
ev('syn-thud', t80, -15, ref='onset')
ev('moneda-notif-1992', t80 + 0.42, -24, ref='onset')
for i in range(20):
    ev('syn-tick', t20 + i * 0.05, -25, ref='onset')
ev('syn-shimmer', t10 + 0.4, -26, ref='onset')
ev('firma-papel-2368', SA['s09']['a'] + 0.25, -21, dur=2.0, fade=0.2, ref='onset')
for w in (('clósets', 0), ('minisplits', 0), ('baños', 0), ('ruftop', 0)):
    ev('check-click-1120', at(*w) - 0.03, -15, ref='onset')
    ev('syn-pop-hi', at(*w) - 0.02, -21, ref='onset')
ev('aire-frio-1172', SA['e2']['a'], -24, dur=SA['e2']['b'] - SA['e2']['a'] + 0.2, fade=0.15, ref='onset')
ev('burbuja-agua-1317', at('baños') + 0.15, -24, ref='onset')
ev('olas-pajaros-1185', SA['e4']['a'], -28, dur=SA['e4']['b'] - SA['e4']['a'] + 0.2, fade=0.2, ref='onset')
ev('destello-whoosh-2350', qa_ + 0.05, -22)
ev('riser-cine-790', T450, -18)
ev('impacto-epico-2908', T450, -16)
ev('syn-chaching', T450 + 0.03, -17, ref='onset')
ev('monedas-1993', T450 + 0.05, -20, ref='onset')
ev('destello-toque-3083', T450 + 0.3, -21)
ev('fogata-1329', SA['s10']['a'] - 0.1, -6, dur=SA['s10']['b'] - SA['s10']['a'] + 0.2, fade=0.5, ref='onset')
ev('copa-vino-clink-2936', at('disfrutarlo') + 0.1, -24, pan=-0.2, ref='onset')
ev('mar-lejano-1191', SA['s11']['a'] - 0.3, -30, dur=DUR - SA['s11']['a'] + 0.3, fade=0.8, ref='onset')
ev('click-ui-2568', tb - 0.1, -16, ref='onset')
ev('destello-toque-3083', T_STAB3, -20)
ev('impacto-logo-2900', T_LOGO + 0.05, -17, ref='onset')
ev('destello-whoosh-2350', T_LOGO + 0.6, -22)
json.dump({'DUR': DUR, 'VOZ_FIN': VOZ_FIN, 'T_DROP': T_DROP, 'TS': TS, 'MOFF': MOFF, 'M_CUT_A': M_CUT_A, 'M_CUT_B': M_CUT_B, 'events': EV}, open(P + 'audio/eventos.json', 'w'), indent=1, ensure_ascii=False)
json.dump({'DUR': DUR, 'shots': SC, 'headlines': HL, 'captions': CAPS}, open(P + 'layout.json', 'w'), indent=1, ensure_ascii=False)
print('DUR', DUR, '| T_DROP', T_DROP, '| splice música', TS, '| subtítulos', len(CAPS), '| efectos', len(EV))
for s in SC:
    print(f"{s['id']:4s} {s['a']:6.2f} → {s['b']:6.2f} ({s['b'] - s['a']:4.2f} s) {s.get('img', '')} {'tit ' + str(HL[s['id']]['size']) if s['id'] in HL else ''}")
print('titulares:', {k: (v['l1'], v['l2'], v['size'], v['top'], 'una línea' if v['one'] else 'dos líneas') for k, v in HL.items()})
print('subtítulos:', ' | '.join(f"{c['top']}:{' '.join(w[0] for w in c['w'])}" for c in CAPS))
print('\n'.join(LOG) if LOG else 'sin avisos')
