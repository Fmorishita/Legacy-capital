# California v2 (fotos) — guion V2 de Fran con sus cambios del 18 nov 2026. Genera index.html.
# Voz: Qwen3-TTS 1.7B (Apache 2.0), locutor diseñado por descripción y clonado por párrafo (assets/voz.wav).
# Los cortes se calculan con los tiempos por palabra (transcript.json) y los inicios de párrafo (parrafos.json).
import json, math, random
P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v2-es/'
RAW = [[w['text'], w['start'], w['end']] for w in json.load(open(P + 'transcript.json'))]
PAR = json.load(open(P + 'parrafos.json'))  # [[ini, fin], ...] de cada párrafo dentro de assets/voz.wav
VOZ_FIN = PAR[-1][1]
# --- subtítulos: ortografía del guion y cifras con formato de pantalla
FIX = json.load(open(P + 'correcciones.json'))  # {"texto whisper": "texto en pantalla"}
words = []
for t, s, e in RAW:
    rep = FIX.get(t, t)
    if rep == '':
        continue
    if isinstance(rep, list):  # una palabra de Whisper que hay que partir: [[texto, ini, fin], ...]
        words += [list(x) for x in rep]
        continue
    words.append([rep, s, e])
# Whisper a veces adelanta la primera palabra de un párrafo a la pausa anterior: se ajusta al inicio real del párrafo
for w in words:
    for k in range(1, len(PAR)):
        if PAR[k - 1][1] - 0.02 < w[1] < PAR[k][0]:
            w[1] = PAR[k][0]
for k in range(1, len(words)):
    if words[k][1] < words[k - 1][1] + 0.03:
        words[k][1] = round(words[k - 1][1] + 0.03, 3)
for k in range(len(words)):
    nxt = words[k + 1][1] if k + 1 < len(words) else words[k][2]
    words[k][2] = round(max(min(words[k][2], nxt), words[k][1] + 0.03), 3)
norm = lambda x: x.lower().strip('¿?¡!,.:;…"«»$')


def at(txt, par, nth=1, pre=False):
    """Inicio de la palabra n igual a txt (o que empieza con txt si pre=True) dentro del párrafo par."""
    a, b = PAR[par]
    c = 0
    for t, s, e in words:
        if a - 0.08 <= s < b + 0.05 and (norm(t).startswith(norm(txt)) if pre else norm(t) == norm(txt)):
            c += 1
            if c == nth:
                return s
    raise KeyError((txt, par))


ps = lambda k: round(PAR[k][0] - 0.08, 3)  # corte al inicio de un párrafo
cw = lambda txt, par, nth=1: round(at(txt, par, nth) - 0.06, 3)  # corte en una palabra
END0 = round(VOZ_FIN + 0.25, 2)  # placa final
DUR = round(END0 + 1.35, 2)
MAP = (ps(2), ps(3)); PAY = (ps(6), ps(7)); GRO = (ps(7), ps(8))
# id, inicio, imagen, origen, s0, s1, x0, x1, titular
SH = [
    ('c01', 0, 'c01', '40% 35%', 1.04, 1.16, 0, 0, None),
    ('c02', cw('¿y', 0), 'c02', '50% 60%', 1.16, 1.04, 0, 0, ('¿Y SI TU PRÓXIMA CASA', 'ESTUVIERA EN MÉXICO?')),
    ('b01', ps(1), 'b01', '50% 45%', 1.04, 1.14, -1, 1, ('UN NUEVO PROYECTO', 'EN ENSENADA')),
    ('c04', cw('casas', 1), 'c04', '70% 40%', 1.12, 1.03, 2, -2, ('CASAS', 'DE UN NIVEL')),
    ('b02', cw('con', 1, 1), 'b02', '60% 50%', 1.03, 1.14, 0, 0, ('TU ROOF GARDEN', 'CON VISTA AL MAR')),
    ('b03', cw('para', 1), 'b03', '40% 40%', 1.14, 1.04, 0, 0, ('LOS MEJORES', 'ATARDECERES')),
    ('MAP', MAP[0]),
    ('c07', ps(3), 'c07', '50% 50%', 1.04, 1.14, 0, 0, None),
    ('c14', cw('tres', 3), 'c14', '50% 45%', 1.14, 1.04, 0, 0, None),
    ('c09', ps(4), 'c09', '50% 30%', 1.04, 1.12, 0, 0, ('¿LA QUIERES RENTAR', 'POR TEMPORADAS?')),
    ('c10', cw('desde', 4), 'c10', '45% 35%', 1.1, 1.0, 0, 0, None),
    ('c11', cw('y', 4), 'c11', '45% 55%', 1.04, 1.14, 0, 0, None),
    ('b04', ps(5), 'b04', '50% 40%', 1.04, 1.13, 0, 0, ('ACCESO', 'CONTROLADO')),
    ('c12', cw('las', 5), 'c12', '50% 60%', 1.14, 1.04, 0, 0, ('SEGURIDAD', '24/7')),
    ('PAY', PAY[0]),
    ('GRO', GRO[0]),
    ('c13', ps(8), 'c13', '50% 40%', 1.04, 1.12, -1, 1, ('RESERVA ESTE MES', 'EQUIPAMIENTO INCLUIDO')),
    ('bano', cw('cuartos', 8), 'bano', '50% 45%', 1.12, 1.04, 0, 0, None),
    ('c15', cw('roof', 8), 'c15', '50% 25%', 1.0, 1.05, 0, 0, None),
    ('c16', ps(9), 'c16', '50% 50%', 1.04, 1.14, 0, 0, ('IMAGINA', 'DESPERTAR AQUÍ')),
    ('b05', cw('y', 9), 'b05', '50% 45%', 1.14, 1.04, 0, 0, ('MAÑANAS', 'DE ALBERCA')),
    ('b06', cw('¿se', 9), 'b06', '40% 50%', 1.04, 1.14, -2, 2, ('¿SE ARMA', 'UNA PARTIDA?')),
    ('b07', ps(10), 'b07', '60% 50%', 1.04, 1.13, 0, 0, ('ASADORES', 'PARA LA CARNE ASADA')),
    ('b08', cw('y', 10), 'b08', '40% 55%', 1.13, 1.04, 0, 0, ('SALÓN', 'AL AIRE LIBRE')),
    ('c18', ps(11), 'c18', '50% 45%', 1.03, 1.14, 0, 0, ('EL PACÍFICO', 'DESDE TU ROOFTOP')),
    ('b09', ps(12), 'b09', '50% 30%', 1.02, 1.1, 0, 0, None),
    ('END', END0),
]
SC = []
for i, sh in enumerate(SH):
    if len(sh) == 2:
        continue
    nxt = SH[i + 1][1]
    sid, a, img, org, s0, s1, x0, x1, hl = sh
    SC.append((sid, round(a, 3), round(nxt, 3), img, org, s0, s1, x0, x1, hl))
SA = {x[0]: x[1] for x in SC}
HLTOP = {'c09': 800, 'c13': 800, 'c16': 800, 'c18': 800, 'b03': 870}
CAPTOP = {'b04': 640, 'b05': 1160, 'b07': 1170, 'b03': 1160}
NOCAP = {'c01', 'c02', 'c07', 'c14', 'b09'}
FLASH = [SA['b01'], MAP[0], SA['c07'], PAY[0], SA['c13'], SA['c16'], SA['b09'], END0]
# --- plusvalía proyectada (mismos supuestos que la animación del Doctor: 8% y 10% anual compuesto)
BASE = 215000
MESES = [0, 19, 60, 96]  # 2026 base, mediados de 2028 (≈19 meses desde nov 2026), 2031, 2034
XL = ['2026 / base', 'MEDIADOS 2028', '2031', '2034']
CO = [BASE * 1.08 ** (m / 12) for m in MESES]
OP = [BASE * 1.10 ** (m / 12) for m in MESES]
H = []; A = H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>California v2 — Legacy Capital</title>
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
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.62) 0%,rgba(7,29,41,.3) 22%,rgba(7,29,41,0) 36%,rgba(7,29,41,0) 52%,rgba(7,29,41,.38) 100%)}
.shade.low{background:linear-gradient(180deg,rgba(7,29,41,.25) 0%,rgba(7,29,41,0) 25%,rgba(7,29,41,0) 36%,rgba(7,29,41,.55) 58%,rgba(7,29,41,.45) 100%)}
.hl{position:absolute;left:80px;font-family:"PPCondensed",sans-serif;font-size:86px;line-height:1.12;letter-spacing:.01em;text-shadow:0 3px 12px rgba(0,0,0,.55);white-space:nowrap}
.hl .l2{color:#FFD086}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:16px;border-radius:4px}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 18px 8px;border-radius:20px;background:rgba(7,29,41,.55);text-align:center;font-family:"PPBold",sans-serif;font-size:60px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff;display:inline-block;margin:0 12px}
#captions{z-index:7}#logo{z-index:8;pointer-events:none}
#logo-in{position:absolute;left:0;right:0;top:1400px;display:flex;flex-direction:column;align-items:center;gap:6px}
#logo-in img{width:120px;height:auto;display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}#logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:38px;letter-spacing:.14em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 12px rgba(0,0,0,.6)}
#flash{position:absolute;inset:0;background:#FFF6E2;opacity:0;z-index:9;pointer-events:none}
/* hook */
#hook{position:absolute;left:70px;right:70px;top:800px;font-family:"PPCondensed";text-shadow:0 4px 14px rgba(0,0,0,.6)}
#hook .a{font-size:92px;line-height:1.05}
#hook .b{font-size:96px;line-height:1.05;color:#FFD086;display:flex;align-items:center;gap:22px;margin-top:10px;white-space:nowrap}
#hook .coin{width:100px;height:100px;flex:none;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1C9,#E7B54A 55%,#A47611);border:5px solid #FFE7A8;color:#6B4A08;font-family:"PPBold";font-size:62px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.4);text-shadow:none}
/* precios */
.pr{position:absolute;left:80px;top:290px;text-shadow:0 4px 14px rgba(0,0,0,.6)}
.pr .a{font-family:"PPCondensed";font-size:76px;line-height:1.1;letter-spacing:.02em}
.pr .d{font-family:"PPBold";font-size:40px;line-height:1.2;color:#FFD086;letter-spacing:.12em;margin-top:6px;margin-bottom:14px}
.pr .b{font-family:"PPCondensed";font-size:150px;line-height:1.2;white-space:nowrap}.pr .b small{font-size:64px;color:#FFD086;margin-left:16px}
.chk{position:absolute;height:92px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:42px;display:flex;align-items:center;padding:0 34px;box-shadow:0 10px 24px rgba(0,0,0,.4);white-space:nowrap}
/* animaciones */
.mg{background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%);overflow:hidden}
.mg .eb{position:absolute;left:0;right:0;top:300px;text-align:center;font-family:"PPBold";font-size:32px;letter-spacing:.2em;color:#FFD086}
.mg .tt{position:absolute;left:40px;right:40px;top:362px;text-align:center;font-family:"PPCondensed";font-size:96px;line-height:1.05;white-space:nowrap}
.mg .ru{position:absolute;left:465px;top:478px;width:150px;height:8px;border-radius:4px;background:#FFD086}
.grid{position:absolute;inset:-100px;background-image:linear-gradient(rgba(255,208,134,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(255,208,134,.06) 2px,transparent 2px);background-size:90px 90px}
.note{position:absolute;left:0;right:0;text-align:center;font-size:26px;color:#E9DCC0;font-style:italic}
/* mapa */
#mapw{position:absolute;left:197px;top:510px;width:686px;height:557px;border-radius:30px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.5);border:4px solid #FFD086}
#mapw img{width:100%;height:100%;display:block}
#ring{position:absolute;left:414px;top:902px;width:70px;height:70px;border-radius:50%;border:7px solid #FFD086}
.row{position:absolute;left:65px;right:65px;top:1090px;height:96px;border-radius:26px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 16px 0 30px;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.row .nm{flex:1;font-family:"PPBold";font-size:40px;line-height:1.05;white-space:nowrap}.row .nm small{display:block;font-family:"PPText";font-size:24px;color:#4A5568}
.row .tm{height:70px;border-radius:999px;background:#0E2A4A;color:#FFD086;display:flex;align-items:center;padding:0 30px;font-family:"PPBold";font-size:40px;white-space:nowrap}.row .tm span{font-family:"PPText";font-size:24px;color:#fff;margin-right:10px}
/* pagos */
#pbar{position:absolute;left:65px;right:65px;top:540px;height:110px;border-radius:24px;background:rgba(255,255,255,.08);border:3px solid rgba(255,208,134,.5);overflow:hidden;display:flex}
#pbar div{height:100%}
#pb1{width:10%;background:#FFD086}#pb2{width:10%;background:repeating-linear-gradient(90deg,#E7B54A 0 4px,#C99A2E 4px 8.5px)}#pb3{width:80%;background:linear-gradient(90deg,#2F6E9A,#1D4E74)}
.pcard{position:absolute;left:65px;right:65px;height:170px;border-radius:30px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 34px;box-shadow:0 12px 30px rgba(0,0,0,.4)}
.pcard .n{width:250px;font-family:"PPCondensed";font-size:120px;line-height:1;color:#0E2A4A}
.pcard .tx{flex:1}.pcard .t{font-family:"PPBold";font-size:44px;line-height:1.1}.pcard .s{font-size:30px;line-height:1.3;color:#8A620C;font-family:"PPBold"}
.dots{display:flex;gap:7px;margin-top:8px}.dots i{display:block;width:22px;height:22px;border-radius:50%;background:#E8DDC6}
/* plusvalía (misma lectura que la animación del Doctor, en USD) */
#gcard{position:absolute;left:40px;top:520px;width:1000px;height:600px;border-radius:30px;background:#FFFBF3;border:2px solid #EAD9B8;box-shadow:0 14px 40px rgba(0,0,0,.35);color:#0E2A4A}
#gct{position:absolute;left:30px;top:18px;font-family:"PPBold";font-size:28px;line-height:1.3}
#glg{position:absolute;left:30px;top:60px;font-size:22px;line-height:1.3;display:flex;gap:36px;white-space:nowrap}
#glg i{display:inline-block;width:46px;height:8px;border-radius:4px;vertical-align:middle;margin-right:10px}
#gsv{position:absolute;left:0;top:100px}
#gcnt{position:absolute;left:186px;top:118px;width:380px;height:92px;border-radius:20px;background:#0E2A4A;color:#FFD086;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(14,42,74,.35)}
#gcnt span{font-family:"PPText";font-size:19px;color:#fff;letter-spacing:.08em}#gcnt b{font-family:"PPCondensed";font-size:46px;line-height:1.05;font-weight:400}
#gpn{position:absolute;left:40px;top:1132px;width:1000px;height:116px;border-radius:26px;background:#F6E9D4;color:#0E2A4A}
#gpn .h{position:absolute;left:0;right:0;top:6px;text-align:center;font-family:"PPBold";font-size:24px;letter-spacing:.06em}
#gpn .c{position:absolute;top:36px;width:470px}#gpn .c div:first-child{font-family:"PPBold";font-size:20px;color:#8A620C;line-height:1.3}
#gpn .c b{font-family:"PPCondensed";font-size:40px;font-weight:400;line-height:1.15}#gpn .c em{font-style:normal;font-size:20px;color:#4A5568;margin-left:10px}
.gfn{position:absolute;left:30px;right:30px;text-align:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:23px;line-height:1.2;color:#E9DCC0;white-space:nowrap}
/* equipamiento y promo */
#promo{position:absolute;left:65px;right:65px;top:836px;height:412px;border-radius:40px;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(23,63,102,.96) 0%,rgba(7,29,41,.96) 80%);border:4px solid #FFD086;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.55)}
#rays{position:absolute;left:-560px;top:-760px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.15) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)}
#promo .a{position:absolute;left:0;right:0;top:14px;line-height:1.1;text-align:center;font-family:"PPCondensed";font-size:54px;letter-spacing:.08em;color:#FFD086}
#pn{position:absolute;left:0;right:0;top:116px;text-align:center;font-family:"PPCondensed";font-size:150px;line-height:1;text-shadow:0 0 30px rgba(255,208,134,.85),0 0 80px rgba(255,208,134,.4);white-space:nowrap}
#pn small{font-size:64px;color:#FFD086;margin-left:14px}
#promo .c{position:absolute;left:0;right:0;top:302px;line-height:1.1;text-align:center;font-family:"PPBold";font-size:40px}
#promo .d{position:absolute;left:0;right:0;top:356px;text-align:center}#promo .d span{display:inline-block;background:#FFD086;color:#071D29;border-radius:999px;padding:6px 32px;font-family:"PPBold";font-size:34px}
.pt{position:absolute;left:470px;top:160px;width:16px;height:16px;border-radius:50%;background:#FFD086;opacity:0}
/* CTA */
#cta-t{position:absolute;left:0;right:0;top:560px;text-align:center;font-family:"PPCondensed";font-size:104px;line-height:1;text-shadow:0 4px 14px rgba(0,0,0,.65)}
#cta{position:absolute;left:110px;right:110px;top:1050px;height:116px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 12px 30px rgba(0,0,0,.45)}
#cta-wa{position:absolute;left:0;right:0;top:1186px;text-align:center;font-family:"PPBold";font-size:40px;text-shadow:0 2px 8px rgba(0,0,0,.8)}#cta-wa span{color:#FFD086}
/* placa final */
#fin{background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%)}
#fin-crest{position:absolute;left:50%;top:330px;width:230px;height:auto;margin-left:-115px}
#fin-brand{position:absolute;left:0;right:0;top:650px;text-align:center;font-family:"Cinzel",serif;font-weight:700;font-size:58px;letter-spacing:.1em}
#fin-re{position:absolute;left:0;right:0;top:728px;text-align:center;font-size:28px;letter-spacing:.42em;color:#FFD086}
#fin-mas{position:absolute;left:0;right:0;top:830px;text-align:center;font-family:"PPCondensed";font-size:110px;line-height:1}
#fin-cta{position:absolute;left:120px;right:120px;top:990px;height:116px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px}
#fin-wa{position:absolute;left:0;right:0;top:1140px;text-align:center;font-family:"PPBold";font-size:40px}#fin-wa span{color:#FFD086}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
'''.replace('%DUR%', str(DUR)))
for sid, a, b, img, org, s0, s1, x0, x1, hl in SC:
    low = sid in HLTOP or sid in ('c01', 'c15', 'b09')
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="0"><div class="pz"><div class="kb" data-layout-allow-overflow><img src="assets/img/{img}.jpg" alt="" /></div></div><div class="shade{" low" if low else ""}"></div>')
    if hl:
        A(f'<div class="hl" id="{sid}-hl" style="top:{HLTOP.get(sid, 290)}px"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    if sid == 'c01':
        A('<div id="hook"><div class="a">TRABAJAS EN EE.UU.</div><div class="b"><span class="coin" id="coin">$</span><span>GANAS EN DÓLARES</span></div></div>')
    if sid == 'c07':
        A('<div class="pr" id="pr1"><div class="a">2 HABITACIONES</div><div class="d">DESDE</div><div class="b"><span id="pn1">$215,000</span><small>USD</small></div></div>')
    if sid == 'c14':
        A('<div class="pr" id="pr2"><div class="a">3 HABITACIONES</div><div class="d">DESDE</div><div class="b"><span id="pn2">$235,000</span><small>USD</small></div></div>')
    if sid == 'c10':
        A('<div class="chk" id="k1" style="left:65px;top:300px">✓ Luces</div><div class="chk" id="k2" style="left:65px;top:410px">✓ Minisplits</div>')
    if sid == 'c11':
        A('<div class="chk" id="k3" style="left:500px;top:860px">✓ Cerradura</div>')
    if sid == 'c13':
        A('<div class="chk" id="e1" style="left:80px;top:650px">✓ Cocina</div>')
    if sid == 'bano':
        A('<div class="chk" id="e1b" style="left:80px;top:560px">✓ Cocina</div><div class="chk" id="e2" style="left:80px;top:672px">✓ Cuartos</div><div class="chk" id="e3" style="left:80px;top:784px">✓ Baño</div>')
    if sid == 'c15':
        A('<div class="chk" id="e4" style="left:80px;top:300px">✓ Roof garden</div>')
        A('<div id="promo"><div id="rays"></div><div class="a" id="pa">VALOR DE HASTA</div><div id="pn"><span id="pnv">$0</span><small>USD</small></div>'
          + ''.join(f'<div class="pt" id="pt{i}"></div>' for i in range(24))
          + '<div class="c" id="pcx">EN EQUIPAMIENTO</div><div class="d" id="pd"><span>Al reservar tu casa este mes</span></div></div>')
    if sid == 'b09':
        A('<div id="cta-t">MÁS INFORMACIÓN</div><div id="cta"><span>Haz clic en el botón de abajo</span><span id="arw">↓</span></div><div id="cta-wa">WhatsApp <span>+52 646 256 3006</span></div>')
    A('</div>')
# ---------- A01 mapa
ma, mb = MAP
A(f'<div id="mapa" class="clip mg" data-start="{ma}" data-duration="{round(mb - ma, 3)}" data-track-index="0"><div class="grid" id="mgrid" data-layout-allow-overflow></div><div class="eb" id="m-eb">CARRETERA PRINCIPAL · EL SAUZAL</div><div class="tt" id="m-tt">A UN PASO <span style="color:#FFD086">DE CALIFORNIA</span></div><div class="ru" id="m-ru"></div>')
A('<div id="mapw"><img id="mapi" src="assets/img/mapa.png" alt="" /></div><div id="ring"></div>')
ROWS = [('Frontera con San Diego', 'San Ysidro', '1 h 30 min', 'frontera'), ('Tijuana', '', '1 h', 'tijuana'), ('Mexicali', '', '3 h', 'mexicali')]
for i, (n, s, t, w) in enumerate(ROWS):
    A(f'<div class="row" id="mr{i}"><div class="nm">{n}{"<small>" + s + "</small>" if s else ""}</div><div class="tm"><span>aprox.</span>{t}</div></div>')
A('<div class="note" id="m-note" style="top:1200px">Tiempos aproximados en auto; el cruce fronterizo puede variar.</div></div>')
# ---------- A02 pagos
pa_, pb_ = PAY
A(f'<div id="pagos" class="clip mg" data-start="{pa_}" data-duration="{round(pb_ - pa_, 3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="p-eb">PLAN DE PAGOS</div><div class="tt" id="p-tt">CUIDA <span style="color:#FFD086">TU LIQUIDEZ</span></div><div class="ru" id="p-ru"></div>')
A('<div id="pbar"><div id="pb1"></div><div id="pb2"></div><div id="pb3"></div></div>')
A('<div class="pcard" id="pc-a" style="top:690px"><div class="n" id="pna">10%</div><div class="tx"><div class="t">de enganche</div><div class="s">A la firma · ej.: $21,500 USD*</div></div></div>')
A('<div class="pcard" id="pc-b" style="top:880px"><div class="n" id="pnb">10%</div><div class="tx"><div class="t">en 20 mensualidades</div><div class="s">En la construcción · ej.: 20 × $1,075 USD*</div><div class="dots">' + ''.join(f'<i id="d{i}"></i>' for i in range(20)) + '</div></div></div>')
A('<div class="pcard" id="pc-c" style="top:1070px"><div class="n" id="pnc">80%</div><div class="tx"><div class="t">contra entrega</div><div class="s" id="pc-c-s">Prevista: mediados de 2028</div></div></div>')
A('<div class="note" id="p-note" style="top:1258px;font-size:24px">*Ejemplo con casa de 2 habitaciones desde $215,000 USD.</div></div>')
# ---------- A03 plusvalía proyectada
ga, gb = GRO
X = [150, 400, 650, 900]
yv = lambda v: 420 - (v / 1000 - 200) * 1.36
grid = ''.join(f'<line x1="120" y1="{yv(v * 1000):.1f}" x2="960" y2="{yv(v * 1000):.1f}" stroke="#E2E6EE" stroke-width="2"/><text x="108" y="{yv(v * 1000) + 7:.1f}" text-anchor="end" font-family="PPText" font-size="20" fill="#0E2A4A">${v} mil</text>' for v in range(200, 481, 40))
xl = ''.join(f'<text x="{x}" y="470" text-anchor="middle" font-family="PPBold" font-size="23" fill="#0E2A4A">{t}</text>' for x, t in zip(X, XL))
pth = lambda vals: 'M' + ' L'.join(f'{x},{yv(v):.1f}' for x, v in zip(X, vals))
k_ = lambda v: f'${round(v / 1000):,} mil'


def lab(i, x, v, col, dy):
    y = yv(v) + dy
    return f'<g class="lb" id="lb{i}"><rect x="{x - 78}" y="{y - 22}" width="156" height="44" rx="10" fill="{col}"/><text x="{x}" y="{y + 10}" text-anchor="middle" font-family="PPBold" font-size="27" fill="#fff">{k_(v)}</text></g>'


labs = lab(0, X[0] + 56, BASE, '#0E2A4A', -40) + lab(1, X[1], OP[1], '#0E2A4A', -44) + lab(2, X[1] + 40, CO[1], '#A47611', 44) + lab(3, X[2] - 14, OP[2], '#0E2A4A', -46) \
    + lab(4, X[2] + 40, CO[2], '#A47611', 46) + lab(5, X[3] - 20, OP[3], '#0E2A4A', -46) + lab(6, X[3] - 20, CO[3], '#A47611', 48)
dots = ''.join(f'<circle class="dt" id="gd{k}{j}" cx="{x}" cy="{yv(v):.1f}" r="10" fill="{c}"/>' for k, (vals, c) in enumerate(((OP, '#0E2A4A'), (CO, '#C99A2E'))) for j, (x, v) in enumerate(zip(X, vals)))
A(f'<div id="plus" class="clip mg" data-start="{ga}" data-duration="{round(gb - ga, 3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="g-eb">TU PATRIMONIO</div><div class="tt" id="g-tt">PLUSVALÍA <span style="color:#FFD086">PROYECTADA</span></div><div class="ru" id="g-ru"></div>')
A(f'''<div id="gcard"><div id="gct">Valor estimado de la casa (USD)</div>
<div id="glg"><span><i style="background:#C99A2E"></i>Conservador · 8% anual</span><span><i style="background:#0E2A4A"></i>Optimista · 10% anual</span></div>
<svg id="gsv" width="1000" height="490" viewBox="0 0 1000 490">{grid}{xl}
<path id="glo" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="{pth(OP)}" fill="none" stroke="#0E2A4A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<path id="glc" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="{pth(CO)}" fill="none" stroke="#C99A2E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>{dots}{labs}
<circle id="gring" cx="{X[3]}" cy="{yv(OP[3]):.1f}" r="14" fill="none" stroke="#C99A2E" stroke-width="6" opacity="0"/></svg>
<div id="gcnt"><span>A LA ENTREGA · MEDIADOS 2028</span><b id="gcntv">${BASE:,}</b></div></div>''')
A(f'''<div id="gpn"><div class="h">ENTREGA · MEDIADOS 2028</div>
<div class="c" style="left:40px"><div>CONSERVADOR 8%</div><b>${round(CO[1]):,}</b><em>Plusvalía: ${round(CO[1] - BASE):,}</em></div>
<div class="c" style="left:530px"><div>OPTIMISTA 10%</div><b>${round(OP[1]):,}</b><em>Plusvalía: ${round(OP[1] - BASE):,}</em></div></div>''')
A(f'<div class="gfn" id="gf1" style="top:1256px">Cálculo: ${BASE:,} × (1 + tasa anual)^(meses/12). Mediados de 2028: {MESES[1]} meses; 2031: 5 años; 2034: 8 años.</div>')
A('<div class="gfn" id="gf2" style="top:1288px">Supuestos de apreciación anual compuesta de 8% y 10%. Escenario ilustrativo, no garantizado.</div></div>')
# ---------- placa final
A(f'''<div id="fin" class="clip" data-start="{END0}" data-duration="{round(DUR - END0, 3)}" data-track-index="0">
<img id="fin-crest" src="assets/crest.png" alt="Legacy Capital" /><div id="fin-brand">LEGACY CAPITAL</div><div id="fin-re">REAL ESTATE</div>
<div id="fin-mas">MÁS INFORMACIÓN</div><div id="fin-cta"><span>Haz clic en el botón de abajo</span><span id="fin-arrow">↓</span></div><div id="fin-wa">WhatsApp <span>+52 646 256 3006</span></div></div>''')
# ---------- capas globales
A(f'<div id="logo" class="clip" data-start="0" data-duration="{END0}" data-track-index="4"><div id="logo-in"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
A(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
A(f'<div id="fx" class="clip" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="flash"></div></div>')
for k, t in (('leak-a', round(SA['b01'] - 0.2, 2)), ('leak-b', round(SA['b09'] - 0.4, 2))):
    A(f'<div id="{k}" class="clip" data-composition-id="{k}" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="{t}" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>')
A(f'<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="{round(VOZ_FIN + 0.2, 2)}" data-track-index="8" data-volume="1"></audio>')
MV = 0.05
A(f'''<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":{MV * 1.6}}},{{"t":0.6,"v":{MV}}},{{"t":{round(END0 - 0.2, 2)},"v":{MV}}},{{"t":{round(END0 + 0.3, 2)},"v":{MV * 1.8}}},{{"t":{DUR},"v":0}}]}}]}}'></audio>''')
SFX = {'sw': ('fast-small-sweep-166', 0.8), 'st': ('short-transition-sweep-175', 0.65), 'who': ('cinematic-whoosh-fast-1492', 1.38), 'imp': ('quick-zoom-impact-772', 1.25),
       'wu': ('syn-whoosh-up', 0.6), 'wd': ('syn-whoosh-down', 0.62), 'ss': ('syn-swish', 0.31), 'wl': ('syn-whoosh-low', 0.83), 'pop': ('syn-pop', 0.2), 'ph': ('syn-pop-hi', 0.18),
       'tk': ('syn-tick', 0.1), 'coin': ('syn-coin', 0.73), 'cha': ('syn-chaching', 1.14), 'shim': ('syn-shimmer', 0.94), 'rise': ('syn-riser', 1.04), 'boom': ('syn-boom', 0.94), 'thud': ('syn-thud', 0.33)}
cuts = sorted(set([a for _, a, *_ in SC if a > 0] + [MAP[0], PAY[0], GRO[0]]))
rot = ['ss', 'wd', 'sw', 'wu', 'ss', 'st', 'wd', 'sw', 'wl', 'ss']
ev = []
for i, c in enumerate(cuts):
    k = 'who' if c in FLASH else rot[i % len(rot)]
    ev.append((k, max(0, c - (0.3 if k in ('wu', 'wl', 'who') else 0.12)), 0.22 if k != 'who' else 0.3))
T215, T235, T25 = at('$215', 3, pre=True), at('$235', 3, pre=True), at('$25', 8, pre=True)
ev += [('boom', 0.03, 0.35), ('coin', at('ganas', 0) + 0.05, 0.3), ('pop', at('ganas', 0) + 0.25, 0.35),
       ('thud', SA['c07'] + 0.1, 0.35), ('cha', T215 + 0.1, 0.3), ('thud', SA['c14'] + 0.1, 0.35), ('cha', T235 + 0.1, 0.3),
       ('ph', at('luces', 4), 0.4), ('ph', at('minisplits', 4), 0.4), ('pop', at('cerradura', 4), 0.4),
       ('pop', at('frontera', 2), 0.4), ('pop', at('tijuana', 2), 0.4), ('pop', at('mexicali', 2), 0.4), ('shim', MAP[0] + 0.5, 0.25),
       ('thud', at('acceso', 5), 0.35), ('shim', at('24', 5), 0.25),
       ('thud', at('10%', 6), 0.45), ('pop', at('10%', 6, 2), 0.4), ('thud', at('80%', 6), 0.45), ('shim', at('prevista', 6), 0.25)]
ev += [('tk', at('20', 6) + i * 0.055, 0.18) for i in range(20)]
ev += [('wd', GRO[0] + 0.3, 0.35), ('pop', GRO[0] + 0.5 + 1.6 * 0.32, 0.45), ('ph', GRO[0] + 0.5 + 1.6 * 0.65, 0.4), ('pop', GRO[0] + 0.5 + 1.6, 0.4),
       ('coin', GRO[0] + 2.35, 0.4), ('shim', at('plusvalía', 7), 0.3),
       ('pop', at('cocina', 8), 0.4), ('ph', max(at('cuartos', 8), SA['bano'] + 0.02), 0.4), ('pop', at('baño', 8), 0.4), ('ph', at('roof', 8), 0.4),
       ('rise', T25 - 0.95, 0.35), ('boom', T25, 0.5), ('cha', T25 + 0.02, 0.35), ('shim', T25 + 0.4, 0.25),
       ('pop', at('¿se', 9) + 0.1, 0.3), ('pop', at('clic', 12), 0.35), ('wl', END0 - 0.3, 0.25), ('thud', END0 + 0.1, 0.35)]
for i, (k, t, v) in enumerate(ev):
    f, d = SFX[k]
    A(f'<audio id="sfx{i}" src="assets/sfx/{f}.mp3" data-start="{round(t, 3)}" data-duration="{d}" data-track-index="{10 + i % 9}" data-volume="{v}"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# ---------- subtítulos por palabra (solo tomas de foto)
groups = []
for sid, a, b, *_ in SC:
    if sid in NOCAP:
        continue
    cur = []
    for w in words:
        if not (a - 0.06 <= w[1] < b - 0.06):
            continue
        if cur and (len(cur) >= 4 or len(' '.join(x[0] for x in cur)) + len(w[0]) > 20 or cur[-1][0][-1] in ',.:;?'):
            groups.append((cur, b, sid)); cur = []
        cur.append(w)
    if cur:
        groups.append((cur, b, sid))
G = [{'top': CAPTOP.get(sid, 1085), 's': SA[sid], 'end': min(b, g[-1][2] + 0.5), 'w': g} for g, b, sid in groups]
P15 = round(at('valor', 8) - 0.35, 2)  # la promo entra y el subtítulo se va
G = [g for g in G if not (g['s'] == SA['c15'] and g['w'][0][1] > P15)]
for g in G:
    if g['s'] == SA['c15']:
        g['end'] = min(g['end'], P15)
A('const CAPS=' + json.dumps(G, ensure_ascii=False) + ';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);});
host.appendChild(line);const st=Math.max(g.s,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.8},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t,e],wi)=>{const id="#cap-"+gi+"-"+wi;tl.to(id,{color:"#FFD086",scale:1.05,duration:0.07,ease:"power2.out"},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to(id,{color:"#ffffff",scale:1,duration:0.07,ease:"none"},nx[1]-0.04);});
const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.4},Object.assign({opacity:1,scale:1,duration:0.26,ease:"back.out(2.6)"},o||{}),t);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:50},Object.assign({opacity:1,y:0,duration:0.26,ease:"power3.out"},o||{}),t);
const fade=(s,t)=>tl.fromTo(s,{opacity:0},{opacity:1,duration:0.25,ease:"none"},t);
const fl=(t,o)=>tl.fromTo("#flash",{opacity:o||0.7},{opacity:0,duration:0.28,ease:"power2.out",immediateRender:false},t);
const shake=(s,t)=>tl.fromTo(s,{x:0,y:0},{keyframes:[{x:-14,y:9},{x:12,y:-10},{x:-8,y:6},{x:6,y:-3},{x:0,y:0}],duration:0.32,ease:"none",immediateRender:false},t);
tl.set("#flash",{opacity:0},0);''')
for sid, a, b, img, org, s0, s1, x0, x1, hl in SC:
    d = round(b - a, 3)
    A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},xPercent:{x0},transformOrigin:"{org}"}},{{scale:{s1},xPercent:{x1},duration:{d},ease:"none"}},{a});')
    if a > 0:
        A(f'tl.fromTo("#{sid} .pz",{{scale:1.14,filter:"blur(6px)"}},{{scale:1,filter:"blur(0px)",duration:0.3,ease:"power3.out"}},{a});')
    if hl:
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,y:40,scale:1.2}},{{opacity:1,y:0,scale:1,duration:0.24,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(a + 0.05, 3)});tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-60}},{{opacity:1,x:0,duration:0.24,ease:"power3.out"}},{round(a + 0.16, 3)});tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25}},{round(a + 0.25, 3)});')
for t in FLASH:
    A(f'fl({t});')
random.seed(7); pts = []
for i in range(24):
    ang = i / 24 * 2 * math.pi + random.uniform(-.1, .1); r = random.uniform(300, 520)
    pts.append((round(math.cos(ang) * r), round(math.sin(ang) * r * 0.7), round(random.uniform(0.6, 1.6), 2)))
A('const PTS=' + json.dumps(pts) + ';')
tg = at('ganas', 0)
A(f'''// hook (afirmaciones, sin precios)
tl.fromTo("#hook .a",{{opacity:0,scale:1.4,filter:"blur(12px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.32,ease:"power4.out",transformOrigin:"0 50%"}},0.03);
tl.fromTo("#hook .b",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.26,ease:"back.out(2)"}},{tg});
tl.fromTo("#coin",{{rotationY:0,scale:0.3}},{{rotationY:720,scale:1,duration:0.6,ease:"power3.out"}},{tg});
tl.to("#coin",{{scale:1.15,duration:0.18,yoyo:true,repeat:3,ease:"sine.inOut"}},{round(tg + 0.7, 2)});
tl.fromTo("#logo-in",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.4,ease:"power2.out"}},0.3);''')
for n, sid, tw, val in ((1, 'c07', T215, 215000), (2, 'c14', T235, 235000)):
    a = SA[sid]
    A(f'''up("#pr{n} .a",{a + 0.05});up("#pr{n} .d",{a + 0.2});
const pv{n}={{v:0}};tl.fromTo("#pr{n} .b",{{opacity:0,scale:0.5}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(tw - 0.55, 2)});
tl.fromTo(pv{n},{{v:0}},{{v:{val},duration:0.55,ease:"power2.out",onUpdate:()=>{{document.getElementById("pn{n}").textContent="$"+(Math.round(pv{n}.v/1000)*1000).toLocaleString("en-US");}}}},{round(tw - 0.55, 2)});
tl.set("#pn{n}",{{textContent:"${val:,}"}},{round(tw, 2)});tl.fromTo("#pr{n} .b",{{scale:1.25}},{{scale:1,duration:0.35,ease:"elastic.out(1,0.5)",immediateRender:false}},{round(tw, 2)});shake("#{sid} .pz",{round(tw, 2)});fl({round(tw, 2)},0.35);''')
A(f'''pop("#k1",{at('luces', 4)});pop("#k2",{at('minisplits', 4)});pop("#k3",{at('cerradura', 4)});
// mapa
tl.fromTo("#m-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{MAP[0] + 0.05});tl.fromTo("#m-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{MAP[0] + 0.1});tl.fromTo("#m-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{MAP[0] + 0.3});
tl.fromTo("#mgrid",{{y:0}},{{y:90,duration:{round(MAP[1] - MAP[0], 2)},ease:"none"}},{MAP[0]});
tl.fromTo("#mapw",{{clipPath:"circle(0% at 36.8% 78%)"}},{{clipPath:"circle(140% at 36.8% 78%)",duration:0.6,ease:"power3.out"}},{MAP[0] + 0.35});
tl.fromTo("#mapi",{{scale:1.5,transformOrigin:"36.8% 78%"}},{{scale:1,duration:2.6,ease:"power2.out"}},{MAP[0] + 0.35});
[0,1,2,3].forEach(i=>tl.fromTo("#ring",{{scale:0.3,opacity:1}},{{scale:2.6,opacity:0,duration:0.5,ease:"power1.out",immediateRender:i===0}},{MAP[0] + 0.5}+i*0.55));''')
for i, (n, s, t_, w) in enumerate(ROWS):
    t = at(w, 2)
    prev = f'tl.to("#mr{i - 1}",{{opacity:0,y:-40,duration:0.15}},{round(t - 0.08, 3)});' if i else ''
    A(f'{prev}tl.fromTo("#mr{i}",{{opacity:0,x:-160,scale:0.9}},{{opacity:1,x:0,scale:1,duration:0.26,ease:"back.out(1.8)"}},{t});pop("#mr{i} .tm",{round(t + 0.1, 3)});')
A(f'tl.fromTo("#m-note",{{opacity:0}},{{opacity:1,duration:0.3}},{round(at("frontera", 2) + 0.4, 3)});')
t10, t10b, t20, t80, tpv = at('10%', 6), at('10%', 6, 2), at('20', 6), at('80%', 6), at('prevista', 6)
A(f'''// pagos
tl.fromTo("#p-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{PAY[0] + 0.05});tl.fromTo("#p-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{PAY[0] + 0.12});tl.fromTo("#p-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{PAY[0] + 0.32});
tl.fromTo("#pbar",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.3}},{round(PAY[0] + 0.45, 2)});
tl.fromTo("#pb1",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.3,ease:"power3.out"}},{t10});
tl.fromTo("#pb2",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:1.0,ease:"none"}},{t20});
tl.fromTo("#pb3",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.5,ease:"power3.out"}},{t80});
pop("#pc-a",{t10});pop("#pc-b",{t10b});pop("#pc-c",{t80});
tl.fromTo("#pc-c-s",{{opacity:0}},{{opacity:1,duration:0.25}},{tpv});tl.to("#pc-c-s",{{scale:1.1,transformOrigin:"0 50%",duration:0.18,yoyo:true,repeat:1}},{round(tpv + 0.5, 2)});
for(let i=0;i<20;i++)tl.to("#d"+i,{{background:"#C99A2E",scale:1.25,duration:0.05}},{t20}+i*0.055);
tl.fromTo("#p-note",{{opacity:0}},{{opacity:1,duration:0.3}},{round(t10 + 0.4, 2)});
const cnt=(sel,t,to)=>{{const o={{v:0}};tl.fromTo(o,{{v:0}},{{v:to,duration:0.4,ease:"power2.out",onUpdate:()=>{{document.querySelector(sel).textContent=Math.round(o.v)+"%";}}}},t);tl.set(sel,{{textContent:to+"%"}},t+0.42);}};
cnt("#pna",{t10},10);cnt("#pnb",{t10b},10);cnt("#pnc",{t80},80);shake("#pc-c",{round(t80 + 0.42, 2)});''')
G0 = GRO[0]; T0 = round(G0 + 0.5, 2); TD = 1.6; FR = [0, 0.32, 0.65, 1]
A(f'''// plusvalía proyectada (8% y 10% anual, igual que la animación del Doctor)
tl.fromTo("#g-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{G0 + 0.05});tl.fromTo("#g-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{G0 + 0.1});tl.fromTo("#g-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{G0 + 0.3});
pop("#gcard",{G0 + 0.2});fade("#gct",{G0 + 0.3});fade("#glg",{G0 + 0.35});
tl.to("#glo",{{attr:{{"stroke-dashoffset":0}},duration:{TD},ease:"none"}},{T0});tl.to("#glc",{{attr:{{"stroke-dashoffset":0}},duration:{TD},ease:"none"}},{T0});
{json.dumps(FR)}.forEach((f,j)=>{{const t={T0}+{TD}*f;[0,1].forEach(k=>tl.fromTo("#gd"+k+j,{{opacity:0,scale:0,transformOrigin:"50% 50%"}},{{opacity:1,scale:1,duration:0.2,ease:"back.out(3)"}},t));}});
[[0,0],[1,1],[2,1],[3,2],[4,2],[5,3],[6,3]].forEach(([i,j])=>tl.fromTo("#lb"+i,{{opacity:0,y:14,scale:0.6,transformOrigin:"50% 50%"}},{{opacity:1,y:0,scale:1,duration:0.22,ease:"back.out(2.5)"}},{T0}+{TD}*{json.dumps(FR)}[j]+0.03));
const gv={{v:{BASE}}};tl.fromTo("#gcnt",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25,ease:"back.out(2)"}},{T0});
tl.fromTo(gv,{{v:{BASE}}},{{v:{round(OP[1])},duration:{round(TD * 0.32, 2)},ease:"none",onUpdate:()=>{{document.getElementById("gcntv").textContent="$"+Math.round(gv.v).toLocaleString("en-US");}}}},{T0});
tl.set("#gcntv",{{textContent:"${round(OP[1]):,}"}},{round(T0 + TD * 0.32, 2)});tl.to("#gcnt",{{scale:1.12,duration:0.12,yoyo:true,repeat:1}},{round(T0 + TD * 0.32, 2)});
tl.fromTo("#gring",{{opacity:0.9,attr:{{r:14}}}},{{opacity:0,attr:{{r:80}},duration:0.6,ease:"power2.out",repeat:3,immediateRender:false}},{round(T0 + TD + 0.05, 2)});
tl.set("#gring",{{opacity:0}},0);tl.to("#lb5,#lb6",{{scale:1.18,duration:0.16,yoyo:true,repeat:3,transformOrigin:"50% 50%"}},{round(T0 + TD + 0.05, 2)});
up("#gpn",{round(T0 + TD + 0.3, 2)});fade("#gf1",{round(T0 + TD + 0.5, 2)});fade("#gf2",{round(T0 + TD + 0.55, 2)});
tl.to("#gpn .c b",{{scale:1.1,duration:0.15,yoyo:true,repeat:1,transformOrigin:"0 50%"}},{round(max(at("plusvalía", 7), T0 + TD + 0.6), 2)});''')
P1 = T25
A(f'''// equipamiento: cocina, cuartos, baño y roof garden
pop("#e1",{at('cocina', 8)},{{transformOrigin:"0 50%"}});tl.set("#e1b",{{opacity:1}},{SA['bano']});pop("#e2",{max(at('cuartos', 8), SA['bano'] + 0.02)},{{transformOrigin:"0 50%"}});pop("#e3",{at('baño', 8)},{{transformOrigin:"0 50%"}});pop("#e4",{at('roof', 8)},{{transformOrigin:"0 50%"}});
// promo $25,000 USD
const P0={P15},P1={P1};
tl.fromTo("#promo",{{opacity:0,scale:0.6}},{{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"}},P0);
tl.fromTo("#rays",{{rotation:0}},{{rotation:60,duration:{round(SA['c16'] - P15, 2)},ease:"none"}},P0);
tl.fromTo("#pa",{{opacity:0,y:-30}},{{opacity:1,y:0,duration:0.25}},P0+0.1);
const pv={{v:0}};tl.fromTo(pv,{{v:0}},{{v:25000,duration:Math.max(0.3,P1-P0-0.15),ease:"power2.in",onUpdate:()=>{{document.getElementById("pnv").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}}}},P0+0.15);
tl.set("#pnv",{{textContent:"$25,000"}},P1);tl.fromTo("#pn",{{scale:1.5}},{{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false}},P1);
fl(P1,0.75);shake("#c15 .pz",P1);shake("#promo",P1);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{{x:0,y:0,scale:s,opacity:1}},{{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false}},P1));
tl.set(".pt",{{opacity:0}},0);up("#pcx",P1+0.2);pop("#pd",P1+0.45);tl.to("#pn",{{scale:1.07,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"}},P1+0.5);
// CTA con Fran y placa final
tl.fromTo("#cta-t",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{round(SA['b09'] + 0.1, 2)});
pop("#cta",{at('clic', 12)});tl.fromTo("#cta-wa",{{opacity:0}},{{opacity:1,duration:0.3}},{at('recibir', 12)});
tl.to("#cta",{{scale:1.07,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:5}},{round(at('clic', 12) + 0.4, 2)});tl.fromTo("#arw",{{y:-6}},{{y:10,duration:0.36,yoyo:true,repeat:5,ease:"power1.inOut"}},{round(at('clic', 12) + 0.4, 2)});
tl.fromTo("#fin-crest",{{opacity:0,scale:1.6,filter:"blur(16px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.4,ease:"power3.out"}},{END0 + 0.05});
fade("#fin-brand",{END0 + 0.25});fade("#fin-re",{END0 + 0.35});up("#fin-mas",{END0 + 0.4});pop("#fin-cta",{END0 + 0.5});fade("#fin-wa",{END0 + 0.6});
tl.to("#fin-cta",{{scale:1.06,duration:0.3,ease:"sine.inOut",yoyo:true,repeat:1}},{END0 + 0.8});tl.fromTo("#fin-arrow",{{y:-6}},{{y:10,duration:0.3,yoyo:true,repeat:1}},{END0 + 0.8});''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P + 'index.html', 'w').write('\n'.join(H))
json.dump(words, open(P + 'words.json', 'w'), ensure_ascii=False)
print('DUR', DUR, '| tomas', len(SC), '| subtítulos', len(G))
print(' | '.join(' '.join(w[0] for w in g['w']) for g in G))
print('plusvalía 8%:', [round(v) for v in CO], '10%:', [round(v) for v in OP])
