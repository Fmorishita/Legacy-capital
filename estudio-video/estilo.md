# estilo.md — gramática de edición medida

Fuente: `referencia/referencia.mp4`, analizada el 2026-10-07. Copiamos la gramática de edición, nunca el contenido: ni música, ni clips, ni textos, ni logos.
Material de apoyo en `analisis/`: fotogramas a 2 fps, `hojas/` (hojas de contacto 4×4 con segundo), `transiciones/` (tiras a 10 y 30 fps), `medidas/` (fotogramas con regla en px) y `audio/transcript.json` (palabras con tiempos, whisper `medium`, `es`).

## 0. Cómo leer estas medidas

- La referencia es una **grabación de pantalla** de un anuncio de Facebook (576×1248, 60 fps, 47.01 s, H.264 + AAC estéreo 44.1 kHz). El video ocupa 576×1144 px. Debajo queda la barra de comentarios de Facebook, y encima del video aparecen la interfaz de FB (barra de estado, nombre de la página, botón "Chatear en WhatsApp") y una notificación del sistema entre 1.9 y 3.5 s. Nada de eso es parte de la edición.
- **Conversión al lienzo de 1080×1920 [SUPOSICIÓN]:** se asume que el anuncio original es 9:16 y que Facebook lo escaló a 1144 px de alto, recortando 34 px por lado. Factor = 1920/1144 = **1.678**. Y_lienzo = y_grab × 1.678; X_lienzo = (x_grab + 34) × 1.678; tamaño_lienzo = tamaño_grab × 1.678. Abajo se dan ya convertidos (lienzo) y entre paréntesis el valor en la grabación (grab).
- Medidas de tamaño de letra: ±10 % (medidas sobre píxeles de una grabación comprimida).

## 1. Ritmo

| Medida | Valor |
|---|---|
| Duración | 47.01 s |
| N.º de planos | 16 (15 cambios de plano) |
| Duración de plano | media 2.94 s · mediana 2.58 s · mínima 0.97 s · máxima 6.80 s |
| Cortes por cada 10 s | 3.19 (global) |
| Primeros 3 s | 1 corte (3.3 por 10 s) **más 6 cambios de texto** (≈ 2 eventos de texto por segundo) |
| Tramo b-roll 4.5–14.3 s | 6 cortes → **6.1 por 10 s** (planos de 0.97–2.38 s) |
| Tramo 14.3–47 s | 8 cortes → 2.4 por 10 s (planos largos de 3–6.8 s cargados de gráficos) |
| Dónde caen los cortes | En fronteras de frase de la voz, no en el beat. Mediana: **50 ms antes** de la primera palabra de la frase siguiente (rango −170…+385 ms). Contra el beat de la música (≈ 119.5 BPM) los desfases van de −251 a +234 ms, sin patrón. |

Lista de planos (s):

| # | Inicio–fin | Dur. | Contenido |
|---|---|---|---|
| 1 | 0.00–1.77 | 1.77 | A-roll abierto (presentadora a cuerpo entero junto a alberca) |
| 2 | 1.77–4.55 | 2.78 | A-roll medio (misma presentadora, punch-in por corte) → light leak |
| 3 | 4.55–6.94 | 2.38 | Drone del conjunto + logo del desarrollo |
| 4 | 6.94–8.50 | 1.57 | Fachada de casa + logo |
| 5 | 8.50–9.92 | 1.42 | Detalle (perfil con lentes contra cielo) |
| 6 | 9.92–10.89 | 0.97 | Casa club |
| 7 | 10.89–12.59 | 1.70 | Alberca con camastros |
| 8 | 12.59–14.32 | 1.74 | Alberca + precio grande |
| 9 | 14.32–19.49 | 5.17 | A-roll presentadora 2 caminando hacia cámara |
| 10 | 19.49–26.29 | 6.80 | Alberca infinita + tarjetas "Elige entre:" |
| 11 | 26.29–31.97 | 5.68 | Drone + zonas de entrega coloreadas |
| 12 | 31.97–34.74 | 2.77 | Casas, exterior |
| 13 | 34.74–38.34 | 3.60 | Roof garden (un solo movimiento de cámara) |
| 14 | 38.34–41.40 | 3.06 | A-roll "3" |
| 15 | 41.40–42.70 | 1.30 | A-roll, jump cut → light leak |
| 16 | 42.70–47.01 | 4.31 | Cierre: logo sobre alberca |

Estructura narrativa (por tiempo): gancho con pregunta (0–4.5) → producto en montaje rápido (4.5–14.3) → giro "por primera vez tienes opciones" (14.3–19.5) → opciones en tarjetas (19.5–26.3) → tiempos de entrega en mapa (26.3–32) → beneficio (32–38.3) → resumen "3 y 3" (38.3–42.7) → CTA con logo (42.7–47).

## 2. Gancho (0–2 s)

- **Qué aparece:** a los 0.00 s, la presentadora a cuerpo entero a cuadro con texto ya en pantalla (sin entrada en negro). Encima de ella, "buscas una" (≈ 91 px, regular, minúsculas, blanco) y debajo **"casa" gigante** (≈ 296 px, azul `#15458F`) **detrás de la persona**: la figura tapa las letras. Abajo, "vista al mar" en script blanco (≈ 90 px).
- **Qué se mueve:** las palabras del script **salen palabra por palabra** al ritmo de la voz ("vista al mar" → "al mar" → "mar"). A 1.77 s hay un **corte seco a plano medio** (la cara crece ≈ 2.5×) y a 1.9 s entra "te cuento porqué" con revelado de izquierda a derecha en ≈ 100–200 ms. La cámara se mueve muy poco (≈ −4 % de escala en 1.7 s [SUPOSICIÓN]).
- **Qué suena:** voz desde el cuadro 0 (primera palabra a 0.01 s, sin respiración ni pausa previa) sobre música ya sonando. Pregunta directa al comprador en ≤ 2 s: "¿Buscas una casa con vista al mar?" (7 palabras, 1.92 s).

## 3. Subtítulos

Dos colocaciones, una sola tipografía. **No hay subtítulos mientras la tipografía cinética o los gráficos dicen las mismas palabras** (A-roll 0–4.5 y 14.3–19.5; tarjetas 19.5–25.1).

| Parámetro | Valor |
|---|---|
| Fuente | Geométrica sans tipo **Poppins** [SUPOSICIÓN: la más parecida disponible] |
| Peso | ExtraBold (800) |
| Tamaño | **≈ 68 px** (grab 41) sobre b-roll; **≈ 76 px** (grab 45) sobre A-roll |
| Caja | Minúsculas (mayúscula solo en nombres propios y "¡…!") |
| Color | Blanco `#FFFFFF` |
| Contorno / sombra / caja | Sin contorno ni caja; sombra suave negra ≈ 50 % de opacidad, desplazamiento ≈ 3 px hacia abajo y desenfoque ≈ 6 px [SUPOSICIÓN] |
| Posición Y (centro) | **≈ 1460 px** (grab 870) sobre b-roll; **≈ 1295 px** (grab 772) sobre A-roll. Centrado en X. ⚠ 1460 cae dentro del 35 % inferior: en anuncios va dentro del área útil (y ≤ 1248), según CLAUDE.md. |
| Ancho máximo | ≈ 580 px para 18 caracteres ("lujo estilo resort"), ≈ 54 % del ancho |
| Palabras por bloque | Promedio ≈ 2.6 · máximo 4 ("al precio de hoy", "con vista al mar") |
| Líneas por bloque | 1 |
| Entrada | **Palabra por palabra en su tiempo de voz** (efecto acumulativo): cada palabra aparece con fundido de 1–3 cuadros (33–100 ms), sin escala ni desplazamiento, entre 0 y 170 ms antes de que se pronuncie |
| Salida | El bloque entero se funde en 1–2 cuadros cuando empieza el siguiente |
| Palabra destacada | No se colorea dentro del subtítulo. El énfasis va en la **palabra gigante** del A-roll (sección 4): 1 cada ≈ 1.5–2.5 s mientras habla la presentadora (casa, hoy, opciones, cómo, cuándo, 3) |

## 4. Textos en pantalla (no subtítulos)

| Nivel | Uso | Tamaño (lienzo) | Posición | Tiempo en pantalla | Animación |
|---|---|---|---|---|---|
| 1. Palabra gigante | Palabra clave de la frase en A-roll | **≈ 300–370 px**, bold, minúsculas o cifra | Centro del cuadro (y ≈ 700–1000), **detrás de la persona** | 1.5–2.6 s | Entra ≈ 0.3 s **antes** de pronunciarse, con deslizamiento/desenfoque de 3–4 cuadros (100–130 ms); sale con desenfoque o al corte |
| 2. Frase puente | Rodea a la palabra gigante ("buscas una", "te cuento porqué", "es el", "comprar tu casa", "recibirla") | ≈ 90 px, regular; con una palabra en bold ("porqué", "tu casa") | Justo arriba o abajo de la palabra gigante | 0.5–1.5 s | Revelado izquierda→derecha 100–200 ms |
| 3. Acento script | Frase emocional ("vista al mar", "el mejor momento") | ≈ 90 px, script de pincel blanco | Debajo de la palabra gigante, se cruza con ella | 1–2 s | Escritura/aparición y salida palabra por palabra |
| 4. Precio | Cifra principal | **≈ 155 px** ExtraBold Italic, blanco con sombra; moneda en vertical a la derecha (≈ 30 px); leyenda debajo en Light Italic ≈ 45 px | Arriba (centro y ≈ 340), casi a todo el ancho (≈ 94 %) | 1.6 s | Aparece al decirse la cifra; sale con desenfoque de 3 cuadros |
| 5. Tarjetas de opciones | Lista "Elige entre:" | Título bold ≈ 66 px; tarjetas a todo el ancho de ≈ 200 px de alto, radio ≈ 27 px, borde blanco 3–4 px, relleno azul `#1C5880` ≈ 85 %, check + texto bold ≈ 50 px; la 3.ª tarjeta en degradado morado-magenta | Título y ≈ 450; tarjetas apiladas cada ≈ 125 px desde y ≈ 470 | 6.8 s el bloque; una tarjeta nueva cada ≈ 1.6 s | Líneas blancas que barren desde esquinas opuestas → caja → texto en fundido izquierda→derecha → check; ≈ 0.8 s por tarjeta, empieza ≈ 0.3 s antes de la palabra. Salida inversa ≈ 0.6 s |
| 6. Mapa de zonas | Tiempos de entrega sobre drone | Polígonos translúcidos verde → naranja → rojo con texto condensado en mayúsculas, girado según la perspectiva | Sobre el terreno real, centro del cuadro | 5.7 s; una zona nueva cada ≈ 1.5 s | Barrido de máscara ≈ 0.7 s por zona, sincronizado con la palabra |
| 7. Logo | Logo del desarrollo | ≈ 520 px de ancho | Arriba (y ≈ 200–520) en b-roll; centrado (y ≈ 330–800) en cierre | 3.9 s (planos 3–4) y 4.3 s (cierre) | Entra grande y desenfocado → escala a su tamaño en ≈ 0.4 s |

Colores de las palabras gigantes: `#15458F` (casa), verde oscuro `#223D41` (hoy), `#137090` (cómo/cuándo, con la primera letra en rojo vino `#611F26`), verde azulado `#216A66` (3). Se ven semitransparentes, con ≈ 75 % de opacidad y el fondo asomando [SUPOSICIÓN].

## 5. Visuales / b-roll

| Tipo | Tiempo | % del video |
|---|---|---|
| A-roll (persona a cámara) | 14.1 s (planos 1, 2, 9, 14, 15) | 30 % |
| B-roll del desarrollo (drone, fachadas, amenidades) | 28.6 s (10 planos) | 61 % |
| Cierre con logo | 4.3 s | 9 % |

- Duración media de plano de b-roll: **2.86 s**; en el montaje 4.5–14.3 s, **1.57 s**.
- Todo el b-roll es **metraje en movimiento** (drone, grúa, paneo, travelling). No hay ninguna foto fija.
- Los gráficos (tarjetas, mapa, precio, logo) van **encima del b-roll**, nunca sobre fondo liso.

## 6. Transiciones

| Tipo | Cantidad | % de cambios de plano | Duración |
|---|---|---|---|
| Corte seco | 13 | 87 % | 0 |
| Light leak (destello naranja-azul con rayos y fundido) | 2 (4.10–5.00 s y 42.10–43.30 s) | 13 % | ≈ 27 y 36 cuadros a 30 fps (0.9 y 1.2 s) |

- Los dos light leaks marcan **los cambios de bloque**: gancho → producto y resumen → cierre. Todo lo demás es corte seco.
- Jump cut dentro del A-roll (41.40 s): corte seco en la misma toma, para quitar tiempo.

## 7. Zooms y movimiento

- **Punch-in:** uno, por corte seco (no animado) a 1.77 s: de plano abierto a medio, con la cara ≈ 2.5× más grande. Frecuencia: 1 en 47 s.
- **Movimiento de cámara en b-roll** (medido con correlación de fase, ±50 % [SUPOSICIÓN]): empuje lento de +1.8 a +4.8 % de escala por segundo (fachada, alberca con precio, casas); paneo lateral de 4–7 % del ancho por segundo (alberca infinita, casas, roof garden); el drone avanza en órbita lenta. Curva aparente: lineal, sin ease visible.
- **Logo:** entra con escala grande → 100 % en ≈ 0.4 s, con desenfoque que se aclara.
- Frecuencia: el **100 % de los planos de b-roll** tiene movimiento continuo; ningún plano queda congelado.

## 8. Color

- Temperatura aparente **fría**: RGB medio (94, 130, 143), con el azul por encima del rojo. Domina cielo y agua.
- Contraste medio: luminancia media 121/255, desviación 46. Saturación media 0.44: colores vivos, sin exagerar.
- 5 hex dominantes (zona de video, sin interfaz): `#41A1C7` (34 %), `#637B7C` (22 %), `#3B3C3D` (16 %), `#969A98` (16 %), `#99BCCC` (12 %).
- Grano: no se aprecia. Viñeta: no hay (centro 131 contra bordes 129).

## 9. Sonido

- **Loudness integrada −14.1 LUFS**, pico real **+0.1 dBTP** (satura un poco: nosotros usaremos ≤ −1 dBTP), LRA 3.0 LU (muy comprimido).
- **Música** continua de principio a fin, ≈ 119.5 BPM. Va **≈ 14–16 dB por debajo de los picos de voz**: valles entre sílabas a −28.5 dBFS contra picos de voz a −12.1 dBFS [SUPOSICIÓN: estimado sin separar pistas]. Al terminar la voz (46.5–47.0 s) la música queda sola a −18.6 dBFS RMS, sin fundido de salida.
- **SFX:** no se detectan golpes ni whooshes separables de la voz; los light leaks no tienen un SFX claro [SUPOSICIÓN].
- **Silencios:** ninguno de más de 0.25 s por debajo de −40 dB. La música nunca se detiene.

## 10. Voz

- 123 palabras en 46.5 s de habla: **≈ 159 palabras por minuto** (157 sobre la duración total).
- Locución continua, sin huecos medibles entre palabras (≥ 120 ms) en la transcripción. **Pausa promedio entre frases: no medible porque la música las tapa; se estima ≤ 150 ms [SUPOSICIÓN].**
- Tono: segunda persona ("buscas", "tienes", "elige"), frases cortas encadenadas con "y".
- Hay dos voces distintas de presentadora (plano 9 contra planos 1–2 y 14–15) [SUPOSICIÓN].

## 11. Cierre / CTA

- **Duración: 4.31 s**, entrando con light leak (1.2 s) desde 42.7 s.
- **Qué muestra:** logo del desarrollo centrado, grande, sobre b-roll de alberca con vista al mar, con movimiento suave. La voz dice el CTA ("Agenda un tour privado y conoce …") en subtítulos palabra por palabra.
- No hay texto de contacto en pantalla: el contacto lo pone el botón de WhatsApp del anuncio. ⚠ Para nosotros, CLAUDE.md exige logo + CTA + datos del proveedor + leyendas durante ≥ 2.5 s dentro del área útil.

## 12. Equivalencias sin persona a cuadro

La referencia usa a la presentadora el 30 % del tiempo. Para videos solo con renders, fotos y voz:

| En la referencia | Equivalente sin persona |
|---|---|
| Presentadora a cuerpo entero con la palabra gigante detrás (plano 1) | Render principal (fachada o vista) con la **palabra gigante detrás de un elemento del render** (edificio, palmera, barandal). Requiere separar el primer plano del render: PROPUESTA, porque recorta el render (no genera ni cambia píxeles); necesita tu OK. Sin recorte, la palabra gigante va delante con 75 % de opacidad. |
| Punch-in por corte a plano medio (1.77 s) | **Corte seco a un recorte más cerrado del mismo render** (≈ 2.5× sobre un detalle: terraza, ventanal, alberca). |
| Mirada a cámara + pregunta | **Titular grande** (nivel 1 + nivel 2) en los primeros 0.0–2.0 s, con la voz preguntando. |
| Presentadora caminando hacia cámara (plano 9, 5.2 s) | Render o video con **empuje lento continuo** (+2–4 % de escala por segundo) y la secuencia de palabras gigantes encima. |
| Gestos que marcan el ritmo | Entrada de cada palabra gigante ≈ 0.3 s antes de decirse, con deslizamiento de 100–130 ms. |
| Jump cut del A-roll (41.40 s) | Corte seco a otro encuadre del mismo render. |
| B-roll en movimiento real | Video del desarrollador si existe; si no, **Ken Burns en cada still** (empuje 2–5 %/s o paneo 4–7 %/s, lineal) para que ningún plano quede fijo. |

## 13. Reglas aprendidas

(vacía por ahora)
