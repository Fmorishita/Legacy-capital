---
workflow: general-video
flow: companion
storyboard: no
message: "Tu casa con vista al mar en Ensenada, en preventa: ubicación, precio, enganche y dos formas de pago; pide la info hoy"
destination: meta-reels-ads
aspect: 1080x1920
language: es
audience: mexicoamericano que vive en California
length: 47.2s
angle: casa propia en Ensenada sin nombre del desarrollo (curiosidad) + ubicación + datos completos para calificar + acción inmediata
---

## Intent

Reel vertical para anuncio pagado de Meta de Legacy Capital Real Estate. La v03 agrega:
- mapa de ubicación;
- precio y los dos esquemas de pago completos en la voz;
- monto del enganche en pesos;
- amenidades con imágenes de referencia.

La voz es Kokoro local (em_alex, español latino es-419) y la música tiene licencia gratuita comercial. El guion está en `../../proyectos/punta-pacifico/guiones/reel20-es.md`, sección "Cambios v03".

## Assets

- `assets/voz.wav`: voz v3 (Kokoro em_alex es-419, con la tagline en inglés), normalizada.
  - Tiempos por palabra: `../../proyectos/punta-pacifico/voz/reel-es-v3.words.json`.
  - La voz manda la duración: 45.98 s.
- `assets/musica.mp3`: "See Line Funk", de Alejandro Magaña (Mixkit, Stock Music Free License). Va como cama bajo la voz, con carve.
- `assets/0–8.png` y `assets/video-pp.mp4`: renders y video oficiales del desarrollador.
  - Tramos de video que se usan:

    | Tramo | Contenido |
    |---|---|
    | 21–26.4 s | cena en el roof |
    | 13–16.6 s | fachadas |
    | 27–29.7 s | pareja |

  - Nunca se usa el logo final del desarrollo.
- `assets/amen-alberca.mp4` y `assets/amen-club.mp4`, con sus versiones `-blur`: imágenes de referencia de stock (Mixkit Stock Video Free License).
- `compositions/mapa.html`: mapa con Natural Earth (dominio público).
- `assets/crest.png`: escudo de Legacy Capital, tomado del sitio.
- `assets/fonts/`: Geist, Cormorant Garamond y Cinzel (OFL), locales.

Las fuentes y licencias de cada elemento están en `FUENTES.md`.

## Customizations

- Precios solo en MXN: Fran quitó los USD y el tipo de cambio en la v03.
- Montos calculados sobre el precio desde de $3,982,780:

  | Concepto | Monto |
  |---|---|
  | 20 % (enganche) | $796,556 |
  | 10 % | $398,278 |
  | 80 % | $3,186,224 |

- En la opción 2 no se muestran montos, porque el brief no dice sobre qué base se aplica el 5 %.
- Amenidades:
  - Alberca y casa club con clips de stock, completos y con la etiqueta "Imagen de referencia".
  - Pickleball como cancha esquemática animada: no hubo un clip con licencia comercial adecuado.
- Mapa:
  - Muestra solo la zona de El Sauzal, porque la ubicación exacta está [PENDIENTE].
  - La única distancia es la del brief: 30 min al Valle de Guadalupe.
  - San Diego y Tijuana aparecen como referencia, sin distancias.
- Cierre: "Las mejores casas se van primero para los compradores más rápidos. Si te interesa más info, dale clic al botón de abajo y nuestro equipo de Legacy Capital te atenderá." Después viene "Building wealth for generations".
- Se permiten tomas con personas, pero nunca recortadas.

## Notes

- La edición sigue estilo.md (`../../estilo.md`), la marca sigue frame.md (`./frame.md`), y los datos, el material visual y el cumplimiento siguen CLAUDE.md (`../../CLAUDE.md`). Lo que no esté en estilo.md es PROPUESTA y es opcional.
- El video no lleva el nombre del desarrollo ni del desarrollador.
- Los subtítulos van dentro del área útil (y ≤ 1248).
