const CACHE_NAME = 'etax-mobile-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/token-login.html',
  '/tra-cuu-chung-tu.html',
  '/thongbao.html',
  '/dangky.html',
  '/ho-tro-qtt.html',
  '/hoso.html',
  '/nopthue.html',
  '/nghiavu.html',
  '/tienich.html',
  '/hotro.html',
  '/thietlap.html',
  '/css/home.css',
  '/assets/logo.png',
  '/assets/nen.png',
  '/assets/slidebg.png',
  '/assets/backgrounftd.png',
  '/assets/avatar.png',
  '/assets/nutha.png',
  '/assets/2gach.png',
  '/assets/arrow-left.png',
  '/assets/arrow-right.png',
  '/assets/icon-qr.png',
  '/assets/icon-bell.png',
  '/assets/icon1.png',
  '/assets/icon2.png',
  '/assets/icon3.png',
  '/assets/icon4.png',
  '/assets/icon5.png',
  '/assets/icon6.png',
  '/assets/icon7.png',
  '/assets/icon8.png',
  '/assets/icon9.png',
  '/assets/icon10.png',
  '/assets/icon11.png',
  '/assets/icon12.png',
  '/assets/icon13.png',
  '/assets/icon14.png',
  '/assets/icon-doimk.png',
  '/assets/faceid.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.log('Cache install failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // 🔧 FIX: Skip unsupported schemes (chrome-extension, etc.)
  const url = new URL(event.request.url);
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return; // Don't handle chrome-extension:// or other schemes
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              // 🔧 FIX: Only cache http/https requests
              if (url.protocol === 'http:' || url.protocol === 'https:') {
                cache.put(event.request, responseToCache).catch(err => {
                  console.warn('Cache put failed:', err);
                });
              }
            });

          return response;
        }).catch(() => {
          // Fallback for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Handle push notifications (optional)
self.addEventListener('push', event => {
  const options = {
    body: 'Bạn có thông báo mới từ eTax Mobile',
    icon: '/assets/logo.png',
    badge: '/assets/logo.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Xem ngay',
        icon: '/assets/icon-bell.png'
      },
      {
        action: 'close',
        title: 'Đóng',
        icon: '/assets/icon-bell.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('eTax Mobile', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/thongbao.html')
    );
  }
});