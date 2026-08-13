const CACHE = "checklist-alojamento-v1";

const ARQUIVOS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js"
];

self.addEventListener("install", function(event) {

  event.waitUntil(

    caches
      .open(CACHE)
      .then(function(cache) {

        return cache.addAll(ARQUIVOS);

      })
      .then(function() {

        return self.skipWaiting();

      })

  );

});


self.addEventListener("activate", function(event) {

  event.waitUntil(
    self.clients.claim()
  );

});


self.addEventListener("fetch", function(event) {

  event.respondWith(

    caches.match(event.request)
      .then(function(cached) {

        if (cached) {

          return cached;

        }

        return fetch(event.request)
          .then(function(response) {

            const copia = response.clone();

            caches
              .open(CACHE)
              .then(function(cache) {

                cache.put(
                  event.request,
                  copia
                );

              });

            return response;

          })
          .catch(function() {

            return cached;

          });

      })

  );

});