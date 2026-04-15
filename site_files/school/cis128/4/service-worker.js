const CACHE_NAME = 'pwa-assignment-v4';

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './lightblue.jpg', 
    './lightgold.jpg',
    './icon.svg'
];

self.addEventListener('install', event => {
    // Forces the waiting service worker to become the active service worker
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async cache => {
                console.log('Opened cache, caching files individually...');
                // Cache files one by one so a single missing file doesn't crash the whole process
                for (const url of urlsToCache) {
                    try {
                        const response = await fetch(url);
                        if (response.ok) {
                            await cache.put(url, response);
                        } else {
                            console.error(`Failed to cache ${url}: ${response.status}`);
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
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});