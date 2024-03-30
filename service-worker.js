const CACHE_NAME = 'woodex-cache-v1';


self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll([
          '/index.html',
          '/assets/css/style.css',
          '/assets/js/script.js', 
          '/icons/manifest-icon-192.maskable.png',
          '/icons/manifest-icon-512.maskable.png',
          '/assets/images/hero-product-1.jpg', 
          '/assets/images/hero-product-2.jpg',
          '/assets/images/hero-product-3.jpg',
          '/assets/images/hero-product-4.jpg',
          '/assets/images/hero-product-5.jpg'
        ]);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; 
        }
        return fetch(event.request)
          .then(response => {
            let responseClone = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseClone);
              });
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
          });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {

          return cacheName.startsWith('woodex-cache-') && cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('push', function(event) {
  if (event && event.data) {
    const data = event.data.json();
    if (data.method === "pushMessage") {
      const title = 'Woodex Furniture';
      const options = {
        body: data.message,
        icon: 'logo.png' // Path to your Woodex logo image
      };

      event.waitUntil(
        self.registration.showNotification(title, options)
      );
    }
  }
});




self.addEventListener('sync', event => {
  if (event.tag === 'helloSync') {
    console.log("helloSync [service-worker.js]");
    // Handle the sync event here
    // You can perform actions such as sending data to the server
  }
});
