const CACHE_NAME = 'pwa-assignment-v9';

const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json',
    './lightblue.jpg', 
    './lightgold.jpg',
    './icon.svg'
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
                            let responseToCache = response;
                            if (response.redirected) {
                                responseToCache = new Response(response.clone().body, {
                                    status: response.status,
                                    statusText: response.statusText,
                                    headers: response.headers
                                });
                            }
                            await cache.put(url, responseToCache);
                        }
                    } catch (err) {
                        console.error(`Network error caching ${url}:`, err);
                    }
                }
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true })
            .then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(event.request).catch(() => {
                    if (event.request.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
    );
});