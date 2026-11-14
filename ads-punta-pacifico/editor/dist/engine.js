// Legacy Video Studio — deterministic canvas compositor and non-destructive player.
// Coordinates and type sizes are expressed in project pixels, not CSS pixels.
export const clamp = (n, a, b) => Math.min(b, Math.max(a, Number(n) || 0));
const finite = (v, fallback = 0) => Number.isFinite(Number(v)) ? Number(v) : fallback;
const ease = t => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const idOf = asset => asset?.id;
export const projectDuration = p => finite(p?.duration) > 0 ? Math.max(.1, finite(p.duration)) : Math.max(.1, ...(p?.scenes || []).map(s => finite(s.start) + finite(s.duration)), ...(p?.audioTracks || []).map(t => finite(t.start) + finite(t.duration)));
const sceneEnd = s => finite(s.start) + finite(s.duration);
const mediaId = s => s.mediaId || s.assetId || s.background?.assetId || s.media?.assetId;
const assetMap = p => new Map((p.assets || []).map(a => [a.id, a]));
const orderedLayers = layers => (layers || []).map((layer, index) => ({layer, index})).sort((a, b) => finite(a.layer.order, a.index + 1) - finite(b.layer.order, b.index + 1) || a.index - b.index).map(x => x.layer);

export function activeScene(project, time) {
  const scenes = project?.scenes || [];
  return scenes.findLast?.(s => time >= finite(s.start) && time < sceneEnd(s)) || scenes.find(s => time >= finite(s.start) && time < sceneEnd(s)) || (time >= projectDuration(project) ? scenes.at(-1) : scenes.find(s => time >= finite(s.start))) || scenes[0] || null;
}

function rounded(ctx, x, y, w, h, r = 14) {
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
  else ctx.rect(x, y, w, h);
}

function drawCover(ctx, resource, width, height, scene, progress) {
  const iw = resource.videoWidth || resource.naturalWidth || resource.width;
  const ih = resource.videoHeight || resource.naturalHeight || resource.height;
  if (!iw || !ih) return;
  const media = scene.media || {};
  const motion = media.motion ?? scene.motion ?? 'push-in';
  const base = (media.fit || 'cover') === 'contain' ? Math.min(width / iw, height / ih) : Math.max(width / iw, height / ih);
  let zoom = finite(media.scale, 1.04);
  let dx = finite(media.x, 0), dy = finite(media.y, 0);
  const intensity = finite(media.intensity, 1);
  if (motion === 'push-in' || motion === 'zoom-in') zoom *= 1 + .055 * progress * intensity;
  if (motion === 'pull-out' || motion === 'zoom-out') zoom *= 1 + .055 * (1 - progress) * intensity;
  if (motion === 'drift-left' || motion === 'pan-left') dx += (1 - progress * 2) * width * .025 * intensity;
  if (motion === 'drift-right' || motion === 'pan-right') dx += (progress * 2 - 1) * width * .025 * intensity;
  if (motion === 'drift-up' || motion === 'pan-up') dy += (1 - progress * 2) * height * .02 * intensity;
  dx += finite(media.panX) * progress;
  dy += finite(media.panY) * progress;
  const dw = iw * base * zoom, dh = ih * base * zoom;
  ctx.save();
  ctx.globalAlpha *= clamp(media.opacity ?? 1, 0, 1);
  if (media.blur) ctx.filter = `blur(${clamp(media.blur, 0, 30)}px)`;
  ctx.translate(width / 2 + dx, height / 2 + dy);
  ctx.rotate(finite(media.rotation) * Math.PI / 180);
  if (media.flipX) ctx.scale(-1, 1);
  ctx.drawImage(resource, -dw / 2, -dh / 2, dw, dh);
  ctx.restore();
}

function wrapText(ctx, text, maxWidth) {
  const lines = [];
  for (const paragraph of String(text ?? '').split('\n')) {
    if (!paragraph) { lines.push(''); continue; }
    let current = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = current ? `${current} ${word}` : word;
      if (current && ctx.measureText(next).width > maxWidth) { lines.push(current); current = word; }
      else current = next;
    }
    lines.push(current);
  }
  return lines;
}

function fontString(layer, scale = 1) {
  return `${layer.italic ? 'italic ' : ''}${layer.fontWeight || layer.weight || 700} ${finite(layer.fontSize, 64) * scale}px "${layer.fontFamily || 'Studio Sans'}", Arial, sans-serif`;
}

function animation(ctx, layer, time, duration, width) {
  const delay = finite(layer.delay ?? layer.start);
  const elapsed = time - delay;
  if (elapsed < 0) return {visible: false};
  const animDuration = Math.max(.04, finite(layer.animationDuration ?? layer.animDuration, .42));
  const progress = ease(elapsed / animDuration);
  const name = layer.animation || 'rise';
  let alpha = clamp(layer.opacity ?? 1, 0, 1);
  if (name !== 'none' && name !== 'typewriter') alpha *= progress;
  if (layer.end != null && time > finite(layer.end)) return {visible: false};
  if (layer.duration != null && elapsed > finite(layer.duration)) return {visible: false};
  const out = finite(layer.fadeOut, 0);
  if (out > 0) alpha *= clamp((duration - time) / out, 0, 1);
  ctx.globalAlpha *= alpha;
  let x = finite(layer.x, width / 2), y = finite(layer.y, 300);
  if (name === 'rise' || name === 'slide-up') y += (1 - progress) * 46;
  if (name === 'slide-left' || name === 'slide') x += (1 - progress) * 100;
  if (name === 'slide-right') x -= (1 - progress) * 100;
  if (name === 'bounce') y += Math.sin(Math.max(0, elapsed) * 5) * 9;
  ctx.translate(x, y);
  if (name === 'pop' || name === 'scale') {
    const scale = .82 + .18 * progress;
    ctx.scale(scale, scale);
  }
  if (name === 'pulse') {const s = 1 + Math.sin(Math.max(0, elapsed) * 4) * .025;ctx.scale(s, s);}
  if (layer.rotation) ctx.rotate(finite(layer.rotation) * Math.PI / 180);
  return {visible: true, progress, elapsed, x, y};
}

function drawLayer(ctx, layer, localTime, scene, project, resources, hitRegions) {
  if (layer.visible === false || layer.enabled === false || layer.hidden) return;
  const width = finite(project.width, 1080), height = finite(project.height, 1920);
  ctx.save();
  const anim = animation(ctx, layer, localTime, scene.duration, width);
  if (!anim.visible) { ctx.restore(); return; }
  const type = layer.type || 'text';
  const lw = finite(layer.width, width - 144), lh = finite(layer.height, 100);
  const align = layer.align || 'left';
  const ox = align === 'center' ? -lw / 2 : align === 'right' ? -lw : 0;
  let bound = {sceneId: scene.id, layerId: layer.id, x: anim.x + ox, y: anim.y, width: lw, height: lh, type};
  if (type === 'image' || type === 'logo' || type === 'video') {
    const img = resources.get(layer.assetId || layer.mediaId)?.element;
    if (img) {
      const iw = img.naturalWidth || img.videoWidth || img.width, ih = img.naturalHeight || img.videoHeight || img.height;
      const drawHeight = layer.height ? lh : lw * ih / iw;
      if (iw) ctx.drawImage(img, ox, 0, lw, drawHeight);
      bound.height = drawHeight;
    }
  } else if (type === 'rect' || type === 'shape') {
    ctx.fillStyle = layer.color || project.brand?.colors?.navy || project.brand?.navy || '#1A2B4C';
    rounded(ctx, ox, 0, lw * (layer.animation === 'wipe' ? anim.progress : 1), lh, finite(layer.radius, 12));
    ctx.fill();
    if (layer.stroke) {ctx.strokeStyle = layer.stroke; ctx.lineWidth = finite(layer.strokeWidth, 2); ctx.stroke();}
  } else if (type === 'line') {
    ctx.strokeStyle = layer.color || '#C5A564';
    ctx.lineWidth = finite(layer.strokeWidth || layer.height, 5); ctx.lineCap = 'round';
    ctx.beginPath();ctx.moveTo(ox, 0);ctx.lineTo(ox + lw * anim.progress, finite(layer.endY));ctx.stroke();
    bound.y -= 10;bound.height = 20;
  } else if (type === 'chart' || type === 'graph') {
    const rawPoints = layer.points || layer.values;
    const points = Array.isArray(rawPoints) && rawPoints.length > 1 ? (Array.isArray(rawPoints[0]) ? rawPoints.map(p => [finite(p[0]), finite(p[1])]) : rawPoints.map((v, i, all) => [i / (all.length - 1), 1 - finite(v) / Math.max(1, ...all.map(x => finite(x)))])) : [[0, .9], [.2, .82], [.4, .65], [.6, .5], [.8, .3], [1, .08]];
    ctx.strokeStyle = layer.gridColor || 'rgba(245,240,230,.25)';ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {ctx.beginPath();ctx.moveTo(ox, i * lh / 3);ctx.lineTo(ox + lw, i * lh / 3);ctx.stroke();}
    ctx.strokeStyle = layer.color || '#C5A564';ctx.lineWidth = finite(layer.strokeWidth, 8);ctx.lineCap = 'round';ctx.lineJoin = 'round';
    const amount = clamp((localTime - finite(layer.delay ?? layer.start)) / finite(layer.drawDuration, 1.2), 0, 1);
    ctx.beginPath();
    const max = amount * (points.length - 1);
    for (let i = 0; i <= max && i < points.length; i++) {
      const p = points[i]; if (i === 0) ctx.moveTo(ox + p[0] * lw, p[1] * lh); else ctx.lineTo(ox + p[0] * lw, p[1] * lh);
    }
    const next = Math.ceil(max), prev = Math.floor(max);
    if (next < points.length && next !== prev) {const t = max - prev;ctx.lineTo(ox + (points[prev][0] + (points[next][0] - points[prev][0]) * t) * lw, (points[prev][1] + (points[next][1] - points[prev][1]) * t) * lh);}
    ctx.stroke();
  } else {
    ctx.font = fontString(layer);
    ctx.textAlign = align;ctx.textBaseline = 'top';
    let text = String(layer.text ?? '');
    if (type === 'counter') text = `${layer.prefix || ''}${Math.round(finite(layer.value, 100) * anim.progress).toLocaleString('es-MX')}${layer.suffix || ''}`;
    else if (layer.animation === 'count') text = text.replace(/-?\d+(?:\.\d+)?/, value => (Number(value) * anim.progress).toLocaleString('es-MX', {maximumFractionDigits: Number.isInteger(Number(value)) ? 0 : 1}));
    if (layer.animation === 'typewriter') text = text.slice(0, Math.max(1, Math.floor(anim.elapsed * finite(layer.charactersPerSecond, 32))));
    const lines = wrapText(ctx, text, lw);
    const lineHeight = finite(layer.fontSize, 64) * finite(layer.lineHeight, 1.12);
    const blockHeight = lineHeight * lines.length;
    if (layer.animation === 'wipe') {ctx.beginPath();ctx.rect(ox - 20, -20, (lw + 40) * anim.progress, blockHeight + 40);ctx.clip();}
    if (layer.background && layer.background !== 'transparent') {
      ctx.fillStyle = layer.background;
      rounded(ctx, ox - 18, -12, lw + 36, blockHeight + 24, finite(layer.radius, 12));ctx.fill();
    }
    ctx.fillStyle = layer.color || '#F5F0E6';
    if (layer.shadow !== false) {ctx.shadowColor = 'rgba(0,0,0,.65)';ctx.shadowBlur = 14;ctx.shadowOffsetY = 4;}
    lines.forEach((line, i) => {
      if (layer.stroke) {ctx.strokeStyle = layer.stroke;ctx.lineWidth = finite(layer.strokeWidth, 3);ctx.strokeText(line, 0, i * lineHeight);}
      ctx.fillText(line, 0, i * lineHeight);
    });
    bound.height = blockHeight;
    const actualWidth = Math.max(10, ...lines.map(l => ctx.measureText(l).width));
    bound.width = Math.min(lw, actualWidth);
    bound.x = align === 'center' ? anim.x - bound.width / 2 : align === 'right' ? anim.x - bound.width : anim.x;
  }
  if (ctx.getTransform) {
    const m = ctx.getTransform(), left = bound.x - anim.x, top = bound.y - anim.y;
    const corners = [[left, top], [left + bound.width, top], [left, top + bound.height], [left + bound.width, top + bound.height]].map(([x, y]) => ({x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f}));
    bound = {...bound, x: Math.min(...corners.map(p => p.x)), y: Math.min(...corners.map(p => p.y)), width: Math.max(...corners.map(p => p.x)) - Math.min(...corners.map(p => p.x)), height: Math.max(...corners.map(p => p.y)) - Math.min(...corners.map(p => p.y))};
  }
  hitRegions.push(bound);
  ctx.restore();
}

function captionWords(caption) {
  if (Array.isArray(caption.words) && caption.words.length) return caption.words.map(w => ({text: w.text ?? w.word ?? '', start: finite(w.start), end: finite(w.end, finite(w.start) + .2)}));
  const words = String(caption.text || '').split(/\s+/).filter(Boolean);
  const span = (finite(caption.end) - finite(caption.start)) / Math.max(1, words.length);
  return words.map((text, i) => ({text, start: finite(caption.start) + span * i, end: finite(caption.start) + span * (i + 1)}));
}

function drawCaption(ctx, caption, time, project, hitRegions) {
  const style = {...caption, ...(project.subtitleStyle || {}), ...(project.captionStyle || {}), ...(caption.style || {})};
  // Per-caption position stays editable even when a global typography preset is applied.
  if (caption.x != null) style.x = caption.x;
  if (caption.y != null) style.y = caption.y;
  if (project.captionsEnabled === false || style.enabled === false || caption.enabled === false || style.hidden || style.visible === false) return;
  const width = finite(project.width, 1080), fontSize = finite(style.fontSize, 64);
  const maxWidth = finite(style.width, width - 144), x = finite(style.x, width / 2), y = finite(style.y, 1340);
  ctx.save();
  const entry = ease((time - finite(caption.start)) / .13);
  const exit = clamp((finite(caption.end) - time) / .08, 0, 1);
  ctx.globalAlpha = Math.min(entry, exit);
  ctx.font = fontString({...style, fontSize, fontFamily: style.fontFamily || 'Studio Sans', fontWeight: style.fontWeight || 800});
  ctx.textBaseline = 'top';ctx.textAlign = 'left';
  const words = captionWords(caption).map(w => style.uppercase ? {...w, text: w.text.toLocaleUpperCase('es-MX')} : w), space = ctx.measureText(' ').width;
  const rows = [[]];let currentWidth = 0;
  for (const w of words) {
    const item = {...w, width: ctx.measureText(w.text).width};
    if (rows.at(-1).length && currentWidth + space + item.width > maxWidth) {rows.push([]);currentWidth = 0;}
    rows.at(-1).push(item);currentWidth += item.width + (rows.at(-1).length > 1 ? space : 0);
  }
  const lineHeight = fontSize * 1.15, totalHeight = rows.length * lineHeight;
  const maxLine = Math.max(1, ...rows.map(row => row.reduce((sum, w) => sum + w.width, 0) + Math.max(0, row.length - 1) * space));
  if (style.background !== 'transparent' && style.background !== false) {
    ctx.fillStyle = style.background || 'rgba(10,23,44,.68)';
    rounded(ctx, x - maxLine / 2 - 22, y - 13, maxLine + 44, totalHeight + 20, 16);ctx.fill();
  }
  rows.forEach((row, r) => {
    const rowWidth = row.reduce((sum, w) => sum + w.width, 0) + Math.max(0, row.length - 1) * space;
    let dx = x - rowWidth / 2;
    row.forEach(w => {
      const active = style.animation !== 'none' && time >= w.start && time < w.end;
      ctx.fillStyle = active ? (style.highlightColor || project.brand?.colors?.gold || project.brand?.gold || '#E2C98F') : (style.color || '#FFFFFF');
      ctx.shadowColor = 'rgba(0,0,0,.8)';ctx.shadowBlur = 5;ctx.shadowOffsetY = 3;
      ctx.fillText(w.text, dx, y + r * lineHeight + (1 - entry) * 12);dx += w.width + space;
    });
  });
  hitRegions.push({captionId: caption.id, type: 'caption', x: x - maxLine / 2, y, width: maxLine, height: totalHeight});
  ctx.restore();
}

function sceneOpacityTransform(ctx, scene, t, width, height) {
  const tr = typeof scene.transition === 'string' ? {type: scene.transition, duration: .22} : scene.transition || {};
  const raw = clamp((t - finite(scene.start)) / Math.max(.001, finite(tr.duration, .24)), 0, 1);
  const p = ease(raw), name = tr.type || 'cut';
  if (finite(scene.start) === 0 || name === 'cut' || raw >= 1) return;
  if (name === 'dissolve' || name === 'fade' || name === 'soft-push') ctx.globalAlpha *= p;
  else if (name === 'wipe-left' || name === 'wipe' || name === 'directional-cut') {ctx.beginPath();ctx.rect(0, 0, width * p, height);ctx.clip();}
  else if (name === 'wipe-right') {ctx.beginPath();ctx.rect(width * (1 - p), 0, width * p, height);ctx.clip();}
  else if (name === 'slide' || name === 'slide-left') {ctx.translate((1 - p) * width, 0);}
  else if (name === 'whip' || name === 'whip-pan') {ctx.translate((1 - p) * width, 0);ctx.filter = `blur(${Math.round((1 - p) * 18)}px)`;}
  else if (name === 'zoom' || name === 'match-cut') {const scale = 1 + .22 * (1 - p);ctx.translate(width / 2, height / 2);ctx.scale(scale, scale);ctx.translate(-width / 2, -height / 2);ctx.globalAlpha *= p;}
  else if (name === 'flash') {ctx.globalAlpha *= Math.max(.05, p);}
}

function drawScene(ctx, project, scene, time, resources, hitRegions, withTransition = true) {
  const width = finite(project.width, 1080), height = finite(project.height, 1920);
  const local = time - finite(scene.start), progress = clamp(local / Math.max(.01, finite(scene.duration)), 0, 1);
  ctx.save();
  if (withTransition) sceneOpacityTransform(ctx, scene, time, width, height);
  ctx.fillStyle = scene.backgroundColor || '#111C2B';ctx.fillRect(0, 0, width, height);
  const resource = resources.get(mediaId(scene))?.element;
  if (resource) drawCover(ctx, resource, width, height, scene, progress);
  else {
    ctx.fillStyle = '#1A2B4C';ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = '#9AADC5';ctx.font = '32px Arial';ctx.textAlign = 'center';ctx.fillText('Añade una imagen o un video', width / 2, height / 2);
  }
  const shade = scene.shade ?? scene.overlay ?? .25;
  const top = typeof shade === 'object' ? finite(shade.top, .38) : finite(shade, .25);
  const bottom = typeof shade === 'object' ? finite(shade.bottom, .25) : finite(shade, .25);
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, `rgba(6,16,30,${clamp(top, 0, 1)})`);
  gradient.addColorStop(.48, `rgba(6,16,30,${clamp(top * .12, 0, 1)})`);
  gradient.addColorStop(1, `rgba(6,16,30,${clamp(bottom, 0, 1)})`);
  ctx.fillStyle = gradient;ctx.fillRect(0, 0, width, height);
  for (const layer of orderedLayers(scene.layers)) drawLayer(ctx, layer, local, scene, project, resources, hitRegions);
  ctx.restore();
}

/** Pure compositor: pass a Map of loaded {element} resources via options.assets. */
export function renderFrame(project, time, canvas, options = {}) {
  const width = finite(project.width, 1080), height = finite(project.height, 1920);
  if (canvas.width !== width) canvas.width = width;
  if (canvas.height !== height) canvas.height = height;
  const ctx = canvas.getContext('2d', {alpha: false});
  const resources = options.assets || options.resources || new Map();
  const regions = [];
  ctx.save();ctx.setTransform(1, 0, 0, 1, 0, 0);ctx.globalAlpha = 1;ctx.filter = 'none';ctx.fillStyle = '#0D1420';ctx.fillRect(0, 0, width, height);
  const scene = activeScene(project, time);
  if (scene) {
    const scenes = project.scenes || [], index = scenes.indexOf(scene), tr = scene.transition || {};
    const trTime = typeof tr === 'object' ? finite(tr.duration, .24) : .24;
    if (index > 0 && time < finite(scene.start) + trTime && (tr.type || tr) !== 'cut') drawScene(ctx, project, scenes[index - 1], time, resources, [], false);
    drawScene(ctx, project, scene, time, resources, regions, true);
    for (const layer of orderedLayers(project.overlays)) drawLayer(ctx, layer, time, {id: scene.id, duration: projectDuration(project)}, project, resources, regions);
    for (const caption of project.captions || []) {
      if (time >= finite(caption.start) && time < finite(caption.end) && (!caption.sceneId || caption.sceneId === scene.id)) drawCaption(ctx, caption, time, project, regions);
    }
    if ((tr.type || tr) === 'flash' && time - finite(scene.start) < trTime) {ctx.globalAlpha = .65 * (1 - clamp((time - finite(scene.start)) / trTime, 0, 1));ctx.fillStyle = '#F5F0E6';ctx.fillRect(0, 0, width, height);}
  }
  ctx.restore();
  if (options.selectedLayerId) {
    const r = regions.find(x => x.layerId === options.selectedLayerId || x.captionId === options.selectedLayerId);
    if (r) {ctx.save();ctx.strokeStyle = '#6AE0C7';ctx.lineWidth = 4;ctx.setLineDash([12, 8]);ctx.strokeRect(r.x - 12, r.y - 12, r.width + 24, r.height + 24);ctx.restore();}
  }
  return {scene, regions};
}

/** Loading is cached by URL. Projects only refer to asset IDs, so replacements are non-destructive. */
export class StudioEngine {
  constructor(project, canvas, options = {}) {
    this.project = project;this.canvas = canvas;this.options = options;
    this.assets = new Map();this.audioBuffers = new Map();this.loading = new Map();this.audioLoading = new Map();
    this.time = 0;this.playing = false;this.muted = false;this.volume = clamp(project.masterVolume ?? 1, 0, 1);
    this.audioContext = null;this.audioBus = null;this.audioDestination = null;this.audioSources = [];this.compressor = null;
    this._raf = 0;this._playBase = 0;this._playStamp = 0;this._disposed = false;
    this.lastHitRegions = [];this.selectedLayerId = null;
  }
  get currentTime() { return this.time; }
  get isPlaying() { return this.playing; }
  duration() { return projectDuration(this.project); }
  getDuration() { return this.duration(); }
  resolveAsset(id) {return (this.project.assets || []).find(a => a.id === id);}
  async ready() {
    await this.loadAssets();
    if (document.fonts) await document.fonts.ready;
    this.render(this.time);return this;
  }
  async loadAssets() {
    const wanted = new Set((this.project.scenes || []).flatMap(s => [mediaId(s), ...(s.layers || []).map(l => l.assetId || l.mediaId)]));
    for (const t of this.project.audioTracks || []) wanted.add(t.assetId);
    for (const layer of this.project.overlays || []) wanted.add(layer.assetId || layer.mediaId);
    const tasks = (this.project.assets || []).filter(a => wanted.has(a.id) || a.type === 'font').map(a => this.loadAsset(a));
    const results = await Promise.allSettled(tasks);
    results.forEach((r, i) => {if (r.status === 'rejected') this.reportError(r.reason);});
  }
  async loadAsset(asset) {
    if (!asset?.url) return null;
    const existing = this.assets.get(asset.id);
    if (existing?.url === asset.url) return existing;
    if (this.loading.has(asset.url)) {const result = await this.loading.get(asset.url);this.assets.set(asset.id, result);return result;}
    const promise = (async () => {
      const type = asset.type || asset.kind || (/\.(mp4|webm|mov)(\?|$)/i.test(asset.url) ? 'video' : /\.(mp3|wav|ogg|m4a)(\?|$)/i.test(asset.url) ? 'audio' : 'image');
      let element;
      if (type === 'font') {
        const family = asset.family || asset.name || asset.id;
        const font = new FontFace(family, `url("${asset.url}")`);
        await font.load();document.fonts.add(font);
        const result = {url: asset.url, type, element: null, font};this.assets.set(asset.id, result);return result;
      }
      if (type === 'audio') {
        const response = await fetch(asset.url);if (!response.ok) throw new Error(`No se pudo cargar audio ${asset.name || asset.id} (${response.status})`);
        const bytes = await response.arrayBuffer();
        const result = {url: asset.url, type, bytes, element: null};this.assets.set(asset.id, result);return result;
      }
      if (type === 'video') {
        element = document.createElement('video');element.muted = true;element.preload = 'auto';element.playsInline = true;element.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {element.onloadeddata = resolve;element.onerror = () => reject(new Error(`No se pudo cargar video ${asset.name || asset.id}`));element.src = asset.url;element.load();});
        element.addEventListener('seeked', () => {if (!this.playing && !this._disposed) this.render(this.time, {skipVideoSync: true});});
      } else {
        element = new Image();element.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {element.onload = resolve;element.onerror = () => reject(new Error(`No se pudo cargar imagen ${asset.name || asset.id}`));element.src = asset.url;});
      }
      const result = {url: asset.url, type, element};this.assets.set(asset.id, result);return result;
    })();
    this.loading.set(asset.url, promise);
    try {return await promise;} finally {this.loading.delete(asset.url);}
  }
  reportError(error) {this.options.onError?.(error);this.onError?.(error);console.warn('[StudioEngine]', error);}
  render(time = this.time, options = {}) {
    this.time = clamp(time, 0, this.duration());
    if (!options.skipVideoSync) this.syncVideos(this.time);
    const result = renderFrame(this.project, Math.min(this.time, this.duration() - .0001), this.canvas, {assets: this.assets, selectedLayerId: this.selectedLayerId});
    this.lastHitRegions = result.regions;
    this.options.onRender?.(result);this.onRender?.(result);
    return result;
  }
  syncVideos(time) {
    const scene = activeScene(this.project, time);
    const active = new Map();
    if (scene) {
      active.set(mediaId(scene), {offset: finite(scene.media?.offset), time: time - finite(scene.start), speed: clamp(scene.media?.speed ?? 1, .1, 4)});
      for (const layer of scene.layers || []) if ((layer.type === 'video' || layer.type === 'image') && (layer.assetId || layer.mediaId)) active.set(layer.assetId || layer.mediaId, {offset: finite(layer.offset), time: time - finite(scene.start) - finite(layer.start), speed: clamp(layer.speed ?? 1, .1, 4)});
    }
    for (const [id, resource] of this.assets) {
      if (resource.type !== 'video') continue;
      const el = resource.element, target = active.get(id);
      if (!target) {el.pause();continue;}
      const next = clamp(target.offset + target.time * target.speed, 0, Number.isFinite(el.duration) ? Math.max(0, el.duration - .03) : 100000);
      el.playbackRate = target.speed;
      if (Math.abs(el.currentTime - next) > (this.playing ? .18 : .025)) {try {el.currentTime = next;} catch {}}
      if (this.playing && el.paused && target.time >= 0) el.play().catch(() => {});
      else if (!this.playing) el.pause();
    }
  }
  async ensureAudio() {
    if (!this.audioContext) {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) return;
      this.audioContext = new Audio();this.audioBus = this.audioContext.createGain();
      this.audioDestination = this.audioContext.createMediaStreamDestination();
      this.compressor = this.audioContext.createDynamicsCompressor();
      this.compressor.threshold.value = -3;this.compressor.knee.value = 4;this.compressor.ratio.value = 12;this.compressor.attack.value = .003;this.compressor.release.value = .18;
      this.audioBus.connect(this.compressor);this.compressor.connect(this.audioContext.destination);this.compressor.connect(this.audioDestination);
    }
    if (this.audioContext.state === 'suspended') await this.audioContext.resume();
    this.audioBus.gain.value = this.muted ? 0 : clamp(this.volume, 0, 1);
    const tasks = (this.project.audioTracks || []).filter(t => !t.muted).map(async t => {
      const asset = this.resolveAsset(t.assetId);if (!asset) return;
      const resource = this.assets.get(asset.id) || await this.loadAsset(asset);if (!resource?.bytes) return;
      if (!this.audioBuffers.has(asset.url)) {
        if (!this.audioLoading.has(asset.url)) this.audioLoading.set(asset.url, this.audioContext.decodeAudioData(resource.bytes.slice(0)));
        this.audioBuffers.set(asset.url, await this.audioLoading.get(asset.url));
      }
    });
    const results = await Promise.allSettled(tasks);for (const r of results) if (r.status === 'rejected') this.reportError(r.reason);
  }
  stopAudio() {
    for (const {source, gain} of this.audioSources) {try {source.stop();} catch {}try {source.disconnect();gain.disconnect();} catch {}}
    this.audioSources = [];
  }
  scheduleAudio(at = this.time) {
    this.stopAudio();if (!this.audioContext || !this.audioBus) return;
    const now = this.audioContext.currentTime + .025;
    for (const track of this.project.audioTracks || []) {
      if (track.muted || track.enabled === false) continue;
      const asset = this.resolveAsset(track.assetId), buffer = asset && this.audioBuffers.get(asset.url);if (!buffer) continue;
      const start = finite(track.start), offset = Math.max(0, finite(track.offset));
      const duration = Math.max(0, Math.min(finite(track.duration, buffer.duration - offset), buffer.duration - offset, this.duration() - start));
      const end = start + duration;if (end <= at || duration <= 0) continue;
      const beginAt = Math.max(start, at), elapsed = beginAt - start, remain = end - beginAt;
      const source = this.audioContext.createBufferSource(), gain = this.audioContext.createGain();source.buffer = buffer;
      const rawVol = finite(track.volume, track.kind === 'music' ? .14 : track.kind === 'sfx' ? .4 : 1);
      const volume = rawVol < 0 ? Math.pow(10, rawVol / 20) : clamp(rawVol, 0, 2);
      const scheduled = now + Math.max(0, start - at), fadeIn = Math.max(0, finite(track.fadeIn)), fadeOut = Math.max(0, finite(track.fadeOut));
      let initial = volume;if (fadeIn && elapsed < fadeIn) initial *= elapsed / fadeIn;
      if (fadeOut && remain < fadeOut) initial *= remain / fadeOut;
      gain.gain.setValueAtTime(initial, scheduled);
      if (fadeIn > elapsed) gain.gain.linearRampToValueAtTime(volume, scheduled + Math.min(remain, fadeIn - elapsed));
      if (fadeOut > 0) {const fadeStart = scheduled + Math.max(0, remain - fadeOut);gain.gain.setValueAtTime(volume, fadeStart);gain.gain.linearRampToValueAtTime(0, scheduled + remain);}
      if (track.kind === 'music' && track.ducking) {
        const voices = (this.project.audioTracks || []).filter(t => t.kind === 'voice' && !t.muted && t.enabled !== false);
        gain.gain.cancelScheduledValues(scheduled);
        let smoothed = 1;
        for (let delta = 0; delta <= remain + .1; delta += .1) {
          const elapsedAt = elapsed + Math.min(delta, remain), timelineAt = beginAt + Math.min(delta, remain);
          let peakRms = 0;
          for (const voice of voices) {
            const voiceAsset = this.resolveAsset(voice.assetId), b = voiceAsset && this.audioBuffers.get(voiceAsset.url);
            const vTime = timelineAt - finite(voice.start) + finite(voice.offset);
            if (!b || vTime < 0 || vTime >= b.duration || timelineAt > finite(voice.start) + finite(voice.duration, b.duration)) continue;
            const samples = b.getChannelData(0), sampleStart = Math.floor(vTime * b.sampleRate), sampleEnd = Math.min(samples.length, sampleStart + Math.floor(.06 * b.sampleRate));
            let sum = 0, count = 0;for (let i = sampleStart; i < sampleEnd; i += 8) {sum += samples[i] * samples[i];count++;}
            peakRms = Math.max(peakRms, Math.sqrt(sum / Math.max(1, count)));
          }
          const target = peakRms > .012 ? .76 : 1;smoothed += (target - smoothed) * (target < smoothed ? .8 : .25);
          let amount = volume * smoothed;if (fadeIn) amount *= clamp(elapsedAt / fadeIn, 0, 1);if (fadeOut) amount *= clamp((duration - elapsedAt) / fadeOut, 0, 1);
          if (delta === 0) gain.gain.setValueAtTime(amount, scheduled);else gain.gain.linearRampToValueAtTime(amount, scheduled + Math.min(delta, remain));
        }
      }
      source.connect(gain);gain.connect(this.audioBus);source.start(scheduled, offset + elapsed, remain);
      this.audioSources.push({source, gain, trackId: track.id});
    }
  }
  setMuted(muted) {this.muted = Boolean(muted);if (this.audioBus) this.audioBus.gain.value = this.muted ? 0 : this.volume;}
  setVolume(value) {this.volume = clamp(value, 0, 1);if (this.audioBus) this.audioBus.gain.value = this.muted ? 0 : this.volume;}
  async play(options = {}) {
    if (this.playing) return;
    if (this.time >= this.duration() - .03) this.time = 0;
    if (!options.audioReady) await this.ensureAudio();if (this._disposed) return;
    this.playing = true;this._playBase = this.time;this._playStamp = performance.now();
    this.scheduleAudio(this.time);
    this.options.onPlayState?.(true);this.onPlayState?.(true);
    const tick = stamp => {
      if (!this.playing || this._disposed) return;
      this.time = Math.min(this.duration(), this._playBase + (stamp - this._playStamp) / 1000);
      this.render(this.time);this.options.onTime?.(this.time);this.onTime?.(this.time);
      if (this.time >= this.duration()) {this.pause();this.options.onEnded?.();this.onEnded?.();return;}
      this._raf = requestAnimationFrame(tick);
    };
    this._raf = requestAnimationFrame(tick);
  }
  pause() {
    this.playing = false;cancelAnimationFrame(this._raf);this.stopAudio();
    for (const resource of this.assets.values()) if (resource.type === 'video') resource.element.pause();
    this.options.onPlayState?.(false);this.onPlayState?.(false);
  }
  seek(time) {
    this.time = clamp(time, 0, this.duration());
    if (this.playing) {this._playBase = this.time;this._playStamp = performance.now();this.scheduleAudio(this.time);}
    this.render(this.time);this.options.onTime?.(this.time);this.onTime?.(this.time);return this.time;
  }
  async updateProject(project) {
    const wasPlaying = this.playing;if (wasPlaying) this.pause();
    this.project = project;this.setVolume(project.masterVolume ?? 1);await this.loadAssets();
    this.render(Math.min(this.time, this.duration()));
    if (wasPlaying) await this.play();return this;
  }
  hitTest(x, y) {return [...this.lastHitRegions].reverse().find(r => x >= r.x - 10 && x <= r.x + r.width + 10 && y >= r.y - 10 && y <= r.y + r.height + 10) || null;}
  getLayerBounds(sceneId, layerId) {return this.lastHitRegions.find(r => r.layerId === layerId && (!sceneId || r.sceneId === sceneId)) || null;}
  async dispose() {this.pause();this._disposed = true;this.assets.clear();this.audioBuffers.clear();if (this.audioContext) await this.audioContext.close();}
}
