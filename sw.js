const CACHE_NAME='niark-v3';
const ASSETS=['./','./index.html','./manifest.webmanifest','./sw.js','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE_NAME).then(async c=>{for(const a of ASSETS){try{await c.add(a)}catch(_) {}}}))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(xs=>Promise.all(xs.map(x=>x===CACHE_NAME?null:caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(u.origin!==location.origin)return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(n=>{if(n.ok)caches.open(CACHE_NAME).then(c=>c.put(e.request,n.clone()));return n}).catch(()=>caches.match('./index.html'))))});
