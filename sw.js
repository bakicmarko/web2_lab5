const filesToCache = [
  "/",
  "manifest.json",
  "index.html",
  "error404.html",
  "style.css",
  "favicon.ico",
  "assets/icons/icon-72x72.png",
  "assets/icons/icon-96x96.png",
  "assets/icons/icon-128x128.png",
  "assets/icons/icon-144x144.png",
  "assets/icons/icon-152x152.png",
  "assets/icons/icon-192x192.png",
  "assets/icons/icon-384x384.png",
  "assets/icons/icon-512x512.png",
];

const cchName = "static-cache-v1";

self.addEventListener("install", (event) => {
  console.log("Service Worker installation");
  event.waitUntil(
    caches
      .open(cchName)
      .then((cch) => cch.addAll(filesToCache))
      .catch((err) => {
        console.log(event);
        console.log("cachallerr");
      })
  );
  console.log("Files cached!");

  //async () => {
  //  const cch = await caches.open(filesToCache);
  //  await cch.addAll(filesToCache);
  //  console.log("Files cached...");
  //};
});

self.addEventListener("activate", (event) => {
  console.log("New service worker acctivated!");
  console.log("DELETING old cache...");
  event.waitUntil(
    caches.keys().then((cchKeys) => {
      return Promise.all(
        cchKeys.map((key) => {
          if (cchName.indexOf(key) === -1) {
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
    caches.match(event.request).then((res) => {
      if (res) return res;
      return fetch(event.request).then((netwResponse) => {
        if (netwResponse.status === 404) {
          return caches.match("eror404.html");
        }
        return caches.open(cchName).then((cch) => {
          cch.put(event.request.url, netwResponse.clone());
          console.log("Cached: " + event.request.url);
          return netwResponse;
        });
      });
    })
  );
});

self.addEventListener("sync", async function (event) {
  if (event.tag == "fetchJoke") {
    console.log("sync listening");
    event.waitUntil(
      self.registration.showNotification("You are back online!!!", {
        body: "Get more jokes",
      })
    );
  }
});

//self.addEventListener("fetch", (event) => {
//  event.respondWith(
//    caches
//      .open(cchName)
//      .then((cch) => {
//        cch.match(event.request.url).then((cchResponse) => {
//          console.log(cchResponse);
//          console.log("--------------");
//          if (cchResponse) {
//            console.log("From cache: " + cchResponse.url);
//            console.log("From cache(all): " + cchResponse);
//            return cchResponse;
//          } else
//            return fetch(event.request).then((netwResponse) => {
//              console.log("response.status = " + netwResponse.status);
//              if (netwResponse.status === 404)
//                return caches.match("error404.html");
//              console.log("Caching " + event.request.url);
//              cch.put(event.request, netwResponse.clone());
//              return netwResponse;
//            });
//        });
//      })
//  );
//});
