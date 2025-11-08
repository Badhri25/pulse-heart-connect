const VERSION = 'v3';
const STATIC_CACHE = `pp-static-${VERSION}`;
const RUNTIME_CACHE = `pp-runtime-${VERSION}`;
const OFFLINE_URL = '/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll([
      OFFLINE_URL,
      '/favicon.png'
    ])).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const isHTML = req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html');

  if (isHTML) {
    // Network-first, fallback to offline.html
    event.respondWith(
      fetch(req).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  const url = new URL(req.url);

  // Firebase RTDB or API: network-first with fallback to cache
  const isRTDB = /\.firebaseio\.com$/.test(url.hostname) || url.hostname.endsWith('googleapis.com');
  if (isRTDB) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(RUNTIME_CACHE);
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        } catch (e) {
          const cache = await caches.open(RUNTIME_CACHE);
          const cached = await cache.match(req);
          return cached || new Response('', { status: 408 });
        }
      })()
    );
    return;
  }

  // Images and fonts: cache-first, then update
  if (req.destination === 'image' || req.destination === 'font') {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const fetched = fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || fetched;
      })
    );
    return;
  }

  // Default: cache-first with background update in runtime cache
  event.respondWith(
    caches.open(RUNTIME_CACHE).then(async (cache) => {
      const cached = await cache.match(req);
      const fetched = fetch(req).then((res) => {
        if (res && res.status === 200) cache.put(req, res.clone());
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});
