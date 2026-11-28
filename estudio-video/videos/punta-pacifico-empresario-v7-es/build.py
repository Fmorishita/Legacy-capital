# Empresario V7 · Legacy Capital · Punta Pacífico. Genera index.html.
# Edición distinta a Doctor y California: tarjetas 3D, giros y volteos 3D, columnas 3D de pagos, subtítulos por golpes
# de 1-3 palabras al centro, barra de progreso, cortes y golpes de zoom al pulso de la música (128 BPM).
# Voz: es-MX-JorgeNeural (Microsoft Edge TTS), un solo archivo con tiempos por palabra (voz.words.json).
import json, math, random
P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-empresario-v7-es/'
W = json.load(open(P + 'voz.words.json'))  # [texto, inicio, fin]
G = open(P + 'guion-voz.txt').read().split()  # mismo orden, con puntuación
assert len(W) == len(G)
VOZ_FIN = W[-1][2]
DUR = round(VOZ_FIN + 1.7, 2)
BPM0, BEAT = 0.308, 60 / 128  # pulso de la música (ver README)
low = lambda s: s.lower().strip('¿?¡!,.:;')


def at(txt, after=0.0, nth=1):
    c = 0
    for t, s, e in W:
        if s >= after - 0.01 and low(t) == txt:
            c += 1
            if c == nth:
                return s
    raise KeyError(txt)


cw = lambda txt, after=0.0, nth=1: round(at(txt, after, nth) - 0.06, 3)
# ---------- tomas: id, inicio, imagen, tipo de entrada, origen del Ken Burns, escala ini, escala fin
T_TE, T_FRENTE, T_QUE, T_CONOCE = cw('te'), cw('frente'), cw('que'), cw('conoce')
T_RUF, T_DESDE, T_DISF = cw('ruf'), cw('desde'), cw('disfrútala')
T_CUANDO, T_YPARA, T_DIEZ = cw('cuando'), cw('y', 26.5), cw('diez')
T_RES, T_COMO2, T_CONS, T_HAZ = cw('reserva'), cw('como', 40), cw('construye'), cw('haz')
SH = [  # (id, ini, fin, img, entrada, origen, s0, s1, posición)
    ('s01', 0, T_TE, 'a-empresario', 'none', '50% 30%', 1.12, 1.02, '50% 50%'),
    ('s02', T_TE, T_FRENTE, 'l-barandal', 'door', '50% 45%', 1.02, 1.12, '50% 50%'),
    ('s03', T_FRENTE, T_QUE, 'i-roof-sofa', 'cube', '60% 55%', 1.14, 1.04, '50% 50%'),
    ('s04', T_QUE, T_CONOCE, 'n-brindis', 'flipx', '45% 40%', 1.03, 1.12, '50% 50%'),
    ('s05', T_CONOCE, T_RUF, 'd-fachada', 'card', '50% 40%', 1.0, 1.08, '50% 50%'),
    ('s06', T_RUF, T_DESDE, 'c-roof-vino', 'glitch', '30% 45%', 1.04, 1.14, '18% 50%'),
    ('s07', T_DISF, T_CUANDO, 'k-familia', 'door', '45% 55%', 1.12, 1.02, '50% 50%'),
    ('s08', T_CUANDO, T_YPARA, 'j-llegada', 'zoom', '50% 55%', 1.02, 1.12, '50% 50%'),
    ('s09', T_YPARA, T_DIEZ, 'm-asesoria', 'cube', '50% 45%', 1.12, 1.02, '50% 50%'),
    ('s10', T_RES, T_COMO2, 'b-firma', 'flipx', '55% 60%', 1.02, 1.12, '50% 50%'),
    ('s11', T_CONS, T_HAZ, 'g-alberca', 'glitch', '45% 50%', 1.12, 1.02, '50% 50%'),
    ('s12', T_HAZ, DUR, 'h-fran-cta', 'door', '50% 35%', 1.02, 1.08, '50% 50%'),
]
MG = {'precio': (T_DESDE, T_DISF), 'pagos': (T_DIEZ, T_RES), 'equipo': (T_COMO2, T_CONS)}
SA = {x[0]: x[1] for x in SH}
OV = 0.45  # cada toma dura un poco más que su corte para que la siguiente entre en 3D encima
# ---------- subtítulos: golpes de 1-3 palabras, cifras con formato de pantalla
MERGE = [(['diez', 'por', 'ciento'], '10%'), (['ochenta', 'por', 'ciento'], '80%'), (['veinte'], '20'), (['tres', 'punto', 'nueve'], '$3.9'),
         (['cuatro', 'punto', 'nueve'], '$4.9'), (['cuatrocientos', 'cincuenta', 'mil'], '$450,000'), (['ruf'], 'ROOF'), (['gárden'], 'GARDEN'),
         (['légasi'], 'LEGACY'), (['cápital'], 'CAPITAL')]
toks = []
i = 0
while i < len(W):
    for seq, rep in MERGE:
        if [low(x[0]) for x in W[i:i + len(seq)]] == seq:
            toks.append([rep, W[i][1], W[i + len(seq) - 1][2], G[i + len(seq) - 1][-1] in ',.:;?'])
            i += len(seq)
            break
    else:
        t = G[i].strip('¿?¡!,.:;').upper()
        toks.append([t, W[i][1], W[i][2], G[i][-1] in ',.:;?'])
        i += 1
NOCAP = [(0, T_TE), (T_TE, T_FRENTE), MG['precio'], (T_DISF, T_CUANDO), MG['pagos'], MG['equipo'], (T_CONS, DUR)]
KEY = {'EMPRESA', 'MAR', 'PACÍFICO', 'DISFRUTAR', 'INVERSIÓN', 'ENSENADA', 'NIVEL', 'ROOF', 'FAMILIA', 'RENTAS', 'CAPITAL', 'FLEXIBLE', 'RESERVA',
       'MES', 'INCLUIDO', 'PATRIMONIO', 'DISFRUTARLO', 'BOTÓN', 'ABAJO', 'LEGACY', 'ESTANCIA', 'CASA', 'PRIVADO', 'EQUIPAMIENTO'}
chunks, cur = [], []
for t in toks:
    if any(a - 0.05 <= t[1] < b - 0.05 for a, b in NOCAP):
        if cur:
            chunks.append(cur); cur = []
        continue
    if cur and (len(cur) >= 3 or len(' '.join(x[0] for x in cur)) + len(t[0]) > 17 or cur[-1][3] or t[1] - cur[-1][2] > 0.35):
        chunks.append(cur); cur = []
    cur.append(t)
if cur:
    chunks.append(cur)
CAPTOP = {'s03': 620}  # en la toma del sofá las caras quedan donde iría el subtítulo


def scene_at(t):
    for sid, a, b, *_ in SH:
        if a <= t < b:
            return sid
    return None


CAPS = []
for k, c in enumerate(chunks):
    s = c[0][1] - 0.04
    nxt = chunks[k + 1][0][1] - 0.04 if k + 1 < len(chunks) else DUR
    e = min(c[-1][2] + 0.45, nxt)
    for a, b in NOCAP:  # nunca dentro de una animación
        if s < a < e:
            e = a
    CAPS.append({'s': round(s, 3), 'e': round(e, 3), 'top': CAPTOP.get(scene_at(c[0][1]), 1085), 'w': [[x[0], round(x[1], 3), x[0] in KEY or x[0][0] == '$' or x[0][-1] == '%'] for x in c]})
# ---------- HTML
H = []; A = H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Empresario V7 — Legacy Capital</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"Outfit";font-weight:700;src:url("assets/fonts/Outfit-Bold.ttf") format("truetype");}
@font-face{font-family:"Outfit";font-weight:400;src:url("assets/fonts/Outfit-Regular.ttf") format("truetype");}
@font-face{font-family:"Big";font-weight:700;src:url("assets/fonts/BigShoulders-Bold.ttf") format("truetype");}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2");}
:root{--navy:#1A2B4C;--gold:#C5A564;--gold2:#E9CB86;--cream:#F5F0E6;--ink:#0D1626}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#0D1626}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"Outfit",sans-serif;font-weight:700;color:#fff;background:#0D1626}
.clip{position:absolute;inset:0}
.sc{perspective:1500px;perspective-origin:50% 45%}
.sc .rig{position:absolute;inset:0;transform-style:preserve-3d;overflow:hidden;backface-visibility:hidden}
.sc .beat,.sc .kb{position:absolute;inset:0}
.sc img.ph{width:100%;height:100%;object-fit:cover;display:block}
.sc .grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(13,22,38,.55) 0%,rgba(13,22,38,.12) 24%,rgba(13,22,38,0) 40%,rgba(13,22,38,0) 50%,rgba(13,22,38,.45) 78%,rgba(13,22,38,.7) 100%)}
.blurbg{position:absolute;inset:-60px;background-size:cover;background-position:center;filter:blur(38px) brightness(.45) saturate(1.2)}
.mgbg{position:absolute;inset:0;background:radial-gradient(ellipse 90% 60% at 50% 45%,rgba(26,43,76,.55) 0%,rgba(13,22,38,.92) 75%)}
/* tarjeta 3D (toma de la fachada) */
#card5{position:absolute;left:110px;top:440px;width:860px;height:1147px;border-radius:44px;overflow:hidden;box-shadow:0 40px 90px rgba(0,0,0,.65),0 0 0 4px rgba(233,203,134,.85);transform-style:preserve-3d}
#card5 img{width:100%;height:100%;object-fit:cover;display:block}
#card5 .shine{position:absolute;inset:-40%;background:linear-gradient(115deg,rgba(255,255,255,0) 40%,rgba(255,255,255,.35) 50%,rgba(255,255,255,0) 60%)}
/* volteo disfrutar / invertir */
#flipw{position:absolute;left:0;top:0;width:1080px;height:1920px;transform-style:preserve-3d}
.face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden}
.face.back{transform:rotateY(180deg);background:radial-gradient(ellipse 90% 70% at 50% 40%,#22385F 0%,#1A2B4C 45%,#0D1626 100%)}
#inv{position:absolute;left:0;right:0;top:470px;text-align:center}
#inv .k{font-family:"Big";font-size:220px;line-height:.9;letter-spacing:.01em;color:var(--gold2);text-shadow:0 1px 0 #B8934A,0 2px 0 #A9853F,0 3px 0 #9A7836,0 4px 0 #8B6B2D,0 5px 0 #7C5F25,0 6px 0 #6D531D,0 20px 40px rgba(0,0,0,.6)}
#inv .s{font-size:46px;letter-spacing:.2em;margin-top:22px;color:var(--cream)}
#arrowsvg{position:absolute;left:290px;top:790px}
/* chips y titulares */
.chip{position:absolute;left:50%;height:96px;padding:0 40px;border-radius:999px;background:var(--cream);color:var(--navy);font-size:46px;letter-spacing:.04em;display:flex;align-items:center;gap:16px;white-space:nowrap;box-shadow:0 14px 34px rgba(0,0,0,.45);transform:translateX(-50%)}
.chip i{font-style:normal;width:56px;height:56px;border-radius:50%;background:var(--gold);color:#fff;display:flex;align-items:center;justify-content:center;font-size:34px}
.chip.dk{background:var(--navy);color:var(--gold2);border:3px solid var(--gold)}
.hl3{position:absolute;left:60px;right:60px;text-align:center;font-family:"Big";font-size:132px;line-height:.92;letter-spacing:.01em;text-transform:uppercase;text-shadow:0 1px 0 #B8934A,0 2px 0 #A9853F,0 3px 0 #9A7836,0 4px 0 #8B6B2D,0 5px 0 #7C5F25,0 18px 34px rgba(0,0,0,.65)}
.hl3 .g{color:var(--gold2)}
.hl3 span.w{display:inline-block;transform-style:preserve-3d}
.eyebrow{position:absolute;left:0;right:0;text-align:center;font-size:36px;letter-spacing:.3em;color:var(--gold2);text-shadow:0 2px 10px rgba(0,0,0,.7)}
/* pin 3D */
#pin{position:absolute;left:490px;top:640px;width:100px;height:130px;transform-style:preserve-3d}
#pinshadow{position:absolute;left:500px;top:780px;width:80px;height:24px;border-radius:50%;background:rgba(0,0,0,.55);filter:blur(6px)}
/* hook */
#hook{position:absolute;left:40px;right:40px;top:1010px;text-align:center;perspective:900px}
#hook .w{display:inline-block;font-family:"Big";font-size:150px;line-height:1.02;margin:0 10px;text-transform:uppercase;text-shadow:0 1px 0 #B8934A,0 2px 0 #A9853F,0 3px 0 #9A7836,0 4px 0 #8B6B2D,0 5px 0 #7C5F25,0 6px 0 #6D531D,0 22px 40px rgba(0,0,0,.7)}
#hook .w.g{color:var(--gold2)}
/* precio */
.prow{position:absolute;left:70px;right:70px;height:300px;transform-style:preserve-3d}
.prow .lb{position:absolute;left:0;top:96px;width:300px;font-size:58px;letter-spacing:.14em;color:var(--gold2)}
.prow .num{position:absolute;left:290px;top:0;font-family:"Big";font-size:270px;line-height:.9;white-space:nowrap;text-shadow:0 1px 0 #C9C2B4,0 2px 0 #BDB5A6,0 3px 0 #B0A898,0 4px 0 #A39B8B,0 5px 0 #968E7E,0 6px 0 #898171,0 7px 0 #7C7464,0 26px 50px rgba(0,0,0,.7)}
.prow .num small{font-size:130px;color:var(--gold2);margin-left:16px;text-shadow:none}
#pmx{position:absolute;left:90px;right:90px;top:1080px;height:110px;border-radius:26px;background:var(--gold);color:var(--ink);font-size:52px;letter-spacing:.06em;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 40px rgba(0,0,0,.5)}
#ptag{position:absolute;left:0;right:0;top:1205px;text-align:center;font-family:"Outfit";font-weight:400;font-size:34px;color:var(--cream);letter-spacing:.06em}
.coin3{position:absolute;width:110px;height:110px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF3CF,#E9CB86 45%,#A98336);border:5px solid #F4DEA6;box-shadow:0 12px 26px rgba(0,0,0,.5);color:#6E5016;font-family:"Big";font-size:70px;display:flex;align-items:center;justify-content:center}
/* reservas: tarjeta de calendario 3D */
#book{position:absolute;left:100px;right:100px;top:400px;height:400px;border-radius:36px;background:rgba(245,240,230,.97);color:var(--navy);box-shadow:0 30px 70px rgba(0,0,0,.55);transform-style:preserve-3d;padding:28px 36px}
#book .t{font-size:44px;line-height:1.1}#book .t span{color:#A98336}
#cal{display:grid;grid-template-columns:repeat(7,1fr);gap:12px;margin-top:24px}
#cal i{display:block;height:58px;border-radius:14px;background:#E6DECF;font-style:normal;font-size:26px;color:#8C8577;display:flex;align-items:center;justify-content:center}
#book .n{position:absolute;left:36px;right:36px;bottom:20px;font-family:"Outfit";font-weight:400;font-size:24px;color:#5E6676}
/* pagos: columnas 3D */
#pstage{position:absolute;left:0;top:520px;width:1080px;height:700px;perspective:1400px;perspective-origin:50% 20%}
#pworld{position:absolute;inset:0;transform-style:preserve-3d}
.col{position:absolute;bottom:120px;width:220px;transform-style:preserve-3d}
.col .fr,.col .sd,.col .tp{position:absolute;left:0;bottom:0}
.col .fr{width:220px;height:100%;background:linear-gradient(180deg,var(--gold2),var(--gold))}
.col .sd{width:80px;height:100%;left:220px;transform-origin:0 50%;transform:rotateY(90deg);background:linear-gradient(180deg,#A98336,#7C5F25)}
.col .tp{width:220px;height:80px;bottom:auto;top:0;transform-origin:50% 0;transform:rotateX(-90deg) translateZ(0);background:#F4DEA6}
.col.b .fr{background:repeating-linear-gradient(180deg,#E9CB86 0 13px,#C5A564 13px 16px)}
.col.c .fr{background:linear-gradient(180deg,#3E5C8F,var(--navy))}.col.c .sd{background:linear-gradient(180deg,#22385F,#0D1626)}.col.c .tp{background:#5873A3}
.pv{position:absolute;width:300px;text-align:center;font-family:"Big";font-size:130px;line-height:1;text-shadow:0 10px 26px rgba(0,0,0,.6)}
.pl{position:absolute;width:300px;text-align:center;font-size:36px;line-height:1.15;color:var(--cream)}
.pl small{display:block;font-family:"Outfit";font-weight:400;font-size:28px;color:var(--gold2)}
#mini{position:absolute;left:390px;top:1190px;width:300px;display:grid;grid-template-columns:repeat(10,1fr);gap:6px}
#mini i{display:block;height:20px;border-radius:5px;background:rgba(255,255,255,.18)}
/* equipamiento */
.tile{position:absolute;width:430px;height:300px;border-radius:34px;background:var(--cream);color:var(--navy);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;box-shadow:0 22px 50px rgba(0,0,0,.5);backface-visibility:hidden;font-size:44px;letter-spacing:.04em}
.tile svg{width:120px;height:120px}
#eqv{position:absolute;left:0;right:0;top:700px;text-align:center}
#eqv .a{font-size:52px;letter-spacing:.22em;color:var(--gold2);margin-bottom:22px}
#eqv .n{font-family:"Big";font-size:250px;line-height:.9;white-space:nowrap;text-shadow:0 0 40px rgba(233,203,134,.7),0 1px 0 #C9C2B4,0 2px 0 #BDB5A6,0 3px 0 #B0A898,0 4px 0 #A39B8B,0 5px 0 #968E7E,0 26px 50px rgba(0,0,0,.6)}
#eqv .c{display:inline-block;margin-top:18px;background:var(--gold);color:var(--ink);border-radius:999px;padding:12px 44px;font-size:46px;letter-spacing:.06em}
#rays{position:absolute;left:-460px;top:-160px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(233,203,134,.16) 0deg 6deg,rgba(233,203,134,0) 6deg 18deg)}
.pt{position:absolute;left:532px;top:860px;width:16px;height:16px;border-radius:50%;background:var(--gold2);opacity:0}
.fine{position:absolute;left:60px;right:60px;text-align:center;font-family:"Outfit";font-weight:400;font-size:26px;color:rgba(245,240,230,.9);text-shadow:0 2px 8px rgba(0,0,0,.9)}
/* subtítulos */
#caps{z-index:20}
.cap{position:absolute;left:40px;right:40px;text-align:center;white-space:nowrap}
.cap .w{display:inline-block;margin:0 8px;padding:2px 16px 6px;border-radius:18px;font-size:82px;line-height:1.05;letter-spacing:.01em;color:#fff;text-shadow:0 4px 0 rgba(0,0,0,.35),0 6px 18px rgba(0,0,0,.7)}
.cap .w.k{color:var(--gold2)}
/* barra, logo, cta */
#hud{z-index:22;pointer-events:none}
#bar{position:absolute;left:65px;right:65px;top:276px;height:8px;border-radius:4px;background:rgba(255,255,255,.22);overflow:hidden}
#barf{position:absolute;left:0;top:0;bottom:0;width:100%;background:linear-gradient(90deg,var(--gold),var(--gold2));transform-origin:0 50%}
#brand{position:absolute;left:0;right:0;top:300px;display:flex;align-items:center;justify-content:center;gap:14px}
#brand img{width:54px;height:auto;filter:drop-shadow(0 2px 6px rgba(0,0,0,.7))}
#brand span{font-family:"Cinzel";font-size:30px;letter-spacing:.16em;text-shadow:0 2px 8px rgba(0,0,0,.9)}
#cta{position:absolute;left:120px;right:120px;top:1110px;height:120px;border-radius:999px;background:var(--gold);color:var(--ink);font-size:52px;letter-spacing:.04em;display:flex;align-items:center;justify-content:center;gap:20px;box-shadow:0 0 0 6px rgba(233,203,134,.35),0 20px 44px rgba(0,0,0,.55)}
#cta .ar{display:inline-block}
#ctat{position:absolute;left:0;right:0;top:960px;text-align:center;font-family:"Big";font-size:120px;line-height:1;text-shadow:0 1px 0 #B8934A,0 2px 0 #A9853F,0 3px 0 #9A7836,0 4px 0 #8B6B2D,0 18px 34px rgba(0,0,0,.7)}
#ctat .g{color:var(--gold2)}
#ctab{position:absolute;left:0;right:0;top:955px;display:flex;align-items:center;justify-content:center;gap:18px;opacity:0}#ctab img{width:96px;filter:drop-shadow(0 4px 10px rgba(0,0,0,.7))}#ctab span{font-family:"Cinzel";font-size:60px;letter-spacing:.1em;color:var(--gold2);text-shadow:0 3px 12px rgba(0,0,0,.9)}
#flash{position:absolute;inset:0;background:#FFF8EA;opacity:0;pointer-events:none}
#vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 75% at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.35) 100%);pointer-events:none}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
'''.replace('%DUR%', str(DUR)))
ICON = {  # iconos de línea propios (SVG), color navy
    'closet': '<svg viewBox="0 0 120 120" fill="none" stroke="#1A2B4C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="22" y="12" width="76" height="96" rx="8"/><path d="M60 12v96M50 56v12M70 56v12"/></svg>',
    'mini': '<svg viewBox="0 0 120 120" fill="none" stroke="#1A2B4C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="30" width="100" height="42" rx="10"/><path d="M24 58h72M34 86c4 6 4 12 0 18M60 86c4 6 4 12 0 18M86 86c4 6 4 12 0 18"/></svg>',
    'bano': '<svg viewBox="0 0 120 120" fill="none" stroke="#1A2B4C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M14 62h92v10a26 26 0 0 1-26 26H40a26 26 0 0 1-26-26z"/><path d="M28 62V26a12 12 0 0 1 24 0M40 98l-6 12M80 98l6 12"/></svg>',
    'roof': '<svg viewBox="0 0 120 120" fill="none" stroke="#1A2B4C" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"><path d="M10 40h100M22 40V20M98 40V20M16 20h88M30 40v62M90 40v62"/><path d="M48 102V78a12 12 0 0 1 24 0v24M44 102h32"/></svg>',
}
z = 0
for k, (sid, a, b, img, ent, org, s0, s1, pos) in enumerate(SH):
    z += 1
    end = b if sid == 's12' else round(b + OV, 3)
    A(f'<div id="{sid}" class="clip sc" data-start="{a}" data-duration="{round(end - a, 3)}" data-track-index="{k % 2}" style="z-index:{z}"><div class="rig">')
    if sid == 's04':  # tarjeta que se voltea: disfrutar (foto) / invertir (cara de atrás)
        A(f'<div id="flipw"><div class="face front"><div class="beat"><div class="kb"><img class="ph" src="assets/img/{img}.jpg" alt="" /></div></div><div class="grad"></div></div>'
          '<div class="face back"><div id="inv"><div class="k">INVIERTE</div><div class="s">TU CASA · TU PATRIMONIO</div></div>'
          '<svg id="arrowsvg" width="500" height="260" viewBox="0 0 500 260"><path id="arp" d="M20 230 L150 150 L240 185 L470 30" fill="none" stroke="#E9CB86" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>'
          '<path id="arh" d="M400 24 L474 28 L462 100" fill="none" stroke="#E9CB86" stroke-width="18" stroke-linecap="round" stroke-linejoin="round" opacity="0"/></svg></div></div>')
    elif sid == 's05':  # fachada como tarjeta 3D flotando sobre su propio fondo desenfocado
        A(f'<div class="blurbg" style="background-image:url(assets/img/{img}.jpg)"></div><div id="card5"><img src="assets/img/{img}.jpg" alt="" /><div class="shine" id="shine5"></div></div>')
    else:
        A(f'<div class="beat"><div class="kb"><img class="ph" src="assets/img/{img}.jpg" alt="" style="object-position:{pos}" /></div></div><div class="grad"></div>')
    A('</div>')
    if sid == 's01':
        A('<div id="hook">' + ''.join(f'<span class="w{" g" if w == "EMPRESA" else ""}" id="hk{i}">{w}</span>' for i, w in enumerate(['DUEÑO', 'O', 'DIRECTOR', 'DE', 'EMPRESA'])) + '</div>')
    if sid == 's02':
        A('<div class="eyebrow" id="e2" style="top:400px">¿TE GUSTARÍA TENER</div><div class="hl3" id="h2" style="top:462px">UNA CASA <span class="g">FRENTE AL MAR</span></div>')
    if sid == 's03':
        pass
    if sid == 's04':
        A('<div class="chip" id="c4" style="top:420px"><i>✓</i>DISFRUTA</div>')
    if sid == 's05':
        A('<div class="eyebrow" id="e5" style="top:372px">NUEVO DESARROLLO RESIDENCIAL</div>'
          '<div id="pinshadow"></div><svg id="pin" viewBox="0 0 100 130"><path d="M50 126C50 126 8 76 8 46a42 42 0 0 1 84 0c0 30-42 80-42 80z" fill="#C5A564" stroke="#F5F0E6" stroke-width="5"/><circle cx="50" cy="46" r="16" fill="#F5F0E6"/></svg>'
          '<div class="chip" id="c5a" style="top:820px"><i>⌖</i>ENSENADA · BAJA CALIFORNIA</div><div class="chip dk" id="c5b" style="top:940px">CASAS DE UN NIVEL</div>')
    if sid == 's06':
        A('<div class="chip" id="c6a" style="top:400px"><i>✓</i>ROOF PRIVADO</div><div class="chip" id="c6b" style="top:520px"><i>✓</i>VISTA AL MAR</div>')
    if sid == 's07':
        A('<div class="hl3" id="h7" style="top:390px">DISFRÚTALA <span class="g">EN FAMILIA</span></div>')
    if sid == 's08':
        A('<div id="book"><div class="t">Cuando no la uses:<br><span>renta de corta estancia</span></div><div id="cal">'
          + ''.join(f'<i id="cd{d}">{d + 1}</i>' for d in range(14)) + '</div><div class="n" id="bkn">Alto potencial de renta. Escenario ilustrativo: los ingresos no están garantizados.</div></div>')
    if sid == 's09':
        A('<div class="eyebrow" id="e9" style="top:400px">CUIDA TU</div><div class="hl3" id="h9" style="top:462px">FLUJO DE <span class="g">CAPITAL</span></div><div class="chip dk" id="c9" style="top:720px">ESQUEMA DE PAGO FLEXIBLE</div>')
    if sid == 's10':
        A('<div class="hl3" id="h10" style="top:390px">RESERVA <span class="g">ESTE MES</span></div><div class="chip" id="c10" style="top:650px"><i>✓</i>EQUIPAMIENTO INCLUIDO</div>'
          '<div class="fine" id="f10" style="top:1205px">*Promoción sujeta a términos, condiciones y vigencia.</div>')
    if sid == 's11':
        A('<div class="hl3" id="h11a" style="top:390px">CONSTRUYE <span class="g">PATRIMONIO</span></div><div class="chip dk" id="c11" style="top:660px">SIN DEJAR DE DISFRUTARLO</div>')
    if sid == 's12':
        A('<div id="ctat"><span class="g">CONOCE</span> MÁS</div><div id="ctab"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div><div id="cta"><span>HAZ CLIC ABAJO</span><span class="ar" id="ar">↓</span></div>')
    A('</div>')
# ---------- animaciones: precio, pagos, equipamiento
pa, pb = MG['precio']
z += 1
A(f'<div id="precio" class="clip" data-start="{pa}" data-duration="{round(pb - pa + OV, 3)}" data-track-index="2" style="z-index:{z}"><div class="blurbg" style="background-image:url(assets/img/c-roof-vino.jpg)"></div><div class="mgbg"></div>'
  '<div class="eyebrow" id="pe" style="top:400px;font-size:30px;letter-spacing:.16em">CASAS DE UN NIVEL · ROOF · VISTA AL MAR</div><div id="pst" style="position:absolute;inset:0;perspective:1200px">'
  '<div class="prow" id="pr1" style="top:492px"><div class="lb">DESDE</div><div class="num">$3.9<small>M</small></div></div>'
  '<div class="prow" id="pr2" style="top:770px"><div class="lb">HASTA</div><div class="num">$4.9<small>M</small></div></div></div>'
  '<div id="pmx">MILLONES DE PESOS · MXN</div><div id="ptag">Precios de lista en pesos mexicanos</div>'
  '<div class="coin3" id="co1" style="left:860px;top:430px">$</div></div>')
qa, qb = MG['pagos']
z += 1
COLS = [('a', 10, 120), ('b', 10, 420), ('c', 80, 720)]
A(f'<div id="pagos" class="clip" data-start="{qa}" data-duration="{round(qb - qa + OV, 3)}" data-track-index="3" style="z-index:{z}"><div class="blurbg" style="background-image:url(assets/img/m-asesoria.jpg)"></div><div class="mgbg"></div>'
  '<div class="eyebrow" id="qe" style="top:400px">ESQUEMA DE PAGO FLEXIBLE</div><div class="hl3" id="qt" style="top:450px;font-size:110px">10 · 10 · <span class="g">80</span></div>'
  '<div id="pstage"><div id="pworld">')
for c, pct, x in COLS:
    A(f'<div class="col {c}" id="col{c}" style="left:{x}px;height:{40 + pct * 4}px"><div class="fr"></div><div class="sd"></div><div class="tp"></div></div>')
A('</div></div>')
for c, pct, x in COLS:
    h = 40 + pct * 4
    A(f'<div class="pv" id="pv{c}" style="left:{x - 40}px;top:{520 + 700 - 120 - h - 150}px">{pct}%</div>')
A('<div class="pl" id="pla" style="left:80px;top:1098px">ENGANCHE</div><div class="pl" id="plb" style="left:380px;top:1098px">20 MENSUA-<br>LIDADES</div><div class="pl" id="plc" style="left:680px;top:1098px">CONTRA<br>ENTREGA</div>'
  '<div id="mini">' + ''.join(f'<i id="mn{i}"></i>' for i in range(20)) + '</div></div>')
ea, eb = MG['equipo']
z += 1
TILES = [('closet', 'CLÓSETS', 80, 420, 'clósets'), ('mini', 'MINISPLITS', 570, 420, 'minisplits'), ('bano', 'BAÑOS', 80, 760, 'baños'), ('roof', 'ROOF GARDEN', 570, 760, 'ruf')]
A(f'<div id="equipo" class="clip" data-start="{ea}" data-duration="{round(eb - ea + OV, 3)}" data-track-index="2" style="z-index:{z}"><div class="blurbg" style="background-image:url(assets/img/b-firma.jpg)"></div><div class="mgbg"></div>'
  '<div id="rays"></div><div class="eyebrow" id="ee" style="top:360px">EQUIPAMIENTO INCLUIDO</div><div id="tiles" style="position:absolute;inset:0;perspective:1400px">')
for ic, lb, x, y, _ in TILES:
    A(f'<div class="tile" id="t-{ic}" style="left:{x}px;top:{y}px">{ICON[ic]}<span>{lb}</span></div>')
A('</div><div id="eqv"><div class="a" id="eqa">CON VALOR DE HASTA</div><div class="n"><span id="eqn">$0</span></div><div class="c" id="eqc">PESOS · MXN</div></div>'
  + ''.join(f'<div class="pt" id="pt{i}"></div>' for i in range(26))
  + '<div class="fine" id="eqf" style="top:1205px">*Al reservar este mes. Aplican términos, condiciones y vigencia.</div></div>')
# ---------- capas globales
A(f'<div id="caps" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
A(f'<div id="hud" class="clip" data-start="0" data-duration="{DUR}" data-track-index="6"><div id="vig"></div><div id="bar"><div id="barf"></div></div><div id="brand"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div><div id="flash"></div></div>')
for k, t in (('leak-a', round(T_CONOCE - 0.3, 2)), ('leak-b', round(T_CONS - 0.3, 2))):
    A(f'<div id="{k}" class="clip" data-composition-id="{k}" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="{t}" data-duration="1" data-width="1080" data-height="1920" data-track-index="7" style="z-index:30"></div>')
A(f'<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="{round(VOZ_FIN + 0.3, 2)}" data-track-index="8" data-volume="1"></audio>')
MV = 0.06
A(f'''<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":{MV * 1.7}}},{{"t":0.25,"v":{MV}}},{{"t":{round(VOZ_FIN + 0.1, 2)},"v":{MV}}},{{"t":{round(VOZ_FIN + 0.5, 2)},"v":{MV * 2}}},{{"t":{round(DUR - 0.6, 2)},"v":{MV * 2}}},{{"t":{DUR},"v":0}}]}}]}}'></audio>''')
SFX = {'sw': ('fast-small-sweep-166', 0.8), 'st': ('short-transition-sweep-175', 0.65), 'who': ('cinematic-whoosh-fast-1492', 1.38), 'imp': ('quick-zoom-impact-772', 1.25),
       'wu': ('syn-whoosh-up', 0.6), 'wd': ('syn-whoosh-down', 0.62), 'ss': ('syn-swish', 0.31), 'wl': ('syn-whoosh-low', 0.83), 'pop': ('syn-pop', 0.2), 'ph': ('syn-pop-hi', 0.18),
       'tk': ('syn-tick', 0.1), 'coin': ('syn-coin', 0.73), 'cha': ('syn-chaching', 1.14), 'shim': ('syn-shimmer', 0.94), 'rise': ('syn-riser', 1.04), 'boom': ('syn-boom', 0.94),
       'thud': ('syn-thud', 0.33), 'air': ('air-zoom-vacuum-2608', 0.7), 'fw': ('fast-whoosh-1490', 0.5)}
ENT_SFX = {'door': 'who', 'cube': 'fw', 'flipx': 'wd', 'card': 'air', 'glitch': 'imp', 'zoom': 'wu'}
ev = [('boom', 0.02, 0.4)]
for sid, a, b, img, ent, *_ in SH:
    if a > 0:
        k = ENT_SFX[ent]
        ev.append((k, max(0, a - (0.25 if k in ('who', 'wu', 'air') else 0.06)), 0.28))
for t in (MG['precio'][0], MG['pagos'][0], MG['equipo'][0]):
    ev.append(('st', t - 0.05, 0.3))
T39, T49, TMILL = at('tres'), at('cuatro'), at('millones')
T10, T10b, T20, T80 = at('diez'), at('diez', 0, 2), at('veinte'), at('ochenta')
TV, T450 = at('valor'), at('mil', 44)
ev += [('thud', at('dueño') + 0.02, 0.4), ('thud', at('director'), 0.4), ('imp', at('empresa'), 0.35),
       ('pop', at('pacífico'), 0.35), ('ph', at('disfrutar'), 0.4), ('wu', at('aprovechar') - 0.2, 0.3), ('coin', at('inversión'), 0.35),
       ('thud', at('ensenada') - 0.15, 0.4), ('pop', at('baja'), 0.35), ('ph', at('casas'), 0.4), ('pop', at('ruf'), 0.4), ('ph', at('vista'), 0.4),
       ('thud', T39, 0.5), ('cha', T39 + 0.1, 0.3), ('thud', T49, 0.5), ('cha', T49 + 0.1, 0.3), ('imp', TMILL, 0.3),
       ('pop', at('considera'), 0.35), ('ph', at('esquema'), 0.4),
       ('thud', T10, 0.5), ('thud', T10b, 0.5), ('boom', T80, 0.4), ('shim', T80 + 0.3, 0.25), ('pop', at('equipamiento'), 0.35),
       ('rise', T450 - 1.25, 0.35), ('boom', T450, 0.5), ('cha', T450 + 0.02, 0.4), ('shim', T450 + 0.4, 0.25),
       ('ph', at('patrimonio'), 0.35), ('pop', at('disfrutarlo'), 0.35), ('pop', at('botón') + 0.05, 0.4), ('shim', at('légasi'), 0.35)]
ev += [('tk', at('rentas') + i * 0.12, 0.16) for i in range(14)]
ev += [('tk', T20 + i * 0.05, 0.16) for i in range(20)]
for ic, lb, x, y, w in TILES:
    ev.append(('pop', at(w, 40), 0.4))
for i, (k, t, v) in enumerate(ev):
    f, d = SFX[k]
    A(f'<audio id="sfx{i}" src="assets/sfx/{f}.mp3" data-start="{round(t, 3)}" data-duration="{d}" data-track-index="{10 + i % 9}" data-volume="{v}"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
A('const CAPS=' + json.dumps(CAPS, ensure_ascii=False) + ';')
A('''const host=document.getElementById("caps");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t,,k],wi)=>{const s=document.createElement("span");s.className="w"+(k?" k":"");s.id="cap"+gi+"_"+wi;s.textContent=t;s.style.opacity="0";line.appendChild(s);});
host.appendChild(line);tl.set(line,{opacity:1},g.s);
g.w.forEach(([,t,k],wi)=>{const id="#cap"+gi+"_"+wi;tl.fromTo(id,{opacity:0,scale:0.55,y:24,rotationX:-60},{opacity:1,scale:1,y:0,rotationX:0,duration:0.16,ease:"back.out(3)"},Math.max(g.s,t-0.05));
 if(k)tl.fromTo(id,{backgroundColor:"rgba(26,43,76,0)"},{backgroundColor:"rgba(26,43,76,0.92)",duration:0.1},Math.max(g.s,t-0.02));});
tl.set(line,{opacity:0},g.e);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.4},Object.assign({opacity:1,scale:1,duration:0.26,ease:"back.out(2.6)"},o||{}),t);
const chip=(s,t)=>tl.fromTo(s,{opacity:0,rotationX:-90,y:40,xPercent:-50},{opacity:1,rotationX:0,y:0,xPercent:-50,duration:0.32,ease:"back.out(2)",transformPerspective:800},t);
const fade=(s,t,d)=>tl.fromTo(s,{opacity:0},{opacity:1,duration:d||0.25,ease:"none"},t);
const fl=(t,o)=>tl.fromTo("#flash",{opacity:o||0.6},{opacity:0,duration:0.25,ease:"power2.out",immediateRender:false},t);
const shake=(s,t,a)=>{a=a||1;tl.fromTo(s,{x:0,y:0},{keyframes:[{x:-16*a,y:10*a},{x:13*a,y:-11*a},{x:-9*a,y:7*a},{x:6*a,y:-4*a},{x:0,y:0}],duration:0.3,ease:"none",immediateRender:false},t);};
const glitch=(s,t)=>tl.fromTo(s,{x:0,skewX:0,filter:"drop-shadow(0px 0 0 rgba(255,0,60,0)) drop-shadow(0px 0 0 rgba(0,220,255,0))"},{keyframes:[
 {x:-40,skewX:8,filter:"drop-shadow(14px 0 0 rgba(255,0,60,.75)) drop-shadow(-14px 0 0 rgba(0,220,255,.75))",duration:0.05},
 {x:30,skewX:-6,filter:"drop-shadow(-10px 0 0 rgba(255,0,60,.7)) drop-shadow(10px 0 0 rgba(0,220,255,.7))",duration:0.05},
 {x:-12,skewX:2,filter:"drop-shadow(6px 0 0 rgba(255,0,60,.5)) drop-shadow(-6px 0 0 rgba(0,220,255,.5))",duration:0.05},
 {x:0,skewX:0,filter:"drop-shadow(0px 0 0 rgba(255,0,60,0)) drop-shadow(0px 0 0 rgba(0,220,255,0))",duration:0.07}],ease:"none",immediateRender:false},t);
const words3d=(sel,t,gap)=>document.querySelectorAll(sel).forEach((w,i)=>tl.fromTo(w,{opacity:0,rotationX:-95,z:-200,y:40},{opacity:1,rotationX:0,z:0,y:0,duration:0.34,ease:"back.out(1.8)",transformPerspective:900},t+i*(gap||0.09)));
tl.set("#flash",{opacity:0},0);''')
A(f'tl.fromTo("#barf",{{scaleX:0}},{{scaleX:1,duration:{DUR},ease:"none"}},0);fade("#brand",0.3,0.4);')
# entradas 3D y Ken Burns por toma
for sid, a, b, img, ent, org, s0, s1, pos in SH:
    end = b if sid == 's12' else b + OV
    d = round(end - a, 3)
    kb = f'#{sid} .kb' if sid != 's05' else '#card5 img'
    A(f'tl.fromTo("{kb}",{{scale:{s0},transformOrigin:"{org}"}},{{scale:{s1},duration:{d},ease:"none"}},{a});')
    R = f'#{sid} .rig'
    if ent == 'door':
        A(f'tl.fromTo("{R}",{{rotationY:-100,transformOrigin:"0% 50%",filter:"brightness(.4)"}},{{rotationY:0,filter:"brightness(1)",duration:0.5,ease:"power3.out"}},{a});')
    elif ent == 'cube':
        A(f'tl.fromTo("{R}",{{rotationY:90,x:540,z:-540,transformOrigin:"50% 50%",filter:"brightness(.45)"}},{{rotationY:0,x:0,z:0,filter:"brightness(1)",duration:0.42,ease:"power2.out"}},{a});')
    elif ent == 'flipx':
        A(f'tl.fromTo("{R}",{{rotationX:85,transformOrigin:"50% 0%",filter:"brightness(.4)"}},{{rotationX:0,filter:"brightness(1)",duration:0.45,ease:"back.out(1.2)"}},{a});')
    elif ent == 'zoom':
        A(f'tl.fromTo("{R}",{{scale:1.5,filter:"blur(14px)"}},{{scale:1,filter:"blur(0px)",duration:0.35,ease:"power3.out"}},{a});')
    elif ent == 'glitch':
        A(f'tl.fromTo("{R}",{{opacity:0}},{{opacity:1,duration:0.04}},{a});glitch("{R}",{a});fl({a},0.45);')
    elif ent == 'card':
        A(f'tl.fromTo("{R}",{{y:1920,rotationX:35,transformOrigin:"50% 100%"}},{{y:0,rotationX:0,duration:0.5,ease:"power3.out"}},{a});')
# golpes de zoom al pulso (cada compás, dentro de cada toma de foto)
bars = [round(BPM0 + 4 * BEAT * n, 3) for n in range(int(DUR / (4 * BEAT)) + 1)]
for sid, a, b, *_ in SH:
    if sid == 's05':
        continue
    for t in bars:
        if a + 0.6 < t < b - 0.3:
            A(f'tl.fromTo("#{sid} .beat",{{scale:1.045}},{{scale:1,duration:0.38,ease:"power2.out",immediateRender:false}},{t});')
A(f'tl.set("{",".join(f"#{x[0]} .beat" for x in SH if x[0] != "s05")}",{{scale:1}},0);')
# --- hook
HW = ['dueño', 'o', 'director', 'de', 'empresa']
for i, w in enumerate(HW):
    t = round(at(w) - 0.04, 3)
    A(f'tl.fromTo("#hk{i}",{{opacity:0,scale:2.6,rotationX:70,z:300}},{{opacity:1,scale:1,rotationX:0,z:0,duration:0.24,ease:"power4.out",transformPerspective:900}},{t});')
A(f'shake("#s01 .rig",{at("empresa")},1.2);fl({at("empresa")},0.35);tl.to("#hook",{{opacity:0,y:-60,duration:0.2}},{round(T_TE - 0.12, 3)});')
# --- tomas con textos
A(f'fade("#e2",{SA["s02"] + 0.25});words3d("#h2",{round(at("una") - 0.05, 3)});tl.set("#h2 .g",{{opacity:0}},0);tl.fromTo("#h2 .g",{{opacity:0,rotationX:-90}},{{opacity:1,rotationX:0,duration:0.3,ease:"back.out(2)",transformPerspective:900}},{round(at("frente") - 0.25, 3)});')
pass
TFL = round(at('aprovechar') - 0.15, 3)
A(f'''chip("#c4",{at("disfrutar")});tl.to("#c4",{{opacity:0,duration:0.12}},{TFL - 0.1});
tl.to("#flipw",{{scale:0.8,duration:0.2,ease:"power2.in"}},{TFL - 0.2});tl.to("#flipw",{{rotationY:180,duration:0.55,ease:"power3.inOut"}},{TFL});tl.to("#flipw",{{scale:1,duration:0.25,ease:"power2.out"}},{TFL + 0.5});
tl.fromTo("#inv .k",{{scale:0.5,opacity:0}},{{scale:1,opacity:1,duration:0.3,ease:"back.out(2.4)"}},{TFL + 0.4});fade("#inv .s",{TFL + 0.6});
tl.to("#arp",{{attr:{{"stroke-dashoffset":0}},duration:0.6,ease:"power2.out"}},{TFL + 0.7});tl.to("#arh",{{opacity:1,duration:0.1}},{TFL + 1.25});shake("#s04 .rig",{at("inversión")},0.6);fl({at("inversión")},0.3);''')
A(f'''fade("#e5",{SA["s05"] + 0.35});
tl.fromTo("#card5",{{rotationY:-22,rotationX:10}},{{rotationY:18,rotationX:-4,duration:{round(T_RUF - SA["s05"], 2)},ease:"sine.inOut"}},{SA["s05"]});
tl.fromTo("#shine5",{{xPercent:-80}},{{xPercent:80,duration:0.9,ease:"power2.inOut"}},{SA["s05"] + 0.5});
tl.fromTo("#pin",{{y:-700,opacity:0,rotationY:0}},{{y:0,opacity:1,rotationY:720,duration:0.55,ease:"bounce.out"}},{round(at("ensenada") - 0.5, 3)});tl.fromTo("#pinshadow",{{scale:0,opacity:0}},{{scale:1,opacity:1,duration:0.5}},{round(at("ensenada") - 0.45, 3)});
chip("#c5a",{at("baja") - 0.1});
tl.to("#card5",{{y:-53.5,scale:1.674,borderRadius:0,boxShadow:"0 0 0 0 rgba(233,203,134,0)",rotationY:0,rotationX:0,duration:0.45,ease:"power3.inOut",overwrite:"auto"}},{round(at("casas") - 0.2, 3)});
tl.to("#pin,#pinshadow,#c5a,#e5",{{opacity:0,duration:0.15}},{round(at("casas") - 0.2, 3)});chip("#c5b",{at("casas") + 0.1});''')
A(f'chip("#c6a",{at("ruf")});chip("#c6b",{at("vista")});')
A(f'words3d("#h7 .g, #h7",{SA["s07"] + 0.1},0.12);tl.set("#h7 .g",{{opacity:1}},{SA["s07"] + 0.2});')
TC = at('considera')
A(f'''tl.fromTo("#book",{{opacity:0,rotationX:-80,y:-60,transformOrigin:"50% 0%",transformPerspective:1000}},{{opacity:1,rotationX:0,y:0,duration:0.5,ease:"back.out(1.4)"}},{round(TC - 0.3, 3)});
for(let d=0;d<14;d++)tl.to("#cd"+d,{{backgroundColor:"#C5A564",color:"#ffffff",scale:1.08,duration:0.08}},{at("rentas")}+d*0.12);''')
A(f'fade("#e9",{SA["s09"] + 0.3});words3d("#h9",{round(at("flujo") - 0.1, 3)});chip("#c9",{at("esquema") - 0.05});')
A(f'words3d("#h10",{SA["s10"] + 0.1},0.14);chip("#c10",{at("equipamiento") - 0.05});fade("#f10",{SA["s10"] + 0.6});')
A(f'words3d("#h11a",{at("construye")},0.14);chip("#c11",{at("sin", 48) - 0.05});shake("#s11 .rig",{at("patrimonio")},0.6);')
NREP = int((DUR - at('botón') - 0.8) / 0.4) // 2 * 2 + 1
A(f'''words3d("#ctat",{SA["s12"] + 0.2},0.1);pop("#cta",{at("botón") - 0.1});
tl.to("#cta",{{scale:1.07,duration:0.4,ease:"sine.inOut",yoyo:true,repeat:{NREP}}},{at("botón") + 0.3});tl.fromTo("#ar",{{y:-8}},{{y:12,duration:0.4,yoyo:true,repeat:{NREP},ease:"power1.inOut"}},{at("botón") + 0.3});''')
# --- precio
A(f'''fade("#pe",{pa + 0.1});
tl.fromTo("#pr1",{{opacity:0,rotationY:-90,x:-200}},{{opacity:1,rotationY:0,x:0,duration:0.42,ease:"back.out(1.6)"}},{round(T39 - 0.2, 3)});shake("#precio",{T39 + 0.15});fl({T39 + 0.15},0.3);
tl.fromTo("#pr2",{{opacity:0,rotationY:90,x:200}},{{opacity:1,rotationY:0,x:0,duration:0.42,ease:"back.out(1.6)"}},{round(T49 - 0.2, 3)});shake("#precio",{T49 + 0.15});fl({T49 + 0.15},0.3);
tl.fromTo("#pmx",{{opacity:0,rotationX:-90,transformPerspective:900}},{{opacity:1,rotationX:0,duration:0.35,ease:"back.out(2)"}},{round(TMILL - 0.05, 3)});fade("#ptag",{TMILL + 0.4});
tl.fromTo("#co1",{{opacity:0,y:-300,rotationY:0}},{{opacity:1,y:0,rotationY:720,duration:0.8,ease:"bounce.out"}},{T39});
tl.to("#pr1,#pr2",{{rotationY:8,duration:1.2,yoyo:true,repeat:1,ease:"sine.inOut"}},{TMILL + 0.4});''')
# --- pagos
A(f'''fade("#qe",{qa + 0.1});words3d("#qt",{qa + 0.15},0.08);
tl.fromTo("#pworld",{{rotationX:18,rotationY:-28}},{{rotationX:12,rotationY:22,duration:{round(qb - qa + OV, 2)},ease:"sine.inOut"}},{qa});
tl.set(".col",{{opacity:0}},0);
[["a",{T10}],["b",{T10b}],["c",{T80}]].forEach(([c,t])=>{{tl.set("#col"+c,{{opacity:1}},t-0.05);tl.fromTo("#col"+c,{{scaleY:0,transformOrigin:"50% 100%"}},{{scaleY:1,duration:c==="c"?0.6:0.35,ease:"back.out(1.4)"}},t-0.05);
pop("#pv"+c,t+0.15);fade("#pl"+c,t+0.2);}});
shake("#pagos",{T80 + 0.5},1.1);fl({T80 + 0.5},0.3);fade("#mini",{T20 - 0.2});
for(let i=0;i<20;i++)tl.to("#mn"+i,{{backgroundColor:"#E9CB86",scale:1.2,duration:0.05}},{T20}+i*0.05);''')
# --- equipamiento + $450,000
random.seed(11); pts = []
for i in range(26):
    ang = i / 26 * 2 * math.pi + random.uniform(-.12, .12); r = random.uniform(320, 560)
    pts.append((round(math.cos(ang) * r), round(math.sin(ang) * r * 0.8), round(random.uniform(0.6, 1.7), 2)))
A('const PTS=' + json.dumps(pts) + ';')
A(f'fade("#ee",{ea + 0.05});tl.set(".tile",{{opacity:0}},0);')
for ic, lb, x, y, w in TILES:
    t = round(at(w, 40) - 0.08, 3)
    A(f'tl.set("#t-{ic}",{{opacity:1}},{t});tl.fromTo("#t-{ic}",{{rotationY:-180,scale:0.7}},{{rotationY:0,scale:1,duration:0.45,ease:"back.out(1.5)"}},{t});')
A(f'''tl.to(".tile",{{opacity:0,scale:0.5,y:-260,rotationX:60,duration:0.35,ease:"power3.in",stagger:0.04}},{round(TV - 0.35, 3)});tl.to("#ee",{{opacity:0,duration:0.2}},{round(TV - 0.2, 3)});
fade("#eqa",{TV - 0.05});tl.set("#eqv .n",{{opacity:0}},0);tl.set("#eqv .n",{{opacity:1}},{TV});tl.set("#eqc",{{opacity:0}},0);tl.fromTo("#rays",{{opacity:0,rotation:0}},{{opacity:1,rotation:70,duration:{round(eb + OV - TV, 2)},ease:"none"}},{TV});
const ev={{v:0}};tl.set("#eqn",{{opacity:1}},{TV});tl.fromTo(ev,{{v:0}},{{v:450000,duration:{round(T450 - TV, 2)},ease:"power2.in",onUpdate:()=>{{document.getElementById("eqn").textContent="$"+(Math.round(ev.v/1000)*1000).toLocaleString("en-US");}}}},{TV});
tl.set("#eqn",{{textContent:"$450,000"}},{T450});tl.fromTo("#eqv .n",{{scale:1.5}},{{scale:1,duration:0.45,ease:"elastic.out(1,0.45)",immediateRender:false}},{T450});
fl({T450},0.7);shake("#equipo",{T450},1.3);pop("#eqc",{T450 + 0.25});fade("#eqf",{T450 + 0.4});
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{{x:0,y:0,scale:s,opacity:1}},{{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false}},{T450}));tl.set(".pt",{{opacity:0}},0);
tl.to("#eqv .n",{{scale:1.06,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"}},{T450 + 0.5});''')
TL = round(at('légasi') - 0.15, 3)
A(f'tl.to("#ctat",{{opacity:0,rotationX:90,duration:0.25,transformPerspective:900}},{TL});tl.fromTo("#ctab",{{opacity:0,rotationX:-90,scale:0.8}},{{opacity:1,rotationX:0,scale:1,duration:0.35,ease:"back.out(2)",transformPerspective:900}},{TL + 0.15});fl({TL + 0.15},0.3);')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P + 'index.html', 'w').write('\n'.join(H))
print('DUR', DUR, '| tomas', len(SH), '| subtítulos', len(CAPS))
print(' | '.join(' '.join(w[0] for w in c['w']) for c in CAPS))
