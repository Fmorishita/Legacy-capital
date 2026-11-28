#!/usr/bin/env python3
"""Convierte California v2 (fotos) de HyperFrames en un proyecto editable de Legacy Studio.

  python3 california_v2_a_studio.py <media_dir> <salida.json> [--urls blobs.json]

- Lee tomas, tiempos, subtítulos, efectos y cifras de la plusvalía del build.py del video.
- Cada foto es una escena; mapa, plan de pagos, plusvalía proyectada y placa final son escenas con capas
  editables (fondo + textos + tarjetas + gráficas). Voz, música y cada efecto van en pistas separadas.
- Reutiliza los archivos ya subidos por la v1 (fotos C, mapa, fondos, fuentes, música y efectos).
"""
import builtins, io, json, os, shutil, subprocess, sys

V = '/home/user/Legacy-capital/estudio-video/videos/punta-pacifico-california-v2-es/'
MEDIA, OUT = sys.argv[1], sys.argv[2]
URLS = json.load(open(sys.argv[sys.argv.index('--urls') + 1])) if '--urls' in sys.argv else {}
os.makedirs(MEDIA, exist_ok=True)
GOLD, NAVY, CREAM, DARK, INK = '#FFD086', '#1A2B4C', '#F5F0E6', '#071D29', '#0E2A4A'


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


def blob_img(aid, nombre, w=1080, h=1920):
    """Imagen ya subida en otra versión (fondos)."""
    ASSETS[aid] = dict(id=aid, name=nombre, type='image', url=URLS.get(aid, aid + '.png'), width=w, height=h)
    ASSETS[aid]['thumbnail'] = ASSETS[aid]['url']
    return aid


for fam, f in [('PPCondensed', 'OpenSans_Condensed_Bold.ttf'), ('PPText', 'OpenSans_Semibold.ttf'), ('PPBold', 'OpenSans_ExtraBold.ttf'), ('Cinzel', 'cinzel-latin-700-normal.woff2')]:
    media('font-' + fam, V + 'assets/fonts/' + f, 'font', 'Fuente ' + fam, family=fam)
media('crest', V + 'assets/crest.png', 'image', 'Escudo Legacy Capital', width=300, height=391)
IMG = {}
for sid, a, b, img, *_ in B['SC']:
    if img.startswith('c'):
        IMG[img] = media(f'cal-{img}', f'{V}assets/img/{img}.jpg', 'image', f'Foto {img.upper()}', width=941, height=1672)
    elif img == 'bano':
        IMG[img] = media('img-r-bano', f'{V}assets/img/bano.jpg', 'image', 'Render · baño', width=1080, height=1920)
    else:
        IMG[img] = media(f'cal2-{img}', f'{V}assets/img/{img}.jpg', 'image', f'Foto {img.upper()}', width=941, height=1672)
media('cal-mapa', V + 'assets/img/mapa.png', 'image', 'Mapa de conectividad', width=690, height=560)
blob_img('cal-fondo-mg', 'Fondo animaciones (navy con retícula)')
blob_img('fondo-cierre', 'Fondo placa final')

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
TIT = {'c01': 'Hook: trabajas en EE.UU., ganas en dólares', 'c07': '2 habitaciones desde $215,000 USD', 'c14': '3 habitaciones desde $235,000 USD',
       'c10': 'Celular: luces y minisplits', 'c11': 'Cerradura digital', 'bano': 'Equipamiento: baño', 'c15': 'Roof + equipamiento hasta $25,000 USD',
       'b09': 'Fran: más información'}
S = []
for sid, a, b, im, org, s0, s1, x0, x1, hl in B['SC']:
    L = headline(sid, hl[0], hl[1], B['HLTOP'].get(sid, 290)) if hl else []
    rel = lambda t: round(t - a, 3)
    if sid == 'c01':
        tg = rel(T('ganas', 0))
        L += [txt('c01-hook-a', 'TRABAJAS EN EE.UU.', 70, 800, 92, anim='pop', start=0.03, dur=0.32),
              rect('c01-coin', 70, 907, 100, 100, '#E7B54A', 'pop', tg, radius=50, stroke='#FFE7A8', strokeWidth=5),
              txt('c01-coin-t', '$', 70, 920, 62, '#6B4A08', 'PPBold', 'pop', tg, width=100, align='center', shadow=False),
              txt('c01-hook-b', 'GANAS EN DÓLARES', 192, 904, 96, GOLD, start=tg, anim='slide-right', width=820)]
    for s_, hab, val, w in (('c07', '2 HABITACIONES', 215000, '$215'), ('c14', '3 HABITACIONES', 235000, '$235')):
        if sid == s_:
            tw = rel(T(w, 3, pre=True))
            L += [txt(f'{s_}-a', hab, 80, 290, 76, start=0.05),
                  txt(f'{s_}-d', 'DESDE', 80, 380, 40, GOLD, 'PPBold', start=0.2),
                  dict(txt(f'{s_}-n', '', 80, 440, 150, start=round(tw - 0.55, 3), anim='pop', dur=0.55), type='counter', value=val, prefix='$'),
                  txt(f'{s_}-usd', 'USD', 690, 520, 64, GOLD, start=round(tw, 3), anim='pop')]
    if sid == 'c10':
        L += pill('k1', '✓ Luces', 65, 300, 42, rel(T('luces', 4))) + pill('k2', '✓ Minisplits', 65, 410, 42, rel(T('minisplits', 4)))
    if sid == 'c11':
        L += pill('k3', '✓ Cerradura', 500, 860, 42, rel(T('cerradura', 4)))
    if sid == 'c13':
        L += pill('e1', '✓ Cocina', 80, 650, 42, rel(T('cocina', 8)))
    if sid == 'bano':
        L += pill('e1b', '✓ Cocina', 80, 560, 42, 0, anim='none') + pill('e2', '✓ Cuartos', 80, 672, 42, max(rel(T('cuartos', 8)), 0.02)) + pill('e3', '✓ Baño', 80, 784, 42, rel(T('baño', 8)))
    if sid == 'c15':
        L += pill('e4', '✓ Roof garden', 80, 300, 42, rel(T('roof', 8)))
        p0, p1 = rel(B['P15']), rel(B['T25'])
        L += [rect('promo-card', 65, 836, 950, 412, '#0B2A48F2', 'pop', p0, radius=40, stroke=GOLD, strokeWidth=4),
              txt('promo-a', 'VALOR DE HASTA', 540, 850, 54, GOLD, start=p0 + 0.1, width=950, align='center'),
              dict(txt('promo-n', '', 470, 958, 160, start=p0 + 0.15, width=700, align='center', anim='pop', dur=round(max(0.3, p1 - p0 - 0.15), 3)), type='counter', value=25000, prefix='$'),
              txt('promo-usd', 'USD', 860, 1030, 64, GOLD, start=p1, anim='pop'),
              rect('promo-flash', 0, 0, 1080, 1920, '#FFF6E2', 'none', p1, radius=0, opacity=0.75, duration=0.28),
              txt('promo-c', 'EN EQUIPAMIENTO', 540, 1132, 40, font='PPBold', start=p1 + 0.2, width=950, align='center'),
              rect('promo-d-bg', 300, 1186, 480, 52, GOLD, 'pop', p1 + 0.45, radius=26),
              txt('promo-d', 'Al reservar tu casa este mes', 540, 1193, 34, DARK, 'PPBold', 'pop', p1 + 0.45, width=480, align='center', shadow=False)]
    if sid == 'b09':
        tc = rel(T('clic', 12))
        L += [txt('cta-t', 'MÁS INFORMACIÓN', 540, 560, 104, start=0.1, width=1000, align='center', anim='pop'),
              rect('cta-bg', 110, 1050, 860, 116, GOLD, 'pop', tc, radius=58),
              txt('cta-b', 'Haz clic en el botón de abajo ↓', 540, 1083, 44, DARK, 'PPBold', 'pop', tc, width=860, align='center', shadow=False),
              txt('cta-wa', 'WhatsApp', 520, 1186, 40, font='PPBold', start=rel(T('recibir', 12)), width=400, align='right'),
              txt('cta-wa-n', '+52 646 256 3006', 540, 1186, 40, GOLD, 'PPBold', start=rel(T('recibir', 12)), width=500)]
    L += logo(sid, anim=(sid == 'c01'))
    sh = LOW if (sid in B['HLTOP'] or sid in ('c01', 'c15', 'b09')) else SHADE
    titulo = (hl[0] + ' ' + hl[1]) if hl else TIT[sid]
    S.append(scene(sid, f'{sid.upper()} · {titulo}', a, b, IMG[im], L, sh, scale=s0))


def mg_head(sid, eb, title, start=0.1):
    return [txt(f'{sid}-eb', eb, 540, 300, 32, GOLD, 'PPBold', start=0.05, width=1000, align='center'),
            txt(f'{sid}-t1', title, 540, 362, 96, start=start, width=1040, align='center', anim='pop'),
            line(f'{sid}-ru', 465, 478, 150, start + 0.2)]


# ---- mapa
ma, mb = B['MAP']
L = mg_head('mapa', 'CARRETERA PRINCIPAL · EL SAUZAL', 'A UN PASO DE CALIFORNIA')
L += [rect('mapa-marco', 193, 506, 694, 565, GOLD, 'pop', 0.35, radius=32), img('mapa-img', 'cal-mapa', 197, 510, 686, 'pop', 0.35, animationDuration=0.6)]
rows = [('Frontera con San Diego (San Ysidro)', 'aprox. 1 h 30 min', 'frontera'), ('Tijuana', 'aprox. 1 h', 'tijuana'), ('Mexicali', 'aprox. 3 h', 'mexicali')]
for i, (n, t, w) in enumerate(rows):
    t0 = round(T(w, 2) - ma, 3)
    t1 = round(T(rows[i + 1][2], 2) - ma - 0.08, 3) if i < 2 else round(mb - ma, 3)
    L += [rect(f'mapa-r{i}', 65, 1090, 950, 96, '#FFFBF3F7', 'slide-right', t0, radius=26, end=t1),
          txt(f'mapa-r{i}-n', n, 95, 1114, 38 if i == 0 else 40, INK, 'PPBold', 'slide-right', t0, width=600, shadow=False, end=t1),
          rect(f'mapa-r{i}-p', 700, 1103, 300, 70, INK, 'pop', t0 + 0.1, radius=35, end=t1),
          txt(f'mapa-r{i}-t', t, 850, 1117, 36, GOLD, 'PPBold', 'pop', t0 + 0.1, width=300, align='center', shadow=False, end=t1)]
L += [txt('mapa-nota', 'Tiempos aproximados en auto; el cruce fronterizo puede variar.', 540, 1200, 26, '#E9DCC0', 'PPText', 'rise', round(T('frontera', 2) - ma + 0.4, 3), width=1000, align='center')]
L += logo('mapa')
S.append(scene('mapa', 'Animación · mapa y tiempos a la frontera', ma, mb, 'cal-fondo-mg', L, NOSHADE, motion='none', scale=1))

# ---- pagos
pa, pb = B['PAY']
r = lambda t: round(t - pa, 3)
L = mg_head('pagos', 'PLAN DE PAGOS', 'CUIDA TU LIQUIDEZ', 0.12)
L += [rect('pagos-barra', 65, 540, 950, 110, '#FFFFFF14', 'rise', 0.45, radius=24, stroke='#FFD08680', strokeWidth=3),
      rect('pagos-b1', 65, 540, 95, 110, GOLD, 'wipe', r(T('10%', 6)), radius=0),
      rect('pagos-b2', 160, 540, 95, 110, '#C99A2E', 'wipe', r(T('20', 6)), radius=0, dur=1.0),
      rect('pagos-b3', 255, 540, 760, 110, '#2F6E9A', 'wipe', r(T('80%', 6)), radius=0, dur=0.5)]
cards = [('a', 10, 'de enganche', 'A la firma · ej.: $21,500 USD*', 690, T('10%', 6)), ('b', 10, 'en 20 mensualidades', 'En la construcción · ej.: 20 × $1,075 USD*', 880, T('10%', 6, 2)),
         ('c', 80, 'contra entrega', 'Prevista: mediados de 2028', 1070, T('80%', 6))]
for k, n, t, s, y, t0 in cards:
    L += [rect(f'pagos-{k}', 65, y, 950, 170, '#FFFBF3F7', 'pop', r(t0), radius=30),
          dict(txt(f'pagos-{k}-n', '', 99, y + 22, 120, INK, start=r(t0), anim='pop', dur=0.4, shadow=False), type='counter', value=n, suffix='%'),
          txt(f'pagos-{k}-t', t, 349, y + 40, 44, INK, 'PPBold', 'pop', r(t0), width=620, shadow=False),
          txt(f'pagos-{k}-s', s, 349, y + 98, 30, '#8A620C', 'PPBold', 'pop', r(T('prevista', 6)) if k == 'c' else r(t0), width=640, shadow=False)]
L += [txt('pagos-nota', '*Ejemplo con casa de 2 habitaciones desde $215,000 USD.', 540, 1258, 24, '#E9DCC0', 'PPText', 'rise', r(T('10%', 6)) + 0.4, width=1000, align='center')]
L += logo('pagos')
S.append(scene('pagos', 'Animación · plan de pagos 10/10/80', pa, pb, 'cal-fondo-mg', L, NOSHADE, motion='none', scale=1))

# ---- plusvalía proyectada (8% y 10% anual compuesto, como la animación del Doctor)
ga, gb = B['GRO']
CO, OP, BASE, MESES = B['CO'], B['OP'], B['BASE'], B['MESES']
T0, TD = 0.5, 1.6
L = mg_head('plus', 'TU PATRIMONIO', 'PLUSVALÍA PROYECTADA')
L += [rect('plus-card', 40, 520, 1000, 600, '#FFFBF3', 'pop', 0.2, radius=30, stroke='#EAD9B8', strokeWidth=2),
      txt('plus-ct', 'Valor estimado de la casa (USD)', 70, 538, 28, INK, 'PPBold', 'rise', 0.3, width=900, shadow=False),
      rect('plus-lg1', 70, 594, 46, 8, '#C99A2E', 'rise', 0.35, radius=4), txt('plus-lg1-t', 'Conservador · 8% anual', 126, 582, 22, INK, 'PPText', 'rise', 0.35, width=300, shadow=False),
      rect('plus-lg2', 440, 594, 46, 8, INK, 'rise', 0.35, radius=4), txt('plus-lg2-t', 'Optimista · 10% anual', 496, 582, 22, INK, 'PPText', 'rise', 0.35, width=300, shadow=False)]
X = B['X']; yv = B['yv']
pts = lambda vals: [[(40 + x - 40) / 1000, (100 + yv(v)) / 600] for x, v in zip(X, vals)]
L += [dict(id='plus-optimista', type='chart', x=40, y=520, width=1000, height=600, points=pts(OP), color=INK, gridColor='rgba(0,0,0,0)', strokeWidth=8, start=T0, drawDuration=TD, animation='none', enabled=True),
      dict(id='plus-conservador', type='chart', x=40, y=520, width=1000, height=600, points=pts(CO), color='#C99A2E', gridColor='rgba(0,0,0,0)', strokeWidth=8, start=T0, drawDuration=TD, animation='none', enabled=True)]
FR = [0, 0.32, 0.65, 1]
for j, (x, lab) in enumerate(zip(X, B['XL'])):
    L.append(txt(f'plus-x{j}', lab, 40 + x, 520 + 100 + 448, 23, INK, 'PPBold', 'rise', 0.35, width=240, align='center', shadow=False))
for i, (j, vals, col, dy) in enumerate([(0, OP, INK, -40), (1, OP, INK, -44), (1, CO, '#A47611', 44), (2, OP, INK, -46), (2, CO, '#A47611', 46), (3, OP, INK, -46), (3, CO, '#A47611', 48)]):
    x = 40 + X[j] + (56 if i == 0 else 0); y = 520 + 100 + yv(vals[j]) + dy; t = round(T0 + TD * FR[j] + 0.03, 3)
    L += [rect(f'plus-lb{i}', x - 78, y - 22, 156, 44, col, 'pop', t, radius=10),
          txt(f'plus-lb{i}-t', f'${round(vals[j] / 1000):,} mil', x, y - 13, 27, '#FFFFFF', 'PPBold', 'pop', t, width=156, align='center', shadow=False)]
L += [rect('plus-cnt', 226, 638, 380, 92, INK, 'pop', T0, radius=20),
      txt('plus-cnt-a', 'A LA ENTREGA · MEDIADOS 2028', 416, 650, 19, '#FFFFFF', 'PPText', 'pop', T0, width=380, align='center', shadow=False),
      dict(txt('plus-cnt-v', '', 416, 672, 46, GOLD, start=T0, anim='pop', dur=round(TD * 0.32, 3), width=380, align='center', shadow=False), type='counter', value=round(OP[1]), prefix='$'),
      rect('plus-panel', 40, 1132, 1000, 116, '#F6E9D4', 'rise', T0 + TD + 0.3, radius=26),
      txt('plus-panel-h', 'ENTREGA · MEDIADOS 2028', 540, 1138, 24, INK, 'PPBold', 'rise', T0 + TD + 0.3, width=1000, align='center', shadow=False),
      txt('plus-co', f'CONSERVADOR 8%: ${round(CO[1]):,} · plusvalía ${round(CO[1] - BASE):,}', 80, 1172, 22, '#8A620C', 'PPBold', 'rise', T0 + TD + 0.35, width=460, shadow=False, lineHeight=1.3),
      txt('plus-op', f'OPTIMISTA 10%: ${round(OP[1]):,} · plusvalía ${round(OP[1] - BASE):,}', 570, 1172, 22, '#8A620C', 'PPBold', 'rise', T0 + TD + 0.4, width=460, shadow=False, lineHeight=1.3),
      txt('plus-f1', f'Cálculo: ${BASE:,} × (1 + tasa anual)^(meses/12). Mediados de 2028: {MESES[1]} meses; 2031: 5 años; 2034: 8 años.', 540, 1256, 22, '#E9DCC0', 'PPText', 'rise', T0 + TD + 0.5, width=1040, align='center'),
      txt('plus-f2', 'Supuestos de apreciación anual compuesta de 8% y 10%. Escenario ilustrativo, no garantizado.', 540, 1288, 22, '#E9DCC0', 'PPText', 'rise', T0 + TD + 0.55, width=1040, align='center')]
L += logo('plus')
S.append(scene('plusvalia', 'Animación · plusvalía proyectada en USD (8% y 10%)', ga, gb, 'cal-fondo-mg', L, NOSHADE, motion='none', scale=1))

# ---- placa final
e0, dur = B['END0'], B['DUR']
L = [img('fin-crest', 'crest', 540, 330, 230, 'pop', 0.05, align='center', animationDuration=0.4),
     txt('fin-brand', 'LEGACY CAPITAL', 540, 650, 58, font='Cinzel', anim='rise', start=0.25, width=1000, align='center'),
     txt('fin-re', 'REAL ESTATE', 540, 728, 28, GOLD, 'PPText', 'rise', 0.35, width=1000, align='center'),
     txt('fin-mas', 'MÁS INFORMACIÓN', 540, 830, 110, anim='rise', start=0.4, width=1000, align='center'),
     rect('fin-cta', 120, 990, 840, 116, GOLD, 'pop', 0.5, radius=58),
     txt('fin-cta-t', 'Haz clic en el botón de abajo ↓', 540, 1023, 44, DARK, 'PPBold', 'pop', 0.5, width=840, align='center', shadow=False),
     txt('fin-wa', 'WhatsApp', 520, 1140, 40, font='PPBold', anim='rise', start=0.6, width=400, align='right'),
     txt('fin-wa-n', '+52 646 256 3006', 540, 1140, 40, GOLD, 'PPBold', 'rise', 0.6, width=500)]
S.append(scene('fin', 'Placa final · Legacy Capital y botón', e0, dur, 'fondo-cierre', L, NOSHADE, motion='none', scale=1))
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
voz = media('cal2-voz', V + 'assets/voz.wav', 'audio', 'Voz · locutor Qwen3-TTS (gratuito, Apache 2.0)', conv='aac')
mus = media('cal-musica', V + 'assets/musica.mp3', 'audio', 'Música · Happy Times (Mixkit)', conv='aac')
tracks = [track('voz', 'Voz · narrador', 'voice', voz, 0, B['VOZ_FIN'] + 0.2, 1), track('musica', 'Música', 'music', mus, 0, DUR, B['MV'], fadeOut=0.7)]
for i, (k, t, v) in enumerate(B['ev']):
    f, d = B['SFX'][k]
    tracks.append(track(f'sfx{i:02d}', f'Efecto · {f}', 'sfx', sfx_asset(f), t, d, v))

SCRIPT = open(V + 'guion.txt').read().strip()
used = {s['mediaId'] for s in S} | {l.get('assetId') for s in S for l in s['layers']} | {t['assetId'] for t in tracks}
P = dict(schemaVersion=1, id='california-v2-fotos-legacy', title='California v2 · fotos · Legacy Capital', version='California v2 · guion V2 con cambios de Fran (18 nov)',
         width=1080, height=1920, fps=30, duration=DUR,
         brand={'name': 'Legacy Capital', 'logoAssetId': 'crest', 'colors': {'navy': NAVY, 'gold': GOLD, 'cream': CREAM, 'price': GOLD}},
         script=SCRIPT, voiceScript=SCRIPT, voiceStatus='synced', scenes=S, assets=[a for a in ASSETS.values() if a['id'] in used or a['type'] == 'font'],
         captions=caps, audioTracks=tracks, overlays=[], comments=[], references=[],
         subtitleStyle=dict(fontFamily='PPBold', fontWeight=400, fontSize=60, color='#FFFFFF', highlightColor=GOLD, background='#0719298C', animation='word', enabled=True),
         source={'version': 'California v2', 'hyperframes': 'estudio-video/videos/punta-pacifico-california-v2-es'},
         constraints={'visibleBrand': 'Legacy Capital'}, createdAt='2026-11-18T12:00:00Z', updatedAt='2026-11-18T12:00:00Z')
json.dump(P, open(OUT, 'w'), ensure_ascii=False)
print(f"{P['id']}: {len(S)} escenas, {len(caps)} subtítulos, {len(tracks)} pistas, {len(P['assets'])} assets, {DUR} s")
print('sin subir:', sorted(a['id'] for a in P['assets'] if not (str(a['url']).startswith('/_blob/') or str(a['url']).startswith('assets/audio/'))))
