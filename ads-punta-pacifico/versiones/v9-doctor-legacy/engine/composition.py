#!/usr/bin/env python3
"""Author the independent Legacy Capital Doctor V6 from timed words and shot JSON.

No generation, voice synthesis or paid calls occur here. V5 and Higgsfield V6 are
read-only historical sources. --plan emits timings without needing final media;
--draft permits voice-only assembly and missing-image fallback for internal QA.
Default builds require every image, the original Legacy logo and the final mix.
"""
from __future__ import annotations
import argparse,copy,hashlib,html,json,math,os,re,shutil
from pathlib import Path
from PIL import Image,ImageFont

ROOT=Path(__file__).resolve().parent
OUT=ROOT/'salud'
WORK=ROOT.parent
FPS=24
NAVY='#1A2B4C';GOLD='#C5A564';CREAM='#F5F0E6'
FONT_DEFAULT={'display':'/usr/share/fonts/truetype/open-sans/OpenSans-CondBold.ttf',
              'body':'/usr/share/fonts/truetype/open-sans/OpenSans-Semibold.ttf',
              'bold':'/usr/share/fonts/truetype/open-sans/OpenSans-ExtraBold.ttf'}
FORBIDDEN=('punta pacífico','punta pacifico','puente pacífico','puente pacifico','19 mensualidades','diecinueve mensualidades')

def js(x):return json.dumps(x,ensure_ascii=False,separators=(',',':'))
def esc(x):return html.escape(str(x),quote=True)
def fmt(x):return f'{float(x):.6f}'.rstrip('0').rstrip('.') or '0'
def read(p):return json.loads(Path(p).read_text())
def sha(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def norm(x):return re.sub(r'[^a-záéíóúüñ0-9]+','',str(x).lower())
def resolve(p):
    p=Path(p)
    return p if p.is_absolute() else ROOT/p
def write(p,s):
    p=Path(p);p.parent.mkdir(parents=True,exist_ok=True)
    if p.exists() and p.stat().st_nlink>1:p.unlink()
    p.write_text(s,encoding='utf-8')
def local_link(src,dst):
    src=Path(src);dst=Path(dst);dst.parent.mkdir(parents=True,exist_ok=True)
    if dst.exists():
        if sha(src)==sha(dst):return
        dst.unlink()
    try:os.link(src,dst)
    except OSError:shutil.copy2(src,dst)

def safe_copy(text):
    lower=html.unescape(str(text)).lower()
    assert not any(t in lower for t in FORBIDDEN),f'Historical copy leaked into Legacy output: {text}'
    return str(text)

def match_anchor(words,anchor,after=0):
    wanted=[norm(x) for x in str(anchor).split()]
    actual=[norm(w['text']) for w in words]
    for i in range(after,len(actual)-len(wanted)+1):
        if actual[i:i+len(wanted)]==wanted:return i
    raise ValueError(f'Cannot find spoken anchor after word{after}: {anchor}')

def load_words(config):
    a=config['audio'];data=read(resolve(a['words_path']))
    words=data['words'] if isinstance(data,dict) else data
    words=[{'text':safe_copy(w.get('text',w.get('word',''))),'start':float(w['start']),'end':float(w['end'])} for w in words]
    assert words and all(w['text'] and w['end']>=w['start'] for w in words)
    assert all(words[i]['start']<=words[i+1]['start'] for i in range(len(words)-1))
    safe_copy(' '.join(w['text'] for w in words))
    duration=a.get('duration')
    if duration is None and a.get('metadata_path'):
        duration=read(resolve(a['metadata_path']))['duration']
    if duration is None:duration=words[-1]['end']+.75
    duration=math.ceil(float(duration)*FPS-1e-7)/FPS
    assert duration>words[-1]['end']
    return words,duration

def load_shots(config,words,duration):
    rows=copy.deepcopy(config.get('shots'))
    if rows is None:
        data=read(resolve(config['shots_path']));rows=data if isinstance(data,list) else data['shots']
    assert rows,'Shot list required'
    cursor=0
    for i,row in enumerate(rows):
        row.setdefault('id',f'legacy-{i+1:02d}')
        row.setdefault('kind','photo')
        if 'start' in row:
            row['start']=float(row['start'])
            cursor=next((j for j,w in enumerate(words) if w['start']>=row['start']-.001),len(words)-1)
        else:
            cursor=match_anchor(words,row.get('anchor',row.get('voice','')),cursor)
            row['start']=words[cursor]['start']
        row['word_start']=cursor
        row.setdefault('caption_top',1120)
        row.setdefault('hero_top',208)
        row.setdefault('focus',row.get('object_position','50% 50%'))
        safe_copy(row.get('headline',''));safe_copy(row.get('support',''))
    rows.sort(key=lambda r:r['start']);rows[0]['start']=0
    assert len({r['id'] for r in rows})==len(rows),'Shot ids must be unique'
    for i,row in enumerate(rows):
        end=rows[i+1]['start'] if i+1<len(rows) else duration
        core=end-row['start']
        assert core>0,f'{row["id"]}: empty shot'
        if core>4.0001:raise ValueError(f'{row["id"]}: core exposure{core:.3f}s exceeds4s. Add a distinct semantic photo/anchor.')
        overlap=min(float(config.get('transition_seconds',.28)),max(0,4-core)) if i+1<len(rows) else 0
        row.update(core_end=end,end=end+overlap,duration=core+overlap,
                   transition_overlap=overlap,entry_duration=rows[i-1]['transition_overlap'] if i else 0,
                   has_next=i+1<len(rows),word_end=rows[i+1]['word_start'] if i+1<len(rows) else len(words))
        row['hero_appear_at']=row['start']+.12
        spoken=words[row['word_start']:row['word_end']]
        wanted=row.get('number_anchor')
        default={'pay0':('diez','10'),'pay1':('diez','10'),'pay2':('ochenta','80'),
                 'bonus':('cuatrocientos','450'),'delivery':('2028','veintiocho')}.get(row['kind'],())
        found=next((w for w in spoken if norm(w['text']) in {norm(x) for x in default}),None)
        if wanted:
            j=match_anchor(words,wanted,row['word_start']);found=words[j]
        number_at=found['start'] if found else row['start']+.10
        row['number_at']=min(number_at,row['core_end']-.3)
        if row['kind'] in ('pay0','pay1','pay2','bonus','delivery'):landing=row['number_at']+.25+1/FPS
        elif row['kind']=='cta':landing=row['start']+.62
        elif row['kind']=='smart':landing=row['start']+.70
        elif row.get('headline'):landing=row['start']+.48+min(4,max(0,len(row['headline'].split())-1))*.055
        else:landing=row['start']+max(.24,row['entry_duration'])+1/FPS
        row['sfx_at']=min(landing,row['core_end']-.10)
    return rows

def caption_groups(words,rows,duration):
    cuts=[r['start'] for r in rows[1:]];groups=[];current=[]
    for w in words:
        chars=len(' '.join(x['text'] for x in current+[w]))
        cross=current and any(current[-1]['start']<t<=w['start']+.0001 for t in cuts)
        pause=current and w['start']-current[-1]['end']>.24
        if current and (len(current)>=4 or chars>25 or cross or pause):groups.append(current);current=[]
        current.append(w)
    if current:groups.append(current)
    out=[]
    for i,g in enumerate(groups):
        start=g[0]['start'];shot=next(r for r in reversed(rows) if r['start']<=start+.0001)
        following=groups[i+1][0]['start'] if i+1<len(groups) else duration-.06
        end=min(following-.018,g[-1]['end']+.18,shot['core_end']-.012)
        end=max(end,g[-1]['end'])
        out.append({'id':f'caption-{i:03d}','text':' '.join(w['text'] for w in g),'start':start,'end':end,
                    'words':g,'shot_id':shot['id'],'top':shot['caption_top']})
    return out

def font_size(text,max_width,initial,path,floor=40):
    for size in range(initial,floor-1,-1):
        f=ImageFont.truetype(str(path),size)
        if max(f.getlength(t) for t in text.split('\n'))<=max_width:return size
    return floor

def base_css():return f'''
@font-face{{font-family:LegacyDisplay;src:url('assets/fonts/display.ttf');font-weight:700}}
@font-face{{font-family:LegacyBody;src:url('assets/fonts/body.ttf');font-weight:600}}
@font-face{{font-family:LegacyBold;src:url('assets/fonts/bold.ttf');font-weight:800}}
*{{box-sizing:border-box;margin:0}}#root{{position:absolute;inset:0;overflow:hidden;isolation:isolate;color:{CREAM};font-family:LegacyBold,sans-serif;--navy:{NAVY};--gold:{GOLD};--cream:{CREAM}}}
.window{{position:absolute;inset:0;overflow:hidden}}.camera{{position:absolute;inset:-56px;transform-origin:50% 46%}}.photo{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}}
.readability{{position:absolute;inset:0;background:linear-gradient(180deg,rgba(26,43,76,.82),rgba(26,43,76,.45)28%,transparent 49%,transparent 55%,rgba(26,43,76,.28)73%,rgba(26,43,76,.20));pointer-events:none}}
.hero{{position:absolute;left:108px;width:864px;top:208px;text-shadow:0 3px 13px rgba(0,0,0,.7)}}.hero-inner{{display:block;transform-origin:0 50%}}.headline{{font-family:LegacyDisplay,sans-serif;font-size:100px;line-height:1.02;letter-spacing:-.6px}}.line{{display:block;overflow:hidden;padding:0 0 8px;margin-bottom:-8px}}.hw{{display:inline-block}}.accent{{color:{GOLD}}}.rule{{display:block;width:160px;height:7px;background:{GOLD};margin-top:20px;transform-origin:left center}}.support{{display:block;font-family:LegacyBody,sans-serif;font-size:33px;line-height:1.2;margin-top:18px}}
.number-window{{display:block;overflow:hidden;padding:10px 0}}.number-wrap{{display:block}}.number{{font-family:LegacyDisplay,sans-serif;font-size:210px;line-height:.98;color:{GOLD};letter-spacing:-5px}}.number-label{{font-family:LegacyDisplay,sans-serif;font-size:56px;line-height:1.03;margin-top:8px}}.eyebrow{{display:block;font-family:LegacyBody,sans-serif;font-size:33px;line-height:1.16;margin-bottom:15px}}
.stages{{display:flex;gap:8px;width:800px;height:10px;margin-top:22px}}.stage{{display:block;height:10px;background:rgba(245,240,230,.45);transform-origin:left center}}.stage:nth-child(1),.stage:nth-child(2){{width:10%}}.stage:nth-child(3){{width:80%}}.stage.active{{background:{GOLD}}}
.smart-controls{{display:flex;gap:14px;margin-top:26px;width:864px}}.smart-chip{{width:274px;padding:20px 14px;background:rgba(26,43,76,.88);border:1px solid {GOLD};font-family:LegacyBody,sans-serif;font-size:30px;line-height:1.15;text-align:center}}.switch{{display:block;width:58px;height:27px;background:rgba(245,240,230,.25);border-radius:20px;margin:12px auto 0;padding:4px;overflow:hidden}}.knob{{display:block;width:19px;height:19px;border-radius:50%;background:{CREAM}}}
.location-pin{{position:absolute;width:70px;height:90px;transform-origin:50% 90%;color:{GOLD}}}.location-pin svg{{width:100%;height:100%;fill:currentColor;stroke:{NAVY};stroke-width:3}}.pin-label{{position:absolute;font-family:LegacyBold,sans-serif;font-size:34px;background:{NAVY};padding:14px 20px;white-space:nowrap;border:1px solid {GOLD}}}.map-attribution{{position:absolute;left:108px;top:1285px;font-family:LegacyBody,sans-serif;font-size:28px;background:rgba(26,43,76,.85);padding:5px 10px}}
.location-tag{{display:flex;align-items:center;gap:13px;font-family:LegacyBody,sans-serif;font-size:34px;line-height:1.1;margin-bottom:20px}}.location-tag svg{{width:30px;height:40px;fill:{GOLD};flex-shrink:0}}
.close-logo{{position:absolute;object-fit:contain;background:{CREAM}}}.close-copy{{position:absolute;left:108px;width:864px;text-align:center;font-family:LegacyDisplay,sans-serif;font-size:102px;line-height:.99;text-shadow:0 3px 13px rgba(0,0,0,.7)}}.close-action{{font-family:LegacyBody,sans-serif;font-size:34px;line-height:1.2;margin-top:25px}}.close-arrow{{width:34px;height:48px;margin:20px auto 0;color:{GOLD}}}.close-arrow svg{{width:100%;height:100%;stroke:currentColor;stroke-width:4;fill:none}}
'''

def title_lines(sid,text):
    chunks=[];j=0
    for li,line in enumerate(text.split('\n')):
        spans=[]
        for word in line.split():
            spans.append(f'<span id="{sid}-hw{j}" class="hw">{esc(word)}</span>');j+=1
        chunks.append(f'<span class="line {"accent" if li%2 else ""}">{" ".join(spans)}</span>')
    return ''.join(chunks)

def hero_html(row,config):
    sid=row['id'];kind=row['kind'];dur=row['duration'];top=row.get('hero_top',208)
    opening=float(config.get('price',{}).get('end',4.0))
    if kind=='cta':
        width=float(config.get('logo_width',680));height=float(config['_logo_ratio'])*width
        y=float(row.get('logo_top',180));copy_y=max(float(row.get('cta_top',600)),y+height+30)
        return f'''<img id="{sid}-logo" class="close-logo clip" data-start=".04" data-duration="{fmt(dur-.04)}" data-track-index="5" src="assets/brand/legacy-logo{config['_logo_suffix']}" style="left:{fmt((1080-width)/2)}px;top:{fmt(y)}px;width:{fmt(width)}px;height:{fmt(height)}px" alt="Legacy Capital">
<div id="{sid}-close" class="close-copy clip" data-start=".04" data-duration="{fmt(dur-.04)}" data-track-index="6" style="top:{fmt(copy_y)}px;font-size:88px"><div id="{sid}-close-inner">MÁS <span class="accent">INFORMACIÓN</span><div class="close-action" style="font-size:31px;margin-top:20px">Haz clic en el botón de abajo</div><div id="{sid}-arrow" class="close-arrow"><svg viewBox="0 0 34 50"><path d="M17 2v40M4 30l13 13 13-13"/></svg></div></div></div>'''
    if row['start']<opening:return ''
    body=''
    if kind in ('pay0','pay1','pay2'):
        compact=row.get('compact_pay',True);number_size=180 if compact else 210;label_size=48 if compact else 56
        amount='80%' if kind=='pay2' else '10%'
        label={'pay0':'DE ENGANCHE','pay1':'TOTAL EN 20<br>MENSUALIDADES','pay2':'CONTRA ENTREGA'}[kind]
        active=int(kind[-1]);stages=''.join(f'<span id="{sid}-stage{j}" class="stage {"active" if active==j else ""}"></span>' for j in range(3))
        body=f'<span class="number-window"><span id="{sid}-number-wrap" class="number-wrap"><span class="number" style="font-size:{number_size}px">{amount}</span></span></span><div class="number-label" style="font-size:{label_size}px">{label}</div><div id="{sid}-stages" class="stages">{stages}</div>'
    elif kind=='bonus':
        body='<span class="eyebrow">AHORRA HASTA</span><span class="number-window"><span id="'+sid+'-number-wrap" class="number-wrap"><span class="number" style="font-size:188px">$450 MIL</span></span></span><div class="number-label">EN EQUIPAMIENTO</div><span class="support">APARTA ESTE MES</span>'
    elif kind=='delivery':
        body='<span class="eyebrow">ENTREGA A MEDIADOS DE</span><span class="number-window"><span id="'+sid+'-number-wrap" class="number-wrap"><span class="number">2028</span></span></span>'
    else:
        text=row.get('headline','')
        if not text:return ''
        size=font_size(text,840,int(row.get('headline_size',108)),config['_fonts']['display'],floor=56)
        prefix=''
        if kind=='location':prefix=f'<div class="location-tag"><svg viewBox="0 0 40 54"><path d="M20 1C9 1 2 9 2 20c0 14 18 32 18 32s18-18 18-32C38 9 31 1 20 1zm0 12a7 7 0 1 1 0 14 7 7 0 0 1 0-14z"/></svg>{esc(row.get("location_label","EL SAUZAL"))}</div>'
        body=prefix+f'<div id="{sid}-headline" class="headline" style="font-size:{size}px">{title_lines(sid,text)}</div><span id="{sid}-rule" class="rule"></span>'
        if row.get('support'):body+=f'<span id="{sid}-support" class="support">{esc(row["support"])}</span>'
        if kind=='smart':
            labels=row.get('smart_labels',['LUCES','MINISPLIT','CERRADURA'])
            body+='<div class="smart-controls">'+''.join(f'<div id="{sid}-chip{j}" class="smart-chip">{esc(label)}<span id="{sid}-switch{j}" class="switch"><span id="{sid}-knob{j}" class="knob"></span></span></div>' for j,label in enumerate(labels))+'</div>'
        if kind=='growth':
            body+=f'<svg id="{sid}-growth" viewBox="0 0 840 260" style="display:block;width:840px;height:260px;margin-top:45px;overflow:visible" aria-label="Potencial ilustrativo, sin escala de rendimiento"><path d="M20 230H820" fill="none" stroke="rgba(245,240,230,.4)" stroke-width="3"/><path id="{sid}-growth-line" d="M25 215C190 206 220 172 340 156S550 117 630 78S730 51 800 22" fill="none" stroke="{GOLD}" stroke-width="9" stroke-linecap="round" pathLength="1"/><circle id="{sid}-growth-point" cx="800" cy="22" r="13" fill="{CREAM}" stroke="{GOLD}" stroke-width="5"/></svg>'
    return f'<div id="{sid}-hero" class="hero clip" data-start="0" data-duration="{fmt(dur)}" data-track-index="5" style="top:{fmt(top)}px"><div id="{sid}-hero-inner" class="hero-inner">{body}</div></div>'

def map_html(row):
    if row['kind'] not in ('map','location') or not row.get('pin'):return ''
    sid=row['id'];pin=row['pin'];x,y=pin if isinstance(pin,list) else (pin['x'],pin['y'])
    label=row.get('pin_label','EL SAUZAL')
    return f'''<div id="{sid}-pin" class="location-pin" style="left:{fmt(x-35)}px;top:{fmt(y-90)}px"><svg viewBox="0 0 70 90"><path d="M35 3C17 3 4 17 4 34c0 24 31 52 31 52s31-28 31-52C66 17 53 3 35 3z"/><circle cx="35" cy="33" r="10" fill="{CREAM}"/></svg></div><div id="{sid}-pin-label" class="pin-label" style="left:{fmt(row.get('pin_label_x',max(108,min(x+45,700))))}px;top:{fmt(row.get('pin_label_y',y-60))}px">{esc(label)}</div>'''+(f'<div class="map-attribution">{esc(row["map_attribution"])}</div>' if row.get('map_attribution') else '')

def scene(row,index,config):
    sid=row['id'];dur=row['duration'];entry=row['entry_duration'];mode=index%4
    hero=hero_html(row,config);m=map_html(row)
    css=base_css()
    if row['kind']=='cta':css+='.readability{background:linear-gradient(180deg,rgba(26,43,76,.84),rgba(26,43,76,.72) 45%,transparent 58%,rgba(26,43,76,.20))}'
    camera=[]
    if row.get('camera')=='locked' or row['kind']=='map':
        camera.append(f"tl.set('#{sid}-camera',{{scale:1,x:0,y:0}},0);")
    else:
        dx=((-1)**index)*22;dy=12 if index%2 else -12
        pushing=row.get('motion')=='push-in'
        start_scale,end_scale=(1.015,1.065) if pushing else (1.045,1.045)
        camera.append(f"tl.fromTo('#{sid}-camera',{{scale:{start_scale},x:{-dx},y:{-dy}}},{{scale:{end_scale},x:{dx},y:{dy},duration:{fmt(max(.1,dur-.38))},ease:'power1.inOut'}},0);")
        if row['has_next']:camera.append(f"tl.to('#{sid}-camera',{{x:{dx+(-52 if index%2 else 52)},scale:1.065,duration:.38,ease:'power3.in'}},{fmt(max(.01,dur-.38))});")
    motion=camera
    if entry:
        if mode in (0,1):
            start='inset(0 100% 0 0)' if mode==0 else 'inset(0 0 0 100%)'
            motion.append(f"tl.fromTo('#{sid}-window',{{clipPath:'{start}'}},{{clipPath:'inset(0 0 0 0)',duration:{fmt(entry)},ease:'power4.inOut'}},0);")
        elif mode==2:motion.append(f"tl.fromTo('#{sid}-window',{{clipPath:'inset(100% 0 0 0)'}},{{clipPath:'inset(0 0 0 0)',duration:{fmt(entry)},ease:'power3.inOut'}},0);")
        else:motion.append(f"tl.fromTo('#{sid}-window',{{scale:1.10}},{{scale:1,duration:{fmt(entry)},ease:'power4.out'}},0);")
    kind=row['kind'];n=max(.02,row['number_at']-row['start'])
    if kind in ('pay0','pay1','pay2','bonus','delivery') and hero:
        motion.append(f"tl.fromTo('#{sid}-number-wrap',{{yPercent:108,opacity:.35}},{{yPercent:0,opacity:1,duration:.25,ease:'expo.out'}},{fmt(n)});")
        if kind.startswith('pay'):
            for j in range(3):motion.append(f"tl.fromTo('#{sid}-stage{j}',{{scaleX:0}},{{scaleX:1,duration:.34,ease:'power4.out'}},{fmt(n+.13+j*.045)});")
    elif kind=='cta':
        motion += [f"tl.fromTo('#{sid}-logo',{{opacity:0,y:15}},{{opacity:1,y:0,duration:.38,ease:'power4.out'}},.04);",
                   f"tl.fromTo('#{sid}-close-inner',{{opacity:0,y:25}},{{opacity:1,y:0,duration:.42,ease:'power4.out'}},.16);",
                   f"tl.fromTo('#{sid}-arrow',{{y:-8,opacity:0}},{{y:0,opacity:1,duration:.32,ease:'power3.out'}},.46);"]
    elif hero:
        words=len(row.get('headline','').split())
        if mode in (0,2):motion.append(f"tl.fromTo('#{sid}-headline .hw',{{clipPath:'inset(0 100% 0 0)'}},{{clipPath:'inset(0 0 0 0)',duration:.30,stagger:.055,ease:'power3.out'}},.10);")
        else:motion.append(f"tl.fromTo('#{sid}-headline .hw',{{yPercent:105}},{{yPercent:0,duration:.34,stagger:.055,ease:'power4.out'}},.10);")
        motion.append(f"tl.fromTo('#{sid}-rule',{{scaleX:0}},{{scaleX:1,duration:.30,ease:'power4.out'}},.18);")
        if row.get('support'):motion.append(f"tl.fromTo('#{sid}-support',{{opacity:0}},{{opacity:1,duration:.28,ease:'power1.out'}},.35);")
        if kind=='smart':
            for j,_ in enumerate(row.get('smart_labels',['LUCES','MINISPLIT','CERRADURA'])):
                t=min(.45+j*.30,max(.12,dur-.45))
                motion += [f"tl.fromTo('#{sid}-chip{j}',{{opacity:0,y:12}},{{opacity:1,y:0,duration:.25,ease:'power3.out'}},{fmt(t-.15)});",
                           f"tl.to('#{sid}-switch{j}',{{backgroundColor:'{GOLD}',duration:.16,ease:'none'}},{fmt(t)});",
                           f"tl.to('#{sid}-knob{j}',{{x:27,duration:.22,ease:'power3.out'}},{fmt(t)});"]
        if kind=='growth':
            motion += [f"tl.fromTo('#{sid}-growth-line',{{strokeDasharray:1,strokeDashoffset:1}},{{strokeDashoffset:0,duration:.9,ease:'power2.inOut'}},.24);",f"tl.fromTo('#{sid}-growth-point',{{scale:0,opacity:0,transformOrigin:'50% 50%'}},{{scale:1,opacity:1,duration:.2,ease:'power3.out'}},1.0);"]
    if m:
        motion += [f"tl.fromTo('#{sid}-pin',{{scale:.05,y:-28,opacity:0}},{{scale:1,y:0,opacity:1,duration:.48,ease:'back.out(1.15)'}},.10);",
                   f"tl.fromTo('#{sid}-pin-label',{{opacity:0,x:12}},{{opacity:1,x:0,duration:.28,ease:'power3.out'}},.40);"]
    motion += [f'tl.set({{}},{{}},{fmt(dur)});',f'window.__timelines=window.__timelines||{{}};window.__timelines[{js(sid)}]=tl;']
    return f'''<template><style>{css}</style><div id="root" data-composition-id="{sid}" data-duration="{fmt(dur)}" data-width="1080" data-height="1920" data-fps="24" data-composition-variables='{esc(js([{'id':'visual','type':'string','label':'Imagen','default':row['local']}]))}'><div id="{sid}-window" class="window"><div id="{sid}-camera" class="camera" data-layout-ignore><img id="{sid}-photo" class="photo clip" data-start="0" data-duration="{fmt(dur)}" data-track-index="0" src="{row['local']}" data-var-src="visual" style="object-position:{esc(row['focus'])}" alt="Escena residencial"></div><div class="readability" data-layout-ignore></div>{hero}{m}</div></div><script>const tl=gsap.timeline({{paused:true}});\n{chr(10).join(motion)}</script></template>'''

def opening(config):
    end=float(config.get('price',{}).get('end',4.0));price=config.get('price',{}).get('range','$3.9–$4.9 MDP')
    return f'''<template><style>{base_css()}.opening{{position:absolute;left:108px;top:194px;width:864px;text-shadow:0 3px 12px rgba(0,0,0,.75)}}.opening-role{{font-family:LegacyDisplay,sans-serif;font-size:72px;line-height:1.04}}.opening-price{{font-family:LegacyDisplay,sans-serif;font-size:96px;line-height:1.03;color:#E2C98F;margin-top:16px}}.opening-meta{{font-family:LegacyBody,sans-serif;font-size:33px;line-height:1.22;margin-top:12px}}.opening-rule{{width:160px;height:7px;background:{GOLD};margin-top:16px;transform-origin:left center}}</style><div id="root" data-composition-id="legacy-opening" data-duration="{fmt(end)}" data-width="1080" data-height="1920" data-fps="24"><div id="opening-copy" class="opening clip" data-start="0" data-duration="{fmt(end)}" data-track-index="0"><div id="opening-inner"><div class="opening-role">DOCTOR · VISTA AL MAR</div><div class="opening-price">{esc(price)}</div><div class="opening-meta">2 Y 3 RECÁMARAS · MXN</div><div id="opening-rule" class="opening-rule"></div></div></div></div><script>const tl=gsap.timeline({{paused:true}});tl.fromTo('#opening-rule',{{scaleX:.18}},{{scaleX:1,duration:.42,ease:'power3.out'}},.08);tl.fromTo('#opening-inner',{{y:7}},{{y:0,duration:.30,ease:'power4.out'}},0);tl.to('#opening-inner',{{opacity:0,y:-12,duration:.15,ease:'power2.in'}},{fmt(end-.15)});tl.set({{}},{{}},{fmt(end)});window.__timelines=window.__timelines||{{}};window.__timelines['legacy-opening']=tl;</script></template>'''

def captions_html(groups,duration,config,rows):
    markup_by_shot={r['id']:[] for r in rows};motion=[]
    for g in groups:
        sid=g['id'];size=font_size(g['text'],820,68,config['_fonts']['bold'],floor=47)
        spans=' '.join(f'<span id="{sid}-w{j}" class="cw">{esc(w["text"])}</span>' for j,w in enumerate(g['words']))
        markup_by_shot[g['shot_id']].append(f'<div id="{sid}" class="caption clip" data-start="{fmt(g["start"])}" data-duration="{fmt(g["end"]-g["start"])}" data-track-index="0" style="top:{fmt(g["top"])}px;font-size:{size}px"><div id="{sid}-body" class="caption-body">{spans}</div></div>')
        entrance=min(.07,max(.012,(g['end']-g['start'])*.5))
        motion.append(f"tl.fromTo('#{sid}-body',{{opacity:0,y:6}},{{opacity:1,y:0,duration:{fmt(entrance)},ease:'power3.out'}},{fmt(g['start'])});")
        for j,w in enumerate(g['words']):
            pulse=max(.025,min(.09,w['end']-w['start']-.012))
            motion += [f"tl.set('#{sid}-w{j}',{{color:'{GOLD}'}},{fmt(w['start'])});",
                       f"tl.fromTo('#{sid}-w{j}',{{scale:1}},{{scale:1.055,duration:{fmt(pulse)},ease:'power3.out'}},{fmt(w['start'])});",
                       f"tl.set('#{sid}-w{j}',{{color:'{CREAM}',scale:1}},{fmt(w['end'])});"]
        motion.append(f"tl.set('#{sid}-body',{{opacity:0}},{fmt(g['end'])});")
    wrappers=[]
    for index,row in enumerate(rows):
        wrapper=f'caption-scene-{index:02d}'
        wrappers.append(f'<div id="{wrapper}" class="caption-scene">'+''.join(markup_by_shot[row['id']])+'</div>')
        entry=row['entry_duration'];mode=index%4
        if entry and mode in (0,1,2):
            start={0:'inset(0 100% 0 0)',1:'inset(0 0 0 100%)',2:'inset(100% 0 0 0)'}[mode]
            ease='power4.inOut' if mode in (0,1) else 'power3.inOut'
            motion.append(f"tl.fromTo('#{wrapper}',{{clipPath:'{start}'}},{{clipPath:'inset(0 0 0 0)',duration:{fmt(entry)},ease:'{ease}'}},{fmt(row['start'])});")
    return f'''<template><style>{base_css()}.caption-scene{{position:absolute;inset:0;overflow:hidden;pointer-events:none}}.caption{{position:absolute;left:108px;width:864px;text-align:center;line-height:1.13;font-family:LegacyBold,sans-serif;font-weight:800;text-shadow:0 3px 4px rgba(0,0,0,.9),0 0 12px rgba(0,0,0,.75);overflow:visible}}.caption-body{{display:inline-block;overflow:visible;background:rgba(15,29,49,.74);padding:4px 12px;border-radius:9px;box-shadow:0 2px 14px rgba(0,0,0,.2)}}.cw{{display:inline-block;transform-origin:50% 65%}}</style><div id="root" data-composition-id="legacy-captions" data-duration="{fmt(duration)}" data-width="1080" data-height="1920" data-fps="24">{''.join(wrappers)}</div><script>const tl=gsap.timeline({{paused:true}});{chr(10).join(motion)}tl.set({{}},{{}},{fmt(duration)});window.__timelines=window.__timelines||{{}};window.__timelines['legacy-captions']=tl;</script></template>'''

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--config',default=str(ROOT/'project.json'));parser.add_argument('--plan',action='store_true');parser.add_argument('--draft',action='store_true');args=parser.parse_args()
    config=read(args.config);words,duration=load_words(config);rows=load_shots(config,words,duration);caps=caption_groups(words,rows,duration)
    causes={'pay0':'payment_number','pay1':'payment_number','pay2':'payment_number','bonus':'bonus_number','delivery':'delivery_number','smart':'smart_control','cta':'cta','location':'location_title','map':'location_title','hook':'role_and_price'}
    timeline={'version':'V6-Legacy-Capital','duration':duration,'fps':FPS,'frames':round(duration*FPS),'shots':rows,
              'cues':[{'shot_id':r['id'],'kind':r['kind'],'time':r['sfx_at'],'cause':causes.get(r['kind'],'title_entry' if r.get('headline') else 'broll_transition')} for r in rows],
              'captions':caps,'price_interval':[0,float(config.get('price',{}).get('end',4))]}
    write(ROOT/'timeline.json',json.dumps(timeline,ensure_ascii=False,indent=2)+'\n')
    if args.plan:print(js({'planned':True,'duration':duration,'frames':round(duration*FPS),'shots':len(rows),'max_exposure':max(r['duration'] for r in rows),'timeline':str(ROOT/'timeline.json')}));return
    missing=[]
    for r in rows:
        r['path']=str(resolve(r['path']))
        if not Path(r['path']).is_file():missing.append(r['path'])
    logo=resolve(config['brand']['logo_path']);mix=resolve(config['audio']['mix_path']);voice=resolve(config['audio'].get('voice_path',config['audio']['mix_path']))
    for p in (logo,mix):
        if not p.is_file():missing.append(str(p))
    if missing and not args.draft:raise FileNotFoundError('Strict Legacy build missing: '+', '.join(missing))
    fallback=next((Path(r['path']) for r in rows if Path(r['path']).is_file()),None)
    if missing and not fallback:raise FileNotFoundError('Draft also needs one real reference image')
    assert logo.is_file(),'Original Legacy Capital logo required even for draft'
    with Image.open(logo) as im:config['_logo_ratio']=im.height/im.width
    config['_logo_suffix']=logo.suffix.lower();config['_fonts']={k:resolve(config.get('fonts',{}).get(k,v)) for k,v in FONT_DEFAULT.items()}
    for name,path in config['_fonts'].items():local_link(path,OUT/f'assets/fonts/{name}.ttf')
    local_link(WORK/'v5/salud/assets/gsap.min.js',OUT/'assets/gsap.min.js')
    local_link(logo,OUT/f"assets/brand/legacy-logo{logo.suffix.lower()}")
    audio_source=mix if mix.is_file() else voice
    assert audio_source.is_file(),'Voice or final mix required'
    local_link(audio_source,OUT/'assets/audio/master_mix.wav')
    hashes=[]
    for i,r in enumerate(rows):
        source=Path(r['path'])
        if not source.is_file():source=fallback;r['draft_placeholder']=True
        r['sha256']=sha(source);hashes.append(r['sha256']);r['local']=f'assets/photos/{i+1:02d}-{r["id"]}{source.suffix.lower()}'
        local_link(source,OUT/r['local'])
        with Image.open(source) as im:r['dimensions']=[im.width,im.height]
    if not args.draft:assert len(hashes)==len(set(hashes)),'Repeated photo in the delivered Doctor series'
    for i,r in enumerate(rows):write(OUT/'compositions'/f'{r["id"]}.html',scene(r,i,config))
    write(OUT/'compositions/legacy-opening.html',opening(config));write(OUT/'compositions/legacy-captions.html',captions_html(caps,duration,config,rows))
    hosts=[]
    for i,r in enumerate(rows):hosts.append(f'<div id="{r["id"]}" class="clip" data-composition-id="{r["id"]}" data-composition-src="compositions/{r["id"]}.html" data-start="{fmt(r["start"])}" data-duration="{fmt(r["duration"])}" data-track-index="{i%2}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:{i+1}"></div>')
    opening_end=float(config.get('price',{}).get('end',4))
    hosts += [f'<div id="legacy-opening" class="clip" data-composition-id="legacy-opening" data-composition-src="compositions/legacy-opening.html" data-start="0" data-duration="{fmt(opening_end)}" data-track-index="3" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:80"></div>',f'<div id="legacy-captions" class="clip" data-composition-id="legacy-captions" data-composition-src="compositions/legacy-captions.html" data-start="0" data-duration="{fmt(duration)}" data-track-index="4" data-track-kind="captions" data-width="1080" data-height="1920" style="z-index:90"></div>',f'<audio id="legacy-master-mix" class="clip" data-start="0" data-duration="{fmt(duration)}" data-track-index="5" data-volume="1" src="assets/audio/master_mix.wav"></audio>']
    index=f'''<!doctype html><html lang="es" data-resolution="portrait"><head><meta charset="utf-8"><meta name="viewport" content="width=1080,height=1920"><title>Legacy Capital · Doctor V6</title><script src="assets/gsap.min.js"></script><style>*{{box-sizing:border-box;margin:0}}html,body{{width:1080px;height:1920px;overflow:hidden;background:{NAVY}}}#root{{position:absolute;inset:0}}</style></head><body><div id="root" data-composition-id="legacy-doctor-v6" data-start="0" data-duration="{fmt(duration)}" data-width="1080" data-height="1920" data-fps="24">{chr(10).join(hosts)}</div><script>window.__timelines=window.__timelines||{{}};window.__timelines['legacy-doctor-v6']=gsap.timeline({{paused:true}});</script></body></html>'''
    write(OUT/'index.html',index)
    for f in (OUT/'compositions').glob('*.html'):safe_copy(f.read_text())
    meta={'version':'V6-Legacy-Capital','brand':'Legacy Capital','draft':bool(missing) or audio_source!=mix,
          'duration':duration,'fps':FPS,'dimensions':[1080,1920],'frames':round(duration*FPS),
          'palette':{'navy':NAVY,'gold':GOLD,'cream':CREAM},'shots':rows,'captions':caps,'words':words,
          'price':{'range':'$3.9–$4.9 MDP','bedrooms':[2,3],'currency':'MXN','visible':[0,opening_end]},
          'payments':{'deposit':10,'monthly_total':10,'months':20,'delivery':80,'delivery_date':'mid-2028'},
          'bonus':{'up_to_MXN':450000,'condition':'reserve_this_month'},'audio_source':str(audio_source),
          'audio_sha256':sha(audio_source),'logo_source':str(logo),'logo_sha256':sha(logo),
          'cta_alignment':'center_x540','previous_versions_modified':False,'aesthetic_approval':'pending_user_review',
          'missing':missing,'timeline':str(ROOT/'timeline.json')}
    write(OUT/'metadata.json',json.dumps(meta,ensure_ascii=False,indent=2)+'\n')
    write(OUT/'hyperframes.json',json.dumps({'$schema':'https://hyperframes.heygen.com/schema/hyperframes.json','registry':'https://raw.githubusercontent.com/heygen-com/hyperframes/main/registry','paths':{'blocks':'compositions','components':'compositions/components','assets':'assets'},'media':{'autoProxy':True}},indent=2)+'\n')
    write(OUT/'package.json',json.dumps({'name':'legacy-capital-doctor-v6','private':True,'type':'module','devDependencies':{'hyperframes':'0.9.18'},'scripts':{'dev':'hyperframes preview','check':'hyperframes check --json','render':'hyperframes render --fps 24 --quality delivery --workers 1 --crf 19 -o ../final/Doctor_Legacy_Capital_V6.mp4'}},indent=2)+'\n')
    write(OUT/'SPEC.md',f'''# Legacy Capital · Doctor V6\n\n{duration:.3f}s,1080×1920,24fps,{round(duration*FPS)}frames. {len(rows)}fondos distintos,exposición máxima{max(r['duration'] for r in rows):.3f}s incluidos overlaps. Voz continua sin retiming.\nSólo navy{NAVY},gold{GOLD},cream{CREAM} en gráficas. Logo original proporcionado,centrado en cierre. Precio0–{opening_end}s. Condiciones nuevas20mensualidades/entrega mediados2028/ahorro hasta450mil.\nBANNED: marca histórica visible,audio viejo,HiggsfieldV6,diapositivas,paneles fijos,texto sobre ojos/manos,foto repetida,stretch de locución,datos comerciales antiguos.\nMecanismos: cámaras direccionales/máscaras B-roll; palabras cinéticas; porcentajes por ventana; pin sobre mapa verificable; toggles conceptuales smart-home. Sonido sigue cues absolutos de timeline.json.\n''')
    if not (OUT/'REVIEW.md').exists():write(OUT/'REVIEW.md','# Legacy Capital V6 · revisión pendiente\n\nEjecutar check, snapshots de cortes/apertura/cifras/CTA y preview antes de render. La exportación final debe verificarse por codec,duración,audio y fotogramas codificados.\n')
    write(ROOT/'build-report.json',json.dumps({'draft':meta['draft'],'duration':duration,'frames':meta['frames'],'shots':len(rows),'captions':len(caps),'distinct_images':len(set(hashes)),'max_exposure':max(r['duration'] for r in rows),'missing':missing},ensure_ascii=False,indent=2)+'\n')
    print(js({'built':str(OUT),'draft':meta['draft'],'duration':duration,'shots':len(rows),'captions':len(caps),'max_exposure':max(r['duration'] for r in rows)}))

if __name__=='__main__':main()
