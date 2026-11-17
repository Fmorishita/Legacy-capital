"""Doctor V13 — doctor en «¿Doctor o médico?», avatar de Fran en el rooftop en «¿Buscas una casa con vista al mar?»,
cierre con Fran y su pareja brindando en «te atenderá». Cuerpo: punta-pacifico-doctor-v13-cuerpo-es.
Base: Doctor V11b — variante con el asesor de Legacy Capital (intro y cierre).
Cuerpo: render de la V11 (punta-pacifico-doctor-v11-es) de 6.5 s a 61.25 s.
Voz del asesor limpiada (WPE + DeepFilterNet3, EQ, compresión, −17.5 LUFS)."""
import json, re
P='/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-doctor-v13-avatar-es/'
AIDX=open('/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-doctor-v13-cuerpo-es/index.html').read()
CSS=AIDX[AIDX.index('<style>')+7:AIDX.index('</style>')]
H=7.1                 # fin del intro del asesor
A0,A1=6.5,61.25       # tramo del cuerpo tomado de la V11
OFF=H-A0              # B = A + OFF
C1=(7.80,10.42)       # cierre parte 1 (tiempo del video del asesor)
C2=(11.55,14.05)      # cierre parte 2 (se quita la pausa 10.42–11.55)
B_C1=A1+OFF; B_C2=B_C1+(C1[1]-C1[0]); B_END=B_C2+(C2[1]-C2[0])
AV_END=B_C1+5.45      # cierre completo hasta «te atenderá» y el brindis
END_LEN=round(B_END-AV_END+1.43,2); END_SRC=round(66.38-END_LEN,2)
DUR=round(AV_END+END_LEN,2)
k1=B_C1-C1[0]; k2=B_C2-C2[0]
CSS+='''
.shade-top{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.78) 0%,rgba(7,29,41,.42) 22%,rgba(7,29,41,0) 29%,rgba(7,29,41,0) 72%,rgba(7,29,41,.3) 100%)}
.logo-in{position:absolute;left:0;right:0;top:1282px;display:flex;flex-direction:column;align-items:center;gap:6px}
.logo-in img{width:96px;height:auto;display:block;filter:drop-shadow(0 2px 6px rgba(0,0,0,.6))}.logo-in span{font-family:"Cinzel",serif;font-weight:700;font-size:32px;letter-spacing:.14em;color:#fff;white-space:nowrap;text-shadow:0 2px 6px rgba(0,0,0,.85),0 0 12px rgba(0,0,0,.6)}
.eb{position:absolute;left:90px;top:300px;text-shadow:0 3px 10px rgba(0,0,0,.55)}
.eb .a{display:block;font-family:"PPBold";font-size:30px;letter-spacing:.24em;color:#FFD086}
.eb .b{display:block;font-family:"Cinzel",serif;font-weight:700;font-size:56px;letter-spacing:.05em;color:#fff;margin-top:8px}
.eb .r{width:150px;height:8px;background:#FFD086;margin-top:16px;border-radius:4px}
#cta-t{position:absolute;left:0;right:0;top:288px;text-align:center;font-family:"PPCondensed";font-size:104px;line-height:1.05;text-shadow:0 4px 14px rgba(0,0,0,.55)}
#cta-w{position:absolute;left:180px;right:180px;top:1172px;height:74px;border-radius:999px;background:rgba(7,29,41,.88);border:3px solid #FFD086;color:#fff;font-family:"PPBold";font-size:38px;display:flex;align-items:center;justify-content:center;gap:12px;box-shadow:0 8px 24px rgba(0,0,0,.35)}
#cta-w span{color:#FFD086}
'''
H_=[];X=H_.append
X('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Doctor V13 avatar — Legacy Capital</title>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<style>'''+CSS+'''</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="%s" data-width="1080" data-height="1920">'''%DUR)
# ---- intro: portada del doctor + asesor + B-roll
SC=[('i1',0,1.62,'clips/ai-doc-1080.mp4',0,None),
    ('i2',1.62,3.45,'clips/avatar-rooftop-v13.mp4',0,None),
    ('i3',3.45,5.0,'clips/ai-sala-b.mp4',0,('DESCONECTA','DE LA GUARDIA')),
    ('i4',5.0,H,'clips/ai-celebra-cut.mp4',0,('TU DINERO','TRABAJANDO PARA TI'))]
for sid,a,b,src,ms,hl in SC:
    X(f'<video id="{sid}-v" class="clip mgv" src="assets/{src}" data-start="{a}" data-duration="{round(b-a,3)}" data-media-start="{ms}" data-track-index="1" muted playsinline></video>')
    sh='shade-lo' if sid in ('i1','i2') else 'shade'
    X(f'<div id="{sid}" class="clip" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="2"><div class="{"shade "+sh if sh!="shade" else "shade"}"></div>')
    if sid=='i1': X('<div id="hook"><div class="a">DOCTOR O MÉDICO,</div><div class="rule"></div></div>')
    if hl: X(f'<div class="hl" id="{sid}-hl"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    X('</div>')
# ---- cuerpo (render V11, solo imagen)
X(f'<video id="cuerpo" class="clip mgv" src="assets/cuerpo.mp4" data-start="{H}" data-duration="{round(A1-A0,3)}" data-media-start="{A0}" data-track-index="1" muted playsinline></video>')
# ---- cierre con el asesor
X(f'<video id="c1-v" class="clip mgv" src="assets/clips/avatar-brindis.mp4" data-start="{round(B_C1,3)}" data-duration="{round(AV_END-B_C1,3)}" data-media-start="0" data-track-index="1" muted playsinline></video>')
X(f'<div id="ctaw" class="clip" data-start="{round(B_C1,3)}" data-duration="{round(AV_END-B_C1,3)}" data-track-index="2"><div class="shade shade-top"></div><div id="cta-t">MÁS INFORMACIÓN</div><div id="cta-w">WhatsApp <span>+52 646 256 3006</span></div></div>')
X(f'<video id="fin" class="clip mgv" src="assets/cuerpo.mp4" data-start="{round(AV_END,3)}" data-duration="{END_LEN}" data-media-start="{END_SRC}" data-track-index="1" muted playsinline></video>')
X(f'<div id="logo-a" class="clip" data-start="0" data-duration="{H}" data-track-index="4"><div class="logo-in" id="la"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
X(f'<div id="logo-b" class="clip" data-start="{round(B_C1,3)}" data-duration="{round(AV_END-B_C1,3)}" data-track-index="4"><div class="logo-in" id="lb"><img src="assets/crest.png" alt="" /><span>LEGACY CAPITAL</span></div></div>')
X(f'<div id="captions" class="clip" data-start="0" data-duration="{DUR}" data-track-index="5"></div>')
# ---- audio
X(f'<audio id="adv-i" src="assets/asesor-voz.wav" data-start="0" data-duration="{H}" data-track-index="8" data-volume="1"></audio>')
X(f'<audio id="voz" src="assets/voz.wav" data-start="{round(H-0.05,3)}" data-duration="{round(A1-A0+0.05,3)}" data-media-start="{A0-0.05}" data-track-index="7" data-volume="1"></audio>')
X(f'<audio id="adv-c1" src="assets/asesor-voz.wav" data-start="{round(B_C1,3)}" data-duration="{round(C1[1]-C1[0],3)}" data-media-start="{C1[0]}" data-track-index="8" data-volume="1"></audio>')
X(f'<audio id="adv-c2" src="assets/asesor-voz.wav" data-start="{round(B_C2,3)}" data-duration="{round(C2[1]-C2[0],3)}" data-media-start="{C2[0]}" data-track-index="8" data-volume="1"></audio>')
X(f'''<audio id="musica" src="assets/musica-b.mp3" data-start="0" data-duration="{DUR}" data-track-index="9" data-volume="1" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0.07}},{{"t":{round(DUR-0.9,2)},"v":0.07}},{{"t":{DUR},"v":0}}]}}]}}'></audio>''')
# animaciones (audio de las animaciones de la V11, desplazado)
for m in re.finditer(r'<video id="(mg\d)" class="clip mgv mgz" src="assets/mg/(mg\d).mp4" data-start="([\d.]+)" data-duration="([\d.]+)"',AIDX):
    mid,src,st,du=m.group(1),m.group(2),float(m.group(3)),float(m.group(4))
    X(f'<audio id="{mid}a" src="assets/mg/{src}-audio.wav" data-start="{round(st+OFF,3)}" data-duration="{du}" data-track-index="6" data-volume="0.42"></audio>')
# efectos: los de la V11 dentro del cuerpo + los nuevos del intro y cierre
ev=[]
for m in re.finditer(r'<audio id="sfx\d+" src="([^"]+)" data-start="([\d.]+)" data-duration="([\d.]+)" data-track-index="\d+" data-volume="([\d.]+)">',AIDX):
    src,st,du,vol=m.group(1),float(m.group(2)),float(m.group(3)),float(m.group(4))
    if A0<=st<A1-0.05: ev.append((src,round(st+OFF,3),min(du,A1+OFF-(st+OFF)),vol))
sfx=lambda n:'assets/sfx/'+n+'.mp3'
D={'syn-boom':0.94,'syn-whoosh-up':0.6,'syn-swish':0.31,'syn-whoosh-down':0.62,'syn-whoosh-low':0.83,'syn-thud':0.33,'syn-shimmer':0.94,'syn-pop':0.2}
for n,t,v in [('syn-boom',0.05,0.3),('syn-whoosh-up',1.45,0.2),('syn-swish',3.3,0.2),('syn-whoosh-down',4.85,0.2),('syn-whoosh-up',6.8,0.25),
              ('syn-whoosh-low',B_C1-0.70,0.25),('syn-pop',B_C1+0.25,0.2),('syn-shimmer',AV_END-0.1,0.2)]:
    ev.append((sfx(n),round(t,3),D[n],v))
for i,(src,t,d,v) in enumerate(ev):
    X(f'<audio id="fx{i}" src="{src}" data-start="{t}" data-duration="{round(d,3)}" data-track-index="{10+i%9}" data-volume="{v}"></audio>')
X('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# subtítulos del asesor (tiempos en el video final)
W=lambda L,k:[[w,round(t+k,3)] for w,t in L]
G=[
 {'top':1105,'s':1.62,'end':2.45,'w':W([['¿Buscas',1.77],['una',2.05],['casa',2.2]],0)},
 {'top':1105,'s':2.45,'end':3.42,'w':W([['con',2.45],['vista',2.64],['al',3.05],['mar?',3.14]],0)},
 {'top':760,'s':3.45,'end':4.98,'w':W([['para',3.57],['disfrutar',3.78],['en',4.28],['pareja',4.40]],0)},
 {'top':1085,'s':5.0,'end':5.90,'w':W([['o',5.10],['invertir',5.16],['para',5.68]],0)},
 {'top':1085,'s':5.90,'end':7.06,'w':W([['crecer',5.92],['tu',6.24],['patrimonio?',6.36]],0)},
 {'top':1085,'s':B_C1,'end':8.45+k1,'w':W([['Haz',7.89],['clic',8.08],['en',8.19],['el',8.34]],k1)},
 {'top':1085,'s':8.45+k1,'end':9.20+k1,'w':W([['botón',8.49],['de',8.80],['abajo',8.90]],k1)},
 {'top':1085,'s':9.20+k1,'end':C1[1]+k1-0.02,'w':W([['para',9.22],['más',9.52],['información',9.74]],k1)},
 {'top':1085,'s':B_C2,'end':12.24+k2,'w':W([['y',11.60],['un',11.66],['asesor',11.78],['de',12.15]],k2)},
 {'top':1085,'s':12.24+k2,'end':13.16+k2,'w':W([['Legacy',12.27],['Capital',12.65]],k2)},
 {'top':1085,'s':13.16+k2,'end':AV_END-0.05,'w':W([['te',13.18],['atenderá.',13.28]],k2)},
]
X('const CAPS='+json.dumps(G,ensure_ascii=False)+';')
X('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);if(wi<g.w.length-1)line.appendChild(document.createTextNode(" "));});
host.appendChild(line);const st=Math.max(g.s,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.85},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t],wi)=>{tl.to("#cap-"+gi+"-"+wi,{color:"#FFD086",duration:0.06,ease:"none"},Math.max(st,t-0.04));const nx=g.w[wi+1];if(nx)tl.to("#cap-"+gi+"-"+wi,{color:"#ffffff",duration:0.06,ease:"none"},nx[1]-0.04);});
tl.set(line,{opacity:0},g.end);});
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:40},Object.assign({opacity:1,y:0,duration:0.28,ease:"power3.out"},o||{}),t);
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.5},Object.assign({opacity:1,scale:1,duration:0.28,ease:"back.out(2.4)"},o||{}),t);
// portada
tl.fromTo("#hook .a",{opacity:0,scale:1.3,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.35,ease:"power4.out",transformOrigin:"0 50%"},0.05);
tl.fromTo("#hook .rule",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.3},0.4);
tl.fromTo("#la",{opacity:0,y:20},{opacity:1,y:0,duration:0.4,ease:"power2.out"},0.3);
// asesor en cámara
// titulares del B-roll
[["i3",3.45],["i4",5.0]].forEach(([s,a])=>{tl.fromTo("#"+s+"-hl .l1",{opacity:0,x:-50},{opacity:1,x:0,duration:0.22,ease:"power3.out"},a+0.05);tl.fromTo("#"+s+"-hl .l2",{opacity:0,x:-50},{opacity:1,x:0,duration:0.22,ease:"power3.out"},a+0.14);tl.fromTo("#"+s+"-hl .rule",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.25,ease:"power2.out"},a+0.22);});
// cierre con el asesor (corte con punch-in en la segunda parte)
up("#cta-t",@B1@+0.05);pop("#cta-w",@B1@+0.3);
tl.to("#cta-w",{scale:1.06,duration:0.35,yoyo:true,repeat:5,ease:"sine.inOut"},@B1@+0.7);
tl.fromTo("#lb",{opacity:0,y:20},{opacity:1,y:0,duration:0.4,ease:"power2.out"},@B1@+0.2);
'''.replace('@B1@',str(round(B_C1,3))).replace('@D1@',str(round(C1[1]-C1[0],3))).replace('@B2@',str(round(B_C2,3))).replace('@D2@',str(round(C2[1]-C2[0],3))))
X(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P+'index.html','w').write('\n'.join(H_))
print('DUR',DUR,'B_C1',round(B_C1,2),'B_C2',round(B_C2,2),'B_END',round(B_END,2),'efectos',len(ev))
