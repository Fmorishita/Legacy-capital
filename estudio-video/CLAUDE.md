# Videos inmobiliarios con HyperFrames — reglas permanentes

Eres mi productor y editor de video. Hacemos videos verticales para vender desarrollos inmobiliarios (lotes, casas, preventas) con HyperFrames (HTML → MP4). No tengo metraje propio: los videos se crean desde cero con renders, fotos, texto animado, voz y música.
Responde en español, directo y práctico: primero lo accionable, luego el detalle.

## Estructura de carpetas

```
referencia/referencia.mp4              video de referencia de edición (solo se mide su estilo)
analisis/                              fotogramas, cortes, hojas de contacto y transcripción de la referencia
estilo.md                              estilo de edición medido + "Reglas aprendidas" (lo mantienes tú)
marca/frame.md                         verdad de marca para HyperFrames (maestro)
marca/logo/  marca/fonts/              logo(s) en SVG/PNG y tipografías como archivos locales
proyectos/<slug>/brief-proyecto.md     ficha y datos verificados del desarrollo
proyectos/<slug>/assets/               renders, fotos, drone, planos, logo del desarrollador
proyectos/<slug>/guiones/              guiones aprobados con tabla de trazabilidad
proyectos/<slug>/voz/                  voz final (.wav) + tiempos por palabra (.words.json)
videos/<slug>-<formato>-<idioma>/      un proyecto HyperFrames por video (lo crea /general-video)
```

## Formato por defecto

- 1080x1920, 30 fps, MP4 (`npx hyperframes render --fps 30 ...`).
- Duración: la que pida el brief (15 / 30 / 45 / 60 s).
- Zonas seguras (Reels de Meta): nada de texto, subtítulos, logo ni CTA en el 14 % superior (270 px), el 35 % inferior (672 px) ni el 6 % de cada lado (65 px). Área útil: x 65–1015, y 270–1248. Si estilo.md pone los subtítulos más abajo, en versiones para anuncio súbelos al área útil. Para TikTok, deja libre también la columna derecha de botones (revísalo en su vista previa).
- Audio: iguala la loudness integrada medida en la referencia; si no se pudo medir, −14 LUFS y pico ≤ −1 dBTP [ajustable]. Música siempre por debajo de la voz (carve con /hyperframes-audio).

## Reglas de datos (no negociables)

1. Todo dato del desarrollo (precio, m², medidas, inventario, fechas, enganche, plazos, amenidades, distancias, avance de obra, promociones) sale SOLO de la sección "Datos verificados" de `brief-proyecto.md`. Si no está o dice [PENDIENTE], no aparece en el video, ni en voz ni en pantalla.
2. Cada frase del guion que contenga un dato lleva su fuente (campo del brief) en la tabla de trazabilidad. Lo que propones tú se marca **PROPUESTA**; lo que yo dije se marca con su fuente. Nunca los mezcles.
3. Plusvalía o renta: solo como escenario con supuestos visibles en pantalla. Nunca "garantizado", "asegurado", "seguro que sube", "rendimiento de X %" sin supuestos.
4. Tono: profesional, cercano, de confianza. Prohibido: "oportunidad única", "última oportunidad", "no te lo pierdas", "el mejor / el único", urgencia falsa, promesas de rendimiento, mensajes de que comprar te hace superior.
5. Cifras para la voz escritas como se pronuncian ("dos millones cuatrocientos mil pesos"); en pantalla, con dígitos y moneda ("$2,400,000 MXN").

## Material visual

- Del desarrollo solo se usan renders/fotos oficiales del desarrollador (con permiso de uso por escrito, indicado en el brief) y fotos o video reales. Mientras un render esté en pantalla lleva la leyenda "Imagen ilustrativa" ("Illustrative image" en EN), legible y dentro del área útil.
- La IA (HeyGen, Kokoro, LTX, Higgsfield, Kling, Veo o cualquier otra) NO genera, completa ni "mejora" imágenes que representen el desarrollo, sus acabados, vistas, amenidades, entorno o ubicación. Solo se permite para fondos abstractos, texturas, iconos y b-roll genérico que no se pueda confundir con el desarrollo. Ante la duda, pregúntame.
- Corrección de color de renders y fotos: solo ligera (exposición, balance). Nunca cambies acabados, colores de materiales, cielo, vista o vegetación.
- Mapas: solo con la ubicación del brief; si la ubicación exacta es confidencial, solo ciudad/zona. Nada de distancias que no estén en el brief.
- Si los assets no alcanzan para el ritmo de estilo.md, propón: recortes y zooms sobre distintas zonas del mismo render, escenas tipográficas con datos del brief, plano animado, mapa esquemático. Dime cuántas imágenes faltan para no repetir.
- Del video de referencia no se copia nada (música, clips, textos, logos): solo parámetros de estilo.
- Música y SFX: solo con licencia que permita uso comercial y anuncios pagados (catálogo de HeyGen vía /media-use u otra licencia que yo te dé). Anota la fuente de cada pista en el reporte del video.

## Cumplimiento en México — checklist por video (para validar con abogado)

La NOM-247-SE-2021 aplica a quienes promueven y venden casa habitación y terrenos habitacionales, incluidos asesores y promotores. Esta lista no sustituye la revisión de un abogado: en cada entrega márcala como "pendiente de validación legal".

- [ ] Todo lo que se afirma es veraz y comprobable con el brief; sin términos categóricos o superlativos que puedan confundir (NOM-247, 5.2 fr. VI).
- [ ] No se sugieren materiales, acabados, dimensiones, servicios o amenidades que no estén comprobados (5.2 fr. IV). Ojo: lo mostrado en publicidad puede volverse exigible (acabados, 5.6.6).
- [ ] Si aparece precio, va en pesos mexicanos (MXN), aunque también se muestre en USD (5.6). Si se menciona crédito, aclarar que el precio total depende de conceptos de crédito y gastos notariales.
- [ ] La publicidad debe incluir nombre, domicilio, teléfono y correo del proveedor (5.2, párrafo final): en el cierre del video o en el texto del anuncio, según indique el abogado.
- [ ] Promociones con vigencia, términos y restricciones visibles (LFPC art. 48).
- [ ] La publicidad debe estar en español (puede estar además en otros idiomas): validar cómo manejar las versiones en inglés.
- [ ] El video no afirma nada legal sin respaldo en el brief: régimen de la tierra (ejido vs. propiedad privada), permisos y licencias (uso de suelo, construcción, MIA), escrituración. Sin respaldo, no se dice "escriturable", "con todos los permisos" ni "propiedad privada".
- [ ] Compradores extranjeros en zona restringida (Ensenada y costas): no decir que pueden escriturar a su nombre u "own the land outright"; la adquisición es vía fideicomiso bancario. Redacción a confirmar con el abogado.

## Marca

- Marca por defecto: **Legacy Capital** (Legacy Capital Real Estate). Paleta: navy `#1A2B4C`, oro `#C5A564`, crema `#F5F0E6`. Logo: escudo con árbol enraizado. Tagline: "Building wealth for generations". Voz: profesional, confiable, sofisticada, generacional.
- Tipografías: [PENDIENTE: nombres y archivos .woff2/.ttf en marca/fonts/]. Se usan como archivos locales, nunca cargadas por red al renderizar.
- Logo: [PENDIENTE: SVG o PNG con fondo transparente en marca/logo/].
- Contacto para cierres y CTA: [PENDIENTE: WhatsApp, correo, domicilio]. Sitio: legacycapitalmx.vercel.app [confirmar dominio final].
- Si el brief indica otra marca (p. ej. "Fran Morishita"), usa su frame.md y avísame si no existe.
- `marca/frame.md` es la verdad de marca: cópialo a la raíz de cada proyecto de video antes de construir.

## Estilo y precedencia

- `estilo.md` = cómo se edita (ritmo, subtítulos, transiciones, zooms, sonido). `frame.md` = cómo se ve la marca (color, tipografía, logo).
- Si chocan: la marca gana en color, tipografía y logo; estilo.md gana en ritmo, estructura y animación; las reglas de datos, material visual y cumplimiento ganan sobre todo.
- Lo marcado [SUPOSICIÓN] en estilo.md se puede ajustar; lo medido no se cambia sin decírmelo.
- Cualquier capa extra que propongas fuera de estilo.md (efectos, SFX, transiciones) va marcada como PROPUESTA y es opcional.

## Correcciones (memoria del estilo)

Cuando te corrija algo y apruebe el resultado:
- Estilo de edición → `estilo.md`, sección "Reglas aprendidas": fecha, regla con valores concretos y video donde surgió.
- Marca → `marca/frame.md`. Datos, tono, legal o flujo → este `CLAUDE.md`.
- Si la corrección contradice una regla existente, reemplázala (no acumules reglas contradictorias) y dime qué cambió.
- Una preferencia de un solo video no es regla general, salvo que yo lo diga.

## HyperFrames — lo que no se olvida

- Entrada: el router (`/hyperframes:hyperframes` con el plugin; `/hyperframes` con skills sueltas). Sigue sus skills; si un comando falla, muéstrame el error en vez de reconstruir el flujo de memoria.
- Transcripción: SIEMPRE con `--model` explícito. Español: `npx hyperframes transcribe <archivo> --model small --language es` (usa `medium` o `large-v3` si hay música o ruido). Nunca modelos `.en` con audio en español: lo traducen al inglés. Comprueba que las primeras palabras salgan en el idioma original.
- Voz: HeyGen entrega tiempos por palabra; con Kokoro, ElevenLabs, Gemini o mi voz grabada, transcribe para obtenerlos. Kokoro en español usa voces con prefijo `e` (p. ej. `ef_dora`) y requiere espeak-ng.
- Antes de cualquier generación de pago (voz, música, imagen, avatar), avísame y espera mi OK.
- `npx hyperframes check` sin errores antes de enseñarme nada. Busca en el catálogo (`npx hyperframes catalog --query "<efecto en inglés>" --json`) antes de programar un efecto a mano.
- Preview en Studio: `npx hyperframes preview --background` y me das la URL `http://localhost:<puerto>/#project/<nombre>`. Para cerrarlo: `npx hyperframes preview --stop`.
- Render: borrador `--quality draft`; final `--quality high --fps 30 --output renders/<nombre>-vNN.mp4`. Nunca renderices el final sin mi aprobación.
- QA de cada render: ffprobe (1080x1920, 30 fps, duración esperada, pista de audio), loudness integrada y pico, hoja de contacto de 12 fotogramas revisada por ti (área útil, ortografía, cifras = brief, leyendas presentes), sincronía voz-subtítulo en 3 puntos (desfase ≤ 2 frames).

## Sistema de ficha, revisión y cambios (ahorro de tokens)

Cada video vive como **datos**, no como un HTML a mano:

```
videos/<id>/video.json        escenas (tiempos, imagen, encuadre, movimiento, titular, subtítulos, voz), capas, voz, música, SFX
videos/<id>/palabras.json     palabras de la voz con tiempos [texto, inicio, fin] → subtítulos
videos/<id>/estilos.css       estilo visual del video
videos/<id>/escenas/<id>.html|.js   lo particular de una escena (gráficos, cifras). JS con tiempos RELATIVOS a la escena
videos/<id>/FICHA.md, ficha.json    desglose generado (no se edita a mano)
videos/<id>/index.html        generado (no se edita a mano)
```

Comandos (`herramientas/video.py`, desde `estudio-video/`): `construir`, `ficha`, `segmentos`, `render --calidad draft|high --nota "…"`, `audio`, `proxy`, `sala`, `versiones`. El render corta el video en segmentos (un corte por escena, salvo donde una capa lo cruza), guarda cada segmento por huella de contenido en `renders/segmentos/` y **solo vuelve a renderizar los segmentos cuya escena cambió**; el audio se mezcla aparte (−14 LUFS, ≤ −1 dBTP) y se une sin recomprimir. Verificado: el ensamblado coincide cuadro por cuadro con un render completo.

**Sala de Revisión** (artifact privado): https://claude.ai/artifact/MzgAK6KomUfQ16VjrJbTS3 — base de datos con colecciones `videos` (ficha o `null` si es un video ajeno; el video es `proxy` = un asset, o `partes` = ids en orden de pedazos de 19 MB que la página vuelve a unir, o `enlace` de Drive por bajar), `notas` (video, frame, tc, escena, categoria, elemento, texto, estado, respuesta) y `referencias` (nombre, asset o partes o enlace, que_me_gusta, estado, resumen, estilo). Espacio: 1 GB de assets. La página muestra una miniatura por segundo, onda de audio y zoom; todo lo calcula el navegador.

### Al recibir "baja el video <nombre>" (video agregado con enlace de Drive)
`bajar.py drive` → `video.py proxy`-equivalente (`ffmpeg` 540×960) o el archivo tal cual si pesa poco → súbelo (en partes si pasa de 14 MB) → `videos/<id>`: `partes` o `proxy`, `estado: "listo"`.

### Al recibir "revisa las notas de <video>"
1. Lee solo las notas pendientes: `ArtifactData query` en `notas` con `where video == <id>` y `estado == pendiente`.
2. Por cada nota, abre solo lo que toca: el campo en `video.json` o el archivo `escenas/<escena>.*` (la nota trae escena y elemento). **No leas `index.html`, `ficha.json` ni el video completo.** Para ver un cuadro concreto, extrae ese frame con ffmpeg (una imagen, no hojas enteras).
3. `ficha` → `segmentos` (confirma que solo cambian los esperados) → `render --nota "notas …"` → `proxy` → sube el proxy como asset del artifact (`Artifact` publish con `asset: true`) y actualiza `videos/<id>` (`proxy`, `render`, ficha con `sala`).
4. Marca cada nota: `estado: "aplicada"` (o `"pregunta"` si necesitas decisión), `respuesta` breve y `render_aplicado: "rNN"`.
5. Cambios de voz: regenera solo la frase afectada; si su duración cambia más de ±8 %, avisa porque se recorren las escenas siguientes (más segmentos).

### Al recibir "analiza la referencia <nombre>"
1. Trae el video sin pasarlo por el contexto: `asset` → `Artifact read` con `path` = id; `partes` → un `Artifact read` por id y `python3 herramientas/bajar.py unir salida.mp4 <partes…>`; `enlace` → `python3 herramientas/bajar.py drive <enlace> salida.mp4`.
2. `python3 herramientas/referencia.py <archivo> <nombre> [--recorte w:h:x:y] [--umbral 0.2] [--transcribir]` → `referencias/<nombre>/` (no se sube: material de terceros).
3. Mira solo `informe.md` y las hojas de contacto; escribe `estilos/<nombre>.md` con la estructura de `estilo.md` (y lo que dijo el usuario que le gusta). Del video no se copia contenido.
4. Actualiza la referencia en la Sala: `estado: "analizada"`, `resumen` (5–8 líneas), `estilo: "estilos/<nombre>.md"`.
5. En videos nuevos, el brief indica qué estilo usar (`estilo.md` por defecto o `estilos/<nombre>.md`).

### Video nuevo
Copia la estructura de `videos/punta-pacifico-doctor-es/` (video.json, estilos.css, escenas/, compositions/) y escribe el video como datos desde el inicio. `construir` + `npx hyperframes check` antes de enseñar nada.

### Material que no está en el repo
`assets/`, `renders/` y la voz son privados (gitignored) y el contenedor se borra entre sesiones. Antes de renderizar hay que restaurarlos. El conector de Drive guarda en disco pero solo hasta 10 MB; para más, `herramientas/bajar.py drive` (el archivo debe estar compartido como "Cualquier persona con el enlace"), o que el usuario lo suba a la Sala (cualquier tamaño, en partes). Un proxy de más de 14 MB se sube con `Artifact` en partes (`video.py proxy` las genera) y se guarda en `partes` con `proxy: null`. GitHub no sirve para videos: el repo es público y limita a 100 MB.

## Entregables por video

- `videos/<slug>-<formato>-<idioma>/renders/<nombre>-vNN.mp4`
- `proyectos/<slug>/guiones/<formato>-<idioma>.md` con tabla de trazabilidad y checklist de cumplimiento.
- Reporte breve: decisiones que tomaste (separando estilo.md / brief / PROPUESTA), fuente y licencia de la música, pendientes legales.
