const VERSION = "1.0.0";

const APP_CACHE_NAME = 'harsensor-app';
const STATIC_CACHE_NAME = 'hs-static';

//rotas dos arquivos estáticos
const CACHE_STATIC = [
    '/css/jquery.mobile-1.4.5.css',
    '/image/icon-256x256.png',
    '/image/icon-192x192.png',
    '/image/icon-384x384.png',
    '/image/icon-512x512.png',
    '/img/logo.png',
 ];

//rotas das paginas do site
 const CACHE_APP = [
    '/',
    '/www',
    
  
 ];

self.addEventListener('install',function(e){
    e.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE_NAME),
            caches.open(APP_CACHE_NAME),
            self.skipWaiting()
          ]).then(function(storage){
            var static_cache = storage[0];
            var app_cache = storage[1];
            return Promise.all([
              static_cache.addAll(CACHE_STATIC),
              app_cache.addAll(CACHE_APP)]);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then(function(cacheNames) {
                return Promise.all(
                    cacheNames.map(function(cacheName) {
                        if (cacheName !== APP_CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
                            console.log('deleting',cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

this.addEventListener('fetch', function(event) {
  var response;
  event.respondWith(caches.match(event.request)
    .then(function (match) {
      return match || fetch(event.request);
    }).catch(function() {
      return fetch(event.request);
    })
    .then(function(r) {
      response = r;
      caches.open(APP_CACHE_NAME).then(function(cache) {
        cache.put(event.request, response);
      });
      return response.clone();
    })
  );
});
