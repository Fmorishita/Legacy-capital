# Empresario V8 · Punta Pacífico · Legacy Capital (es)

Guion de Fran: `Guion_empresariosV7.md` (Drive, carpeta «DUEÑO O DIRECTOR - INVERSION Y USO PROPIO»).
Video: `videos/punta-pacifico-empresario-v8-es/` · 1080×1920 · 30 fps · 60.1 s · −14.1 LUFS · pico −1.9 dBTP.

## Qué cambió frente a V7 (correcciones de Fran, 21 nov 2026)

| Pedido de Fran | Qué se hizo |
|---|---|
| No le gustaron las animaciones de V7; usar las de Doctor o California | Edición y animaciones de California v9: titulares en dos líneas (blanco + dorado) con raya, subtítulos palabra por palabra en píldora, entrada de cada toma con zoom y desenfoque, destellos, sacudidas en cifras, light leaks. Mapa, precios con conteo, plan de pagos en tarjetas y panel de promoción con rayos, todos con datos en MXN |
| Equipamiento: una foto de cada cosa | Renders del desarrollador: recámara con clósets (v23), sala con minisplit (v20, con un halo dorado sobre el aparato), baño (v24) y roof con pérgola (roofeq). Los ✓ se acumulan como en California. Luego un panel con las 4 fotos y el contador de $450,000 MXN |
| Quitar la barra de arriba | Quitada. El logo vuelve abajo al centro, como en California v9, y sube arriba en el cierre |
| Ningún texto sobre caras ni sobre lo más relevante | Zonas protegidas por foto: caras detectadas con YuNet (`faces.json`) y objetos marcados a mano (`protect.json`: entrada y pérgola, copas, documento, tablet, clóset, minisplit, baño, manos de Fran…). `build.py` coloca titulares y subtítulos solo donde no tapan nada (prueba alturas, tamaños y titulares de una línea). `qa_textos.cjs` lo comprueba en Chromium cada 0.1 s con el zoom real: **0 textos sobre caras u objetos**. El logo se oculta en las 4 tomas donde los taparía |
| Imágenes que cambian muy rápido | Una foto por frase: tomas de 2.6 a 4.6 s; animaciones de 3.6 a 7.3 s. Solo el equipamiento cambia con cada palabra (0.8–1.3 s), como en los dos videos anteriores |
| Mejor música, sonidos y efectos | Música nueva editada a compás, foley por escena y mezcla con ducking (ver abajo) |

## Voz en off (un solo archivo)

Microsoft Edge TTS, voz **es-MX-JorgeNeural**, velocidad +3 %, tono −4 Hz. Va un poco más lenta que en V7 y con pausas cortas en la lista del equipamiento («clósets… minisplits… baños… y roof garden»), para que cada foto dure más.
Tiempos por palabra del propio motor (`voz.words.json`), compensados +75 ms. Medido en 6 palabras que van después de una pausa: la voz se oye ~80 ms después de lo que marca el motor.
El texto es el de Fran; solo cambia la escritura para que se pronuncie bien: «ruf», «ruf gárden», «Légasi Cápital», cifras en letra.
Acento: mexicano neutro, no norteño.

## Tomas (fotos para Seedance 2.5)

| Seg. | Toma | Foto | En pantalla |
|---|---|---|---|
| 0.0–3.2 | s01 | a-empresario (IA) | Gancho «DUEÑO O DIRECTOR / DE EMPRESA» con maletín |
| 3.2–6.0 | s02 | l-barandal (IA) | UNA CASA / FRENTE AL MAR |
| 6.0–8.6 | s03 | n-brindis (IA) | PARA DISFRUTAR / Y PARA INVERTIR |
| 8.6–12.8 | MAP | mapa | NUEVO DESARROLLO RESIDENCIAL · ENSENADA, BAJA CALIFORNIA; el mapa se abre desde «El proyecto» y se acerca al pin |
| 12.8–16.0 | s04 | d-fachada (IA) | CASAS DE / UN NIVEL |
| 16.0–20.6 | s05 | i-roof-sofa (IA) | DESDE $3,900,000 MXN · HASTA $4,900,000 MXN (conteo que termina con la voz) |
| 20.6–23.6 | s06 | k-familia (IA) | DISFRÚTALA EN FAMILIA |
| 23.6–27.7 | s07 | j-llegada (IA) | RENTAS DE CORTA ESTANCIA + «Escenario ilustrativo; ingresos no garantizados.» |
| 27.7–32.2 | s08 | m-asesoria (IA) | CUIDA TU / FLUJO DE CAPITAL |
| 32.2–39.5 | PAY | animación | TU PLAN DE PAGOS: 10 % de enganche · 10 % en 20 mensualidades · 80 % contra entrega |
| 39.5–42.3 | s09 | b-firma (IA) | RESERVA ESTE MES / EQUIPAMIENTO INCLUIDO |
| 42.3–46.3 | e1–e4 | renders v23, v20, v24, roofeq | ✓ Clósets · ✓ Minisplits · ✓ Baños · ✓ Roof garden |
| 46.3–49.9 | PRO | animación | Las 4 fotos + VALOR DE HASTA $450,000 MXN EN EQUIPAMIENTO · «Al reservar tu casa este mes» · «Aplican términos, condiciones y vigencia de la promoción.» |
| 49.9–53.6 | s10 | c-roof-vino (IA) | CONSTRUYE PATRIMONIO |
| 53.6–60.0 | s11 | h-fran-cta (IA) | CONOCE MÁS · botón «Haz clic en el botón de abajo ↓» · WhatsApp +52 646 256 3006 · logo arriba |

Fotos de la carpeta «Escenas de IA» sin usar: e-asador, f-pickleball y g-alberca (el guion no menciona amenidades).
Para Seedance 2.5 sirven las 11 fotos IA de la tabla; las 4 de equipamiento son renders.

## Tabla de trazabilidad

| Dato | Voz / pantalla | Fuente |
|---|---|---|
| Ensenada, Baja California | Voz + título del mapa | Guion Fran |
| Casas de un nivel, roof privado, vista al mar | Voz + titular | Guion Fran |
| $3,900,000 a $4,900,000 MXN | Voz «desde tres punto nueve hasta cuatro punto nueve millones de pesos» + pantalla | Guion Fran (= Doctor V10) |
| Renta de corta estancia | Voz «alto potencial» + leyenda «Escenario ilustrativo; ingresos no garantizados» | Guion Fran · leyenda PROPUESTA (regla 3) |
| 10 % enganche, 10 % en 20 mensualidades, 80 % contra entrega | Voz + tarjetas | Guion Fran |
| Ejemplos: $390,000 MXN; 20 × $19,500 MXN | Tarjetas, con «*Ejemplo con una casa de $3,900,000 MXN.» | PROPUESTA: cálculo sobre el precio de Fran |
| Equipamiento (clósets, minisplits, baños, roof garden) hasta $450,000 MXN al reservar este mes | Voz + fotos + panel | Guion Fran · leyenda de términos PROPUESTA (LFPC 48) |
| Mapa con «El proyecto» (El Sauzal, Ensenada) | Mapa | Mapa ya aprobado en California (sin distancias, porque el guion no las trae) |
| WhatsApp +52 646 256 3006 | Cierre | El mismo de California v9 |

Sin fecha de entrega en pantalla: el guion no la menciona y sigue pendiente decidir entre mediados y diciembre de 2028.

## Música y efectos

- Música: «Driving Ambition», Ahjay Stelino (Mixkit, pista 32). Mixkit Stock Music Free License: uso comercial y en anuncios, sin atribución. Fuente: https://assets.mixkit.co/music/32/32.mp3
  - Se editó a compás (100 BPM) con `mezcla.py`.
  - El platillo del coro (38.548 s de la pista) cae justo en «Conoce», cuando entra el mapa.
  - Se quitaron 2 compases para que el final real de la pista entre en el corte al CTA (53.6 s). Su golpe intermedio cae en «con Legacy» y el último remata el logo a los 59.0 s.
  - El final no es un desvanecido.
- Efectos de Mixkit Sound Effects Free License. Por escena:
  - **Ambiente:** olas con pájaros (1185) en el barandal y el brindis; mar lejano (1191) en el roof y el cierre; fogata (1329) en «Construye patrimonio».
  - **Escenas:** choque de copas (2936) en el brindis y en el roof; firma en papel (2368) en la reserva; aire frío (1172) en el minisplit; agua (1317) en el baño.
  - **Cifras:** monedas (1999, 1993, 1992), riser (790) e impacto (2908) en los $450,000.
  - **Transiciones:** whoosh distintos (1481, 1468, 2632, 3115, 1464, 1492) colocados por el pico de cada sonido en el corte; impacto en el coro (1143).
  - **Interfaz:** clics en los ✓ (1120) y en el botón (2568); destellos (2350, 3083).
  - **Además:** los efectos sintéticos de California y Doctor.
- Mezcla:
  - Voz con EQ de presencia, de-esser y compresión, a −16 LUFS.
  - Música a −17.1 LU bajo la voz mientras se habla; baja sola hasta 6 dB cuando entra la voz y sube en las pausas.
  - Master final a −14 LUFS y pico ≤ −1.9 dBTP.
- Pistas separadas (voz, música, efectos) en `videos/punta-pacifico-empresario-v8-es/audio/`; no se suben al repo.

## QA del borrador

- ffprobe: 1080×1920, 30 fps, 60.1 s, audio estéreo.
- Loudness: −14.09 LUFS, true peak −1.89 dBTP.
- `npx hyperframes check`: 0 errores (layout y contraste).
- `qa_textos.cjs`: 0 muestras de texto sobre caras u objetos protegidos. Lo único fuera del área útil son instantes de animación de entrada (escala o deslizamiento de 0.1 s), además del logo y del botón/WhatsApp del cierre, igual que en California v9.
- Sincronía: el audio del render y la mezcla van alineados a 3 ms. El resaltado de cada palabra va 0.8–1.6 cuadros antes de que se oiga la voz.

## Checklist de cumplimiento (pendiente de validación legal)

- [x] Precio en MXN.
- [ ] «Frente al mar Pacífico»: confirmar que es literal (en otros videos se dice «vista al mar»).
- [x] Renta como potencial, con leyenda de escenario no garantizado.
- [ ] Promoción «este mes»: la leyenda dice «Aplican términos, condiciones y vigencia de la promoción». Falta la vigencia real.
- [ ] Datos del proveedor (domicilio, correo) en el video o en el texto del anuncio.
- [ ] Fotos con personas generadas con IA y renders: validar su uso.
- [ ] Ejemplos de pago calculados (PROPUESTA): confirmar si se quedan.
