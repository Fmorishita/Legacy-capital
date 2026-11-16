#!/usr/bin/env python3
"""Convierte Doctor V11 y V11b (HyperFrames) en proyectos editables de Legacy Studio.

  python3 doctor_v11_a_studio.py <media_dir> <salida_dir> [--urls blobs.json]

- Lee los datos de las escenas directo de los build.py de V11 y V11b (no duplica tiempos).
- Cada toma es una escena con su clip (Seedance, render o foto) como medio; titulares, precios,
  tarjetas, checklist, promo y cierre son capas editables; subtítulos con tiempos por palabra;
  voz, música, audio de las animaciones y efectos van en pistas separadas.
- Las animaciones (mg1 conectividad, mg4 pagos, mg3 plusvalía) entran como clips de video.
- media_dir recibe los archivos a subir; sin --urls las rutas son locales (para render-claude.mjs).
"""
import builtins, copy, io, json, os, shutil, subprocess, sys

V = '/home/user/Legacy-capital/estudio-video/videos/'
A11 = V + 'punta-pacifico-doctor-v11-es/'
A11B = V + 'punta-pacifico-doctor-v11b-asesor-es/'
MEDIA, OUT = sys.argv[1], sys.argv[2]
URLS = json.load(open(sys.argv[sys.argv.index('--urls') + 1])) if '--urls' in sys.argv else {}
os.makedirs(MEDIA, exist_ok=True); os.makedirs(OUT, exist_ok=True)
GOLD, NAVY, CREAM, DARK = '#FFD086', '#1A2B4C', '#F5F0E6', '#071D29'


def run_build(path):
    """Ejecuta un build.py sin dejarlo escribir: devuelve sus variables."""
    real = builtins.open
    def fake(f, mode='r', *a, **k):
        if 'w' in mode:
            return io.StringIO()
        return real(f, mode, *a, **k)
    ns = {'__name__': 'x', 'open': fake, 'print': lambda *a, **k: None}
    exec(real(path).read(), ns)
    return ns


B11 = run_build(A11 + 'build.py')
B11B = run_build(A11B + 'build.py')

# ---------------------------------------------------------------- medios
ASSETS = {}


def media(aid, src, tipo, nombre, conv=None, **extra):
    """Copia/convierte el medio a MEDIA y registra el asset."""
    ext = {'video': '.mp4', 'audio': '.mp4', 'image': os.path.splitext(src)[1], 'font': os.path.splitext(src)[1]}[tipo]
    dst = os.path.join(MEDIA, aid + ext)
    if not os.path.exists(dst):
        if conv == 'aac':
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', src, '-vn', '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', dst], check=True)
        else:
            shutil.copy(src, dst)
    a = dict(id=aid, name=nombre, type=tipo, url=URLS.get(aid, os.path.basename(dst)), **extra)
    if tipo == 'image':
        a['thumbnail'] = a['url']
    ASSETS[aid] = a
    return aid


def clip(name, base=A11):
    return media('clip-' + name, f'{base}assets/clips/{name}.mp4', 'video', 'Clip · ' + name)


for fam, f in [('PPCondensed', 'OpenSans_Condensed_Bold.ttf'), ('PPText', 'OpenSans_Semibold.ttf'), ('PPBold', 'OpenSans_ExtraBold.ttf'), ('Cinzel', 'cinzel-latin-700-normal.woff2')]:
    media('font-' + fam, A11 + 'assets/fonts/' + f, 'font', 'Fuente ' + fam, family=fam)
ASSETS['crest'] = dict(id='crest', name='Escudo Legacy Capital', type='image', url=URLS.get('crest', '/_blob/0ad3c12a2ebd8585653625b339559077') if URLS else 'crest.png', width=300, height=391)
if not URLS:
    shutil.copy(A11 + 'assets/crest.png', os.path.join(MEDIA, 'crest.png'))
ASSETS['crest']['thumbnail'] = ASSETS['crest']['url']
for k in range(1, 9):
    media(f'ico{k}', f'{A11}assets/ico/ico{k}.png', 'image', f'Ícono servicio {k}')
for n in ('v04', 'v23', 'r-bano'):
    media('img-' + n, f'{A11}assets/img/{n}.jpg', 'image', 'Render · ' + n)


def fondo(aid, css, nombre):
    """Fondo de promo / cierre: mismo CSS de la V11, capturado a PNG."""
    dst = os.path.join(MEDIA, aid + '.png')
    if not os.path.exists(dst):
        html = os.path.join(MEDIA, aid + '.html')
        open(html, 'w').write(f'<html><body style="margin:0"><div style="position:relative;width:1080px;height:1920px;overflow:hidden;{css}"></div></body></html>')
        subprocess.run(['node', '-e', f"""const {{chromium}}=require('playwright');(async()=>{{const b=await chromium.launch();const p=await b.newPage({{viewport:{{width:1080,height:1920}}}});await p.goto('file://{html}');await p.screenshot({{path:'{dst}'}});await b.close();}})()"""], check=True, cwd='/tmp')
        os.remove(html)
    ASSETS[aid] = dict(id=aid, name=nombre, type='image', url=URLS.get(aid, aid + '.png'), width=1080, height=1920)
    ASSETS[aid]['thumbnail'] = ASSETS[aid]['url']
    return aid


fondo('fondo-promo', 'background:radial-gradient(ellipse 90% 60% at 50% 42%,#173F66 0%,#071D29 72%)"><div style="position:absolute;left:-460px;top:-160px;width:2000px;height:2000px;border-radius:50%;transform:rotate(20deg);background:repeating-conic-gradient(from 0deg,rgba(255,208,134,.16) 0deg 7deg,rgba(255,208,134,0) 7deg 20deg)"></div><div style="display:none', 'Fondo promo (rayos)')
fondo('fondo-cierre', 'background:radial-gradient(ellipse 100% 70% at 50% 35%,#163B5E 0%,#0B2338 55%,#071D29 100%)', 'Fondo cierre')

STOCK = {'air-zoom-vacuum-2608', 'cinematic-whoosh-fast-1492', 'fast-small-sweep-166', 'fast-whoosh-1490', 'quick-zoom-impact-772', 'short-transition-sweep-175'}


def sfx_asset(src):
    name = os.path.splitext(os.path.basename(src))[0]
    aid = 'sfx-' + name
    if name in STOCK:  # ya vienen en el editor
        ASSETS[aid] = dict(id=aid, name='Efecto · ' + name, type='audio', url='assets/audio/' + name + '.mp3')
        if not URLS:
            shutil.copy(f'{A11}assets/sfx/{name}.mp3', os.path.join(MEDIA, name + '.mp3'))
            ASSETS[aid]['url'] = name + '.mp3'
        return aid
    return media(aid, f'{A11}assets/sfx/{name}.mp3', 'audio', 'Efecto · ' + name, conv='aac')


# ---------------------------------------------------------------- capas
def txt(id, text, x, y, size, color='#FFFFFF', font='PPCondensed', anim='rise', start=0.05, width=900, align='left', **kw):
    return dict(id=id, type='text', text=text, x=x, y=y, fontSize=size, fontFamily=font, fontWeight=400, color=color, animation=anim,
                start=round(start, 3), animationDuration=kw.pop('dur', 0.25), width=width, align=align, lineHeight=kw.pop('lineHeight', 1.1), opacity=kw.pop('opacity', 1), enabled=True, **kw)


def rect(id, x, y, w, h, color, anim='pop', start=0.05, radius=12, **kw):
    return dict(id=id, type='rect', x=x, y=y, width=w, height=h, color=color, animation=anim, start=round(start, 3), radius=radius,
                animationDuration=kw.pop('dur', 0.25), enabled=True, **kw)


def img(id, asset, x, y, w, anim='none', start=0, **kw):
    return dict(id=id, type='image', assetId=asset, x=x, y=y, width=w, animation=anim, start=round(start, 3), enabled=True, **kw)


def headline(sid, l1, l2, d=0.0, anim=True):
    a = 'slide-right' if anim else 'none'
    return [txt(f'{sid}-h1', l1, 90, 298, 96, start=0.05 + d, anim=a, dur=0.22),
            txt(f'{sid}-h2', l2, 90, 409, 96, GOLD, start=0.14 + d, anim=a, dur=0.22),
            dict(id=f'{sid}-rule', type='line', x=90, y=534, width=150, strokeWidth=8, color=GOLD, animation='wipe' if anim else 'none',
                 start=round(0.22 + d, 3), animationDuration=0.25, enabled=True)]


def logo(sid, anim=False):
    return [img(f'{sid}-logo', 'crest', 540, 1312, 62, align='center', anim='rise' if anim else 'none', start=0.3 if anim else 0, animationDuration=0.4),
            txt(f'{sid}-logo-t', 'LEGACY CAPITAL', 540, 1400, 22, font='Cinzel', anim='rise' if anim else 'none', start=0.3 if anim else 0, width=500, align='center', dur=0.4)]


def pill(id, text, x, y, size, start, anim='pop', fg=DARK, bg=GOLD, h=74, pad=30, align='left'):
    w = round(len(text) * size * 0.56 + 2 * pad)
    rx = x if align == 'left' else x - w / 2
    return [rect(id + '-bg', rx, y, w, h, bg, anim, start, radius=h / 2),
            txt(id + '-t', text, rx + pad, y + (h - size * 1.12) / 2, size, fg, 'PPBold', anim, start, width=w)]


SHADE = {'top': 0.78, 'bottom': 0.35}
NOSHADE = {'top': 0, 'bottom': 0}


def scene(id, title, start, end, mid, layers=(), shade=SHADE, offset=0.0, motion='none', scale=1.0, narration=''):
    return dict(id=id, title=title, start=round(start, 3), duration=round(end - start, 3), mediaId=mid, narration=narration,
                media=dict(fit='cover', scale=scale, x=0, y=0, panX=0, panY=0, motion=motion, offset=round(offset, 3), speed=1, opacity=1),
                transition={'type': 'cut', 'duration': 0}, shade=shade, layers=list(layers))


# ---------------------------------------------------------------- V11
def v11_escenas(shift=0.0, desde=0.0, hasta=99.0, logo_anim=True):
    S = []
    SC = B11['SC']
    for sid, a, b, im, org, s0, s1, x0, x1, hl, lg in SC:
        if not (desde <= a < hasta):
            continue
        if im.startswith('clip:'):
            mid, mot, sc = clip(im[5:]), 'none', 1.0
        else:
            mid, mot, sc = 'img-' + im, 'push-in', s0
        L = []
        if hl:
            L += headline(sid, hl[0], hl[1])
        if sid == 's01':
            L += [txt('s01-hook-a', 'DOCTOR O MÉDICO,', 70, 866, 96, anim='pop', start=0.05, dur=0.35),
                  txt('s01-hook-b', '¿BUSCAS COMPRAR CASA CON VISTA AL MAR?', 70, 978, 47, GOLD, start=1.0, width=960, dur=0.3),
                  dict(id='s01-hook-rule', type='line', x=70, y=1052, width=170, strokeWidth=8, color=GOLD, animation='wipe', start=1.25, animationDuration=0.3, enabled=True)]
        for s_, pa, pb, pc, t in (('s04', 'DESDE', '$3.9', 'MILLONES DE PESOS', (0.05, 0.65, 0.85)), ('s05', 'HASTA', '$4.9', 'MILLONES DE PESOS · MXN', (0.02, 0.3, 0.9))):
            if sid == s_:
                L += [txt(f'{s_}-pa', pa, 90, 306, 64, GOLD, anim='slide-right', start=t[0], dur=0.2),
                      txt(f'{s_}-pb', pb, 90, 413, 240, anim='pop', start=t[1]),
                      txt(f'{s_}-pc', pc, 90, 696, 46, font='PPBold', start=t[2], width=950)]
        if sid == 's15':
            L += [rect('s15-card', 65, 280, 950, 400, '#071D29DB', 'pop', 0.02, radius=34, stroke=GOLD, strokeWidth=3),
                  txt('s15-t', 'TU CASA TAMBIÉN PRODUCE', 109, 306, 56, GOLD, start=0.06),
                  txt('s15-s', 'Escenario ilustrativo · no garantizado', 109, 378, 28, font='PPText', start=0.1)]
            for i, h in enumerate([50, 80, 110, 140, 175, 210]):
                t0 = 0.1 + i * 0.15
                L += [rect(f's15-bar{i}', 125 + i * 150, 644 - h, 96, h, '#E9B85C', 'rise', t0, radius=14),
                      rect(f's15-coin{i}', 136 + i * 150, 280 + 400 - 36 - h - 84, 74, 74, '#E7B54A', 'pop', t0 + 0.06, radius=37, stroke='#FFE7A8', strokeWidth=4),
                      txt(f's15-coin{i}-t', '$', 173 + i * 150, 280 + 400 - 36 - h - 84 + 12, 44, '#6B4A08', 'PPBold', 'pop', t0 + 0.06, width=74, align='center', shadow=False)]
            pts = [(90, 330), (240, 300), (390, 268), (540, 236), (690, 200), (860, 150)]
            L.append(dict(id='s15-flecha', type='chart', x=65, y=280, width=950, height=400, points=[[x / 950, y / 400] for x, y in pts],
                          color='#FFFFFF', gridColor='rgba(0,0,0,0)', strokeWidth=7, start=0.15, drawDuration=0.9, animation='none', enabled=True))
        if sid in ('s20', 's21', 's22', 's23'):
            first = sid == 's20'
            L += [txt(f'{sid}-eq1', 'INCLUIDO', 90, 298, 96, anim='slide-right' if first else 'none', start=0.05, dur=0.22),
                  txt(f'{sid}-eq2', 'DESDE EL DÍA 1', 90, 409, 96, GOLD, anim='slide-right' if first else 'none', start=0.05, dur=0.22)]
            item = {'s20': ('Cocina', 0.6), 's21': ('Cuartos', 0.05), 's22': ('Baños', 0.05), 's23': ('Roof', 0.05)}[sid]
            L += pill(f'{sid}-eq', '✓ ' + item[0], 90, 540, 36, item[1])
        L += logo(sid, anim=(sid == 's01' and logo_anim))
        sh = {'top': 0, 'bottom': 0.35} if sid in B11['NOTOP'] else SHADE
        S.append(scene(sid, f'{sid} · {(hl[0] + " " + hl[1]) if hl else im.replace("clip:", "")}', a + shift, b + shift, mid, L, sh, motion=mot, scale=sc))
    return S


def servicios(shift=0.0):
    out = []
    tarjetas = B11['SRV']
    for n, (a, b, c) in enumerate([(6.5, 8.4, 'aereo-terreno'), (8.4, 10.3, 'aereo-marina')]):
        # la segunda toma sigue el mismo reloj de animación (las tarjetas 7 y 8 entran ahí)
        an = lambda x: x
        dt = -(a - 6.5)
        L = [txt(f'srv{n}-eb', 'EL SAUZAL · ENTRADA DE ENSENADA', 65, 284, 28, GOLD, 'PPBold', an('slide-right'), 0.05 + dt, width=950),
             txt(f'srv{n}-t1', 'SERVICIOS Y PUNTOS', 65, 334, 84, anim=an('slide-right'), start=0.12 + dt),
             txt(f'srv{n}-t2', 'DE INTERÉS ALREDEDOR', 65, 426, 84, GOLD, anim=an('slide-right'), start=0.12 + dt),
             dict(id=f'srv{n}-rule', type='line', x=65, y=528, width=160, strokeWidth=8, color=GOLD, animation=an('wipe'), start=round(0.3 + dt, 3), animationDuration=0.25, enabled=True)]
        for k, cc in enumerate(tarjetas):
            x, y, t0 = 40 + (k % 2) * 505, 770 + (k // 2) * 120, 0.45 + k * 0.2 + dt
            A_ = an('pop')
            L += [rect(f'srv{n}-c{k}', x, y, 495, 112, '#FFFBF3F5', A_, t0, radius=24, stroke='#E3B869', strokeWidth=4),
                  img(f'srv{n}-c{k}-ico', f'ico{cc[2] if cc else 8}', x + 12, y + 17, 78, A_, t0, animationDuration=0.25),
                  rect(f'srv{n}-c{k}-bar', x + 102, y + 17, 5, 78, '#C99A2E', A_, t0, radius=3)]
            if cc:
                lines = cc[0].replace('&amp;', '&').split('<br>')
                hn = 27 * len(lines); top = y + (112 - (hn + 3 + 31)) / 2
                L.append(txt(f'srv{n}-c{k}-n', '\n'.join(lines), x + 119, top, 25, '#132B6B', 'PPBold', A_, t0, width=360, shadow=False, lineHeight=1.08))
                L += pill(f'srv{n}-c{k}-p', cc[1], x + 119, top + hn + 3, 24, t0 + 0.1, A_, '#FFFFFF', '#8A620C', h=31, pad=16)
            else:
                top = y + (112 - (22 + 3 + 31 + 3 + 22)) / 2
                L += [txt(f'srv{n}-c{k}-a', 'A menos de', x + 119, top, 20, '#132B6B', 'PPBold', A_, t0, width=360, shadow=False)]
                L += pill(f'srv{n}-c{k}-p', '800 metros', x + 119, top + 25, 24, t0 + 0.1, A_, '#FFFFFF', '#8A620C', h=31, pad=16)
                L += [txt(f'srv{n}-c{k}-b', 'de la carretera de Ensenada', x + 119, top + 59, 20, '#132B6B', 'PPBold', A_, t0, width=370, shadow=False)]
        L += logo(f'srv{n}')
        out.append(scene(f'srv{n + 1}', f'srv{n + 1} · Servicios alrededor ({c})', a + shift, b + shift, clip(c), L, {'top': 0.82, 'bottom': 0.4}))
    return out


MGN = {'mg1': 'Conectividad regional', 'mg4': 'Pagos mientras se construye', 'mg3': 'Plusvalía proyectada'}


def mgs(shift=0.0):
    out = []
    for k, a, d in B11['MG']:
        mid = media('anim-' + k, f'{A11}assets/mg/{k}.mp4', 'video', 'Animación · ' + MGN[k])
        out.append(scene(k, f'{k} · Animación {MGN[k]}', a + shift, a + d + shift, mid, [], NOSHADE))
    return out


def promo(shift=0.0):
    a, b = B11['PROMO']
    L = [txt('promo-a', 'AHORRA HASTA', 540, 365, 96, GOLD, start=0.05, width=1000, align='center'),
         dict(txt('promo-n', '', 540, 560, 240, start=0.25, width=1000, align='center', anim='pop', dur=0.9), type='counter', value=450000, prefix='$'),
         rect('promo-flash', 0, 0, 1080, 1920, '#FFF3D6', 'none', 1.15, radius=0, opacity=0.85, duration=0.3),
         txt('promo-c', 'EN EQUIPAMIENTO INCLUIDO', 540, 886, 52, font='PPBold', start=1.5, width=1000, align='center')]
    L += pill('promo-d', 'Al apartar tu casa este mes', 540, 966, 40, 1.8, align='center', h=64, pad=36)
    return scene('promo', 'promo · Ahorra hasta $450,000', a + shift, b + shift, 'fondo-promo', L, NOSHADE)


def cierre(a, b, shift_anim=0.0, sid='cierre'):
    d = -shift_anim
    an = lambda x: x if shift_anim == 0 else 'none'
    L = [img(f'{sid}-crest', 'crest', 540, 300, 230, an('pop'), 0.1 + d, align='center', animationDuration=0.45),
         txt(f'{sid}-brand', 'LEGACY CAPITAL', 540, 622, 56, font='Cinzel', anim=an('rise'), start=0.4 + d, width=1000, align='center'),
         txt(f'{sid}-re', 'REAL ESTATE', 540, 697, 28, GOLD, 'PPText', an('rise'), 0.55 + d, width=1000, align='center'),
         txt(f'{sid}-mas', 'MÁS INFORMACIÓN', 540, 790, 120, anim=an('rise'), start=0.85 + d, width=1000, align='center'),
         rect(f'{sid}-cta', 120, 950, 840, 116, GOLD, an('pop'), 1.25 + d, radius=58),
         txt(f'{sid}-cta-t', 'Haz clic en el botón de abajo ↓', 540, 983, 44, DARK, 'PPBold', an('pop'), 1.25 + d, width=840, align='center', shadow=False),
         txt(f'{sid}-wa', 'WhatsApp', 520, 1110, 42, font='PPBold', anim=an('rise'), start=1.75 + d, width=400, align='right'),
         txt(f'{sid}-wa-n', '+52 646 256 3006', 540, 1110, 42, GOLD, 'PPBold', an('rise'), 1.75 + d, width=500)]
    return scene(sid, 'cierre · Legacy Capital y contacto', a, b, 'fondo-cierre', L, NOSHADE)


def captions_from(groups, scenes, shift=0.0, desde=-1, hasta=999, ini=0):
    caps = []
    for gi, g in enumerate(groups):
        w = g['w']
        if not (desde <= w[0][1] < hasta):
            continue
        nxt = groups[gi + 1]['w'][0][1] if gi + 1 < len(groups) else None
        start = max(g['s'], w[0][1] - 0.05) + shift
        end = (min(g['end'], nxt - 0.05) if nxt and nxt < hasta else g['end']) + shift
        words = []
        for i, ww in enumerate(w):
            e = ww[2] if len(ww) > 2 else (w[i + 1][1] if i + 1 < len(w) else g['end'])
            words.append({'text': ww[0], 'start': round(ww[1] + shift, 3), 'end': round(e + shift, 3)})
        mid = (start + end) / 2
        sc = next((s for s in scenes if s['start'] <= mid < s['start'] + s['duration']), None)
        caps.append(dict(id=f'cap-{ini + len(caps):03d}', sceneId=sc['id'] if sc else None, start=round(start, 3), end=round(end, 3),
                         text=' '.join(x['text'] for x in words), words=words, x=540, y=g['top'] + 4, fontSize=60, fontFamily='PPBold', fontWeight=400,
                         color='#FFFFFF', highlightColor=GOLD, background='#07192980', align='center', animation='word', enabled=True))
    return caps


def track(id, name, kind, aid, start, dur, vol, offset=0.0, fadeOut=0.0, fadeIn=0.0):
    return dict(id=id, name=name, kind=kind, assetId=aid, start=round(start, 3), offset=round(offset, 3), duration=round(dur, 3),
                volume=vol, fadeIn=fadeIn, fadeOut=fadeOut, muted=False)


SUB = dict(fontFamily='PPBold', fontWeight=400, fontSize=60, color='#FFFFFF', highlightColor=GOLD, background='#07192980', animation='word', enabled=True)


def proyecto(pid, title, version, dur, scenes, captions, tracks, script):
    used = {s['mediaId'] for s in scenes} | {l.get('assetId') for s in scenes for l in s['layers']} | {t['assetId'] for t in tracks}
    assets = [a for a in ASSETS.values() if a['id'] in used or a['type'] == 'font']
    return dict(schemaVersion=1, id=pid, title=title, version=version, width=1080, height=1920, fps=30, duration=dur,
                brand={'name': 'Legacy Capital', 'logoAssetId': 'crest', 'colors': {'navy': NAVY, 'gold': GOLD, 'cream': CREAM, 'price': GOLD}},
                script=script, voiceScript=script, voiceStatus='synced', scenes=scenes, assets=assets, captions=captions, audioTracks=tracks,
                overlays=[], comments=[], references=[], subtitleStyle=SUB,
                source={'version': version, 'hyperframes': 'estudio-video/videos/' + ('punta-pacifico-doctor-v11b-asesor-es' if 'v11b' in pid else 'punta-pacifico-doctor-v11-es')},
                constraints={'visibleBrand': 'Legacy Capital'}, createdAt='2026-11-16T19:00:00Z', updatedAt='2026-11-16T19:00:00Z')


TEXTO = open('/home/user/Legacy-capital/estudio-video/proyectos/punta-pacifico/voz/v9/texto.txt').read().strip()

# ===== V11
sc11 = v11_escenas() + servicios() + mgs() + [promo(), cierre(*B11['END'])]
sc11.sort(key=lambda s: s['start'])
cap11 = captions_from(B11['G'], sc11)
voz = media('voz-v10', A11 + 'assets/voz.wav', 'audio', 'Voz · narrador (V10)', conv='aac')
mus = media('musica-v11', A11 + 'assets/musica-nueva.mp3', 'audio', 'Música · V11', conv='aac')
DUR = B11['DUR']
tr11 = [track('voz', 'Voz · narrador', 'voice', voz, 0, 65.6, 1), track('musica', 'Música', 'music', mus, 0, DUR, 0.07, fadeOut=1.2)]
for k, a, d in B11['MG']:
    aid = media(f'anim-{k}-audio', f'{A11B}assets/mg/{k}-audio.wav', 'audio', f'Audio animación · {MGN[k]}', conv='aac')
    tr11.append(track(f'{k}-audio', f'Animación {MGN[k]}', 'sfx', aid, a, d, 0.42))
for i, (k, t, v) in enumerate(B11['ev']):
    f, d = B11['SFX'][k]
    tr11.append(track(f'sfx{i:02d}', f'Efecto · {f}', 'sfx', sfx_asset(f), t, d, v))
P11 = proyecto('doctor-v11-legacy', 'Doctor V11 · Legacy Capital', 'V11 · sin asesor (16 nov)', DUR, sc11, cap11, tr11, TEXTO)

# ===== V11b (con asesor): intro y cierre del asesor + cuerpo de la V11 desplazado
OFF = B11B['OFF']; H = B11B['H']; A0, A1 = B11B['A0'], B11B['A1']
intro = []
for sid, a, b, src, ms, hl in B11B['SC']:
    name = os.path.splitext(os.path.basename(src))[0]
    mid = clip(name, A11B)
    L = headline(sid, *hl) if hl else []
    if sid == 'i1':
        L += [txt('i1-hook-a', 'DOCTOR O MÉDICO,', 70, 866, 96, anim='pop', start=0.05, dur=0.35),
              txt('i1-hook-b', '¿BUSCAS COMPRAR CASA CON VISTA AL MAR?', 70, 978, 47, GOLD, start=0.6, width=960, dur=0.3),
              dict(id='i1-hook-rule', type='line', x=70, y=1052, width=170, strokeWidth=8, color=GOLD, animation='wipe', start=0.85, animationDuration=0.3, enabled=True)]
    if sid == 'i2':
        L += [txt('i2-eb-a', 'ASESOR', 90, 304, 30, GOLD, 'PPBold', 'slide-right', 0.08),
              txt('i2-eb-b', 'LEGACY CAPITAL', 90, 348, 56, font='Cinzel', anim='slide-right', start=0.18),
              dict(id='i2-eb-r', type='line', x=90, y=440, width=150, strokeWidth=8, color=GOLD, animation='wipe', start=0.33, animationDuration=0.25, enabled=True)]
    L += logo(sid, anim=(sid == 'i1'))
    sh = {'top': 0, 'bottom': 0.35} if sid == 'i1' else ({'top': 0.78, 'bottom': 0.3} if sid == 'i2' else SHADE)
    intro.append(scene(sid, f'{sid} · ' + ('Asesor Legacy Capital' if sid == 'i2' else (hl[0] + ' ' + hl[1] if hl else 'Portada doctor')),
                       a, b, mid, L, sh, offset=ms, motion='push-in' if sid == 'i2' else 'none'))
cuerpo = [s for s in (v11_escenas(OFF, A0, A1, logo_anim=False) + servicios(OFF) + mgs(OFF) + [promo(OFF)])]
for s in cuerpo:  # ids distintos para no confundir con la V11
    s['id'] = 'b-' + s['id']
    for l in s['layers']:
        l['id'] = 'b-' + l['id']
B_C1, B_C2, B_END, C1, C2 = B11B['B_C1'], B11B['B_C2'], B11B['B_END'], B11B['C1'], B11B['C2']
ases = clip('asesor', A11B)
cta = lambda sid, anim: ([txt(f'{sid}-cta-t', 'MÁS INFORMACIÓN', 540, 292, 104, anim='rise' if anim else 'none', start=0.05, width=1000, align='center'),
                          rect(f'{sid}-cta-w', 180, 414, 720, 84, '#071D29E0', 'pop' if anim else 'none', 0.3, radius=42, stroke=GOLD, strokeWidth=3),
                          txt(f'{sid}-cta-w1', 'WhatsApp', 520, 435, 38, font='PPBold', anim='pop' if anim else 'none', start=0.3, width=300, align='right', shadow=False),
                          txt(f'{sid}-cta-w2', '+52 646 256 3006', 536, 435, 38, GOLD, 'PPBold', 'pop' if anim else 'none', 0.3, width=400, shadow=False)])
cierre_b = [scene('c1', 'c1 · Asesor: Haz clic en el botón de abajo', B_C1, B_C2, ases, cta('c1', True) + logo('c1', True), {'top': 0.78, 'bottom': 0.3}, offset=C1[0], motion='push-in'),
            scene('c2', 'c2 · Asesor: un asesor te atenderá', B_C2, B_END, ases, cta('c2', False) + logo('c2'), {'top': 0.78, 'bottom': 0.3}, offset=C2[0], motion='push-in', scale=1.12),
            cierre(B_END, B11B['DUR'], shift_anim=B11B['END_SRC'] - B11['END'][0], sid='fin')]
sc11b = intro + cuerpo + cierre_b
sc11b.sort(key=lambda s: s['start'])
G_ases = [g for g in B11B['G']]
cap11b = captions_from(G_ases, sc11b, desde=0, hasta=H) + captions_from(B11['G'], sc11b, shift=OFF, desde=A0, hasta=A1, ini=50) + \
         captions_from(G_ases, sc11b, desde=H, hasta=999, ini=200)
for i, c in enumerate(cap11b):
    c['id'] = f'cap-{i:03d}'
avoz = media('voz-asesor-estudio', A11B + 'assets/asesor-voz.wav', 'audio', 'Voz · asesor (voz de estudio)', conv='aac')
musb = media('musica-v11b', A11B + 'assets/musica-b.mp3', 'audio', 'Música · V11b', conv='aac')
DB = B11B['DUR']
tr11b = [track('asesor-intro', 'Voz · asesor (intro)', 'voice', avoz, 0, H, 1),
         track('voz', 'Voz · narrador', 'voice', voz, H - 0.05, A1 - A0 + 0.05, 1, offset=A0 - 0.05),
         track('asesor-c1', 'Voz · asesor (cierre 1)', 'voice', avoz, B_C1, C1[1] - C1[0], 1, offset=C1[0]),
         track('asesor-c2', 'Voz · asesor (cierre 2)', 'voice', avoz, B_C2, C2[1] - C2[0], 1, offset=C2[0]),
         track('musica', 'Música', 'music', musb, 0, DB, 0.07, fadeOut=0.9)]
for k, a, d in B11['MG']:
    tr11b.append(track(f'{k}-audio', f'Animación {MGN[k]}', 'sfx', f'anim-{k}-audio', a + OFF, d, 0.42))
for i, (src, t, d, v) in enumerate(B11B['ev']):
    tr11b.append(track(f'sfx{i:02d}', 'Efecto · ' + os.path.basename(src)[:-4], 'sfx', sfx_asset(src), t, d, v))
P11B = proyecto('doctor-v11b-asesor-legacy', 'Doctor V11b · con asesor · Legacy Capital', 'V11b · con asesor, voz de estudio (16 nov)', DB, sc11b, cap11b, tr11b, TEXTO)

for p in (P11, P11B):
    f = os.path.join(OUT, p['id'] + '.json')
    json.dump(p, open(f, 'w'), ensure_ascii=False)
    print(f"{p['id']}: {len(p['scenes'])} escenas, {len(p['captions'])} subtítulos, {len(p['audioTracks'])} pistas, {len(p['assets'])} assets, "
          f"{p['duration']} s, {os.path.getsize(f) / 1024:.0f} KB")
print('medios:', len(os.listdir(MEDIA)))
