const CACHE_NAME = 'sean-portfolio-v4';

/*const urlsToCache = [
  '/',
  '/index.html',
  '/site_files/media/logo.png',
  '/site_files/media/profile.jpg',
  '/site_files/Sean_Bordley_Resume.pdf',
  '/site_files/systems/page.html',
  '/site_files/systems/main.jpg',
  '/site_files/fixtures/page.html',
  '/site_files/fixtures/main.jpg',
  '/site_files/parts/page.html',
  '/site_files/parts/main.jpg',
  '/site_files/tools/page.html',
  '/site_files/tools/main.jpg',
  '/site_files/film/page.html',
  '/site_files/film/main.jpg',
  '/site_files/personal/page.html',
  '/site_files/personal/main.jpg',
  '/site_files/about/page.html',
  '/site_files/about/main.jpg'
]; 
*/

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
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