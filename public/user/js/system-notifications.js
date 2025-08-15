/**
 * 📢 SYSTEM NOTIFICATIONS MODULE
 * Hiển thị thông báo hệ thống trên tất cả trang con eTax Mobile
 * Auto-sync với Firebase realtime
 */

class SystemNotifications {
  constructor() {
    this.firebase = null;
    this.db = null;
    this.notificationsContainer = null;
    this.activeNotifications = [];
    
    this.init();
  }

  // 🚀 Khởi tạo
  async init() {
    try {
      await this.initFirebase();
      this.createNotificationContainer();
      this.loadActiveNotifications();
      this.startRealtimeListener();
      
      console.log('✅ System Notifications initialized successfully');
    } catch (error) {
      console.error('❌ System Notifications init error:', error);
    }
  }

  // 🔥 Khởi tạo Firebase
  async initFirebase() {
    // Kiểm tra nếu Firebase đã được load
    if (typeof firebase === 'undefined') {
      // Động loading Firebase nếu chưa có
      await this.loadFirebaseSDK();
    }

    const firebaseConfig = {
      apiKey: "AIzaSyD_rJgBFgBulheVenQUE2KXr4PBpSpTCxw",
      authDomain: "etax-7fbf8.firebaseapp.com",
      databaseURL: "https://etax-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "etax-7fbf8",
      storageBucket: "etax-7fbf8.appspot.com",
      messagingSenderId: "1030026724634",
      appId: "1:1030026724634:web:d76f5f9dad43bad6fd58a3",
      measurementId: "G-YS5DLECJE6"
    };

    // Chỉ initialize nếu chưa có app nào
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    
    this.db = firebase.database();
  }

  // 📦 Load Firebase SDK nếu chưa có
  loadFirebaseSDK() {
    return new Promise((resolve, reject) => {
      if (typeof firebase !== 'undefined') {
        resolve();
        return;
      }

      const script1 = document.createElement('script');
      script1.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js';
      script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://www.gstatic.com/firebasejs/9.22.2/firebase-database-compat.js';
        script2.onload = resolve;
        script2.onerror = reject;
        document.head.appendChild(script2);
      };
      script1.onerror = reject;
      document.head.appendChild(script1);
    });
  }

  // 🎨 Tạo container hiển thị thông báo
  createNotificationContainer() {
    // Tạo container cho thông báo
    this.notificationsContainer = document.createElement('div');
    this.notificationsContainer.id = 'systemNotificationsContainer';
    this.notificationsContainer.innerHTML = `
      <style>
        #systemNotificationsContainer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 999999;
          pointer-events: none;
        }
        
        .system-notification {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          color: white;
          padding: 12px 20px;
          margin: 0;
          box-shadow: 0 2px 10px rgba(220, 53, 69, 0.3);
          pointer-events: auto;
          font-family: 'Segoe UI', 'Tahoma', 'Microsoft Sans Serif', 'Arial', sans-serif;
          font-size: 14px;
          line-height: 1.4;
          animation: slideDown 0.5s ease-out;
        }
        
        .system-notification.maintenance {
          background: linear-gradient(135deg, #ffc107 0%, #e0a800 100%);
          color: #333;
        }
        
        .system-notification.announcement {
          background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
        }
        
        .system-notification.urgent {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
          animation: urgentBlink 1s infinite alternate;
        }
        
        .system-notification.update {
          background: linear-gradient(135deg, #28a745 0%, #218838 100%);
        }
        
        .system-notification.holiday {
          background: linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%);
        }
        
        .notification-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .notification-text {
          flex: 1;
          margin-right: 15px;
        }
        
        .notification-title {
          font-weight: 700;
          margin-bottom: 4px;
          font-size: 15px;
        }
        
        .notification-message {
          opacity: 0.95;
          font-size: 13px;
        }
        
        .notification-time {
          font-size: 11px;
          opacity: 0.8;
          white-space: nowrap;
          margin-left: 15px;
        }
        
        .notification-close {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: inherit;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          margin-left: 10px;
          transition: background 0.3s;
        }
        
        .notification-close:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        @keyframes urgentBlink {
          from { opacity: 1; }
          to { opacity: 0.8; }
        }
        
        /* 📱 RESPONSIVE */
        @media (max-width: 768px) {
          .system-notification {
            padding: 15px;
            font-size: 13px;
          }
          
          .notification-content {
            flex-direction: column;
            text-align: center;
          }
          
          .notification-time {
            margin: 8px 0 0 0;
          }
          
          .notification-close {
            position: absolute;
            top: 8px;
            right: 8px;
          }
        }
      </style>
    `;
    
    // Thêm vào đầu body
    document.body.insertBefore(this.notificationsContainer, document.body.firstChild);
  }

  // 📊 Load thông báo đang active
  async loadActiveNotifications() {
    try {
      const snapshot = await this.db.ref('systemNotifications')
        .orderByChild('status')
        .equalTo('active')
        .once('value');
      
      const now = new Date();
      const notifications = [];
      
      snapshot.forEach(child => {
        const notif = child.val();
        const startDateTime = new Date(notif.startDate + 'T' + notif.startTime);
        const endDateTime = notif.endDate ? new Date(notif.endDate + 'T' + notif.endTime) : null;
        
        // Kiểm tra thời gian hiển thị
        if (now >= startDateTime && (!endDateTime || now <= endDateTime)) {
          notifications.push({
            id: child.key,
            ...notif
          });
        }
      });
      
      // Sắp xếp theo độ ưu tiên
      notifications.sort((a, b) => {
        const priorityOrder = { critical: 3, high: 2, normal: 1 };
        return (priorityOrder[b.priority] || 1) - (priorityOrder[a.priority] || 1);
      });
      
      this.activeNotifications = notifications;
      this.renderNotifications();
      
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    }
  }

  // 🔄 Realtime listener cho thay đổi
  startRealtimeListener() {
    this.db.ref('systemNotifications').on('value', (snapshot) => {
      // Reload notifications khi có thay đổi
      setTimeout(() => {
        this.loadActiveNotifications();
      }, 1000); // Delay nhỏ để tránh spam
    });
  }

  // 🎨 Render thông báo
  renderNotifications() {
    const container = this.notificationsContainer;
    
    // Xóa thông báo cũ (trừ style)
    const existingNotifications = container.querySelectorAll('.system-notification');
    existingNotifications.forEach(el => el.remove());
    
    // Render thông báo mới
    this.activeNotifications.forEach((notif, index) => {
      const notificationEl = this.createNotificationElement(notif, index);
      container.appendChild(notificationEl);
    });
    
    // Adjust body padding để tránh che nội dung
    this.adjustBodyPadding();
  }

  // 🏗️ Tạo element thông báo
  createNotificationElement(notif, index) {
    const div = document.createElement('div');
    div.className = `system-notification ${notif.type}`;
    div.setAttribute('data-notification-id', notif.id);
    
    const typeIcons = {
      maintenance: '🔧',
      announcement: '📢',
      urgent: '🚨',
      update: '📱',
      holiday: '🎉'
    };
    
    const icon = typeIcons[notif.type] || '📢';
    const timeStr = new Date(notif.createdAt).toLocaleString('vi-VN');
    
    div.innerHTML = `
      <div class="notification-content">
        <div class="notification-text">
          <div class="notification-title">${icon} ${notif.title}</div>
          <div class="notification-message">${notif.content}</div>
        </div>
        <div class="notification-time">${timeStr}</div>
        <button class="notification-close" onclick="systemNotifications.hideNotification('${notif.id}')" title="Ẩn thông báo">×</button>
      </div>
    `;
    
    return div;
  }

  // 👁️ Ẩn thông báo
  hideNotification(notificationId) {
    const element = document.querySelector(`[data-notification-id="${notificationId}"]`);
    if (element) {
      element.style.animation = 'slideDown 0.3s ease-in reverse';
      setTimeout(() => {
        element.remove();
        this.adjustBodyPadding();
      }, 300);
    }
    
    // Lưu vào localStorage để không hiển thị lại trong session
    const hiddenNotifications = JSON.parse(localStorage.getItem('hiddenSystemNotifications') || '[]');
    if (!hiddenNotifications.includes(notificationId)) {
      hiddenNotifications.push(notificationId);
      localStorage.setItem('hiddenSystemNotifications', JSON.stringify(hiddenNotifications));
    }
  }

  // 📏 Điều chỉnh padding body
  adjustBodyPadding() {
    const container = this.notificationsContainer;
    const notifications = container.querySelectorAll('.system-notification');
    const totalHeight = Array.from(notifications).reduce((sum, el) => sum + el.offsetHeight, 0);
    
    // Thêm padding-top cho body để tránh che nội dung
    if (totalHeight > 0) {
      document.body.style.paddingTop = `${totalHeight}px`;
    } else {
      document.body.style.paddingTop = '';
    }
  }

  // 🧹 Cleanup khi trang unload
  destroy() {
    if (this.db) {
      this.db.ref('systemNotifications').off();
    }
    
    if (this.notificationsContainer) {
      this.notificationsContainer.remove();
    }
    
    document.body.style.paddingTop = '';
  }
}

// 🚀 Auto-initialize khi DOM ready
let systemNotifications = null;

function initSystemNotifications() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      systemNotifications = new SystemNotifications();
    });
  } else {
    systemNotifications = new SystemNotifications();
  }
}

// Cleanup khi trang unload
window.addEventListener('beforeunload', () => {
  if (systemNotifications) {
    systemNotifications.destroy();
  }
});

// 🎯 INIT
initSystemNotifications();