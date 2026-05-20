/* ================================================================
   DarnaFood — Service Worker v4
   Network-first for HTML, cache-first for assets
================================================================ */

const CACHE_NAME = 'darnafood-v4';
const STATIC_ASSETS = [
  './manifest.json',
  './icons/icon.svg',
  './images/hero.png',
  './images/dish_couscous.png',
  './images/dish_grillades.png',
  './images/dish_tagine.png',
  './images/dish_baklawa.png',
];

// Install: cache static assets only (not index.html)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS.filter(url => !url.startsWith('http')));
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean ALL old caches immediately
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => {
        console.log('[SW] Deleting old cache:', k);
        return caches.delete(k);
      }))
    ).then(() => self.clients.claim())
  );
});

// Fetch strategy:
// - HTML pages → Network first (always fresh)
// - Other assets → Cache first
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // API calls → always network
  if (url.pathname.startsWith('/api/')) return;

  // HTML navigation → network first, fallback to cache
  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }

  // Static assets → cache first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
