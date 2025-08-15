// ===== DEVICE_AUTH_MANAGER.JS - HOÀN CHỈNH =====

class DeviceAuthManager {
  constructor() {
    // ✅ ĐỊNH NGHĨA STORAGE_KEYS TRƯỚC
    this.STORAGE_KEYS = {
      DEVICE_VERIFIED: 'etax_device_verified',
      TOKEN_VERIFIED: 'etax_token_verified', 
      USER_SESSION: 'etax_user_session',
      LOGGED_IN_USER: 'etax_logged_in_user',
      DEVICE_ID: 'etax_device_id',
      VERIFICATION_TIME: 'etax_verification_time',
      DEVICE_FINGERPRINT: 'etax_device_fingerprint'
    };
    
    // SAU ĐÓ MỚI GENERATE DEVICE ID
    this.deviceId = this.generateDeviceId();
    
    console.log('🔧 DeviceAuthManager initialized with deviceId:', this.deviceId);
  }

  // ===== DEVICE ID GENERATION =====
  generateDeviceId() {
    let deviceId = localStorage.getItem(this.STORAGE_KEYS.DEVICE_FINGERPRINT);
    
    if (!deviceId) {
      const fingerprint = [
        navigator.userAgent,
        navigator.language, 
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        navigator.platform || 'unknown',
        navigator.hardwareConcurrency || 'unknown'
      ].join('|');
      
      deviceId = 'dev_' + btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16) + '_' + Date.now().toString(36);
      localStorage.setItem(this.STORAGE_KEYS.DEVICE_FINGERPRINT, deviceId);
      console.log('🆔 Generated new device ID:', deviceId);
    }
    
    return deviceId;
  }

  // ===== DEVICE VERIFICATION CHECK =====
  isDeviceVerified() {
    const deviceVerified = localStorage.getItem(this.STORAGE_KEYS.DEVICE_VERIFIED) === 'true';
    const tokenVerified = localStorage.getItem(this.STORAGE_KEYS.TOKEN_VERIFIED) === 'true';
    const deviceId = localStorage.getItem(this.STORAGE_KEYS.DEVICE_ID);
    
    const verified = deviceVerified && tokenVerified && deviceId;
    console.log('🔍 Device verification status:', {
      deviceVerified,
      tokenVerified, 
      hasDeviceId: !!deviceId,
      overall: verified
    });
    
    return verified;
  }

  // ===== USER LOGIN CHECK =====
  isUserLoggedIn() {
    const userLoggedIn = localStorage.getItem(this.STORAGE_KEYS.LOGGED_IN_USER);
    const loginSuccess = localStorage.getItem('etax_login_success');
    
    const loggedIn = !!(userLoggedIn && loginSuccess);
    console.log('👤 User login status:', {
      hasUser: !!userLoggedIn,
      loginSuccess: loginSuccess === 'true',
      overall: loggedIn
    });
    
    return loggedIn;
  }

  // ===== GET USER SESSION =====
  getUserSession() {
    try {
      const sessionData = localStorage.getItem(this.STORAGE_KEYS.USER_SESSION);
      const userInfo = localStorage.getItem('etax_user_info');
      
      if (sessionData) {
        return JSON.parse(sessionData);
      } else if (userInfo) {
        return JSON.parse(userInfo);
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error getting user session:', error);
      return null;
    }
  }

  // ===== SAVE VERIFICATION STATUS =====
  saveVerificationStatus(token, userData) {
    try {
      const timestamp = Date.now();
      
      // Lưu device verification
      localStorage.setItem(this.STORAGE_KEYS.DEVICE_VERIFIED, 'true');
      localStorage.setItem(this.STORAGE_KEYS.TOKEN_VERIFIED, 'true');
      localStorage.setItem(this.STORAGE_KEYS.DEVICE_ID, this.deviceId);
      localStorage.setItem(this.STORAGE_KEYS.VERIFICATION_TIME, timestamp.toString());
      
      // Lưu user session nếu có
      if (userData) {
        const sessionData = {
          ...userData,
          deviceId: this.deviceId,
          verificationTime: timestamp,
          token: token
        };
        localStorage.setItem(this.STORAGE_KEYS.USER_SESSION, JSON.stringify(sessionData));
      }
      
      console.log('✅ Verification status saved successfully');
      return true;
      
    } catch (error) {
      console.error('❌ Error saving verification status:', error);
      return false;
    }
  }

  // ===== CLEAR VERIFICATION =====
  clearVerification() {
    console.log('🧹 Clearing device verification...');
    
    const keysToRemove = [
      this.STORAGE_KEYS.DEVICE_VERIFIED,
      this.STORAGE_KEYS.TOKEN_VERIFIED,
      this.STORAGE_KEYS.DEVICE_ID,
      this.STORAGE_KEYS.VERIFICATION_TIME,
      this.STORAGE_KEYS.USER_SESSION,
      'etax_verification_data'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // ===== LOGOUT USER =====
  logout() {
    console.log('👋 Logging out user...');
    
    // Chỉ xóa user session, giữ lại device verification
    const keysToRemove = [
      this.STORAGE_KEYS.LOGGED_IN_USER,
      this.STORAGE_KEYS.USER_SESSION,
      'etax_login_success',
      'etax_user_info'
    ];
    
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('✅ User logged out, device verification retained');
  }

  // ===== RESET DEVICE (FULL CLEAR) =====
  resetDevice() {
    console.log('🔄 Resetting device completely...');
    
    // Xóa tất cả dữ liệu liên quan
    const allKeys = Object.keys(localStorage);
    allKeys.forEach(key => {
      if (key.startsWith('etax_')) {
        localStorage.removeItem(key);
      }
    });
    
    // Tạo lại device ID mới
    localStorage.removeItem(this.STORAGE_KEYS.DEVICE_FINGERPRINT);
    this.deviceId = this.generateDeviceId();
    
    console.log('✅ Device reset complete, new deviceId:', this.deviceId);
  }

  // ===== PAGE ACCESS CHECK =====
  checkPageAccess(requiredAuth = 'device') {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    console.log('🔒 Checking page access:', {
      page: currentPage,
      required: requiredAuth,
      skipFlag: window.skipDeviceCheckOnLogin
    });

    // QUAN TRỌNG: Kiểm tra skip flag trước
    if (currentPage === 'login.html' && window.skipDeviceCheckOnLogin) {
      console.log('✅ Skipping page access check due to token-login redirect');
      return true;
    }

    // Kiểm tra redirect flag
    const redirectFlag = localStorage.getItem('etax_redirect_from_token_login');
    if (currentPage === 'login.html' && redirectFlag === 'true') {
      console.log('✅ Skipping page access check due to redirect flag');
      localStorage.removeItem('etax_redirect_from_token_login'); // Clear ngay sau khi dùng
      return true;
    }

    switch (requiredAuth) {
      case 'none':
        return true;

      case 'device':
        if (!this.isDeviceVerified()) {
          console.log('❌ Device not verified, redirecting to token-login');
          if (currentPage !== 'token-login.html') {
            setTimeout(() => {
              window.location.href = 'token-login.html';
            }, 500);
          }
          return false;
        }
        return true;

      case 'user':
        // QUAN TRỌNG: Skip check khi từ login redirect
        if (currentPage === 'index.html') {
          const loginRedirect = localStorage.getItem('etax_login_success');
          if (loginRedirect === 'true') {
            console.log('✅ Skipping user check for index.html (user just logged in)');
            return true;
          }
        }
        
        if (!this.isDeviceVerified()) {
          console.log('❌ Device not verified, redirecting to token-login');
          if (currentPage !== 'token-login.html') {
            setTimeout(() => {
              window.location.href = 'token-login.html';
            }, 500);
          }
          return false;
        }
        if (!this.isUserLoggedIn()) {
          console.log('❌ User not logged in, redirecting to login');
          if (currentPage !== 'login.html') {
            setTimeout(() => {
              window.location.href = 'login.html';
            }, 500);
          }
          return false;
        }
        return true;

      default:
        return true;
    }
  }

  // ===== AUTO LOGOUT TIMER =====
  setupAutoLogout(timeoutMinutes = 30) {
    let logoutTimer;
    
    const resetTimer = () => {
      clearTimeout(logoutTimer);
      
      if (this.isUserLoggedIn()) {
        logoutTimer = setTimeout(() => {
          console.log('⏰ Session timeout, auto logout');
          this.logout();
          
          if (typeof showError === 'function') {
            showError('Phiên đăng nhập đã hết hạn');
          }
          
          setTimeout(() => {
            window.location.href = 'login.html';
          }, 2000);
          
        }, timeoutMinutes * 60 * 1000);
      }
    };
    
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, resetTimer, true);
    });
    
    resetTimer();
    console.log(`⏰ Auto logout set for ${timeoutMinutes} minutes`);
  }

  // ===== DETECT PLATFORM =====
  detectPlatform() {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
    if (/android/.test(userAgent)) return 'Android';
    if (/windows/.test(userAgent)) return 'Windows';
    if (/mac/.test(userAgent)) return 'macOS';
    if (/linux/.test(userAgent)) return 'Linux';
    
    return 'Unknown';
  }

  // ===== NETWORK STATUS =====
  isOnline() {
    return navigator.onLine;
  }

  // ===== DEBUG INFO =====
  getDebugInfo() {
    return {
      deviceId: this.deviceId,
      platform: this.detectPlatform(),
      isDeviceVerified: this.isDeviceVerified(),
      isUserLoggedIn: this.isUserLoggedIn(),
      userSession: this.getUserSession(),
      verificationTime: localStorage.getItem(this.STORAGE_KEYS.VERIFICATION_TIME),
      isOnline: this.isOnline(),
      userAgent: navigator.userAgent,
      screen: `${screen.width}x${screen.height}`,
      timestamp: new Date().toISOString(),
      storageKeys: Object.keys(localStorage).filter(key => key.startsWith('etax_'))
    };
  }

  // ===== EXPORT DEBUG =====
  exportDebugInfo() {
    const info = this.getDebugInfo();
    const debugText = JSON.stringify(info, null, 2);
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(debugText).then(() => {
        console.log('📋 Debug info copied to clipboard');
      });
    }
    
    return debugText;
  }
}

// ===== KHỞI TẠO GLOBAL INSTANCE =====
function initializeDeviceAuth() {
  if (!window.deviceAuth) {
    try {
      window.deviceAuth = new DeviceAuthManager();
      console.log('✅ Global deviceAuth initialized');
    } catch (error) {
      console.error('❌ Error initializing DeviceAuth:', error);
    }
  }
}

// ===== UTILITY FUNCTIONS =====
window.isDeviceVerified = () => {
  if (!window.deviceAuth) initializeDeviceAuth();
  return window.deviceAuth ? window.deviceAuth.isDeviceVerified() : false;
};

window.isUserLoggedIn = () => {
  if (!window.deviceAuth) initializeDeviceAuth();
  return window.deviceAuth ? window.deviceAuth.isUserLoggedIn() : false;
};

window.getUserSession = () => {
  if (!window.deviceAuth) initializeDeviceAuth();
  return window.deviceAuth ? window.deviceAuth.getUserSession() : null;
};

window.checkPageAccess = (requiredAuth) => {
  if (!window.deviceAuth) initializeDeviceAuth();
  return window.deviceAuth ? window.deviceAuth.checkPageAccess(requiredAuth) : true;
};

// ===== PAGE PERMISSIONS =====
const pagePermissions = {
  'token-login.html': 'none',
  'splash.html': 'none', 
  'login.html': 'device',
  'index.html': 'user',
  'dashboard.html': 'user',
  'profile.html': 'user'
};

// ===== AUTO SETUP =====
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 eTax Mobile Device Auth initializing...');
    
    // Khởi tạo deviceAuth ngay
    initializeDeviceAuth();
    
    // Setup auto logout
    if (window.deviceAuth) {
      window.deviceAuth.setupAutoLogout(30);
    }
    
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const requiredAuth = pagePermissions[currentPage] || 'device';

    // Delay và kiểm tra kỹ trước khi redirect
    setTimeout(() => {
      // QUAN TRỌNG: Skip hoàn toàn nếu bị disable
      if (window.DISABLE_DEVICE_AUTH_MANAGER) {
        console.log('✅ Device auth manager DISABLED by page');
        return;
      }
      
      // QUAN TRỌNG: Skip cho index.html vì nó có logic check riêng
      if (currentPage === 'index.html') {
        console.log('✅ Skipping device auth check for index.html (has own logic)');
        return;
      }
      
      // Kiểm tra nếu đang ở login.html và có skip flag
      if (currentPage === 'login.html') {
        const skipFlag = window.skipDeviceCheckOnLogin;
        const redirectFlag = localStorage.getItem('etax_redirect_from_token_login');
        
        if (skipFlag || redirectFlag === 'true') {
          console.log('✅ Skipping device auth check for login page (redirect detected)');
          return;
        }
      }
      
      // Chỉ check page access nếu không có skip flags
      console.log('🔍 Running page access check for:', currentPage);
      if (window.deviceAuth) {
        window.deviceAuth.checkPageAccess(requiredAuth);
      }
      
    }, 300);
  });
} else {
  // Document đã ready
  initializeDeviceAuth();
}

// ===== EVENT HANDLERS =====
document.addEventListener('visibilitychange', function() {
  if (!document.hidden) {
    console.log('👁️ Page became visible');
  }
});

window.addEventListener('online', function() {
  console.log('🌐 Network connection restored');
});

window.addEventListener('offline', function() {
  console.log('📴 Network connection lost');
});

window.addEventListener('beforeunload', function(e) {
  if (window.deviceAuth) {
    const session = window.deviceAuth.getUserSession();
    if (session) {
      session.lastActivity = Date.now();
      localStorage.setItem('etax_user_session', JSON.stringify(session));
    }
  }
});

// ===== DEBUG FUNCTIONS =====
if (typeof window !== 'undefined') {
  window.eTaxDebug = {
    getInfo: () => {
      if (!window.deviceAuth) initializeDeviceAuth();
      return window.deviceAuth ? window.deviceAuth.getDebugInfo() : {};
    },
    export: () => {
      if (!window.deviceAuth) initializeDeviceAuth();
      return window.deviceAuth ? window.deviceAuth.exportDebugInfo() : '';
    },
    reset: () => {
      if (!window.deviceAuth) initializeDeviceAuth();
      return window.deviceAuth ? window.deviceAuth.resetDevice() : false;
    },
    clearVerification: () => {
      if (!window.deviceAuth) initializeDeviceAuth();
      return window.deviceAuth ? window.deviceAuth.clearVerification() : false;
    },
    logout: () => {
      if (!window.deviceAuth) initializeDeviceAuth();
      return window.deviceAuth ? window.deviceAuth.logout() : false;
    },
    
    testRedirect: () => {
      console.log('🧪 Testing redirect logic...');
      const info = window.eTaxDebug.getInfo();
      console.table(info);
      return info;
    },
    
    forceDeviceVerified: () => {
      console.log('🔧 Force setting device as verified...');
      if (!window.deviceAuth) initializeDeviceAuth();
      localStorage.setItem('etax_device_verified', 'true');
      localStorage.setItem('etax_token_verified', 'true');
      localStorage.setItem('etax_device_id', window.deviceAuth ? window.deviceAuth.deviceId : 'forced');
      console.log('✅ Device forced to verified state');
    }
  };
  
  console.log('🔧 Debug functions available: window.eTaxDebug');
}

console.log('✅ Device Auth Manager (Complete Version) loaded successfully!');