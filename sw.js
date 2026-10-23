/* Service worker de Autos SV: permite abrir el sitio sin conexión (última versión vista). */
const CACHE = 'autos-sv-v2';
const CORE = [
  'Html/index.html',
  'css/style.css',
  'javascript/data.js',
  'javascript/data_en.js',
  'javascript/app.js',
  'img/logo-autos-sv-nav.png',
  'img/favicon.png',
  'img/icon-192.png',
  'manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE.map((p) => new URL(p, self.registration.scope).href)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match(new URL('Html/index.html', self.registration.scope).href)))
  );
});
