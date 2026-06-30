const CACHE_NAME = 'shade-finder-v5';
const ASSETS = [
    './',
    './index.html',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/suncalc/1.8.0/suncalc.min.js',
    'https://cdn.jsdelivr.net/npm/dayjs@1/dayjs.min.js',
    'https://cdn.jsdelivr.net/npm/dayjs@1/plugin/utc.js',
    'https://cdn.jsdelivr.net/npm/dayjs@1/plugin/timezone.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', e => {
    if (e.request.url.startsWith('http')) {
        e.respondWith(
            fetch(e.request).then(fetchRes => {
                const resClone = fetchRes.clone();
                caches.open(CACHE_NAME).then(c => c.put(e.request, resClone));
                return fetchRes;
            }).catch(() => {
                return caches.match(e.request);
            })
        );
    }
});