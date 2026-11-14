// Browser export records the real canvas and the same Web Audio mix as preview.
// Format availability is detected, never promised from the filename alone.
import {StudioEngine} from './engine.js';

export function availableVideoFormats() {
  if (!window.MediaRecorder || !HTMLCanvasElement.prototype.captureStream) return [];
  const candidates = [
    {extension: 'mp4', mimeType: 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', label: 'MP4 · H.264 / AAC'},
    {extension: 'mp4', mimeType: 'video/mp4', label: 'MP4'},
    {extension: 'webm', mimeType: 'video/webm;codecs=vp9,opus', label: 'WebM · VP9 / Opus'},
    {extension: 'webm', mimeType: 'video/webm;codecs=vp8,opus', label: 'WebM · VP8 / Opus'},
    {extension: 'webm', mimeType: 'video/webm', label: 'WebM'},
  ];
  return candidates.filter(f => MediaRecorder.isTypeSupported(f.mimeType)).filter((f, index, list) => list.findIndex(x => x.extension === f.extension) === index);
}

export async function exportVideo(engine, options = {}) {
  const formats = availableVideoFormats();
  const format = options.format && options.format !== 'auto' ? formats.find(f => f.extension === options.format) : formats[0];
  if (!format) throw new Error(options.format === 'mp4' ? 'Este navegador no ofrece grabación MP4. Selecciona WebM o usa Chrome actualizado.' : 'Este navegador no permite exportar video. Usa Chrome o Edge actualizado.');
  const project = structuredClone(engine.project);
  // Selection handles belong to the editor, never the exported media.
  const canvas = document.createElement('canvas');canvas.width = project.width || 1080;canvas.height = project.height || 1920;
  const errors = [];
  const player = new StudioEngine(project, canvas, {onError: error => errors.push(error)});
  await player.ready();
  if (errors.length) {await player.dispose();throw new Error('Hay medios que no se cargaron. Revisa la biblioteca antes de exportar.');}
  await player.ensureAudio();
  if (errors.length) {await player.dispose();throw new Error('Hay archivos de audio que no se pudieron decodificar. Reemplázalos antes de exportar.');}
  if (options.signal?.aborted) {await player.dispose();throw new DOMException('Exportación cancelada', 'AbortError');}
  if (document.hidden) {await player.dispose();throw new Error('Mantén el editor visible para iniciar la exportación.');}
  const start = Math.max(0, Number(options.start) || 0);
  const end = Math.min(player.duration(), options.end == null ? player.duration() : Number(options.end));
  if (!Number.isFinite(end) || end <= start) {await player.dispose();throw new Error('El intervalo de exportación está vacío o no es válido.');}
  player.render(start);
  const videoStream = canvas.captureStream(options.fps || project.fps || 24);
  const audioTracks = player.audioDestination?.stream.getAudioTracks() || [];
  const stream = new MediaStream([...videoStream.getVideoTracks(), ...audioTracks]);
  let recorder;
  try {recorder = new MediaRecorder(stream, {mimeType: format.mimeType, videoBitsPerSecond: Number(options.bitrate) || 8_000_000, audioBitsPerSecond: 192_000});}
  catch (error) {stream.getTracks().forEach(t => t.stop());await player.dispose();throw new Error(`No se pudo iniciar el formato ${format.extension.toUpperCase()}. Prueba otro formato compatible. ${error.message}`);}
  const chunks = [];
  let aborted = false, stopped = false, timedOut = false, timeout, visibilityHandler;
  const cleanup = async () => {
    clearTimeout(timeout);options.signal?.removeEventListener('abort', abort);
    if (visibilityHandler) document.removeEventListener('visibilitychange', visibilityHandler);
    stream.getTracks().forEach(t => t.stop());await player.dispose();
  };
  const abort = () => {aborted = true;if (recorder.state !== 'inactive') recorder.stop();};
  return new Promise((resolve, reject) => {
    options.signal?.addEventListener('abort', abort, {once: true});
    if (options.signal?.aborted) {cleanup().then(() => reject(new DOMException('Exportación cancelada', 'AbortError')));return;}
    // Hidden tabs may throttle canvas capture, so stop with an explicit error.
    visibilityHandler = () => {if (document.hidden && recorder.state !== 'inactive') {aborted = true;recorder.stop();}};
    document.addEventListener('visibilitychange', visibilityHandler);
    recorder.ondataavailable = e => {if (e.data.size) chunks.push(e.data);};
    recorder.onerror = async e => {if (stopped) return;stopped = true;await cleanup();reject(e.error || new Error('No se pudo grabar el video.'));};
    recorder.onstop = async () => {
      if (stopped) return;stopped = true;
      const wasHidden = document.hidden;
      await cleanup();
      if (aborted) {reject(new DOMException(wasHidden ? 'La pestaña se ocultó. Mantén el editor visible al exportar.' : 'Exportación cancelada', 'AbortError'));return;}
      if (timedOut) {reject(new Error('La exportación no terminó a tiempo. Mantén la pestaña visible y vuelve a intentarlo.'));return;}
      const blob = new Blob(chunks, {type: recorder.mimeType || format.mimeType});
      if (!blob.size) {reject(new Error('La exportación no produjo datos.'));return;}
      options.onProgress?.(1);
      resolve({blob, extension: format.extension, mimeType: recorder.mimeType || format.mimeType, duration: end - start, width: canvas.width, height: canvas.height});
    };
    player.onTime = time => {
      options.onProgress?.(Math.min(.995, Math.max(0, (time - start) / (end - start))));
      if (time >= end && recorder.state !== 'inactive') recorder.stop();
    };
    player.onEnded = () => {if (recorder.state !== 'inactive') recorder.stop();};
    try {
      engine.pause();player.seek(start);recorder.start(500);
      options.onProgress?.(0);
      player.play({audioReady: true}).catch(async error => {aborted = true;if (recorder.state !== 'inactive') recorder.stop();else {await cleanup();reject(error);}});
      timeout = setTimeout(() => {if (recorder.state !== 'inactive') {timedOut = true;recorder.stop();}}, (end - start + 10) * 1000);
    } catch (error) {cleanup().then(() => reject(error));}
  });
}

export function downloadBlob(blob, filename) {
  // Dentro de Claude las descargas pasan por la capacidad «downloads» (un enlace <a download> no funciona ahí).
  if (globalThis.__legacyDownloads) return globalThis.__legacyDownloads.save({filename, data: blob}).catch(e => { if (e?.code !== 'declined') throw new Error('No se pudo descargar: ' + (e?.message || e?.code)); });
  const url = URL.createObjectURL(blob), link = document.createElement('a');link.href = url;link.download = filename;
  document.body.appendChild(link);link.click();link.remove();setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function exportFrame(engine, filename = 'fotograma.png') {
  const canvas = document.createElement('canvas');
  const result = new StudioEngine(engine.project, canvas);
  result.assets = engine.assets;result.render(engine.currentTime);
  return new Promise(resolve => canvas.toBlob(blob => {if (blob) downloadBlob(blob, filename);resolve(blob);}, 'image/png'));
}
