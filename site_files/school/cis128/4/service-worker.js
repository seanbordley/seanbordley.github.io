const CACHE_NAME = 'pwa-assignment-v10';

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
                        // Silently skip missing files so the rest of the app still caches
                    }
                }
            })
    );
});

self.addEventListener('activate', event => {
    // THIS FIXES THE GHOST CACHES: Deletes old versions (v1 - v9) automatically
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
    // If the browser is asking for a webpage (like index.html)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => {
                // If network fails (offline), force it to load exactly index.html from cache
                return caches.match('index.html', { ignoreSearch: true });
            })
        );
        return;
    }

    // For everything else (images, CSS, JS)
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