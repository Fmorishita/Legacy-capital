# California v11 (preview, 45 s máx.) — guion nuevo del plan de Meta (27 nov 2026). Genera index.html.
# Solo material existente: clips de Higgsfield ya generados (clips.json -> cortar_clips.py) y fotos de v10. Sin créditos.
# Voz: Qwen3-TTS 1.7B Base (Apache 2.0, local) con el timbre de la voz de California v10; tiempos por palabra con alinear.py.
# Escena 1 (pareja al atardecer + aérea) es PLACEHOLDER: irá una toma nueva de un californiano con laptop en terraza con vista al mar.
import json, math, random
P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v11-es/'
words = [[w['text'], w['start'], w['end']] for w in json.load(open(P + 'transcript.json'))]
PAR = json.load(open(P + 'parrafos.json'))
for k in range(len(words)):
    nxt = words[k + 1][1] if k + 1 < len(words) else words[k][2]
    words[k][2] = round(max(min(words[k][2], nxt), words[k][1] + 0.03), 3)
VOZ_FIN = PAR[-1][1]
norm = lambda x: x.lower().strip('¿?¡!,.:;…"«»$%')


def at(txt, par, nth=1):
    a, b = PAR[par]; c = 0
    for t, s, e in words:
        if a - 0.1 <= s < b + 0.05 and norm(t) == norm(txt):
            c += 1
            if c == nth:
                return s
    raise KeyError((txt, par))


CLIPS = json.load(open(P + 'clips.json'))
VID = set(CLIPS)
ps = lambda k: round(PAR[k][0] - 0.1, 3)
cw = lambda txt, par, nth=1: round(at(txt, par, nth) - 0.06, 3)
DUR = round(VOZ_FIN + 0.65, 2)
MAP = (ps(1), ps(2)); PAY = (ps(4), ps(5))
# id, inicio, imagen, origen del zoom, s0, s1, titular
SH = [
    ('b03', 0, None, None, 0, 0, None),
    ('aereo', cw('tu', 0), None, None, 0, 0, None),
    ('MAP', MAP[0]),
    ('relax', ps(2), None, None, 0, 0, ('CASAS DE UN NIVEL', 'CON ROOF GARDEN')),
    ('b02', cw('y', 2), None, None, 0, 0, ('LOS MEJORES', 'ATARDECERES')),
    ('c07', ps(3), None, None, 0, 0, None),
    ('c14', cw('tres', 3), None, None, 0, 0, None),
    ('PAY', PAY[0]),
    ('c18', ps(5), None, None, 0, 0, ('ÚSALA O RÉNTALA', 'POR TEMPORADAS')),
    ('c13', ps(6), None, None, 0, 0, ('RESERVA ESTE MES', 'EQUIPAMIENTO INCLUIDO')),
    ('cocina', cw('equipamiento', 6), 'cocina', '50% 45%', 1.1, 1.03, None),
    ('c15', cw('valor', 6), 'roof-fran', '30% 15%', 1.1, 1.16, None),
    ('b09', ps(7), None, None, 0, 0, None),
    ('END', DUR),
]
SC = []
for i, sh in enumerate(SH):
    if len(sh) == 2:
        continue
    sid, a, img, org, s0, s1, hl = sh
    SC.append((sid, round(a, 3), round(SH[i + 1][1], 3), img, org, s0, s1, hl))
SA = {x[0]: x[1] for x in SC}; SB = {x[0]: x[2] for x in SC}
HLTOP = {'c13': 950}
CAPTOP = {'relax': 600, 'c13': 300}
NOCAP = {'b09', 'c15'}
LOGO_OFF = [(SA['c15'], DUR)]  # el logo chico se oculta bajo el panel del equipamiento y el CTA
H = []; A = H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>California v11 — Legacy Capital</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"PPCondensed";src:url("assets/fonts/OpenSans_Condensed_Bold.ttf") format("truetype");}
@font-face{font-family:"PPText";src:url("assets/fonts/OpenSans_Semibold.ttf") format("truetype");}
@font-face{font-family:"PPBold";src:url("assets/fonts/OpenSans_ExtraBold.ttf") format("truetype");}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2");}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#071D29}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"PPText",sans-serif;color:#fff}
.clip{position:absolute;inset:0}
.vbg{width:1080px;height:1920px;object-fit:cover}
.bg{overflow:hidden}.bg .pz,.bg .kb{position:absolute;inset:0}.bg img{width:100%;height:100%;object-fit:cover;display:block}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.6) 0%,rgba(7,29,41,.28) 24%,rgba(7,29,41,0) 38%,rgba(7,29,41,0) 50%,rgba(7,29,41,.45) 70%,rgba(7,29,41,.35) 100%)}
.hl{position:absolute;left:80px;font-family:"PPCondensed",sans-serif;font-size:90px;line-height:1.1;letter-spacing:.01em;text-shadow:0 3px 12px rgba(0,0,0,.6);white-space:nowrap}
.hl .l2{color:#FFD086}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:14px;border-radius:4px}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 22px 10px;border-radius:22px;background:rgba(7,29,41,.62);text-align:center;font-family:"PPBold",sans-serif;font-size:66px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff;display:inline-block;margin:0 11px}
#captions{z-index:7}#logo{z-index:8;pointer-events:none}
#logo-in{position:absolute;left:0;right:0;top:1196px;display:flex;align-items:center;justify-content:center;gap:12px}
#logo-in img{width:44px;height:auto;display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}#logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:24px;letter-spacing:.14em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.9),0 0 12px rgba(0,0,0,.6)}
#flash{position:absolute;inset:0;background:#FFF6E2;opacity:0;z-index:9;pointer-events:none}
/* escena 1: gancho + ubicación y precio desde el primer cuadro */
#hook{position:absolute;left:65px;top:790px;padding:2px 26px 8px;border-radius:24px;background:rgba(7,29,41,.62);font-family:"PPCondensed";font-size:96px;line-height:1.05;white-space:nowrap;text-shadow:0 4px 14px rgba(0,0,0,.65)}
#hook span{color:#FFD086}
#lp{position:absolute;left:65px;right:65px;top:912px;height:158px;border-radius:30px;background:rgba(7,29,41,.82);border:3px solid #FFD086;box-shadow:0 12px 30px rgba(0,0,0,.45);text-align:center}
#lp .a{position:absolute;left:0;right:0;top:12px;font-family:"PPBold";font-size:34px;letter-spacing:.04em;color:#fff;white-space:nowrap}
#lp .a b{color:#FFD086;font-weight:400}
#lp .b{position:absolute;left:0;right:0;top:56px;font-family:"PPCondensed";font-size:84px;line-height:1.1;white-space:nowrap}#lp .b small{font-size:44px;color:#FFD086;margin-left:12px}#lp .b em{font-style:normal;font-size:44px;color:#FFD086;margin-right:14px;letter-spacing:.06em}
/* precios fijos */
.pr{position:absolute;left:80px;top:300px;text-shadow:0 4px 14px rgba(0,0,0,.65)}
.pr .a{font-family:"PPCondensed";font-size:72px;line-height:1.1;letter-spacing:.02em}.pr .a span{color:#FFD086}
.pr .b{font-family:"PPCondensed";font-size:132px;line-height:1.1;margin-top:14px;white-space:nowrap}.pr .b small{font-size:58px;color:#FFD086;margin-left:14px}
.chk{position:absolute;height:88px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:40px;display:flex;align-items:center;padding:0 32px;box-shadow:0 10px 24px rgba(0,0,0,.4);white-space:nowrap}
/* animaciones (visibles desde el primer cuadro) */
.mg{background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%);overflow:hidden}
.mg .eb{position:absolute;left:0;right:0;top:290px;text-align:center;font-family:"PPBold";font-size:32px;letter-spacing:.2em;color:#FFD086}
.mg .tt{position:absolute;left:40px;right:40px;top:340px;text-align:center;font-family:"PPCondensed";font-size:92px;line-height:1.05;white-space:nowrap}
.mg .ru{position:absolute;left:465px;top:448px;width:150px;height:8px;border-radius:4px;background:#FFD086}
.grid{position:absolute;inset:-100px;background-image:linear-gradient(rgba(255,208,134,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(255,208,134,.06) 2px,transparent 2px);background-size:90px 90px}
#mapw{position:absolute;left:170px;top:476px;width:740px;height:601px;border-radius:28px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.5);border:4px solid #FFD086}
#mapw img{width:100%;height:100%;display:block}
#ring{position:absolute;left:396px;top:891px;width:80px;height:80px;border-radius:50%;border:8px solid #FFD086}
.row{position:absolute;top:1096px;width:466px;height:84px;border-radius:24px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 12px 0 24px;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.row .nm{flex:1;font-family:"PPBold";font-size:34px;line-height:1.05;white-space:nowrap}.row .nm small{display:block;font-family:"PPText";font-size:20px;color:#4A5568}
.row .tm{height:62px;border-radius:999px;background:#0E2A4A;color:#FFD086;display:flex;align-items:center;padding:0 22px;font-family:"PPBold";font-size:38px;white-space:nowrap}
#pbar{position:absolute;left:65px;right:65px;top:500px;height:100px;border-radius:24px;background:rgba(255,255,255,.08);border:3px solid rgba(255,208,134,.5);overflow:hidden;display:flex}
#pbar div{height:100%}
#pb1{width:10%;background:#FFD086}#pb2{width:10%;background:repeating-linear-gradient(90deg,#E7B54A 0 4px,#C99A2E 4px 8.5px)}#pb3{width:80%;background:linear-gradient(90deg,#2F6E9A,#1D4E74)}
.pcard{position:absolute;left:65px;right:65px;height:150px;border-radius:30px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 34px;box-shadow:0 12px 30px rgba(0,0,0,.4)}
.pcard .n{width:240px;font-family:"PPCondensed";font-size:112px;line-height:1;color:#0E2A4A}
.pcard .tx{flex:1}.pcard .t{font-family:"PPBold";font-size:46px;line-height:1.1}.pcard .s{font-size:30px;line-height:1.3;color:#8A620C;font-family:"PPBold"}
/* equipamiento y promo */
#promo{position:absolute;left:65px;right:65px;top:836px;height:412px;border-radius:40px;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(23,63,102,.96) 0%,rgba(7,29,41,.96) 80%);border:4px solid #FFD086;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.55)}
#rays{position:absolute;left:-560px;top:-760px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.15) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)}
#promo .a{position:absolute;left:0;right:0;top:16px;line-height:1.1;text-align:center;font-family:"PPCondensed";font-size:54px;letter-spacing:.08em;color:#FFD086}
#pn{position:absolute;left:0;right:0;top:98px;text-align:center;font-family:"PPCondensed";font-size:140px;line-height:1;text-shadow:0 0 30px rgba(255,208,134,.85),0 0 80px rgba(255,208,134,.4);white-space:nowrap}
#pn small{font-size:64px;color:#FFD086;margin-left:14px}
#promo .c{position:absolute;left:0;right:0;top:268px;line-height:1.1;text-align:center;font-family:"PPBold";font-size:40px}
#promo .d{position:absolute;left:0;right:0;top:322px;text-align:center}#promo .d span{display:inline-block;background:#FFD086;color:#071D29;border-radius:999px;padding:6px 32px;font-family:"PPBold";font-size:34px}
.pt{position:absolute;left:470px;top:160px;width:16px;height:16px;border-radius:50%;background:#FFD086;opacity:0}
/* CTA (debajo de las caras y de las llaves) */
#ctab{position:absolute;left:65px;right:65px;top:846px;height:178px;border-radius:30px;background:rgba(7,29,41,.72)}
#cta-t{position:absolute;left:0;right:0;top:860px;text-align:center;font-family:"PPCondensed";font-size:84px;line-height:1.05;text-shadow:0 4px 14px rgba(0,0,0,.75)}#cta-t span{color:#FFD086}
#cta-s{position:absolute;left:0;right:0;top:960px;text-align:center;font-family:"PPBold";font-size:40px;text-shadow:0 3px 10px rgba(0,0,0,.85)}
#cta{position:absolute;left:90px;right:90px;top:1040px;height:112px;border-radius:999px;background:#1E9E4F;color:#fff;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 12px 30px rgba(0,0,0,.45);white-space:nowrap}
#arw{position:absolute;left:0;right:0;top:1160px;text-align:center;font-family:"PPBold";font-size:76px;line-height:1;color:#FFD086;text-shadow:0 3px 10px rgba(0,0,0,.8)}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
'''.replace('%DUR%', str(DUR)))
for sid, a, b, img, org, s0, s1, hl in SC:
    if sid in VID:
        A(f'<video id="{sid}-v" class="clip vbg" src="assets/vid/{sid}.mp4" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="1" muted playsinline></video>')
    pic = '' if sid in VID else f'<img src="assets/img/{img}.jpg" alt="" />'
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="0"><div class="pz"><div class="kb" data-layout-allow-overflow>{pic}</div></div><div class="shade"></div>')
    if hl:
        A(f'<div class="hl" id="{sid}-hl" style="top:{HLTOP.get(sid, 300)}px"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    if sid == 'b03':
        A('<div id="hook">¿TRABAJAS EN <span>EE.UU.?</span></div>')
    if sid == 'c07':
        A('<div class="pr" id="pr1"><div class="a">2 RECÁMARAS <span>DESDE</span></div><div class="b">$215,000<small>USD</small></div></div>')
    if sid == 'c14':
        A('<div class="pr" id="pr2"><div class="a">3 RECÁMARAS <span>DESDE</span></div><div class="b">$235,000<small>USD</small></div></div>')
    if sid == 'cocina':
        A('<div class="chk" id="e1" style="left:80px;top:300px">✓ Cocina</div><div class="chk" id="e2" style="left:360px;top:300px">✓ Cuartos</div>'
          '<div class="chk" id="e3" style="left:80px;top:408px">✓ Baño</div><div class="chk" id="e4" style="left:310px;top:408px">✓ Roof garden</div>')
    if sid == 'c15':
        A('<div id="promo"><div id="rays"></div><div class="a" id="pa">EQUIPAMIENTO INCLUIDO DE HASTA</div><div id="pn"><span id="pnv">$0</span><small>USD</small></div>'
          + ''.join(f'<div class="pt" id="pt{i}"></div>' for i in range(24))
          + '<div class="c" id="pcx">COCINA · CUARTOS · BAÑO · ROOF</div><div class="d" id="pd"><span>Al reservar tu casa este mes</span></div></div>')
    if sid == 'b09':
        A('<div id="ctab"></div><div id="cta-t">ESCRÍBEME POR <span>WHATSAPP</span></div><div id="cta-s">Agenda tu visita o videollamada</div>'
          '<div id="cta"><span>WhatsApp +52 646 256 3006</span></div><div id="arw">↓</div>')
    A('</div>')
# ubicación + precio: encima de las dos tomas de la escena 1 (b03 y aérea)
A(f'<div id="lpw" class="clip" data-start="0" data-duration="{MAP[0]}" data-track-index="3"><div id="lp"><div class="a">CASA CON VISTA AL MAR · <b>EL SAUZAL, ENSENADA</b></div><div class="b"><em>DESDE</em>$215,000<small>USD</small></div></div></div>')
# ---------- mapa
ma, mb = MAP
A(f'<div id="mapa" class="clip mg" data-start="{ma}" data-duration="{round(mb - ma, 3)}" data-track-index="0"><div class="grid" id="mgrid" data-layout-allow-overflow></div><div class="eb" id="m-eb">EL SAUZAL · ENSENADA</div><div class="tt" id="m-tt">A UN PASO <span style="color:#FFD086">DE CALIFORNIA</span></div><div class="ru" id="m-ru"></div>')
A('<div id="mapw"><img id="mapi" src="assets/img/mapa.png" alt="" /></div><div id="ring"></div>')
A('<div class="row" id="mr0" style="left:65px"><div class="nm">Tijuana<small>aprox. en auto</small></div><div class="tm">1 h</div></div>')
A('<div class="row" id="mr1" style="left:549px"><div class="nm">San Ysidro<small>garita · aprox.</small></div><div class="tm">1 h 30</div></div></div>')
# ---------- pagos
pa_, pb_ = PAY
A(f'<div id="pagos" class="clip mg" data-start="{pa_}" data-duration="{round(pb_ - pa_, 3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="p-eb">PLAN DE PAGOS</div><div class="tt" id="p-tt">ASÍ <span style="color:#FFD086">LA PAGAS</span></div><div class="ru" id="p-ru"></div>')
A('<div id="pbar"><div id="pb1"></div><div id="pb2"></div><div id="pb3"></div></div>')
A('<div class="pcard" id="pc-a" style="top:650px"><div class="n">10%</div><div class="tx"><div class="t">de enganche</div><div class="s">Al separar tu casa</div></div></div>')
A('<div class="pcard" id="pc-b" style="top:820px"><div class="n">10%</div><div class="tx"><div class="t">en 20 meses</div><div class="s">Mensualidades durante la obra</div></div></div>')
A('<div class="pcard" id="pc-c" style="top:990px"><div class="n">80%</div><div class="tx"><div class="t">contra entrega</div><div class="s">Entrega prevista en 2028</div></div></div></div>')
# ---------- capas globales
A(f'<div id="logo" class="clip" data-start="0" data-duration="{DUR}" data-track-index="4"><div id="logo-in"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
A(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
A(f'<div id="fx" class="clip" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="flash"></div></div>')
A(f'<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="{round(VOZ_FIN + 0.3, 2)}" data-track-index="8" data-volume="1"></audio>')
MV = 0.05
A(f'''<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":{MV}}},{{"t":{round(VOZ_FIN + 0.1, 2)},"v":{MV}}},{{"t":{round(DUR - 0.4, 2)},"v":{MV * 1.4}}},{{"t":{DUR},"v":0}}]}}]}}'></audio>''')
SFX = {'sw': ('fast-small-sweep-166', 0.8), 'st': ('short-transition-sweep-175', 0.65), 'who': ('cinematic-whoosh-fast-1492', 1.38),
       'wu': ('syn-whoosh-up', 0.6), 'wd': ('syn-whoosh-down', 0.62), 'ss': ('syn-swish', 0.31), 'wl': ('syn-whoosh-low', 0.83), 'pop': ('syn-pop', 0.2), 'ph': ('syn-pop-hi', 0.18),
       'tk': ('syn-tick', 0.1), 'coin': ('syn-coin', 0.73), 'cha': ('syn-chaching', 1.14), 'shim': ('syn-shimmer', 0.94), 'rise': ('syn-riser', 1.04), 'boom': ('syn-boom', 0.94), 'thud': ('syn-thud', 0.33)}
FLASH = [MAP[0], PAY[0], SA['b09']]
cuts = sorted(set([a for sid_, a, *_ in SC if a > 0] + [MAP[0], PAY[0]]))
rot = ['ss', 'wd', 'sw', 'wu', 'st', 'wl']
ev = [('who' if c in FLASH else rot[i % len(rot)], max(0, c - 0.12), 0.22) for i, c in enumerate(cuts)]
T215, T235, T24 = at('$215,000', 3), at('$235,000.', 3), at('$24,232', 6)
t10, t10b, t20, t80, t28 = at('10%,', 4), at('10%', 4), at('20', 4), at('80%', 4), at('2028.', 4)
tTJ, tSY = at('tijuana', 1), at('ysidro.', 1)
ev += [('boom', 0.03, 0.35), ('coin', at('$215,000', 0), 0.3),
       ('pop', tTJ, 0.4), ('pop', tSY, 0.4), ('shim', MAP[0] + 0.3, 0.25),
       ('thud', SA['c07'] + 0.08, 0.35), ('cha', T215 + 0.1, 0.3), ('thud', SA['c14'] + 0.08, 0.35), ('cha', T235 + 0.1, 0.3),
       ('pop', PAY[0] + 0.15, 0.3), ('pop', PAY[0] + 0.4, 0.3), ('pop', PAY[0] + 0.65, 0.3),
       ('thud', t10, 0.4), ('ph', t10b, 0.4), ('thud', t80, 0.4), ('shim', t28, 0.25),
       ('pop', SA['cocina'] + 0.05, 0.4), ('ph', SA['cocina'] + 0.2, 0.4), ('pop', SA['cocina'] + 0.35, 0.4), ('ph', SA['cocina'] + 0.5, 0.4),
       ('rise', T24 - 0.6, 0.35), ('boom', T24 + 0.5, 0.5), ('cha', T24 + 0.52, 0.35), ('shim', T24 + 0.9, 0.25),
       ('pop', SA['b09'] + 1.0, 0.35)]
ev += [('tk', t20 + i * 0.04, 0.16) for i in range(20)]
for i, (k, t, v) in enumerate(ev):
    f, d = SFX[k]
    A(f'<audio id="sfx{i}" src="assets/sfx/{f}.mp3" data-start="{round(t, 3)}" data-duration="{d}" data-track-index="{10 + i % 9}" data-volume="{v}"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# ---------- subtítulos por palabra (máx. 5 palabras / 24 caracteres por línea)
groups = []
for sid, a, b, *_ in SC:
    if sid in NOCAP:
        continue
    cur = []
    for w in words:
        if not (a - 0.06 <= w[1] < b - 0.06):
            continue
        if cur and (len(cur) >= 5 or len(' '.join(x[0] for x in cur)) + len(w[0]) > 24 or (cur[-1][0][-1] in '.:;?' and len(cur) >= 2) or (cur[-1][0][-1] == ',' and len(cur) >= 3)):
            groups.append((cur, b, sid)); cur = []
        cur.append(w)
    if cur:
        groups.append((cur, b, sid))
groups = [g for g in groups if not (len(g[0]) == 1 and len(g[0][0][0]) <= 4)]
G = [{'top': CAPTOP.get(sid, 1080), 's': SA[sid], 'end': min(b, g[-1][2] + 0.4), 'w': g} for g, b, sid in groups]
A('const CAPS=' + json.dumps(G, ensure_ascii=False) + ';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);});
host.appendChild(line);const st=Math.max(g.s,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.85},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t,e],wi)=>{const id="#cap-"+gi+"-"+wi;tl.to(id,{color:"#FFD086",scale:1.05,duration:0.07,ease:"power2.out"},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to(id,{color:"#ffffff",scale:1,duration:0.07,ease:"none"},nx[1]-0.04);});
const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.4},Object.assign({opacity:1,scale:1,duration:0.24,ease:"back.out(2.6)"},o||{}),t);
const bump=(s,t)=>tl.fromTo(s,{scale:1},{scale:1.08,duration:0.14,yoyo:true,repeat:1,ease:"sine.inOut",immediateRender:false},t);
const fl=(t,o)=>tl.fromTo("#flash",{opacity:o||0.6},{opacity:0,duration:0.25,ease:"power2.out",immediateRender:false},t);
const shake=(s,t)=>tl.fromTo(s,{x:0,y:0},{keyframes:[{x:-14,y:9},{x:12,y:-10},{x:-8,y:6},{x:6,y:-3},{x:0,y:0}],duration:0.32,ease:"none",immediateRender:false},t);
tl.set("#flash",{opacity:0},0);''')
for sid, a, b, img, org, s0, s1, hl in SC:
    d = round(b - a, 3)
    if sid in VID:
        if a > 0:
            A(f'tl.fromTo("#{sid}-v",{{scale:1.08}},{{scale:1,duration:0.3,ease:"power3.out"}},{a});')
    else:
        A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},transformOrigin:"{org}"}},{{scale:{s1},duration:{d},ease:"none"}},{a});')
        A(f'tl.fromTo("#{sid} .pz",{{scale:1.08}},{{scale:1,duration:0.3,ease:"power3.out"}},{a});')
    if hl:  # el titular entra ya visible (solo se desliza), sin cuadros vacíos
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0.001,y:30}},{{opacity:1,y:0,duration:0.18,ease:"power3.out"}},{a});tl.fromTo("#{sid}-hl .l2",{{opacity:0.001,x:-50}},{{opacity:1,x:0,duration:0.2,ease:"power3.out"}},{round(a + 0.08, 3)});tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.22}},{round(a + 0.15, 3)});')
for t in FLASH:
    A(f'fl({t});')
for a, b in LOGO_OFF:
    A(f'tl.to("#logo-in",{{opacity:0,duration:0.15}},{a});' + (f'tl.to("#logo-in",{{opacity:1,duration:0.15}},{b});' if b < DUR - 0.1 else ''))
random.seed(7); pts = []
for i in range(24):
    ang = i / 24 * 2 * math.pi + random.uniform(-.1, .1); r = random.uniform(300, 520)
    pts.append((round(math.cos(ang) * r), round(math.sin(ang) * r * 0.7), round(random.uniform(0.6, 1.6), 2)))
A('const PTS=' + json.dumps(pts) + ';')
A(f'''// escena 1: gancho y ubicación/precio visibles desde el cuadro 0
tl.fromTo("#hook",{{scale:1.12,transformOrigin:"0 50%"}},{{scale:1,duration:0.4,ease:"power3.out"}},0);
tl.fromTo("#lp",{{y:24}},{{y:0,duration:0.4,ease:"power3.out"}},0);bump("#lp .b",{round(at('$215,000', 0), 2)});
tl.to("#hook",{{opacity:0,duration:0.15}},{SA['aereo']});
// mapa (completo desde el primer cuadro)
tl.fromTo("#mgrid",{{y:0}},{{y:90,duration:{round(MAP[1] - MAP[0], 2)},ease:"none"}},{MAP[0]});
tl.fromTo("#mapi",{{scale:1.12,transformOrigin:"38% 70%"}},{{scale:1,duration:{round(MAP[1] - MAP[0], 2)},ease:"power1.out"}},{MAP[0]});
[0,1,2,3,4,5].forEach(i=>tl.fromTo("#ring",{{scale:0.4,opacity:1}},{{scale:2.4,opacity:0,duration:0.55,ease:"power1.out",immediateRender:i===0}},{MAP[0]}+i*0.6));
bump("#mr0",{tTJ});tl.to("#mr0 .tm",{{background:"#C99A2E",color:"#071D29",duration:0.15}},{tTJ});bump("#mr1",{tSY});tl.to("#mr1 .tm",{{background:"#C99A2E",color:"#071D29",duration:0.15}},{tSY});
// precios fijos (sin contador)
tl.fromTo("#pr1",{{x:-40}},{{x:0,duration:0.3,ease:"power3.out"}},{SA['c07']});bump("#pr1 .b",{round(T215, 2)});
tl.fromTo("#pr2",{{x:-40}},{{x:0,duration:0.3,ease:"power3.out"}},{SA['c14']});bump("#pr2 .b",{round(T235, 2)});
// pagos: todo visible desde el inicio; las 3 barras se llenan en 1 s
tl.fromTo("#pb1",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25,ease:"power3.out"}},{PAY[0] + 0.1});
tl.fromTo("#pb2",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25,ease:"power3.out"}},{PAY[0] + 0.35});
tl.fromTo("#pb3",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.4,ease:"power3.out"}},{PAY[0] + 0.6});
["#pc-a","#pc-b","#pc-c"].forEach((s,i)=>tl.fromTo(s,{{x:-30}},{{x:0,duration:0.3,ease:"power3.out"}},{PAY[0]}+i*0.08));
bump("#pc-a",{t10});bump("#pc-b",{t10b});bump("#pc-c",{t80});tl.to("#pc-c .s",{{color:"#0E2A4A",duration:0.15}},{t28});
// equipamiento: las cuatro áreas y el panel con el valor
pop("#e1",{SA['cocina'] + 0.05},{{transformOrigin:"0 50%"}});pop("#e2",{SA['cocina'] + 0.2},{{transformOrigin:"0 50%"}});pop("#e3",{SA['cocina'] + 0.35},{{transformOrigin:"0 50%"}});pop("#e4",{SA['cocina'] + 0.5},{{transformOrigin:"0 50%"}});
const P0={SA['c15']},P1={round(T24 + 0.5, 2)};
tl.fromTo("#promo",{{opacity:0.001,scale:0.8}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)"}},P0);
tl.fromTo("#rays",{{rotation:0}},{{rotation:60,duration:{round(SB['c15'] - SA['c15'], 2)},ease:"none"}},P0);
const pv={{v:0}};tl.fromTo(pv,{{v:0}},{{v:24232,duration:Math.max(0.3,P1-P0-0.1),ease:"power2.in",onUpdate:()=>{{document.getElementById("pnv").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}}}},P0+0.05);
tl.set("#pnv",{{textContent:"$24,232"}},P1);tl.fromTo("#pn",{{scale:1.4}},{{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false}},P1);
fl(P1,0.6);shake("#c15 .pz",P1);shake("#promo",P1);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{{x:0,y:0,scale:s,opacity:1}},{{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false}},P1));
tl.set(".pt",{{opacity:0}},0);tl.to("#pn",{{scale:1.06,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"}},P1+0.5);''')
TC = round(SA['b09'] + 0.9, 2)
NREP = int((DUR - TC - 0.6) / 0.36) // 2 * 2 + 1
A(f'''// CTA: WhatsApp con flecha hacia el botón
tl.fromTo("#ctab",{{opacity:0}},{{opacity:1,duration:0.2}},{TC});tl.fromTo("#cta-t",{{opacity:0,scale:1.2}},{{opacity:1,scale:1,duration:0.25,ease:"power3.out"}},{TC});
tl.fromTo("#cta-s",{{opacity:0}},{{opacity:1,duration:0.25}},{round(TC + 0.15, 2)});pop("#cta",{round(TC + 0.1, 2)});pop("#arw",{round(TC + 0.3, 2)});
tl.to("#cta",{{scale:1.05,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:{NREP}}},{round(TC + 0.5, 2)});tl.fromTo("#arw",{{y:-6}},{{y:14,duration:0.36,yoyo:true,repeat:{NREP},ease:"power1.inOut",immediateRender:false}},{round(TC + 0.5, 2)});''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P + 'index.html', 'w').write('\n'.join(H))
json.dump(words, open(P + 'words.json', 'w'), ensure_ascii=False)
print('DUR', DUR, '| tomas', len(SC), '| subtítulos', len(G))
print('\n'.join(f'{s[0]:7s} {s[1]:6.2f}-{s[2]:6.2f}' for s in SC))
print(' | '.join(' '.join(w[0] for w in g['w']) for g in G))
