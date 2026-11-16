import json
P='/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-doctor-v11-es/'
W=json.load(open('/home/user/Legacy-capital/estudio-video/proyectos/punta-pacifico/voz/v10/words.json'))
# subtítulos: cifras con número, ortografía de nombres
fixi={0:'Doctor',3:'¿buscas',27:'Sauzal,',53:'$3.9',55:'$4.9',61:'1',64:'2',66:'3',71:'privado,',155:'minisplit',181:'$450 mil'}
drop={156}
words=[]
for i,(t,s,e) in enumerate(W):
    if i in drop: continue
    words.append([fixi.get(i,t),s,e])
for i in range(len(words)-1): words[i][2]=min(words[i][2],words[i+1][1])
DUR=66.4
# id, ini, fin, img, origin, s0, s1, x0, x1, titular(l1,l2,sm), leyenda
SC=[
('s01',0,2.6,'clip:ai-doc-1080','50% 0%',1,1,0,0,None,1),
('s02',2.6,3.95,'clip:ai-sala-cut','50% 50%',1,1,0,0,('DESCONECTA','DE LA GUARDIA',''),1),
('s03',3.95,6.5,'clip:ai-celebra-cut','50% 50%',1,1,0,0,('TU DINERO','TRABAJANDO PARA TI',''),1),
('s04',15.45,17.1,'v04','50% 50%',1.1,1.18,-2,2,None,1),
('s05',17.1,19.4,'clip:fachada','50% 60%',1,1,0,0,None,1),
('s06',19.4,21.55,'clip:ai-recamara-cut','50% 50%',1,1,0,0,('SIN ESCALERAS','TODO EN UNA PLANTA',''),1),
('s07',21.55,22.65,'clip:ai-roofpareja-cut','50% 50%',1,1,0,0,('TU TERRAZA','SOLO PARA TI',''),1),
('s08',22.65,24.7,'clip:ai-pareja-mar-cut','50% 50%',1,1,0,0,('ATARDECERES','FRENTE AL PACÍFICO',''),1),
('s09',24.7,26.03,'clip:ai-alberca-cut','50% 50%',1,1,0,0,('RELÁJATE','DESPUÉS DEL TURNO',''),1),
('s10',26.03,28.4,'clip:ai-pickleball-cut','50% 50%',1,1,0,0,('ACTÍVATE','SIN SALIR DE CASA',''),1),
('s11',28.4,29.4,'clip:ai-asador-cut','50% 50%',1,1,0,0,None,1),
('s12',29.4,32.33,'clip:ai-cena-v2-cut','50% 50%',1,1,0,0,('MOMENTOS','QUE SÍ IMPORTAN',''),1),
('s13',32.33,34.0,'clip:ai-roofcena-cut','50% 50%',1,1,0,0,('TU LUGAR','PARA RECIBIR',''),1),
('s14',34.0,35.85,'clip:ai-liquidez-cut','50% 50%',1,1,0,0,('PAGA MIENTRAS','SE CONSTRUYE',''),1),
('s15',45.4,47.0,'clip:ai-renta-cut','50% 50%',1,1,0,0,None,1),
('s16',47.0,49.15,'clip:ai-smart-cut','50% 50%',1,1,0,0,('TODO','BAJO CONTROL',''),1),
('s17',49.15,50.55,'clip:celular','50% 50%',1,1,0,0,('DESDE','DONDE ESTÉS',''),1),
('s18',50.55,53.0,'clip:ai-cerradura-cut','50% 50%',1,1,0,0,('LLEGA','Y TODO LISTO',''),1),
('s19',53.0,54.65,'clip:ai-aparta-cut','50% 50%',1,1,0,0,('TU CASA','YA EQUIPADA',''),1),
('s20',54.65,55.75,'clip:ai-cocina-cut','50% 50%',1,1,0,0,None,1),
('s21',55.75,56.35,'v23','50% 50%',1.1,1.16,0,0,None,1),
('s22',56.35,56.7,'r-bano','50% 50%',1.06,1.12,0,0,None,1),
('s23',56.7,58.6,'clip:ai-roofeq-cut','50% 50%',1,1,0,0,None,1),
]
CAPTOP={'s01':1105,'s02':760}
HLTOP={}
ONE=set()
NOCAP={'s04','s05'}
NOTOP={'s01','s11'}
MG=[('mg1',10.3,5.15),('mg4',35.85,7.25),('mg3',43.1,2.3)]
PROMO=(58.6,61.25); END=(61.25,DUR)
H=[];A=H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Doctor V11 — Legacy Capital</title>
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
.mgv{position:absolute;inset:0;width:1080px;height:1920px;object-fit:cover}
.bg{overflow:hidden}.bg .kb{position:absolute;inset:0}.bg img{width:100%;height:100%;object-fit:cover;display:block}
.shade-lo{background:linear-gradient(180deg,rgba(7,29,41,0) 0%,rgba(7,29,41,0) 55%,rgba(7,29,41,.35) 100%)!important}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.78) 0%,rgba(7,29,41,.45) 24%,rgba(7,29,41,.08) 38%,rgba(7,29,41,0) 50%,rgba(7,29,41,.35) 100%)}
.hl{position:absolute;left:90px;top:290px;font-family:"PPCondensed",sans-serif;font-size:96px;line-height:1.16;letter-spacing:.01em;text-shadow:0 3px 10px rgba(0,0,0,.45)}
.hl .l2{color:#FFD086}.hl.one{top:285px;font-size:80px;display:flex;gap:20px;white-space:nowrap}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:18px;border-radius:4px}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 28px 8px;border-radius:20px;background:rgba(7,29,41,.5);text-align:center;font-family:"PPBold",sans-serif;font-size:60px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff}
#hook{position:absolute;left:70px;right:70px;top:860px;font-family:"PPCondensed";text-shadow:0 4px 14px rgba(0,0,0,.55)}
#hook .a{font-size:96px;line-height:1.05;letter-spacing:.01em}
#hook .b{font-size:47px;white-space:nowrap;line-height:1.08;color:#FFD086;margin-top:10px}
#hook .rule{width:170px;height:8px;border-radius:5px;background:#FFD086;margin-top:14px}
.pr{position:absolute;left:90px;top:300px;text-shadow:0 4px 12px rgba(0,0,0,.55)}
.pr .a{font-family:"PPCondensed";font-size:64px;line-height:1.2;color:#FFD086;letter-spacing:.08em}
.pr .b{font-family:"PPCondensed";font-size:240px;line-height:1.3}
.pr .c{font-family:"PPBold";font-size:46px;line-height:1.3}
.chip{position:absolute;left:90px;height:90px;border-radius:999px;background:rgba(7,29,41,.85);border:3px solid #FFD086;display:flex;align-items:center;padding:0 38px;font-family:"PPBold";font-size:46px}
.chip span{color:#FFD086;margin-right:18px}
#srv .srv-sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.82) 0%,rgba(7,29,41,.55) 26%,rgba(7,29,41,0) 36%,rgba(7,29,41,.15) 60%,rgba(7,29,41,.4) 100%)}
#srv-eb{position:absolute;left:65px;top:282px;font-family:"PPBold";font-size:28px;letter-spacing:.14em;color:#FFD086;text-shadow:0 2px 8px rgba(0,0,0,.6)}
#srv-t{position:absolute;left:65px;top:326px;font-family:"PPCondensed";font-size:84px;line-height:1.1;text-shadow:0 3px 12px rgba(0,0,0,.55)}#srv-t span{color:#FFD086}
#srv-r{position:absolute;left:65px;top:524px;width:160px;height:8px;border-radius:4px;background:#FFD086}
.sc{position:absolute;width:495px;height:112px;border-radius:24px;border:4px solid #E3B869;background:rgba(255,251,243,.96);display:flex;align-items:center;padding:0 12px;box-shadow:0 10px 24px rgba(0,0,0,.35);color:#132B6B}
.sc img{width:78px;height:78px;border-radius:50%;flex:none}.sc .bar2{width:5px;height:78px;background:#C99A2E;margin:0 12px;flex:none;border-radius:3px}
.sc .tx{display:flex;flex-direction:column;align-items:flex-start;gap:3px}
.sc .nm{font-family:"PPBold";font-size:25px;line-height:1.08}.sc .pl{padding:0 16px 2px;border-radius:999px;background:#8A620C;color:#fff;font-family:"PPBold";font-size:24px;line-height:1.3;white-space:nowrap}
.sc .nm.sm{font-size:20px;white-space:nowrap}
#logo{z-index:5;pointer-events:none}
#logo-in{position:absolute;left:0;right:0;top:1312px;display:flex;flex-direction:column;align-items:center;gap:6px}
#logo-in img{width:62px;height:auto;display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}#logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:22px;letter-spacing:.14em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 12px rgba(0,0,0,.6)}
.mgz{z-index:6}#end{z-index:6}#captions{z-index:7}
#eq{position:absolute;left:90px;top:290px;font-family:"PPCondensed";font-size:96px;line-height:1.16;text-shadow:0 3px 10px rgba(0,0,0,.45)}#eq span{color:#FFD086;display:block}
#eq-n{position:absolute;left:90px;top:540px;height:74px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:36px;display:flex;align-items:center;padding:0 30px}
/* rentas */
#rent{position:absolute;left:65px;right:65px;top:280px;height:400px;border-radius:34px;background:rgba(7,29,41,.86);border:3px solid #FFD086;box-shadow:0 18px 50px rgba(0,0,0,.45)}
#rent .t{position:absolute;left:44px;top:22px;font-family:"PPCondensed";font-size:56px;line-height:1.1;color:#FFD086}
#rent .s{position:absolute;left:44px;top:92px;font-size:28px}
.bar{position:absolute;bottom:36px;width:96px;border-radius:14px 14px 4px 4px;background:linear-gradient(180deg,#FFD086,#C99A2E)}
.coin{position:absolute;width:74px;height:74px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF1C9,#E7B54A 55%,#A47611);border:4px solid #FFE7A8;color:#6B4A08;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 16px rgba(0,0,0,.35)}
#rent-arrow{position:absolute;left:0;top:0}
.plus{position:absolute;font-family:"PPBold";font-size:44px;color:#FFD086;text-shadow:0 3px 8px rgba(0,0,0,.6)}
/* promo */
#promo{background:radial-gradient(ellipse 90% 60% at 50% 42%,#173F66 0%,#071D29 72%);overflow:hidden}
#rays{position:absolute;left:-460px;top:-160px;width:2000px;height:2000px;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.16) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)}
#pz{position:absolute;inset:0}
#promo .a{position:absolute;left:0;right:0;top:360px;text-align:center;font-family:"PPCondensed";font-size:96px;line-height:1.1;letter-spacing:.08em;color:#FFD086}
#pn-wrap{position:absolute;left:0;right:0;top:530px;height:300px;text-align:center}
#pn{display:inline-block;font-family:"PPCondensed";font-size:240px;line-height:1.2;color:#fff;text-shadow:0 0 30px rgba(255,208,134,.85),0 0 80px rgba(255,208,134,.45)}
#shine{position:absolute;left:0;top:520px;width:260px;height:300px;background:linear-gradient(100deg,rgba(255,255,255,0) 0%,rgba(255,255,255,.65) 50%,rgba(255,255,255,0) 100%);mix-blend-mode:overlay}
#promo .c{position:absolute;left:0;right:0;top:880px;text-align:center;font-family:"PPBold";font-size:52px;line-height:1.2}
#promo .d{position:absolute;left:0;right:0;top:970px;text-align:center;font-family:"PPBold";font-size:40px;line-height:1.2;color:#071D29}
#promo .d span{display:inline-block;background:#FFD086;border-radius:999px;padding:8px 36px}
.pt{position:absolute;left:532px;top:660px;width:16px;height:16px;border-radius:50%;background:#FFD086;opacity:0}
#pflash{position:absolute;inset:0;background:#FFF3D6;opacity:0}
/* cierre */
#end{background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%)}
#end-crest{position:absolute;left:50%;top:300px;width:230px;height:auto;margin-left:-115px}
#end-brand{position:absolute;left:0;right:0;top:620px;text-align:center;font-family:"Cinzel",serif;font-weight:700;font-size:56px;letter-spacing:.1em}
#end-re{position:absolute;left:0;right:0;top:695px;text-align:center;font-size:28px;letter-spacing:.42em;color:#FFD086}
#end-mas{position:absolute;left:0;right:0;top:790px;text-align:center;font-family:"PPCondensed";font-size:120px;line-height:1}
#end-cta{position:absolute;left:120px;right:120px;top:950px;height:116px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px}
#end-arrow{display:inline-block}
#end-wa{position:absolute;left:0;right:0;top:1110px;text-align:center;font-family:"PPBold";font-size:42px}#end-wa span{color:#FFD086}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%DUR%" data-width="1080" data-height="1920">
'''.replace('%DUR%',str(DUR)))
for sid,a,b,img,org,s0,s1,x0,x1,hl,lg in SC:
    if img.startswith('clip:'):
        A(f'<video id="{sid}-v" class="clip mgv" src="assets/clips/{img[5:]}.mp4" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="1" muted playsinline></video>')
        A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="2"><div class="shade{' shade-lo' if sid in NOTOP else ''}"></div>')
    else:
        A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="0"><div class="kb" data-layout-allow-overflow><img src="assets/img/{img}.jpg" alt="" /></div><div class="shade{' shade-lo' if sid in NOTOP else ''}"></div>')
    if hl and sid in ONE: A(f'<div class="hl one" id="{sid}-hl"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div></div>')
    elif hl: A(f'<div class="hl" id="{sid}-hl" style="top:{HLTOP.get(sid,290)}px"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    if sid=='s01': A('<div id="hook"><div class="a">DOCTOR O MÉDICO,</div><div class="b">¿BUSCAS COMPRAR CASA CON VISTA AL MAR?</div><div class="rule"></div></div>')
    if sid=='s04': A('<div class="pr" id="pr1"><div class="a">DESDE</div><div class="b">$3.9</div><div class="c">MILLONES DE PESOS</div></div>')
    if sid=='s05': A('<div class="pr" id="pr2"><div class="a">HASTA</div><div class="b">$4.9</div><div class="c">MILLONES DE PESOS · MXN</div></div>')
    if sid=='s15':
        A('<div id="rent"><div class="t">TU CASA TAMBIÉN PRODUCE</div><div class="s">Escenario ilustrativo · no garantizado</div>')
        for i,h in enumerate([50,80,110,140,175,210]):
            A(f'<div class="bar" id="rb{i}" style="left:{60+i*150}px;height:{h}px"></div><div class="coin" id="rc{i}" style="left:{71+i*150}px;top:{400-36-h-84}px">$</div>')
        A('<svg id="rent-arrow" width="950" height="400" viewBox="0 0 950 400"><path id="ra" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M90,330 L240,300 L390,268 L540,236 L690,200 L860,150" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><polygon id="rah" points="860,150 822,152 846,182" fill="#fff" opacity="0"/></svg></div>')
    A('</div>')
A('<video id="srv-v1" class="clip mgv" src="assets/clips/aereo-terreno.mp4" data-start="6.5" data-duration="1.9" data-track-index="1" muted playsinline></video>')
A('<video id="srv-v2" class="clip mgv" src="assets/clips/aereo-marina.mp4" data-start="8.4" data-duration="1.9" data-track-index="1" muted playsinline></video>')
A('<div id="srv" class="clip" data-start="6.5" data-duration="3.8" data-track-index="2"><div class="srv-sh"></div><div id="srv-eb">EL SAUZAL · ENTRADA DE ENSENADA</div><div id="srv-t">SERVICIOS Y PUNTOS<br><span>DE INTERÉS ALREDEDOR</span></div><div id="srv-r"></div>')
SRV=[('Punta Morro /<br>restaurante y hotel','aprox. 2 min',1),('Hotel Coral &amp; Marina','aprox. 4–5 min',5),('Soriana /<br>autoservicio','aprox. 3 min',2),('OXXO y tiendas<br>de conveniencia','aprox. 4 min',6),('CETYS<br>Universidad','aprox. 5 min',3),('UABC / CICESE','aprox. 3–4 min',7),('Hospitales y<br>servicios médicos','aprox. 7 min',4),None]
for k,c in enumerate(SRV):
    inner=(f'<div class="nm">{c[0]}</div><div class="pl">{c[1]}</div>' if c else '<div class="nm sm">A menos de</div><div class="pl">800 metros</div><div class="nm sm">de la carretera de Ensenada</div>')
    A(f'<div class="sc" id="sc{k}" style="left:{40+(k%2)*505}px;top:{770+(k//2)*120}px"><img src="assets/ico/ico{c[2] if c else 8}.png" alt="" /><div class="bar2"></div><div class="tx">{inner}</div></div>')
A('</div>')
A(f'<div id="logo" class="clip" data-start="0" data-duration="{END[0]}" data-track-index="4"><div id="logo-in"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
A('<div id="eqw" class="clip" data-start="54.65" data-duration="3.95" data-track-index="3"><div id="eq">INCLUIDO<span>DESDE EL DÍA 1</span></div><div id="eq-n">Cocina</div></div>')
for k,a,d in MG:
    A(f'<video id="{k}" class="clip mgv mgz" src="assets/mg/{k}.mp4" data-start="{a}" data-duration="{d}" data-track-index="1" data-has-audio="true" data-volume="0.42" playsinline></video>')
pa,pb=PROMO
A(f'<div id="promo" class="clip" data-start="{pa}" data-duration="{round(pb-pa,3)}" data-track-index="0"><div id="rays"></div><div id="pz" data-layout-allow-overflow>')
import math,random
random.seed(7)
for i in range(28):
    A(f'<div class="pt" id="pt{i}"></div>')
A('<div class="a" id="pa">AHORRA HASTA</div><div id="pn-wrap"><span id="pn">$0</span></div><div id="shine"></div><div class="c" id="pc">EN EQUIPAMIENTO INCLUIDO</div><div class="d" id="pd"><span>Al apartar tu casa este mes</span></div></div><div id="pflash"></div></div>')
ea,eb=END
A(f'''<div id="end" class="clip" data-start="{ea}" data-duration="{round(eb-ea,3)}" data-track-index="0">
<img id="end-crest" src="assets/crest.png" alt="Legacy Capital" /><div id="end-brand">LEGACY CAPITAL</div><div id="end-re">REAL ESTATE</div>
<div id="end-mas">MÁS INFORMACIÓN</div><div id="end-cta"><span>Haz clic en el botón de abajo</span><span id="end-arrow">↓</span></div><div id="end-wa">WhatsApp <span>+52 646 256 3006</span></div></div>
<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>
<div id="leak-a" class="clip" data-composition-id="leak-a" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="6.1" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>
<div id="leak-b" class="clip" data-composition-id="leak-b" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="60.8" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>
<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="65.6" data-track-index="8" data-volume="1"></audio>
<audio id="musica" src="assets/musica-nueva.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0.07}},{{"t":65.2,"v":0.07}},{{"t":{DUR},"v":0}}]}}]}}'></audio>
''')
SFX={'sw':('fast-small-sweep-166',0.8),'st':('short-transition-sweep-175',0.65),'who':('cinematic-whoosh-fast-1492',1.38),'fw':('fast-whoosh-1490',1.8),'imp':('quick-zoom-impact-772',1.25),'air':('air-zoom-vacuum-2608',1.3),
 'wu':('syn-whoosh-up',0.6),'wd':('syn-whoosh-down',0.62),'ss':('syn-swish',0.31),'wl':('syn-whoosh-low',0.83),'pop':('syn-pop',0.2),'ph':('syn-pop-hi',0.18),'tk':('syn-tick',0.1),'coin':('syn-coin',0.73),'cha':('syn-chaching',1.14),'shim':('syn-shimmer',0.94),'rise':('syn-riser',1.04),'boom':('syn-boom',0.94),'thud':('syn-thud',0.33)}
mgst=set(a for _,a,_ in MG)
cuts=sorted(set([a for _,a,*_ in SC if a>0]+[PROMO[0],END[0]]))
rot=['wu','ss','wd','sw','wl','ss','st','wu','wd','ss']
ev=[]
for i,c in enumerate(cuts):
    if c in mgst or c in (PROMO[0],END[0]): continue
    k=rot[i%len(rot)]; ev.append((k,max(0,c-(0.3 if k in('wu','wl') else 0.15)),0.2))
ev+=[('wu',6.25,0.25),('ss',8.25,0.2)]+[(['pop','ph','thud','pop','ph','tk','pop','ph'][i],6.95+i*0.2,0.4) for i in range(8)]+[('shim',9.2,0.2)]
ev+=[('boom',0.05,0.3),('thud',16.1,0.4),('boom',17.4,0.3),
     ('tk',45.5,0.35),('coin',45.65,0.22),('tk',45.8,0.35),('coin',45.95,0.22),('tk',46.1,0.35),('coin',46.25,0.22),('cha',46.5,0.25),
     ('pop',55.25,0.35),('ph',55.8,0.35),('pop',56.4,0.35),('ph',56.75,0.35),
     ('rise',58.7,0.35),('boom',59.75,0.55),('cha',59.77,0.35),('shim',60.15,0.22),('wl',61.0,0.25),('thud',61.4,0.35),('pop',62.5,0.35)]
for i,(k,t,v) in enumerate(ev):
    f,d=SFX[k]
    A(f'<audio id="sfx{i}" src="assets/sfx/{f}.mp3" data-start="{round(t,3)}" data-duration="{d}" data-track-index="{10+i%9}" data-volume="{v}"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# subtítulos (solo escenas de foto)
groups=[]
for sid,a,b,*_ in SC:
    if sid in NOCAP: continue
    cur=[]
    for w in words:
        if not (a-0.06<=w[1]<b-0.06): continue
        if cur and (len(cur)>=4 or len(' '.join(x[0] for x in cur))+len(w[0])>21 or cur[-1][0][-1] in ',.:;?'):
            groups.append((cur,b,sid)); cur=[]
        cur.append(w)
    if cur: groups.append((cur,b,sid))
CT=dict(CAPTOP); SA={x[0]:x[1] for x in SC}; G=[{'top':CT.get(sid,1085),'s':SA[sid],'end':min(b,g[-1][2]+0.5),'w':g} for g,b,sid in groups]
A('const CAPS='+json.dumps(G,ensure_ascii=False)+';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);if(wi<g.w.length-1)line.appendChild(document.createTextNode(" "));});
host.appendChild(line);const st=Math.max(g.s,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.85},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t,e],wi)=>{tl.to("#cap-"+gi+"-"+wi,{color:"#FFD086",duration:0.06,ease:"none"},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to("#cap-"+gi+"-"+wi,{color:"#ffffff",duration:0.06,ease:"none"},nx[1]-0.04);});
const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.5},Object.assign({opacity:1,scale:1,duration:0.28,ease:"back.out(2.4)"},o||{}),t);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:40},Object.assign({opacity:1,y:0,duration:0.28,ease:"power3.out"},o||{}),t);''')
for sid,a,b,img,org,s0,s1,x0,x1,hl,lg in SC:
    d=round(b-a,3)
    if not img.startswith('clip:'): A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},xPercent:{x0},transformOrigin:"{org}"}},{{scale:{s1},xPercent:{x1},duration:{d},ease:"none"}},{a});')
    if hl:
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,x:-50}},{{opacity:1,x:0,duration:0.22,ease:"power3.out"}},{round(a+0.05,3)});tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-50}},{{opacity:1,x:0,duration:0.22,ease:"power3.out"}},{round(a+0.14,3)});')
        if sid not in ONE: A(f'tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25,ease:"power2.out"}},{round(a+0.22,3)});')
# partículas promo (deterministas)
pts=[]
for i in range(28):
    ang=i/28*2*math.pi+random.uniform(-.1,.1); r=random.uniform(380,640)
    pts.append((round(math.cos(ang)*r),round(math.sin(ang)*r*0.9),round(random.uniform(0.6,1.6),2)))
A('const PTS='+json.dumps(pts)+';')
A('''// hook
tl.fromTo("#hook .a",{opacity:0,scale:1.3,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.35,ease:"power4.out",transformOrigin:"0 50%"},0.05);
tl.fromTo("#hook .b",{opacity:0,y:40},{opacity:1,y:0,duration:0.3,ease:"power3.out"},1.0);tl.fromTo("#hook .rule",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.3},1.25);
tl.fromTo("#logo-in",{opacity:0,y:20},{opacity:1,y:0,duration:0.4,ease:"power2.out"},0.3);
// servicios sobre el video render
tl.fromTo("#srv-eb",{opacity:0,x:-40},{opacity:1,x:0,duration:0.22,ease:"power3.out"},6.55);tl.fromTo("#srv-t",{opacity:0,x:-50},{opacity:1,x:0,duration:0.25,ease:"power3.out"},6.62);tl.fromTo("#srv-r",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.25},6.8);
[0,1,2,3,4,5,6,7].forEach(i=>{const t=6.95+i*0.2;tl.fromTo("#sc"+i,{opacity:0,y:60,scale:0.8},{opacity:1,y:0,scale:1,duration:0.24,ease:"back.out(2)"},t);tl.fromTo("#sc"+i+" .pl",{scale:0.3},{scale:1,duration:0.22,ease:"back.out(3)"},t+0.1);});
tl.to(".sc",{borderColor:"#FFD086",duration:0.2,yoyo:true,repeat:1,stagger:0.04},9.25);
// precios
tl.fromTo("#pr1 .a",{opacity:0,x:-40},{opacity:1,x:0,duration:0.2},15.5);tl.fromTo("#pr1 .b",{opacity:0,scale:1.6},{opacity:1,scale:1,duration:0.25,ease:"power4.out",transformOrigin:"0 50%"},16.1);up("#pr1 .c",16.3);
tl.fromTo("#pr2 .a",{opacity:0,x:-40},{opacity:1,x:0,duration:0.2},17.12);tl.fromTo("#pr2 .b",{opacity:0,scale:1.6},{opacity:1,scale:1,duration:0.25,ease:"power4.out",transformOrigin:"0 50%"},17.4);up("#pr2 .c",18.0);
// rentas
tl.fromTo("#rent",{opacity:0,y:-40,scale:0.92},{opacity:1,y:0,scale:1,duration:0.25,ease:"back.out(1.8)"},45.42);
[0,1,2,3,4,5].forEach(i=>{const t=45.5+i*0.15;tl.fromTo("#rb"+i,{scaleY:0,transformOrigin:"50% 100%"},{scaleY:1,duration:0.24,ease:"back.out(1.6)"},t);
 tl.fromTo("#rc"+i,{opacity:0,y:-100,rotationY:0},{opacity:1,y:0,rotationY:360,duration:0.3,ease:"bounce.out"},t+0.06);});
tl.to("#ra",{attr:{"stroke-dashoffset":0},duration:0.9,ease:"none"},45.55);tl.fromTo("#rah",{opacity:0},{opacity:1,duration:0.1},46.45);
tl.to(".coin",{scale:1.15,duration:0.12,yoyo:true,repeat:1,stagger:0.04},46.5);
// equipamiento incluido
tl.fromTo("#eq",{opacity:0,x:-50},{opacity:1,x:0,duration:0.22,ease:"power3.out"},54.7);
[["Cocina",55.25],["Cuartos",55.8],["Baños",56.4],["Roof",56.75]].forEach(([t,at])=>{tl.set("#eq-n",{textContent:"✓ "+t},at);tl.fromTo("#eq-n",{scale:0.5,opacity:0},{scale:1,opacity:1,duration:0.2,ease:"back.out(3)",transformOrigin:"0 50%",immediateRender:false},at);});
// PROMO: tensión + explosión
tl.fromTo("#rays",{rotation:0,scale:0.6,opacity:0},{rotation:40,scale:1.15,opacity:1,duration:2.65,ease:"none"},58.6);
tl.fromTo("#pa",{opacity:0,y:-60},{opacity:1,y:0,duration:0.25,ease:"power3.out"},58.65);
const pv={v:0};tl.fromTo("#pn",{opacity:0,scale:0.4},{opacity:1,scale:1,duration:0.2},58.85);
tl.fromTo(pv,{v:0},{v:450000,duration:0.88,ease:"power2.in",onUpdate:()=>{document.getElementById("pn").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}},58.85);
tl.set("#pn",{textContent:"$450,000"},59.75);
tl.fromTo("#pn",{scale:1.55},{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false},59.75);
tl.fromTo("#pflash",{opacity:0.85},{opacity:0,duration:0.35,ease:"power2.out",immediateRender:false},59.75);
tl.fromTo("#pz",{x:0,y:0},{keyframes:[{x:-16,y:10},{x:14,y:-12},{x:-10,y:6},{x:8,y:-4},{x:0,y:0}],duration:0.35,ease:"none"},59.75);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{x:0,y:0,scale:s,opacity:1},{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false},59.75));
tl.fromTo("#shine",{x:-300},{x:1150,duration:0.6,ease:"power2.inOut"},60.15);
tl.to("#pn",{scale:1.08,duration:0.25,yoyo:true,repeat:3,ease:"sine.inOut"},60.15);
up("#pc",60.1);tl.fromTo("#pd",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.3,ease:"back.out(2.5)"},60.4);
// cierre
tl.fromTo("#end-crest",{opacity:0,scale:1.6,filter:"blur(16px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.45,ease:"power3.out"},61.35);
tl.fromTo("#end-brand",{opacity:0},{opacity:1,duration:0.3},61.65);tl.fromTo("#end-re",{opacity:0},{opacity:1,duration:0.3},61.8);up("#end-mas",62.1);
tl.fromTo("#end-cta",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.35,ease:"back.out(2.2)"},62.5);tl.fromTo("#end-wa",{opacity:0},{opacity:1,duration:0.3},63.0);
tl.to("#end-cta",{scale:1.07,duration:0.39,ease:"sine.inOut",yoyo:true,repeat:7},63.1);tl.fromTo("#end-arrow",{y:-6},{y:10,duration:0.39,ease:"power1.inOut",yoyo:true,repeat:7},63.1);''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P+'index.html','w').write('\n'.join(H))
print(len(G),'grupos');print(' | '.join(' '.join(w[0] for w in g['w']) for g in G))
