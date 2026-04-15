const CACHE_NAME = 'pwa-assignment-v3';

const urlsToCache = [
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
            .catch(err => console.error('Cache failed! A file is missing:', err))
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