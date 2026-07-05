/**
 * service-worker.js
 * Minimal offline-first caching for the ANSEM Live Tracker static assets.
 * Network requests to live data APIs are intentionally NOT cached so
 * holder counts stay fresh; only the app shell is cached for offline use.
 */

const CACHE_NAME = "ansem-tracker-cache-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./config.js",
  "./manifest.json",
  "./assets/favicon.svg",
  "./assets/icon-192.svg",
  "./assets/icon-512.svg",
  "./assets/og-image.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Never cache/interfere with API calls to external data sources —
  // always go to network so holder counts remain live.
  const isExternal = url.origin !== self.location.origin;
  if (isExternal) {
    return; // let the browser handle it normally
  }

  // App shell: cache-first, falling back to network
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => cached);
    })
  );
});
