#!/usr/bin/env python3
"""Convierte California v1 (fotos) de HyperFrames en un proyecto editable de Legacy Studio.

  python3 california_v1_a_studio.py <media_dir> <salida.json> [--urls blobs.json]

- Lee escenas, tiempos, subtítulos y efectos directo del build.py del video (no duplica tiempos).
- Cada foto C01–C19 es una escena; el mapa, el plan de pagos y la plusvalía son escenas con capas
  (fondo + textos + tarjetas + gráfica) para que se puedan editar sin volver a HyperFrames.
- Voz, música y cada efecto van en pistas separadas; subtítulos con tiempos por palabra.
"""
import builtins, io, json, os, shutil, subprocess, sys

V = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v1-es/'
MEDIA, OUT = sys.argv[1], sys.argv[2]
URLS = json.load(open(sys.argv[sys.argv.index('--urls') + 1])) if '--urls' in sys.argv else {}
os.makedirs(MEDIA, exist_ok=True)
GOLD, NAVY, CREAM, DARK = '#FFD086', '#1A2B4C', '#F5F0E6', '#071D29'


def run_build(path):
    real = builtins.open
    def fake(f, mode='r', *a, **k):
        return io.StringIO() if 'w' in mode else real(f, mode, *a, **k)
    ns = {'__name__': 'x', 'open': fake, 'print': lambda *a, **k: None}
    exec(real(path).read(), ns)
    return ns


B = run_build(V + 'build.py')
ASSETS = {}


def media(aid, src, tipo, nombre, conv=None, **extra):
    ext = {'video': '.mp4', 'audio': '.mp4', 'image': os.path.splitext(src)[1], 'font': os.path.splitext(src)[1]}[tipo]
    dst = os.path.join(MEDIA, aid + ext)
    if aid not in URLS and not os.path.exists(dst):
        if conv == 'aac':
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vn', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', dst], check=True)
        else:
            shutil.copy(src, dst)
    a = dict(id=aid, name=nombre, type=tipo, url=URLS.get(aid, os.path.basename(dst)), **extra)
    if tipo == 'image':
        a['thumbnail'] = a['url']
    ASSETS[aid] = a
    return aid


def fondo(aid, css, nombre):
    dst = os.path.join(MEDIA, aid + '.png')
    if aid not in URLS and not os.path.exists(dst):
        html = os.path.join(MEDIA, aid + '.html')
        open(html, 'w').write(f'<html><body style="margin:0"><div style="position:relative;width:1080px;height:1920px;overflow:hidden;{css}"></div></body></html>')
        subprocess.run(['node', '-e', f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1080,height:1920}}}});await p.goto('file://{html}');await p.screenshot({{path:'{dst}'}});await b.close();}})()"""], check=True, cwd='/tmp')
        os.remove(html)
    ASSETS[aid] = dict(id=aid, name=nombre, type='image', url=URLS.get(aid, aid + '.png'), width=1080, height=1920)
    ASSETS[aid]['thumbnail'] = ASSETS[aid]['url']
    return aid


for fam, f in [('PPCondensed', 'OpenSans_Condensed_Bold.ttf'), ('PPText', 'OpenSans_Semibold.ttf'), ('PPBold', 'OpenSans_ExtraBold.ttf'), ('Cinzel', 'cinzel-latin-700-normal.woff2')]:
    media('font-' + fam, V + 'assets/fonts/' + f, 'font', 'Fuente ' + fam, family=fam)
media('crest', V + 'assets/crest.png', 'image', 'Escudo Legacy Capital', width=300, height=391)
for i in range(1, 20):
    media(f'cal-c{i:02d}', f'{V}assets/img/c{i:02d}.jpg', 'image', f'Foto C{i:02d}', width=941, height=1672)
media('cal-mapa', V + 'assets/img/mapa.png', 'image', 'Mapa de conectividad', width=690, height=560)
fondo('cal-fondo-mg', 'background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%)"><div style="position:absolute;inset:-100px;background-image:linear-gradient(rgba(255,208,134,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(255,208,134,.06) 2px,transparent 2px);background-size:90px 90px"></div><div style="display:none', 'Fondo animaciones (navy con retícula)')

STOCK = {'cinematic-whoosh-fast-1492', 'fast-small-sweep-166', 'quick-zoom-impact-772', 'short-transition-sweep-175'}


def sfx_asset(name):
    aid = 'sfx-' + name
    if name in STOCK:
        ASSETS[aid] = dict(id=aid, name='Efecto · ' + name, type='audio', url='assets/audio/' + name + '.mp3')
        if not URLS:
            shutil.copy(f'{V}assets/sfx/{name}.mp3', os.path.join(MEDIA, name + '.mp3'))
            ASSETS[aid]['url'] = name + '.mp3'
        return aid
    return media(aid, f'{V}assets/sfx/{name}.mp3', 'audio', 'Efecto · ' + name, conv='aac')


# ---------------------------------------------------------------- capas
def txt(id, text, x, y, size, color='#FFFFFF', font='PPCondensed', anim='rise', start=0.05, width=900, align='left', **kw):
    return dict(id=id, type='text', text=text, x=x, y=y, fontSize=size, fontFamily=font, fontWeight=400, color=color, animation=anim,
                start=round(start, 3), animationDuration=kw.pop('dur', 0.25), width=width, align=align, lineHeight=kw.pop('lineHeight', 1.1),
                opacity=kw.pop('opacity', 1), enabled=True, **kw)


def rect(id, x, y, w, h, color, anim='pop', start=0.05, radius=12, **kw):
    return dict(id=id, type='rect', x=x, y=y, width=w, height=h, color=color, animation=anim, start=round(start, 3), radius=radius,
                animationDuration=kw.pop('dur', 0.25), enabled=True, **kw)


def img(id, asset, x, y, w, anim='none', start=0, **kw):
    return dict(id=id, type='image', assetId=asset, x=x, y=y, width=w, animation=anim, start=round(start, 3), enabled=True, **kw)


def line(id, x, y, w, start, color=GOLD, stroke=8):
    return dict(id=id, type='line', x=x, y=y, width=w, strokeWidth=stroke, color=color, animation='wipe', start=round(start, 3), animationDuration=0.25, enabled=True)


def pill(id, text, x, y, size, start, anim='pop', fg=DARK, bg=GOLD, h=92, pad=34, stroke=None):
    w = round(len(text) * size * 0.58 + 2 * pad)
    extra = dict(stroke=stroke, strokeWidth=4) if stroke else {}
    return [rect(id + '-bg', x, y, w, h, bg, anim, start, radius=h / 2, **extra),
            txt(id + '-t', text, x + pad, y + (h - size * 1.12) / 2, size, fg, 'PPBold', anim, start, width=w, shadow=False)]


def headline(sid, l1, l2, top):
    return [txt(f'{sid}-h1', l1, 80, top, 86, start=0.05, anim='pop', dur=0.24),
            txt(f'{sid}-h2', l2, 80, top + 96, 86, GOLD, start=0.16, anim='slide-right', dur=0.24),
            line(f'{sid}-rule', 80, top + 210, 150, 0.25)]


def logo(sid, anim=False):
    return [img(f'{sid}-logo', 'crest', 540, 1400, 120, align='center', anim='rise' if anim else 'none', start=0.3 if anim else 0, animationDuration=0.4),
            txt(f'{sid}-logo-t', 'LEGACY CAPITAL', 540, 1400 + 156 + 6, 38, font='Cinzel', anim='rise' if anim else 'none', start=0.3 if anim else 0, width=600, align='center', dur=0.4)]


SHADE = {'top': 0.62, 'bottom': 0.38}
LOW = {'top': 0.25, 'bottom': 0.55}
NOSHADE = {'top': 0, 'bottom': 0}


def scene(id, title, start, end, mid, layers=(), shade=SHADE, motion='push-in', scale=1.04, narration=''):
    return dict(id=id, title=title, start=round(start, 3), duration=round(end - start, 3), mediaId=mid, narration=narration,
                media=dict(fit='cover', scale=scale, x=0, y=0, panX=0, panY=0, motion=motion, offset=0, speed=1, opacity=1),
                transition={'type': 'cut', 'duration': 0}, shade=shade, layers=list(layers))


T = B['at']
S = []
for sid, a, b, im, org, s0, s1, x0, x1, hl in B['SC']:
    L = headline(sid, hl[0], hl[1], B['HLTOP'].get(sid, 290)) if hl else []
    rel = lambda t: round(t - a, 3)
    if sid == 'c01':
        L += [txt('c01-hook-a', '¿TRABAJAS EN EE.UU.?', 70, 780, 92, anim='pop', start=0.03, dur=0.32),
              rect('c01-coin', 70, 884, 104, 104, '#E7B54A', 'pop', rel(T('¿ganas')), radius=52, stroke='#FFE7A8', strokeWidth=5),
              txt('c01-coin-t', '$', 70, 897, 66, '#6B4A08', 'PPBold', 'pop', rel(T('¿ganas')), width=104, align='center', shadow=False),
              txt('c01-hook-b', '¿GANAS EN DÓLARES?', 196, 884, 104, GOLD, start=rel(T('¿ganas')), anim='slide-right', width=820)]
        L += pill('c01-p1', '2 HAB. · DESDE $215,000 USD', 70, 300, 42, 0.95, fg='#FFFFFF', bg='#071D29E0', h=96, stroke=GOLD)
        L += pill('c01-p2', '3 HAB. · DESDE $235,000 USD', 70, 412, 42, 1.15, fg='#FFFFFF', bg='#071D29E0', h=96, stroke=GOLD)
    for s_, hab, val, w in (('c07', '2 HABITACIONES', 215000, '$215'), ('c08', '3 HABITACIONES', 235000, '$235')):
        if sid == s_:
            tw = rel(T(w, a))
            L += [txt(f'{s_}-a', hab, 80, 290, 76, start=0.05),
                  txt(f'{s_}-d', 'DESDE', 80, 380, 40, GOLD, 'PPBold', start=0.2),
                  dict(txt(f'{s_}-n', '', 80, 440, 150, start=round(tw - 0.55, 3), anim='pop', dur=0.55), type='counter', value=val, prefix='$'),
                  txt(f'{s_}-usd', 'USD', 690, 520, 64, GOLD, start=round(tw, 3), anim='pop')]
    if sid == 'c10':
        L += pill('k1', '✓ Luces', 65, 300, 42, rel(T('luces'))) + pill('k2', '✓ Minisplits', 65, 410, 42, rel(T('minisplits')))
    if sid == 'c11':
        L += pill('k3', '✓ Cerradura', 500, 860, 42, rel(T('cerradura')))
    if sid == 'c13':
        L += pill('e1', '✓ Cocina', 80, 650, 42, rel(T('cocina')))
    if sid == 'c14':
        L += pill('e2', '✓ Cuartos', 80, 650, 42, 0.03)
    if sid == 'c15':
        L += pill('e3', '✓ Roof garden', 80, 300, 42, rel(T('roof', 51.5)))
        p0, p1 = rel(52.25), rel(T('$450'))
        L += [rect('promo-card', 65, 850, 950, 396, '#0B2A48F2', 'pop', p0, radius=40, stroke=GOLD, strokeWidth=4),
              txt('promo-a', 'VALOR DE HASTA', 540, 860, 54, GOLD, start=p0 + 0.1, width=950, align='center'),
              dict(txt('promo-n', '', 540, 936, 160, start=p0 + 0.15, width=950, align='center', anim='pop', dur=round(p1 - p0 - 0.15, 3)), type='counter', value=450000, prefix='$'),
              rect('promo-flash', 0, 0, 1080, 1920, '#FFF6E2', 'none', p1, radius=0, opacity=0.75, duration=0.28),
              txt('promo-c', 'MXN EN EQUIPAMIENTO', 540, 1126, 40, font='PPBold', start=p1 + 0.2, width=950, align='center')]
        L += [rect('promo-d-bg', 300, 1182, 480, 52, GOLD, 'pop', p1 + 0.45, radius=26),
              txt('promo-d', 'Al reservar tu casa este mes', 540, 1189, 34, DARK, 'PPBold', 'pop', p1 + 0.45, width=480, align='center', shadow=False)]
    if sid == 'c19':
        L += [txt('cta-t', 'MÁS INFORMACIÓN', 540, 880, 104, start=0.13, width=1000, align='center', anim='pop'),
              rect('cta-bg', 110, 1020, 860, 116, GOLD, 'pop', rel(T('clic')), radius=58),
              txt('cta-b', 'Haz clic en el botón de abajo ↓', 540, 1053, 44, DARK, 'PPBold', 'pop', rel(T('clic')), width=860, align='center', shadow=False),
              txt('cta-wa', 'WhatsApp', 520, 1160, 40, font='PPBold', start=rel(T('recibir')), width=400, align='right'),
              txt('cta-wa-n', '+52 646 256 3006', 540, 1160, 40, GOLD, 'PPBold', start=rel(T('recibir')), width=500)]
    L += logo(sid, anim=(sid == 'c01'))
    sh = LOW if (sid in B['HLTOP'] or sid in ('c01', 'c15', 'c19')) else SHADE
    titulo = (hl[0] + ' ' + hl[1]) if hl else {'c01': 'Hook: trabajas en EE.UU.', 'c07': '2 habitaciones $215,000 USD', 'c08': '3 habitaciones $235,000 USD',
                                               'c10': 'Celular: luces y minisplits', 'c11': 'Cerradura digital', 'c14': 'Cuartos equipados',
                                               'c15': 'Roof + $450,000 MXN equipamiento', 'c19': 'Fran: más información'}[sid]
    S.append(scene(sid, f'{sid.upper()} · {titulo}', a, b, f'cal-{sid}', L, sh, scale=s0))


def mg_head(sid, eb, t1, t2):
    return [txt(f'{sid}-eb', eb, 540, 300, 32, GOLD, 'PPBold', start=0.05, width=1000, align='center'),
            txt(f'{sid}-t1', t1 + ' ' + t2, 540, 362, 96, start=0.1, width=1040, align='center', anim='pop'),
            line(f'{sid}-ru', 465, 478, 150, 0.3)]


ma, mb = B['MAP']
L = mg_head('mapa', 'CARRETERA PRINCIPAL · EL SAUZAL', 'A UN PASO', 'DE CALIFORNIA')
L[1]['text'] = 'A UN PASO DE CALIFORNIA'
L += [rect('mapa-marco', 193, 506, 694, 565, GOLD, 'pop', 0.35, radius=32), img('mapa-img', 'cal-mapa', 197, 510, 686, 'pop', 0.35, animationDuration=0.6)]
rows = [('Frontera con San Diego (San Ysidro)', 'aprox. 1 h 30 min', 'frontera'), ('Tijuana', 'aprox. 1 h', 'tijuana'), ('Mexicali', 'aprox. 3 h', 'mexicali')]
for i, (n, t, w) in enumerate(rows):
    t0 = round(T(w) - ma, 3)
    t1 = round(T(rows[i + 1][2]) - ma - 0.08, 3) if i < 2 else round(mb - ma, 3)
    L += [rect(f'mapa-r{i}', 65, 1090, 950, 96, '#FFFBF3F7', 'slide-right', t0, radius=26, end=t1),
          txt(f'mapa-r{i}-n', n, 95, 1114, 38 if i == 0 else 40, '#0E2A4A', 'PPBold', 'slide-right', t0, width=600, shadow=False, end=t1),
          rect(f'mapa-r{i}-p', 700, 1103, 300, 70, '#0E2A4A', 'pop', t0 + 0.1, radius=35, end=t1),
          txt(f'mapa-r{i}-t', t, 850, 1117, 36, GOLD, 'PPBold', 'pop', t0 + 0.1, width=300, align='center', shadow=False, end=t1)]
L += [txt('mapa-nota', 'Tiempos aproximados en auto; el cruce fronterizo puede variar.', 540, 1200, 26, '#E9DCC0', 'PPText', 'rise', round(T('frontera') - ma + 0.4, 3), width=1000, align='center')]
L += logo('mapa')
S.append(scene('mapa', 'Animación · mapa y tiempos a la frontera', ma, mb, 'cal-fondo-mg', L, NOSHADE, motion='none', scale=1))

pa, pb = B['PAY']
r = lambda t: round(t - pa, 3)
L = mg_head('pagos', 'PLAN DE PAGOS', 'SIN PERDER', 'TU LIQUIDEZ')
L[1]['text'] = 'SIN PERDER TU LIQUIDEZ'
L[1]['start'] = r(T('sin', 32.5))
L += [rect('pagos-barra', 65, 540, 950, 110, '#FFFFFF14', 'rise', r(T('liquidez')), radius=24, stroke='#FFD08680', strokeWidth=3),
      rect('pagos-b1', 65, 540, 95, 110, GOLD, 'wipe', r(T('10%')), radius=0),
      rect('pagos-b2', 160, 540, 95, 110, '#C99A2E', 'wipe', r(T('20', 36.5)), radius=0, dur=1.0),
      rect('pagos-b3', 255, 540, 760, 110, '#2F6E9A', 'wipe', r(T('80%')), radius=0, dur=0.5)]
cards = [('a', '10%', 'de enganche', 'Ej.: $21,500 USD*', 690, T('10%')), ('b', '10%', 'en 20 mensualidades', 'Ej.: 20 × $1,075 USD*', 880, T('10%', 35.5)),
         ('c', '80%', 'contra entrega', 'Prevista: mediados de 2028', 1070, T('80%'))]
for k, n, t, s, y, t0 in cards:
    L += [rect(f'pagos-{k}', 65, y, 950, 170, '#FFFBF3F7', 'pop', r(t0), radius=30),
          dict(txt(f'pagos-{k}-n', '', 99, y + 22, 120, '#0E2A4A', start=r(t0), anim='pop', dur=0.4, shadow=False), type='counter', value=int(n[:-1]), suffix='%'),
          txt(f'pagos-{k}-t', t, 349, y + 40, 44, '#0E2A4A', 'PPBold', 'pop', r(t0), width=620, shadow=False),
          txt(f'pagos-{k}-s', s, 349, y + 98, 30, '#8A620C', 'PPBold', 'pop', r(T('prevista')) if k == 'c' else r(t0), width=620, shadow=False)]
L += [txt('pagos-nota', '*Ejemplo con casa de 2 habitaciones desde $215,000 USD.', 540, 1258, 24, '#E9DCC0', 'PPText', 'rise', r(T('10%')) + 0.4, width=1000, align='center')]
L += logo('pagos')
S.append(scene('pagos', 'Animación · plan de pagos 10/10/80', pa, pb, 'cal-fondo-mg', L, NOSHADE, motion='none', scale=1))

ga, gb = B['GRO']
r = lambda t: round(t - ga, 3)
L = mg_head('plus', 'TU PATRIMONIO', 'PAGA POCO A POCO', '')
L[1]['text'] = 'PAGA POCO A POCO'
for i in range(21):
    x = 65 + 60 + i * 38; h = 60 if i == 0 else 26
    L.append(rect(f'plus-b{i}', x, 520 + 600 - h, 26, h, GOLD if i == 0 else '#C99A2E', 'rise', 0.5 + i * 0.07, radius=6, dur=0.18))
L.append(rect('plus-b21', 65 + 880, 520 + 420, 60, 180, '#2F6E9A', 'rise', 0.5 + 21 * 0.07, radius=8, dur=0.18))
pts = [(60, 380), (260, 360), (420, 300), (560, 230), (690, 165), (800, 110), (920, 60)]
L.append(dict(id='plus-curva', type='chart', x=65, y=520, width=950, height=700, points=[[x / 950, y / 700] for x, y in pts], color=GOLD,
              gridColor='rgba(0,0,0,0)', strokeWidth=12, start=1.3, drawDuration=3.4, animation='none', enabled=True))
L += pill('plus-tag', '↑ Plusvalía mientras pagas', 220, 540, 38, r(T('plusvalía')), h=84, pad=30)
L += [txt('plus-l0', 'Hoy', 120, 1140, 30, '#E9DCC0', 'PPBold', 'rise', 0.6, width=200, align='center'),
      txt('plus-l1', 'Mensualidades', 540, 1140, 30, '#E9DCC0', 'PPBold', 'rise', 0.85, width=300, align='center'),
      txt('plus-l2', 'Entrega\n2028', 940, 1140, 30, '#E9DCC0', 'PPBold', 'rise', 1.1, width=200, align='center'),
      txt('plus-nota', 'Gráfica ilustrativa. La plusvalía no está garantizada.', 540, 1250, 24, '#E9DCC0', 'PPText', 'rise', 1.0, width=1000, align='center')]
L += logo('plus')
S.append(scene('plusvalia', 'Animación · plusvalía conceptual (sin cifras)', ga, gb, 'cal-fondo-mg', L, NOSHADE, motion='none', scale=1))
S.sort(key=lambda s: s['start'])

# ---------------------------------------------------------------- subtítulos y audio
caps = []
G = B['G']
for gi, g in enumerate(G):
    w = g['w']
    nxt = G[gi + 1]['w'][0][1] if gi + 1 < len(G) else None
    start = max(g['s'], w[0][1] - 0.05)
    end = min(g['end'], nxt - 0.05) if nxt else g['end']
    words = [{'text': ww[0], 'start': round(ww[1], 3), 'end': round(ww[2], 3)} for ww in w]
    mid = (start + end) / 2
    sc = next((s for s in S if s['start'] <= mid < s['start'] + s['duration']), None)
    caps.append(dict(id=f'cap-{gi:03d}', sceneId=sc['id'] if sc else None, start=round(start, 3), end=round(end, 3), text=' '.join(x['text'] for x in words),
                     words=words, x=540, y=g['top'] + 4, fontSize=60, fontFamily='PPBold', fontWeight=400, color='#FFFFFF', highlightColor=GOLD,
                     background='#0719298C', align='center', animation='word', enabled=True))


def track(id, name, kind, aid, start, dur, vol, offset=0.0, fadeOut=0.0, fadeIn=0.0):
    return dict(id=id, name=name, kind=kind, assetId=aid, start=round(start, 3), offset=round(offset, 3), duration=round(dur, 3),
                volume=vol, fadeIn=fadeIn, fadeOut=fadeOut, muted=False)


DUR = B['DUR']
voz = media('cal-voz-prueba', V + 'assets/voz.wav', 'audio', 'Voz · prueba del storyboard (Gemini «Charon»)', conv='aac')
mus = media('cal-musica', V + 'assets/musica.mp3', 'audio', 'Música · Happy Times (Mixkit)', conv='aac')
tracks = [track('voz', 'Voz · narrador (prueba)', 'voice', voz, 0, 65.32, 1), track('musica', 'Música', 'music', mus, 0, DUR, B['MV'], fadeOut=0.7)]
for i, (k, t, v) in enumerate(B['ev']):
    f, d = B['SFX'][k]
    tracks.append(track(f'sfx{i:02d}', f'Efecto · {f}', 'sfx', sfx_asset(f), t, d, v))

SCRIPT = open(V + 'guion.txt').read().strip()
used = {s['mediaId'] for s in S} | {l.get('assetId') for s in S for l in s['layers']} | {t['assetId'] for t in tracks}
P = dict(schemaVersion=1, id='california-v1-fotos-legacy', title='California v1 · fotos · Legacy Capital', version='California v1 · montaje con fotos (18 nov)',
         width=1080, height=1920, fps=30, duration=DUR,
         brand={'name': 'Legacy Capital', 'logoAssetId': 'crest', 'colors': {'navy': NAVY, 'gold': GOLD, 'cream': CREAM, 'price': GOLD}},
         script=SCRIPT, voiceScript=SCRIPT, voiceStatus='synced', scenes=S, assets=[a for a in ASSETS.values() if a['id'] in used or a['type'] == 'font'],
         captions=caps, audioTracks=tracks, overlays=[], comments=[], references=[],
         subtitleStyle=dict(fontFamily='PPBold', fontWeight=400, fontSize=60, color='#FFFFFF', highlightColor=GOLD, background='#0719298C', animation='word', enabled=True),
         source={'version': 'California v1', 'hyperframes': 'estudio-video/videos/punta-pacifico-california-v1-es'},
         constraints={'visibleBrand': 'Legacy Capital'}, createdAt='2026-11-18T09:00:00Z', updatedAt='2026-11-18T09:00:00Z')
json.dump(P, open(OUT, 'w'), ensure_ascii=False)
print(f"{P['id']}: {len(S)} escenas, {len(caps)} subtítulos, {len(tracks)} pistas, {len(P['assets'])} assets, {DUR} s")
print('sin subir:', sorted(a['id'] for a in P['assets'] if not (str(a['url']).startswith('/_blob/') or str(a['url']).startswith('assets/audio/'))))
