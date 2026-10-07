---
version: alpha
name: Legacy Capital — Frame (video vertical)
description: >
  Verdad de marca de Legacy Capital Real Estate para videos HyperFrames. La unidad es el cuadro
  vertical 1080×1920 (Reels / TikTok). Paleta del brandbook: navy #1A2B4C, oro #C5A564, crema #F5F0E6.
  Escudo con árbol enraizado. "Building wealth for generations". Profesional, confiable,
  sofisticada, generacional. El ritmo, la estructura y la animación vienen de estilo.md; este
  archivo solo manda en color, tipografía y logo.
unit: el cuadro — 1080×1920 (9:16) principal; 1080×1350 (4:5) documentado
principle: los átomos de marca son sagrados · la composición sigue estilo.md · los datos vienen del brief

colors:
  navy: "#1A2B4C"
  navy-deep: "#0F1A2E"
  navy-mid: "#24385F"
  gold: "#C5A564"
  gold-light: "#E3CFA0"
  cream: "#F5F0E6"
  white: "#FFFFFF"
  ink: "#0B1424"
  scrim: "rgba(11,20,36,0.55)"            # degradado detrás de texto sobre render
  card-fill: "rgba(26,43,76,0.85)"        # tarjetas de opciones (equivale al azul #1C5880 de la referencia)
  card-border: "#F5F0E6"
  zone-1: "rgba(197,165,100,0.55)"        # mapa / plano animado: zona 1 (oro)
  zone-2: "rgba(245,240,230,0.45)"        # zona 2 (crema)
  zone-3: "rgba(36,56,95,0.65)"           # zona 3 (navy medio)

fonts:
  # Archivos locales en marca/fonts/ (OFL-1.1). Nunca cargarlos por red al renderizar.
  sans: { family: "Geist", files: ["geist-sans-latin-400-normal.woff2","geist-sans-latin-600-normal.woff2","geist-sans-latin-800-normal.woff2","geist-sans-latin-900-normal.woff2"] }
  display: { family: "Cormorant Garamond", files: ["cormorant-garamond-latin-500-normal.woff2","cormorant-garamond-latin-600-normal.woff2","cormorant-garamond-latin-500-italic.woff2","cormorant-garamond-latin-600-italic.woff2"] }
  caps: { family: "Cinzel", files: ["cinzel-latin-500-normal.woff2","cinzel-latin-700-normal.woff2"] }
  status: "[PENDIENTE] Son las tipografías del sitio legacycapitalmx.vercel.app, no necesariamente las del brandbook. Si el brandbook trae otras, se reemplazan aquí."

typography:
  # Tamaños en px sobre lienzo 1080×1920. Los equivalentes de estilo.md van entre paréntesis.
  caption:       { fontFamily: "Geist", px: 68, weight: 800, lineHeight: 1.1, case: "minúsculas", color: "white", shadow: "0 3px 6px rgba(0,0,0,0.5)" }   # (subtítulos estilo.md §3; Poppins ExtraBold → Geist 800)
  caption-aroll: { fontFamily: "Geist", px: 76, weight: 800, lineHeight: 1.1, color: "white", shadow: "0 3px 6px rgba(0,0,0,0.5)" }
  giant-word:    { fontFamily: "Geist", px: 320, weight: 900, lineHeight: 0.9, tracking: "-0.04em", color: "navy | gold | cream según fondo", opacity: 0.85 }   # (palabra gigante §4 nivel 1)
  bridge:        { fontFamily: "Geist", px: 90, weight: 400, lineHeight: 1.05, color: "white", emphasis: "una palabra en 800" }   # (frase puente §4 nivel 2)
  accent:        { fontFamily: "Cormorant Garamond", px: 96, weight: 600, style: "italic", color: "cream" }   # (reemplaza el script de pincel de la referencia, §4 nivel 3)
  price:         { fontFamily: "Geist", px: 150, weight: 900, tracking: "-0.03em", color: "white", shadow: "0 4px 10px rgba(0,0,0,0.45)" }   # (§4 nivel 4)
  price-currency:{ fontFamily: "Geist", px: 34, weight: 800, color: "gold" }
  price-note:    { fontFamily: "Geist", px: 40, weight: 400, color: "cream" }
  card-title:    { fontFamily: "Geist", px: 66, weight: 800, color: "white" }
  card-text:     { fontFamily: "Geist", px: 50, weight: 700, color: "white" }
  eyebrow:       { fontFamily: "Cinzel", px: 36, weight: 700, tracking: "0.14em", case: "MAYÚSCULAS", color: "gold" }
  legal:         { fontFamily: "Geist", px: 30, weight: 600, color: "white", shadow: "0 2px 4px rgba(0,0,0,0.6)" }   # "Imagen ilustrativa", "Precios en MXN…"
  contact:       { fontFamily: "Geist", px: 40, weight: 600, color: "cream" }

safe-area:
  # CLAUDE.md: nada de texto, logo ni CTA fuera de esta caja en Reels de Meta.
  x: [65, 1015]
  y: [270, 1248]
  tiktok-right-column: "dejar libres ≈ 120 px a la derecha entre y 900–1700 (verificar en vista previa)"

radii:
  card: "28px"
  pill: "999px"

logo:
  file: "marca/logo/crest.png"            # escudo, PNG RGBA 300×391 (tomado de public/brand del sitio)
  alt-file: "marca/logo/crest-512.png"
  status: "[PENDIENTE] Falta SVG o PNG grande y versión con wordmark 'Legacy Capital'. El PNG actual sirve hasta ≈ 300 px de ancho sin perder nitidez."
  min-width: "160px"
  clear-space: "0.25 × ancho del escudo"
  on-dark: "tal cual"
  on-light: "tal cual (es a color); nunca recolorear"

components:
  card-option:
    backgroundColor: "{colors.card-fill}"
    border: "3px solid {colors.card-border}"
    rounded: "{radii.card}"
    height: "200px"
    typography: "{typography.card-text} + check en {colors.gold}"
    description: "Tarjetas apiladas tipo 'Elige entre:' (estilo.md §4 nivel 5). La tarjeta destacada lleva borde {colors.gold} en vez del degradado morado de la referencia."
  zone-overlay:
    fill: "{colors.zone-1} → {colors.zone-2} → {colors.zone-3}"
    typography: "Cinzel 700 MAYÚSCULAS, cream"
    description: "Zonas sobre plano o render (estilo.md §4 nivel 6). Verde, naranja y rojo de la referencia se sustituyen por la paleta."
  legend-chip:
    backgroundColor: "rgba(11,20,36,0.45)"
    rounded: "{radii.pill}"
    typography: "{typography.legal}"
    description: "'Imagen ilustrativa' mientras haya render en pantalla. Abajo a la izquierda del área útil (y ≈ 1190–1240)."
  end-card:
    background: "render con scrim {colors.scrim} o {colors.navy-deep} liso"
    content: "escudo + 'Legacy Capital Real Estate' (Cinzel) + CTA (Geist 800) + contacto del proveedor (Geist 600) + leyendas"
    min-duration: "2.5s"
  cta-pill:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy-deep}"
    rounded: "{radii.pill}"
    typography: "Geist 800, 48px"
---

## Overview

Legacy Capital es el asesor, no el desarrollador: la marca firma, presenta y cierra, pero las imágenes son del desarrollo. Por eso el video se ve "Legacy Capital" en la tipografía, el color de los textos y gráficos, y el cierre, mientras los renders conservan su color original (solo corrección ligera, CLAUDE.md).

## The Frame

- Fondo casi siempre es un render o video del desarrollo a pantalla completa con movimiento (estilo.md §5, §7). El navy liso solo en el cierre o en escenas tipográficas.
- Texto sobre render: siempre con sombra o con un scrim navy en degradado detrás; nunca caja sólida detrás de subtítulos (la referencia no la usa).
- Oro con moderación: una cosa por escena (palabra gigante, check de tarjeta, moneda del precio, CTA). Nunca texto largo en oro sobre cielo claro (contraste bajo): ahí la palabra gigante va en navy.

## Composition Rules

- Todo texto, logo y CTA dentro del área útil (x 65–1015, y 270–1248). Los subtítulos de estilo.md (y ≈ 1460) se suben a y ≈ 1150–1200 en versiones para anuncio.
- Palabra gigante: color según fondo — navy sobre cielo/muro claro, cream sobre fondo oscuro o de noche, oro solo sobre navy o atardecer oscuro.
- Leyenda "Imagen ilustrativa" visible todo el tiempo que haya un render.

## Do's

- Usar los archivos de `marca/fonts/` con `@font-face` local.
- Escudo completo, sin recortes, sin recolorear, con aire alrededor.
- Cifras en pantalla con dígitos y moneda ("$3,982,780 MXN").

## Don'ts

- No usar Poppins ni la script de la referencia (son de la referencia, no de la marca).
- No poner el logo del desarrollador ni el nombre del desarrollo sin el OK del brief (sección 1).
- No aplicar filtros, LUTs ni cambios de color que alteren acabados, cielo o vegetación de los renders.
- No sombras duras ni bordes neón; nada de rojo/verde semáforo (la referencia los usa en el mapa: aquí se usan las zonas de la paleta).
