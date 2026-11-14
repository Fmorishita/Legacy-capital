/** Device-local working copies. Export a portable project for another device/editor. */
const DATABASE_VERSION = 1;
const EXPORT_FORMAT = 'legacy-video-studio';
const clone = value => typeof structuredClone === 'function' ? structuredClone(value) : JSON.parse(JSON.stringify(value));
const now = () => new Date().toISOString();
const uid = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;

function requestResult(request) {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('No se pudo leer el almacenamiento.'));
  });
}
function transactionDone(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error || new Error('Se canceló el guardado.'));
    transaction.onerror = () => reject(transaction.error || new Error('No se pudo guardar.'));
  });
}
function storageError(error) {
  if (error?.name === 'QuotaExceededError') return new Error('El dispositivo no tiene espacio suficiente. Descarga una copia del proyecto antes de seguir.');
  if (error?.name === 'SecurityError') return new Error('El navegador bloqueó el guardado local. Activa el almacenamiento del sitio o descarga una copia del proyecto.');
  return error;
}
function serializable(project) {
  const result = clone(project);
  for (const asset of [...(result.assets || []), ...(result.references || [])]) {
    // Object URLs are temporary and never belong in saved project records.
    if (typeof asset.url === 'string' && asset.url.startsWith('blob:')) {
      asset.blobId ||= asset.id;
      delete asset.url;
    }
    if (typeof asset.thumbnail === 'string' && asset.thumbnail.startsWith('blob:')) delete asset.thumbnail;
  }
  return result;
}

/** Throws Spanish input errors; returns the same validated object. */
export function validateProject(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('El archivo no contiene un proyecto válido.');
  const project = input.format === EXPORT_FORMAT ? input.project : input;
  if (!project || typeof project !== 'object') throw new Error('Falta el contenido del proyecto.');
  if (typeof project.id !== 'string' || !project.id.trim() || project.id.length > 200) throw new Error('El proyecto necesita un identificador válido.');
  if (typeof project.title !== 'string' || project.title.length > 500) throw new Error('El título del proyecto no es válido.');
  if (!Number.isFinite(project.width) || !Number.isFinite(project.height) || project.width < 100 || project.height < 100 || project.width > 7680 || project.height > 7680) throw new Error('El tamaño del lienzo no es válido.');
  if (!Array.isArray(project.scenes) || !project.scenes.length || project.scenes.length > 1000) throw new Error('El proyecto debe tener entre 1 y 1000 escenas.');
  if (!Array.isArray(project.assets) || project.assets.length > 3000) throw new Error('La biblioteca de medios no es válida.');
  const seen = new Set();
  let maxEnd = 0;
  for (const scene of project.scenes) {
    if (!scene || typeof scene.id !== 'string' || seen.has(scene.id)) throw new Error('Cada escena debe tener un identificador único.');
    seen.add(scene.id);
    if (!Number.isFinite(scene.start) || !Number.isFinite(scene.duration) || scene.start < 0 || scene.duration <= 0 || scene.duration > 21600) throw new Error('Hay una escena con tiempos no válidos.');
    maxEnd = Math.max(maxEnd, scene.start + scene.duration);
    if (scene.layers && (!Array.isArray(scene.layers) || scene.layers.length > 200)) throw new Error('Hay demasiadas capas en una escena.');
  }
  if (maxEnd > 21600) throw new Error('La duración máxima del proyecto es de seis horas.');
  if (project.captions && (!Array.isArray(project.captions) || project.captions.length > 20000)) throw new Error('La lista de subtítulos no es válida.');
  if (project.audioTracks && (!Array.isArray(project.audioTracks) || project.audioTracks.length > 5000)) throw new Error('La lista de pistas de audio no es válida.');
  for (const asset of [...project.assets, ...(project.references || [])]) {
    for (const property of ['url', 'thumbnail', 'embeddedDataUrl']) {
      const url = asset[property];
      if (typeof url === 'string' && /^(javascript|vbscript|file):/i.test(url.trim())) throw new Error('El proyecto contiene una dirección de archivo no admitida.');
      if (typeof url === 'string' && url.startsWith('data:') && !/^data:(image|video|audio|application\/octet-stream)\//i.test(url) && !/^data:application\/octet-stream[;,]/i.test(url)) throw new Error('El proyecto contiene un medio incrustado no admitido.');
    }
  }
  return project;
}

export function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('No se pudo incluir uno de los archivos en la copia.'));
    reader.readAsDataURL(blob);
  });
}
export function dataURLToBlob(value) {
  const match = /^data:([^;,]*)(;base64)?,([\s\S]*)$/.exec(value);
  if (!match) throw new Error('Un medio incrustado está dañado.');
  const decoded = match[2] ? atob(match[3]) : decodeURIComponent(match[3]);
  const bytes = new Uint8Array(decoded.length);
  for (let i = 0; i < decoded.length; i++) bytes[i] = decoded.charCodeAt(i);
  return new Blob([bytes], {type: match[1] || 'application/octet-stream'});
}

export class ProjectStore {
  constructor(dbName = 'legacy-video-studio') {
    this.dbName = dbName;
    this.dbPromise = null;
    this.objectURLs = new Map();
  }
  async open() {
    if (!globalThis.indexedDB) throw new Error('El navegador no admite guardado local. Puedes descargar una copia del proyecto.');
    if (!this.dbPromise) this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', {keyPath: 'id'});
        if (!db.objectStoreNames.contains('blobs')) db.createObjectStore('blobs', {keyPath: 'id'});
        if (!db.objectStoreNames.contains('versions')) {
          const versions = db.createObjectStore('versions', {keyPath: 'id'});
          versions.createIndex('projectId', 'projectId', {unique: false});
        }
      };
      request.onsuccess = () => {
        const db = request.result;
        db.onversionchange = () => { db.close(); this.dbPromise = null; };
        resolve(db);
      };
      request.onerror = () => { this.dbPromise = null; reject(storageError(request.error)); };
      request.onblocked = () => reject(new Error('Cierra otras pestañas del editor para actualizar el almacenamiento.'));
    });
    return this.dbPromise;
  }
  async load(id) {
    const db = await this.open();
    const result = await requestResult(db.transaction('projects', 'readonly').objectStore('projects').get(id));
    return result ? this.hydrate(result) : null;
  }
  async listProjects() {
    const db = await this.open();
    const records = await requestResult(db.transaction('projects', 'readonly').objectStore('projects').getAll());
    return records.map(({id,title,updatedAt,version}) => ({id,title,updatedAt,version})).sort((a,b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }
  async save(project) {
    validateProject(project);
    const record = serializable(project);
    record.updatedAt = now();
    try {
      const db = await this.open();
      const tx = db.transaction('projects', 'readwrite');
      const complete = transactionDone(tx);
      tx.objectStore('projects').put(record);
      await complete;
      return {id: record.id, updatedAt: record.updatedAt, storage: 'device'};
    } catch (error) { throw storageError(error); }
  }
  async saveVersion(project, label = '') {
    validateProject(project);
    const record = {id: uid(), projectId: project.id, createdAt: now(), label: String(label || `Versión ${new Date().toLocaleString('es-MX')}`).slice(0,500), project: serializable(project)};
    const db = await this.open();
    const tx = db.transaction('versions', 'readwrite');
    const complete = transactionDone(tx);
    tx.objectStore('versions').put(record);
    await complete.catch(error => { throw storageError(error); });
    return {id: record.id, projectId: record.projectId, createdAt: record.createdAt, label: record.label};
  }
  async listVersions(projectId) {
    const db = await this.open();
    const records = await requestResult(db.transaction('versions', 'readonly').objectStore('versions').index('projectId').getAll(projectId));
    return records.map(({id,projectId,createdAt,label,project}) => ({id,projectId,createdAt,label,title:project.title,duration:project.duration})).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
  }
  async restoreVersion(projectId, versionId) {
    // One-argument form is convenient when the UI already holds a version id.
    if (versionId === undefined) { versionId = projectId; projectId = null; }
    const db = await this.open();
    const record = await requestResult(db.transaction('versions', 'readonly').objectStore('versions').get(versionId));
    if (!record || (projectId && record.projectId !== projectId)) throw new Error('No se encontró esa versión del proyecto.');
    return this.hydrate(record.project);
  }
  async putBlob(id, blob) {
    if (!(blob instanceof Blob)) throw new Error('El archivo subido no es válido.');
    const db = await this.open();
    const tx = db.transaction('blobs', 'readwrite');
    const complete = transactionDone(tx);
    tx.objectStore('blobs').put({id,blob,name:blob.name || '',type:blob.type,updatedAt:now()});
    await complete.catch(error => { throw storageError(error); });
    const previous = this.objectURLs.get(id);
    if (previous) { URL.revokeObjectURL(previous); this.objectURLs.delete(id); }
    return id;
  }
  async getBlob(id) {
    const db = await this.open();
    const record = await requestResult(db.transaction('blobs', 'readonly').objectStore('blobs').get(id));
    return record?.blob || null;
  }
  async hydrate(project) {
    const result = clone(project);
    const missing = [];
    for (const asset of [...(result.assets || []), ...(result.references || [])]) {
      if (!asset.blobId) continue;
      const blob = await this.getBlob(asset.blobId);
      if (!blob) { missing.push(asset.id || asset.blobId); asset.missing = true; continue; }
      if (!this.objectURLs.has(asset.blobId)) this.objectURLs.set(asset.blobId, URL.createObjectURL(blob));
      asset.url = this.objectURLs.get(asset.blobId);
      delete asset.missing;
    }
    result.missingAssets = missing;
    return result;
  }
  /** Returns a JSON-ready envelope, not a string. Only uploads are embedded by default. */
  async serialize(project, {embedUploads = true} = {}) {
    validateProject(project);
    const result = serializable(project);
    if (embedUploads) {
      for (const asset of [...(result.assets || []), ...(result.references || [])]) {
        if (!asset.blobId) continue;
        const blob = await this.getBlob(asset.blobId);
        if (!blob) throw new Error(`Falta el archivo «${asset.name || asset.id}». Vuelve a subirlo antes de descargar una copia portable.`);
        asset.embeddedDataUrl = await blobToDataURL(blob);
      }
    }
    return {format: EXPORT_FORMAT, schemaVersion: 1, exportedAt: now(), assetsEmbedded: embedUploads, project: result};
  }
  async importProject(value) {
    let input;
    try { input = typeof value === 'string' ? JSON.parse(value) : value; }
    catch { throw new Error('El archivo no es un JSON válido.'); }
    const validated = validateProject(input);
    const project = clone(validated);
    for (const asset of [...(project.assets || []), ...(project.references || [])]) {
      if (!asset.embeddedDataUrl) continue;
      const blob = dataURLToBlob(asset.embeddedDataUrl);
      asset.blobId ||= asset.id || uid();
      await this.putBlob(asset.blobId, blob);
      delete asset.embeddedDataUrl;
    }
    await this.save(project);
    return this.hydrate(project);
  }
  dispose() {
    for (const url of this.objectURLs.values()) URL.revokeObjectURL(url);
    this.objectURLs.clear();
  }
}
