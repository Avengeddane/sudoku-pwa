const cacheName = "sudoku-pwa-v1";
const filesToCache = [
  "./",
  "./index.html",
  "./app.js",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install: cache alle filer
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(filesToCache);
    })
  );
  self.skipWaiting();
});

// Activate: ryd gamle caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.map(key => {
        if(key !== cacheName) return caches.delete(key);
      }))
    )
  );
  self.clients.claim();
});

// Fetch: brug cache først
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
