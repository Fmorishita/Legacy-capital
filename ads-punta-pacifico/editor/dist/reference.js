import {validateProject} from './storage.js';
export {validateProject};

const clone = value => typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
export function median(values) {
  if (!values.length) return 0;
  const ordered = [...values].sort((a,b) => a-b);
  const mid = Math.floor(ordered.length / 2);
  return ordered.length % 2 ? ordered[mid] : (ordered[mid-1] + ordered[mid]) / 2;
}
export function histogramDistance(a, b) {
  if (!a?.length || a.length !== b?.length) return 0;
  let distance = 0;
  for (let index = 0; index < a.length; index++) distance += Math.abs(a[index] - b[index]);
  return distance / 2;
}
/** Conservative visual-cut estimate, at the sampling precision reported to the user. */
export function detectCuts(samples, {minimumGap = 0.7, threshold = 0.24} = {}) {
  if (samples.length < 2) return [];
  const differences = samples.slice(1).map((sample,index) => ({time:sample.time, score:histogramDistance(samples[index].histogram,sample.histogram)}));
  const mid = median(differences.map(x => x.score));
  const deviation = median(differences.map(x => Math.abs(x.score-mid)));
  const limit = Math.max(threshold, mid + deviation * 2.7);
  const cuts = [];
  for (const point of differences) {
    if (point.score < limit) continue;
    const previous = cuts[cuts.length-1];
    if (previous && point.time-previous.time < minimumGap) {
      if (point.score > previous.score) cuts[cuts.length-1] = point;
    } else cuts.push(point);
  }
  return cuts.map(({time,score}) => ({time:Number(time.toFixed(3)), score:Number(score.toFixed(3))}));
}

function once(target, event, {signal, timeout = 12000} = {}) {
  return new Promise((resolve, reject) => {
    const finish = (error) => {
      clearTimeout(timer);
      target.removeEventListener(event, success);
      target.removeEventListener('error', failed);
      signal?.removeEventListener('abort', aborted);
      error ? reject(error) : resolve();
    };
    const success = () => finish();
    const failed = () => finish(new Error('No se pudo leer este video. Prueba con un MP4 o WebM compatible.'));
    const aborted = () => finish(new DOMException('Análisis cancelado.', 'AbortError'));
    const timer = setTimeout(() => finish(new Error('El video tardó demasiado en responder. Prueba con un fragmento más corto.')), timeout);
    target.addEventListener(event, success, {once:true});
    target.addEventListener('error', failed, {once:true});
    signal?.addEventListener('abort', aborted, {once:true});
    if (signal?.aborted) aborted();
  });
}
async function seek(video, time, signal) {
  if (Math.abs(video.currentTime-time) < 0.002 && video.readyState >= 2) return;
  const done = once(video, 'seeked', {signal});
  video.currentTime = time;
  await done;
  // Draw only a decoded frame, not the preceding seek target.
  if (video.readyState < 2) await once(video, 'loadeddata', {signal});
}
function frameFeatures(imageData, colors) {
  const histogram = new Array(48).fill(0);
  const pixels = imageData.data;
  const count = pixels.length / 4;
  for (let i = 0; i < pixels.length; i += 4) {
    const r=pixels[i], g=pixels[i+1], b=pixels[i+2];
    histogram[r >> 4] += 1 / (count * 3);
    histogram[16+(g >> 4)] += 1 / (count * 3);
    histogram[32+(b >> 4)] += 1 / (count * 3);
    const luminance = (r*.2126+g*.7152+b*.0722)/255;
    if (luminance > .06 && luminance < .94) {
      const key = `${r >> 5},${g >> 5},${b >> 5}`;
      colors.set(key, (colors.get(key)||0)+1);
    }
  }
  return histogram;
}
function paletteFromCounts(colors, total = 5) {
  const values = [...colors.entries()].sort((a,b) => b[1]-a[1]);
  const chosen = [];
  for (const [key,count] of values) {
    const rgb = key.split(',').map(x => Math.min(255,Number(x)*32+16));
    if (chosen.some(x => Math.sqrt(x.rgb.reduce((sum,v,i)=>sum+(v-rgb[i])**2,0)) < 65)) continue;
    chosen.push({rgb,hex:'#'+rgb.map(x=>x.toString(16).padStart(2,'0')).join(''),count});
    if (chosen.length === total) break;
  }
  return chosen.map(x=>x.hex);
}

async function analyzeImageReference(file, {onProgress = () => {}, signal} = {}) {
  const ownsURL=file instanceof Blob;
  const url=ownsURL?URL.createObjectURL(file):file;
  const image=new Image();
  if(!ownsURL&&!url.startsWith('blob:')&&!url.startsWith(location.origin)) image.crossOrigin='anonymous';
  try {
    const loaded=once(image,'load',{signal});image.src=url;await loaded;
    const canvas=document.createElement('canvas');canvas.width=96;canvas.height=96;
    const context=canvas.getContext('2d',{willReadFrequently:true});
    if(!context) throw new Error('No se pudo abrir el analizador de imagen.');
    context.drawImage(image,0,0,96,96);
    const colors=new Map();
    try { frameFeatures(context.getImageData(0,0,96,96),colors); }
    catch { throw new Error('La imagen remota no permite analizar sus colores. Sube el archivo desde tu dispositivo.'); }
    onProgress(1);
    return {kind:'image-palette-v1',duration:0,width:image.naturalWidth,height:image.naturalHeight,range:{start:0,end:0},analyzedSeconds:0,sampleCount:1,samplePrecisionSeconds:null,cutTimes:[],cuts:[],estimatedShotSeconds:null,estimatedCutsPerMinute:null,palette:paletteFromCounts(colors),confidence:'medición de color',methodology:'Paleta predominante obtenida de los píxeles de la imagen. Una imagen fija no permite medir ritmo ni animaciones.',limitations:['No mide cortes, movimientos, transiciones ni sonidos.','Las instrucciones de composición y texto quedan registradas para la edición con IA.'],analyzedAt:new Date().toISOString()};
  } finally { if(ownsURL)URL.revokeObjectURL(url); }
}

/** Inspect a real uploaded reference. No server calls or semantic AI inference. */
export async function analyzeReference(file, {start = 0, end, maxSeconds = 60, sampleRate = 1.2, onProgress = () => {}, signal} = {}) {
  if (!(file instanceof Blob) && typeof file !== 'string') throw new Error('Selecciona un video de referencia.');
  if((file instanceof Blob && file.type.startsWith('image/')) || (typeof file==='string' && /\.(png|jpe?g|webp|gif|avif)(?:[?#]|$)/i.test(file))) return analyzeImageReference(file,{onProgress,signal});
  const video = document.createElement('video');
  video.preload = 'auto'; video.muted = true; video.playsInline = true;
  const ownsURL = file instanceof Blob;
  const url = ownsURL ? URL.createObjectURL(file) : file;
  // Canvas readback for remote files requires the source to allow CORS.
  if (!ownsURL && !url.startsWith('blob:') && !url.startsWith(location.origin)) video.crossOrigin = 'anonymous';
  const loaded = once(video, 'loadedmetadata', {signal});
  video.src = url;
  try {
    await loaded;
    const duration = video.duration;
    if (!Number.isFinite(duration) || duration <= 0) throw new Error('No se pudo medir la duración de la referencia.');
    const from = clamp(Number(start)||0,0,Math.max(0,duration-.1));
    const until = clamp(Number.isFinite(Number(end)) ? Number(end) : duration,from+.05,Math.min(duration,from+clamp(maxSeconds,1,120)));
    const step = 1 / clamp(sampleRate,.5,3);
    const canvas = document.createElement('canvas');
    canvas.width=96; canvas.height=96;
    const context=canvas.getContext('2d',{willReadFrequently:true});
    if (!context) throw new Error('No se pudo abrir el analizador visual.');
    const samples=[], colors=new Map();
    const frames=Math.max(2,Math.ceil((until-from)/step));
    for(let index=0;index<frames;index++) {
      if(signal?.aborted) throw new DOMException('Análisis cancelado.','AbortError');
      const time=Math.min(until-.025,from+index*step);
      await seek(video,time,signal);
      context.drawImage(video,0,0,96,96);
      let pixels;
      try { pixels=context.getImageData(0,0,96,96); }
      catch { throw new Error('La referencia remota no permite analizar sus imágenes. Sube el archivo desde tu dispositivo.'); }
      samples.push({time:time-from,histogram:frameFeatures(pixels,colors)});
      onProgress((index+1)/frames);
    }
    const cuts=detectCuts(samples);
    const boundaries=[0,...cuts.map(x=>x.time),until-from];
    const intervals=boundaries.slice(1).map((time,index)=>time-boundaries[index]).filter(x=>x>.25);
    return {
      kind:'visual-sampling-v1',duration,width:video.videoWidth,height:video.videoHeight,
      range:{start:from,end:until},analyzedSeconds:Number((until-from).toFixed(3)),
      sampleRate:1/step,samplePrecisionSeconds:Number(step.toFixed(3)),sampleCount:samples.length,
      cutTimes:cuts.map(x=>x.time),cuts,estimatedShotSeconds:Number(median(intervals).toFixed(2)),
      estimatedCutsPerMinute:Number((cuts.length/(until-from)*60).toFixed(1)),
      palette:paletteFromCounts(colors),confidence:'estimación visual',
      methodology:'Comparación de histogramas RGB entre fotogramas muestreados. Identifica cambios visuales aproximados; los movimientos de cámara y las disolvencias pueden alterar el resultado.',
      limitations:['Los cortes son aproximados a la precisión de muestreo.','No reconoce textos, personas ni instrucciones del video.','No analiza música, voz ni efectos de sonido.'],
      analyzedAt:new Date().toISOString()
    };
  } finally {
    video.pause(); video.removeAttribute('src'); video.load();
    if(ownsURL) URL.revokeObjectURL(url);
  }
}

function selectedScenes(project,scope) {
  const ids=Array.isArray(scope)?new Set(scope):typeof scope==='string' && scope!=='all'?new Set([scope]):null;
  return project.scenes.filter(scene=>!ids || ids.has(scene.id));
}
function scopedLayers(project,scenes,scope) {
  const windows=scenes.map(s=>[s.start,s.start+s.duration]).sort((a,b)=>a[0]-b[0]);
  const merged=[];
  for(const window of windows){const last=merged.at(-1);if(last&&window[0]<=last[1]+.001)last[1]=Math.max(last[1],window[1]);else merged.push([...window]);}
  let shared=0;
  const overlays=(project.overlays||[]).filter(layer=>{
    if(scope==='all')return true;
    const start=Number(layer.start)||0,end=Number.isFinite(layer.end)?layer.end:start+(Number.isFinite(layer.duration)?layer.duration:project.duration);
    if(!windows.some(([a,b])=>start<b&&end>a))return false;
    const covered=merged.some(([a,b])=>start>=a-.001&&end<=b+.001);
    if(!covered)shared++;
    return covered;
  });
  return {layers:[...scenes.flatMap(s=>s.layers||[]),...overlays],shared};
}
const luminance=hex=>{
  const parts=hex.replace('#','').match(/.{2}/g)?.map(x=>parseInt(x,16)/255);
  if(!parts||parts.length!==3) return .5;
  return parts.reduce((n,v,i)=>n+[.2126,.7152,.0722][i]*(v<=.04045?v/12.92:((v+.055)/1.055)**2.4),0);
};
/** Apply only explicit choices. Rhythm is a non-destructive shot-plan proposal. */
export function applyReferenceStyle(project,analysis,choices={},scope='all') {
  validateProject(project);
  if(!analysis || (!Number.isFinite(analysis.estimatedShotSeconds)&&!analysis.palette?.length)) throw new Error('Analiza primero una referencia.');
  if(Array.isArray(choices))choices=Object.fromEntries(choices.map(key=>[key,true]));
  if(!choices || typeof choices!=='object')throw new Error('Selecciona qué elementos quieres aplicar de la referencia.');
  const isStill=analysis.kind==='image-palette-v1';
  const hasCadence=!isStill&&Number.isFinite(analysis.estimatedShotSeconds)&&analysis.estimatedShotSeconds>0;
  const result=clone(project), scenes=selectedScenes(result,scope), summary=[];
  if(!scenes.length) throw new Error('No hay escenas seleccionadas para aplicar la referencia.');
  const scoped=scopedLayers(result,scenes,scope);
  const cadence=clamp(analysis.estimatedShotSeconds||3,.8,8);
  if(choices.rhythm && hasCadence) {
    result.referenceShotPlan={createdAt:new Date().toISOString(),scope:scenes.map(s=>s.id),estimatedShotSeconds:cadence,cuts:scenes.flatMap(scene=>{
      const values=[];
      for(let offset=cadence;offset<scene.duration-.3;offset+=cadence) values.push({sceneId:scene.id,time:Number((scene.start+offset).toFixed(3)),needsNewMedia:true});
      return values;
    }),status:'propuesta',note:'La voz y sus tiempos se conservan. Revisa los cortes propuestos y añade tomas antes de cambiar el montaje.'};
    summary.push(`Ritmo: propuesta de cortes cada ${cadence.toFixed(1)} s; la voz conserva su sincronía.`);
  }
  if(choices.transitions && hasCadence) {
    scenes.forEach((scene,index)=>{scene.transition={...(scene.transition||{}),type:cadence<2.2?(index%3===0?'whip':'cut'):(index%3===0?'dissolve':'cut'),duration:cadence<2.2?.12:.22};});
    summary.push(`Transiciones: ${scenes.length} escenas ajustadas al ritmo visual estimado.`);
  }
  if((choices.motion||choices.composition) && hasCadence) {
    scenes.forEach((scene,index)=>{scene.media={...(scene.media||{}),motion:index%2?'pan-left':'zoom-in',scale:cadence<2.2?1.08:1.04};});
    summary.push(`Movimiento: zoom y paneo alternados en ${scenes.length} escenas.`);
  }
  if(choices.color && analysis.palette?.length) {
    const color=analysis.palette.find(hex=>luminance(hex)>.32)||'#E2C98F';
    const accents=[result.brand?.colors?.gold,result.brand?.colors?.price].filter(Boolean).map(value=>value.toLowerCase());
    scoped.layers.forEach(layer=>{
      if(layer.type!=='image' && (layer.role==='accent'||layer.role==='headline'||layer.id==='opening-price'||accents.includes(String(layer.color||'').toLowerCase()))) layer.color=color;
    });
    result.referencePalette=[...analysis.palette];
    if(scope==='all') result.subtitleStyle={...(result.subtitleStyle||{}),highlightColor:color};
    for(const caption of result.captions||[]) if(scenes.some(s=>s.id===caption.sceneId)) caption.highlightColor=color;
    summary.push(`Color: acento ${color} aplicado; la paleta detectada queda guardada como referencia.`);
  }
  if(choices.text && hasCadence) {
    scoped.layers.forEach(layer=>{if(layer.type==='text') layer.animation=cadence<2.2?'pop':'slide-up';});
    summary.push('Textos: entradas animadas ajustadas al ritmo; el contenido se conserva.');
  }
  if(scoped.shared&&(choices.color||choices.text))summary.push(`${scoped.shared} elementos globales compartidos con escenas sin seleccionar se conservan para respetar el alcance.`);
  if(isStill&&(choices.rhythm||choices.transitions||choices.text||choices.motion||choices.composition))summary.push('La referencia es una imagen fija: ritmo, transiciones, composición y animación quedan como instrucciones para IA, sin inventar movimiento.');
  if(choices.audio||choices.sound) summary.push('Audio: queda como instrucción de edición; el análisis visual no infiere ni sustituye sonidos.');
  if(!summary.length)summary.push('No seleccionaste ajustes aplicables. La referencia se conserva para indicar los cambios a la IA.');
  result.styleApplications||=[];
  result.styleApplications.push({id:globalThis.crypto?.randomUUID?.()||String(Date.now()),appliedAt:new Date().toISOString(),scope:scenes.map(s=>s.id),choices:clone(choices),analysis:clone(analysis),summary});
  return {project:result,summary};
}

function timecode(seconds) {
  seconds=Math.max(0,Number(seconds)||0);
  return `${Math.floor(seconds/60).toString().padStart(2,'0')}:${Math.floor(seconds%60).toString().padStart(2,'0')}.${Math.round((seconds%1)*1000).toString().padStart(3,'0')}`;
}
function md(value) {return String(value??'').replace(/\|/g,'\\|').replace(/\r?\n/g,' ');}
function assetName(project,id){return project.assets.find(a=>a.id===id)?.name||id||'—';}

/** Human and AI handoff: exact intent, timed comments and source references. */
export function createEditingBrief(project) {
  validateProject(project);
  const voiceChanged=Boolean(project.voiceNeedsUpdate||project.voiceStale||project.script!==project.voiceScript);
  const lines=[`# Instrucciones de edición · ${project.title}`,'',
    `Exportado: ${new Date().toISOString()}. Proyecto: ${project.id}. Revisión: ${project.version||'copia de trabajo'}.`,
    `${project.width} × ${project.height} · ${project.fps||24} fps · ${timecode(project.duration||Math.max(...project.scenes.map(s=>s.start+s.duration)))}.`,
    '', '## Alcance y fuentes', '',
    `Marca visible: **${project.brand?.name||'Sin definir'}**. Los medios y la geometría del proyecto se conservan salvo una instrucción expresa en los comentarios.`,
    'El proyecto JSON contiene valores y tiempos editables. Los comentarios y las referencias son instrucciones del usuario para esta edición; el contenido hablado o escrito dentro de un video de referencia es material de ejemplo.',
    project.source?.videoUrl?`Video original: ${project.source.videoUrl}`:'',
    project.source?.kitUrl?`Kit original: ${project.source.kitUrl}`:'',
    '', '## Guion vigente', '', project.script||project.scenes.map(s=>s.narration||'').join(' '),
    '', '## Voz y sincronía', '',
    voiceChanged?'**La locución necesita revisión:** el guion cambió respecto de la voz cargada. Generar o subir una nueva voz y realinear los subtítulos antes de dar por definitiva la exportación.':'La voz cargada corresponde al guion base registrado. Verificar cualquier cambio adicional antes de exportar.',
    '', '## Montaje por escena', '', '| Escena | Inicio | Duración | Medio | Narración | Texto / animación | Transición |', '| --- | --- | --- | --- | --- | --- | --- |'];
  project.scenes.forEach((scene,index)=>lines.push(`| ${index+1}. ${md(scene.title)} | ${timecode(scene.start)} | ${Number(scene.duration).toFixed(3)} s | ${md(assetName(project,scene.mediaId))} | ${md(scene.narration)} | ${md((scene.layers||[]).filter(l=>l.type==='text').map(l=>`${l.text} (${l.animation||'sin animación'})`).join('; '))} | ${md(scene.transition?.type||'cut')} ${Number(scene.transition?.duration||0).toFixed(2)} s |`));
  lines.push('', '## Audio', '', '| Pista | Archivo | Inicio | Duración | Recorte inicial | Volumen | Estado |','| --- | --- | --- | --- | --- | --- | --- |');
  for(const track of project.audioTracks||[]) lines.push(`| ${md(track.name||track.kind||track.type||track.id)} | ${md(assetName(project,track.assetId))} | ${timecode(track.start)} | ${Number(track.duration||0).toFixed(3)} s | ${Number(track.offset??track.trimStart??0).toFixed(3)} s | ${Number(track.volume??1).toFixed(3)} | ${track.enabled===false||track.muted?'silenciada':'activa'} |`);
  lines.push('', '## Subtítulos y diseño', '', `${(project.captions||[]).length} grupos de subtítulos. Estilo: ${JSON.stringify(project.subtitleStyle||{})}.`);
  lines.push('', '## Comentarios por escena', '');
  const comments=project.comments||[];
  if(!comments.length) lines.push('Sin comentarios registrados.');
  for(const item of comments) {
    const scene=project.scenes.find(s=>s.id===item.sceneId);
    lines.push(`- [${item.resolved?'x':' '}] ${timecode(item.time??item.timestamp??scene?.start??0)} · ${scene?.title||item.sceneId||'General'} · ${item.category||'Edición'}: ${item.text||item.body||''}`);
  }
  lines.push('', '## Referencias de estilo', '');
  if(!(project.references||[]).length) lines.push('Sin referencias adicionales.');
  for(const reference of project.references||[]) {
    const elements=reference.choices||reference.elements||{};
    const chosenElements=Array.isArray(elements)?elements:Object.entries(elements).filter(([,v])=>v).map(([k])=>k);
    lines.push(`### ${reference.name||reference.title||reference.id}`,'',
      `Fragmento: ${timecode(reference.start??reference.range?.start??0)} – ${timecode(reference.end??reference.range?.end??reference.duration??0)}. Alcance: ${Array.isArray(reference.scope)?reference.scope.join(', '):reference.scope||'Por definir'}.`,
      `Replicar: ${chosenElements.join(', ')||'Consultar instrucciones'}.`,
      `Instrucción: ${reference.instructions||reference.notes||'Sin instrucción escrita.'}`);
    if(reference.analysis) lines.push(`Medición visual: ${Number.isFinite(reference.analysis.estimatedShotSeconds)?`tomas estimadas ${reference.analysis.estimatedShotSeconds}s; `:'referencia fija; '}paleta ${(reference.analysis.palette||[]).join(', ')}. ${reference.analysis.methodology||''}`);
    lines.push('');
  }
  if(project.referenceShotPlan) lines.push('## Plan de ritmo propuesto','',JSON.stringify(project.referenceShotPlan,null,2),'');
  if(project.styleApplications?.length) {
    lines.push('## Ajustes de estilo aplicados','');
    for(const item of project.styleApplications) lines.push(`- ${item.appliedAt}: ${(item.summary||[]).join(' ')}`);
  }
  if(project.changeLog?.length||project.pendingChanges?.length) lines.push('## Registro de cambios','',JSON.stringify(project.changeLog||project.pendingChanges,null,2),'');
  lines.push('## Entrega','', 'Conservar el proyecto base y exportar una revisión nueva. Incluir video final, guion, voz, música, efectos, medios, subtítulos y proyecto editable. Revisar composición, caras, manos, arquitectura, sincronía, legibilidad y mezcla de audio antes de la entrega.','');
  return lines.filter(line=>line!==undefined).join('\n');
}
