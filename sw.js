const CACHE_NAME = "smart-cache"; // ثابت لا يتغير

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  // نتجاهل طلبات غير GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // لو فيه إنترنت → خزّن أحدث نسخة
        const responseClone = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return networkResponse;
      })
      .catch(() => {
        // لو مفيش إنترنت → استخدم الكاش
        return caches.match(event.request);
      })
  );
});
