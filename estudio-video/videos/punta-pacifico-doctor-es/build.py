import json
P='/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-doctor-es/'
W=json.load(open('/home/user/Legacy-capital/estudio-video/proyectos/punta-pacifico/voz/doctor-v6.words.json'))
S=lambda t: round(t+2.0,3) if t>9.745 else t
fix={'doctor':'Doctor','Sausal':'Sauzal,','encenada':'Ensenada,','Pickle':'pickleball,','contraentrega':'contra entrega','3.9':'$3.9','4.9':'$4.9','450,000':'$450 mil','Smart':'smart','Home':'home','MiniSplit':'minisplit','residencial':'residencial,','privado':'privado,'}
words=[]
for t,s,e in W:
    if t=='Ball,': continue
    words.append([fix.get(t,t),S(s),S(e)])
DUR=68.6
# escenas: id, inicio, fin, tipo, img, pos, cap_top, titular(l1,l2,small)
SC=[
('s01',0,2.61,'01','50% 50%',1120,('DOCTOR · MÉDICO','VISTA AL MAR','')),
('s02',2.61,5.24,'02','50% 50%',760,('PARA DISFRUTAR','O INVERTIR','')),
('s03',5.24,7.49,'03','42% 50%',1120,('NUEVO PROYECTO','RESIDENCIAL','ENSENADA · PREVENTA')),
('s13',11.73,14.6,'13','60% 50%',None,None),
('s04',14.6,17.69,'04','50% 50%',1120,('1 NIVEL','2 O 3 RECÁMARAS','')),
('s05',17.69,21.26,'05','50% 50%',1120,('ROOF GARDEN','PRIVADO','')),
('s06',21.26,23.0,'06','50% 50%',1120,('TU PAUSA','EN LA ALBERCA','')),
('s07',25.65,26.68,'07','50% 50%',640,('TARDES','DE ASADOR','')),
('s14',26.68,28.4,'14','50% 50%',760,('CENAS CON','TUS SERES QUERIDOS','')),
('s08',28.4,31.38,'08','50% 50%',1120,('AMENIDADES','Y ROOF','')),
('s09',31.38,34.6,'09','50% 50%',750,('PAGOS','FLEXIBLES','')),
('s10',46.0,49.4,'10','50% 50%',1120,('SMART','HOME','')),
('s11',49.4,53.14,'11','50% 50%',1120,None),
('s12',53.14,55.25,'12','50% 50%',1120,('APARTA','ESTE MES','')),
('s15',55.25,58.8,'15','50% 50%',760,('EQUIPAMIENTO','INCLUIDO','')),
]
GFX=[('map',7.49,9.72),('serv',9.72,11.73),('pk',23.0,25.65),('bridge',34.6,41.55),('chart',41.55,46.0),('promo',58.8,61.67),('end',61.67,DUR)]
html=[]
A=html.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Doctor V6 — Legacy Capital</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>
@font-face{font-family:"PPCondensed";src:url("assets/fonts/OpenSans_Condensed_Bold.ttf") format("truetype");}
@font-face{font-family:"PPText";src:url("assets/fonts/OpenSans_Semibold.ttf") format("truetype");}
@font-face{font-family:"PPBold";src:url("assets/fonts/OpenSans_ExtraBold.ttf") format("truetype");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;src:url("assets/fonts/cormorant-garamond-latin-600-normal.woff2") format("woff2");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;font-style:italic;src:url("assets/fonts/cormorant-garamond-latin-600-italic.woff2") format("woff2");}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2");}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#071D29}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"PPText",sans-serif;color:#fff}
.clip{position:absolute;inset:0}
.bg{overflow:hidden}.bg .kb{position:absolute;inset:0}.bg img{width:100%;height:100%;object-fit:cover;display:block}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.78) 0%,rgba(7,29,41,.5) 24%,rgba(7,29,41,.12) 36%,rgba(7,29,41,0) 48%,rgba(7,29,41,.28) 100%)}
.hl{position:absolute;left:108px;top:290px;font-family:"PPCondensed",sans-serif;font-size:96px;line-height:1.16;letter-spacing:.01em;text-shadow:0 3px 10px rgba(0,0,0,.45)}
.hl .l2{color:#FFD086}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:18px;border-radius:4px}
.hl .sm{font-family:"PPText";font-size:32px;letter-spacing:.12em;margin-top:16px;color:#fff}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 28px 8px;border-radius:20px;background:rgba(7,29,41,.45);text-align:center;font-family:"PPBold",sans-serif;font-size:60px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff}
.gfx{background:#FBF3E4;color:#0E2A4A;overflow:hidden}
.gfoot{position:absolute;left:-10%;right:-10%;top:1330px;height:700px;background:#0E2A4A;border-top:10px solid #C99A2E;border-radius:50% 50% 0 0/90px 90px 0 0}
.gfoot img{position:absolute;left:50%;top:70px;width:150px;margin-left:-75px}
.gfoot div{position:absolute;left:0;right:0;top:280px;text-align:center;font-family:"Cinzel",serif;font-weight:700;font-size:40px;letter-spacing:.1em;color:#FBF3E4}
.gt{position:absolute;left:65px;right:65px;top:278px;text-align:center;font-family:"Cormorant Garamond",serif;font-weight:600;font-size:78px;line-height:1;color:#0E2A4A}
.gs{position:absolute;left:65px;right:65px;text-align:center;font-family:"PPText";font-size:30px;color:#0E2A4A}
.grule{position:absolute;left:465px;top:368px;width:150px;height:7px;border-radius:4px;background:#C99A2E}
.pill{position:absolute;height:74px;border-radius:999px;background:#0E2A4A;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 30px;font-family:"PPText";font-size:31px;white-space:nowrap}
.pill b{font-family:"PPBold";color:#FFD086;margin-left:16px}
.card{position:absolute;left:65px;right:65px;height:104px;border-radius:22px;background:#fff;border:3px solid #C99A2E;display:flex;align-items:center;padding:0 30px;font-size:33px;color:#0E2A4A}
.card b{font-family:"PPBold";font-size:40px;margin-left:auto;white-space:nowrap}
.card i{font-style:normal;font-family:"PPCondensed";font-size:56px;color:#C99A2E;width:150px;flex:none}
#price-box{position:absolute;left:108px;top:300px;text-shadow:0 3px 10px rgba(0,0,0,.5)}
#price-box .a{font-family:"PPCondensed";font-size:60px;line-height:1.3;color:#FFD086;letter-spacing:.06em}
#price-box .b{font-family:"PPCondensed";font-size:180px;line-height:1.35;margin:14px 0}
#price-box .c{font-family:"PPBold";font-size:44px;line-height:1.4}
#price-box .d{font-family:"PPText";font-size:30px;margin-top:10px;letter-spacing:.06em}
.chip{position:absolute;left:108px;height:96px;border-radius:999px;background:rgba(7,29,41,.82);border:3px solid #FFD086;display:flex;align-items:center;padding:0 36px;font-family:"PPBold";font-size:44px}
.chip span{color:#FFD086;margin-right:18px}
.li{position:absolute;left:108px;font-family:"PPBold";font-size:54px;text-shadow:0 3px 8px rgba(0,0,0,.6)}.li span{color:#FFD086;margin-right:16px}
#promo{background:radial-gradient(ellipse 90% 60% at 50% 42%,#12385A 0%,#071D29 75%)}
#promo .a{position:absolute;left:0;right:0;top:400px;line-height:1.2;text-align:center;font-family:"PPCondensed";font-size:84px;letter-spacing:.06em;color:#FFD086}
#promo .b{position:absolute;left:0;right:0;top:560px;text-align:center;font-family:"PPCondensed";font-size:250px;line-height:1}
#promo .c{position:absolute;left:0;right:0;top:880px;text-align:center;font-family:"PPBold";font-size:50px}
#promo .d{position:absolute;left:0;right:0;top:970px;text-align:center;font-size:36px;color:#FFD086}
#end #end-crest{position:absolute;left:50%;top:300px;width:230px;height:auto;margin-left:-115px}
#end-brand{position:absolute;left:0;right:0;top:620px;text-align:center;font-family:"Cinzel",serif;font-weight:700;font-size:54px;letter-spacing:.1em}
#end-re{position:absolute;left:0;right:0;top:690px;text-align:center;font-size:28px;letter-spacing:.42em;color:#FFD086}
#end-mas{position:absolute;left:0;right:0;top:790px;text-align:center;font-family:"PPCondensed";font-size:120px;line-height:1}
#end-cta{position:absolute;left:120px;right:120px;top:950px;height:116px;border-radius:999px;background:#FFD086;color:#071D29;font-family:"PPBold";font-size:44px;display:flex;align-items:center;justify-content:center;gap:16px;box-shadow:0 0 0 0 rgba(255,208,134,.6)}
#end-arrow{display:inline-block}
#end-wa{position:absolute;left:0;right:0;top:1100px;text-align:center;font-family:"PPBold";font-size:42px}#end-wa span{color:#FFD086}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%s" data-width="1080" data-height="1920">
'''.replace('%s',str(DUR)))
for sid,a,b,img,pos,ct,hl in SC:
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="0"><div class="kb" data-layout-allow-overflow><img src="assets/img/{img}.jpg" style="object-position:{pos}" alt="" /></div><div class="shade"></div>')
    if hl:
        sm=f'<div class="sm">{hl[2]}</div>' if hl[2] else ''
        A(f'<div class="hl" id="{sid}-hl"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div>{sm}</div>')
    if sid=='s13':
        A('<div id="price-box"><div class="a">DESDE</div><div class="b">$3.9 – $4.9</div><div class="c">MILLONES DE PESOS</div><div class="d">CASAS DE 2 Y 3 RECÁMARAS · MXN</div></div>')
    if sid=='s11':
        A('<div class="chip" id="ch1" style="top:300px"><span>●</span>Luces</div><div class="chip" id="ch2" style="top:416px"><span>●</span>Minisplit</div><div class="chip" id="ch3" style="top:532px"><span>●</span>Cerradura digital</div>')
    if sid=='s15':
        for i,t in enumerate(['Cocina','Cuartos','Baños','Roof']):
            A(f'<div class="li" id="li{i}" style="top:{560+(i//2)*84}px;left:{108+(i%2)*400}px"><span>✓</span>{t}</div>')
    A('</div>')
g=dict((k,(a,round(b-a,3))) for k,a,b in GFX)
A(f'''<div id="map" class="clip gfx" data-start="{g['map'][0]}" data-duration="{g['map'][1]}" data-track-index="0"><div class="gfoot"><img src="assets/crest.png" alt="" /><div>LEGACY CAPITAL</div></div>
<div class="gt">Conectividad regional</div><div class="grule"></div>
<div id="map-wrap" style="position:absolute;left:110px;top:395px;width:860px;height:698px;border-radius:28px;overflow:hidden"><img id="map-img" src="assets/mg/mapa-regional.png" style="width:100%;height:100%;display:block" alt="" /></div>
<div id="map-ring" style="position:absolute;left:386px;top:864px;width:80px;height:80px;border-radius:50%;border:6px solid #C99A2E"></div>
<div class="pill" id="mp1" style="left:65px;top:1120px;width:465px">Valle de Guadalupe<b>30 min</b></div>
<div class="pill" id="mp2" style="left:550px;top:1120px;width:465px">Tijuana<b>1 h 10 min</b></div>
</div>
<div id="serv" class="clip gfx" data-start="{g['serv'][0]}" data-duration="{g['serv'][1]}" data-track-index="0"><div class="gfoot"><img src="assets/crest.png" alt="" /><div>LEGACY CAPITAL</div></div>
<div class="gt">Servicios alrededor</div><div class="grule"></div>
<div id="serv-wrap" style="position:absolute;left:315px;top:392px;width:450px;height:503px;border-radius:28px;overflow:hidden"><img src="assets/mg/mapa-local.png" style="width:100%;height:100%;display:block" alt="" /></div>
<div class="pill sv" style="left:65px;top:915px;width:465px">Hospitales<b>7 min</b></div><div class="pill sv" style="left:550px;top:915px;width:465px">UABC / CICESE<b>3–4 min</b></div>
<div class="pill sv" style="left:65px;top:1001px;width:465px">CETYS<b>5 min</b></div><div class="pill sv" style="left:550px;top:1001px;width:465px">Soriana<b>3 min</b></div>
<div class="pill sv" style="left:65px;top:1087px;width:465px">Punta Morro<b>2 min</b></div><div class="pill sv" style="left:550px;top:1087px;width:465px">Hotel Coral<b>4–5 min</b></div>
<div class="gs" style="top:1180px">Tiempos aproximados desde el proyecto</div>
</div>
<div id="pk" class="clip gfx" data-start="{g['pk'][0]}" data-duration="{g['pk'][1]}" data-track-index="0"><div class="gfoot"><img src="assets/crest.png" alt="" /><div>LEGACY CAPITAL</div></div>
<div class="gt">Cancha de pickleball</div><div class="grule"></div>
<svg viewBox="0 0 1080 608" width="1080" height="608" style="position:absolute;left:0;top:500px" aria-hidden="true">
<polygon points="150,560 930,560 740,140 340,140" fill="#0E2A4A" />
<g fill="none" stroke="#FBF3E4" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
<path class="pkl" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M150,560 L930,560 L740,140 L340,140 Z" /><path class="pkl" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M246,349 L834,349" /><path class="pkl" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M300,228 L780,228" /><path class="pkl" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M540,349 L540,560" /><path class="pkl" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M540,140 L540,228" /></g>
<g id="pk-net" opacity="0"><line x1="250" y1="282" x2="830" y2="282" stroke="#C99A2E" stroke-width="3" /><line x1="250" y1="240" x2="830" y2="240" stroke="#C99A2E" stroke-width="7" /><line x1="250" y1="230" x2="250" y2="288" stroke="#C99A2E" stroke-width="9" /><line x1="830" y1="230" x2="830" y2="288" stroke="#C99A2E" stroke-width="9" /></g>
<g id="pk-ball" opacity="0"><circle r="17" fill="#FFD086" /></g></svg></div>
<div id="bridge" class="clip gfx" data-start="{g['bridge'][0]}" data-duration="{g['bridge'][1]}" data-track-index="0"><div class="gfoot"><img src="assets/crest.png" alt="" /><div>LEGACY CAPITAL</div></div>
<div class="gt">Pagos flexibles</div><div class="grule"></div>
<svg viewBox="0 0 1080 420" width="1080" height="420" style="position:absolute;left:0;top:400px" aria-hidden="true">
<g id="br-l"><rect x="65" y="200" width="270" height="180" rx="10" fill="#0E2A4A" /><text x="200" y="278" text-anchor="middle" font-family="PPCondensed" font-size="76" fill="#FFD086">10%</text><text x="200" y="336" text-anchor="middle" font-family="PPBold" font-size="32" fill="#fff">a la firma</text></g>
<g id="br-m"><path id="br-cable" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M335,205 Q540,400 745,110" fill="none" stroke="#0E2A4A" stroke-width="6" /><line id="br-deck" x1="335" y1="330" x2="745" y2="330" stroke="#0E2A4A" stroke-width="12" />
<g id="br-h" stroke="#C99A2E" stroke-width="4"><line x1="390" y1="250" x2="390" y2="330" /><line x1="445" y1="282" x2="445" y2="330" /><line x1="500" y1="298" x2="500" y2="330" /><line x1="555" y1="296" x2="555" y2="330" /><line x1="610" y1="274" x2="610" y2="330" /><line x1="665" y1="232" x2="665" y2="330" /><line x1="715" y1="172" x2="715" y2="330" /></g>
<text x="540" y="100" text-anchor="middle" font-family="PPCondensed" font-size="76" fill="#0E2A4A">10%</text><text x="540" y="160" text-anchor="middle" font-family="PPBold" font-size="32" fill="#0E2A4A">diferido</text>
<rect x="385" y="350" width="310" height="56" rx="28" fill="#C99A2E" /><text x="540" y="388" text-anchor="middle" font-family="PPBold" font-size="27" fill="#fff">20 mensualidades</text></g>
<g id="br-r"><rect x="745" y="80" width="270" height="300" rx="10" fill="#0E2A4A" /><text x="880" y="210" text-anchor="middle" font-family="PPCondensed" font-size="96" fill="#FFD086">80%</text><text x="880" y="268" text-anchor="middle" font-family="PPBold" font-size="32" fill="#fff">contra entrega</text></g></svg>
<div class="card" id="bc1" style="top:850px"><i>10%</i>Enganche<b>$398,278 – $489,048</b></div>
<div class="card" id="bc2" style="top:970px"><i>10%</i>20 pagos de<b>$19,914 – $24,452</b></div>
<div class="card" id="bc3" style="top:1090px"><i>80%</i>Entrega<b>$3,186,224 – $3,912,384</b></div>
<div class="gs" id="br-note" style="top:1206px">MXN · rango de la lista · entrega a mediados de 2028</div>
</div>
<div id="chart" class="clip gfx" data-start="{g['chart'][0]}" data-duration="{g['chart'][1]}" data-track-index="0"><div class="gfoot"><img src="assets/crest.png" alt="" /><div>LEGACY CAPITAL</div></div>
<div class="gt">Plusvalía proyectada</div><div class="grule"></div>
<div class="gs" style="top:392px">Valor estimado del inmueble · millones de MXN</div>
<svg viewBox="0 0 1080 700" width="1080" height="700" style="position:absolute;left:0;top:440px" aria-hidden="true">
<g stroke="#D9CDB6" stroke-width="2"><line x1="110" y1="620" x2="1010" y2="620" /><line x1="110" y1="500" x2="1010" y2="500" /><line x1="110" y1="380" x2="1010" y2="380" /><line x1="110" y1="260" x2="1010" y2="260" /><line x1="110" y1="140" x2="1010" y2="140" /></g>
<g font-family="PPText" font-size="26" fill="#0E2A4A"><text x="100" y="628" text-anchor="end">4 M</text><text x="100" y="388" text-anchor="end">7 M</text><text x="100" y="148" text-anchor="end">10 M</text>
<text x="150" y="668" text-anchor="middle">2026</text><text x="420" y="668" text-anchor="middle">Dic 2028</text><text x="690" y="668" text-anchor="middle">2031</text><text x="960" y="668" text-anchor="middle">2034</text></g>
<path id="ln-o" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M150,574.4 L420,494.4 L690,351.2 L960,156" fill="none" stroke="#0E2A4A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
<path id="ln-c" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M150,574.4 L420,510.4 L690,402.4 L960,263.2" fill="none" stroke="#C99A2E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" />
<g class="cp" font-family="PPBold" font-size="30"><rect x="85" y="508" width="130" height="46" rx="10" fill="#0E2A4A" /><text x="150" y="541" text-anchor="middle" fill="#fff">$4.57 M</text></g>
<g class="cp" font-family="PPBold" font-size="30"><rect x="355" y="428" width="130" height="46" rx="10" fill="#0E2A4A" /><text x="420" y="461" text-anchor="middle" fill="#fff">$5.57 M</text><rect x="355" y="530" width="130" height="46" rx="10" fill="#C99A2E" /><text x="420" y="563" text-anchor="middle" fill="#fff">$5.37 M</text></g>
<g class="cp" font-family="PPBold" font-size="30"><rect x="625" y="285" width="130" height="46" rx="10" fill="#0E2A4A" /><text x="690" y="318" text-anchor="middle" fill="#fff">$7.36 M</text><rect x="625" y="422" width="130" height="46" rx="10" fill="#C99A2E" /><text x="690" y="455" text-anchor="middle" fill="#fff">$6.72 M</text></g>
<g class="cp" font-family="PPBold" font-size="30"><rect x="880" y="90" width="130" height="46" rx="10" fill="#0E2A4A" /><text x="945" y="123" text-anchor="middle" fill="#fff">$9.80 M</text><rect x="880" y="283" width="130" height="46" rx="10" fill="#C99A2E" /><text x="945" y="316" text-anchor="middle" fill="#fff">$8.46 M</text></g></svg>
<div class="pill" id="lg1" style="left:65px;top:1150px;width:465px;background:#C99A2E">Conservador<b style="color:#fff">8 % anual</b></div><div class="pill" id="lg2" style="left:550px;top:1150px;width:465px">Optimista<b>10 % anual</b></div>
<div class="gs" style="top:1236px;font-size:24px">Supuestos de apreciación compuesta sobre $4,570,545 MXN. Proyección, no flujo de rentas.</div>
</div>
<div id="promo" class="clip" data-start="{g['promo'][0]}" data-duration="{g['promo'][1]}" data-track-index="0"><div class="a">AHORRA HASTA</div><div class="b" id="promo-n">$450,000</div><div class="c">MXN EN EQUIPAMIENTO INCLUIDO</div><div class="d">Al apartar tu casa este mes</div></div>
<div id="end" class="clip bg" data-start="{g['end'][0]}" data-duration="{g['end'][1]}" data-track-index="0"><div class="kb" data-layout-allow-overflow><img src="assets/img/16.jpg" style="filter:blur(10px)" alt="" /></div><div style="position:absolute;inset:0;background:rgba(7,29,41,.66)"></div>
<img id="end-crest" src="assets/crest.png" alt="Legacy Capital" /><div id="end-brand">LEGACY CAPITAL</div><div id="end-re">REAL ESTATE</div>
<div id="end-mas">MÁS INFORMACIÓN</div><div id="end-cta"><span>Haz clic en el botón de abajo</span><span id="end-arrow">↓</span></div><div id="end-wa">WhatsApp <span>+52 646 256 3006</span></div></div>
<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>
<div id="leak-a" class="clip" data-composition-id="leak-a" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="4.75" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>
<div id="leak-b" class="clip" data-composition-id="leak-b" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="61.15" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>
<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="67.04" data-track-index="8" data-volume="0.9"></audio>
<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-media-start="8" data-track-index="9" data-volume="0.14" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":1}},{{"t":67.2,"v":1}},{{"t":{DUR},"v":0}}]}}]}}'></audio>
''')
# SFX en cortes
cuts=sorted([a for _,a,b,*_ in SC if a>0]+[a for _,a,b in GFX])
sf=['fast-small-sweep-166','short-transition-sweep-175','cinematic-whoosh-fast-1492','fast-whoosh-1490']
dur={'fast-small-sweep-166':0.8,'short-transition-sweep-175':0.65,'cinematic-whoosh-fast-1492':1.38,'fast-whoosh-1490':1.8}
gf=set(a for _,a,b in GFX)
for i,c in enumerate(cuts):
    n=sf[2] if c in gf else sf[i%2]
    A(f'<audio id="sfx{i}" src="assets/sfx/{n}.mp3" data-start="{round(max(0,c-0.22),3)}" data-duration="{dur[n]}" data-track-index="{10+i%3}" data-volume="{0.3 if c in gf else 0.22}"></audio>')
for i,t in enumerate([0.05,11.8,36.66,38.03,40.09,59.0,63.0]):
    A(f'<audio id="imp{i}" src="assets/sfx/quick-zoom-impact-772.mp3" data-start="{t}" data-duration="1.25" data-track-index="{13+i%2}" data-volume="0.3"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# subtítulos: grupos dentro de cada escena foto + pk
capsc=[(a,b,ct) for sid,a,b,img,pos,ct,hl in SC if ct]+[(23.0,25.65,1160),(61.67,67.1,1215)]
groups=[]
for a,b,ct in sorted(capsc):
    cur=[]
    for w in words:
        if not (a-0.06<=w[1]<b-0.06): continue
        if cur and (len(cur)>=3 or len(' '.join(x[0] for x in cur))+len(w[0])>20 or cur[-1][0][-1] in ',.:;?'):
            groups.append((cur,ct,b)); cur=[]
        cur.append(w)
    if cur: groups.append((cur,ct,b))
G=[{'top':ct,'end':min(b,g[-1][2]+0.6),'w':[[x[0],x[1],x[2]] for x in g]} for g,ct,b in groups]
A('const CAPS='+json.dumps(G,ensure_ascii=False)+';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);if(wi<g.w.length-1)line.appendChild(document.createTextNode(" "));});
host.appendChild(line);const st=Math.max(0,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);
g.w.forEach(([,t,e],wi)=>{tl.to("#cap-"+gi+"-"+wi,{color:"#FFD086",duration:0.06,ease:"none"},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to("#cap-"+gi+"-"+wi,{color:"#ffffff",duration:0.06,ease:"none"},nx[1]-0.04);});
const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});''')
for i,(sid,a,b,img,pos,ct,hl) in enumerate(SC):
    d=round(b-a,3)
    if i%2==0: A(f'tl.fromTo("#{sid} .kb",{{scale:1.04}},{{scale:{round(1.04+0.022*d,3)},duration:{d},ease:"none"}},{a});')
    else: A(f'tl.fromTo("#{sid} .kb",{{scale:1.1,xPercent:-2}},{{scale:1.1,xPercent:2,duration:{d},ease:"none"}},{a});')
    if hl:
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,x:-40}},{{opacity:1,x:0,duration:0.25,ease:"power3.out"}},{round(a+0.08,3)});tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-40}},{{opacity:1,x:0,duration:0.25,ease:"power3.out"}},{round(a+0.2,3)});tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.3,ease:"power2.out"}},{round(a+0.3,3)});')
        if hl[2]: A(f'tl.fromTo("#{sid}-hl .sm",{{opacity:0}},{{opacity:1,duration:0.3}},{round(a+0.45,3)});')
A('''const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.6},Object.assign({opacity:1,scale:1,duration:0.3,ease:"back.out(2)"},o||{}),t);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:30},Object.assign({opacity:1,y:0,duration:0.3,ease:"power3.out"},o||{}),t);
// precio
up("#price-box .a",11.76);up("#price-box .b",12.05);up("#price-box .c",13.1);up("#price-box .d",13.9);
// mapa regional: se revela desde el proyecto
up("#map .gt",7.5);tl.fromTo("#map-wrap",{clipPath:"circle(0% at 36.8% 72.9%)"},{clipPath:"circle(130% at 36.8% 72.9%)",duration:1.0,ease:"power2.out"},7.6);
tl.fromTo("#map-img",{scale:1.25,transformOrigin:"36.8% 72.9%"},{scale:1,duration:2.1,ease:"power2.out"},7.6);
[7.7,8.4,9.1].forEach((t,i)=>tl.fromTo("#map-ring",{scale:0.3,opacity:1},{scale:2.4,opacity:0,duration:0.7,ease:"power1.out",immediateRender:i===0},t));
pop("#mp1",8.55);pop("#mp2",8.85);
// servicios
up("#serv .gt",9.74);tl.fromTo("#serv-wrap",{opacity:0,scale:0.85},{opacity:1,scale:1,duration:0.4,ease:"power3.out"},9.8);
tl.fromTo(".sv",{opacity:0,y:30},{opacity:1,y:0,duration:0.28,ease:"power3.out",stagger:0.13},10.1);
// pickleball
up("#pk .gt",23.02);tl.to(".pkl",{attr:{"stroke-dashoffset":0},duration:0.4,ease:"power2.out",stagger:0.05},23.05);tl.fromTo("#pk-net",{opacity:0},{opacity:1,duration:0.2},23.3);
tl.set("#pk-ball",{opacity:1},23.5);tl.fromTo("#pk-ball",{x:330,scale:1},{x:690,scale:0.62,duration:0.6,ease:"none"},23.5);tl.fromTo("#pk-ball",{y:452},{y:110,duration:0.3,ease:"power1.out",immediateRender:false},23.5);tl.to("#pk-ball",{y:200,duration:0.29,ease:"power1.in"},23.8);
tl.to("#pk-ball",{x:560,scale:1.05,duration:0.7,ease:"none"},24.1);tl.to("#pk-ball",{y:140,duration:0.29,ease:"power1.out"},24.1);tl.to("#pk-ball",{y:450,duration:0.39,ease:"power1.in"},24.4);
// puente financiero
up("#bridge .gt",34.62);tl.fromTo("#br-l",{opacity:0,y:60},{opacity:1,y:0,duration:0.35,ease:"back.out(1.6)"},34.64);pop("#bc1",34.9,{transformOrigin:"50% 50%"});
tl.fromTo("#br-m",{opacity:0},{opacity:1,duration:0.2},36.0);tl.fromTo("#br-deck",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.5,ease:"power2.out"},36.0);tl.to("#br-cable",{attr:{"stroke-dashoffset":0},duration:0.6,ease:"power2.out"},36.1);
tl.fromTo("#br-h line",{opacity:0},{opacity:1,duration:0.15,stagger:0.05},36.3);pop("#bc2",36.5);
tl.fromTo("#br-r",{opacity:0,y:60},{opacity:1,y:0,duration:0.35,ease:"back.out(1.6)"},38.05);pop("#bc3",38.35);tl.fromTo("#br-note",{opacity:0},{opacity:1,duration:0.3},39.55);
// plusvalía
up("#chart .gt",41.57);tl.to("#ln-c",{attr:{"stroke-dashoffset":0},duration:2.0,ease:"power1.inOut"},42.0);tl.to("#ln-o",{attr:{"stroke-dashoffset":0},duration:2.0,ease:"power1.inOut"},42.15);
tl.fromTo(".cp",{opacity:0},{opacity:1,duration:0.25,stagger:0.6},42.05);pop("#lg1",42.0);pop("#lg2",42.3);
// smart home
pop("#ch1",49.42);pop("#ch2",50.03);pop("#ch3",50.66);
// equipamiento
[55.38,55.87,56.43,56.86].forEach((t,i)=>up("#li"+i,t));
// promo
up("#promo .a",58.82);tl.fromTo("#promo-n",{opacity:0,scale:1.5,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.35,ease:"power3.out"},59.0);up("#promo .c",59.6);up("#promo .d",60.0);
// cierre
tl.fromTo("#end .kb",{scale:1.08},{scale:1.2,duration:6.93,ease:"none"},61.67);
tl.fromTo("#end-crest",{opacity:0,scale:1.6,filter:"blur(16px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.45,ease:"power3.out"},61.8);
tl.fromTo("#end-brand",{opacity:0},{opacity:1,duration:0.3},62.1);tl.fromTo("#end-re",{opacity:0},{opacity:1,duration:0.3},62.25);up("#end-mas",62.6);
tl.fromTo("#end-cta",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.35,ease:"back.out(2.2)"},63.0);tl.fromTo("#end-wa",{opacity:0},{opacity:1,duration:0.3},63.5);
tl.to("#end-cta",{scale:1.07,boxShadow:"0 0 0 22px rgba(255,208,134,0)",duration:0.39,ease:"sine.inOut",yoyo:true,repeat:11},63.5);tl.fromTo("#end-arrow",{y:-6},{y:10,duration:0.39,ease:"power1.inOut",yoyo:true,repeat:11},63.5);
''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P+'index.html','w').write('\n'.join(html))
print(len(G),'grupos');print([ (' '.join(w[0] for w in g['w']),g['w'][0][1]) for g in G][:60])
