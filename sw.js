const filesToCache = [
  "/",
  "manifest.json",
  "index.html",
  "offline.html",
  "error404.html",
  "favicon.ico",
  "assets/icons/icon-72x72.png",
  "assets/icons/icon-96x96.png",
  "assets/icons/icon-144x144.png",
  "assets/icons/icon-128x128.png",
  "assets/icons/icon-144x144.png",
  "assets/icons/icon-152x152.png",
  "assets/icons/icon-192x192.png",
  "assets/icons/icon-384x384.png",
  "assets/icons/icon-512x512.png",
];

const staticCacheName = "static-cache-v1";

self.addEventListener("install", (event) => {
  console.log("Service Worker installation");
  async () => {
    const cch = await caches.open(filesToCache);
    await cch.addAll(filesToCache);
    console.log("Files cached...");
  };
});

self.addEventListener("activate", (event) => {
  console.log("New service worker acctivated!");
  console.log("DELETING old cache...");
  event.waitUntil(
    caches.keys().then((cchKeys) => {
      return Promise.all(
        cchKeys.map((key) => {
          if (staticCacheName.indexOf(key) === -1) {
            console.log("deleting: " + key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          console.log("Found " + event.request.url + " in cache!");
          return response;
        }
        return fetch(event.request).then((response) => {
          console.log("response.status = " + response.status);
          if (response.status === 404) {
            return caches.match("eror404.html");
          }
          return caches.open(staticCacheName).then((cache) => {
            console.log(">>> Caching: " + event.request.url);
            cache.put(event.request.url, response.clone());
            return response;
          });
        });
      })
      .catch((error) => {
        console.log("Error", event.request.url, error);
        // ovdje možemo pregledati header od zahtjeva i možda vratiti različite fallback sadržaje
        // za različite zahtjeve - npr. ako je zahtjev za slikom možemo vratiti fallback sliku iz cachea
        // ali zasad, za sve vraćamo samo offline.html:
        return caches.match("offline.html");
      })
  );
});
