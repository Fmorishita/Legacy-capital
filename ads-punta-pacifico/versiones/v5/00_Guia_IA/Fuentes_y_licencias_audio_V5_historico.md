# Audio V5 · fuentes y licencia

V5 conserva las tres grabaciones musicales profesionales de V4, que el usuario valoró positivamente en conjunto. Cada perfil usa una pista diferente con entrada en su arreglo activo. Se generó una nueva narración corrida por perfil para la vista al mar, primeras amenidades proyectadas, pagos flexibles y estimación de plusvalía. No se concatenan frases aisladas por toma.

| Anuncio | Pista / autor | Fuente primaria | Tempo analizado | Entrada en fuente |
|---|---|---|---:|---:|
| Salud | I Can Hear Your Heartbeat — Michael Ramir C. | https://mixkit.co/free-stock-music/pop/ ; https://assets.mixkit.co/music/1000/1000.mp3 | ≈125 BPM | 15.36 s |
| Empresarios | Cat Walk — Arulo | https://mixkit.co/free-stock-music/house/ ; https://assets.mixkit.co/music/371/371.mp3 | ≈130 BPM | 14.769 s |
| California | Life is a Dream — Michael Ramir C. | https://mixkit.co/free-stock-music/disco/ ; https://assets.mixkit.co/music/837/837.mp3 | ≈120 BPM | 8.00 s |

La [Mixkit Stock Music Free License](https://mixkit.co/license/modal/musicFree/) permite proyectos comerciales, publicaciones en redes y anuncios de marketing online. No exige atribución. La revisión fue el 6 de noviembre de 2026. No cubre TV/radio ni distribución de música sola; esta entrega se plantea para Meta Ads. No registrar las pistas en sistemas de derechos ni declararlas originales propias.

## Efectos

Fuente primaria: https://mixkit.co/free-sound-effects/transition/ ; licencia: https://mixkit.co/license/modal/sfxFree/ . Los efectos se usan sólo como parte del anuncio y tienen una causa visual: un cambio de plano o el golpe de una animación. No se repiten tonos de notificación en cada texto.

- Cinematic whoosh fast transition (#1492): https://assets.mixkit.co/active_storage/sfx/1492/1492-preview.mp3
- Fast small sweep transition (#166): https://assets.mixkit.co/active_storage/sfx/166/166-preview.mp3
- Short transition sweep (#175): https://assets.mixkit.co/active_storage/sfx/175/175-preview.mp3
- Air zoom vacuum (#2608): https://assets.mixkit.co/active_storage/sfx/2608/2608-preview.mp3
- Fast whoosh transition (#1490): https://assets.mixkit.co/active_storage/sfx/1490/1490-preview.mp3
- Quick zoom impact (#772): https://assets.mixkit.co/active_storage/sfx/772/772-preview.mp3

**Distribución de editables:** incluir el mix final narrado integrado al anuncio. Excluir las carpetas locales `music/` y `sfx/`: no distribuir archivos de stock aislados como librería ni con fuentes. Las URLs se conservan para poder descargar de nuevo cada fuente bajo su licencia.

## Verificación

Cada `*_audio.json` contiene los límites reales por palabra recibidos de la síntesis y el offset exacto en el mix, la hora de cada efecto, su causa y el análisis de sonoridad. Se midió la sonoridad y se decodificaron los archivos. No se afirma una escucha humana.

## Diseño sonoro V5

Se incorporan 11/11/12 acentos cortos por perfil. Además de cambios de plano, enfatizan el rol y la raya del precio, la vista al mar, amenidades, el plan flexible, los tres porcentajes, la estimación del 8% y el cierre centrado. Son fragmentos de las grabaciones de efectos anteriores recortados alrededor de su transitorio natural, con fade de 14ms en sus extremos; no se sintetizaron tonos, chimes o notificaciones.

Cada evento registra picture_landing_at y peak_at: el pico del efecto se sitúa un fotograma después del aterrizaje visual. El motor debe usar esos tiempos para las animaciones. Los picos de efectos antes de mastering se eligieron por causa y varían entre0.085y0.15, más presentes que el nivel uniformeV4; no se aumentó indiscriminadamente toda la mezcla. La voz se mantiene inteligible, con ducking suave.

Los importes y porcentajes son copy aportado por el cliente: el 8% se narra como estimación/escenario conservador y no como rendimiento histórico comprobado. Este ledger conserva trazabilidad interna; no añade una nota de garantía al video.
