/**
 * Legacy Studio en Claude: guarda el proyecto en la nube del artifact (se ve igual en el
 * teléfono y en la computadora) y manda los cambios a Claude como solicitudes que Claude
 * lee y responde directamente. Fuera de claude.ai el editor sigue usando el navegador.
 */
import {ProjectStore, validateProject} from './storage.js';
import {escapeHTML as esc, formatTime} from './ui.js';

const PARTE = 19 * 1024 * 1024;
const LIMITE_DOC = 240 * 1024;
const now = () => new Date().toISOString();
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const limpio = value => JSON.parse(JSON.stringify(value));

/** Resuelve {db, assets, user, downloads} o null si la página no corre dentro de Claude. */
export async function conectarNube() {
  if (!globalThis.claude?.use) return null;
  const [db, assets, user, downloads] = await Promise.all(['db', 'assets', 'user', 'downloads'].map(n => globalThis.claude.use(n).catch(() => null)));
  if (!db) return null;
  if (downloads) globalThis.__legacyDownloads = downloads;
  return {db, assets, user, downloads};
}

function guardable(project) {
  const r = limpio(project);
  for (const a of [...(r.assets || []), ...(r.references || [])]) {
    if (typeof a.url === 'string' && a.url.startsWith('blob:')) { a.blobId ||= a.id; delete a.url; }
    if (typeof a.thumbnail === 'string' && a.thumbnail.startsWith('blob:')) delete a.thumbnail;
    delete a.embeddedDataUrl;
  }
  delete r.missingAssets;
  return r;
}

export class CloudStore extends ProjectStore {
  constructor(nube) {
    super();
    this.db = nube.db; this.assets = nube.assets; this.cola = Promise.resolve();
  }
  get modo() { return 'nube'; }
  /** Una escritura a la vez por documento, como pide la base. */
  escribir(fn) { const p = this.cola.then(fn, fn); this.cola = p.catch(() => {}); return p; }

  async load(id) {
    const snap = await this.db.doc(`proyectos/${id}`).get();
    if (snap.exists) return this.hydrate(snap.data().project);
    try { const local = await super.load(id); if (local) { await this.save(local); return local; } } catch {}
    return null;
  }
  async listProjects() {
    const q = await this.db.collection('proyectos').get();
    return q.docs.map(d => d.data()).map(({id, title, updatedAt, version}) => ({id, title, updatedAt, version}))
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }
  async save(project) {
    validateProject(project);
    const record = guardable(project); record.updatedAt = now();
    const doc = {id: record.id, title: record.title, version: record.version || '', updatedAt: record.updatedAt, project: record};
    if (JSON.stringify(doc).length > LIMITE_DOC) throw new Error('El proyecto creció demasiado para la nube (más de 240 KB). Quita referencias incrustadas o pide a Claude que lo divida.');
    await this.escribir(() => this.db.doc(`proyectos/${record.id}`).set(doc));
    try { await super.save(project); } catch {}
    return {id: record.id, updatedAt: record.updatedAt, storage: 'nube'};
  }
  async saveVersion(project, label = '') {
    validateProject(project);
    const rec = {projectId: project.id, createdAt: now(), label: String(label || `Versión ${new Date().toLocaleString('es-MX')}`).slice(0, 500), project: guardable(project)};
    const ref = await this.db.collection('versiones').add(rec);
    return {id: ref.id, projectId: rec.projectId, createdAt: rec.createdAt, label: rec.label};
  }
  async listVersions(projectId) {
    const q = await this.db.collection('versiones').where('projectId', '==', projectId).get();
    return q.docs.map(d => ({id: d.id, ...d.data()})).map(({id, projectId, createdAt, label, project}) => ({id, projectId, createdAt, label, title: project?.title, duration: project?.duration}))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  async restoreVersion(projectId, versionId) {
    if (versionId === undefined) { versionId = projectId; projectId = null; }
    const s = await this.db.doc(`versiones/${versionId}`).get();
    if (!s.exists || (projectId && s.data().projectId !== projectId)) throw new Error('No se encontró esa versión del proyecto.');
    return this.hydrate(s.data().project);
  }
  /** Sube el archivo a la nube de la sala en pedazos de 19 MB (videos de cualquier tamaño). */
  async putBlob(id, blob) {
    if (!(blob instanceof Blob)) throw new Error('El archivo subido no es válido.');
    if (!this.assets) throw new Error('Solo quien puede editar esta página sube archivos.');
    const tipo = blob.type || 'application/octet-stream', n = Math.max(1, Math.ceil(blob.size / PARTE)), partes = [];
    for (let i = 0; i < n; i++) {
      const trozo = blob.slice(i * PARTE, Math.min(blob.size, (i + 1) * PARTE), tipo);
      const up = await this.assets.upload(new File([trozo], `${blob.name || id}${n > 1 ? '.parte' + (i + 1) : ''}`, {type: tipo}), {type: tipo});
      partes.push(up.id);
    }
    await this.db.doc(`archivos/${id}`).set({partes, tipo, nombre: blob.name || '', bytes: blob.size, creado: now()});
    try { await super.putBlob(id, blob); } catch {}
    return id;
  }
  async getBlob(id) {
    try { const local = await super.getBlob(id); if (local) return local; } catch {}
    const s = await this.db.doc(`archivos/${id}`).get();
    if (!s.exists) return null;
    const {partes, tipo} = s.data(), trozos = [];
    for (const p of partes) { const r = await fetch('/_blob/' + p); if (!r.ok) return null; trozos.push(await r.blob()); }
    const blob = new Blob(trozos, {type: tipo});
    try { await super.putBlob(id, blob); } catch {}
    return blob;
  }
}

const ETIQUETAS = {pendiente: 'Esperando a Claude', trabajando: 'Claude está trabajando', pregunta: 'Claude necesita un detalle',
  lista: 'Cambios listos', aplicada: 'Ya está en tu proyecto', error: 'No se pudo terminar', cancelada: 'Cancelada'};

/** Panel «Cambios con Claude»: misma experiencia que el panel de IA, pero la solicitud va directo a Claude. */
export function mountClaude(hooks, nube) {
  const $ = id => document.getElementById(id);
  const rail = document.querySelector('.rail'), library = document.querySelector('.library');
  const nav = document.createElement('button');
  nav.className = 'rail-item ai-rail'; nav.dataset.tab = 'ai'; nav.setAttribute('aria-label', 'Cambios con Claude');
  nav.innerHTML = '<span class="ai-star">✦</span><span>Claude</span>';
  rail.prepend(nav);
  const top = document.createElement('button');
  top.className = 'button ai-top-button'; top.id = 'openAIBtn'; top.textContent = '✦ Cambios con Claude';
  document.querySelector('.top-actions').prepend(top);

  const panel = document.createElement('section');
  panel.className = 'tool-panel ai-panel'; panel.id = 'panel-ai'; panel.dataset.panel = 'ai';
  panel.innerHTML = `<div class="ai-panel-heading"><span class="eyebrow">TÚ DESCRIBES. CLAUDE EDITA.</span><h1>Cambios con Claude <span>✦</span></h1><p>Escribe lo que quieres cambiar. Claude lo aplica, re-renderiza solo las escenas tocadas y la versión nueva aparece aquí.</p></div>
  <div class="ai-context" id="aiContext"></div>
  <label class="field ai-main-field">¿Qué quieres cambiar?<textarea id="aiInstructions" rows="6" maxlength="20000" placeholder="Ej. En la escena 9 el subtítulo tapa la cara; súbelo. Cambia «tardes de asador» por «tardes de carne asada» en voz y subtítulos. Dale más volumen a la música en el cierre."></textarea></label>
  <div class="ai-examples"><button data-ai-example="texto">Corregir texto</button><button data-ai-example="voz">Guion y voz</button><button data-ai-example="ritmo">Mejor edición</button></div>
  <label class="field">Dónde hacer los cambios<select id="aiScope"><option value="auto">Según lo que indique en mis comentarios</option><option value="scene">Solo esta escena</option><option value="project">Todo el video</option><option value="opening">Solo la apertura</option></select></label>
  <label class="check-field ai-comments-check"><input type="checkbox" id="aiIncludeComments" checked>Incluir comentarios pendientes <b id="aiOpenCommentCount">0</b></label>
  <button class="button gold full ai-submit" id="submitAIRequest">✦ Enviar a Claude</button>
  <button class="button full" id="renderRequestBtn" type="button">Pedir render final (cuadro exacto, −14 LUFS)</button>
  <p class="ai-connection-note" id="aiNote">Se guarda en la nube de esta página. Después escríbele a Claude en el chat: «aplica mis cambios del editor».</p>
  <div class="ai-job-section"><div class="section-header"><h2>Tus solicitudes</h2></div><div id="aiRequests"><p class="panel-hint">Aquí verás el avance y las versiones terminadas.</p></div></div>`;
  library.prepend(panel);

  const banner = document.createElement('div');
  banner.className = 'ai-stage-banner';
  banner.innerHTML = '<span>✦</span><div><strong>¿Prefieres que lo haga Claude?</strong><small>Describe el cambio; recibes una versión nueva y la anterior queda guardada.</small></div><button class="button subtle small" id="stageAIBtn">Pedir cambios</button>';
  document.querySelector('.stage-area').prepend(banner);
  const btnComentarios = document.createElement('button');
  btnComentarios.className = 'button full ai-secondary'; btnComentarios.textContent = '✦ Pedir estos cambios a Claude';
  $('downloadCommentsBtn')?.before(btnComentarios); btnComentarios.onclick = () => abrir();

  let solicitudes = [], enviando = false, ultimoProyecto = null;
  function abrir() { hooks.openTab('ai'); document.body.classList.add('ai-mode'); contexto(); $('aiInstructions').focus(); }
  top.onclick = abrir; $('stageAIBtn').onclick = abrir;
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => document.body.classList.toggle('ai-mode', b.dataset.tab === 'ai')));

  const ejemplos = {
    texto: 'En esta escena corrige el texto en pantalla y el subtítulo: …',
    voz: 'Cambia esta frase del guion por «…». Genera la voz nueva solo de esa frase, ajusta los tiempos y vuelve a sincronizar los subtítulos.',
    ritmo: 'Dale más ritmo a la apertura: cortes más rápidos en los primeros 5 segundos, efectos de sonido en cada cifra y una transición más limpia hacia la alberca. Conserva guion y datos.'};
  panel.querySelectorAll('[data-ai-example]').forEach(b => b.onclick = () => { $('aiInstructions').value = ejemplos[b.dataset.aiExample]; $('aiInstructions').focus(); });

  function contexto() {
    const p = hooks.getProject();
    if (ultimoProyecto !== p.id) { ultimoProyecto = p.id; pintar(); }
    const s = p.scenes.find(s => s.id === hooks.getSelectedSceneId()) || p.scenes[0], a = p.assets.find(a => a.id === s.mediaId);
    const abiertos = (p.comments || []).filter(c => !c.resolved);
    $('aiContext').innerHTML = `${a?.type === 'image' ? `<img src="${esc(a.thumbnail || a.url)}" alt="">` : '<span>▶</span>'}<div><strong>${esc(s.title)}</strong><small>${formatTime(s.start, true)} · ${s.duration.toFixed(1)} s <button class="text-btn" id="aiUseScene">Usar esta escena</button></small></div>`;
    $('aiUseScene').onclick = () => $('aiScope').value = 'scene';
    $('aiOpenCommentCount').textContent = abiertos.length;
  }

  async function enviar(tipo) {
    if (enviando) return;
    const instrucciones = $('aiInstructions').value.trim(), p = hooks.getProject();
    const comentarios = $('aiIncludeComments').checked ? (p.comments || []).filter(c => !c.resolved) : [];
    if (tipo === 'cambios' && !instrucciones && !comentarios.length) { hooks.notify('Escribe qué quieres cambiar o agrega comentarios pendientes.', 'info'); $('aiInstructions').focus(); return; }
    enviando = true; $('submitAIRequest').disabled = $('renderRequestBtn').disabled = true;
    try {
      await hooks.store.save(p);
      const base = await hooks.revision(p);
      const sel = hooks.getSelectedSceneId();
      const ref = await nube.db.collection('solicitudes').add({
        tipo, proyectoId: p.id, proyectoTitulo: p.title, baseRevision: base, baseUpdatedAt: p.updatedAt || '',
        instrucciones: tipo === 'render' ? (instrucciones || 'Render final del proyecto tal como está.') : instrucciones,
        alcance: $('aiScope').value, escena: sel || '', tiempo: hooks.getTime?.() ?? 0,
        comentarios: comentarios.map(c => ({id: c.id, sceneId: c.sceneId, time: c.time, text: c.text})),
        estado: 'pendiente', avance: '', respuesta: '', creado: now(), autor: nube.user ? await nube.user.id() : null});
      if (tipo === 'cambios') $('aiInstructions').value = '';
      hooks.notify(`Solicitud guardada (${ref.id.slice(0, 6)}). Escríbele a Claude en el chat: «aplica mis cambios del editor».`, 'success', 9000);
    } catch (e) { hooks.notify(e?.message || 'No se pudo guardar la solicitud.', 'error', 7000); }
    enviando = false; $('submitAIRequest').disabled = $('renderRequestBtn').disabled = false;
  }
  $('submitAIRequest').onclick = () => enviar('cambios');
  $('renderRequestBtn').onclick = () => enviar('render');

  async function incorporar(s) {
    const r = await nube.db.doc(`resultados/${s.id}`).get();
    if (!r.exists) return hooks.notify('Claude aún no subió el proyecto de esta solicitud.', 'info');
    await hooks.applyResult(r.data().project, {requestId: s.id, summary: s.respuesta, baseRevision: s.baseRevision, baseUpdatedAt: s.baseUpdatedAt});
    await nube.db.doc(`solicitudes/${s.id}`).update({estado: 'aplicada', aplicada: now()}).catch(() => {});
  }
  async function videoDe(s, accion) {
    const v = s.video; if (!v?.partes?.length) return;
    hooks.notify('Preparando el video…', 'info');
    const trozos = []; for (const id of v.partes) trozos.push(await (await fetch('/_blob/' + id)).blob());
    const blob = new Blob(trozos, {type: 'video/mp4'});
    if (accion === 'descargar') {
      if (!nube.downloads) return hooks.notify('Esta vista no permite descargar archivos.', 'error');
      try { await nube.downloads.save({filename: v.nombre || `${s.proyectoTitulo || 'video'}.mp4`, data: blob}); } catch (e) { if (e?.code !== 'declined') hooks.notify('No se pudo descargar: ' + (e?.message || e?.code), 'error'); }
    } else {
      const url = URL.createObjectURL(blob);
      const d = document.createElement('dialog'); d.className = 'render-dialog';
      d.innerHTML = `<form method="dialog"><video src="${url}" controls playsinline style="max-height:76vh;max-width:100%;display:block;margin:0 auto"></video><p class="panel-hint">${esc(v.detalle || '')}</p><button class="button">Cerrar</button></form>`;
      document.body.append(d); d.showModal(); d.addEventListener('close', () => { URL.revokeObjectURL(url); d.remove(); });
    }
  }
  function pintar() {
    const p = hooks.getProject(), box = $('aiRequests'); if (!box) return;
    const mias = solicitudes.filter(s => s.proyectoId === p.id).sort((a, b) => (b.creado || '').localeCompare(a.creado || ''));
    if (!mias.length) { box.innerHTML = '<p class="panel-hint">Aquí verás el avance y las versiones terminadas.</p>'; return; }
    box.innerHTML = mias.map(s => `<article class="ai-job" data-id="${esc(s.id)}"><div><strong>${s.tipo === 'render' ? 'Render final' : 'Cambios'} · ${esc(ETIQUETAS[s.estado] || s.estado)}</strong><small>${esc(new Date(s.creado).toLocaleString('es-MX'))}</small></div>
      <p>${esc((s.instrucciones || '').slice(0, 180))}${s.comentarios?.length ? ` <em>+ ${s.comentarios.length} comentario(s)</em>` : ''}</p>
      ${s.avance && s.estado === 'trabajando' ? `<p class="panel-hint">${esc(s.avance)}</p>` : ''}
      ${s.respuesta ? `<p class="ai-answer"><b>Claude:</b> ${esc(s.respuesta)}</p>` : ''}
      <div class="ai-job-actions">${s.estado === 'lista' && s.tipo !== 'render' ? '<button class="button gold small" data-act="incorporar">Abrir versión nueva</button>' : ''}
      ${s.video?.partes?.length ? '<button class="button small" data-act="ver">Ver video</button><button class="button small" data-act="descargar">Descargar MP4</button>' : ''}
      ${s.estado === 'pendiente' ? '<button class="text-btn" data-act="cancelar">Cancelar</button>' : ''}</div></article>`).join('');
  }
  $('aiRequests').onclick = async ev => {
    const b = ev.target.closest('[data-act]'); if (!b) return;
    const s = solicitudes.find(x => x.id === b.closest('[data-id]').dataset.id); if (!s) return;
    try {
      if (b.dataset.act === 'incorporar') await incorporar(s);
      if (b.dataset.act === 'ver' || b.dataset.act === 'descargar') await videoDe(s, b.dataset.act);
      if (b.dataset.act === 'cancelar') await nube.db.doc(`solicitudes/${s.id}`).update({estado: 'cancelada'});
    } catch (e) { hooks.notify(e?.message || 'No se pudo completar.', 'error'); }
  };
  const avisadas = new Set();
  nube.db.collection('solicitudes').onSnapshot(snap => {
    solicitudes = snap.docs.map(d => ({id: d.id, ...d.data()}));
    for (const s of solicitudes) {
      if (s.estado === 'lista' && !avisadas.has(s.id) && s.proyectoId === hooks.getProject().id) {
        avisadas.add(s.id);
        hooks.notify(s.tipo === 'render' ? 'Tu render final está listo en «Cambios con Claude».' : 'Claude terminó tus cambios. Ábrelos en «Cambios con Claude».', 'success', 9000);
      }
    }
    pintar(); contexto();
  }, () => {});
  return {open: abrir, refresh: contexto, refreshContext: contexto, dispose() {}};
}
