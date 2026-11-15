B='/home/user/Legacy-capital/estudio-video/videos/motion-graphics-doctor/'
CSS='''@font-face{font-family:"PPCondensed";src:url("assets/fonts/OpenSans_Condensed_Bold.ttf") format("truetype");}
@font-face{font-family:"PPText";src:url("assets/fonts/OpenSans_Semibold.ttf") format("truetype");}
@font-face{font-family:"PPBold";src:url("assets/fonts/OpenSans_ExtraBold.ttf") format("truetype");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;src:url("assets/fonts/cormorant-garamond-latin-600-normal.woff2") format("woff2");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;font-style:italic;src:url("assets/fonts/cormorant-garamond-latin-600-italic.woff2") format("woff2");}
@font-face{font-family:"Cinzel";font-weight:700;src:url("assets/fonts/cinzel-latin-700-normal.woff2") format("woff2");}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#FBF3E4}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"PPText",sans-serif;color:#0E2A4A;background:linear-gradient(180deg,#FDF7EC 0%,#FBF1E0 100%)}
.abs{position:absolute}
#crest{left:455px;top:70px;width:170px}
#brand{left:0;right:0;top:300px;text-align:center;font-family:"Cinzel",serif;font-weight:700;font-size:46px;letter-spacing:.06em;line-height:1.2}
#re{left:0;right:0;top:362px;text-align:center;font-size:24px;letter-spacing:.42em;color:#0E2A4A;line-height:1.3}
#re:before,#re:after{content:"";display:inline-block;width:70px;height:3px;background:#C99A2E;vertical-align:middle;margin:0 18px}
#title{left:60px;right:60px;top:430px;text-align:center;font-family:"Cormorant Garamond",serif;font-weight:600;font-size:82px;line-height:1.08;letter-spacing:-.01em}
#rule{left:440px;width:200px;height:8px;border-radius:4px;background:#C99A2E}
#sub{left:70px;right:70px;text-align:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:40px;line-height:1.2;color:#1B3A6B}
.note{left:60px;right:60px;border-radius:999px;background:#F4E3C3;display:flex;align-items:center;justify-content:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:29px;line-height:1.15;text-align:center;padding:10px 40px}
.note b{font-family:"PPBold";font-style:normal;color:#8A5A12;border:3px solid #8A5A12;border-radius:50%;width:40px;height:40px;flex:none;display:inline-flex;align-items:center;justify-content:center;margin-right:18px;font-size:24px}
'''
HEAD=lambda tt,ttop,rtop,sub,stop: f'''<img id="crest" class="abs" src="assets/crest.png" alt="Legacy Capital" /><div id="brand" class="abs">LEGACY CAPITAL</div><div id="re" class="abs">REAL ESTATE</div>
<div id="title" class="abs" style="top:{ttop}px">{tt}</div><div id="rule" class="abs" style="top:{rtop}px"></div>'''+(f'<div id="sub" class="abs" style="top:{stop}px">{sub}</div>' if sub else '')
HJS='''tl.fromTo("#crest",{opacity:0,scale:1.5,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.45,ease:"power3.out"},0.1);
tl.fromTo("#brand",{opacity:0,y:14},{opacity:1,y:0,duration:0.3,ease:"power2.out"},0.35);tl.fromTo("#re",{opacity:0},{opacity:1,duration:0.3},0.5);
tl.fromTo("#title",{opacity:0,y:40},{opacity:1,y:0,duration:0.45,ease:"power3.out"},0.6);tl.fromTo("#rule",{scaleX:0},{scaleX:1,duration:0.4,ease:"power2.out"},0.9);
if(document.getElementById("sub"))tl.fromTo("#sub",{opacity:0,y:20},{opacity:1,y:0,duration:0.4,ease:"power2.out"},1.05);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:34},Object.assign({opacity:1,y:0,duration:0.35,ease:"power3.out"},o||{}),t);
const pop=(s,t)=>tl.fromTo(s,{opacity:0,scale:0.5},{opacity:1,scale:1,duration:0.32,ease:"back.out(2.2)"},t);
const fade=(s,t)=>tl.fromTo(s,{opacity:0},{opacity:1,duration:0.4,ease:"none"},t);
'''
def page(n,dur,css,body,js):
    h=f'''<!doctype html><html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" /><title>MG{n}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><style>{CSS}{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
<div id="scene" class="clip" data-start="0" data-duration="{dur}" data-track-index="0" style="position:absolute;inset:0">{body}</div></div>
<script>window.__timelines=window.__timelines||{{}};const tl=gsap.timeline({{paused:true}});
{HJS}{js}
tl.to({{}},{{duration:{dur}}},0);window.__timelines["main"]=tl;</script></body></html>'''
    open(B+f'mg{n}/index.html','w').write(h)
PIN='<svg width="34" height="44" viewBox="0 0 34 44" fill="none" stroke="#FFD086" stroke-width="3.2"><path d="M17 41C17 41 31 26 31 16A14 14 0 1 0 3 16C3 26 17 41 17 41Z"/><circle cx="17" cy="16" r="5"/></svg>'
CAR='<svg width="50" height="32" viewBox="0 0 50 32" fill="none" stroke="#FFD086" stroke-width="3" stroke-linejoin="round"><path d="M5 22V15L11 14L15 5H35L39 14L45 15V22H5Z"/><path d="M11 14H39"/><circle cx="13" cy="24" r="4" fill="#0B2A4E"/><circle cx="37" cy="24" r="4" fill="#0B2A4E"/></svg>'
# ---------- MG1
rows=[('Caseta de<br>San Miguel','6 km','10 min'),('Valle de<br>Guadalupe','27 km','30 min'),('Tijuana','108 km','1 h 10 min'),('<small>Frontera con<br>Estados Unidos<br><em>(San Ysidro)</em></small>','125 km','1 h 30 min'),('Mexicali','250 km','3 h')]
b=HEAD('Conectividad regional<br>desde el proyecto',430,622,'Acceso práctico hacia vino, frontera y las principales ciudades del noroeste.',650)
b+='<div id="mapw" class="abs" style="left:165px;top:770px;width:750px;height:609px;border-radius:26px;overflow:hidden"><img id="mapi" src="assets/mapa.png" style="width:100%;height:100%;display:block" alt="" /></div><div id="ring" class="abs" style="left:401px;top:1174px;width:80px;height:80px;border-radius:50%;border:6px solid #C99A2E"></div>'
for i,(nm,km,tm) in enumerate(rows):
    b+=f'<div class="row abs" id="r{i}" style="top:{1396+i*86}px"><div class="ic"><img src="assets/ico{i+1}.png" alt="" /></div><div class="bar"></div><div class="nm">{nm}</div><div class="bar"></div><div class="km">{PIN}<div><span>aprox.</span>{km}</div></div><div class="bar"></div><div class="tm" id="t{i}">{CAR}<b>{tm}</b></div></div>'
b+='<div class="note abs" id="note" style="top:1832px;height:72px"><b>i</b>Tiempos estimados, sujetos a tráfico y condiciones de ruta; el cruce fronterizo puede variar.</div>'
css='''.row{left:40px;right:40px;height:78px;border-radius:26px;background:linear-gradient(90deg,#0B2A4E,#0A2444);display:flex;align-items:center;color:#fff;padding:0 22px 0 10px}
.row .ic{width:84px;height:62px;flex:none;overflow:hidden;mix-blend-mode:lighten}.row .ic img{width:76px;display:block;margin:0 auto}
.row .bar{width:3px;height:54px;background:#C99A2E;flex:none;margin:0 16px}
.row .nm{width:300px;flex:none;font-family:"Cormorant Garamond",serif;font-weight:600;font-size:34px;line-height:.92}.row .nm small{font-size:25px;line-height:.98;display:block}.row .nm em{font-size:22px}
.row .km{width:190px;flex:none;display:flex;align-items:center;gap:12px;font-family:"PPBold";font-size:29px;line-height:1.05}.row .km span{display:block;font-family:"PPText";font-size:20px}
.row .tm{flex:1;height:56px;border:3px solid #FFD086;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:12px;font-family:"PPBold";font-size:29px;white-space:nowrap}.row .tm b{font-weight:400}
.note{font-size:25px}'''
js='''tl.fromTo("#mapw",{clipPath:"circle(0% at 36.8% 72.9%)"},{clipPath:"circle(130% at 36.8% 72.9%)",duration:1.3,ease:"power2.out"},1.5);
tl.fromTo("#mapi",{scale:1.3,transformOrigin:"36.8% 72.9%"},{scale:1,duration:2.2,ease:"power2.out"},1.5);
[1.6,2.4,3.2,4.0].forEach((t,i)=>tl.fromTo("#ring",{scale:0.3,opacity:1},{scale:2.6,opacity:0,duration:0.75,ease:"power1.out",immediateRender:i===0},t));
[0,1,2,3,4].forEach(i=>{tl.fromTo("#r"+i,{opacity:0,x:-80},{opacity:1,x:0,duration:0.4,ease:"power3.out"},3.2+i*0.75);pop("#t"+i,3.5+i*0.75);});
fade("#note",7.2);'''
page(1,10,css,b,js)
# ---------- MG2
cards=[('Punta Morro /<br>restaurante y hotel','aprox. 2 min'),('Soriana /<br>autoservicio','aprox. 3 min'),('CETYS<br>Universidad','aprox. 5 min'),('Hospitales y<br>servicios médicos','aprox. 7 min'),('Hotel Coral &amp; Marina','aprox. 4–5 min'),('OXXO y tiendas<br>de conveniencia','aprox. 4 min'),('UABC / CICESE','aprox. 3–4 min'),None]
b=HEAD('Servicios y puntos de<br>interés alrededor',430,622,'Vida diaria, educación, salud y conveniencia a pocos minutos del desarrollo.',650)
b+='<div id="mapw" class="abs" style="left:290px;top:770px;width:500px;height:559px;border-radius:30px;overflow:hidden"><img id="mapi" src="assets/mapa.png" style="width:100%;height:100%;display:block" alt="" /></div>'
order=[0,4,1,5,2,6,3,7]
for k,ci in enumerate(order):
    col=k%2;rw=k//2;c=cards[ci]
    inner=(f'<div class="nm">{c[0]}</div><div class="pl">{c[1]}</div>' if c else '<div class="nm sm">A menos de</div><div class="pl big">800 metros</div><div class="nm sm">de la carretera de Ensenada</div>')
    b+=f'<div class="card abs" id="c{k}" style="left:{40+col*505}px;top:{1350+rw*140}px"><img src="assets/ico{ci+1}.png" alt="" /><div class="bar"></div><div class="tx">{inner}</div></div>'
css='''.card{width:495px;height:130px;border-radius:28px;border:3px solid #E3B869;background:#FFFBF3;display:flex;align-items:center;padding:0 14px}
.card img{width:86px;height:86px;border-radius:50%;flex:none}.card .bar{width:4px;height:86px;background:#C99A2E;margin:0 14px;flex:none}
.card .nm{font-family:"PPBold";font-size:26px;line-height:1.08;color:#132B6B}.card .pl{display:inline-block;margin-top:6px;padding:1px 22px 3px;border-radius:999px;background:#A47611;color:#fff;font-size:26px;line-height:1.25}
.card .pl.big{font-family:"PPBold";font-size:26px;margin:1px 0;padding:0 18px 2px}.card .nm.sm{font-size:21px;white-space:nowrap}'''
js='''tl.fromTo("#mapw",{opacity:0,scale:0.8},{opacity:1,scale:1,duration:0.5,ease:"power3.out"},1.5);tl.fromTo("#mapi",{scale:1.25},{scale:1,duration:2.4,ease:"power2.out"},1.5);
[0,1,2,3,4,5,6,7].forEach(i=>{tl.fromTo("#c"+i,{opacity:0,y:40},{opacity:1,y:0,duration:0.38,ease:"power3.out"},2.8+i*0.6);pop("#c"+i+" .pl",3.05+i*0.6);});'''
page(2,10,css,b,js)
# ---------- MG3
X=[150,400,650,900]; yv=lambda v: 560-(v-4.0)*80
co=[4.57,5.37,6.72,8.46]; op=[4.57,5.57,7.36,9.80]
grid=''.join(f'<line x1="120" y1="{yv(4+i*0.5)}" x2="960" y2="{yv(4+i*0.5)}" stroke="#C9D0DC" stroke-width="2"/><text x="108" y="{yv(4+i*0.5)+8}" text-anchor="end" font-family="PPText" font-size="23" fill="#0E2A4A">{4+i*0.5:.1f} M</text>' for i in range(13))
xl=''.join(f'<text x="{x}" y="606" text-anchor="middle" font-family="PPText" font-size="25" fill="#0E2A4A">{t}</text>' for x,t in zip(X,['2026 / base','DIC 2028','2031','2034']))
pth=lambda v:'M'+' L'.join(f'{x},{yv(a):.1f}' for x,a in zip(X,v))
def lab(i,x,v,col,dy):
    y=yv(v)+dy
    return f'<g class="lb" id="lb{i}"><rect x="{x-68}" y="{y-22}" width="136" height="44" rx="10" fill="{col}"/><text x="{x}" y="{y+10}" text-anchor="middle" font-family="PPBold" font-size="27" fill="#fff">${v:.2f} M</text></g>'
labs=lab(0,X[0]+10,4.57,'#0E2A4A',-42)+lab(1,X[1],5.57,'#0E2A4A',-44)+lab(2,X[1]+30,5.37,'#A47611',46)+lab(3,X[2]-10,7.36,'#0E2A4A',-46)+lab(4,X[2]+30,6.72,'#A47611',46)+lab(5,X[3]-10,9.80,'#0E2A4A',-44)+lab(6,X[3]-10,8.46,'#A47611',46)
dots=''.join(f'<circle class="dt" cx="{x}" cy="{yv(v):.1f}" r="10" fill="{c}"/>' for vals,c in ((op,'#0E2A4A'),(co,'#C99A2E')) for x,v in zip(X,vals))
b=HEAD('Plusvalía proyectada ·<br>misma propiedad',430,622,'Precio base del modelo de renta: $4,570,545 MXN. Proyección de valor, no flujo de rentas.',650)
b+=f'''<div id="cc" class="abs" style="left:40px;top:770px;width:1000px;height:740px;border-radius:30px;background:#FFFBF3;border:2px solid #EAD9B8"></div>
<div id="ct" class="abs" style="left:70px;top:790px;font-family:'PPBold';font-size:31px">Valor estimado del inmueble (millones de MXN)</div>
<div id="lg" class="abs" style="left:70px;top:842px;font-size:25px;display:flex;gap:40px"><span><i style="display:inline-block;width:46px;height:8px;border-radius:4px;background:#C99A2E;vertical-align:middle;margin-right:10px"></i>Conservador · 8% anual</span><span><i style="display:inline-block;width:46px;height:8px;border-radius:4px;background:#0E2A4A;vertical-align:middle;margin-right:10px"></i>Optimista · 10% anual</span></div>
<svg class="abs" style="left:40px;top:880px" width="1000" height="630" viewBox="0 0 1000 630">{grid}{xl}
<path id="lo" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="{pth(op)}" fill="none" stroke="#0E2A4A" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
<path id="lc" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="{pth(co)}" fill="none" stroke="#C99A2E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>{dots}{labs}</svg>
<div id="pn" class="abs" style="left:40px;top:1530px;width:1000px;height:222px;border-radius:30px;background:#F6E9D4"></div>
<div id="p0" class="abs" style="left:0;right:0;top:1540px;text-align:center;font-family:'PPBold';font-size:32px">ENTREGA · DIC 2028</div>
<div id="p1" class="abs" style="left:70px;top:1590px;width:460px"><div style="font-family:'PPBold';font-size:27px;color:#8A620C;line-height:1.3">CONSERVADOR 8%:</div><div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:66px;line-height:1.05">$5,365,384</div><div style="font-size:27px;line-height:1.3;color:#4A5568">Plusvalía: $794,839</div></div>
<div id="p2" class="abs" style="left:560px;top:1590px;width:460px"><div style="font-family:'PPBold';font-size:27px;color:#8A620C;line-height:1.3">OPTIMISTA 10%:</div><div style="font-family:'Cormorant Garamond',serif;font-weight:600;font-size:66px;line-height:1.05">$5,574,459</div><div style="font-size:27px;line-height:1.3;color:#4A5568">Plusvalía: $1,003,914</div></div>
<div id="f1" class="abs" style="left:50px;right:50px;top:1768px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:27px;line-height:1.15">Cálculo: $4,570,545 × (1 + tasa anual)^(meses/12). Diciembre de 2028: 25 meses; 2031: 5 años; 2034: 8 años.</div>
<div id="f2" class="abs" style="left:50px;right:50px;top:1846px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:25px;line-height:1.15;color:#6B6558">Supuestos de apreciación anual compuesta de 8% y 10%, aplicados al precio base del ejemplo.</div>'''
js='''fade("#cc",1.5);fade("#ct",1.7);fade("#lg",1.9);
tl.to("#lc",{attr:{"stroke-dashoffset":0},duration:3.0,ease:"power1.inOut"},2.3);tl.to("#lo",{attr:{"stroke-dashoffset":0},duration:3.0,ease:"power1.inOut"},2.5);
tl.fromTo(".dt",{opacity:0},{opacity:1,duration:0.2,stagger:{each:0.9,grid:[2,4],axis:"x"}},2.4);
[[0,2.4],[1,3.4],[2,3.6],[3,4.4],[4,4.6],[5,5.4],[6,5.6]].forEach(([i,t])=>tl.fromTo("#lb"+i,{opacity:0},{opacity:1,duration:0.3,ease:"none"},t));
fade("#pn",6.1);up("#p0",6.2);up("#p1",6.6);up("#p2",7.1);fade("#f1",7.8);fade("#f2",8.3);'''
page(3,11,'',b,js)
# ---------- MG4
b=HEAD('El Puente Financiero:<br>Apalancamiento Inteligente',430,622,'',0)
b+='''<svg class="abs" style="left:0;top:680px" width="1080" height="560" viewBox="0 0 1080 560">
<g id="gl"><text x="185" y="225" text-anchor="middle" font-family="PPBold" font-size="44" fill="#0E2A4A">Hoy</text><polygon points="40,290 70,262 345,262 315,290" fill="#1D6E8C"/><polygon points="315,290 345,262 345,412 315,440" fill="#082038"/><rect x="40" y="290" width="275" height="150" fill="#0E3A5E"/><text x="177" y="352" text-anchor="middle" font-family="PPBold" font-size="42" fill="#FFE1AD">10% a</text><text x="177" y="402" text-anchor="middle" font-family="PPBold" font-size="42" fill="#FFE1AD">la Firma</text></g>
<g id="gm"><text x="540" y="140" text-anchor="middle" font-family="PPBold" font-size="40" fill="#0E2A4A">Construcción</text><text x="540" y="200" text-anchor="middle" font-family="PPBold" font-size="56" fill="#0E2A4A">10%</text><text x="540" y="268" text-anchor="middle" font-family="PPBold" font-size="50" fill="#0E2A4A">Diferido</text>
<path id="cab" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M345,265 Q560,420 765,170" fill="none" stroke="#0E2A4A" stroke-width="6"/><line id="deck" x1="345" y1="360" x2="765" y2="360" stroke="#0E2A4A" stroke-width="12"/>
<g id="hg" stroke="#C99A2E" stroke-width="4"><line x1="385" y1="291" x2="385" y2="360"/><line x1="425" y1="312" x2="425" y2="360"/><line x1="465" y1="327" x2="465" y2="360"/><line x1="505" y1="336" x2="505" y2="360"/><line x1="545" y1="337" x2="545" y2="360"/><line x1="585" y1="331" x2="585" y2="360"/><line x1="625" y1="316" x2="625" y2="360"/><line x1="665" y1="293" x2="665" y2="360"/><line x1="705" y1="258" x2="705" y2="360"/><line x1="740" y1="215" x2="740" y2="360"/></g>
<g id="m20"><line x1="365" y1="410" x2="455" y2="410" stroke="#C99A2E" stroke-width="3"/><line x1="365" y1="398" x2="365" y2="422" stroke="#C99A2E" stroke-width="3"/><line x1="655" y1="410" x2="745" y2="410" stroke="#C99A2E" stroke-width="3"/><line x1="745" y1="398" x2="745" y2="422" stroke="#C99A2E" stroke-width="3"/><rect x="463" y="384" width="184" height="52" rx="26" fill="#A47611"/><text x="555" y="421" text-anchor="middle" font-family="PPBold" font-size="34" fill="#fff">20 meses</text></g></g>
<g id="gr"><text x="900" y="105" text-anchor="middle" font-family="PPBold" font-size="44" fill="#0E2A4A">Entrega</text><rect x="750" y="140" width="300" height="26" fill="#0E2A4A"/><rect x="750" y="418" width="300" height="24" fill="#0E2A4A"/><rect x="770" y="150" width="260" height="280" fill="#0E2A4A"/><text x="900" y="278" text-anchor="middle" font-family="PPBold" font-size="58" fill="#FFE1AD">80%</text><text x="900" y="358" text-anchor="middle" font-family="PPBold" font-size="56" fill="#FFE1AD">Final</text></g></svg>'''
cs=[('Rango:','$398,278 a $489,048 MXN','Enganche inicial, bloqueo de inventario y plusvalía.'),('20 mensualidades desde','$19,914 hasta $24,452 MXN','Flujo cómodo dividido en 20 meses sin intereses.'),('Rango:','$3,186,224 a $3,912,386 MXN','A la entrega y escrituración. Totalmente apalancable con crédito hipotecario.')]
for i,(a,v,d) in enumerate(cs):
    b+=f'<div class="pc abs" id="pc{i}" style="top:{1180+i*200}px"><div class="bx"><div class="a">{a}</div><div class="v">{v}</div></div><div class="d">{d}</div></div>'
b+='<div class="note abs" id="note" style="top:1790px;height:84px;background:#0E3A5E;color:#fff"><b style="color:#FFD086;border-color:#FFD086">i</b>Estos rangos corresponden a la unidad de menor y mayor valor de la lista de precios.</div>'
css='''.pc{left:60px;right:60px;height:188px}.pc .bx{height:112px;border-radius:14px;background:#E6EAF4;border-left:14px solid #C99A2E;text-align:center;padding-top:6px}
.pc .a{font-family:"PPBold";font-size:30px;line-height:1.35}.pc .v{font-family:"PPBold";font-size:44px;line-height:1.2}
.pc .d{margin-top:8px;text-align:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:31px;line-height:1.1}'''
js='''tl.fromTo("#gl",{opacity:0,y:70},{opacity:1,y:0,duration:0.5,ease:"back.out(1.5)"},1.4);up("#pc0",2.0);
fade("#gm text",3.0);tl.fromTo("#deck",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.7,ease:"power2.out"},3.1);tl.to("#cab",{attr:{"stroke-dashoffset":0},duration:0.9,ease:"power2.out"},3.2);
tl.fromTo("#hg line",{opacity:0},{opacity:1,duration:0.15,stagger:0.07},3.5);fade("#m20",4.3);up("#pc1",4.6);
tl.fromTo("#gr",{opacity:0,y:70},{opacity:1,y:0,duration:0.5,ease:"back.out(1.5)"},5.8);up("#pc2",6.4);fade("#note",7.6);'''
page(4,10.5,css,b,js)
print('ok')
