// Carga el contenido de la capacitación en Supabase a través de cap_rpc (exige CAP_RPC_SECRET).
//
// Uso:
//   node scripts/cap/cargar.mjs <bundle.json> <carpeta_img> [correo_admin]
//
// <bundle.json> sale de scripts/cap/preparar.py. Las variables se leen de .env.local:
// NEXT_PUBLIC_SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY (o SUPABASE_SERVICE_ROLE_KEY) y CAP_RPC_SECRET.
// Volver a correrlo actualiza módulos, imágenes, tareas y preguntas del examen; las preguntas
// generadas solo se agregan si no existen (no pisa las que ya editaste o aprobaste).

import { readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const [bundlePath, imgDir, adminEmail] = process.argv.slice(2);
if (!bundlePath || !imgDir) {
  console.error("Uso: node scripts/cap/cargar.mjs <bundle.json> <carpeta_img> [correo_admin]");
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const secret = process.env.CAP_RPC_SECRET;
if (!url || !key || !secret) throw new Error("Faltan variables de entorno de Supabase o CAP_RPC_SECRET");

const db = createClient(url, key, { auth: { persistSession: false } });
async function rpc(fn, params) {
  const { data, error } = await db.rpc("cap_rpc", { payload: { ...params, fn, secret } });
  if (error) throw new Error(`${fn}: ${error.message}`);
  if (data?.error) throw new Error(`${fn}: ${data.error}`);
  return data;
}

const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));

for (const m of bundle.modules) await rpc("seed_module", m);
console.log(`módulos: ${bundle.modules.length}`);

const types = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp" };
let imgs = 0;
for (const name of readdirSync(imgDir)) {
  const tipo = types[extname(name).toLowerCase()];
  if (!tipo) continue;
  await rpc("seed_image", { nombre: name, tipo, base64: readFileSync(join(imgDir, name)).toString("base64") });
  imgs++;
}
console.log(`imágenes: ${imgs}`);

for (const t of bundle.tasks) await rpc("seed_task", t);
console.log(`tareas: ${bundle.tasks.length}`);

for (const q of bundle.questions) await rpc("seed_question", q);
console.log(`preguntas: ${bundle.questions.length}`);

await rpc("seed_clave", { html: bundle.clave });
console.log("clave: ok");

if (adminEmail) {
  const r = await rpc("seed_admin", { correo: adminEmail, nombre: "Fran Morishita", telefono: "+52 646 256 3006" });
  console.log(r.temporal ? `admin creado. Contraseña temporal: ${r.temporal}` : "admin ya existía (rol confirmado)");
}
