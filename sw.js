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

self.addEventListener("install", event=>{
  event.waitUntil(
    caches.open(cacheName).then(cache => cache.addAll(filesToCache))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event=>{
  event.waitUntil(
    caches.keys().then(keys=>
      Promise.all(keys.map(key=>key!==cacheName?caches.delete(key):null))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event=>{
  event.respondWith(
    caches.match(event.request).then(resp=>resp || fetch(event.request))
  );
});
