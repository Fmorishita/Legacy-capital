#!/usr/bin/env node
// Render final cuadro por cuadro con el MISMO motor del editor (lo que ves = lo que se entrega).
// Corta por escenas y guarda cada tramo por huella: un cambio solo re-renderiza las escenas tocadas.
//
//   node tools/render-claude.mjs <proyecto.json> <salida.mp4> [--crf 17] [--dist dist]
//
// El proyecto es el JSON del editor (doctor-v6.json o el exportado/guardado en la nube).
// Requiere Playwright (Chromium) y ffmpeg. Caché en <salida>.segmentos/
import {createHash} from 'node:crypto';
import {spawn, spawnSync, execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {chromium} = require('playwright');
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const [projPath, outPath] = args.filter((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!projPath || !outPath) { console.log('Uso: node tools/render-claude.mjs <proyecto.json> <salida.mp4> [--crf 17]'); process.exit(1); }
const here = path.dirname(new URL(import.meta.url).pathname);
const dist = path.resolve(opt('dist', path.join(here, '..', 'build', 'dist')));
const crf = opt('crf', '17');
let project = JSON.parse(fs.readFileSync(projPath, 'utf8'));
if (project.format === 'legacy-video-studio') project = project.project;
const fps = project.fps || 24, W = project.width || 1080, H = project.height || 1920;
const cacheDir = outPath + '.segmentos'; fs.mkdirSync(cacheDir, {recursive: true});

// --- servidor estático para que el motor cargue sus medios con rutas relativas
const types = {'.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.png': 'image/png',
  '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.wav': 'audio/wav'};
const server = http.createServer((req, res) => {
  const p = path.join(dist, decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(dist) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'Content-Type': types[path.extname(p)] || 'application/octet-stream'}); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// --- segmentos: corte al inicio de cada escena, salvo dentro de una transición
const T = s => Math.round(s * fps);
const total = Math.round(project.scenes.reduce((m, s) => Math.max(m, s.start + s.duration), 0) * fps);
const cuts = [...new Set(project.scenes.map(s => T(s.start)).filter(f => f > 0 && f < total))].sort((a, b) => a - b);
const lims = [0, ...cuts, total];
const segs = lims.slice(0, -1).map((f0, i) => ({n: i + 1, f0, f1: lims[i + 1]}));
const sha = o => createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 20);
const assetSig = id => { const a = (project.assets || []).find(x => x.id === id); return a ? (a.sha256 || a.url || a.blobId) : null; };
const global = {W, H, fps, brand: project.brand, subtitleStyle: project.subtitleStyle, fonts: (project.assets || []).filter(a => a.type === 'font').map(a => a.sha256 || a.url), motor: sha(fs.readFileSync(path.join(dist, 'engine.js'), 'utf8'))};
for (const s of segs) {
  const a = s.f0 / fps - 1, b = s.f1 / fps + 1; // margen de 1 s: transiciones y entradas
  const inR = x => (x.start ?? 0) < b && (x.start ?? 0) + (x.duration ?? (x.end - x.start) ?? 0) > a;
  const scenes = project.scenes.filter(inR).map(sc => ({...sc, _m: assetSig(sc.mediaId), _l: (sc.layers || []).map(l => assetSig(l.assetId || l.mediaId))}));
  s.huella = sha({global, f0: s.f0, f1: s.f1, scenes, captions: (project.captions || []).filter(c => c.start < b && c.end > a), overlays: (project.overlays || []).filter(inR)});
  s.archivo = path.join(cacheDir, `${s.huella}.mp4`);
}

// --- navegador
const browser = await chromium.launch();
const page = await browser.newPage({viewport: {width: 400, height: 400}});
page.on('pageerror', e => console.error('ERR página:', e.message));
await page.goto(`${base}/render.html`); await page.waitForFunction('window.rendererListo === true');
const info = await page.evaluate(p => window.renderer.cargar(p), project);
if (info.errores.length) console.warn('⚠ medios con error:', info.errores.slice(0, 5));

let nuevos = 0;
for (const s of segs) {
  if (fs.existsSync(s.archivo)) continue;
  process.stdout.write(`→ segmento ${s.n}/${segs.length} cuadros ${s.f0}–${s.f1 - 1}… `);
  const tmp = s.archivo + '.tmp.mp4';
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-crf', crf, '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', String(fps), '-video_track_timescale', String(fps * 1000), tmp], {stdio: ['pipe', 'inherit', 'inherit']});
  for (let f = s.f0; f < s.f1; f++) {
    const url = await page.evaluate(t => window.renderer.cuadro(t), f / fps);
    if (!ff.stdin.write(Buffer.from(url.slice(url.indexOf(',') + 1), 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end(); await new Promise((ok, ko) => ff.on('close', c => c ? ko(new Error('ffmpeg ' + c)) : ok()));
  fs.renameSync(tmp, s.archivo); nuevos++; console.log('listo');
}

// --- audio con el mismo mezclador del editor
const pcm = Buffer.from(await page.evaluate(() => window.renderer.audio(48000)), 'base64');
await browser.close(); server.close();
const raw = outPath + '.audio.raw'; fs.writeFileSync(raw, pcm);
// loudness para anuncios: −14 LUFS integrada, pico real ≤ −1 dBTP (dos pasadas). --lufs no lo desactiva.
const lufs = opt('lufs', '-14');
const pcmIn = ['-f', 's16le', '-ar', '48000', '-ac', '2', '-i', raw];
let audioFiltro = [];
if (lufs !== 'no') {
  const r = spawnSync('ffmpeg', ['-hide_banner', ...pcmIn, '-af', `loudnorm=I=${lufs}:TP=-1:LRA=11:print_format=json`, '-f', 'null', '-']).stderr.toString();
  const txt = r.includes('input_i') ? r : '';
  const m = txt ? JSON.parse(txt.slice(txt.lastIndexOf('{'), txt.lastIndexOf('}') + 1)) : null;
  if (m) audioFiltro = ['-af', `loudnorm=I=${lufs}:TP=-1:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true,aresample=48000`];
}

const lista = path.join(cacheDir, '_lista.txt');
fs.writeFileSync(lista, segs.map(s => `file '${path.basename(s.archivo)}'`).join('\n') + '\n');
execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lista, ...pcmIn,
  '-map', '0:v', '-map', '1:a', ...audioFiltro, '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-movflags', '+faststart', '-shortest', outPath]);
fs.rmSync(raw);
const cuadros = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_packets', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', outPath]).toString().trim();
console.log(`✔ ${outPath}: ${cuadros}/${total} cuadros · ${fps} fps · ${W}×${H} · segmentos nuevos ${nuevos} de ${segs.length}`);
fs.writeFileSync(outPath + '.segmentos.json', JSON.stringify(segs.map(({n, f0, f1, huella}) => ({n, f0, f1, huella})), null, 1));
