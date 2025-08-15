// ===== SERVICE WORKER CHO PWA - EDITOR V2 ===== 

const CACHE_NAME = 'etax-mobile-v2.1.0';
const urlsToCache = [
  './',
  './splash.html',
  './login.html',
  './index_main.html',
  './thongtinnvt.html',
  './thongtin-chitiet.html',
  './tra-cuu-chung-tu.html',
  './css/etax-common.css',
  './css/etax-template.css',
  './manifest.json',
  './assets/logo.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install Service Worker
self.addEventListener('install', function(event) {
  console.log('🔧 ServiceWorker installing for eTax Editor V2...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Caching app shell and editor files');
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
          return caches.match('./splash.html');
        }
      })
  );
});

// Background Sync for offline functionality
self.addEventListener('sync', function(event) {
  console.log('🔄 Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  console.log('🔄 Performing background sync...');
  
  // Sync any pending data when connection is restored
  return Promise.resolve();
}

// Push notifications
self.addEventListener('push', function(event) {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Có cập nhật mới từ eTax Editor',
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
        title: 'Mở Editor',
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
    self.registration.showNotification('eTax Editor V2', options)
  );
});

// Notification click
self.addEventListener('notificationclick', function(event) {
  console.log('📱 Notification clicked:', event.action);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./admin_ultimate_editor_v2_clean.html')
    );
  }
});

console.log('✅ Service Worker for eTax Editor V2 loaded successfully!');