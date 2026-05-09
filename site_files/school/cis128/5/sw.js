const CACHE_NAME = 'hybrid-report-cache-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS_TO_CACHE))
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cachedResponse => {
            const networkFetch = fetch(event.request).then(response => {
                let responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache => {
                    if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
                        cache.put(event.request, responseClone);
                    }
                });
                return response;
            }).catch(function() {
            });

            return cachedResponse || networkFetch;
        })
    );
});