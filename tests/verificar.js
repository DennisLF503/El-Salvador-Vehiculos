// Chequeo estático del sitio Autos SV. Sin dependencias: node tests/verificar.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const BASE = 'https://dennislf503.github.io/El-Salvador-Vehiculos/';
let errores = 0;
const error = (msg) => { errores++; console.log('ERROR: ' + msg); };

const leer = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');
const existe = (rel) => fs.existsSync(path.join(ROOT, rel));
const htmlFiles = () => {
  const out = ['404.html'];
  for (const dir of ['Html', 'en']) {
    for (const f of fs.readdirSync(path.join(ROOT, dir))) {
      if (f.endsWith('.html')) out.push(path.join(dir, f));
    }
  }
  return out;
};

// 1) Enlaces, imágenes y scripts locales existen
for (const f of htmlFiles()) {
  const s = leer(f);
  const dir = path.dirname(f);
  const refs = [...s.matchAll(/(?:href|src)="([^"]+)"/g)].map((m) => m[1]);
  for (const ref of refs) {
    if (/^(https?:|mailto:|tel:|#|\/\/)/.test(ref)) continue;
    const limpio = ref.split('#')[0].split('?')[0];
    if (!limpio) continue;
    if (!existe(path.normalize(path.join(dir, limpio)))) error(`${f}: enlace roto "${ref}"`);
  }
  // 2) Toda imagen tiene texto alternativo (alt)
  for (const img of s.match(/<img\b[^>]*>/g) || []) {
    if (!/\balt="/.test(img)) error(`${f}: imagen sin alt: ${img.slice(0, 80)}`);
  }
  // 3) Idioma declarado correcto
  const esEN = f.startsWith('en' + path.sep);
  const lang = (s.match(/<html lang="([^"]+)"/) || [])[1];
  if (f !== '404.html' && lang !== (esEN ? 'en' : 'es')) error(`${f}: lang="${lang}" incorrecto`);
  // 4) Cada página tiene su versión en el otro idioma
  if (f !== '404.html') {
    const alt = (s.match(/hreflang="(?:es|en)" href="([^"]+)"/g) || []).length;
    if (alt < 2) error(`${f}: faltan etiquetas hreflang`);
    const langLink = (s.match(/<a class="lang" href="([^"]+)"/) || [])[1];
    if (!langLink) error(`${f}: falta el botón de cambio de idioma`);
    else if (!existe(path.normalize(path.join(dir, langLink.split('#')[0])))) error(`${f}: el botón de idioma apunta a un archivo inexistente`);
  }
}

// 5) Datos: mismos modelos en español e inglés, con detalle completo
const cargarDatos = (rel) => {
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(leer(rel), ctx);
  return ctx;
};
const es = cargarDatos('javascript/data.js');
const en = cargarDatos('javascript/data_en.js');
const nombres = (d) => Object.values(d.C).flatMap((c) => c.m.map((m) => m[0]));
const nEs = nombres(es), nEn = nombres(en);
if (nEs.length !== nEn.length) error(`distinto número de modelos: ES ${nEs.length}, EN ${nEn.length}`);
for (const n of nEs) {
  if (!nEn.includes(n)) error(`modelo "${n}" falta en data_en.js`);
  if (!es.DET[n]) error(`modelo "${n}" no tiene detalle (DET) en español`);
  if (!en.DET[n]) error(`modelo "${n}" no tiene detalle (DET) en inglés`);
  if (!es.F[n]) error(`modelo "${n}" no tiene imagen (F)`);
  const f = es.F[n] && path.normalize(path.join(ROOT, 'Html', es.F[n]));
  if (f && !fs.existsSync(f)) error(`imagen de "${n}" no existe: ${es.F[n]}`);
}
for (const [n, d] of Object.entries(es.DET)) {
  if (!d.a || !d.u || !Array.isArray(d.v) || !Array.isArray(d.r)) error(`detalle incompleto: ${n}`);
  if (d.v && d.v.length !== 3) error(`"${n}": se esperaban 3 ventajas`);
  if (d.r && d.r.length !== 3) error(`"${n}": se esperaban 3 puntos a revisar`);
}

// 6) Sitemap apunta a archivos que existen
const sitemap = leer('sitemap.xml');
for (const loc of [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) {
  if (!loc.startsWith(BASE)) { error(`sitemap: URL fuera del sitio ${loc}`); continue; }
  if (!existe(loc.slice(BASE.length))) error(`sitemap: archivo inexistente ${loc}`);
}

// 7) Manifiesto y service worker válidos
try { JSON.parse(leer('manifest.webmanifest')); } catch (e) { error('manifest.webmanifest no es JSON válido'); }
try { new vm.Script(leer('sw.js')); } catch (e) { error('sw.js tiene errores de sintaxis'); }
try { new vm.Script(leer('javascript/app.js')); } catch (e) { error('app.js tiene errores de sintaxis'); }

console.log(errores === 0 ? 'Todo en orden: 0 errores.' : `Se encontraron ${errores} error(es).`);
process.exit(errores === 0 ? 0 : 1);
