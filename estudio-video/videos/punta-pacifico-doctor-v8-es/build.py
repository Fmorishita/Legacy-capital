import json
P='/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-doctor-v8-es/'
W=json.load(open('/home/user/Legacy-capital/estudio-video/proyectos/punta-pacifico/voz/v8/words-edit.json'))
# subtítulos: cifras con número, ortografía de nombres
fixi={2:'médico,',3:'¿buscas',19:'patrimonio?',24:'residencial,',27:'Sauzal,',34:'$3.9',36:'$4.9',39:'pesos:',42:'1',45:'2',47:'3',52:'privado,',73:'pickleball,',77:'asador,',86:'amenidades,',97:'flexibles:',123:'corta:',130:'2',143:'smart',149:'minisplit',165:'cocina,',175:'$450 mil',176:'pesos.',191:'Legacy'}
drop={74,150}
words=[]
for i,(t,s,e) in enumerate(W):
    if i in drop: continue
    words.append([fixi.get(i,t),s,e])
for i in range(len(words)-1): words[i][2]=min(words[i][2],words[i+1][1])
DUR=74.2
# id, ini, fin, img, origin, s0, s1, x0, x1, titular(l1,l2,sm), leyenda
SC=[
('s01',0,2.9,'doc','50% 30%',1.0,1.08,0,0,None,1),
('s02',2.9,4.3,'v07','15% 20%',1.22,1.3,0,0,('DISFRUTAR','EN PAREJA',''),1),
('s03',4.3,6.25,'celebra','50% 40%',1.04,1.12,0,0,('INVERTIR Y CRECER','TU PATRIMONIO',''),1),
('s04',11.0,12.05,'v04','50% 50%',1.1,1.16,-2,2,None,1),
('s05',12.05,14.3,'v18','50% 60%',1.06,1.14,0,0,None,1),
('s06',14.3,16.75,'v27','50% 50%',1.04,1.12,0,0,('1 NIVEL','2 O 3 RECÁMARAS',''),1),
('s07',16.75,18.25,'v25','90% 20%',1.2,1.28,0,0,('ROOF GARDEN','PRIVADO',''),1),
('s08',18.25,19.95,'k16','50% 0%',1.5,1.58,0,0,('VISTA','AL MAR',''),1),
('s09',19.95,21.6,'v08','50% 50%',1.04,1.12,0,0,('TU PAUSA','EN LA ALBERCA',''),1),
('s10',21.6,24.25,'v09','50% 50%',1.1,1.1,-2,2,('PICKLEBALL','CON AMIGOS',''),1),
('s11',24.25,25.15,'asador','40% 50%',1.04,1.12,0,0,('TARDES','DE ASADOR',''),1),
('s12',25.15,27.98,'v11','50% 50%',1.04,1.12,0,0,('CENAS EN','LAS AMENIDADES',''),1),
('s13',27.98,29.45,'roofcena','50% 50%',1.04,1.12,0,0,('O EN TU','ROOF PRIVADO',''),1),
('s14',29.45,31.4,'v13','50% 50%',1.1,1.1,2,-2,('CUIDA TU','LIQUIDEZ',''),1),
('s15',42.1,44.85,'v19','50% 50%',1.04,1.12,0,0,None,1),
('s16',50.85,53.8,'v20','50% 50%',1.04,1.12,0,0,('SMART','HOME',''),1),
('s17',53.8,55.65,'v14','50% 50%',1.1,1.1,-2,2,None,1),
('s18',55.65,58.2,'v21','50% 50%',1.04,1.12,0,0,None,1),
('s19',58.2,59.85,'v16','50% 50%',1.04,1.12,0,0,('APARTA','ESTE MES',''),1),
('s20',59.85,60.9,'v22','45% 50%',1.1,1.18,0,0,('COCINA','EQUIPADA',''),1),
('s21',60.9,61.45,'v23','50% 50%',1.1,1.16,0,0,('CUARTOS',' ',''),1),
('s22',61.45,61.95,'v24','50% 50%',1.1,1.16,0,0,('BAÑOS',' ',''),1),
('s23',61.95,63.85,'k05','50% 0%',1.75,1.83,0,0,('ROOF','EQUIPADO',''),1),
]
MG=[('mg2',6.25,4.75),('mg4',31.4,7.9),('mg3',39.3,2.8),('mg5',44.85,6.0)]
PROMO=(63.85,67.45); END=(67.45,DUR)
H=[];A=H.append
A('''<!doctype html>
<html lang="es"><head><meta charset="UTF-8" /><meta name="viewport" content="width=1080, height=1920" />
<title>Doctor V8 — Legacy Capital</title>
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
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(7,29,41,.78) 0%,rgba(7,29,41,.45) 24%,rgba(7,29,41,.08) 38%,rgba(7,29,41,0) 50%,rgba(7,29,41,.35) 100%)}
.hl{position:absolute;left:90px;top:290px;font-family:"PPCondensed",sans-serif;font-size:96px;line-height:1.16;letter-spacing:.01em;text-shadow:0 3px 10px rgba(0,0,0,.45)}
.hl .l2{color:#FFD086}.hl .rule{width:150px;height:8px;background:#FFD086;margin-top:18px;border-radius:4px}
.leg{position:absolute;left:65px;top:1200px;font-size:22px;letter-spacing:.06em;color:#fff;background:rgba(7,29,41,.7);border-radius:999px;padding:4px 16px}
.cap{position:absolute;left:50%;transform:translateX(-50%);white-space:nowrap;padding:4px 28px 8px;border-radius:20px;background:rgba(7,29,41,.5);text-align:center;font-family:"PPBold",sans-serif;font-size:60px;line-height:1.15;text-shadow:0 3px 8px rgba(0,0,0,.65)}
.cap .w{color:#fff}
#hook{position:absolute;left:80px;right:80px;top:300px;font-family:"PPCondensed";text-shadow:0 4px 14px rgba(0,0,0,.55)}
#hook .a{font-size:110px;line-height:1.05;letter-spacing:.01em}
#hook .b{font-size:84px;line-height:1.08;color:#FFD086;margin-top:12px}
#hook .rule{width:170px;height:9px;border-radius:5px;background:#FFD086;margin-top:22px}
.pr{position:absolute;left:90px;top:300px;text-shadow:0 4px 12px rgba(0,0,0,.55)}
.pr .a{font-family:"PPCondensed";font-size:64px;line-height:1.2;color:#FFD086;letter-spacing:.08em}
.pr .b{font-family:"PPCondensed";font-size:240px;line-height:1.3}
.pr .c{font-family:"PPBold";font-size:46px;line-height:1.3}
.chip{position:absolute;left:90px;height:100px;border-radius:999px;background:rgba(7,29,41,.85);border:3px solid #FFD086;display:flex;align-items:center;padding:0 38px;font-family:"PPBold";font-size:46px}
.chip span{color:#FFD086;margin-right:18px}
/* rentas */
#rent{position:absolute;left:65px;right:65px;top:290px;height:560px;border-radius:34px;background:rgba(7,29,41,.86);border:3px solid #FFD086;box-shadow:0 18px 50px rgba(0,0,0,.45)}
#rent .t{position:absolute;left:44px;top:34px;font-family:"PPCondensed";font-size:64px;line-height:1.1;color:#FFD086}
#rent .s{position:absolute;left:44px;top:112px;font-size:30px}
.bar{position:absolute;bottom:60px;width:96px;border-radius:14px 14px 4px 4px;background:linear-gradient(180deg,#FFD086,#C99A2E)}
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
    A(f'<div id="{sid}" class="clip bg" data-start="{a}" data-duration="{round(b-a,3)}" data-track-index="0"><div class="kb" data-layout-allow-overflow><img src="assets/img/{img}.jpg" alt="" /></div><div class="shade"></div>')
    if hl: A(f'<div class="hl" id="{sid}-hl"><div class="l1">{hl[0]}</div><div class="l2">{hl[1]}</div><div class="rule"></div></div>')
    if sid=='s01': A('<div id="hook"><div class="a">DOCTOR O MÉDICO,</div><div class="b">¿BUSCAS COMPRAR CASA CON VISTA AL MAR?</div><div class="rule"></div></div>')
    if sid=='s04': A('<div class="pr" id="pr1"><div class="a">DESDE</div><div class="b">$3.9</div><div class="c">MILLONES DE PESOS</div></div>')
    if sid=='s05': A('<div class="pr" id="pr2"><div class="a">HASTA</div><div class="b">$4.9</div><div class="c">MILLONES DE PESOS · MXN</div></div>')
    if sid=='s15':
        A('<div id="rent"><div class="t">INGRESOS POR RENTA</div><div class="s">Estancia corta · mes a mes</div>')
        for i,h in enumerate([90,130,165,205,250,300]):
            A(f'<div class="bar" id="rb{i}" style="left:{60+i*150}px;height:{h}px"></div><div class="coin" id="rc{i}" style="left:{71+i*150}px;top:{560-60-h-90}px">$</div>')
        A('<svg id="rent-arrow" width="950" height="560" viewBox="0 0 950 560"><path id="ra" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1" d="M90,420 L240,380 L390,350 L540,300 L690,250 L860,150" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><polygon id="rah" points="860,150 822,152 846,182" fill="#fff" opacity="0"/></svg></div>')
        for i,(x,y) in enumerate([(150,930),(760,900),(420,1000),(880,1010)]):
            A(f'<div class="plus" id="pl{i}" style="left:{x}px;top:{y}px">+$</div>')
    if sid=='s17': A('<div class="chip" id="ch1" style="top:300px"><span>●</span>Luces</div><div class="chip" id="ch2" style="top:420px"><span>●</span>Minisplit</div>')
    if sid=='s18': A('<div class="chip" id="ch3" style="top:300px"><span>●</span>Cerradura digital</div><div class="chip" id="ch4" style="top:420px"><span>●</span>Desde tu celular</div>')
    if lg: A('<div class="leg">Imagen ilustrativa</div>')
    A('</div>')
for k,a,d in MG:
    A(f'<video id="{k}" class="clip mgv" src="assets/mg/{k}.mp4" data-start="{a}" data-duration="{d}" data-track-index="1" data-has-audio="true" data-volume="0.75" playsinline></video>')
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
<div id="leak-a" class="clip" data-composition-id="leak-a" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="5.9" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>
<div id="leak-b" class="clip" data-composition-id="leak-b" data-composition-src="compositions/organic-light-leak-overlay.html" data-start="67.0" data-duration="1" data-width="1080" data-height="1920" data-track-index="6"></div>
<audio id="voz" src="assets/voz.wav" data-start="0" data-duration="73.06" data-track-index="8" data-volume="0.95"></audio>
<audio id="musica" src="assets/musica.mp3" data-start="0" data-duration="{DUR}" data-media-start="8" data-track-index="9" data-volume="0.13" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":1}},{{"t":72.8,"v":1}},{{"t":{DUR},"v":0}}]}}]}}'></audio>
''')
SFX={'sw':('fast-small-sweep-166',0.8),'st':('short-transition-sweep-175',0.65),'who':('cinematic-whoosh-fast-1492',1.38),'fw':('fast-whoosh-1490',1.8),'imp':('quick-zoom-impact-772',1.25),'air':('air-zoom-vacuum-2608',1.3)}
mgst=set(a for _,a,_ in MG)
cuts=sorted(set([a for _,a,*_ in SC if a>0]+[PROMO[0],END[0]]))
ev=[]
for i,c in enumerate(cuts):
    if c in mgst: continue
    ev.append(('sw' if i%2 else 'st',max(0,c-0.2),0.22))
ev+=[('imp',0.05,0.32),('imp',11.0,0.3),('imp',12.05,0.3),('st',42.3,0.2),('st',42.6,0.2),('st',42.9,0.2),('st',43.2,0.2),('st',43.5,0.2),('st',43.8,0.2),('imp',44.2,0.25),
     ('st',53.95,0.2),('st',54.45,0.2),('st',55.8,0.2),('st',56.3,0.2),
     ('air',63.6,0.45),('fw',63.85,0.3),('imp',64.75,0.6),('imp',65.9,0.4),('who',67.35,0.35),('imp',67.9,0.3)]
for i,(k,t,v) in enumerate(ev):
    f,d=SFX[k]
    A(f'<audio id="sfx{i}" src="assets/sfx/{f}.mp3" data-start="{round(t,3)}" data-duration="{d}" data-track-index="{10+i%9}" data-volume="{v}"></audio>')
A('</div>\n<script>\nwindow.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});')
# subtítulos (solo escenas de foto)
groups=[]
for sid,a,b,*_ in SC:
    cur=[]
    for w in words:
        if not (a-0.06<=w[1]<b-0.06): continue
        if cur and (len(cur)>=4 or len(' '.join(x[0] for x in cur))+len(w[0])>21 or cur[-1][0][-1] in ',.:;?'):
            groups.append((cur,b)); cur=[]
        cur.append(w)
    if cur: groups.append((cur,b))
G=[{'top':1085,'end':min(b,g[-1][2]+0.5),'w':g} for g,b in groups]
A('const CAPS='+json.dumps(G,ensure_ascii=False)+';')
A('''const host=document.getElementById("captions");
CAPS.forEach((g,gi)=>{const line=document.createElement("div");line.className="cap";line.id="cap-"+gi;line.style.top=g.top+"px";line.style.opacity="0";
g.w.forEach(([t],wi)=>{const s=document.createElement("span");s.className="w";s.id="cap-"+gi+"-"+wi;s.textContent=t;line.appendChild(s);if(wi<g.w.length-1)line.appendChild(document.createTextNode(" "));});
host.appendChild(line);const st=Math.max(0,g.w[0][1]-0.05);tl.set(line,{opacity:1},st);tl.fromTo(line,{scale:0.85},{scale:1,duration:0.12,ease:"back.out(3)"},st);
g.w.forEach(([,t,e],wi)=>{tl.to("#cap-"+gi+"-"+wi,{color:"#FFD086",duration:0.06,ease:"none"},Math.max(0,t-0.04));const nx=g.w[wi+1];if(nx)tl.to("#cap-"+gi+"-"+wi,{color:"#ffffff",duration:0.06,ease:"none"},nx[1]-0.04);});
const next=CAPS[gi+1];const end=next?Math.min(g.end,next.w[0][1]-0.05):g.end;tl.set(line,{opacity:0},end);});
const pop=(s,t,o)=>tl.fromTo(s,{opacity:0,scale:0.5},Object.assign({opacity:1,scale:1,duration:0.28,ease:"back.out(2.4)"},o||{}),t);
const up=(s,t,o)=>tl.fromTo(s,{opacity:0,y:40},Object.assign({opacity:1,y:0,duration:0.28,ease:"power3.out"},o||{}),t);''')
for sid,a,b,img,org,s0,s1,x0,x1,hl,lg in SC:
    d=round(b-a,3)
    A(f'tl.fromTo("#{sid} .kb",{{scale:{s0},xPercent:{x0},transformOrigin:"{org}"}},{{scale:{s1},xPercent:{x1},duration:{d},ease:"none"}},{a});')
    if hl:
        A(f'tl.fromTo("#{sid}-hl .l1",{{opacity:0,x:-50}},{{opacity:1,x:0,duration:0.22,ease:"power3.out"}},{round(a+0.05,3)});tl.fromTo("#{sid}-hl .l2",{{opacity:0,x:-50}},{{opacity:1,x:0,duration:0.22,ease:"power3.out"}},{round(a+0.14,3)});tl.fromTo("#{sid}-hl .rule",{{scaleX:0,transformOrigin:"0 50%"}},{{scaleX:1,duration:0.25,ease:"power2.out"}},{round(a+0.22,3)});')
    A(f'tl.fromTo("#{sid} .leg",{{opacity:0}},{{opacity:1,duration:0.2}},{round(a+0.1,3)});')
# partículas promo (deterministas)
pts=[]
for i in range(28):
    ang=i/28*2*math.pi+random.uniform(-.1,.1); r=random.uniform(380,640)
    pts.append((round(math.cos(ang)*r),round(math.sin(ang)*r*0.9),round(random.uniform(0.6,1.6),2)))
A('const PTS='+json.dumps(pts)+';')
A('''// hook
tl.fromTo("#hook .a",{opacity:0,scale:1.3,filter:"blur(12px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.35,ease:"power4.out",transformOrigin:"0 50%"},0.05);
tl.fromTo("#hook .b",{opacity:0,y:40},{opacity:1,y:0,duration:0.3,ease:"power3.out"},0.95);tl.fromTo("#hook .rule",{scaleX:0,transformOrigin:"0 50%"},{scaleX:1,duration:0.3},1.2);
// precios
tl.fromTo("#pr1 .a",{opacity:0,x:-40},{opacity:1,x:0,duration:0.2},11.02);tl.fromTo("#pr1 .b",{opacity:0,scale:1.6},{opacity:1,scale:1,duration:0.25,ease:"power4.out",transformOrigin:"0 50%"},11.3);up("#pr1 .c",11.5);
tl.fromTo("#pr2 .a",{opacity:0,x:-40},{opacity:1,x:0,duration:0.2},12.07);tl.fromTo("#pr2 .b",{opacity:0,scale:1.6},{opacity:1,scale:1,duration:0.25,ease:"power4.out",transformOrigin:"0 50%"},12.35);up("#pr2 .c",13.0);
// rentas: barras + monedas + flecha
tl.fromTo("#rent",{opacity:0,y:-40,scale:0.92},{opacity:1,y:0,scale:1,duration:0.3,ease:"back.out(1.8)"},42.12);
[0,1,2,3,4,5].forEach(i=>{const t=42.3+i*0.3;tl.fromTo("#rb"+i,{scaleY:0,transformOrigin:"50% 100%"},{scaleY:1,duration:0.28,ease:"back.out(1.6)"},t);
 tl.fromTo("#rc"+i,{opacity:0,y:-120,rotationY:0},{opacity:1,y:0,rotationY:360,duration:0.35,ease:"bounce.out"},t+0.08);});
tl.to("#ra",{attr:{"stroke-dashoffset":0},duration:1.7,ease:"none"},42.35);tl.fromTo("#rah",{opacity:0},{opacity:1,duration:0.1},44.05);
[0,1,2,3].forEach(i=>tl.fromTo("#pl"+i,{opacity:0,y:40,scale:0.5},{opacity:1,y:-60,scale:1.1,duration:0.7,ease:"power2.out"},42.5+i*0.45));
tl.to(".coin",{scale:1.15,duration:0.12,yoyo:true,repeat:1,stagger:0.05},44.2);
// smart home
pop("#ch1",53.9);pop("#ch2",54.4);pop("#ch3",55.75);pop("#ch4",56.25);
// PROMO: tensión + explosión
tl.fromTo("#rays",{rotation:0,scale:0.6,opacity:0},{rotation:40,scale:1.15,opacity:1,duration:3.6,ease:"none"},63.85);
tl.fromTo("#pa",{opacity:0,y:-60},{opacity:1,y:0,duration:0.25,ease:"power3.out"},63.9);
const pv={v:0};tl.fromTo("#pn",{opacity:0,scale:0.4},{opacity:1,scale:1,duration:0.2},64.0);
tl.fromTo(pv,{v:0},{v:450000,duration:0.75,ease:"power2.in",onUpdate:()=>{document.getElementById("pn").textContent="$"+Math.round(pv.v).toLocaleString("en-US");}},64.0);
tl.set("#pn",{textContent:"$450,000"},64.76);
tl.fromTo("#pn",{scale:1.55},{scale:1,duration:0.4,ease:"elastic.out(1,0.45)",immediateRender:false},64.76);
tl.fromTo("#pflash",{opacity:0.85},{opacity:0,duration:0.35,ease:"power2.out",immediateRender:false},64.76);
tl.fromTo("#pz",{x:0,y:0},{keyframes:[{x:-16,y:10},{x:14,y:-12},{x:-10,y:6},{x:8,y:-4},{x:0,y:0}],duration:0.35,ease:"none"},64.76);
PTS.forEach(([x,y,s],i)=>tl.fromTo("#pt"+i,{x:0,y:0,scale:s,opacity:1},{x:x,y:y,scale:0,opacity:0,duration:0.9,ease:"power3.out",immediateRender:false},64.76));
tl.fromTo("#shine",{x:-300},{x:1150,duration:0.6,ease:"power2.inOut"},65.15);tl.fromTo("#shine",{x:-300},{x:1150,duration:0.6,ease:"power2.inOut",immediateRender:false},66.3);
tl.to("#pn",{scale:1.08,duration:0.3,yoyo:true,repeat:5,ease:"sine.inOut"},65.2);
up("#pc",65.1);tl.fromTo("#pd",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.3,ease:"back.out(2.5)"},65.5);
// cierre
tl.fromTo("#end-crest",{opacity:0,scale:1.6,filter:"blur(16px)"},{opacity:1,scale:1,filter:"blur(0px)",duration:0.45,ease:"power3.out"},67.55);
tl.fromTo("#end-brand",{opacity:0},{opacity:1,duration:0.3},67.85);tl.fromTo("#end-re",{opacity:0},{opacity:1,duration:0.3},68.0);up("#end-mas",68.3);
tl.fromTo("#end-cta",{opacity:0,scale:0.6},{opacity:1,scale:1,duration:0.35,ease:"back.out(2.2)"},68.7);tl.fromTo("#end-wa",{opacity:0},{opacity:1,duration:0.3},69.2);
tl.to("#end-cta",{scale:1.07,duration:0.39,ease:"sine.inOut",yoyo:true,repeat:11},69.3);tl.fromTo("#end-arrow",{y:-6},{y:10,duration:0.39,ease:"power1.inOut",yoyo:true,repeat:11},69.3);''')
A(f'tl.to({{}},{{duration:{DUR}}},0);window.__timelines["main"]=tl;\n</script></body></html>')
open(P+'index.html','w').write('\n'.join(H))
print(len(G),'grupos');print(' | '.join(' '.join(w[0] for w in g['w']) for g in G))
