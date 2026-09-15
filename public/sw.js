// Alpine Ascents — Service Worker Cleanup & Cache Eviction Script
// Safely evicts all legacy CacheStorage keys and unregisters obsolete service workers
// to prevent stale HTML from pointing to superseded Vite-hashed assets.

self.addEventListener('install', () => {
  // Force new service worker to activate immediately without waiting
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            console.log('[SW] Purging obsolete cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(() => {
        // Unregister this service worker from the client browser
        return self.registration.unregister();
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

self.addEventListener('fetch', (event) => {
  // Navigation / HTML requests MUST always fetch fresh from network
  // Never serve cached index.html which could reference stale asset hashes
  event.respondWith(fetch(event.request));
});
