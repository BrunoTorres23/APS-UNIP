/**
 * Service Worker for Tecnologia e Sustentabilidade
 * Provides offline support and faster loading through caching
 */

const CACHE_NAME = 'tecnologia-sustentabilidade-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/main.js',
  './js/modules/core.js',
  './js/bundle.js',
  './images/direito-e-sustentabilidade.jpg',
  './images/pexels-christian-fohrer-894172-2912103.jpg',
  './images/pexels-pok-rie-33563-3829454.jpg',
  './images/istockphoto-1400218353-612x612.jpg',
  './images/istockphoto-1414916304-612x612.jpg',
  './site.webmanifest',
  './images/favicon-16x16.png',
  './images/favicon-32x32.png',
  './images/apple-touch-icon.png'
];

// Install event - precache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Handle image requests specially
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg|webp)$/)) {
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          return fetch(event.request).then(response => {
            // Cache the image for future use
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // For HTML requests - network first, then cache
  if (event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If network fails, try the cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If not in cache, return the offline page
            return caches.match('./index.html');
          });
        })
    );
    return;
  }

  // For other assets - cache first, then network
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        // If not in cache, fetch from network
        return fetch(event.request).then(response => {
          // Cache the response for future
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            }).catch(err => {
              console.error('Failed to cache response:', err);
              // Continue even if caching fails
            });
          }
          return response;
        }).catch(err => {
          console.error('Network fetch failed:', err);
          // For JS or CSS files, try to return a fallback
          const url = new URL(event.request.url);
          const extension = url.pathname.split('.').pop();

          if (extension === 'js') {
            return caches.match('./js/bundle.js');
          } else if (extension === 'css') {
            return caches.match('./css/style.css');
          }

          // Otherwise just fail
          throw err;
        });
      })
  );
});
