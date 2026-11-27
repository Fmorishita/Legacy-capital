# Mantenimiento autorizado por el usuario

El usuario pidió crear e instalar esta skill y «cada vez que te pida cambios importantes que consideres» ajustarla y dejarla descargable. Aplicar esta instrucción al trabajar en revisiones futuras. No es una tarea de vigilancia en segundo plano ni una autorización para alterar entregas ajenas.

## Qué merece actualizar la skill

- Preferencia repetible de formato, tono, hooks, buyer persona, tratamiento de imágenes, voz, música, captions o animación.
- Una nueva regla comercial general confirmada para el proyecto.
- Cambio de herramientas o flujo que se deba reutilizar.
- Un fallo real que revele un control de QA que faltaba.
- Una nueva forma de organizar o entregar los materiales.

No convertir automáticamente un experimento del asistente en gusto aprobado. Distinguir «usuario lo pidió», «usuario lo aprobó» y «se entregó y está pendiente de feedback».

Un cambio de foto, precio, unidad o disponibilidad puntual va primero a la configuración del trabajo. Cambiar la skill sólo si también modifica una regla o fuente reutilizable. Nunca congelar precios como universales.

## Procedimiento por revisión importante

1. Leer versión instalada, fuente canónica, CHANGELOG y última decisión. Respetar nuevas instrucciones del usuario por encima de reglas viejas.
2. Terminar el cambio autorizado en los anuncios y verificarlo. Identificar qué aprendizaje es reutilizable.
3. Actualizar SKILL.md y la referencia concreta. Sustituir la regla vigente; conservar el motivo y anterior criterio en el historial, no dos mandatos contradictorios.
4. Registrar en CHANGELOG: fecha, petición o hallazgo, antes/después, alcance y estado de aprobación. Usar [plantilla de decisión](../templates/decision.md).
5. Subir versión: patch para aclaración o corrección; minor para nueva preferencia/flujo compatible; major para un cambio de base incompatible. Sincronizar VERSION, metadata.json y la versión visible de SKILL.md.
6. Ejecutar `python scripts/validate.py`. Revisar referencias, ausencia de datos secretos y coherencia de la nueva regla con el resto.
7. Ejecutar `python scripts/install.py --workspace /ruta/al/proyecto` desde la fuente canónica. Instalar también en la raíz de trabajo si existe una regla de activación general. No tocar skills de otros nombres ni su lock de instalación.
8. Ejecutar `python scripts/export.py --out /ruta/entregables`. Conservar ZIP con versión, actualizar `latest.zip` y comprobar manifiesto/hashes.
9. Si la descarga vive en Drive, reemplazar la descarga vigente en suID conocido y conservar una copia de versión. Verificar readback. Guardar IDs y rutas en un registro de instalación/entrega fuera del paquete.
10. En la respuesta final indicar brevemente que la skill cambió y dar su nueva descarga, además de los anuncios si se modificaron.

## Alcance de instalación y persistencia

La fuente canónica de este entorno está en `/workspace/punta-pacifico/skills/videos-punta-pacifico/`. Copia instalada: `~/.agents/skills/videos-punta-pacifico/`; compatibilidad de Codex: `~/.codex/skills/videos-punta-pacifico` cuando el cliente usa ese directorio. AGENTS.md activa la lectura al trabajar en este proyecto.

El registro de descargas de este entorno está en `/workspace/punta-pacifico/skill-delivery/distribution.json`; usar sus IDs observados para actualizar la descarga vigente sin generar enlaces nuevos por accidente. La colección actual es **skills ChatGPT**, ID`17N5Or2vADGOvhgcQCfxxe3e4LnEnBKwU`; la subcarpeta de esta skill conserva ID`1ZnC3CjZjs7jwDd8aWD-K0Yzxr8w4B49j`. La reorganización no cambió los IDs de ZIP/Markdown existentes. Verificar metadata antes de actualizar. En otro equipo, localizar su registro equivalente o verificar el destino antes de escribir.

Comprobar los archivos y su hash después de instalar; si el cliente expone un catálogo local, verificar también que la descubre. Una sesión ya abierta puede necesitar recarga para mostrarla en su selector.

No afirmar registro en la biblioteca cloud de ChatGPT sin una operación y readback que lo prueben. Si no hay esa capacidad, instalar en el entorno disponible y entregar el ZIP portable, describiendo ese alcance con precisión.

La instrucción de mantenerla es permanente para este trabajo; no hay que pedir permiso de nuevo por cada mejora ya autorizada. Tampoco inventar una automatización o prometer que se recordará en entornos donde esta skill y su activación no existan.
