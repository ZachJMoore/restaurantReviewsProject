console.log("sw started");
let staticCacheName = "cache-v4";
let itemsToCache = [
    "/",
    "index.html",
    "restaurant.html",
    "css/styles.css",
    "js/main.js",
    "js/dbhelper.js",
    "js/restaurant_info.js",
    "img/1.jpg",
    "img/2.jpg",
    "img/3.jpg",
    "img/4.jpg",
    "img/5.jpg",
    "img/6.jpg",
    "img/7.jpg",
    "img/8.jpg",
    "img/9.jpg",
    "img/10.jpg",
    "data/restaurants.json",
    "https://fonts.gstatic.com/s/roboto/v18/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2"
];

//cache everything in itemsToCache
self.addEventListener("install", function (event) {
    console.log("SW installed");
    event.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            return cache.addAll(itemsToCache);
        })
    );
});

//delete all the old caches
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    return cacheName.startsWith("cache-") &&
                        cacheName != staticCacheName;
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

//use cached items or fetch from the network
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});

//skip waiting if message is sent to sw
self.addEventListener("message", (event) => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }

});
