const CACHE_NAME = 'pwa-assignment-v1';

const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './lightblue.jpg', 
    './lightgold.jpg',
    './icon.svg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache and caching files');
                return cache.addAll(urlsToCache);
            })
    );
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