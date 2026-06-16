const CACHE = 'kumamoto-v3';
const URLS = ['/', '/day1', '/day2', '/day3', '/day4', '/map', '/weather', '/tickets', '/expenses', '/calendar', '/manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(URLS))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(new Request(e.request, { redirect: 'follow' })).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, clone));
      return res;
    }))
  );
});
