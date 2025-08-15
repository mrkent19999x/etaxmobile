// ===== DEVICE FINGERPRINT SYSTEM =====
// File: device-fingerprint.js
// Chức năng: Tạo dấu vân tay thiết bị duy nhất và quản lý thiết bị tin cậy

class DeviceFingerprint {
  constructor() {
    this.fingerprint = null;
    this.isInitialized = false;
  }

  // 🔍 Tạo dấu vân tay thiết bị
  async generateFingerprint() {
    try {
      const components = {
        // Thông tin cơ bản
        userAgent: navigator.userAgent,
        language: navigator.language,
        languages: navigator.languages ? navigator.languages.join(',') : '',
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        
        // Thông tin màn hình
        screenWidth: screen.width,
        screenHeight: screen.height,
        screenColorDepth: screen.colorDepth,
        screenPixelDepth: screen.pixelDepth,
        
        // Thông tin timezone
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        timezoneOffset: new Date().getTimezoneOffset(),
        
        // Thông tin trình duyệt
        hardwareConcurrency: navigator.hardwareConcurrency || 0,
        maxTouchPoints: navigator.maxTouchPoints || 0,
        
        // Canvas fingerprint (unique cho mỗi thiết bị)
        canvas: this.getCanvasFingerprint(),
        
        // WebGL fingerprint
        webgl: this.getWebGLFingerprint()
      };

      // Tạo hash từ tất cả components
      const fingerString = JSON.stringify(components);
      this.fingerprint = await this.hashString(fingerString);
      this.isInitialized = true;
      
      console.log('🔍 Device fingerprint generated:', this.fingerprint.substring(0, 16) + '...');
      return this.fingerprint;
      
    } catch (error) {
      console.error('❌ Error generating fingerprint:', error);
      // Fallback fingerprint nếu có lỗi
      this.fingerprint = 'FALLBACK_' + Date.now() + '_' + Math.random().toString(36);
      return this.fingerprint;
    }
  }

  // 🎨 Canvas fingerprint
  getCanvasFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('eTax Mobile Device 🏢📱', 2, 2);
      
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillRect(100, 5, 80, 20);
      
      return canvas.toDataURL();
    } catch (error) {
      return 'canvas_error';
    }
  }

  // 🖥️ WebGL fingerprint
  getWebGLFingerprint() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) return 'no_webgl';
      
      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      
      return vendor + '|' + renderer;
    } catch (error) {
      return 'webgl_error';
    }
  }

  // 🔐 Hash string using Web Crypto API
  async hashString(str) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const hash = await crypto.subtle.digest('SHA-256', data);
      
      // Convert to hex string
      const hashArray = Array.from(new Uint8Array(hash));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch (error) {
      // Fallback hash nếu Web Crypto API không khả dụng
      return this.simpleHash(str);
    }
  }

  // 📝 Simple hash fallback
  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  // 📱 Lấy fingerprint hiện tại
  async getFingerprint() {
    if (!this.isInitialized) {
      await this.generateFingerprint();
    }
    return this.fingerprint;
  }

  // 🔄 Refresh fingerprint
  async refresh() {
    this.isInitialized = false;
    return await this.generateFingerprint();
  }
}

// ===== TRUSTED DEVICE MANAGER =====
class TrustedDeviceManager {
  constructor(firebase_db) {
    this.db = firebase_db;
    this.deviceFingerprint = new DeviceFingerprint();
  }

  // ✅ Kiểm tra thiết bị đã tin cậy
  async isDeviceTrusted(userId = null) {
    try {
      const fingerprint = await this.deviceFingerprint.getFingerprint();
      
      console.log('🔍 Checking trusted device for fingerprint:', fingerprint.substring(0, 16) + '...');
      
      // Kiểm tra trong database
      const trustedDevicesSnapshot = await this.db.ref('trustedDevices').once('value');
      const trustedDevices = trustedDevicesSnapshot.val() || {};
      
      // Tìm device theo fingerprint
      for (const deviceId in trustedDevices) {
        const device = trustedDevices[deviceId];
        if (device.fingerprint === fingerprint) {
          // Kiểm tra thêm userId nếu được cung cấp
          if (userId && device.userId !== userId) {
            continue;
          }
          
          console.log('✅ Device is trusted:', device);
          
          // Cập nhật last access time
          await this.updateLastAccess(deviceId);
          
          return {
            trusted: true,
            deviceInfo: device,
            deviceId: deviceId
          };
        }
      }
      
      console.log('❌ Device not found in trusted list');
      return { trusted: false };
      
    } catch (error) {
      console.error('❌ Error checking trusted device:', error);
      return { trusted: false, error: error.message };
    }
  }

  // 🔐 Đăng ký thiết bị tin cậy
  async registerTrustedDevice(userId, token, userInfo = {}) {
    try {
      const fingerprint = await this.deviceFingerprint.getFingerprint();
      const now = Date.now();
      
      const deviceInfo = {
        fingerprint: fingerprint,
        userId: userId,
        registeredAt: now,
        lastAccess: now,
        token: token,
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        userInfo: userInfo,
        status: 'active'
      };
      
      // Tạo device ID duy nhất
      const deviceId = 'device_' + fingerprint.substring(0, 12) + '_' + now;
      
      // Lưu vào Firebase
      await this.db.ref('trustedDevices/' + deviceId).set(deviceInfo);
      
      console.log('✅ Trusted device registered:', deviceId);
      
      // Log activity
      await this.logDeviceActivity('device_registered', deviceId, userId, {
        message: `Thiết bị mới được đăng ký tin cậy`,
        deviceInfo: deviceInfo
      });
      
      return {
        success: true,
        deviceId: deviceId,
        deviceInfo: deviceInfo
      };
      
    } catch (error) {
      console.error('❌ Error registering trusted device:', error);
      return { success: false, error: error.message };
    }
  }

  // 🗑️ Xóa thiết bị tin cậy
  async removeTrustedDevice(deviceId, adminUser = null) {
    try {
      // Lấy thông tin device trước khi xóa
      const deviceSnapshot = await this.db.ref('trustedDevices/' + deviceId).once('value');
      const deviceInfo = deviceSnapshot.val();
      
      if (!deviceInfo) {
        return { success: false, error: 'Device not found' };
      }
      
      // Xóa device
      await this.db.ref('trustedDevices/' + deviceId).remove();
      
      console.log('🗑️ Trusted device removed:', deviceId);
      
      // Log activity
      await this.logDeviceActivity('device_removed', deviceId, deviceInfo.userId, {
        message: adminUser ? 
          `Thiết bị bị xóa bởi admin: ${adminUser}` : 
          `Thiết bị tự xóa`,
        adminUser: adminUser,
        deviceInfo: deviceInfo
      });
      
      return { success: true, deviceInfo: deviceInfo };
      
    } catch (error) {
      console.error('❌ Error removing trusted device:', error);
      return { success: false, error: error.message };
    }
  }

  // 🕒 Cập nhật thời gian truy cập cuối
  async updateLastAccess(deviceId) {
    try {
      await this.db.ref('trustedDevices/' + deviceId + '/lastAccess').set(Date.now());
    } catch (error) {
      console.error('❌ Error updating last access:', error);
    }
  }

  // 📋 Lấy danh sách thiết bị tin cậy của user
  async getUserTrustedDevices(userId) {
    try {
      const snapshot = await this.db.ref('trustedDevices')
        .orderByChild('userId')
        .equalTo(userId)
        .once('value');
      
      const devices = snapshot.val() || {};
      
      return Object.entries(devices).map(([deviceId, deviceInfo]) => ({
        deviceId,
        ...deviceInfo
      }));
      
    } catch (error) {
      console.error('❌ Error getting user trusted devices:', error);
      return [];
    }
  }

  // 📊 Lấy tất cả thiết bị tin cậy (cho admin)
  async getAllTrustedDevices() {
    try {
      const snapshot = await this.db.ref('trustedDevices').once('value');
      const devices = snapshot.val() || {};
      
      return Object.entries(devices).map(([deviceId, deviceInfo]) => ({
        deviceId,
        ...deviceInfo
      }));
      
    } catch (error) {
      console.error('❌ Error getting all trusted devices:', error);
      return [];
    }
  }

  // 📝 Log hoạt động thiết bị
  async logDeviceActivity(type, deviceId, userId, details = {}) {
    try {
      await this.db.ref('deviceActivityLogs').push({
        type: type,
        deviceId: deviceId,
        userId: userId,
        timestamp: Date.now(),
        fingerprint: await this.deviceFingerprint.getFingerprint(),
        userAgent: navigator.userAgent,
        details: details
      });
    } catch (error) {
      console.error('❌ Error logging device activity:', error);
    }
  }

  // 🧹 Dọn dẹp thiết bị cũ (tùy chọn)
  async cleanupOldDevices(daysOld = 90) {
    try {
      const cutoffTime = Date.now() - (daysOld * 24 * 60 * 60 * 1000);
      const snapshot = await this.db.ref('trustedDevices').once('value');
      const devices = snapshot.val() || {};
      
      const devicesToRemove = [];
      
      for (const [deviceId, deviceInfo] of Object.entries(devices)) {
        if (deviceInfo.lastAccess < cutoffTime) {
          devicesToRemove.push(deviceId);
        }
      }
      
      // Xóa các thiết bị cũ
      for (const deviceId of devicesToRemove) {
        await this.removeTrustedDevice(deviceId, 'AUTO_CLEANUP');
      }
      
      console.log(`🧹 Cleaned up ${devicesToRemove.length} old devices`);
      return devicesToRemove.length;
      
    } catch (error) {
      console.error('❌ Error cleaning up old devices:', error);
      return 0;
    }
  }
}

// ===== GLOBAL INSTANCE =====
// Sẽ được khởi tạo sau khi Firebase ready
let trustedDeviceManager = null;