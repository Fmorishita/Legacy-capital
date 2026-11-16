B='/home/user/Legacy-capital/estudio-video/videos/motion-graphics-doctor/'
CSS='''@font-face{font-family:"PPCondensed";src:url("assets/fonts/OpenSans_Condensed_Bold.ttf") format("truetype");}
@font-face{font-family:"PPText";src:url("assets/fonts/OpenSans_Semibold.ttf") format("truetype");}
@font-face{font-family:"PPBold";src:url("assets/fonts/OpenSans_ExtraBold.ttf") format("truetype");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;src:url("assets/fonts/cormorant-garamond-latin-600-normal.woff2") format("woff2");}
@font-face{font-family:"Cormorant Garamond";font-weight:600;font-style:italic;src:url("assets/fonts/cormorant-garamond-latin-600-italic.woff2") format("woff2");}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1920px;overflow:hidden;background:#FBF3E4}
#root{position:relative;width:100%;height:100%;overflow:hidden;font-family:"PPText",sans-serif;color:#0E2A4A;background:linear-gradient(180deg,#FDF7EC 0%,#FBF1E0 100%)}
.abs{position:absolute}
#title{left:50px;right:50px;top:250px;text-align:center;font-family:"Cormorant Garamond",serif;font-weight:600;font-size:74px;line-height:1.04;letter-spacing:-.01em}
#rule{left:440px;top:412px;width:200px;height:8px;border-radius:4px;background:#C99A2E}
#sub{left:60px;right:60px;top:428px;text-align:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:31px;line-height:1.12;color:#1B3A6B}
#flash{inset:0;background:#FFD086;opacity:0}
#foot{left:-10%;right:-10%;top:1400px;height:700px;background:#0E2A4A;border-top:10px solid #C99A2E;border-radius:50% 50% 0 0/80px 80px 0 0}
'''
HEAD=lambda tt,sub: f'<div id="foot" class="abs"></div><div id="title" class="abs">{tt}</div><div id="rule" class="abs"></div>'+(f'<div id="sub" class="abs">{sub}</div>' if sub else '')
HJS='''tl.fromTo("#title",{opacity:0,scale:1.35,filter:"blur(14px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.3,ease:"power4.out"},0.02);
tl.fromTo("#flash",{opacity:0.55},{opacity:0,duration:0.3,ease:"power2.out"},0.02);
tl.fromTo("#rule",{scaleX:0},{scaleX:1,duration:0.25,ease:"power3.out"},0.2);
if(document.getElementById("sub"))tl.fromTo("#sub",{opacity:0,y:16},{opacity:1,y:0,duration:0.25,ease:"power2.out"},0.28);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:40},Object.assign({opacity:1,y:0,duration:0.26,ease:"back.out(1.9)"},o||{}),t);
const pop=(s,t)=>tl.fromTo(s,{opacity:0,scale:0.3},{opacity:1,scale:1,duration:0.26,ease:"back.out(3)"},t);
const fade=(s,t)=>tl.fromTo(s,{opacity:0},{opacity:1,duration:0.25,ease:"none"},t);
'''
SF={'imp':('quick-zoom-impact-772',1.25),'air':('air-zoom-vacuum-2608',1.3),'who':('cinematic-whoosh-fast-1492',1.38),'sw':('fast-small-sweep-166',0.8),'st':('short-transition-sweep-175',0.65),'fw':('fast-whoosh-1490',1.8),'wu':('syn-whoosh-up',0.6),'wd':('syn-whoosh-down',0.62),'ss':('syn-swish',0.31),'wl':('syn-whoosh-low',0.83),'pop':('syn-pop',0.2),'ph':('syn-pop-hi',0.18),'tk':('syn-tick',0.1),'coin':('syn-coin',0.73),'cha':('syn-chaching',1.14),'shim':('syn-shimmer',0.94),'rise':('syn-riser',1.04),'boom':('syn-boom',0.94),'thud':('syn-thud',0.33)}
def page(n,dur,css,body,js,sfx):
    au=''
    for i,(k,t,v) in enumerate(sfx):
        f,d=SF[k]; d=round(min(d,dur-t-0.02),2)
        au+=f'<audio id="s{i}" src="assets/sfx/{f}.mp3" data-start="{round(t,2)}" data-duration="{d}" data-track-index="{2+i}" data-volume="{v}"></audio>\n'
    h=f'''<!doctype html><html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" /><title>MG{n}</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script><style>{CSS}{css}</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="{dur}" data-width="1080" data-height="1920">
<div id="scene" class="clip" data-start="0" data-duration="{dur}" data-track-index="0" style="position:absolute;inset:0">{body}<div id="flash" class="abs"></div></div>
{au}</div>
<script>window.__timelines=window.__timelines||{{}};const tl=gsap.timeline({{paused:true}});
{HJS}{js}
tl.to({{}},{{duration:{dur}}},0);window.__timelines["main"]=tl;</script></body></html>'''
    open(B+f'mg{n}/index.html','w').write(h)
PIN='<svg width="26" height="34" viewBox="0 0 34 44" fill="none" stroke="#FFD086" stroke-width="3.6"><path d="M17 41C17 41 31 26 31 16A14 14 0 1 0 3 16C3 26 17 41 17 41Z"/><circle cx="17" cy="16" r="5"/></svg>'
CAR='<svg width="40" height="26" viewBox="0 0 50 32" fill="none" stroke="#FFD086" stroke-width="3.4" stroke-linejoin="round"><path d="M5 22V15L11 14L15 5H35L39 14L45 15V22H5Z"/><path d="M11 14H39"/><circle cx="13" cy="24" r="4" fill="#0B2A4E"/><circle cx="37" cy="24" r="4" fill="#0B2A4E"/></svg>'
# ---------- MG1 (v3: mapa fijo y más grande, filas debajo)
rows=[('Caseta de San Miguel','6 km','10 min'),('Valle de Guadalupe','27 km','30 min'),('Tijuana','108 km','1 h 10 min'),('<small>Frontera con Estados Unidos (San Ysidro)</small>','125 km','1 h 30 min'),('Mexicali','250 km','3 h')]
b=HEAD('Conectividad regional<br>desde el proyecto','Acceso práctico hacia vino, frontera y las principales ciudades del noroeste.')
b+='<div id="mapw" class="abs" data-layout-allow-overflow style="left:215px;top:500px;width:650px;height:528px;border-radius:26px;overflow:hidden;box-shadow:0 14px 40px rgba(14,42,74,.25)"><img id="mapi" src="assets/mapa.png" style="width:100%;height:100%;display:block" alt="" /></div><div id="ring" class="abs" style="left:414px;top:845px;width:80px;height:80px;border-radius:50%;border:7px solid #C99A2E"></div>'
for i,(nm,km,tm) in enumerate(rows):
    b+=f'<div class="row abs" id="r{i}" style="top:{1040+i*52}px"><div class="ic"><img src="assets/ico{i+1}.png" alt="" /></div><div class="bar"></div><div class="nm">{nm}</div><div class="bar"></div><div class="km">{PIN}<div><span>aprox.</span>{km}</div></div><div class="bar"></div><div class="tm" id="t{i}">{CAR}<b>{tm}</b></div></div>'
b+='<div class="note abs" id="note"><b>i</b>Tiempos estimados, sujetos a tráfico y condiciones de ruta; el cruce fronterizo puede variar.</div>'
css='''#title{font-size:66px}#rule{top:398px}#sub{top:412px;font-size:28px}
.row{left:40px;right:40px;height:48px;border-radius:18px;background:linear-gradient(90deg,#0B2A4E,#0A2444);display:flex;align-items:center;color:#fff;padding:0 14px 0 8px;box-shadow:0 5px 12px rgba(14,42,74,.25)}
.row .ic{width:60px;height:42px;flex:none;overflow:hidden;mix-blend-mode:lighten}.row .ic img{width:50px;display:block;margin:0 auto}
.row .bar{width:3px;height:36px;background:#C99A2E;flex:none;margin:0 14px}
.row .nm{width:350px;flex:none;font-family:"Cormorant Garamond",serif;font-weight:600;font-size:30px;line-height:1.1;white-space:nowrap}.row .nm small{font-size:21px}
.row .km{width:160px;flex:none;display:flex;align-items:center;gap:10px;font-family:"PPBold";font-size:25px;line-height:.95}.row .km span{display:block;font-family:"PPText";font-size:15px}
.row .tm{flex:1;height:40px;border:3px solid #FFD086;border-radius:999px;display:flex;align-items:center;justify-content:center;gap:10px;font-family:"PPBold";font-size:27px;white-space:nowrap}.row .tm b{font-weight:400}
.note{left:40px;right:40px;top:1302px;height:40px;border-radius:999px;background:#F4E3C3;display:flex;align-items:center;justify-content:center;font-family:"Cormorant Garamond",serif;font-style:italic;font-weight:600;font-size:22px;white-space:nowrap}
.note b{font-family:"PPBold";font-style:normal;color:#8A5A12;border:3px solid #8A5A12;border-radius:50%;width:28px;height:28px;flex:none;display:inline-flex;align-items:center;justify-content:center;margin-right:12px;font-size:17px}'''
js='''tl.fromTo("#mapw",{clipPath:"circle(0% at 36.8% 72.9%)"},{clipPath:"circle(130% at 36.8% 72.9%)",duration:0.55,ease:"power3.out"},0.35);
tl.fromTo("#mapi",{scale:1.4,transformOrigin:"36.8% 72.9%"},{scale:1,duration:3.6,ease:"power2.out"},0.35);
[0.4,0.85,1.3,1.75,2.2].forEach((t,i)=>tl.fromTo("#ring",{scale:0.3,opacity:1},{scale:2.8,opacity:0,duration:0.45,ease:"power1.out",immediateRender:i===0},t));
[0,1,2,3,4].forEach(i=>{tl.fromTo("#r"+i,{opacity:0,x:-140},{opacity:1,x:0,duration:0.24,ease:"back.out(1.7)"},0.9+i*0.3);pop("#t"+i,1.0+i*0.3);});
fade("#note",2.5);tl.fromTo(".tm",{boxShadow:"0 0 0 0 rgba(255,208,134,.7)"},{boxShadow:"0 0 0 12px rgba(255,208,134,0)",duration:0.5,stagger:0.06},2.9);'''
sfx=[('imp',0.0,0.45),('wu',0.3,0.45)]+[(['pop','ph','thud','pop','ph'][i],0.9+i*0.3,0.5) for i in range(5)]+[('shim',2.85,0.3)]
page(1,5.2,css,b,js,sfx)
# ---------- MG2 (v3: mapa fijo y lugares grandes)
cards=[('Punta Morro /<br>restaurante y hotel','aprox. 2 min'),('Soriana /<br>autoservicio','aprox. 3 min'),('CETYS<br>Universidad','aprox. 5 min'),('Hospitales y<br>servicios médicos','aprox. 7 min'),('Hotel Coral &amp; Marina','aprox. 4–5 min'),('OXXO y tiendas<br>de conveniencia','aprox. 4 min'),('UABC / CICESE','aprox. 3–4 min'),None]
b=HEAD('Servicios y puntos de<br>interés alrededor','Vida diaria, educación, salud y conveniencia a pocos minutos del desarrollo.')
b+='<div id="mapw" class="abs" data-layout-allow-overflow style="left:40px;top:515px;width:470px;height:525px;border-radius:30px;overflow:hidden;box-shadow:0 14px 40px rgba(14,42,74,.3)"><img id="mapi" src="assets/mapa.png" style="width:100%;height:100%;display:block" alt="" /></div>'
order=[0,4,1,5,2,6,3,7]
for k,ci in enumerate(order):
    c=cards[ci]
    inner=(f'<div class="nm">{c[0]}</div><div class="pl">{c[1]}</div>' if c else '<div class="nm sm">A menos de</div><div class="pl">800 metros</div><div class="nm sm">de la carretera de Ensenada</div>')
    if k<4: pos=f'left:530px;top:{515+k*133.7:.0f}px;width:510px;height:124px'
    else: pos=f'left:{40+((k-4)%2)*505}px;top:{1056+((k-4)//2)*128}px;width:495px;height:118px'
    b+=f'<div class="card abs" id="c{k}" style="{pos}"><img src="assets/ico{ci+1}.png" alt="" /><div class="bar"></div><div class="tx">{inner}</div></div>'
css='''.card{border-radius:26px;border:4px solid #E3B869;background:#FFFBF3;display:flex;align-items:center;padding:0 14px;box-shadow:0 8px 18px rgba(14,42,74,.16)}
.card img{width:84px;height:84px;border-radius:50%;flex:none}.card .bar{width:5px;height:84px;background:#C99A2E;margin:0 14px;flex:none;border-radius:3px}
.card .tx{display:flex;flex-direction:column;align-items:flex-start;gap:4px}
.card .nm{font-family:"PPBold";font-size:27px;line-height:1.08;color:#132B6B}.card .pl{padding:1px 18px 3px;border-radius:999px;background:#8A620C;color:#fff;font-family:"PPBold";font-size:25px;line-height:1.3;white-space:nowrap}
.card .nm.sm{font-size:21px;white-space:nowrap}'''
js='''tl.fromTo("#mapw",{opacity:0,scale:0.5},{opacity:1,scale:1,duration:0.4,ease:"back.out(1.6)"},0.4);tl.fromTo("#mapi",{scale:1.28},{scale:1,duration:4.4,ease:"power2.out"},0.4);
[0,1,2,3,4,5,6,7].forEach(i=>{const t=0.95+i*0.27;tl.fromTo("#c"+i,i<4?{opacity:0,x:160,scale:0.85}:{opacity:0,y:70,scale:0.85},{opacity:1,x:0,y:0,scale:1,duration:0.26,ease:"back.out(2)"},t);pop("#c"+i+" .pl",t+0.12);});
tl.fromTo(".card",{borderColor:"#E3B869"},{borderColor:"#C99A2E",duration:0.25,yoyo:true,repeat:1,stagger:0.04},3.6);'''
sfx=[('imp',0.0,0.5),('wu',0.3,0.5)]+[(['pop','ph','thud','pop','ph','tk','pop','ph'][i],0.95+i*0.27,0.5) for i in range(8)]+[('shim',3.55,0.3)]
page(2,5,css,b,js,sfx)
# ---------- MG3
X=[150,400,650,900]; yv=lambda v: 400-(v-4.0)*58
co=[4.57,5.37,6.72,8.46]; op=[4.57,5.57,7.36,9.80]
grid=''.join(f'<line x1="120" y1="{yv(4+i*0.5):.1f}" x2="960" y2="{yv(4+i*0.5):.1f}" stroke="#C9D0DC" stroke-width="2"/><text x="108" y="{yv(4+i*0.5)+7:.1f}" text-anchor="end" font-family="PPText" font-size="20" fill="#0E2A4A">{4+i*0.5:.1f} M</text>' for i in range(13))
xl=''.join(f'<text x="{x}" y="440" text-anchor="middle" font-family="PPBold" font-size="23" fill="#0E2A4A">{t}</text>' for x,t in zip(X,['2026 / base','DIC 2028','2031','2034']))
pth=lambda v:'M'+' L'.join(f'{x},{yv(a):.1f}' for x,a in zip(X,v))
def lab(i,x,v,col,dy):
    y=yv(v)+dy
    return f'<g class="lb" id="lb{i}"><rect x="{x-70}" y="{y-22}" width="140" height="44" rx="10" fill="{col}"/><text x="{x}" y="{y+10}" text-anchor="middle" font-family="PPBold" font-size="28" fill="#fff">${v:.2f} M</text></g>'
labs=lab(0,X[0]+12,4.57,'#0E2A4A',-42)+lab(1,X[1],5.57,'#0E2A4A',-44)+lab(2,X[1]+36,5.37,'#A47611',44)+lab(3,X[2]-12,7.36,'#0E2A4A',-46)+lab(4,X[2]+36,6.72,'#A47611',46)+lab(5,X[3]-12,9.80,'#0E2A4A',-44)+lab(6,X[3]-12,8.46,'#A47611',46)
dots=''.join(f'<circle class="dt" id="d{k}{j}" cx="{x}" cy="{yv(v):.1f}" r="10" fill="{c}"/>' for k,(vals,c) in enumerate(((op,'#0E2A4A'),(co,'#C99A2E'))) for j,(x,v) in enumerate(zip(X,vals)))
b=HEAD('Plusvalía proyectada ·<br>misma propiedad','Precio base del modelo de renta: $4,570,545 MXN. Proyección de valor, no flujo de rentas.')
b+=f'''<div id="cc" class="abs" style="left:30px;top:508px;width:1020px;height:560px;border-radius:30px;background:#FFFBF3;border:2px solid #EAD9B8;box-shadow:0 10px 30px rgba(14,42,74,.15)"></div>
<div id="ct" class="abs" style="left:60px;top:520px;font-family:'PPBold';font-size:27px;line-height:1.3">Valor estimado del inmueble (millones de MXN)</div>
<div id="lg" class="abs" style="left:60px;top:560px;font-size:22px;line-height:1.3;display:flex;gap:36px"><span><i style="display:inline-block;width:46px;height:8px;border-radius:4px;background:#C99A2E;vertical-align:middle;margin-right:10px"></i>Conservador · 8% anual</span><span><i style="display:inline-block;width:46px;height:8px;border-radius:4px;background:#0E2A4A;vertical-align:middle;margin-right:10px"></i>Optimista · 10% anual</span></div>
<svg class="abs" style="left:40px;top:600px" width="1000" height="460" viewBox="0 0 1000 460">{grid}{xl}
<path id="lo" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="{pth(op)}" fill="none" stroke="#0E2A4A" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
<path id="lc" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="{pth(co)}" fill="none" stroke="#C99A2E" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>{dots}{labs}
<circle id="ring28" cx="{X[1]}" cy="{yv(5.57):.1f}" r="12" fill="none" stroke="#C99A2E" stroke-width="6" opacity="0"/><circle id="hoG" cx="{X[0]}" cy="{yv(4.57):.1f}" r="30" fill="#0E2A4A" opacity="0"/><circle id="ho" cx="{X[0]}" cy="{yv(4.57):.1f}" r="14" fill="#0E2A4A" stroke="#fff" stroke-width="4" opacity="0"/>
<circle id="hcG" cx="{X[0]}" cy="{yv(4.57):.1f}" r="30" fill="#FFD086" opacity="0"/><circle id="hc" cx="{X[0]}" cy="{yv(4.57):.1f}" r="14" fill="#C99A2E" stroke="#fff" stroke-width="4" opacity="0"/></svg>
<div id="cnt" class="abs" style="left:215px;top:622px;width:380px;height:92px;border-radius:20px;background:#0E2A4A;color:#FFD086;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(14,42,74,.35)"><span style="font-family:'PPText';font-size:19px;color:#fff;letter-spacing:.08em">A LA ENTREGA · DIC 2028</span><b id="cntv" style="font-family:'PPCondensed';font-size:46px;line-height:1.05">$4.57 M</b></div>
<div id="pn" class="abs" style="left:30px;top:1080px;width:1020px;height:166px;border-radius:26px;background:#F6E9D4"></div>
<div id="p0" class="abs" style="left:0;right:0;top:1086px;text-align:center;font-family:'PPBold';font-size:27px;line-height:1.3">ENTREGA · DIC 2028</div>
<div id="p1" class="abs" style="left:60px;top:1118px;width:470px"><div style="font-family:'PPBold';font-size:22px;color:#8A620C;line-height:1.4">CONSERVADOR 8%:</div><div style="font-family:'PPCondensed';font-size:46px;line-height:1.4">$5,365,384</div><div style="font-size:22px;line-height:1.4;color:#4A5568">Plusvalía: $794,839</div></div>
<div id="p2" class="abs" style="left:560px;top:1118px;width:470px"><div style="font-family:'PPBold';font-size:22px;color:#8A620C;line-height:1.4">OPTIMISTA 10%:</div><div style="font-family:'PPCondensed';font-size:46px;line-height:1.4">$5,574,459</div><div style="font-size:22px;line-height:1.4;color:#4A5568">Plusvalía: $1,003,914</div></div>
<div id="f1" class="abs" style="left:30px;right:30px;top:1256px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:22px;line-height:1.2;white-space:nowrap">Cálculo: $4,570,545 × (1 + tasa anual)^(meses/12). Diciembre de 2028: 25 meses; 2031: 5 años; 2034: 8 años.</div>
<div id="f2" class="abs" style="left:30px;right:30px;top:1288px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:22px;line-height:1.2;color:#6B6558">Supuestos de apreciación anual compuesta de 8% y 10%, aplicados al precio base del ejemplo.</div>'''
js='''pop("#cc",0.3);fade("#ct",0.4);fade("#lg",0.45);
const T0=0.4,TD=1.3,FR=[0,0.32,0.65,1];
tl.to("#lc",{attr:{"stroke-dashoffset":0},duration:TD,ease:"none"},T0);tl.to("#lo",{attr:{"stroke-dashoffset":0},duration:TD,ease:"none"},T0);
const PO=[[150,366.9],[400,308.9],[650,205.1],[900,63.6]],PC=[[150,366.9],[400,320.5],[650,242.2],[900,141.3]];
[["#ho","#hoG",PO],["#hc","#hcG",PC]].forEach(([h,g,P])=>{tl.set(h,{opacity:1},T0);tl.set(g,{opacity:0.25},T0);
 for(let j=1;j<4;j++){tl.to([h,g],{attr:{cx:P[j][0],cy:P[j][1]},duration:TD*(FR[j]-FR[j-1]),ease:"none"},T0+TD*FR[j-1]);}
 tl.fromTo(g,{attr:{r:22}},{attr:{r:40},duration:0.25,yoyo:true,repeat:6,ease:"sine.inOut",immediateRender:false},T0);
 tl.to(g,{opacity:0,duration:0.2},T0+TD+0.05);});
FR.forEach((f,j)=>{const t=T0+TD*f;[0,1].forEach(k=>tl.fromTo("#d"+k+j,{opacity:0,scale:0,transformOrigin:"50% 50%"},{opacity:1,scale:1,duration:0.2,ease:"back.out(3)"},t));});
[[0,0],[1,1],[2,1],[3,2],[4,2],[5,3],[6,3]].forEach(([i,j])=>tl.fromTo("#lb"+i,{opacity:0,y:14,scale:0.6,transformOrigin:"50% 50%"},{opacity:1,y:0,scale:1,duration:0.22,ease:"back.out(2.5)"},T0+TD*FR[j]+0.03));
const cv={v:4.57};tl.fromTo("#cnt",{opacity:0,y:-20},{opacity:1,y:0,duration:0.25,ease:"back.out(2)"},T0);
tl.fromTo(cv,{v:4.57},{v:5.57,duration:TD*0.32,ease:"none",onUpdate:()=>{document.getElementById("cntv").textContent="$"+cv.v.toFixed(2)+" M";}},T0);
tl.to("#cnt",{scale:1.12,duration:0.12,yoyo:true,repeat:1},T0+TD*0.32);tl.to("#lb1",{scale:1.25,duration:0.14,yoyo:true,repeat:1,transformOrigin:"50% 50%"},T0+TD*0.32+0.25);
tl.fromTo("#ring28",{opacity:0.9,attr:{r:12}},{opacity:0,attr:{r:70},duration:0.6,ease:"power2.out",repeat:2},T0+TD+0.15);tl.to("#cnt",{scale:1.12,duration:0.15,yoyo:true,repeat:3},T0+TD+0.15);tl.to("#lb1",{scale:1.25,duration:0.15,yoyo:true,repeat:3,transformOrigin:"50% 50%"},T0+TD+0.15);
up("#pn",1.75);fade("#p0",1.8);up("#p1",1.85);up("#p2",1.95);fade("#f1",2.1);fade("#f2",2.15);
tl.to("#p1 div:nth-child(2),#p2 div:nth-child(2)",{scale:1.1,duration:0.15,yoyo:true,repeat:1,transformOrigin:"0 50%"},2.5);'''
sfx=[('imp',0.0,0.45),('wd',0.25,0.4),('pop',0.4+1.3*0.32,0.5),('ph',0.4+1.3*0.65,0.4),('coin',1.85,0.4),('thud',1.75,0.45),('shim',2.45,0.3)]
page(3,3.4,'',b,js,sfx)
# ---------- MG4
b=HEAD('El Puente Financiero:<br>Apalancamiento Inteligente','')
b+='''<svg class="abs" style="left:0;top:480px" width="1080" height="800" viewBox="0 0 1080 800">
<g id="gl"><text x="185" y="330" text-anchor="middle" font-family="PPBold" font-size="56" fill="#0E2A4A">Hoy</text><polygon points="30,400 66,366 356,366 320,400" fill="#1D6E8C"/><polygon points="320,400 356,366 356,566 320,600" fill="#082038"/><rect x="30" y="400" width="290" height="200" fill="#0E3A5E"/><text x="175" y="480" text-anchor="middle" font-family="PPBold" font-size="52" fill="#FFE1AD">10% a</text><text x="175" y="548" text-anchor="middle" font-family="PPBold" font-size="52" fill="#FFE1AD">la Firma</text></g>
<g id="gm"><g id="gmt"><text x="545" y="150" text-anchor="middle" font-family="PPBold" font-size="50" fill="#0E2A4A">Construcción</text><text x="545" y="240" text-anchor="middle" font-family="PPBold" font-size="76" fill="#0E2A4A">10%</text><text x="545" y="326" text-anchor="middle" font-family="PPBold" font-size="64" fill="#0E2A4A">Diferido</text></g>
<path id="cab" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M356,372 Q560,560 760,230" fill="none" stroke="#0E2A4A" stroke-width="8"/><line id="deck" x1="356" y1="500" x2="760" y2="500" stroke="#0E2A4A" stroke-width="16"/>
<g id="hg" stroke="#C99A2E" stroke-width="5"><line x1="395" y1="405" x2="395" y2="500"/><line x1="435" y1="432" x2="435" y2="500"/><line x1="475" y1="451" x2="475" y2="500"/><line x1="515" y1="462" x2="515" y2="500"/><line x1="555" y1="464" x2="555" y2="500"/><line x1="595" y1="456" x2="595" y2="500"/><line x1="635" y1="437" x2="635" y2="500"/><line x1="675" y1="406" x2="675" y2="500"/><line x1="710" y1="366" x2="710" y2="500"/><line x1="740" y1="318" x2="740" y2="500"/></g>
<g id="m20"><line x1="366" y1="570" x2="440" y2="570" stroke="#C99A2E" stroke-width="4"/><line x1="366" y1="554" x2="366" y2="586" stroke="#C99A2E" stroke-width="4"/><line x1="676" y1="570" x2="750" y2="570" stroke="#C99A2E" stroke-width="4"/><line x1="750" y1="554" x2="750" y2="586" stroke="#C99A2E" stroke-width="4"/><rect x="448" y="536" width="220" height="68" rx="34" fill="#A47611"/><text x="558" y="584" text-anchor="middle" font-family="PPBold" font-size="42" fill="#fff">20 meses</text></g></g>
<g id="gr"><text x="905" y="130" text-anchor="middle" font-family="PPBold" font-size="50" fill="#0E2A4A">Entrega 2028</text><rect x="750" y="170" width="310" height="34" fill="#0E2A4A"/><rect x="750" y="568" width="310" height="32" fill="#0E2A4A"/><rect x="772" y="184" width="266" height="400" fill="#0E2A4A"/><text x="905" y="380" text-anchor="middle" font-family="PPBold" font-size="80" fill="#FFE1AD">80%</text><text x="905" y="476" text-anchor="middle" font-family="PPBold" font-size="76" fill="#FFE1AD">Final</text></g></svg>'''
js='''tl.fromTo("#gl",{opacity:0,y:-260},{opacity:1,y:0,duration:0.32,ease:"power3.in"},0.45);tl.fromTo("#gl",{scaleY:0.9,transformOrigin:"50% 100%"},{scaleY:1,duration:0.3,ease:"elastic.out(1,0.4)",immediateRender:false},0.77);
tl.fromTo("#deck",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.45,ease:"power3.out"},1.1);tl.to("#cab",{attr:{"stroke-dashoffset":0},duration:0.55,ease:"power2.out"},1.15);
tl.fromTo("#hg line",{opacity:0,scaleY:0,transformOrigin:"50% 100%"},{opacity:1,scaleY:1,duration:0.14,stagger:0.05},1.3);
tl.fromTo("#gmt",{opacity:0,scale:0.4,transformOrigin:"50% 50%"},{opacity:1,scale:1,duration:0.3,ease:"back.out(2.6)"},1.55);
tl.fromTo("#m20",{opacity:0,scale:0.4,transformOrigin:"50% 50%"},{opacity:1,scale:1,duration:0.28,ease:"back.out(2.6)"},2.1);
tl.fromTo("#gr",{opacity:0,y:-320},{opacity:1,y:0,duration:0.32,ease:"power3.in"},2.55);tl.fromTo("#flash",{opacity:0.5},{opacity:0,duration:0.3,ease:"power2.out",immediateRender:false},2.87);
tl.fromTo("#gr",{scaleY:0.92,transformOrigin:"50% 100%"},{scaleY:1,duration:0.35,ease:"elastic.out(1,0.4)",immediateRender:false},2.87);
tl.to("#gmt",{scale:1.08,duration:0.18,yoyo:true,repeat:1,ease:"power1.inOut"},3.4);tl.to("#m20",{scale:1.1,duration:0.18,yoyo:true,repeat:1,ease:"power1.inOut"},3.55);'''
sfx=[('imp',0.0,0.5),('fw',0.35,0.35),('imp',0.72,0.5),('who',1.05,0.45),('st',1.5,0.45),('st',2.06,0.45),('air',2.4,0.35),('imp',2.82,0.6),('sw',3.4,0.35)]
page(4,4.5,'',b,js,sfx)
# ---------- MG4 sincronizado con la voz del video Doctor v8 (mismo diseño, otros tiempos)
js4s=js.replace('0.45);tl.fromTo("#gl",{scaleY','0.45);tl.fromTo("#gl",{scaleY')
rep=[('},1.1);tl.to("#cab"','},1.6);tl.to("#cab"'),('},1.15);\ntl.fromTo("#hg','},1.65);\ntl.fromTo("#hg'),('stagger:0.05},1.3)','stagger:0.05},1.8)'),('(2.6)"},1.55)','(2.6)"},2.0)'),('(2.6)"},2.1)','(2.6)"},2.45)'),
('ease:"power3.in"},2.55);tl.fromTo("#flash"','ease:"power3.in"},3.85);tl.fromTo("#flash"'),('immediateRender:false},2.87);\ntl.fromTo("#gr"','immediateRender:false},4.17);\ntl.fromTo("#gr"'),('immediateRender:false},2.87);\ntl.to','immediateRender:false},4.17);\ntl.to'),
('ease:"power1.inOut"},3.4);','ease:"power1.inOut"},5.2);'),('ease:"power1.inOut"},3.55);','ease:"power1.inOut"},5.4);tl.to("#gr",{scale:1.06,transformOrigin:"50% 50%",duration:0.18,yoyo:true,repeat:1,ease:"power1.inOut"},6.75);')]
for a_,b_ in rep:
    assert a_ in js4s,a_; js4s=js4s.replace(a_,b_)
sfx4=[('wd',0.3,0.45),('boom',0.72,0.5),('wu',1.55,0.5),('pop',2.0,0.5),('ph',2.45,0.5),('rise',3.2,0.3),('boom',4.14,0.6),('ss',5.2,0.4),('coin',6.72,0.35)]
page('4s',7.9,'',b,js4s,sfx4)
# ---------- MG5 rendimiento esperado
b=HEAD('Rendimiento esperado<br>en 2 años','Escenario conservador · plusvalía + rentas a corto plazo')
b+=f'''<svg id="ring" class="abs" style="left:250px;top:520px" width="580" height="580" viewBox="0 0 580 580">
<circle cx="290" cy="290" r="250" fill="#FFFBF3" stroke="#EAD9B8" stroke-width="34"/>
<circle id="arc" cx="290" cy="290" r="250" fill="none" stroke="#C99A2E" stroke-width="34" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" transform="rotate(-90 290 290)"/>
<circle id="glow" cx="290" cy="290" r="210" fill="#FFD086" opacity="0"/></svg>
<div id="pct" class="abs" style="left:250px;width:580px;top:700px;text-align:center;font-family:'PPCondensed';font-size:180px;line-height:1;color:#0E2A4A">0.00%</div>
<div id="pctl" class="abs" style="left:250px;width:580px;top:930px;text-align:center;font-family:'PPBold';font-size:30px;letter-spacing:.12em;color:#8A620C">EN 2 AÑOS</div>
<div id="k1" class="abs chipk" style="left:65px;top:1140px;width:420px">Plusvalía</div><div id="kp" class="abs" style="left:505px;top:1136px;width:70px;text-align:center;font-family:'PPBold';font-size:72px;line-height:90px;color:#A47611">+</div>
<div id="k2" class="abs chipk" style="left:595px;top:1140px;width:420px">Rentas a corto plazo<br><small>(Airbnb)</small></div>
<div id="badge" class="abs" style="left:290px;width:500px;top:1252px;height:52px;border-radius:999px;background:#0E2A4A;color:#FFD086;font-family:'PPBold';font-size:24px;letter-spacing:.1em;display:flex;align-items:center;justify-content:center">ESCENARIO CONSERVADOR</div>
<div id="f5" class="abs" style="left:40px;right:40px;top:1316px;text-align:center;font-family:'Cormorant Garamond',serif;font-style:italic;font-weight:600;font-size:23px;line-height:1.2;color:#4A4336">Estimación, no garantizada: depende de ocupación, tarifas, gastos y mercado.</div>'''
css5='''.chipk{height:96px;border-radius:24px;background:#0E2A4A;color:#fff;font-family:'PPBold';font-size:32px;line-height:1.05;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;box-shadow:0 8px 20px rgba(14,42,74,.25)}.chipk small{font-family:'PPText';font-size:24px;color:#FFD086}'''
js5='''tl.fromTo("#ring",{opacity:0,scale:0.4,transformOrigin:"50% 50%"},{opacity:1,scale:1,duration:0.35,ease:"back.out(1.8)"},0.35);
tl.to("#arc",{attr:{"stroke-dashoffset":0.8167},duration:1.9,ease:"power2.out"},0.6);
const pv={v:0};tl.fromTo(pv,{v:0},{v:18.33,duration:1.9,ease:"power2.out",onUpdate:()=>{document.getElementById("pct").textContent=pv.v.toFixed(2)+"%";}},0.6);
fade("#pct",0.55);fade("#pctl",0.7);
tl.fromTo("#pct",{scale:1},{scale:1.16,duration:0.14,yoyo:true,repeat:1,ease:"power2.out",immediateRender:false},2.5);
tl.fromTo("#glow",{opacity:0.5,scale:0.6,transformOrigin:"50% 50%"},{opacity:0,scale:1.5,duration:0.6,ease:"power2.out",immediateRender:false},2.5);
tl.fromTo("#flash",{opacity:0.35},{opacity:0,duration:0.3,immediateRender:false},2.5);
tl.fromTo("#k1",{opacity:0,x:-160},{opacity:1,x:0,duration:0.28,ease:"back.out(1.8)"},2.9);pop("#kp",3.15);tl.fromTo("#k2",{opacity:0,x:160},{opacity:1,x:0,duration:0.28,ease:"back.out(1.8)"},3.3);
pop("#badge",3.8);fade("#f5",4.2);
tl.to("#pct",{color:"#A47611",duration:0.3,yoyo:true,repeat:3,ease:"sine.inOut"},4.4);'''
sfx5=[('imp',0.0,0.45),('wu',0.3,0.45),('rise',1.45,0.35),('cha',2.48,0.5),('boom',2.5,0.35),('wd',2.88,0.4),('pop',3.15,0.5),('ss',3.28,0.4),('ph',3.8,0.5),('shim',4.4,0.25)]
page(5,6.0,css5,b,js5,sfx5)
print('ok')
