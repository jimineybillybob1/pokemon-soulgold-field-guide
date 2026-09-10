const CACHE_PREFIX = 'pokemon-soulgold-field-guide-';
const CACHE_NAME = `${CACHE_PREFIX}1.1.2-20260910-r14`;
const SHELL = [
  './', './index.html', './styles.css', './refinements.css?v=1.1.2-r14', './branding.css', './app.js?v=1.1.2-r14',
  './config/game-config.js?v=1.1.2-r14', './config/game-overrides.js?v=1.1.2-r14',
  './data/guide-data.js', './data/items-data.js', './data/legendary-data.js',
  './data/acquisition-data.js', './data/egg-data.js', './data/battle-data.js',
  './data/move-tutor-data.js', './data/curated-builds.js', './site.webmanifest',
  './assets/art/soulgold-hero-v2.png',
  './assets/art/pwa-icon-192.png', './assets/art/pwa-icon-512.png',
  './assets/trainers/soulgold/brendan.png', './assets/trainers/soulgold/may.png',
  './assets/badges/soulgold/zephyr.png', './assets/badges/soulgold/hive.png',
  './assets/badges/soulgold/plain.png', './assets/badges/soulgold/fog.png',
  './assets/badges/soulgold/storm.png', './assets/badges/soulgold/mineral.png',
  './assets/badges/soulgold/glacier.png', './assets/badges/soulgold/rising.png',
  './assets/maps/soulgold-world-map.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all(SHELL.map(async path => {
        const canonicalUrl = new URL(path, self.registration.scope);
        const fetchUrl = new URL(canonicalUrl);
        fetchUrl.searchParams.set('__precache', '1.1.2-r14');
        const request = new Request(fetchUrl, { cache: 'reload' });
        const response = await fetch(request);
        if (!response.ok) throw new Error(`Failed to cache ${path}: ${response.status}`);
        await cache.put(new Request(canonicalUrl), response);
      })))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response.ok) {
            event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.put('./index.html', response.clone())));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(caches.match(event.request).then(cached => {
    const network = fetch(event.request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
      return response;
    });
    if (cached) {
      event.waitUntil(network.catch(() => undefined));
      return cached;
    }
    return network.catch(() => Response.error());
  }));
});
