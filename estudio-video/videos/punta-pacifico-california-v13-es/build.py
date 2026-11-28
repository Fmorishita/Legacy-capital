# California v13 (preview) — cambios de Fran del 28 nov 2026 sobre la v12. Genera index.html.
# v13: Mexicali en el mapa y en la voz; sin punch-ins ni mini zoom en los cortes; «casas de un nivel con rooftop privado con vista al mar»;
# escena 1 con la foto nueva del californiano con laptop frente al mar y «fines de semana» con la foto del auto por la costa (Drive «FOTOS IA»);
# cada animación entra con la palabra exacta de la voz (ciudades del mapa, rooftop, vista al mar, pagos, $24,000, botón y flecha del CTA);
# cierre «visita o llamada» (sin videollamada). Música «House 02» (Mixkit 744). Voz Qwen3-TTS local.
import json, math, random
P = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v13-es/'
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
    ('b03', 0, 'laptop', '45% 55%', 1.0, 1.07, None),
    ('aereo', cw('tu', 0), None, None, 0, 0, None),
    ('MAP', MAP[0]),
    ('relax', ps(2), None, None, 0, 0, ('CASAS DE UN NIVEL', 'ROOFTOP PRIVADO')),
    ('b02', cw('con', 2, 2), None, None, 0, 0, ('CON VISTA', 'AL MAR')),
    ('c07', ps(3), None, None, 0, 0, None),
    ('c14', cw('tres', 3), None, None, 0, 0, None),
    ('PAY', PAY[0]),
    ('auto', ps(5), 'auto', '50% 75%', 1.0, 1.08, ('ÚSALA LOS', 'FINES DE SEMANA')),
    ('c18', cw('o', 5), None, None, 0, 0, ('O RÉNTALA', 'POR TEMPORADAS')),
    ('c13', ps(6), None, None, 0, 0, ('RESERVA ESTE MES', 'EQUIPAMIENTO INCLUIDO')),
    ('cocina', cw('equipamiento', 6), 'cocina', '50% 45%', 1.1, 1.03, None),
    ('c15', cw('valor', 6), None, None, 0, 0, None),
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
CAP_TOP = 1140  # subtítulos: termina en ~1245 px, arriba del 35 % inferior que tapa la interfaz de Reels
LOGO_TOP = 1262  # logo apilado debajo de los subtítulos
NOCAP = {'b09', 'c15'}
LOGO_OFF = [(SA['b09'], DUR)]  # en el cierre el logo pasa al panel del CTA
CT = 1345  # panel del CTA: debajo de la mano de Fran que apunta hacia abajo
H = []; A = H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>California v12 — Legacy Capital</title>
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
.hl{position:absolute;left:100px;font-family:"PPCondensed",sans-serif;font-size:90px;line-height:1.1;letter-spacing:.01em;text-shadow:0 3px 12px rgba(0,0,0,.6);white-space:nowrap}
.hl .l2{color:#FFD086}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:14px;border-radius:4px}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 22px 10px;border-radius:22px;background:rgba(7,29,41,.62);text-align:center;font-family:"PPBold",sans-serif;font-size:68px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff;display:inline-block;margin:0 11px}
#captions{z-index:7}#logo{z-index:8;pointer-events:none}
#logo-in{position:absolute;left:0;right:0;top:%LT%px;display:flex;flex-direction:column;align-items:center;gap:6px}
#logo-in img{width:78px;height:auto;display:block;filter:drop-shadow(0 2px 8px rgba(0,0,0,.7))}#logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:31px;letter-spacing:.16em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.9),0 0 12px rgba(0,0,0,.6)}
#flash{position:absolute;inset:0;background:#FFF6E2;opacity:0;z-index:9;pointer-events:none}
/* escena 1: gancho + ubicación y precio desde el primer cuadro */
#lp{position:absolute;left:100px;right:100px;top:330px;height:240px;border-radius:30px;background:rgba(7,29,41,.82);border:3px solid #FFD086;box-shadow:0 12px 30px rgba(0,0,0,.45);text-align:center}
#lp .a{position:absolute;left:0;right:0;top:16px;line-height:1.25;font-family:"PPBold";font-size:38px;letter-spacing:.04em;color:#fff;white-space:nowrap}
#lp .a b{color:#FFD086;font-weight:400}#lp .a div{height:46px}
#lp .b{position:absolute;left:0;right:0;top:114px;font-family:"PPCondensed";font-size:108px;line-height:1.1;white-space:nowrap}#lp .b small{font-size:52px;color:#FFD086;margin-left:12px}#lp .b em{font-style:normal;font-size:52px;color:#FFD086;margin-right:14px;letter-spacing:.06em}
/* precios fijos */
.pr{position:absolute;left:100px;top:300px;text-shadow:0 4px 14px rgba(0,0,0,.65)}
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
.cr{position:absolute;width:70px;height:70px;margin:-35px 0 0 -35px;border-radius:50%;border:7px solid #E0A020;opacity:0}
#mline{position:absolute;left:0;top:0;width:1080px;height:1920px;overflow:visible}
.row{position:absolute;top:1096px;width:284px;height:96px;border-radius:22px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 12px 0 24px;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.row .nm{flex:1;font-family:"PPBold";font-size:28px;line-height:1.05;white-space:nowrap}.row .nm small{display:block;font-family:"PPText";font-size:18px;color:#4A5568}
.row{padding:0 8px 0 16px}.row .tm{height:56px;border-radius:999px;background:#0E2A4A;color:#FFD086;display:flex;align-items:center;padding:0 14px;font-family:"PPBold";font-size:30px;white-space:nowrap}
#pbar{position:absolute;left:100px;right:100px;top:470px;height:90px;border-radius:24px;background:rgba(255,255,255,.08);border:3px solid rgba(255,208,134,.5);overflow:hidden;display:flex}
#pbar div{height:100%}
#pb1{width:10%;background:#FFD086}#pb2{width:10%;background:repeating-linear-gradient(90deg,#E7B54A 0 4px,#C99A2E 4px 8.5px)}#pb3{width:80%;background:linear-gradient(90deg,#2F6E9A,#1D4E74)}
.pcard{position:absolute;left:100px;right:100px;height:156px;border-radius:30px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 34px;box-shadow:0 12px 30px rgba(0,0,0,.4)}
.pcard .n{width:210px;font-family:"PPCondensed";font-size:104px;line-height:1;color:#0E2A4A}
.dots{display:flex;gap:6px;margin-top:8px}.dots i{display:block;width:21px;height:21px;border-radius:50%;background:#E3D8C2}
.pcard .tx{flex:1}.pcard .t{font-family:"PPBold";font-size:44px;line-height:1.1}.pcard .s{font-size:28px;line-height:1.3;color:#8A620C;font-family:"PPBold"}
/* equipamiento y promo */
#promo{position:absolute;left:100px;right:100px;top:830px;height:412px;border-radius:40px;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(23,63,102,.96) 0%,rgba(7,29,41,.96) 80%);border:4px solid #FFD086;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.55)}
#rays{position:absolute;left:-560px;top:-760px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.15) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)}
#promo .a{position:absolute;left:0;right:0;top:16px;line-height:1.1;text-align:center;font-family:"PPCondensed";font-size:50px;letter-spacing:.08em;color:#FFD086}
#pn{position:absolute;left:0;right:0;top:98px;text-align:center;font-family:"PPCondensed";font-size:140px;line-height:1;text-shadow:0 0 30px rgba(255,208,134,.85),0 0 80px rgba(255,208,134,.4);white-space:nowrap}
#pn small{font-size:64px;color:#FFD086;margin-left:14px}
#promo .c{position:absolute;left:0;right:0;top:268px;line-height:1.1;text-align:center;font-family:"PPBold";font-size:40px}
#promo .d{position:absolute;left:0;right:0;top:322px;text-align:center}#promo .d span{display:inline-block;background:#FFD086;color:#071D29;border-radius:999px;padding:6px 32px;font-family:"PPBold";font-size:34px}
.pt{position:absolute;left:432px;top:160px;width:16px;height:16px;border-radius:50%;background:#FFD086;opacity:0}
/* CTA (debajo de las caras y de las llaves) */
#ctab{position:absolute;left:100px;right:100px;top:%CT0%px;height:300px;border-radius:30px;background:rgba(7,29,41,.74)}
#ctl{position:absolute;left:0;right:0;top:%CT1%px;display:flex;align-items:center;justify-content:center;gap:12px}#ctl img{width:46px}#ctl span{font-family:"Cinzel",serif;font-weight:700;font-size:28px;letter-spacing:.16em;color:#fff}
#cta-s{position:absolute;left:0;right:0;top:%CT2%px;text-align:center;font-family:"PPCondensed";font-size:76px;line-height:1.05;text-shadow:0 3px 10px rgba(0,0,0,.85)}#cta-s span{color:#FFD086}
#cta{position:absolute;left:130px;right:130px;top:%CT3%px;height:104px;border-radius:999px;background:#1E9E4F;color:#fff;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 12px 30px rgba(0,0,0,.45);white-space:nowrap}
#arw{position:absolute;left:0;right:0;top:%CT4%px;text-align:center;font-family:"PPBold";font-size:76px;line-height:1;color:#FFD086;text-shadow:0 3px 10px rgba(0,0,0,.8)}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
'''.replace('%DUR%', str(DUR)).replace('%LT%', str(LOGO_TOP)).replace('%CT0%', str(CT)).replace('%CT1%', str(CT + 18)).replace('%CT2%', str(CT + 74))
  .replace('%CT3%', str(CT + 172)).replace('%CT4%', str(CT + 300)))
for sid, a, b, img, org, s0, s1, hl in SC:
    if sid in VID:
        A(f'<video id="{sid}-v" class="clip vbg" src="assets/vid/{sid}.mp4" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="1" muted playsinline></video>')
    pic = '' if sid in VID else f'<img src="assets/img/{img}.jpg" alt="" />'
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b - a, 3)}" data-track-index="0"><div class="pz"><div class="kb" data-layout-allow-overflow>{pic}</div></div><div class="shade"></div>')
    if hl:
        A(f'<div class="hl" id="{sid}-hl" style="top:{HLTOP.get(sid, 300)}px"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    if sid == 'c07':
        A('<div class="pr" id="pr1"><div class="a">2 RECÁMARAS <span>DESDE</span></div><div class="b">$215,000<small>USD</small></div></div>')
    if sid == 'c14':
        A('<div class="pr" id="pr2"><div class="a">3 RECÁMARAS <span>DESDE</span></div><div class="b">$235,000<small>USD</small></div></div>')
    if sid == 'cocina':
        A('<div class="chk" id="e1" style="left:80px;top:300px">✓ Cocina</div><div class="chk" id="e2" style="left:360px;top:300px">✓ Cuartos</div>'
          '<div class="chk" id="e3" style="left:80px;top:408px">✓ Baño</div><div class="chk" id="e4" style="left:310px;top:408px">✓ Roof garden</div>')
    if sid == 'c15':
        A('<div id="promo"><div id="rays" data-layout-allow-overflow></div><div class="a" id="pa">EQUIPAMIENTO INCLUIDO DE HASTA</div><div id="pn"><span id="pnv">$0</span><small>USD</small></div>'
          + ''.join(f'<div class="pt" id="pt{i}"></div>' for i in range(24))
          + '<div class="c" id="pcx">COCINA · CUARTOS · BAÑO · ROOF</div><div class="d" id="pd"><span>Al reservar tu casa este mes</span></div></div>')
    if sid == 'b09':
        A('<div id="ctab"></div><div id="ctl"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div><div id="cta-s">AGENDA TU VISITA <span>O LLAMADA</span></div>'
          '<div id="cta"><span>WhatsApp +52 646 256 3006</span></div><div id="arw">↓</div>')
    A('</div>')
# ubicación + precio: encima de las dos tomas de la escena 1 (b03 y aérea)
A(f'<div id="lpw" class="clip" data-start="0" data-duration="{SA["aereo"]}" data-track-index="3"><div id="lp"><div class="a"><div>CASA CON VISTA AL MAR</div><div><b>EL SAUZAL, ENSENADA</b></div></div><div class="b"><em>DESDE</em>$215,000<small>USD</small></div></div></div>')
# ---------- mapa
ma, mb = MAP
A(f'<div id="mapa" class="clip mg" data-start="{ma}" data-duration="{round(mb - ma, 3)}" data-track-index="0"><div class="grid" id="mgrid" data-layout-allow-overflow></div><div class="eb" id="m-eb">EL SAUZAL · ENSENADA</div><div class="tt" id="m-tt">A UN PASO <span style="color:#FFD086">DE CALIFORNIA</span></div><div class="ru" id="m-ru"></div>')
A('<div id="mapw"><img id="mapi" src="assets/img/mapa.png" alt="" /></div><div id="ring"></div>')
CITY = {'tj': (398, 597), 'sy': (366, 540), 'mx': (777, 576)}; PROJ = (447, 931)  # marcadores de mapa.png en coordenadas del video
A('<svg id="mline">' + ''.join(f'<line id="ml-{k}" x1="{PROJ[0]}" y1="{PROJ[1]}" x2="{x}" y2="{y}" pathLength="1" stroke="#C9302C" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 1" stroke-dashoffset="1"/>' for k, (x, y) in CITY.items()) + '</svg>')
A(''.join(f'<div class="cr" id="cr-{k}" style="left:{x}px;top:{y}px"></div>' for k, (x, y) in CITY.items()))
A('<div class="row" id="mr0" style="left:100px"><div class="nm">Tijuana<small>aprox. en auto</small></div><div class="tm">1 h</div></div>')
A('<div class="row" id="mr1" style="left:398px"><div class="nm">San Ysidro<small>garita · aprox.</small></div><div class="tm">1 h 30</div></div>')
A('<div class="row" id="mr2" style="left:696px"><div class="nm">Mexicali<small>aprox. en auto</small></div><div class="tm">3 h</div></div></div>')
# ---------- pagos
pa_, pb_ = PAY
A(f'<div id="pagos" class="clip mg" data-start="{pa_}" data-duration="{round(pb_ - pa_, 3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="tt" id="p-tt" style="top:300px;font-size:84px">PLAN DE PAGOS <span style="color:#FFD086">FLEXIBLE</span></div><div class="ru" id="p-ru" style="top:402px"></div>')
A('<div id="pbar"><div id="pb1"></div><div id="pb2"></div><div id="pb3"></div></div>')
A('<div class="pcard" id="pc-a" style="top:590px"><div class="n">10%</div><div class="tx"><div class="t">de enganche</div><div class="s">Al separar tu casa</div></div></div>')
A('<div class="pcard" id="pc-b" style="top:766px"><div class="n">10%</div><div class="tx"><div class="t">en 20 meses</div><div class="s">Mensualidades durante la obra</div><div class="dots">' + ''.join(f'<i id="d{i}"></i>' for i in range(20)) + '</div></div></div>')
A('<div class="pcard" id="pc-c" style="top:942px"><div class="n">80%</div><div class="tx"><div class="t">contra entrega</div><div class="s">Entrega prevista en 2028</div></div></div></div>')
# ---------- capas globales
A(f'<div id="logo" class="clip" data-start="0" data-duration="{DUR}" data-track-index="4"><div id="logo-in"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
A(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
A(f'<div id="fx" class="clip" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="flash"></div></div>')
A(f'<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="{round(VOZ_FIN + 0.3, 2)}" data-track-index="8" data-volume="1"></audio>')
MV = 0.058  # «House 02» (Mixkit 744) mide 1.5 LU menos que la pista de v11
A(f'''<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":{MV}}},{{"t":{round(VOZ_FIN + 0.1, 2)},"v":{MV}}},{{"t":{round(DUR - 0.4, 2)},"v":{MV * 1.4}}},{{"t":{DUR},"v":0}}]}}]}}'></audio>''')
SFX = {'sw': ('fast-small-sweep-166', 0.8), 'st': ('short-transition-sweep-175', 0.65), 'who': ('cinematic-whoosh-fast-1492', 1.38),
       'wu': ('syn-whoosh-up', 0.6), 'wd': ('syn-whoosh-down', 0.62), 'ss': ('syn-swish', 0.31), 'wl': ('syn-whoosh-low', 0.83), 'pop': ('syn-pop', 0.2), 'ph': ('syn-pop-hi', 0.18),
       'tk': ('syn-tick', 0.1), 'coin': ('syn-coin', 0.73), 'cha': ('syn-chaching', 1.14), 'shim': ('syn-shimmer', 0.94), 'rise': ('syn-riser', 1.04), 'boom': ('syn-boom', 0.94), 'thud': ('syn-thud', 0.33)}
FLASH = [MAP[0], PAY[0], SA['b09']]
cuts = sorted(set([a for sid_, a, *_ in SC if a > 0] + [MAP[0], PAY[0]]))
rot = ['ss', 'wd', 'sw', 'wu', 'st', 'wl']
ev = [('who' if c in FLASH else rot[i % len(rot)], max(0, c - 0.12), 0.22) for i, c in enumerate(cuts)]
T215, T235, T24 = at('$215,000', 3), at('$235,000.', 3), at('$24,000', 6)
t10, t10b, t20, t80, t28 = at('10%,', 4), at('10%', 4), at('20', 4), at('80%', 4), at('2028.', 4)
tTJ, tSY, tMX = at('tijuana,', 1), at('ysidro', 1), at('mexicali.', 1)
TC0, TB0, TA0 = at('whatsapp', 7), at('botón', 7), at('abajo', 7)
T24E = round(next(e for t, st, e in words if t == '$24,000' and st >= T24 - 0.01) - 0.05, 2)  # el contador aterriza al terminar «veinticuatro mil»
DOTS = round(min(1.0, at('y', 4) - t20), 2)  # las 20 bolitas se llenan mientras dice «veinte mensualidades»
ev += [('boom', 0.03, 0.35), ('coin', at('$215,000', 0), 0.3),
       ('pop', tTJ, 0.4), ('pop', tSY, 0.4), ('pop', tMX, 0.4), ('ss', tTJ - 0.05, 0.18), ('ss', tSY - 0.05, 0.18), ('ss', tMX - 0.05, 0.18), ('shim', MAP[0] + 0.3, 0.2),
       ('thud', SA['c07'] + 0.08, 0.35), ('cha', T215 + 0.1, 0.3), ('thud', SA['c14'] + 0.08, 0.35), ('cha', T235 + 0.1, 0.3),
       ('pop', t10, 0.35), ('coin', t20 + DOTS, 0.22), ('wu', t80 - 0.05, 0.3), ('thud', t80 + 0.45, 0.35), ('shim', t28, 0.18),
       ('pop', SA['cocina'] + 0.05, 0.4), ('ph', SA['cocina'] + 0.2, 0.4), ('pop', SA['cocina'] + 0.35, 0.4), ('ph', SA['cocina'] + 0.5, 0.4),
       ('rise', T24E - 1.0, 0.35), ('boom', T24E, 0.5), ('cha', T24E + 0.02, 0.35), ('shim', T24E + 0.4, 0.25),
       ('pop', TC0, 0.35), ('ph', TB0, 0.3), ('pop', TA0, 0.3)]
ev += [('tk', t20 + i * DOTS / 10, 0.13) for i in range(10)]  # un tic cada 2 bolitas
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
G = [{'top': CAPTOP.get(sid, CAP_TOP), 's': SA[sid], 'end': min(b, g[-1][2] + 0.4), 'w': g} for g, b, sid in groups]
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
HL2 = {'relax': round(at('rooftop', 2) - 0.05, 3), 'b02': round(at('mar', 2) - 0.05, 3), 'c18': round(at('réntala', 5) - 0.05, 3),
       'auto': round(at('fines', 5) - 0.05, 3)}
for sid, a, b, img, org, s0, s1, hl in SC:
    d = round(b - a, 3)
    if sid in VID:
        if a > 0:
            pass
    else:
        A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},transformOrigin:"{org}"}},{{scale:{s1},duration:{d},ease:"none"}},{a});')
    if hl:  # el titular entra ya visible (solo se desliza), sin cuadros vacíos
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0.001,y:30}},{{opacity:1,y:0,duration:0.18,ease:"power3.out"}},{a});tl.fromTo("#{sid}-hl .l2",{{opacity:0.001,x:-50}},{{opacity:1,x:0,duration:0.2,ease:"power3.out"}},{HL2.get(sid, round(a + 0.08, 3))});tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.22}},{round(HL2.get(sid, a + 0.08) + 0.07, 3)});')
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
tl.fromTo("#lp",{{y:24}},{{y:0,duration:0.4,ease:"power3.out"}},0);bump("#lp .b",{round(at('$215,000', 0), 2)});
// mapa (completo desde el primer cuadro)
tl.fromTo("#mgrid",{{y:0}},{{y:90,duration:{round(MAP[1] - MAP[0], 2)},ease:"none"}},{MAP[0]});
tl.fromTo("#mapi",{{scale:1.12,transformOrigin:"38% 70%"}},{{scale:1,duration:{round(MAP[1] - MAP[0], 2)},ease:"power1.out"}},{MAP[0]});
[0,1,2,3,4,5].forEach(i=>tl.fromTo("#ring",{{scale:0.4,opacity:1}},{{scale:2.4,opacity:0,duration:0.55,ease:"power1.out",immediateRender:i===0}},{MAP[0]}+i*0.6));
// cada ciudad se enciende con su palabra: línea desde el proyecto, anillo en el marcador y su tarjeta
[["tj",0,{tTJ}],["sy",1,{tSY}],["mx",2,{tMX}]].forEach(([k,i,t])=>{{
  tl.to("#ml-"+k,{{strokeDashoffset:0,duration:0.35,ease:"power2.out"}},t-0.05);
  tl.fromTo("#cr-"+k,{{scale:0.3,opacity:1}},{{scale:1,opacity:1,duration:0.25,ease:"back.out(3)",immediateRender:false}},t);
  tl.fromTo("#mr"+i,{{scale:1}},{{scale:1.1,duration:0.14,yoyo:true,repeat:1,ease:"sine.inOut",immediateRender:false}},t);
  tl.to("#mr"+i+" .tm",{{background:"#C99A2E",color:"#071D29",duration:0.15}},t);}});
tl.set(".cr",{{opacity:0}},0);
// precios fijos (sin contador)
tl.fromTo("#pr1",{{x:-40}},{{x:0,duration:0.3,ease:"power3.out"}},{SA['c07']});bump("#pr1 .b",{round(T215, 2)});
tl.fromTo("#pr2",{{x:-40}},{{x:0,duration:0.3,ease:"power3.out"}},{SA['c14']});bump("#pr2 .b",{round(T235, 2)});
// pagos: tarjetas visibles desde el inicio; cada tramo de la barra se llena cuando la voz lo dice
tl.fromTo("#pb1",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.3,ease:"power3.out"}},{t10});
tl.fromTo("#pb2",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:{DOTS},ease:"none"}},{t20});
for(let i=0;i<20;i++)tl.fromTo("#d"+i,{{background:"#E3D8C2",scale:1}},{{background:"#C99A2E",scale:1.3,duration:0.05,immediateRender:false}},{t20}+i*{DOTS / 20});
tl.to(".dots i",{{scale:1,duration:0.15}},{t20 + DOTS});
tl.fromTo("#pb3",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.5,ease:"power3.out"}},{t80});
["#pc-a","#pc-b","#pc-c"].forEach((s,i)=>tl.fromTo(s,{{x:-30}},{{x:0,duration:0.3,ease:"power3.out"}},{PAY[0]}+i*0.08));
bump("#pc-a",{t10});bump("#pc-b",{t10b});bump("#pc-c",{t80});tl.to("#pc-c .s",{{color:"#0E2A4A",duration:0.15}},{t28});
// equipamiento: las cuatro áreas y el panel con el valor
pop("#e1",{SA['cocina'] + 0.05},{{transformOrigin:"0 50%"}});pop("#e2",{SA['cocina'] + 0.2},{{transformOrigin:"0 50%"}});pop("#e3",{SA['cocina'] + 0.35},{{transformOrigin:"0 50%"}});pop("#e4",{SA['cocina'] + 0.5},{{transformOrigin:"0 50%"}});
const P0={SA['c15']},P1={T24E};
tl.fromTo("#promo",{{opacity:0.001,scale:0.8}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)"}},P0);
tl.fromTo("#rays",{{rotation:0}},{{rotation:60,duration:{round(SB['c15'] - SA['c15'], 2)},ease:"none"}},P0);
const pv={{v:0}};tl.fromTo(pv,{{v:0}},{{v:24000,duration:Math.max(0.3,P1-P0-0.1),ease:"power2.in",onUpdate:()=>{{document.getElementById("pnv").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}}}},P0+0.05);
tl.set("#pnv",{{textContent:"$24,000"}},P1);tl.fromTo("#pn",{{scale:1.4}},{{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false}},P1);
fl(P1,0.6);shake("#c15 .pz",P1);shake("#promo",P1);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{{x:0,y:0,scale:s,opacity:1}},{{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false}},P1));
tl.set(".pt",{{opacity:0}},0);tl.to("#pn",{{scale:1.06,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"}},P1+0.5);''')
TC = round(at('whatsapp', 7) - 0.05, 2); TB = round(at('botón', 7) - 0.05, 2); TA = round(at('abajo', 7) - 0.05, 2); TG = round(at('agendamos', 7) - 0.05, 2)
NREP = max(1, int((DUR - TG - 0.9) / 0.36) // 2 * 2 + 1)
A(f'''// CTA: WhatsApp con flecha hacia el botón
tl.fromTo("#ctab",{{opacity:0}},{{opacity:1,duration:0.2}},{TC});tl.fromTo("#ctl",{{opacity:0,y:-12}},{{opacity:1,y:0,duration:0.25}},{TC});
pop("#cta",{TC});tl.fromTo("#cta-s",{{opacity:0,scale:1.2}},{{opacity:1,scale:1,duration:0.25,ease:"power3.out"}},{TG});pop("#arw",{TA});
tl.to("#cta",{{scale:1.06,duration:0.2,ease:"sine.inOut",yoyo:true,repeat:1}},{TB});
tl.to("#cta",{{scale:1.05,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:{NREP}}},{round(TG + 0.3, 2)});tl.fromTo("#arw",{{y:-6}},{{y:14,duration:0.36,yoyo:true,repeat:{NREP},ease:"power1.inOut",immediateRender:false}},{round(TA + 0.3, 2)});''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P + 'index.html', 'w').write('\n'.join(H))
json.dump(words, open(P + 'words.json', 'w'), ensure_ascii=False)
print('DUR', DUR, '| tomas', len(SC), '| subtítulos', len(G))
print('\n'.join(f'{s[0]:7s} {s[1]:6.2f}-{s[2]:6.2f}' for s in SC))
print(' | '.join(' '.join(w[0] for w in g['w']) for g in G))
