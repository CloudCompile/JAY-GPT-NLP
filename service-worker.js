const CACHE_NAME = 'JGN-APP-CACHE-V1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbt68xNMucloX2v7pefys5OLBTM7gScrbQzw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbt68xNMucloX2v7pefys5OLBTM7gScrbQzw&s'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(URLS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
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
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
