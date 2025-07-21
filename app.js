// ===== APP.JS CẢI TIẾN - INDEX.HTML =====
// Thay thế hoàn toàn nội dung app.js hiện tại

// ===== AUTHENTICATION CHECK WITH DEVICE FINGERPRINT =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== IMPROVED INDEX PAGE DEBUG ===');
  initializeSecuritySystems();
});

// ===== SECURITY INITIALIZATION =====
async function initializeSecuritySystems() {
  try {
    // Initialize trusted device manager
    window.trustedDeviceManager = new TrustedDeviceManager(db);
    
    // Run authentication checks
    await performAdvancedAuthentication();
    
    // Initialize page if authenticated
    initializePage();
    
  } catch (error) {
    console.error('❌ Security initialization failed:', error);
    handleAuthenticationFailure('security_init_failed');
  }
}

// ===== ADVANCED AUTHENTICATION LOGIC =====
async function performAdvancedAuthentication() {
  console.log('🔐 Starting advanced authentication...');
  
  const userLoggedIn = localStorage.getItem('etax_logged_in_user');
  const loginSuccess = localStorage.getItem('etax_login_success');
  
  // Check if user has valid session
  if (userLoggedIn && loginSuccess) {
    console.log('✅ User has valid session, verifying device...');
    
    // Verify device is still trusted
    const deviceCheck = await window.trustedDeviceManager.isDeviceTrusted(userLoggedIn);
    
    if (deviceCheck.trusted) {
      console.log('✅ Device verification passed');
      
      // Update last access time
      await window.trustedDeviceManager.updateLastAccess(deviceCheck.deviceId);
      
      // Set verified flags
      localStorage.setItem('etax_token_verified', 'true');
      localStorage.setItem('etax_device_verified', 'true');
      localStorage.setItem('etax_device_id', deviceCheck.deviceId);
      
      return; // Authentication successful
    } else {
      console.log('⚠️ Device no longer trusted, clearing session');
      clearUserSession();
    }
  }
  
  // Check if device is trusted (without user context)
  const deviceCheck = await window.trustedDeviceManager.isDeviceTrusted();
  
  if (deviceCheck.trusted) {
    console.log('✅ Device is trusted, but user not logged in');
    
    // Set device verified flag but still need user login
    localStorage.setItem('etax_token_verified', 'true');
    localStorage.setItem('etax_device_verified', 'true');
    localStorage.setItem('etax_device_id', deviceCheck.deviceId);
    
    // Redirect to login (skip token-login)
    console.log('🔄 Redirecting to login page');
    window.location.href = 'login.html';
    return;
  }
  
  // Device not trusted - need token verification
  console.log('❌ Device not trusted, redirecting to token-login');
  window.location.href = 'token-login.html';
}

// ===== SESSION MANAGEMENT =====
function clearUserSession() {
  console.log('🧹 Clearing user session');
  
  // Keep device verification if device is still trusted
  const deviceVerified = localStorage.getItem('etax_device_verified');
  const tokenVerified = localStorage.getItem('etax_token_verified');
  const deviceId = localStorage.getItem('etax_device_id');
  
  // Clear all localStorage
  localStorage.clear();
  
  // Restore device verification if it was valid
  if (deviceVerified === 'true' && tokenVerified === 'true' && deviceId) {
    localStorage.setItem('etax_device_verified', 'true');
    localStorage.setItem('etax_token_verified', 'true');
    localStorage.setItem('etax_device_id', deviceId);
  }
}

// ===== AUTHENTICATION FAILURE HANDLER =====
function handleAuthenticationFailure(reason) {
  console.log('❌ Authentication failed:', reason);
  
  // Log failure for security monitoring
  try {
    db.ref('securityLogs').push({
      type: 'auth_failure',
      reason: reason,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });
  } catch (error) {
    console.warn('Could not log security event:', error);
  }
  
  // Clear session and redirect
  localStorage.clear();
  
  switch (reason) {
    case 'device_not_trusted':
      window.location.href = 'token-login.html';
      break;
    case 'user_not_found':
    case 'session_expired':
      window.location.href = 'login.html';
      break;
    default:
      window.location.href = 'token-login.html';
  }
}

// ===== FIREBASE CONFIGURATION =====
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

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== GLOBAL VARIABLES =====
let user = {};

// ===== AUTO TOKEN CHECK (Enhanced) =====
async function checkAutoToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const autoToken = urlParams.get('autoToken');
  
  if (autoToken) {
    console.log('🔑 Auto token detected, processing...', autoToken.substring(0, 20) + '...');
    
    showNotification('🔑 Đang xác thực tự động...', 'info');
    
    try {
      // Verify auto token
      const tokenSnapshot = await db.ref('deviceTokens/' + autoToken).once('value');
      
      if (tokenSnapshot.exists()) {
        const tokenData = tokenSnapshot.val();
        
        if (tokenData.status === 'active' && (!tokenData.expiresAt || Date.now() < tokenData.expiresAt)) {
          // Auto token is valid, register device
          const registrationResult = await window.trustedDeviceManager.registerTrustedDevice(
            tokenData.userId,
            autoToken,
            { registrationMethod: 'auto_token' }
          );
          
          if (registrationResult.success) {
            console.log('✅ Auto token registration successful');
            
            // Deactivate token
            await db.ref('deviceTokens/' + autoToken + '/status').set('used');
            await db.ref('deviceTokens/' + autoToken + '/usedAt').set(Date.now());
            
            // Set verification flags
            localStorage.setItem('etax_token_verified', 'true');
            localStorage.setItem('etax_device_verified', 'true');
            localStorage.setItem('etax_device_id', registrationResult.deviceId);
            
            showNotification('✅ Xác thực tự động thành công!', 'success');
            
            // Redirect to login
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 2000);
            
            return;
          }
        }
      }
      
      console.log('❌ Auto token invalid or expired');
      showNotification('❌ Token tự động không hợp lệ', 'error');
      
    } catch (error) {
      console.error('❌ Auto token error:', error);
      showNotification('❌ Lỗi xác thực tự động', 'error');
    }
    
    // Remove parameter from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// ===== INITIALIZE PAGE =====
function initializePage() {
  // Load user info from localStorage
  const userInfo = localStorage.getItem("etax_user_info");
  if (userInfo) {
    try {
      user = JSON.parse(userInfo);
      document.getElementById("user-mst").innerText = "MST: " + (user.mst || "...");
      document.getElementById("user-name").innerText = user.name || "(Chưa đăng nhập)";
      
      if (document.getElementById("slide-username")) {
        document.getElementById("slide-username").innerText = user.name || "...";
      }
    } catch (error) {
      console.error('Error parsing user info:', error);
      user = {};
    }
  }
  
  console.log('User object loaded:', user);

  // Setup event listeners
  setupEventListeners();
  
  // Check auto token
  checkAutoToken();
  
  // Update device last access
  updateDeviceLastAccess();
  
  console.log('✅ Page initialized successfully');
}

// ===== UPDATE DEVICE LAST ACCESS =====
async function updateDeviceLastAccess() {
  try {
    const deviceId = localStorage.getItem('etax_device_id');
    if (deviceId && window.trustedDeviceManager) {
      await window.trustedDeviceManager.updateLastAccess(deviceId);
      console.log('📱 Device last access updated');
    }
  } catch (error) {
    console.warn('Could not update device last access:', error);
  }
}

// ===== NAVIGATION FUNCTIONS =====
function openMenu() {
  document.getElementById("slideMenu").classList.add("open");
  document.getElementById("menuOverlay").classList.add("show");
  document.getElementById("slide-username").innerText = user.name || "...";
}

function closeMenu() {
  document.getElementById("slideMenu").classList.remove("open");
  document.getElementById("menuOverlay").classList.remove("show");
}

// ===== ENHANCED LOGOUT =====
function logout() {
  if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
    // Log device activity
    logDeviceActivity('user_logout');
    
    // Clear user session but keep device verification
    clearUserSession();
    
    showNotification('Đã đăng xuất thành công!', 'success');
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  }
}

// ===== DEVICE ACTIVITY LOGGING =====
async function logDeviceActivity(activityType, details = {}) {
  try {
    const deviceId = localStorage.getItem('etax_device_id');
    
    if (deviceId && window.trustedDeviceManager) {
      await window.trustedDeviceManager.logDeviceActivity(
        activityType,
        deviceId,
        user.mst || 'unknown',
        {
          timestamp: Date.now(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          ...details
        }
      );
    }
  } catch (error) {
    console.warn('Could not log device activity:', error);
  }
}

// ===== SECURITY MONITORING =====
function startSecurityMonitoring() {
  // Monitor page visibility changes
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      console.log('👁️ Page became visible, checking security...');
      logDeviceActivity('page_focus');
      updateDeviceLastAccess();
    } else {
      logDeviceActivity('page_blur');
    }
  });
  
  // Monitor online/offline status
  window.addEventListener('online', function() {
    console.log('🌐 Back online');
    logDeviceActivity('network_online');
    updateDeviceLastAccess();
  });
  
  window.addEventListener('offline', function() {
    console.log('📴 Gone offline');
    logDeviceActivity('network_offline');
  });
  
  // Monitor page unload
  window.addEventListener('beforeunload', function() {
    logDeviceActivity('page_unload');
  });
  
  console.log('🛡️ Security monitoring started');
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
  // Start security monitoring
  startSecurityMonitoring();
  
  // Existing event listeners...
  console.log('📡 Event listeners setup complete');
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
  // Create notification element if doesn't exist
  let notification = document.getElementById('app-notification');
  if (!notification) {
    notification = document.createElement('div');
    notification.id = 'app-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      max-width: 300px;
      padding: 15px;
      border-radius: 8px;
      color: white;
      font-weight: bold;
      z-index: 10000;
      transform: translateX(350px);
      transition: transform 0.3s ease;
    `;
    document.body.appendChild(notification);
  }
  
  // Set message and style based on type
  notification.textContent = message;
  
  const colors = {
    info: '#2196F3',
    success: '#4CAF50',
    error: '#f44336',
    warning: '#FF9800'
  };
  
  notification.style.backgroundColor = colors[type] || colors.info;
  
  // Show notification
  notification.style.transform = 'translateX(0)';
  
  // Hide after 5 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(350px)';
  }, 5000);
}

function getUserAgent() {
  return {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    cookieEnabled: navigator.cookieEnabled,
    onLine: navigator.onLine
  };
}

// ===== PAGE READY =====
console.log('🚀 Improved app.js loaded successfully');