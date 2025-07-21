// ===== SERVICE WORKER CHO PWA ===== 

const CACHE_NAME = 'etax-mobile-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './pwa-safari-fix.css',
  './css/etax-template.css',
  './mobile-fixes.css',
  './mobile_responsive.css',
  './pwa-mobile.css',
  './admin-panel.html',
  './admin-panel.js',
  './device_auth_manager.js',
  './assets/logo.png'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  console.log('🔧 ServiceWorker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('✅ ServiceWorker installed successfully');
        return self.skipWaiting();
      })
  );
});

// Activate Service Worker
self.addEventListener('activate', function(event) {
  console.log('🚀 ServiceWorker activating...');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('✅ ServiceWorker activated');
      return self.clients.claim();
    })
  );
});

// Fetch Strategy: Cache First with Network Fallback
self.addEventListener('fetch', function(event) {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version if available
        if (response) {
          console.log('📦 Serving from cache:', event.request.url);
          return response;
        }

        // Otherwise fetch from network
        console.log('🌐 Fetching from network:', event.request.url);
        return fetch(event.request).then(function(response) {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone response for cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(function() {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

// Handle background sync
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Implement background sync logic here
  return Promise.resolve();
}

// Handle push notifications
self.addEventListener('push', function(event) {
  console.log('🔔 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Bạn có thông báo mới từ eTax',
    icon: './assets/logo.png',
    badge: './assets/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem chi tiết',
        icon: './assets/logo.png'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: './assets/logo.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('eTax Mobile', options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./index.html')
    );
  } else if (event.action === 'close') {
    event.notification.close();
  } else {
    event.waitUntil(
      clients.openWindow('./index.html')
    );
  }
});

// Handle message from main thread
self.addEventListener('message', function(event) {
  console.log('💬 Message received in SW:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ ServiceWorker script loaded');