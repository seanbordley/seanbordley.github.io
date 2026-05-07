const CACHE_NAME = 'sean-portfolio-v1';

// Add the exact paths of the files you want to cache for offline use
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/site_files/media/logo.png',
  '/site_files/media/profile.jpg',
  
  /* ADD YOUR PROJECT PAGES BELOW */
  // '/site_files/systems/page.html',
  // '/site_files/systems/main.jpg',
  // '/site_files/fixtures/page.html',
  // '/site_files/fixtures/main.jpg',
  // etc...
];

// Install Service Worker and Cache Files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Serve Cached Files when Offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return the cached response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      })
  );
});

// Clean up old caches when you update your files
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
