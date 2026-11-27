"""Deterministic, editable vertical data scenes for Doctor V7.

Public API: graphic_scene(row, config) -> HyperFrames scene template.
Kinds: services, connectivity, bridge0, bridge1, bridge2, appreciation.
All readable content stays above y=1135; the parent owns captions below it.
"""
from __future__ import annotations
import html,json,math,re

NAVY='#1A2B4C'; GOLD='#C5A564'; CREAM='#F5F0E6'; INK='#112D47'

def esc(value):return html.escape(str(value),quote=True)
def fmt(value):return f'{float(value):.6f}'.rstrip('0').rstrip('.') or '0'
def uid(row):
    value=str(row['id'])
    if not re.fullmatch(r'[A-Za-z][A-Za-z0-9_-]*',value):raise ValueError('Scene id must be an HTML-safe identifier')
    return value

def css():return '''
@font-face{font-family:LegacyDisplay;src:url('assets/fonts/display.ttf');font-weight:700}
@font-face{font-family:LegacyBody;src:url('assets/fonts/body.ttf');font-weight:600}
@font-face{font-family:LegacyBold;src:url('assets/fonts/bold.ttf');font-weight:800}
*{box-sizing:border-box;margin:0}#root{position:absolute;inset:0;overflow:hidden;background:#F5F0E6;color:#1A2B4C;font-family:LegacyBody,Arial,sans-serif}
.paper{position:absolute;inset:0}.top-rule{position:absolute;left:108px;top:170px;width:104px;height:6px;background:#C5A564;transform-origin:left center}.eyebrow{position:absolute;left:108px;top:197px;font-family:LegacyBody;font-size:31px;letter-spacing:2px;color:#74613E}.headline{position:absolute;left:108px;top:246px;width:864px;font-family:LegacyDisplay;font-size:88px;line-height:.99;letter-spacing:-.3px}.headline span{display:block}.headline .gold{color:#95722E}.label{font-family:LegacyBody;font-size:34px}.content{position:absolute;inset:0}.bottom-field{position:absolute;left:-120px;right:-120px;top:1450px;height:600px;background:#1A2B4C;border-top:7px solid #C5A564;border-radius:50% 50% 0 0/55px 55px 0 0}.bottom-lines{position:absolute;left:108px;right:108px;top:1565px;height:2px;background:#C5A564;opacity:.45}.bottom-note{position:absolute;left:108px;top:1620px;width:864px;text-align:center;font-family:LegacyDisplay;font-size:50px;letter-spacing:2px;color:#F5F0E6}.subtle{color:#68758A}.nowrap{white-space:nowrap}.source-note{position:absolute;left:108px;top:1100px;width:864px;font-family:LegacyBody;font-size:30px;line-height:1.2;color:#68758A;text-align:center}.map-frame{position:absolute;left:108px;top:445px;width:864px;height:520px;border:2px solid #D6C79F;border-radius:27px;overflow:hidden;background:#F5F0E6;transform-origin:50% 50%}.map-source{display:block;width:100%;height:100%;object-fit:contain}.map-tag{position:absolute;left:108px;top:407px;font-family:LegacyBold;font-size:29px;background:#1A2B4C;color:#F5F0E6;border-radius:9px;padding:8px 16px;z-index:2}.map-cards{position:absolute;left:108px;top:986px;width:864px;display:flex;gap:18px}.map-card{width:423px;padding:13px 19px 15px;border-radius:17px;background:#1A2B4C;color:#F5F0E6;min-height:98px}.map-card b{display:block;font-family:LegacyBold;font-size:29px;line-height:1.18}.map-card strong{display:block;font-family:LegacyDisplay;font-size:53px;color:#DFC789;line-height:1.03;margin-top:3px}.bridge-kicker{position:absolute;left:108px;top:438px;font-family:LegacyBody;font-size:36px;color:#68758A}.bridge-art{position:absolute;left:108px;top:507px;width:864px;height:425px;overflow:visible}.cash-window{position:absolute;left:108px;top:968px;width:864px;height:112px;background:#E7EAF0;border-left:9px solid #C5A564;border-radius:13px;padding:17px 22px;overflow:hidden}.cash-inner{display:block}.cash-caption{display:block;font-size:28px;color:#68758A;line-height:1.1}.cash-value{display:block;font-family:LegacyBold;font-size:42px;line-height:1.18;margin-top:6px;letter-spacing:-1px}.stage-mark{position:absolute;right:108px;top:201px;display:flex;gap:9px}.stage-dot{width:35px;height:6px;background:#C5A564;opacity:.24}.stage-dot.on{opacity:1}.chart-art{position:absolute;left:108px;top:475px;width:864px;height:430px;overflow:visible}.scenario-cards{position:absolute;left:108px;top:933px;width:864px;display:flex;gap:20px}.scenario-card{width:422px;height:154px;border:2px solid #C5A564;border-radius:17px;padding:12px 18px;background:#F5F0E6}.scenario-card.navy{border-color:#1A2B4C;background:#1A2B4C;color:#F5F0E6}.scenario-label{font-family:LegacyBold;font-size:24px;line-height:1.15;letter-spacing:.2px}.scenario-card strong{display:block;font-family:LegacyDisplay;font-size:52px;line-height:1;margin-top:7px}.scenario-card .annual{font-family:LegacyBody;font-size:30px;margin-left:4px}.scenario-card .valuation{font-family:LegacyBody;font-size:27px;margin-top:3px}.scenario-card.gold strong{color:#987333}.scenario-card.navy strong{color:#E0CB9A}
'''

def shell(row,body,motion):
    sid=uid(row);dur=float(row['duration']);entry=min(float(row.get('entry_duration',0)),.28)
    opening=f"tl.fromTo('#{sid}-main',{{y:10,opacity:.2}},{{y:0,opacity:1,duration:.18,ease:'power3.out'}},0);"
    if entry:
        opening=f"tl.fromTo('#{sid}-paper',{{clipPath:'inset(0 0 100% 0)'}},{{clipPath:'inset(0 0 0 0)',duration:{fmt(entry)},ease:'power3.inOut'}},0);"+opening
    # Footer is a brand signature; the foreground has no logo/large persistent panel.
    footer=f'<div class="bottom-field" data-layout-ignore></div><div class="bottom-lines" data-layout-ignore></div>'
    return f'''<template><style>{css()}</style><div id="root" data-composition-id="{sid}" data-duration="{fmt(dur)}" data-width="1080" data-height="1920" data-fps="24"><div id="{sid}-paper" class="paper"><div id="{sid}-content" class="content clip" data-start="0" data-duration="{fmt(dur)}" data-track-index="0"><div id="{sid}-main" class="content"><div id="{sid}-top-rule" class="top-rule"></div>{body}{footer}</div></div></div></div><script>const tl=gsap.timeline({{paused:true}});{opening}tl.fromTo('#{sid}-top-rule',{{scaleX:.2}},{{scaleX:1,duration:.38,ease:'power3.out'}},.05);{motion}tl.set({{}},{{}},{fmt(dur)});window.__timelines=window.__timelines||{{}};window.__timelines[{json.dumps(sid)}]=tl;</script></template>'''

def map_scene(row):
    sid=uid(row);dur=float(row['duration']);service=row['kind']=='services'
    title='CERCA DE<br>TU VIDA DIARIA' if service else 'EL SAUZAL.<br>BIEN CONECTADO.'
    title=title.replace('<br>','</span><span>')
    metrics=[('HOSPITALES','~7 min'),('SORiANA'.upper(),'~3 min')] if service else [('VALLE DE GUADALUPE','~30 min'),('TIJUANA','~1 h 10 min')]
    name='services' if service else 'connectivity'
    img=row.get('map_asset',f'assets/maps/{name}.jpg')
    cards=''.join(f'<div id="{sid}-card{i}" class="map-card"><b>{esc(label)}</b><strong>{esc(value)}</strong></div>' for i,(label,value) in enumerate(metrics))
    body=f'<div class="eyebrow">UBICACIÓN · ENSENADA</div><h1 class="headline"><span>{title}</span></h1><div class="map-tag">DESDE EL PROYECTO</div><div id="{sid}-map" class="map-frame"><img id="{sid}-map-source" class="map-source clip" data-start="0" data-duration="{fmt(dur)}" data-track-index="1" src="{esc(img)}" alt="Mapa del proyecto aportado como referencia"></div><div class="map-cards">{cards}</div><div class="source-note">Tiempos aproximados · sujetos a ruta y tráfico</div>'
    motion=f"tl.fromTo('#{sid}-map',{{scale:1.035,y:14}},{{scale:1,y:0,duration:{fmt(max(.6,dur-.2))},ease:'power2.out'}},.08);"
    for i in range(2):motion+=f"tl.fromTo('#{sid}-card{i}',{{x:{-30 if i==0 else 30},opacity:0}},{{x:0,opacity:1,duration:.32,ease:'power3.out'}},{fmt(.36+i*.16)});"
    return shell(row,body,motion)

def bridge_scene(row):
    sid=uid(row);phase=int(row['kind'][-1]);dur=float(row['duration'])
    titles=[('10% AL INICIO.','CUIDA TU LIQUIDEZ.'),('OTRO 10%.','EN 20 MENSUALIDADES.'),('80% FINAL.','CONTRA ENTREGA.')]
    large,subtitle=titles[phase]
    cash=[('Enganche · rango MXN','$398,278–$489,048'),('Mensualidades aproximadas · MXN','$19,914–$24,452 / mes'),('Pago final aproximado · MXN','$3.19–$3.91 MDP')][phase]
    top='HOY' if phase==0 else ('DURANTE CONSTRUCCIÓN' if phase==1 else 'MEDIADOS DE 2028')
    dots=''.join(f'<i class="stage-dot {"on" if i<=phase else ""}"></i>' for i in range(3))
    left_op=1;right_op=1;center_op=1
    hangers=''.join(f'<path id="{sid}-hanger{i}" d="M{x} {y}V335" fill="none" stroke="{GOLD}" stroke-width="4"/>' for i,(x,y) in enumerate([(276,237),(330,266),(390,286),(450,291),(510,278),(570,250),(630,210),(690,158)]))
    # The shape follows the supplied payment bridge; stages/values remain independent editable nodes.
    art=f'''<svg class="bridge-art" viewBox="0 0 900 425" aria-label="Diez por ciento de enganche, diez por ciento en veinte mensualidades y ochenta por ciento a la entrega">
<path d="M52 339H846" fill="none" stroke="{INK}" stroke-width="9"/>
<g id="{sid}-left" opacity="{left_op}" style="transform-origin:150px 338px"><path d="M52 191H251V338H52Z" fill="{NAVY}"/><path d="M52 191L79 170H278L251 191Z" fill="#24617B"/><path d="M251 191L278 170V316L251 338Z" fill="#0D203A"/><text x="151" y="247" text-anchor="middle" font-family="LegacyDisplay" font-size="76" fill="{CREAM}">10%</text><text x="151" y="290" text-anchor="middle" font-family="LegacyBody" font-size="29" fill="{CREAM}">ENGANCHE</text></g>
<g id="{sid}-middle" opacity="{center_op}">{hangers}<path id="{sid}-cable" d="M253 220C390 338 565 330 729 109" pathLength="1" fill="none" stroke="{NAVY}" stroke-width="8" stroke-linecap="round"/><text x="472" y="174" text-anchor="middle" font-family="LegacyDisplay" font-size="72" fill="{NAVY}">10%</text><text x="472" y="210" text-anchor="middle" font-family="LegacyBody" font-size="27" fill="{NAVY}">DIFERIDO</text><rect x="332" y="362" width="282" height="52" rx="26" fill="{GOLD}"/><text x="473" y="399" text-anchor="middle" font-family="LegacyBold" font-size="29" fill="{NAVY}">20 MENSUALIDADES</text></g>
<g id="{sid}-right" opacity="{right_op}" style="transform-origin:784px 338px"><path d="M719 91H867V338H719Z" fill="{NAVY}"/><path d="M710 77H877V98H710ZM710 326H877V348H710Z" fill="{NAVY}"/><text x="794" y="210" text-anchor="middle" font-family="LegacyDisplay" font-size="87" fill="#E3CC95">80%</text><text x="794" y="253" text-anchor="middle" font-family="LegacyBody" font-size="27" fill="{CREAM}">ENTREGA</text></g></svg>'''
    body=f'<div class="eyebrow">PAGOS FLEXIBLES</div><div class="stage-mark">{dots}</div><h1 class="headline"><span>{large}</span><span class="gold">{subtitle}</span></h1><div class="bridge-kicker">{top}</div>{art}<div class="cash-window"><div id="{sid}-cash" class="cash-inner"><span class="cash-caption">{cash[0]}</span><strong class="cash-value">{cash[1]}</strong></div></div><div class="source-note">Rangos de la lista · 10% diferido total, no mensual</div>'
    motion=f"tl.fromTo('#{sid}-cash',{{y:12,opacity:.8}},{{y:0,opacity:1,duration:.16,ease:'power3.out'}},.04);"
    if phase==0:motion+=f"tl.fromTo('#{sid}-left',{{scaleY:.07}},{{scaleY:1,duration:.48,ease:'back.out(1.18)'}},.13);"
    elif phase==1:
        motion+=f"tl.set('#{sid}-cable',{{strokeDasharray:'1',strokeDashoffset:1}},0);tl.to('#{sid}-cable',{{strokeDashoffset:0,duration:.68,ease:'power2.inOut'}},.14);"
        for i in range(8):motion+=f"tl.fromTo('#{sid}-hanger{i}',{{opacity:0}},{{opacity:1,duration:.15}},{fmt(.24+i*.055)});"
        motion+=f"tl.fromTo('#{sid}-middle',{{y:8}},{{y:0,duration:.45,ease:'power3.out'}},.10);"
    else:motion+=f"tl.fromTo('#{sid}-right',{{scaleY:.04}},{{scaleY:1,duration:.55,ease:'back.out(1.12)'}},.12);"
    return shell(row,body,motion)

def appreciation_scene(row):
    sid=uid(row)
    # Same five-year endpoint arithmetic as the supplied chart; no delivery date is implied.
    base=4.570545;gold=[base*(1.08**i) for i in range(6)];navy=[base*(1.10**i) for i in range(6)]
    def point(i,v):return (92+i*137,358-(v-4.5)*104)
    def path(values):return 'M'+'L'.join(f'{point(i,v)[0]:.1f} {point(i,v)[1]:.1f}' for i,v in enumerate(values))
    grid=''.join(f'<path d="M92 {358-(v-4.5)*104:.1f}H810" stroke="#C6CBD1" stroke-width="2"/><text x="72" y="{369-(v-4.5)*104:.1f}" text-anchor="end" font-family="LegacyBody" font-size="28" fill="#65728A">{v:g}</text>' for v in [4.5,5.5,6.5,7.5])
    points=''.join(f'<circle id="{sid}-{name}-dot{i}" cx="{point(i,v)[0]}" cy="{point(i,v)[1]:.1f}" r="{9 if i not in (0,5) else 13}" fill="{color}" stroke="{CREAM}" stroke-width="4"/>' for name,color,values in [('gold',GOLD,gold),('navy',NAVY,navy)] for i,v in enumerate(values))
    art=f'''<svg class="chart-art" viewBox="0 0 864 430" aria-label="Ejemplo estimado a cinco años: ocho y diez por ciento anual"><g id="{sid}-grid">{grid}<text x="92" y="412" font-family="LegacyBody" font-size="33" fill="{NAVY}">HOY</text><text x="777" y="412" text-anchor="end" font-family="LegacyBody" font-size="33" fill="{NAVY}">5 AÑOS</text></g><path id="{sid}-gold-line" d="{path(gold)}" pathLength="1" stroke="{GOLD}" stroke-width="9" stroke-linejoin="round" fill="none"/><path id="{sid}-navy-line" d="{path(navy)}" pathLength="1" stroke="{NAVY}" stroke-width="9" stroke-linejoin="round" fill="none"/>{points}<g id="{sid}-base-label"><rect x="100" y="289" width="186" height="49" rx="10" fill="{NAVY}"/><text x="193" y="326" text-anchor="middle" font-family="LegacyBold" font-size="31" fill="{CREAM}">$4.57 M</text></g></svg>'''
    body=f'<div class="eyebrow">EJEMPLO A CINCO AÑOS · ESTIMADO</div><h1 class="headline"><span>PLUSVALÍA</span><span class="gold">PROYECTADA.</span></h1>{art}<div class="scenario-cards"><div id="{sid}-card-gold" class="scenario-card gold"><div class="scenario-label">CONSERVADOR</div><strong>8%<span class="annual">anual</span></strong><div class="valuation">Valor estimado $6.72 M</div></div><div id="{sid}-card-navy" class="scenario-card navy"><div class="scenario-label">OPTIMISTA</div><strong>10%<span class="annual">anual</span></strong><div class="valuation">Valor estimado $7.36 M</div></div></div><div class="source-note">Base $4,570,545 MXN · apreciación anual compuesta</div>'
    motion=f"tl.fromTo('#{sid}-grid',{{opacity:0}},{{opacity:1,duration:.22}},.05);tl.fromTo('#{sid}-base-label',{{y:14,opacity:0}},{{y:0,opacity:1,duration:.24}},.16);"
    for name,start in [('gold',.22),('navy',.37)]:
        motion+=f"tl.set('#{sid}-{name}-line',{{strokeDasharray:'1',strokeDashoffset:1}},0);tl.to('#{sid}-{name}-line',{{strokeDashoffset:0,duration:.72,ease:'power2.inOut'}},{fmt(start)});"
        for i in range(6):motion+=f"tl.fromTo('#{sid}-{name}-dot{i}',{{opacity:0}},{{opacity:1,duration:.13}},{fmt(start+i*.16)});"
    for name,start in [('gold',.12),('navy',.20)]:motion+=f"tl.fromTo('#{sid}-card-{name}',{{y:8}},{{y:0,duration:.23,ease:'power3.out'}},{fmt(start)});"
    return shell(row,body,motion)

def graphic_scene(row,config=None):
    """Return one editable HyperFrames scene; no filesystem mutation or I/O."""
    kind=row['kind']
    if kind in ('services','connectivity'):return map_scene(row)
    if kind in ('bridge0','bridge1','bridge2'):return bridge_scene(row)
    if kind=='appreciation':return appreciation_scene(row)
    raise ValueError(f'Unsupported graphic kind: {kind}')
