# California v1 (fotos) — montaje con la voz de prueba del storyboard. Genera index.html.
import json, math, random
P='/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v1-es/'
TR=P+'transcript.json'  # Whisper medium (es) sobre assets/voz.wav
RAW=[[w['text'],w['start'],w['end']] for w in json.load(open(TR))]
# --- tiempos por palabra: ortografía del guion y palabras pegadas por Whisper
W=[]
for t,s,e in RAW:
    if t=='Unidos?¿Ganas': W+=[['Unidos?',s,1.36],['¿Ganas',1.40,e]]; continue
    if t=='dólares?¿Y': W+=[['dólares?',s,2.38],['¿Y',2.45,e]]; continue
    if t=='Controla': W+=[['controla',s,24.04],['a',24.05,24.13]]; continue
    W.append([t,s,e])
FIX={'Sausal,':'Sauzal,','planar':'planear','Para':'para','Prevista':'prevista','renta,':'renta','enganche.':'enganche,','entrega.':'entrega,',
     '$215,000':'$215,000 USD','$235,000.':'$235,000 USD.','$450,000.':'$450,000 pesos.','Controla':'controla','Smart':'smart','Home,':'home,'}
words=[]
i=0
while i<len(W):
    t,s,e=W[i]
    if t=='mini' and W[i+1][0]=='splits': words.append(['minisplits',s,W[i+1][2]]); i+=2; continue
    if t=='el' and i+1<len(W) and W[i+1][0]=='2028.': words.append(['del',s,e]); i+=1; continue
    words.append([FIX.get(t,t),s,e]); i+=1
for k in range(len(words)-1): words[k][2]=min(words[k][2],words[k+1][1])
def at(txt,after=0):
    for t,s,e in words:
        if s>=after and t.lower().strip('¿?,.').startswith(txt.lower().strip('¿')): return s
    raise KeyError(txt)
DUR=66.0
# id, ini, fin, img, origen, s0, s1, x0, x1, titular
SC=[
('c01',0,2.43,'c01','40% 35%',1.04,1.16,0,0,None),
('c02',2.43,5.40,'c02','50% 60%',1.16,1.04,0,0,('¿Y SI TU PRÓXIMA CASA','ESTUVIERA EN MÉXICO?')),
('c03',5.40,7.80,'c03','50% 40%',1.05,1.15,-2,2,('UN NUEVO CAPÍTULO','EN ENSENADA')),
('c04',7.80,8.83,'c04','70% 40%',1.12,1.04,2,-2,('CASAS','DE UN NIVEL')),
('c05',8.83,10.38,'c05','50% 70%',1.04,1.14,0,0,('TU PROPIO','ROOF GARDEN')),
('c06',10.38,12.15,'c06','70% 30%',1.15,1.04,0,0,('LOS MEJORES','ATARDECERES')),
('c07',18.60,21.00,'c07','50% 50%',1.04,1.14,0,0,None),
('c08',21.00,23.85,'c08','50% 45%',1.14,1.04,0,0,None),
('c09',23.85,27.28,'c09','50% 30%',1.04,1.12,0,0,('SMART HOME','CONTROL A DISTANCIA')),
('c10',27.28,28.92,'c10','45% 35%',1.1,1.0,0,0,None),
('c11',28.92,30.28,'c11','45% 55%',1.04,1.14,0,0,None),
('c12',30.28,31.75,'c12','50% 60%',1.14,1.04,0,0,('RENTA','A CORTO PLAZO')),
('c13',47.80,51.32,'c13','50% 40%',1.04,1.12,-1,1,('RESERVA ESTE MES','EQUIPAMIENTO INCLUIDO')),
('c14',51.32,51.70,'c14','50% 50%',1.14,1.06,0,0,None),
('c15',51.70,54.72,'c15','50% 25%',1.0,1.05,0,0,None),
('c16',54.72,56.25,'c16','50% 50%',1.04,1.14,0,0,('IMAGINA','DESPERTAR AQUÍ')),
('c17',56.25,58.05,'c17','50% 55%',1.14,1.04,0,0,('CARNE ASADA','EN FAMILIA')),
('c18',58.05,62.02,'c18','50% 45%',1.03,1.14,0,0,('TU ROOFTOP','FRENTE AL PACÍFICO')),
('c19',62.02,DUR,'c19','50% 25%',1.02,1.1,0,0,None),
]
HLTOP={'c09':800,'c13':800,'c16':800,'c18':800}
CAPTOP={'c12':1120}
NOCAP={'c01','c02','c07','c08','c14','c19'}
MAP=(12.15,18.60); PAY=(31.75,42.12); GRO=(42.12,47.80)
FLASH=[5.40,12.15,18.60,31.75,47.80,54.72,62.02]
H=[];A=H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>California v1 — Legacy Capital</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"PPCondensed";src:url("assets/fonts/OpenSans_Condensed_Bold.ttf") format("truetype");}
@font-face{font-family:"PPText";src:url("assets/fonts/OpenSans_Semibold.ttf") format("truetype");}
@font-face{font-family:"PPBold";src:url("assets/fonts/OpenSans_ExtraBold.ttf") format("truetype");}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;src:url("assets/fonts/cormorant-garamond-latin-600-normal.woff2") format("woff2");}
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
#captions{z-index:7}#logo{z-index:8;pointer-events:none}.ov{z-index:6}
#logo-in{position:absolute;left:0;right:0;top:1400px;display:flex;flex-direction:column;align-items:center;gap:6px}
#logo-in img{width:120px;height:auto;display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}#logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:38px;letter-spacing:.14em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 12px rgba(0,0,0,.6)}
#flash{position:absolute;inset:0;background:#FFF6E2;opacity:0;z-index:9;pointer-events:none}
/* hook */
#hook{position:absolute;left:70px;right:70px;top:780px;font-family:"PPCondensed";text-shadow:0 4px 14px rgba(0,0,0,.6)}
#hook .a{font-size:92px;line-height:1.05}
#hook .b{font-size:104px;line-height:1.05;color:#FFD086;display:flex;align-items:center;gap:22px;margin-top:8px}
#hook .coin{width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1C9,#E7B54A 55%,#A47611);border:5px solid #FFE7A8;color:#6B4A08;font-family:"PPBold";font-size:66px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 20px rgba(0,0,0,.4);text-shadow:none}
.pc{position:absolute;left:70px;height:96px;border-radius:999px;background:rgba(7,29,41,.88);border:4px solid #FFD086;display:flex;align-items:center;padding:0 34px;font-family:"PPBold";font-size:42px;white-space:nowrap;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.pc b{color:#FFD086;margin:0 12px;font-weight:400}
/* precios */
.pr{position:absolute;left:80px;top:290px;text-shadow:0 4px 14px rgba(0,0,0,.6)}
.pr .a{font-family:"PPCondensed";font-size:76px;line-height:1.1;letter-spacing:.02em}
.pr .d{font-family:"PPBold";font-size:40px;line-height:1.2;color:#FFD086;letter-spacing:.12em;margin-top:6px;margin-bottom:14px}
.pr .b{font-family:"PPCondensed";font-size:150px;line-height:1.2;white-space:nowrap}.pr .b small{font-size:64px;color:#FFD086;margin-left:16px}
/* chips smart */
.chk{position:absolute;height:92px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:42px;display:flex;align-items:center;padding:0 34px;box-shadow:0 10px 24px rgba(0,0,0,.4);white-space:nowrap}
/* fondos de animación */
.mg{background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%);overflow:hidden}
.mg .eb{position:absolute;left:0;right:0;top:300px;text-align:center;font-family:"PPBold";font-size:32px;letter-spacing:.2em;color:#FFD086}
.mg .tt{position:absolute;left:40px;right:40px;top:362px;text-align:center;font-family:"PPCondensed";font-size:96px;line-height:1.05;white-space:nowrap}
.mg .ru{position:absolute;left:465px;top:478px;width:150px;height:8px;border-radius:4px;background:#FFD086}
.grid{position:absolute;inset:-100px;background-image:linear-gradient(rgba(255,208,134,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(255,208,134,.06) 2px,transparent 2px);background-size:90px 90px}
/* mapa */
#mapw{position:absolute;left:197px;top:510px;width:686px;height:557px;border-radius:30px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.5);border:4px solid #FFD086}
#mapw img{width:100%;height:100%;display:block}
#ring{position:absolute;left:414px;top:902px;width:70px;height:70px;border-radius:50%;border:7px solid #FFD086}
.row{position:absolute;left:65px;right:65px;height:96px;border-radius:26px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 16px 0 30px;box-shadow:0 10px 26px rgba(0,0,0,.4)}
.row .nm{flex:1;font-family:"PPBold";font-size:40px;line-height:1.05;white-space:nowrap}.row .nm small{display:block;font-family:"PPText";font-size:24px;color:#4A5568}
.row .tm{height:70px;border-radius:999px;background:#0E2A4A;color:#FFD086;display:flex;align-items:center;padding:0 30px;font-family:"PPBold";font-size:40px;white-space:nowrap}.row .tm span{font-family:"PPText";font-size:24px;color:#fff;margin-right:10px}
.note{position:absolute;left:0;right:0;text-align:center;font-size:26px;color:#E9DCC0;font-style:italic}
/* pagos */
#pbar{position:absolute;left:65px;right:65px;top:540px;height:110px;border-radius:24px;background:rgba(255,255,255,.08);border:3px solid rgba(255,208,134,.5);overflow:hidden;display:flex}
#pbar div{height:100%}
#pb1{width:10%;background:#FFD086}#pb2{width:10%;background:repeating-linear-gradient(90deg,#E7B54A 0 4px,#C99A2E 4px 8.5px)}#pb3{width:80%;background:linear-gradient(90deg,#2F6E9A,#1D4E74)}
.pcard{position:absolute;left:65px;right:65px;height:170px;border-radius:30px;background:rgba(255,251,243,.97);color:#0E2A4A;display:flex;align-items:center;padding:0 34px;box-shadow:0 12px 30px rgba(0,0,0,.4)}
.pcard .n{width:250px;font-family:"PPCondensed";font-size:120px;line-height:1;color:#0E2A4A}
.pcard .tx{flex:1}.pcard .t{font-family:"PPBold";font-size:44px;line-height:1.1}.pcard .s{font-size:30px;line-height:1.3;color:#8A620C;font-family:"PPBold"}
.dots{display:flex;gap:7px;margin-top:8px}.dots i{display:block;width:22px;height:22px;border-radius:50%;background:#E8DDC6}
/* plusvalía */
#gsv{position:absolute;left:65px;top:520px}
.gl{position:absolute;font-family:"PPBold";font-size:30px;color:#E9DCC0;text-align:center;width:200px}
#gtag{position:absolute;left:470px;top:560px;height:84px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:38px;display:flex;align-items:center;padding:0 30px;white-space:nowrap;box-shadow:0 10px 24px rgba(0,0,0,.4)}
/* equipamiento y promo */
#eqn{position:absolute;left:80px;top:650px;display:flex;gap:16px}
#eqn .chk{position:relative}
#promo{position:absolute;left:65px;right:65px;top:836px;height:412px;border-radius:40px;background:radial-gradient(ellipse 80% 70% at 50% 45%,rgba(23,63,102,.96) 0%,rgba(7,29,41,.96) 80%);border:4px solid #FFD086;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.55)}
#rays{position:absolute;left:-560px;top:-760px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.15) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)}
#promo .a{position:absolute;left:0;right:0;top:10px;font-size:54px!important;line-height:1.1;text-align:center;font-family:"PPCondensed";font-size:64px;letter-spacing:.08em;color:#FFD086}
#pn{position:absolute;left:0;right:0;top:100px;text-align:center;font-family:"PPCondensed";font-size:160px;line-height:1;text-shadow:0 0 30px rgba(255,208,134,.85),0 0 80px rgba(255,208,134,.4)}
#promo .c{position:absolute;left:0;right:0;top:296px;font-size:40px!important;line-height:1.1;text-align:center;font-family:"PPBold";font-size:44px}
#promo .d{position:absolute;left:0;right:0;top:350px;text-align:center}#promo .d span{display:inline-block;background:#FFD086;color:#071D29;border-radius:999px;padding:6px 32px;font-family:"PPBold";font-size:34px}
.pt{position:absolute;left:470px;top:160px;width:16px;height:16px;border-radius:50%;background:#FFD086;opacity:0}
/* CTA */
#cta-t{position:absolute;left:0;right:0;top:880px;text-align:center;font-family:"PPCondensed";font-size:104px;line-height:1;text-shadow:0 4px 14px rgba(0,0,0,.65)}
#cta{position:absolute;left:110px;right:110px;top:1020px;height:116px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 12px 30px rgba(0,0,0,.45)}
#cta-wa{position:absolute;left:0;right:0;top:1160px;text-align:center;font-family:"PPBold";font-size:40px;text-shadow:0 2px 8px rgba(0,0,0,.8)}#cta-wa span{color:#FFD086}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
'''.replace('%DUR%',str(DUR)))
for sid,a,b,img,org,s0,s1,x0,x1,hl in SC:
    low=sid in HLTOP
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="0"><div class="pz"><div class="kb" data-layout-allow-overflow><img src="assets/img/{img}.jpg" alt="" /></div></div><div class="shade{" low" if low or sid in ("c01","c19","c15") else ""}"></div>')
    if hl: A(f'<div class="hl" id="{sid}-hl" style="top:{HLTOP.get(sid,290)}px"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    if sid=='c01':
        A('<div id="hook"><div class="a">¿TRABAJAS EN EE.UU.?</div><div class="b"><span class="coin" id="coin">$</span><span>¿GANAS EN DÓLARES?</span></div></div>')
        A('<div class="pc" id="pc1" style="top:300px">2 HAB.<b>·</b>DESDE $215,000 USD</div><div class="pc" id="pc2" style="top:412px">3 HAB.<b>·</b>DESDE $235,000 USD</div>')
    if sid=='c07': A('<div class="pr" id="pr1"><div class="a">2 HABITACIONES</div><div class="d">DESDE</div><div class="b"><span id="pn1">$215,000</span><small>USD</small></div></div>')
    if sid=='c08': A('<div class="pr" id="pr2"><div class="a">3 HABITACIONES</div><div class="d">DESDE</div><div class="b"><span id="pn2">$235,000</span><small>USD</small></div></div>')
    if sid=='c10': A('<div class="chk" id="k1" style="left:65px;top:300px">✓ Luces</div><div class="chk" id="k2" style="left:65px;top:410px">✓ Minisplits</div>')
    if sid=='c11': A('<div class="chk" id="k3" style="left:500px;top:860px">✓ Cerradura</div>')
    if sid=='c13': A('<div id="eqn"><div class="chk" id="e1">✓ Cocina</div></div>')
    if sid=='c14': A('<div class="chk" id="e2" style="left:80px;top:650px">✓ Cuartos</div>')
    if sid=='c15':
        A('<div class="chk" id="e3" style="left:80px;top:300px">✓ Roof garden</div>')
        A('<div id="promo"><div id="rays"></div><div class="a" id="pa">VALOR DE HASTA</div><div id="pn">$0</div>'+''.join(f'<div class="pt" id="pt{i}"></div>' for i in range(24))+'<div class="c" id="pcx">MXN EN EQUIPAMIENTO</div><div class="d" id="pd"><span>Al reservar tu casa este mes</span></div></div>')
    if sid=='c19': A('<div id="cta-t">MÁS INFORMACIÓN</div><div id="cta"><span>Haz clic en el botón de abajo</span><span id="arw">↓</span></div><div id="cta-wa">WhatsApp <span>+52 646 256 3006</span></div>')
    A('</div>')
# ---------- A01 mapa
ma,mb=MAP
A(f'<div id="mapa" class="clip mg" data-start="{ma}" data-duration="{round(mb-ma,3)}" data-track-index="0"><div class="grid" id="mgrid" data-layout-allow-overflow></div><div class="eb" id="m-eb">CARRETERA PRINCIPAL · EL SAUZAL</div><div class="tt" id="m-tt">A UN PASO <span style="color:#FFD086">DE CALIFORNIA</span></div><div class="ru" id="m-ru"></div>')
A('<div id="mapw"><img id="mapi" src="assets/img/mapa.png" alt="" /></div><div id="ring"></div>')
ROWS=[('Frontera con San Diego','San Ysidro','1 h 30 min'),('Tijuana','','1 h'),('Mexicali','','3 h')]
for i,(n,s,t) in enumerate(ROWS):
    A(f'<div class="row" id="mr{i}" style="top:1090px"><div class="nm">{n}{"<small>"+s+"</small>" if s else ""}</div><div class="tm"><span>aprox.</span>{t}</div></div>')
A('<div class="note" id="m-note" style="top:1200px">Tiempos aproximados en auto; el cruce fronterizo puede variar.</div></div>')
# ---------- A02 pagos
pa_,pb_=PAY
A(f'<div id="pagos" class="clip mg" data-start="{pa_}" data-duration="{round(pb_-pa_,3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="p-eb">PLAN DE PAGOS</div><div class="tt" id="p-tt">SIN PERDER <span style="color:#FFD086">TU LIQUIDEZ</span></div><div class="ru" id="p-ru"></div>')
A('<div id="pbar"><div id="pb1"></div><div id="pb2"></div><div id="pb3"></div></div>')
A('<div class="pcard" id="pc-a" style="top:690px"><div class="n" id="pna">10%</div><div class="tx"><div class="t">de enganche</div><div class="s">Ej.: $21,500 USD*</div></div></div>')
A('<div class="pcard" id="pc-b" style="top:880px"><div class="n" id="pnb">10%</div><div class="tx"><div class="t">en 20 mensualidades</div><div class="s">Ej.: 20 × $1,075 USD*</div><div class="dots">'+''.join(f'<i id="d{i}"></i>' for i in range(20))+'</div></div></div>')
A('<div class="pcard" id="pc-c" style="top:1070px"><div class="n" id="pnc">80%</div><div class="tx"><div class="t">contra entrega</div><div class="s" id="pc-c-s">Prevista: mediados de 2028</div></div></div>')
A('<div class="note" id="p-note" style="top:1258px;font-size:24px">*Ejemplo con casa de 2 habitaciones desde $215,000 USD.</div></div>')
# ---------- A03 plusvalía conceptual
ga,gb=GRO
A(f'<div id="plus" class="clip mg" data-start="{ga}" data-duration="{round(gb-ga,3)}" data-track-index="0"><div class="grid" data-layout-allow-overflow></div><div class="eb" id="g-eb">TU PATRIMONIO</div><div class="tt" id="g-tt">PAGA POCO A POCO</div><div class="ru" id="g-ru"></div>')
# barras de pagos (10 + 20 x 0.5 + 80) y curva de valor
bars=''
xs=[]
for i in range(22):
    x=60+i*38; xs.append(x)
    h=60 if i==0 else (26 if i<21 else 0)
    if i<21: bars+=f'<rect class="gb" id="gb{i}" x="{x}" y="{600-h}" width="26" height="{h}" rx="6" fill="{"#FFD086" if i==0 else "#C99A2E"}"/>'
bars+='<rect class="gb" id="gb21" x="880" y="420" width="60" height="180" rx="8" fill="#2F6E9A"/>'
A(f'''<svg id="gsv" width="950" height="700" viewBox="0 0 950 700">
<line x1="40" y1="600" x2="940" y2="600" stroke="rgba(255,255,255,.35)" stroke-width="4"/>{bars}
<path id="gcurve" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M60,380 C260,360 420,300 560,230 C690,165 800,110 920,60" fill="none" stroke="#FFD086" stroke-width="12" stroke-linecap="round"/>
<circle id="gdot" cx="920" cy="60" r="18" fill="#FFD086"/></svg>''')
A('<div class="gl" id="gl0" style="left:20px;top:1140px">Hoy</div><div class="gl" id="gl1" style="left:440px;top:1140px">Mensualidades</div><div class="gl" id="gl2" style="left:840px;top:1140px">Entrega<br>2028</div>')
A('<div id="gtag" style="left:220px;top:540px">↑ Plusvalía mientras pagas</div>')
A('<div class="note" id="g-note" style="top:1250px;font-size:24px">Gráfica ilustrativa. La plusvalía no está garantizada.</div></div>')
# ---------- capas globales
A(f'<div id="logo" class="clip" data-start="0" data-duration="{DUR}" data-track-index="4"><div id="logo-in"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
A(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
A(f'<div id="fx" class="clip" data-start="0" data-duration="{DUR}" data-track-index="7"><div id="flash"></div></div>')
for k,t in (('leak-a',2.2),('leak-b',61.6)):
    A(f'<div id="{k}" class="clip" data-composition-id="{k}" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="{t}" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>')
A('<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="65.32" data-track-index="8" data-volume="1"></audio>')
MV=0.05
A(f'''<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":{MV*1.6}}},{{"t":0.6,"v":{MV}}},{{"t":65.3,"v":{MV}}},{{"t":{DUR},"v":0}}]}}]}}'></audio>''')
SFX={'sw':('fast-small-sweep-166',0.8),'st':('short-transition-sweep-175',0.65),'who':('cinematic-whoosh-fast-1492',1.38),'imp':('quick-zoom-impact-772',1.25),
 'wu':('syn-whoosh-up',0.6),'wd':('syn-whoosh-down',0.62),'ss':('syn-swish',0.31),'wl':('syn-whoosh-low',0.83),'pop':('syn-pop',0.2),'ph':('syn-pop-hi',0.18),'tk':('syn-tick',0.1),'coin':('syn-coin',0.73),'cha':('syn-chaching',1.14),'shim':('syn-shimmer',0.94),'rise':('syn-riser',1.04),'boom':('syn-boom',0.94),'thud':('syn-thud',0.33)}
cuts=sorted(set([a for _,a,*_ in SC if a>0]+[MAP[0],PAY[0],GRO[0]]))
rot=['ss','wd','sw','wu','ss','st','wd','sw','wl','ss']
ev=[]
for i,c in enumerate(cuts):
    k='who' if c in FLASH else rot[i%len(rot)]
    ev.append((k,max(0,c-(0.3 if k in('wu','wl','who') else 0.12)),0.22 if k!='who' else 0.3))
T=at
ev+=[('boom',0.03,0.35),('pop',0.95,0.4),('coin',T('¿ganas')+0.05,0.3),('pop',T('¿ganas')+0.25,0.35),('ph',T('dólares')+0.1,0.35),
     ('thud',T('dos',18)+0.05,0.35),('cha',T('$215')+0.1,0.3),('thud',T('tres',21)+0.05,0.35),('cha',T('$235')+0.1,0.3),
     ('ph',T('luces'),0.4),('ph',T('minisplits'),0.4),('pop',T('cerradura'),0.4),
     ('pop',T('frontera'),0.4),('pop',T('tijuana'),0.4),('pop',T('mexicali'),0.4),('shim',MAP[0]+0.5,0.25),
     ('thud',T('10%'),0.45),('pop',T('10%',35.5),0.4),('thud',T('80%'),0.45),('shim',T('prevista'),0.25)]
ev+=[('tk',T('20',36.5)+i*0.055,0.18) for i in range(20)]
ev+=[('wu',T('ganar',45)-0.2,0.3),('shim',T('plusvalía'),0.3),
     ('pop',T('cocina'),0.4),('ph',T('cuartos'),0.4),('pop',T('roof',51.5),0.4),
     ('rise',52.25,0.35),('boom',T('$450'),0.5),('cha',T('$450')+0.02,0.35),('shim',T('$450')+0.4,0.25),('pop',62.15,0.35)]
for i,(k,t,v) in enumerate(ev):
    f,d=SFX[k]
    A(f'<audio id="sfx{i}" src="assets/sfx/{f}.mp3" data-start="{round(t,3)}" data-duration="{d}" data-track-index="{10+i%9}" data-volume="{v}"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# ---------- subtítulos por palabra
groups=[]
for sid,a,b,*_ in SC:
    if sid in NOCAP: continue
    cur=[]
    for w in words:
        if not (a-0.06<=w[1]<b-0.06): continue
        if cur and (len(cur)>=4 or len(' '.join(x[0] for x in cur))+len(w[0])>20 or cur[-1][0][-1] in ',.:;?'):
            groups.append((cur,b,sid)); cur=[]
        cur.append(w)
    if cur: groups.append((cur,b,sid))
SA={x[0]:x[1] for x in SC}
G=[{'top':CAPTOP.get(sid,1085),'s':SA[sid],'end':min(b,g[-1][2]+0.5),'w':g} for g,b,sid in groups]
# en c15 el subtítulo deja paso a la promo
G=[g for g in G if not (g['s']==51.70 and g['w'][0][1]>52.2)]
for g in G:
    if g['s']==51.70: g['end']=min(g['end'],52.3)
A('const CAPS='+json.dumps(G,ensure_ascii=False)+';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);});
host.appendChild(line);const st=Math.max(g.s,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.8},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t,e],wi)=>{const id="#cap-"+gi+"-"+wi;tl.to(id,{color:"#FFD086",scale:1.05,duration:0.07,ease:"power2.out"},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to(id,{color:"#ffffff",scale:1,duration:0.07,ease:"none"},nx[1]-0.04);});
const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.4},Object.assign({opacity:1,scale:1,duration:0.26,ease:"back.out(2.6)"},o||{}),t);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:50},Object.assign({opacity:1,y:0,duration:0.26,ease:"power3.out"},o||{}),t);
const fl=(t,o)=>tl.fromTo("#flash",{opacity:o||0.7},{opacity:0,duration:0.28,ease:"power2.out",immediateRender:false},t);
const shake=(s,t)=>tl.fromTo(s,{x:0,y:0},{keyframes:[{x:-14,y:9},{x:12,y:-10},{x:-8,y:6},{x:6,y:-3},{x:0,y:0}],duration:0.32,ease:"none",immediateRender:false},t);
tl.set("#flash",{opacity:0},0);''')
for sid,a,b,img,org,s0,s1,x0,x1,hl in SC:
    d=round(b-a,3)
    A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},xPercent:{x0},transformOrigin:"{org}"}},{{scale:{s1},xPercent:{x1},duration:{d},ease:"none"}},{a});')
    if a>0: A(f'tl.fromTo("#{sid} .pz",{{scale:1.14,filter:"blur(6px)"}},{{scale:1,filter:"blur(0px)",duration:0.3,ease:"power3.out"}},{a});')
    if hl:
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,y:40,scale:1.2}},{{opacity:1,y:0,scale:1,duration:0.24,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(a+0.05,3)});tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-60}},{{opacity:1,x:0,duration:0.24,ease:"power3.out"}},{round(a+0.16,3)});tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25}},{round(a+0.25,3)});')
for t in FLASH: A(f'fl({t});')
# partículas
random.seed(7);pts=[]
for i in range(24):
    ang=i/24*2*math.pi+random.uniform(-.1,.1); r=random.uniform(300,520)
    pts.append((round(math.cos(ang)*r),round(math.sin(ang)*r*0.7),round(random.uniform(0.6,1.6),2)))
A('const PTS='+json.dumps(pts)+';')
tg=T('¿ganas'); A(f'''// hook
tl.fromTo("#hook .a",{{opacity:0,scale:1.4,filter:"blur(12px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.32,ease:"power4.out",transformOrigin:"0 50%"}},0.03);
tl.fromTo("#hook .b",{{opacity:0,x:-80}},{{opacity:1,x:0,duration:0.26,ease:"back.out(2)"}},{tg});
tl.fromTo("#coin",{{rotationY:0,scale:0.3}},{{rotationY:720,scale:1,duration:0.6,ease:"power3.out"}},{tg});
pop("#pc1",0.95);pop("#pc2",1.15);tl.to("#pc1,#pc2",{{scale:1.06,duration:0.2,yoyo:true,repeat:3,ease:"sine.inOut"}},1.5);
tl.fromTo("#logo-in",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.4,ease:"power2.out"}},0.3);''')
for n,word,after,val in ((1,'$215',18,215000),(2,'$235',21,235000)):
    sid='c07' if n==1 else 'c08'; a=SA[sid]; tw=T(word,after)
    A(f'''up("#pr{n} .a",{a+0.05});up("#pr{n} .d",{a+0.2});
const pv{n}={{v:0}};tl.fromTo("#pr{n} .b",{{opacity:0,scale:0.5}},{{opacity:1,scale:1,duration:0.25,ease:"back.out(2)",transformOrigin:"0 50%"}},{round(tw-0.55,2)});
tl.fromTo(pv{n},{{v:0}},{{v:{val},duration:0.55,ease:"power2.out",onUpdate:()=>{{document.getElementById("pn{n}").textContent="$"+(Math.round(pv{n}.v/1000)*1000).toLocaleString("en-US");}}}},{round(tw-0.55,2)});
tl.set("#pn{n}",{{textContent:"${val:,}"}},{round(tw,2)});tl.fromTo("#pr{n} .b",{{scale:1.25}},{{scale:1,duration:0.35,ease:"elastic.out(1,0.5)",immediateRender:false}},{round(tw,2)});shake("#{sid} .pz",{round(tw,2)});fl({round(tw,2)},0.35);''')
A(f'''pop("#k1",{T('luces')});pop("#k2",{T('minisplits')});pop("#k3",{T('cerradura')});
// mapa
tl.fromTo("#m-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{MAP[0]+0.05});tl.fromTo("#m-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{MAP[0]+0.1});tl.fromTo("#m-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{MAP[0]+0.3});
tl.fromTo("#mgrid",{{y:0}},{{y:90,duration:{MAP[1]-MAP[0]},ease:"none"}},{MAP[0]});
tl.fromTo("#mapw",{{clipPath:"circle(0% at 36.8% 78%)"}},{{clipPath:"circle(140% at 36.8% 78%)",duration:0.6,ease:"power3.out"}},{MAP[0]+0.35});
tl.fromTo("#mapi",{{scale:1.5,transformOrigin:"36.8% 78%"}},{{scale:1,duration:2.6,ease:"power2.out"}},{MAP[0]+0.35});
[0,1,2,3].forEach(i=>tl.fromTo("#ring",{{scale:0.3,opacity:1}},{{scale:2.6,opacity:0,duration:0.5,ease:"power1.out",immediateRender:i===0}},{MAP[0]+0.5}+i*0.55));
''')
for i,w in enumerate(['frontera','tijuana','mexicali']):
    t=T(w); prev=f'tl.to("#mr{i-1}",{{opacity:0,y:-40,duration:0.15}},{t-0.08});' if i else ''
    A(f'{prev}tl.fromTo("#mr{i}",{{opacity:0,x:-160,scale:0.9}},{{opacity:1,x:0,scale:1,duration:0.26,ease:"back.out(1.8)"}},{t});pop("#mr{i} .tm",{t+0.1});')
A(f'tl.fromTo("#m-note",{{opacity:0}},{{opacity:1,duration:0.3}},{T("frontera")+0.4});')
# pagos
A(f'''tl.fromTo("#p-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{PAY[0]+0.05});tl.fromTo("#p-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{T('sin',32.5)});tl.fromTo("#p-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{T('sin',32.5)+0.2});
tl.fromTo("#pbar",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.3}},{T('liquidez')});
tl.fromTo("#pb1",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.3,ease:"power3.out"}},{T('10%')});
tl.fromTo("#pb2",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:1.0,ease:"none"}},{T('20',36.5)});
tl.fromTo("#pb3",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.5,ease:"power3.out"}},{T('80%')});
pop("#pc-a",{T('10%')});pop("#pc-b",{T('10%',35.5)});pop("#pc-c",{T('80%')});
tl.fromTo("#pc-c-s",{{opacity:0}},{{opacity:1,duration:0.25}},{T('prevista')});tl.to("#pc-c-s",{{scale:1.1,transformOrigin:"0 50%",duration:0.18,yoyo:true,repeat:1}},{T('2028')});
for(let i=0;i<20;i++)tl.to("#d"+i,{{background:"#C99A2E",scale:1.25,duration:0.05}},{T('20',36.5)}+i*0.055);
tl.fromTo("#p-note",{{opacity:0}},{{opacity:1,duration:0.3}},{T('10%')+0.4});
const cnt=(sel,t,to)=>{{const o={{v:0}};tl.fromTo(o,{{v:0}},{{v:to,duration:0.4,ease:"power2.out",onUpdate:()=>{{document.querySelector(sel).textContent=Math.round(o.v)+"%";}}}},t);tl.set(sel,{{textContent:to+"%"}},t+0.42);}};
cnt("#pna",{T('10%')},10);cnt("#pnb",{T('10%',35.5)},10);cnt("#pnc",{T('80%')},80);shake("#pc-c",{T('80%')+0.42});
// plusvalía
tl.fromTo("#g-eb",{{opacity:0,y:-20}},{{opacity:1,y:0,duration:0.25}},{GRO[0]+0.05});tl.fromTo("#g-tt",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},{GRO[0]+0.1});tl.fromTo("#g-ru",{{scaleX:0}},{{scaleX:1,duration:0.25}},{GRO[0]+0.3});
for(let i=0;i<22;i++)tl.fromTo("#gb"+i,{{scaleY:0,transformOrigin:"50% 100%",transformBox:"fill-box"}},{{scaleY:1,duration:0.18,ease:"back.out(2)"}},{GRO[0]+0.5}+i*0.07);
tl.fromTo(".gl",{{opacity:0}},{{opacity:1,duration:0.3,stagger:0.25}},{GRO[0]+0.6});
tl.to("#gcurve",{{attr:{{"stroke-dashoffset":0}},duration:3.4,ease:"power1.inOut"}},{GRO[0]+1.3});
tl.fromTo("#gdot",{{scale:0,transformOrigin:"50% 50%",transformBox:"fill-box"}},{{scale:1,duration:0.3,ease:"back.out(3)"}},{GRO[0]+4.6});
tl.fromTo("#gdot",{{scale:1}},{{scale:1.5,duration:0.25,yoyo:true,repeat:3,immediateRender:false}},{GRO[0]+4.95});
pop("#gtag",{T('plusvalía')});tl.fromTo("#g-note",{{opacity:0}},{{opacity:1,duration:0.3}},{GRO[0]+1.0});
// equipamiento
pop("#e1",{T('cocina')},{{transformOrigin:"0 50%"}});pop("#e2",{T('cuartos')},{{transformOrigin:"0 50%"}});pop("#e3",{T('roof',51.5)},{{transformOrigin:"0 50%"}});
// promo $450,000
const P0=52.25,P1={T('$450')};
tl.fromTo("#promo",{{opacity:0,scale:0.6}},{{opacity:1,scale:1,duration:0.3,ease:"back.out(2)"}},P0);
tl.fromTo("#rays",{{rotation:0}},{{rotation:60,duration:{SA['c16']}-P0,ease:"none"}},P0);
tl.fromTo("#pa",{{opacity:0,y:-30}},{{opacity:1,y:0,duration:0.25}},P0+0.1);
const pv={{v:0}};tl.fromTo(pv,{{v:0}},{{v:450000,duration:P1-P0-0.15,ease:"power2.in",onUpdate:()=>{{document.getElementById("pn").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}}}},P0+0.15);
tl.set("#pn",{{textContent:"$450,000"}},P1);tl.fromTo("#pn",{{scale:1.5}},{{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false}},P1);
fl(P1,0.75);shake("#c15 .pz",P1);shake("#promo",P1);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{{x:0,y:0,scale:s,opacity:1}},{{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false}},P1));
tl.set(".pt",{{opacity:0}},0);up("#pcx",P1+0.2);pop("#pd",P1+0.45);tl.to("#pn",{{scale:1.07,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"}},P1+0.5);
// CTA
tl.fromTo("#cta-t",{{opacity:0,scale:1.3,filter:"blur(10px)"}},{{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"}},62.15);
pop("#cta",{T('clic')});tl.fromTo("#cta-wa",{{opacity:0}},{{opacity:1,duration:0.3}},{T('recibir')});
tl.to("#cta",{{scale:1.07,duration:0.36,ease:"sine.inOut",yoyo:true,repeat:7}},{T('clic')+0.4});tl.fromTo("#arw",{{y:-6}},{{y:10,duration:0.36,yoyo:true,repeat:7,ease:"power1.inOut"}},{T('clic')+0.4});''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P+'index.html','w').write('\n'.join(H))
print(len(G),'grupos de subtítulos')
print(' | '.join(' '.join(w[0] for w in g['w']) for g in G))
json.dump(words,open(P+'words.json','w'),ensure_ascii=False)
