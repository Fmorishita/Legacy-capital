// Verificación: ningún texto visible tapa una cara ni un objeto protegido, y todo el texto queda en el área útil.
// Abre index.html en Chromium (Playwright), mueve la línea de tiempo de GSAP cada 0.1 s y compara las cajas reales
// (getBoundingClientRect, ya con zoom y movimiento) de los textos contra las zonas .fbox de la toma visible.
// Uso: node qa_textos.cjs   → escribe qa_textos.json y un resumen.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
(async () => {
  const dir = __dirname;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  // GSAP local (sin red): el mismo paquete que trae el CLI de HyperFrames
  const gsapLocal = require('child_process').execSync("find /root/.npm/_npx -path '*hyperframes/dist/vendor/npm/gsap@*/dist/gsap.min.js' | head -1").toString().trim();
  await page.route('**/*', r => r.request().url().includes('gsap') ? r.fulfill({ path: gsapLocal, contentType: 'application/javascript' }) : r.continue());
  page.on('pageerror', e => console.log('error en la página:', e.message));
  await page.goto('file://' + path.join(dir, 'index.html'));
  for (let i = 0; i < 60; i++) {
    if (await page.evaluate(() => !!(window.__timelines && window.__timelines.main))) break;
    if (i === 59) throw new Error('la línea de tiempo no se registró');
    await new Promise(r => setTimeout(r, 500));
  }
  await page.evaluate(() => document.fonts.ready);
  const DUR = await page.evaluate(() => parseFloat(document.getElementById('root').dataset.duration));
  const res = await page.evaluate(async (DUR) => {
    const tl = window.__timelines.main;
    const active = (el, t) => {
      for (let e = el; e && e.id !== 'root'; e = e.parentElement) {
        if (e.dataset && e.dataset.start !== undefined) {
          const s = parseFloat(e.dataset.start), d = parseFloat(e.dataset.duration);
          if (!(t >= s && t < s + d)) return false;
        }
      }
      return true;
    };
    const opac = (el) => {
      let o = 1;
      for (let e = el; e && e.id !== 'root'; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.display === 'none' || cs.visibility === 'hidden') return 0;
        o *= parseFloat(cs.opacity);
      }
      return o;
    };
    const TXT = '.hl .l1, .hl div.l2, .cap, #hook .a, #hook .b, .pr .d, .pr .b, .chk, .note, #cta-t, #cta, #cta-wa, #logo-in img, #logo-in span, .mg .eb, .mg .tt, .pcard, #promo, .thumb';
    const BOXES = new Set(['cap', 'chk', 'pcard', 'thumb']);
    const tight = (el) => {  // caja ajustada al texto (no al contenedor) salvo en píldoras y tarjetas
      if (el.tagName === 'IMG' || el.id === 'promo' || el.id === 'cta' || [...el.classList].some(c => BOXES.has(c))) return el.getBoundingClientRect();
      const rg = document.createRange(); rg.selectNodeContents(el); const rs = [...rg.getClientRects()].filter(r => r.width > 1);
      if (!rs.length) return el.getBoundingClientRect();
      return { left: Math.min(...rs.map(r => r.left)), top: Math.min(...rs.map(r => r.top)), right: Math.max(...rs.map(r => r.right)), bottom: Math.max(...rs.map(r => r.bottom)), width: 1, height: 1 };
    };
    const SAFE = { x0: 65, x1: 1015, y0: 270, y1: 1248 };
    const hits = [], safe = [], over = [];
    for (let t = 0; t < DUR; t += 0.1) {
      tl.seek(t, false);
      // zonas protegidas de la toma de foto activa más arriba (la última en el orden del DOM)
      const shots = [...document.querySelectorAll('.clip.bg')].filter(s => active(s, t));
      const shot = shots[shots.length - 1];
      const boxes = shot ? [...shot.querySelectorAll('.fbox')].map(b => ({ r: b.getBoundingClientRect(), kind: b.dataset.kind, name: b.dataset.name })) : [];
      const vis = [];
      for (const el of document.querySelectorAll(TXT)) {
        if (!active(el, t) || opac(el) < 0.05) continue;
        const r = tight(el);
        if (r.right - r.left < 2 || r.bottom - r.top < 2) continue;
        const label = (el.id || el.className) + ' «' + (el.textContent || '').trim().slice(0, 32) + '»';
        for (const b of boxes) {
          const dx = Math.min(r.right, b.r.right) - Math.max(r.left, b.r.left);
          const dy = Math.min(r.bottom, b.r.bottom) - Math.max(r.top, b.r.top);
          if (dx > 0 && dy > 0) hits.push({ t: +t.toFixed(1), shot: shot.id, text: label, zona: b.name, area: Math.round(dx * dy) });
        }
        vis.push({ el, r, label });
        const isLogo = !!el.closest('#logo-in');
        if (!isLogo && (r.left < SAFE.x0 - 1 || r.right > SAFE.x1 + 1 || r.top < SAFE.y0 - 1 || r.bottom > SAFE.y1 + 1))
          safe.push({ t: +t.toFixed(1), text: label, r: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] });
      }
      for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
        const a = vis[i], b = vis[j];
        if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
        if (a.el.closest('#logo-in') && b.el.closest('#logo-in')) continue;
        if (a.el.closest('.hl') && a.el.closest('.hl') === b.el.closest('.hl')) continue;
        if ((a.el.closest('#promo') && b.el.closest('#promo')) || (a.el.closest('.pcard') && b.el.closest('.pcard'))) continue;
        const dx = Math.min(a.r.right, b.r.right) - Math.max(a.r.left, b.r.left), dy = Math.min(a.r.bottom, b.r.bottom) - Math.max(a.r.top, b.r.top);
        if (dx > 2 && dy > 2) over.push({ t: +t.toFixed(1), a: a.label, b: b.label, area: Math.round(dx * dy) });
      }
    }
    return { hits, safe, over };
  }, DUR);
  fs.writeFileSync(path.join(dir, 'qa_textos.json'), JSON.stringify(res, null, 1));
  const agg = {};
  for (const h of res.hits) { const k = `${h.shot} · ${h.text} sobre ${h.zona}`; (agg[k] = agg[k] || []).push(h.t); }
  console.log(`Textos sobre caras/objetos: ${res.hits.length} muestras`);
  for (const [k, ts] of Object.entries(agg)) console.log(`  ${k}: ${ts[0]}–${ts[ts.length - 1]} s (${ts.length} muestras)`);
  const sagg = {};
  for (const h of res.safe) { const k = h.text; (sagg[k] = sagg[k] || []).push(h); }
  console.log(`Fuera del área útil: ${res.safe.length} muestras`);
  for (const [k, hs] of Object.entries(sagg)) console.log(`  ${k}: ${hs[0].t}–${hs[hs.length - 1].t} s caja ${hs[0].r}`);
  const oagg = {};
  for (const h of res.over) { const k = `${h.a}  ×  ${h.b}`; (oagg[k] = oagg[k] || []).push(h.t); }
  console.log(`Textos encimados entre sí: ${res.over.length} muestras`);
  for (const [k, ts] of Object.entries(oagg)) console.log(`  ${k}: ${ts[0]}–${ts[ts.length - 1]} s (${ts.length})`);
  await browser.close();
})();
