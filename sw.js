const cacheName = "pronunciation-v1-20190826-6";
const staticAssets = [
    "/index.html",
    "/css/styles.css",
    "/js/jquery-3.4.1.min.js",
    "/app.js"
];

self.addEventListener("install", async event => {
    const cache = await caches.open(cacheName);
    //await cache.addAll(staticAssets);
});

self.addEventListener("fetch", event => {
    console.log(event.request.url);
    const req = event.request;
    if (staticAssets.includes(req.url)) {
        console.log("Hi");
    } else {
        console.log(req.url);
    }
    if (/.*(json)$/.test(req.url)) {
        event.respondWith(networkFirst(req));
    } else {
        event.respondWith(cacheFirst(req));
    }
});

async function networkFirst(req) {
    const cache = await caches.open(cacheName);
    try { 
        const fresh = await fetch(req);
        cache.put(req, fresh.clone());
        return fresh;
    } catch (e) { 
        const cachedResponse = await cache.match(req);
        return cachedResponse;
    }
}

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(req);
    return cachedResponse || networkFirst(req);
}
