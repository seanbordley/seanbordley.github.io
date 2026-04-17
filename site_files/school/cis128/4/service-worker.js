const CACHE_NAME = 'pwa-v11';

const urlsToCache = [
    './',
    'index.html',
    'style.css',
    'app.js',
    'manifest.json',
    'lightblue.jpg', 
    'lightgold.jpg',
    'icon.svg'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                for (const url of urlsToCache) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            const responseToCache = new Response(response.clone().body, {
                                status: response.status,
                                statusText: response.statusText,
                                headers: response.headers
                            });
                            await cache.put(url, responseToCache);
                        }
                    } catch (err) {
                    }
                }
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('index.html', { ignoreSearch: true });
            })
        );
        return;
    }

    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});