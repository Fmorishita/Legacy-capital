// Legacy Studio (Claude) — editor tipo CapCut sobre el motor de Legacy Studio.
// Lo que se ve aquí es exactamente lo que renderiza Claude (mismo StudioEngine).
import {StudioEngine, activeScene} from './engine.js';
import {ProjectStore} from './storage.js';
import {conectarNube, CloudStore} from './claude-cloud.js';
import {exportVideo, downloadBlob, availableVideoFormats} from './exporter.js';

const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
const clone = v => structuredClone(v);
const r3 = n => Math.round(n * 1000) / 1000;
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const now = () => new Date().toISOString();
const uid = p => `${p}-${(crypto.randomUUID?.() || Date.now().toString(36) + Math.random().toString(36).slice(2)).slice(0, 12)}`;
const fmt = t => { t = Math.max(0, t); const m = Math.floor(t / 60), s = t - m * 60; return `${String(m).padStart(2, '0')}:${s.toFixed(2).padStart(5, '0')}`; };
const NAVY = '#1A2B4C', GOLD = '#C5A564', CREAM = '#F5F0E6';

const S = {nube: null, store: null, project: null, engine: null, sel: null, undo: [], redo: [], zoom: 40, lib: 'medios',
  saveTimer: 0, saving: false, pendingSave: false, solicitudes: [], dragging: null};
const P = () => S.project;
const fps = () => P()?.fps || 24;
const dur = () => S.engine ? S.engine.duration() : 0;

// ---------------------------------------------------------------- avisos
function toast(msg, kind = '', ms = 4500) {
  const t = document.createElement('div'); t.className = 'toast ' + kind; t.textContent = msg;
  $('toasts').append(t); setTimeout(() => t.remove(), ms);
}
function dialog(html, onOpen) {
  $('dlgbody').innerHTML = html; const d = $('dlg');
  if (!d.open) d.showModal(); onOpen?.(d); return d;
}

// ---------------------------------------------------------------- arranque y selector de video
async function boot() {
  try { S.nube = await conectarNube(); } catch { S.nube = null; }
  S.store = S.nube ? new CloudStore(S.nube) : new ProjectStore();
  if (S.nube) S.nube.db.collection('solicitudes').onSnapshot(snap => { S.solicitudes = snap.docs.map(d => ({id: d.id, ...d.data()})); pintarSolicitudes(); }, () => {});
  wire();
  await mostrarSelector();
}

async function listado() {
  const lista = [];
  if (S.nube) {
    const q = await S.nube.db.collection('proyectos').get();
    for (const d of q.docs) { const x = d.data(); if (x.project) lista.push(x.project); }
  } else {
    for (const m of await S.store.listProjects().catch(() => [])) { const p = await S.store.load(m.id).catch(() => null); if (p) lista.push(p); }
  }
  if (!lista.length) {
    const base = await (await fetch('doctor-v6.json')).json();
    lista.push(base);
  }
  return lista.sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
}

function miniatura(p) {
  const s = p.scenes?.[0], a = (p.assets || []).find(x => x.id === s?.mediaId);
  return a?.thumbnail?.startsWith('blob:') || a?.url?.startsWith('blob:') ? '' : (a?.thumbnail || a?.url || '');
}

async function mostrarSelector() {
  $('picker').hidden = false;
  if (S.engine?.playing) S.engine.pause();
  let lista;
  try { lista = await listado(); } catch (e) { $('projs').innerHTML = `<div class="empty">No pude leer tus videos: ${esc(e.message)}</div>`; return; }
  $('projs').innerHTML = lista.map(p => {
    const d = Math.max(0, ...(p.scenes || []).map(s => s.start + s.duration));
    return `<button class="proj" data-id="${esc(p.id)}"><div class="pv" style="background-image:url('${esc(miniatura(p))}')"></div>
      <div class="meta"><b>${esc(p.title)}</b><small>${esc(p.version || '')}</small><small>${fmt(d)} · ${p.scenes?.length || 0} tomas${p.updatedAt ? ' · ' + new Date(p.updatedAt).toLocaleString('es-MX', {dateStyle: 'short', timeStyle: 'short'}) : ''}</small></div></button>`;
  }).join('') + `<button class="proj nuevo" data-dup="1"><div class="pv">⧉</div><div class="meta"><b>Duplicar un video</b><small>Crea una copia para probar otra versión sin tocar la original</small></div></button>`;
  $('projs').onclick = async ev => {
    const b = ev.target.closest('.proj'); if (!b) return;
    if (b.dataset.dup) return duplicarDialogo(lista);
    const p = lista.find(x => x.id === b.dataset.id);
    $('projs').querySelectorAll('.proj').forEach(x => x.disabled = true);
    try { await abrir(p); } catch (e) { toast('No se pudo abrir: ' + e.message, 'err', 8000); $('projs').querySelectorAll('.proj').forEach(x => x.disabled = false); }
  };
}

function duplicarDialogo(lista) {
  dialog(`<h2>Duplicar un video</h2><p class="hint">La copia es independiente: lo que cambies ahí no toca la original.</p>
    <div class="fld"><span>¿Cuál?</span><select id="dup-src">${lista.map(p => `<option value="${esc(p.id)}">${esc(p.title)}</option>`).join('')}</select></div>
    <div class="fld"><span>Nombre de la copia</span><input type="text" id="dup-name"></div>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="dup-no">Cancelar</button><button class="btn gold" id="dup-ok">Duplicar y abrir</button></div>`, d => {
    const sync = () => { $('dup-name').value = lista.find(p => p.id === $('dup-src').value).title + ' · copia'; };
    sync(); $('dup-src').onchange = sync; $('dup-no').onclick = () => d.close();
    $('dup-ok').onclick = async () => {
      const src = clone(lista.find(p => p.id === $('dup-src').value)); src.id = uid('proyecto'); src.title = $('dup-name').value.trim() || src.title + ' · copia';
      d.close(); await abrir(src, true);
    };
  });
}

async function abrir(p, nuevo = false) {
  const proyecto = nuevo ? p : ((await S.store.load(p.id).catch(() => null)) || await S.store.hydrate(p));
  S.project = proyecto; S.undo = []; S.redo = []; S.sel = null;
  if (S.engine) await S.engine.dispose();
  S.engine = new StudioEngine(S.project, $('cv'), {onTime: t => pintarTiempo(t), onPlayState: on => { $('b-play').textContent = on ? '❚❚' : '▶'; }, onError: e => console.warn(e)});
  await S.engine.ready();
  try { localStorage.setItem('legacy-studio-ultimo', S.project.id); } catch {}
  $('picker').hidden = true;
  $('p-title').value = S.project.title || '';
  S.zoom = Math.max(8, Math.round(($('tlscroll').clientWidth - 20) / Math.max(1, dur())));
  $('zoom').value = S.zoom;
  if (nuevo) guardarYa(); else estadoGuardado('ok', 'Guardado');
  seleccionar({kind: 'scene', id: S.project.scenes[0].id});
  ajustarLienzo(); pintarLib(); pintarTimeline(); pintarSolicitudes(); S.engine.seek(0);
}

// ---------------------------------------------------------------- cambios, deshacer y autoguardado
function checkpoint() { S.undo.push(JSON.stringify(P())); if (S.undo.length > 60) S.undo.shift(); S.redo = []; }
function cambiar(fn, {sinUndo = false, medios = false} = {}) {
  if (!sinUndo) checkpoint();
  fn(P());
  P().updatedAt = now();
  const t = S.engine.time;
  if (medios) S.engine.loadAssets().then(() => S.engine.render(t)); else S.engine.render(t);
  programarGuardado(); pintarTimeline(); pintarInspector(); pintarSelBadge();
}
function restaurar(json) {
  const t = S.engine.time; const nuevo = JSON.parse(json);
  Object.keys(P()).forEach(k => delete P()[k]); Object.assign(P(), nuevo);
  S.engine.loadAssets().then(() => S.engine.render(Math.min(t, dur())));
  if (S.sel && !buscarSel(S.sel)) S.sel = {kind: 'scene', id: activeScene(P(), t).id};
  programarGuardado(); pintarTimeline(); pintarInspector(); pintarSelBadge(); $('p-title').value = P().title || '';
}
function deshacer() { if (!S.undo.length) return; S.redo.push(JSON.stringify(P())); restaurar(S.undo.pop()); }
function rehacer() { if (!S.redo.length) return; S.undo.push(JSON.stringify(P())); restaurar(S.redo.pop()); }

function estadoGuardado(kind, txt) { const e = $('save'); e.className = 'save' + (kind === 'pend' ? ' pend' : kind === 'err' ? ' err' : ''); e.textContent = txt; }
function programarGuardado() { estadoGuardado('pend', 'Guardando…'); clearTimeout(S.saveTimer); S.saveTimer = setTimeout(guardarYa, 700); }
async function guardarYa() {
  if (S.saving) { S.pendingSave = true; return; }
  S.saving = true;
  try { await S.store.save(P()); estadoGuardado('ok', S.nube ? 'Guardado en la nube' : 'Guardado en este navegador'); }
  catch (e) { estadoGuardado('err', 'No se guardó'); toast(e.message || 'No se pudo guardar', 'err', 8000); }
  S.saving = false;
  if (S.pendingSave) { S.pendingSave = false; guardarYa(); }
}
window.addEventListener('beforeunload', ev => { if (S.saving || $('save').classList.contains('pend')) { guardarYa(); ev.preventDefault(); } });

// ---------------------------------------------------------------- selección
function buscarSel(sel) {
  const p = P(); if (!sel) return null;
  if (sel.kind === 'scene') return p.scenes.find(s => s.id === sel.id);
  if (sel.kind === 'layer') { const sc = p.scenes.find(s => s.id === sel.sceneId); return sc?.layers?.find(l => l.id === sel.id); }
  if (sel.kind === 'overlay') return p.overlays?.find(l => l.id === sel.id);
  if (sel.kind === 'caption') return p.captions.find(c => c.id === sel.id);
  if (sel.kind === 'audio') return p.audioTracks.find(t => t.id === sel.id);
  return null;
}
function seleccionar(sel) {
  S.sel = sel; S.engine.selectedLayerId = sel && (sel.kind === 'layer' || sel.kind === 'overlay' || sel.kind === 'caption') ? sel.id : null;
  S.engine.render(S.engine.time); pintarInspector(); pintarSelBadge();
  document.querySelectorAll('.blk').forEach(b => b.classList.toggle('sel', !!sel && b.dataset.id === sel.id));
  if (matchMedia('(max-width: 900px)').matches) document.body.classList.remove('m-lib');
}
function nombreSel() {
  const x = buscarSel(S.sel); if (!x) return '';
  return {scene: 'Toma', layer: 'Texto', overlay: 'Texto de apertura', caption: 'Subtítulo', audio: 'Audio'}[S.sel.kind] + ': ' + (x.title || x.text || x.name || x.id).toString().split('\n')[0].slice(0, 40);
}
function pintarSelBadge() { const n = nombreSel(); $('selbadge').innerHTML = n ? `Editando <b>${esc(n)}</b>` : 'Toca un elemento del video para editarlo'; }

// ---------------------------------------------------------------- vista previa: tocar y arrastrar elementos
function aProyecto(ev) {
  const r = $('cv').getBoundingClientRect();
  return {x: (ev.clientX - r.left) / r.width * (P().width || 1080), y: (ev.clientY - r.top) / r.height * (P().height || 1920)};
}
function wireCanvas() {
  const cv = $('cv');
  cv.addEventListener('pointerdown', ev => {
    if (!P()) return;
    if (S.engine.playing) S.engine.pause();
    const pt = aProyecto(ev), hit = S.engine.hitTest(pt.x, pt.y), t = S.engine.time, sc = activeScene(P(), t);
    let sel;
    if (hit?.captionId) sel = {kind: 'caption', id: hit.captionId};
    else if (hit?.layerId) sel = sc.layers?.some(l => l.id === hit.layerId) ? {kind: 'layer', id: hit.layerId, sceneId: sc.id} : {kind: 'overlay', id: hit.layerId};
    else sel = {kind: 'scene', id: sc.id};
    seleccionar(sel);
    const obj = buscarSel(sel); if (!obj) return;
    const ini = {pt, x: sel.kind === 'scene' ? (obj.media?.x || 0) : obj.x, y: sel.kind === 'scene' ? (obj.media?.y || 0) : obj.y, movido: false};
    cv.setPointerCapture(ev.pointerId);
    const mover = e => {
      const q = aProyecto(e), dx = q.x - ini.pt.x, dy = q.y - ini.pt.y;
      if (!ini.movido && Math.hypot(dx, dy) < 8) return;
      if (!ini.movido) { checkpoint(); ini.movido = true; }
      if (sel.kind === 'scene') { obj.media = obj.media || {}; obj.media.x = Math.round(ini.x + dx); obj.media.y = Math.round(ini.y + dy); }
      else if (sel.kind === 'caption') { obj.y = Math.round(clamp(ini.y + dy, 200, 1700)); }
      else { obj.x = Math.round(ini.x + dx); obj.y = Math.round(ini.y + dy); }
      S.engine.render(S.engine.time);
    };
    const soltar = () => { cv.removeEventListener('pointermove', mover); cv.removeEventListener('pointerup', soltar); if (ini.movido) { P().updatedAt = now(); programarGuardado(); pintarInspector(); } };
    cv.addEventListener('pointermove', mover); cv.addEventListener('pointerup', soltar);
  });
}

// tamaño de la vista previa: 9:16 dentro del espacio disponible
function ajustarLienzo() {
  const v = document.querySelector('.view'), cv = $('cv'); if (!v) return;
  const w = v.clientWidth - 28, h = v.clientHeight - 28, r = (P()?.width || 1080) / (P()?.height || 1920);
  const ancho = Math.max(60, Math.min(w, h * r));
  cv.style.width = ancho + 'px'; cv.style.height = ancho / r + 'px';
}
new ResizeObserver(ajustarLienzo).observe(document.querySelector('.view'));

// ---------------------------------------------------------------- reproducción
function pintarTiempo(t) {
  $('tc').innerHTML = `<b>${fmt(t)}</b> / ${fmt(dur())} · <span class="mono">f${Math.round(t * fps())}</span>`;
  const x = t * S.zoom; $('ph').style.left = x + 'px';
  const sc = $('tlscroll');
  if (S.engine?.playing && (x < sc.scrollLeft || x > sc.scrollLeft + sc.clientWidth - 40)) sc.scrollLeft = x - 60;
  if (!S.engine?.playing && S.sel?.kind === 'scene') {
    const a = activeScene(P(), t); if (a && a.id !== S.sel.id) { S.sel = {kind: 'scene', id: a.id}; pintarInspector(); pintarSelBadge(); document.querySelectorAll('.blk').forEach(b => b.classList.toggle('sel', b.dataset.id === a.id)); }
  }
}
const ir = t => { if (S.engine.playing) S.engine.pause(); S.engine.seek(clamp(t, 0, dur() - 0.001)); };
function alternar() { if (!S.engine) return; if (S.engine.playing) S.engine.pause(); else S.engine.play().catch(e => toast(e.message, 'err')); }
function tomaVecina(d) {
  const i = P().scenes.indexOf(activeScene(P(), S.engine.time)), s = P().scenes[clamp(i + d, 0, P().scenes.length - 1)];
  ir(s.start + 0.01); seleccionar({kind: 'scene', id: s.id});
}

// ---------------------------------------------------------------- línea de tiempo
function pintarTimeline() {
  if (!P()) return;
  const Z = S.zoom, D = dur(), W = Math.ceil(D * Z) + 120, p = P();
  $('tlin').style.width = W + 'px';
  const paso = [0.5, 1, 2, 5, 10, 15, 30].find(s => s * Z >= 60) || 30;
  let r = ''; for (let s = 0; s <= D; s += paso) r += `<span style="left:${s * Z}px">${fmt(s).replace(/\.\d+$/, '')}</span>`;
  $('ruler').innerHTML = r;
  const blk = (cls, id, start, len, txt, extra = '') => `<div class="blk ${cls}${S.sel?.id === id ? ' sel' : ''}" data-id="${esc(id)}" style="left:${start * Z}px;width:${Math.max(4, len * Z - 1)}px;${extra}" title="${esc(txt)}">${esc(txt)}</div>`;
  const asset = id => p.assets.find(a => a.id === id);
  $('tr-video').innerHTML = p.scenes.map(s => { const a = asset(s.mediaId); const th = a?.thumbnail || a?.url || '';
    return blk('video', s.id, s.start, s.duration, (s.title || s.id).replace(/^\d+\w?\s*·\s*/, ''), th ? `background-image:linear-gradient(90deg,rgb(20 30 50/55%),rgb(20 30 50/15%)),url('${esc(th)}')` : ''); }).join('')
    + p.scenes.slice(1).map((s, i) => `<div class="cut" data-i="${i + 1}" style="left:${s.start * Z}px" title="Arrastra para adelantar o atrasar este corte"></div>`).join('');
  const textos = [];
  for (const s of p.scenes) for (const l of s.layers || []) if (l.type === 'text' || l.type === 'counter') {
    const st = s.start + (l.start || 0), len = l.duration != null ? l.duration : s.start + s.duration - st;
    textos.push(blk('text', l.id, st, len, l.text || (l.type === 'counter' ? `${l.prefix || ''}${l.value}` : 'Texto')).replace('data-id', `data-scene="${esc(s.id)}" data-kind="layer" data-id`));
  }
  for (const o of p.overlays || []) if (o.type === 'text') textos.push(blk('text', o.id, o.start || 0, o.duration ?? D, o.text).replace('data-id', 'data-kind="overlay" data-id'));
  $('tr-text').innerHTML = textos.join('');
  $('tr-cap').innerHTML = p.captions.map(c => blk('cap', c.id, c.start, c.end - c.start, c.text).replace('data-id', 'data-kind="caption" data-id')).join('');
  const aud = k => p.audioTracks.filter(t => t.kind === k && !t.muted);
  $('tr-voz').innerHTML = aud('voice').map(t => blk('voz', t.id, t.start, t.duration, t.name || 'Voz').replace('data-id', 'data-kind="audio" data-id')).join('');
  $('tr-mus').innerHTML = aud('music').map(t => blk('mus', t.id, t.start, t.duration, t.name || 'Música').replace('data-id', 'data-kind="audio" data-id')).join('');
  $('tr-sfx').innerHTML = aud('sfx').map(t => blk('sfx', t.id, t.start, Math.max(t.duration, .25), (t.name || 'SFX').replace(/^\d+\s*·\s*/, '')).replace('data-id', 'data-kind="audio" data-id')).join('');
  pintarTiempo(S.engine.time);
}

function wireTimeline() {
  const tlin = $('tlin');
  const tiempoDe = ev => (ev.clientX - tlin.getBoundingClientRect().left) / S.zoom;
  tlin.addEventListener('pointerdown', ev => {
    if (!P()) return;
    const cut = ev.target.closest('.cut'), b = ev.target.closest('.blk');
    if (cut) return arrastrarCorte(ev, +cut.dataset.i, cut);
    if (!b) { ir(tiempoDe(ev)); return; }
    const id = b.dataset.id, kind = b.dataset.kind || 'scene';
    const sel = kind === 'layer' ? {kind, id, sceneId: b.dataset.scene} : {kind, id};
    seleccionar(sel);
    const obj = buscarSel(sel), t0 = tiempoDe(ev);
    if (kind === 'scene') { ir(Math.max(obj.start + 0.01, t0)); return; }
    if (kind === 'audio' && obj.kind !== 'sfx') { ir(t0); return; }
    ir(t0);
    const ini = {start: obj.start || 0, end: obj.end, words: obj.words && clone(obj.words), movido: false};
    tlin.setPointerCapture(ev.pointerId);
    const mover = e => {
      const d = tiempoDe(e) - t0; if (!ini.movido && Math.abs(d * S.zoom) < 4) return;
      if (!ini.movido) { checkpoint(); ini.movido = true; }
      if (kind === 'caption') {
        const dd = clamp(d, -ini.start, dur() - ini.end); obj.start = r3(ini.start + dd); obj.end = r3(ini.end + dd);
        obj.words = ini.words?.map(w => ({...w, start: r3(w.start + dd), end: r3(w.end + dd)}));
      } else if (kind === 'layer') {
        const sc = P().scenes.find(s => s.id === sel.sceneId); obj.start = r3(clamp(ini.start + d, 0, sc.duration - 0.2));
      } else obj.start = r3(clamp(ini.start + d, 0, dur() - 0.1));
      S.engine.render(S.engine.time); pintarTimelineRapido(b, kind === 'layer' ? P().scenes.find(s => s.id === sel.sceneId).start + obj.start : obj.start);
    };
    const soltar = () => { tlin.removeEventListener('pointermove', mover); tlin.removeEventListener('pointerup', soltar);
      if (ini.movido) { P().updatedAt = now(); if (kind === 'audio' && S.engine.playing) S.engine.scheduleAudio(S.engine.time); programarGuardado(); pintarTimeline(); pintarInspector(); } };
    tlin.addEventListener('pointermove', mover); tlin.addEventListener('pointerup', soltar);
  });
  $('zoom').oninput = e => { S.zoom = +e.target.value; pintarTimeline(); };
}
function pintarTimelineRapido(b, start) { b.style.left = start * S.zoom + 'px'; }

// mover el corte entre dos tomas: la anterior se alarga y la siguiente empieza después (o al revés)
function arrastrarCorte(ev, i, el) {
  const tlin = $('tlin'), sc = P().scenes, a = sc[i - 1], b = sc[i];
  const ini = {aDur: a.duration, bStart: b.start, bDur: b.duration}, x0 = ev.clientX; let movido = false;
  el.classList.add('drag'); tlin.setPointerCapture(ev.pointerId);
  const mover = e => {
    let d = (e.clientX - x0) / S.zoom; if (!movido && Math.abs(d * S.zoom) < 3) return;
    if (!movido) { checkpoint(); movido = true; }
    d = clamp(Math.round(d * fps()) / fps(), -(ini.aDur - 0.3), ini.bDur - 0.3);
    a.duration = r3(ini.aDur + d); b.start = r3(ini.bStart + d); b.duration = r3(ini.bDur - d);
    a.coreEnd = b.start; ir(b.start - 0.001 + (d < 0 ? 0.002 : 0));
    el.style.left = b.start * S.zoom + 'px'; $('tlhint').textContent = `Corte en ${fmt(b.start)} (${d >= 0 ? '+' : ''}${d.toFixed(2)} s)`;
  };
  const soltar = () => { tlin.removeEventListener('pointermove', mover); tlin.removeEventListener('pointerup', soltar); el.classList.remove('drag');
    if (movido) { P().updatedAt = now(); programarGuardado(); pintarTimeline(); pintarInspector(); toast(`Corte movido a ${fmt(b.start)}. Deshacer: Ctrl Z`); } };
  tlin.addEventListener('pointermove', mover); tlin.addEventListener('pointerup', soltar);
}
function moverCorte(i, d) {
  const sc = P().scenes, a = sc[i - 1], b = sc[i]; if (!a || !b) return;
  d = clamp(d, -(a.duration - 0.3), b.duration - 0.3);
  cambiar(() => { a.duration = r3(a.duration + d); b.start = r3(b.start + d); b.duration = r3(b.duration - d); a.coreEnd = b.start; });
}

// ---------------------------------------------------------------- inspector
const TRANS = [['cut', 'Corte seco'], ['dissolve', 'Disolvencia'], ['zoom', 'Zoom'], ['wipe-left', 'Barrido →'], ['wipe-right', 'Barrido ←'], ['slide', 'Deslizar'], ['whip', 'Látigo'], ['flash', 'Destello']];
const MOV = [['none', 'Sin movimiento'], ['push-in', 'Acercar'], ['pull-out', 'Alejar'], ['drift-left', 'Hacia la izquierda'], ['drift-right', 'Hacia la derecha'], ['drift-up', 'Hacia arriba']];
const ANIM = [['rise', 'Subir'], ['pop', 'Rebote'], ['slide-left', 'Deslizar'], ['wipe', 'Barrido'], ['typewriter', 'Máquina de escribir'], ['count', 'Contar números'], ['pulse', 'Latido'], ['none', 'Sin animación']];
const COLORES = ['#F5F0E6', '#FFFFFF', '#C5A564', '#E2C98F', '#1A2B4C', '#F2C94C', '#111111'];
const opts = (list, v) => list.map(([k, t]) => `<option value="${k}"${k === v ? ' selected' : ''}>${t}</option>`).join('');
const rango = (id, label, v, min, max, step, unidad = '') => `<label class="fld"><span>${label}<b id="${id}-v">${(+v).toFixed(step < 1 ? 2 : 0)}${unidad}</b></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${v}"></label>`;

function pintarInspector() {
  const box = $('insp'), sel = S.sel, x = buscarSel(sel);
  if (!P() || !x) { box.innerHTML = `<div class="empty">Toca algo en el video o en la línea de tiempo para editarlo.</div>`; return; }
  if (sel.kind === 'scene') return inspToma(box, x);
  if (sel.kind === 'layer' || sel.kind === 'overlay') return inspTexto(box, x, sel);
  if (sel.kind === 'caption') return inspSub(box, x);
  if (sel.kind === 'audio') return inspAudio(box, x);
}

function enlazar(id, fn, {evento = 'input', num = true, vivo = true} = {}) {
  const el = $(id); if (!el) return;
  let marcado = false;
  el.addEventListener('focus', () => { marcado = false; });
  el.addEventListener('pointerdown', () => { marcado = false; });
  el.addEventListener(evento, () => {
    if (!marcado) { checkpoint(); marcado = true; }
    const v = num ? +el.value : el.value; fn(v);
    const out = $(id + '-v'); if (out) out.textContent = (Number.isInteger(+el.step) && +el.step >= 1 ? Math.round(v) : (+v).toFixed(2)) + (out.dataset.u || '');
    P().updatedAt = now(); S.engine.render(S.engine.time); programarGuardado();
    if (!vivo) { pintarTimeline(); }
  });
  el.addEventListener('change', () => { marcado = false; pintarTimeline(); pintarSelBadge(); });
}

function inspToma(box, s) {
  const i = P().scenes.indexOf(s), a = P().assets.find(x => x.id === s.mediaId), m = s.media || (s.media = {});
  const tr = typeof s.transition === 'object' ? s.transition : {type: s.transition || 'cut', duration: .24};
  box.innerHTML = `<h2>Toma ${i + 1}${s.headline ? ' · ' + esc(s.headline.split('\n')[0]) : ''} <span class="tag">${fmt(s.start)} · ${s.duration.toFixed(2)} s</span></h2>
    ${s.narration ? `<p class="hint">🎙 «${esc(s.narration)}»</p>` : ''}
    <div class="mediabox">${a ? `<img src="${esc(a.thumbnail || a.url)}" alt="">` : ''}<div class="row" style="flex-direction:column;align-items:stretch;flex:1">
      <button class="btn sm" id="i-cambiar">Cambiar imagen</button><button class="btn sm" id="i-prompt">✦ Prompt para imagen nueva</button></div></div>
    <hr class="sep"><h3>Tiempo de la toma</h3>
    <div class="row"><span class="hint" style="flex:1">Inicio del corte</span>${i > 0 ? `<button class="btn sm" data-c="${i}" data-d="-0.25">−0.25 s</button><button class="btn sm" data-c="${i}" data-d="0.25">+0.25 s</button>` : '<span class="hint">primera toma</span>'}</div>
    <div class="row"><span class="hint" style="flex:1">Final de la toma</span>${i < P().scenes.length - 1 ? `<button class="btn sm" data-c="${i + 1}" data-d="-0.25">−0.25 s</button><button class="btn sm" data-c="${i + 1}" data-d="0.25">+0.25 s</button>` : '<span class="hint">última toma</span>'}</div>
    <p class="hint">También puedes arrastrar la línea entre tomas en la línea de tiempo. La voz y los subtítulos no se mueven.</p>
    <hr class="sep"><h3>Encuadre</h3>
    ${rango('i-zoom', 'Zoom', m.scale ?? 1.04, 0.8, 2.5, 0.01, '×')}
    ${rango('i-x', 'Posición horizontal', m.x || 0, -600, 600, 1, ' px')}
    ${rango('i-y', 'Posición vertical', m.y || 0, -900, 900, 1, ' px')}
    <p class="hint">Tip: arrastra la imagen directamente en la vista previa.</p>
    <hr class="sep"><h3>Movimiento</h3>
    <label class="fld"><span>Tipo</span><select id="i-mov">${opts(MOV, m.motion || 'none')}</select></label>
    ${rango('i-int', 'Velocidad del movimiento', m.intensity ?? 1, 0, 4, 0.05, '×')}
    <hr class="sep"><h3>Entrada de la toma</h3>
    <div class="row"><label class="fld"><span>Transición</span><select id="i-tr">${opts(TRANS, tr.type || 'cut')}</select></label>
      <label class="fld" style="max-width:100px"><span>Duración</span><input type="number" id="i-trd" min="0" max="1.5" step="0.05" value="${tr.duration ?? .24}"></label></div>
    ${rango('i-shade', 'Oscurecer arriba (para leer textos)', typeof s.shade === 'object' ? s.shade.top : (s.shade ?? .25), 0, 0.9, 0.01)}
    <hr class="sep"><div class="row"><button class="btn sm" id="i-addtext">+ Texto en esta toma</button><button class="btn sm" id="i-ask">✦ Pedir a Claude sobre esta toma</button></div>`;
  box.querySelectorAll('[data-c]').forEach(b => b.onclick = () => moverCorte(+b.dataset.c, +b.dataset.d));
  enlazar('i-zoom', v => m.scale = v); enlazar('i-x', v => m.x = v); enlazar('i-y', v => m.y = v);
  enlazar('i-int', v => m.intensity = v);
  enlazar('i-mov', v => m.motion = v, {evento: 'change', num: false});
  enlazar('i-tr', v => { s.transition = {type: v, duration: v === 'cut' ? 0 : (tr.duration || .28)}; }, {evento: 'change', num: false});
  enlazar('i-trd', v => { s.transition = {type: (s.transition?.type || 'dissolve'), duration: v}; }, {evento: 'change'});
  enlazar('i-shade', v => { s.shade = typeof s.shade === 'object' ? {...s.shade, top: v} : {top: v, bottom: .25}; });
  $('i-cambiar').onclick = () => { S.lib = 'medios'; pintarLib(); toast('Elige una imagen en «Medios» (izquierda) o sube una nueva.'); if (matchMedia('(max-width: 900px)').matches) document.body.classList.add('m-lib'); };
  $('i-prompt').onclick = () => promptImagen(s);
  $('i-addtext').onclick = () => agregarTexto('titulo');
  $('i-ask').onclick = () => pedirClaude(`En la toma ${i + 1} («${s.narration || s.title}»): `);
}

function inspTexto(box, l, sel) {
  const sc = sel.kind === 'layer' ? P().scenes.find(s => s.id === sel.sceneId) : null;
  const esCont = l.type === 'counter';
  box.innerHTML = `<h2>${sel.kind === 'overlay' ? 'Texto de apertura' : 'Texto'} <span class="tag">${sc ? 'toma ' + (P().scenes.indexOf(sc) + 1) : 'todo el video'}</span></h2>
    ${esCont ? `<label class="fld"><span>Número final</span><input type="number" id="t-val" value="${l.value}"></label><div class="row"><label class="fld"><span>Antes</span><input type="text" id="t-pre" value="${esc(l.prefix || '')}"></label><label class="fld"><span>Después</span><input type="text" id="t-suf" value="${esc(l.suffix || '')}"></label></div>`
      : `<label class="fld"><span>Texto</span><textarea id="t-txt">${esc(l.text)}</textarea></label>`}
    ${rango('t-size', 'Tamaño', l.fontSize || 64, 16, 260, 1, ' px')}
    <div class="fld"><span>Color</span><div class="swatches" id="t-col">${COLORES.map(c => `<button style="background:${c}" data-c="${c}" class="${(l.color || '').toUpperCase() === c ? 'on' : ''}" aria-label="${c}"></button>`).join('')}</div></div>
    <div class="row"><label class="fld"><span>Alineación</span><select id="t-al">${opts([['left', 'Izquierda'], ['center', 'Centro'], ['right', 'Derecha']], l.align || 'left')}</select></label>
      <label class="fld"><span>Tipografía</span><select id="t-font">${opts([['LegacyDisplay', 'Titular'], ['LegacyBold', 'Negrita'], ['LegacyBody', 'Texto']], l.fontFamily || 'LegacyDisplay')}</select></label></div>
    <hr class="sep"><h3>Animación</h3>
    <label class="fld"><span>Entrada</span><select id="t-anim">${opts(ANIM, l.animation || 'rise')}</select></label>
    ${rango('t-ad', 'Duración de la entrada', l.animationDuration ?? .42, 0.05, 2, 0.01, ' s')}
    ${rango('t-start', 'Aparece a los', l.start || 0, 0, sc ? sc.duration : dur(), 0.01, ' s')}
    <label class="fld"><span>Visible durante (vacío = hasta el final)</span><input type="number" id="t-dur" step="0.1" min="0" value="${l.duration ?? ''}"></label>
    <div class="row"><label class="fld"><span>Fondo</span><select id="t-bg">${opts([['', 'Sin fondo'], ['#1A2B4CE6', 'Marino'], ['#C5A564', 'Dorado'], ['#000000AA', 'Negro translúcido']], l.background || '')}</select></label>
      <label class="fld"><span>Sombra</span><select id="t-sh">${opts([['1', 'Sí'], ['0', 'No']], l.shadow === false ? '0' : '1')}</select></label></div>
    <hr class="sep"><div class="row"><button class="btn sm" id="t-dupl">Duplicar</button><button class="btn sm danger" id="t-del">Eliminar</button></div>`;
  if (esCont) { enlazar('t-val', v => l.value = v, {evento: 'change'}); enlazar('t-pre', v => l.prefix = v, {num: false}); enlazar('t-suf', v => l.suffix = v, {num: false}); }
  else enlazar('t-txt', v => l.text = v, {num: false});
  enlazar('t-size', v => l.fontSize = v); enlazar('t-ad', v => l.animationDuration = v); enlazar('t-start', v => l.start = v, {vivo: false});
  enlazar('t-dur', v => { if ($('t-dur').value === '') delete l.duration; else l.duration = v; }, {evento: 'change'});
  enlazar('t-al', v => l.align = v, {evento: 'change', num: false}); enlazar('t-font', v => l.fontFamily = v, {evento: 'change', num: false});
  enlazar('t-anim', v => l.animation = v, {evento: 'change', num: false});
  enlazar('t-bg', v => { if (v) l.background = v; else delete l.background; }, {evento: 'change', num: false});
  enlazar('t-sh', v => l.shadow = v === '1', {evento: 'change', num: false});
  $('t-col').onclick = e => { const b = e.target.closest('[data-c]'); if (b) cambiar(() => l.color = b.dataset.c); };
  $('t-dupl').onclick = () => cambiar(() => { const n = {...clone(l), id: uid('texto'), y: (l.y || 0) + 120}; (sc ? sc.layers : P().overlays).push(n); S.sel = {...sel, id: n.id}; });
  $('t-del').onclick = () => cambiar(() => { const arr = sc ? sc.layers : P().overlays; arr.splice(arr.indexOf(l), 1); S.sel = sc ? {kind: 'scene', id: sc.id} : null; });
}

const SUBS = [
  {id: 'legacy', n: 'Legacy (actual)', s: {fontSize: 68, color: '#F5F0E6', highlightColor: '#C5A564', background: '#1A2B4CCC', uppercase: false, fontFamily: 'LegacyBold'}},
  {id: 'reels', n: 'Grande amarillo', s: {fontSize: 84, color: '#FFFFFF', highlightColor: '#F2C94C', background: 'transparent', uppercase: true, fontFamily: 'LegacyBold'}},
  {id: 'limpio', n: 'Limpio sin caja', s: {fontSize: 64, color: '#FFFFFF', highlightColor: '#E2C98F', background: 'transparent', uppercase: false, fontFamily: 'LegacyBold'}},
  {id: 'dorada', n: 'Caja dorada', s: {fontSize: 66, color: '#1A2B4C', highlightColor: '#FFFFFF', background: '#C5A564EE', uppercase: false, fontFamily: 'LegacyBold'}},
  {id: 'impacto', n: 'Impacto', s: {fontSize: 92, color: '#FFFFFF', highlightColor: '#C5A564', background: '#000000AA', uppercase: true, fontFamily: 'LegacyDisplay'}},
  {id: 'sin', n: 'Sin animación', s: {animation: 'none'}},
];
function inspSub(box, c) {
  box.innerHTML = `<h2>Subtítulo <span class="tag">${fmt(c.start)}–${fmt(c.end)}</span></h2>
    <label class="fld"><span>Texto (escribe las cifras como quieres verlas)</span><textarea id="c-txt">${esc(c.text)}</textarea></label>
    <div class="row"><label class="fld"><span>Empieza</span><input type="number" id="c-st" step="0.05" value="${c.start.toFixed(2)}"></label><label class="fld"><span>Termina</span><input type="number" id="c-en" step="0.05" value="${c.end.toFixed(2)}"></label></div>
    ${rango('c-y', 'Altura en pantalla', c.y || 1235, 250, 1700, 1, ' px')}
    <div class="row"><button class="btn sm" id="c-yall">Usar esta altura en todos</button></div>
    <hr class="sep"><h3>Estilo de todos los subtítulos</h3>
    <div class="cards" id="c-presets">${SUBS.map(x => `<button class="card" data-p="${x.id}"><div class="sw" style="background:${x.s.background && x.s.background !== 'transparent' ? x.s.background : '#22324D'};color:${x.s.color || '#fff'};font-size:15px;${x.s.uppercase ? 'text-transform:uppercase' : ''}">aa <span style="color:${x.s.highlightColor || '#E2C98F'}">bb</span></div><small>${x.n}</small></button>`).join('')}</div>
    ${rango('c-size', 'Tamaño de todos', P().subtitleStyle?.fontSize || c.fontSize || 68, 36, 120, 1, ' px')}
    <hr class="sep"><div class="row"><button class="btn sm danger" id="c-del">Eliminar subtítulo</button></div>`;
  enlazar('c-txt', v => { c.text = v; const ws = v.split(/\s+/).filter(Boolean), sp = (c.end - c.start) / Math.max(1, ws.length); c.words = ws.map((w, k) => ({text: w, start: r3(c.start + sp * k), end: r3(c.start + sp * (k + 1))})); }, {num: false});
  const retime = () => { const old = c.words || [], a0 = old[0]?.start ?? c.start, a1 = old.at(-1)?.end ?? c.end, k = (c.end - c.start) / Math.max(.01, a1 - a0); c.words = old.map(w => ({...w, start: r3(c.start + (w.start - a0) * k), end: r3(c.start + (w.end - a0) * k)})); };
  enlazar('c-st', v => { c.start = r3(Math.min(v, c.end - .1)); retime(); }, {evento: 'change'});
  enlazar('c-en', v => { c.end = r3(Math.max(v, c.start + .1)); retime(); }, {evento: 'change'});
  enlazar('c-y', v => c.y = v);
  $('c-yall').onclick = () => cambiar(() => P().captions.forEach(x => x.y = c.y));
  $('c-presets').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const pr = SUBS.find(x => x.id === b.dataset.p);
    cambiar(() => { P().subtitleStyle = {...(P().subtitleStyle || {}), ...pr.s}; if (pr.id !== 'sin') delete P().subtitleStyle.animation; }); toast(`Estilo «${pr.n}» aplicado a todos los subtítulos.`); };
  enlazar('c-size', v => { P().subtitleStyle = {...(P().subtitleStyle || {}), fontSize: v}; });
  $('c-del').onclick = () => cambiar(() => { P().captions.splice(P().captions.indexOf(c), 1); S.sel = null; });
}

function inspAudio(box, t) {
  const tipo = {voice: 'Voz', music: 'Música', sfx: 'Efecto de sonido'}[t.kind] || 'Audio';
  box.innerHTML = `<h2>${tipo} <span class="tag">${fmt(t.start)}</span></h2><p class="hint">${esc(t.name || t.assetId)}</p>
    ${rango('a-vol', 'Volumen', t.volume ?? 1, 0, t.kind === 'voice' ? 2 : 1, 0.01)}
    ${t.kind === 'sfx' ? `<label class="fld"><span>Empieza a los (s)</span><input type="number" id="a-st" step="0.05" value="${(+t.start).toFixed(2)}"></label>` : ''}
    ${t.kind === 'music' ? `<label class="fld"><span>Empieza la canción desde (s)</span><input type="number" id="a-off" step="0.5" value="${(+t.offset || 0).toFixed(1)}"></label>
      <label class="fld"><span>Bajar música cuando habla la voz</span><select id="a-duck">${opts([['1', 'Sí'], ['0', 'No']], t.ducking ? '1' : '0')}</select></label>` : ''}
    ${t.kind === 'voice' ? `<p class="hint">Para cambiar lo que dice la voz, pídeselo a Claude: genera la locución nueva y reacomoda subtítulos y tomas.</p>` : ''}
    <hr class="sep"><div class="row">${t.kind === 'sfx' ? '<button class="btn sm" id="a-dup">Duplicar en el cursor</button>' : ''}<button class="btn sm danger" id="a-del">${t.kind === 'voice' ? 'Silenciar' : 'Eliminar'}</button></div>`;
  enlazar('a-vol', v => t.volume = v);
  enlazar('a-st', v => t.start = r3(clamp(v, 0, dur())), {evento: 'change'});
  enlazar('a-off', v => t.offset = Math.max(0, v), {evento: 'change'});
  enlazar('a-duck', v => t.ducking = v === '1', {evento: 'change', num: false});
  if ($('a-dup')) $('a-dup').onclick = () => cambiar(() => { const n = {...clone(t), id: uid('sfx'), start: r3(S.engine.time)}; P().audioTracks.push(n); S.sel = {kind: 'audio', id: n.id}; });
  $('a-del').onclick = () => cambiar(() => { if (t.kind === 'voice') t.muted = true; else P().audioTracks.splice(P().audioTracks.indexOf(t), 1); S.sel = null; });
}

// ---------------------------------------------------------------- catálogo (izquierda)
function tomaActual() { return activeScene(P(), S.engine.time); }
function agregarTexto(tipo) {
  const sc = tomaActual(), local = r3(Math.max(0, S.engine.time - sc.start));
  const base = {id: uid('texto'), type: 'text', x: 108, y: 620, width: 864, align: 'left', start: local, opacity: 1, enabled: true, lineHeight: 1.04, animation: 'rise', fontFamily: 'LegacyDisplay', color: CREAM};
  const presets = {
    titulo: {text: 'TÍTULO', fontSize: 108},
    cifra: {text: '$0', fontSize: 170, color: '#E2C98F', animation: 'pop'},
    etiqueta: {text: 'Etiqueta', fontSize: 40, fontFamily: 'LegacyBold', background: '#1A2B4CE6'},
    contador: {type: 'counter', value: 1000, prefix: '$', suffix: '', fontSize: 150, color: '#E2C98F', animation: 'pop', animationDuration: 1},
    nota: {text: 'Proyección ilustrativa', fontSize: 30, fontFamily: 'LegacyBody'},
  };
  cambiar(() => { sc.layers = sc.layers || []; const n = {...base, ...presets[tipo]}; sc.layers.push(n); S.sel = {kind: 'layer', id: n.id, sceneId: sc.id}; });
  S.engine.selectedLayerId = S.sel.id; S.engine.render(S.engine.time);
}

function pintarLib() {
  document.querySelectorAll('#rail button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lib === S.lib)));
  const box = $('libbody'); if (!P()) { box.innerHTML = ''; return; }
  const p = P(), sc = tomaActual();
  if (S.lib === 'medios') {
    const imgs = p.assets.filter(a => a.type === 'image' && !/crest|logo|fondo/.test(a.id));
    box.innerHTML = `<h3>Imágenes del proyecto</h3><p class="hint">Toca una para ponerla en la toma ${p.scenes.indexOf(sc) + 1}.</p>
      <div class="thumbs">${imgs.map(a => `<button data-a="${esc(a.id)}" title="${esc(a.name || a.id)}" style="background-image:url('${esc(a.thumbnail || a.url)}')"></button>`).join('')}</div>
      <label class="btn" style="justify-content:center">⤒ Subir imagen o video<input type="file" id="up" accept="image/*,video/*" hidden></label>
      <button class="btn" id="m-prompt">✦ Prompt para pedir la imagen a ChatGPT</button>
      <p class="hint">Genera la imagen en ChatGPT con el prompt, descárgala y súbela aquí: queda en la toma seleccionada.</p>`;
    box.querySelector('.thumbs').onclick = e => { const b = e.target.closest('[data-a]'); if (!b) return; const s = tomaActual(); cambiar(() => { s.mediaId = b.dataset.a; }, {medios: true}); toast('Imagen cambiada en la toma ' + (P().scenes.indexOf(s) + 1)); };
    $('up').onchange = () => subirMedio($('up').files[0]);
    $('m-prompt').onclick = () => promptImagen(tomaActual());
  } else if (S.lib === 'texto') {
    const T = [['titulo', 'Título', 'TÍTULO'], ['cifra', 'Cifra grande', '$4.9'], ['contador', 'Número que cuenta', '0→450'], ['etiqueta', 'Etiqueta', 'ETIQUETA'], ['nota', 'Nota pequeña', 'aviso']];
    box.innerHTML = `<h3>Agregar texto</h3><p class="hint">Se agrega en la toma actual, en el momento del cursor.</p>
      <div class="cards">${T.map(([k, n, m]) => `<button class="card" data-t="${k}"><div class="sw" style="font-size:${k === 'nota' ? 12 : 20}px;color:${k === 'cifra' || k === 'contador' ? '#E2C98F' : '#F5F0E6'}">${m}</div><small>${n}</small></button>`).join('')}</div>`;
    box.querySelector('.cards').onclick = e => { const b = e.target.closest('[data-t]'); if (b) agregarTexto(b.dataset.t); };
  } else if (S.lib === 'subs') {
    box.innerHTML = `<h3>Estilo de subtítulos</h3><p class="hint">Se aplica a todos. Para editar uno, tócalo en el video.</p>
      <div class="cards" id="l-subs">${SUBS.map(x => `<button class="card" data-p="${x.id}"><div class="sw" style="background:${x.s.background && x.s.background !== 'transparent' ? x.s.background : '#22324D'};color:${x.s.color || '#fff'};${x.s.uppercase ? 'text-transform:uppercase;' : ''}font-size:15px">aa <span style="color:${x.s.highlightColor || '#E2C98F'}">bb</span></div><small>${x.n}</small></button>`).join('')}</div>
      <label class="fld"><span>Subtítulos</span><select id="l-subon">${opts([['1', 'Visibles'], ['0', 'Ocultos']], p.captionsEnabled === false ? '0' : '1')}</select></label>`;
    $('l-subs').onclick = e => { const b = e.target.closest('[data-p]'); if (!b) return; const pr = SUBS.find(x => x.id === b.dataset.p); cambiar(() => { p.subtitleStyle = {...(p.subtitleStyle || {}), ...pr.s}; if (pr.id !== 'sin') delete p.subtitleStyle.animation; }); };
    $('l-subon').onchange = e => cambiar(() => p.captionsEnabled = e.target.value === '1');
  } else if (S.lib === 'trans') {
    box.innerHTML = `<h3>Transiciones</h3><p class="hint">Toca para aplicarla a la entrada de la toma ${p.scenes.indexOf(sc) + 1}. Se muestra al instante.</p>
      <div class="cards" id="l-tr">${TRANS.map(([k, n]) => `<button class="card${(sc.transition?.type || sc.transition) === k ? ' on' : ''}" data-k="${k}"><div class="sw">${{cut: '|', dissolve: '◐', zoom: '⊕', 'wipe-left': '▶', 'wipe-right': '◀', slide: '⇢', whip: '≋', flash: '✷'}[k]}</div><small>${n}</small></button>`).join('')}</div>
      <button class="btn" id="l-trall">Aplicar la de esta toma a todas</button>`;
    $('l-tr').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; const s = tomaActual();
      cambiar(() => { s.transition = {type: b.dataset.k, duration: b.dataset.k === 'cut' ? 0 : (s.transition?.duration || .28)}; }); ir(s.start + 0.001); setTimeout(() => S.engine.play(), 60); setTimeout(() => S.engine.pause(), 900); pintarLib(); };
    $('l-trall').onclick = () => { const t = clone(tomaActual().transition); cambiar(() => p.scenes.forEach((s, i) => { if (i) s.transition = clone(t); })); toast('Transición aplicada a todas las tomas.'); };
  } else if (S.lib === 'mov') {
    box.innerHTML = `<h3>Movimiento de cámara</h3><p class="hint">Para la toma ${p.scenes.indexOf(sc) + 1}. La velocidad se ajusta en el panel derecho.</p>
      <div class="cards" id="l-mov">${MOV.map(([k, n]) => `<button class="card${(sc.media?.motion || 'none') === k ? ' on' : ''}" data-k="${k}"><div class="sw">${{none: '■', 'push-in': '⊕', 'pull-out': '⊖', 'drift-left': '←', 'drift-right': '→', 'drift-up': '↑'}[k]}</div><small>${n}</small></button>`).join('')}</div>`;
    $('l-mov').onclick = e => { const b = e.target.closest('[data-k]'); if (!b) return; const s = tomaActual(); cambiar(() => { s.media = s.media || {}; s.media.motion = b.dataset.k; }); pintarLib(); };
  } else if (S.lib === 'sonido') {
    const sfx = p.assets.filter(a => a.type === 'audio' && /^sfx-/.test(a.id));
    box.innerHTML = `<h3>Efectos de sonido</h3><p class="hint">▶ escucha · + lo agrega en el cursor (${fmt(S.engine.time)}).</p>
      ${sfx.map(a => `<div class="sfx"><button class="btn sm" data-play="${esc(a.url)}">▶</button><span>${esc(a.name || a.id.replace(/^sfx-/, ''))}</span><button class="btn sm" data-add="${esc(a.id)}">+</button></div>`).join('')}
      <h3>Música</h3>${p.audioTracks.filter(t => t.kind === 'music').map(t => `<div class="sfx"><span>${esc(t.name)}</span><button class="btn sm" data-sel="${esc(t.id)}">Editar</button></div>`).join('')}`;
    box.onclick = e => {
      const pl = e.target.closest('[data-play]'), ad = e.target.closest('[data-add]'), se = e.target.closest('[data-sel]');
      if (pl) { const a = new Audio(pl.dataset.play); a.volume = .6; a.play().catch(() => {}); }
      if (ad) cambiar(() => { const n = {id: uid('sfx'), name: ad.dataset.add.replace(/^sfx-/, ''), kind: 'sfx', assetId: ad.dataset.add, start: r3(S.engine.time), offset: 0, duration: 1, volume: .3, fadeIn: .005, fadeOut: .1, muted: false, sceneId: tomaActual().id}; p.audioTracks.push(n); S.sel = {kind: 'audio', id: n.id}; });
      if (se) seleccionar({kind: 'audio', id: se.dataset.sel});
    };
  }
}

async function subirMedio(file) {
  if (!file) return;
  const s = tomaActual(), id = uid('medio'), tipo = file.type.startsWith('video') ? 'video' : 'image';
  toast('Subiendo ' + file.name + '…');
  try {
    await S.store.putBlob(id, file);
    const url = URL.createObjectURL(file);
    cambiar(() => { P().assets.push({id, name: file.name, type: tipo, blobId: id, url, thumbnail: tipo === 'image' ? url : undefined}); s.mediaId = id; }, {medios: true});
    toast('Listo: la imagen quedó en la toma ' + (P().scenes.indexOf(s) + 1));
  } catch (e) { toast('No se pudo subir: ' + e.message, 'err', 8000); }
}

// prompt listo para pegar en ChatGPT
function promptImagen(s) {
  const i = P().scenes.indexOf(s);
  const texto = `Crea una fotografía vertical 9:16 (1080×1920), estilo publicidad inmobiliaria premium, luz natural cálida, fotorrealista.
Escena: ${s.narration ? `ilustra la frase «${s.narration}».` : '[describe la escena]'}
Contexto: anuncio de Legacy Capital para casas de un nivel con roof garden y vista al mar en El Sauzal, Ensenada, B.C. Público: doctores y médicos.
Personajes: pareja de 35–45 años, elegante y atractiva, estilo "old money" (ropa en tonos crema, blanco y azul marino); él de cabello oscuro corto; ella de piel clara. Expresión acorde a la frase: [describe la emoción].
Reglas: arquitectura contemporánea mexicana (concreto claro, madera, vidrio); en los roofs solo un tragaluz discreto al fondo; sin textos, logos ni marcas de agua; manos y rostros naturales; deja el tercio superior limpio para poner títulos.
Usa como referencia la imagen adjunta de la toma ${i + 1} para conservar la arquitectura y los personajes.`;
  dialog(`<h2>Prompt para ChatGPT · toma ${i + 1}</h2><p class="hint">Cópialo, pégalo en ChatGPT junto con la imagen actual de la toma, y sube aquí el resultado con «Subir imagen».</p>
    <textarea id="pr-txt" style="min-height:220px;background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:10px;width:100%">${esc(texto)}</textarea>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="pr-close">Cerrar</button><button class="btn gold" id="pr-copy">Copiar prompt</button></div>`, d => {
    $('pr-close').onclick = () => d.close();
    $('pr-copy').onclick = async () => { try { await navigator.clipboard.writeText($('pr-txt').value); toast('Prompt copiado.'); } catch { $('pr-txt').select(); toast('Selecciona y copia el texto (Ctrl C).'); } };
  });
}

// ---------------------------------------------------------------- Claude: pedir cambios y render
const ESTADOS = {pendiente: 'Esperando a Claude', trabajando: 'Claude está trabajando', pregunta: 'Claude necesita un detalle', lista: 'Listo', aplicada: 'Ya está en tu video', error: 'No se pudo', cancelada: 'Cancelada'};
function misSolicitudes() { return S.solicitudes.filter(s => s.proyectoId === P()?.id).sort((a, b) => (b.creado || '').localeCompare(a.creado || '')); }
function pintarSolicitudes() {
  const n = misSolicitudes().filter(s => s.estado === 'lista').length; $('n-req').hidden = !n; $('n-req').textContent = n + ' lista' + (n > 1 ? 's' : '');
  if ($('dlg').open && $('req-list')) $('req-list').innerHTML = htmlSolicitudes();
}
function htmlSolicitudes() {
  const L = misSolicitudes(); if (!L.length) return '<p class="hint">Aún no hay pedidos para este video.</p>';
  return L.map(s => `<div class="req" data-id="${esc(s.id)}"><span class="st">${s.tipo === 'render' ? 'Render final' : 'Cambios'} · ${esc(ESTADOS[s.estado] || s.estado)}</span>
    <p>${esc((s.instrucciones || '').slice(0, 220))}</p>${s.avance && s.estado === 'trabajando' ? `<p>⏳ ${esc(s.avance)}</p>` : ''}${s.respuesta ? `<p><b>Claude:</b> ${esc(s.respuesta)}</p>` : ''}
    <div class="row">${s.estado === 'lista' && s.tipo !== 'render' ? '<button class="btn sm gold" data-act="abrir">Abrir versión nueva</button>' : ''}
    ${s.video?.partes?.length ? '<button class="btn sm" data-act="ver">Ver video</button><button class="btn sm" data-act="bajar">Descargar MP4</button>' : ''}</div></div>`).join('');
}
function pedirClaude(prefijo = '') {
  if (!S.nube) return toast('Abre Legacy Studio dentro de Claude para pedir cambios.', 'err');
  dialog(`<h2>✦ Pedir a Claude</h2><p class="hint">Escribe lo que quieres. Claude lo aplica sobre este mismo video (sin rehacerlo) y te deja una versión nueva aquí. Luego escríbele en el chat: «aplica mis cambios del editor».</p>
    <textarea id="rq-txt" style="min-height:140px;width:100%;background:var(--panel2);border:1px solid var(--line);border-radius:8px;padding:10px">${esc(prefijo)}</textarea>
    <p class="hint">Contexto que se envía: toma ${P().scenes.indexOf(tomaActual()) + 1}, segundo ${S.engine.time.toFixed(1)}.</p>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="rq-no">Cerrar</button><button class="btn gold" id="rq-ok">Enviar a Claude</button></div>
    <h3>Tus pedidos</h3><div id="req-list" style="display:flex;flex-direction:column;gap:8px">${htmlSolicitudes()}</div>`, d => {
    $('rq-no').onclick = () => d.close(); wireSolicitudes();
    $('rq-ok').onclick = async () => { const txt = $('rq-txt').value.trim(); if (!txt) return $('rq-txt').focus(); await enviarSolicitud('cambios', txt); $('rq-txt').value = ''; };
  });
}
async function enviarSolicitud(tipo, instrucciones) {
  await guardarYa();
  const sc = tomaActual();
  await S.nube.db.collection('solicitudes').add({tipo, proyectoId: P().id, proyectoTitulo: P().title, instrucciones, alcance: 'auto', escena: sc.id,
    tiempo: S.engine.time, comentarios: [], estado: 'pendiente', avance: '', respuesta: '', creado: now(), baseUpdatedAt: P().updatedAt || '',
    autor: S.nube.user ? await S.nube.user.id() : null});
  toast(tipo === 'render' ? 'Render pedido. Escríbele a Claude: «aplica mis cambios del editor».' : 'Enviado. Escríbele a Claude en el chat: «aplica mis cambios del editor».', '', 9000);
}
function wireSolicitudes() {
  $('req-list').onclick = async e => {
    const b = e.target.closest('[data-act]'); if (!b) return; const s = S.solicitudes.find(x => x.id === b.closest('[data-id]').dataset.id);
    try {
      if (b.dataset.act === 'abrir') {
        const r = await S.nube.db.doc('resultados/' + s.id).get(); if (!r.exists) return toast('Claude aún no subió esta versión.');
        await S.store.saveVersion(P(), 'Antes de abrir la versión de Claude');
        const nuevo = r.data().project; await S.store.save(nuevo); await S.nube.db.doc('solicitudes/' + s.id).update({estado: 'aplicada', aplicada: now()});
        $('dlg').close(); await abrir(nuevo); toast('Versión de Claude abierta. La anterior quedó en tu historial.');
      }
      if (b.dataset.act === 'ver' || b.dataset.act === 'bajar') {
        toast('Preparando el video…'); const partes = []; for (const id of s.video.partes) partes.push(await (await fetch('/_blob/' + id)).blob());
        const blob = new Blob(partes, {type: 'video/mp4'});
        if (b.dataset.act === 'bajar') await downloadBlob(blob, s.video.nombre || 'video.mp4');
        else dialog(`<h2>${esc(s.video.nombre || 'Video')}</h2><video src="${URL.createObjectURL(blob)}" controls playsinline style="max-height:70vh;max-width:100%;margin:0 auto;display:block;border-radius:8px"></video><p class="hint">${esc(s.video.detalle || '')}</p><div class="row" style="justify-content:flex-end"><button class="btn" onclick="this.closest('dialog').close()">Cerrar</button></div>`);
      }
    } catch (err) { toast(err.message || 'No se pudo.', 'err'); }
  };
}

function exportar() {
  const formatos = availableVideoFormats();
  dialog(`<h2>Exportar video</h2>
    <div class="req"><span class="st">Recomendado · Render final con Claude</span><p>Cuadro por cuadro, idéntico a lo que ves, 1080×1920 y audio a −14 LUFS para Meta. Te queda aquí para ver y descargar.</p>
      <div class="row"><button class="btn gold sm" id="ex-claude">Pedir render final</button></div></div>
    <div class="req"><span class="st">Rápido · En este navegador</span><p>Graba la reproducción en tiempo real (${Math.round(dur())} s). Mantén esta pestaña visible. ${formatos.length ? 'Formato: ' + formatos[0].label : 'Este navegador no permite exportar video.'}</p>
      <div class="row"><button class="btn sm" id="ex-local" ${formatos.length ? '' : 'disabled'}>Exportar ahora</button></div><progress id="ex-prog" max="1" value="0" hidden></progress></div>
    <h3>Renders listos</h3><div id="req-list" style="display:flex;flex-direction:column;gap:8px">${htmlSolicitudes()}</div>
    <div class="row" style="justify-content:flex-end"><button class="btn" id="ex-no">Cerrar</button></div>`, d => {
    $('ex-no').onclick = () => d.close(); wireSolicitudes();
    $('ex-claude').onclick = async () => { if (!S.nube) return toast('Abre Legacy Studio dentro de Claude.', 'err'); await enviarSolicitud('render', 'Render final del video tal como está.'); };
    $('ex-local').onclick = async () => {
      $('ex-prog').hidden = false; $('ex-local').disabled = true;
      try { const r = await exportVideo(S.engine, {onProgress: v => $('ex-prog').value = v}); await downloadBlob(r.blob, `${(P().title || 'video').replace(/[^\w\- ]+/g, '')}.${r.extension}`); toast('Video exportado.'); }
      catch (e) { toast(e.message || 'No se pudo exportar.', 'err', 8000); }
      $('ex-local').disabled = false;
    };
  });
}

// ---------------------------------------------------------------- controles
function wire() {
  wireCanvas(); wireTimeline();
  $('b-play').onclick = alternar; $('b-fb').onclick = () => ir(S.engine.time - 1 / fps()); $('b-ff').onclick = () => ir(S.engine.time + 1 / fps());
  $('b-prev').onclick = () => tomaVecina(-1); $('b-next').onclick = () => tomaVecina(1);
  $('b-undo').onclick = deshacer; $('b-redo').onclick = rehacer;
  $('b-videos').onclick = async () => { await guardarYa(); mostrarSelector(); };
  $('b-claude').onclick = () => pedirClaude();
  $('b-export').onclick = exportar;
  $('p-title').onchange = e => cambiar(() => P().title = e.target.value.trim() || P().title);
  $('rail').onclick = e => { const b = e.target.closest('[data-lib]'); if (!b) return; S.lib = b.dataset.lib; pintarLib(); };
  $('m-lib').onclick = () => document.body.classList.add('m-lib'); $('m-insp').onclick = () => document.body.classList.remove('m-lib');
  document.addEventListener('keydown', e => {
    if (!P() || e.target.closest('input, textarea, select, dialog')) return;
    if (e.key === ' ') { e.preventDefault(); alternar(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(S.engine.time - (e.shiftKey ? 1 : 1 / fps())); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); ir(S.engine.time + (e.shiftKey ? 1 : 1 / fps())); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? rehacer() : deshacer(); }
    else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); rehacer(); }
    else if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel && S.sel.kind !== 'scene') { e.preventDefault(); $('t-del')?.click() || $('c-del')?.click() || $('a-del')?.click(); }
  });
  let rz; window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => P() && pintarTimeline(), 150); });
  setInterval(() => { if (P() && S.lib === 'sonido') { const h = document.querySelector('#libbody .hint'); if (h) h.textContent = `▶ escucha · + lo agrega en el cursor (${fmt(S.engine.time)}).`; } }, 500);
}

window.legacyStudio = {get project() { return S.project; }, get engine() { return S.engine; }, abrir, S};
boot().catch(e => { $('projs').innerHTML = `<div class="empty">No se pudo iniciar: ${esc(e.message)}</div>`; console.error(e); });
