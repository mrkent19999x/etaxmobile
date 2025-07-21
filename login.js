// ===== LOGIN.JS - FIXED VERSION - KHẮC PHỤC VÒNG LẶP =====

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
let trustedDeviceManager;
let isRedirectFromTokenLogin = false;

// ===== MAIN INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  console.log('=== FIXED LOGIN PAGE - NO INFINITE LOOP ===');
  initializeLoginPage();
});

// ===== INITIALIZE LOGIN PAGE =====
async function initializeLoginPage() {
  try {
    // 🔧 BƯỚC 1: KIỂM TRA FLAGS NGAY LẬP TỨC
    checkRedirectFlags();
    
    // 🔧 BƯỚC 2: KHỞI TẠO DEVICE MANAGER
    trustedDeviceManager = new TrustedDeviceManager(db);
    
    // 🔧 BƯỚC 3: CHỈ KIỂM TRA AUTH NẾU KHÔNG PHẢI TỪ TOKEN-LOGIN
    if (!isRedirectFromTokenLogin) {
      console.log('🔍 Normal access - checking authentication...');
      await checkAuthenticationSafely();
    } else {
      console.log('✅ Redirect from token-login - SKIP auth check');
      showMessage('✅ Thiết bị đã được xác thực! Vui lòng đăng nhập.', 'success');
    }
    
    // 🔧 BƯỚC 4: SETUP FORM
    setupLoginForm();
    
  } catch (error) {
    console.error('❌ Login page initialization failed:', error);
    showMessage('Lỗi khởi tạo trang đăng nhập', 'error');
  }
}

// ===== KIỂM TRA REDIRECT FLAGS (QUAN TRỌNG!) =====
function checkRedirectFlags() {
  // Kiểm tra nhiều loại flag
  const redirectFlag = localStorage.getItem('etax_redirect_from_token_login');
  const deviceVerificationComplete = localStorage.getItem('etax_device_verification_complete');
  const skipDeviceCheck = localStorage.getItem('etax_skip_device_check');
  const windowFlag = window.skipDeviceCheckOnLogin;
  
  console.log('🔍 Checking redirect flags:', {
    redirectFlag,
    deviceVerificationComplete,
    skipDeviceCheck,
    windowFlag
  });
  
  // Nếu có BẤT KỲ flag nào từ token-login → skip authentication
  if (redirectFlag === 'true' || 
      deviceVerificationComplete === 'true' || 
      skipDeviceCheck === 'true' || 
      windowFlag === true) {
    
    isRedirectFromTokenLogin = true;
    console.log('🔄 DETECTED: Redirect from token-login → Skip device check');
    
    // Xóa TẤT CẢ flags để tránh ảnh hưởng lần sau
    localStorage.removeItem('etax_redirect_from_token_login');
    localStorage.removeItem('etax_device_verification_complete');
    localStorage.removeItem('etax_skip_device_check');
    window.skipDeviceCheckOnLogin = false;
  }
}

// ===== AUTHENTICATION CHECK AN TOÀN (KHÔNG REDIRECT VÔ TẬN) =====
async function checkAuthenticationSafely() {
  try {
    const userLoggedIn = localStorage.getItem('etax_logged_in_user');
    const loginSuccess = localStorage.getItem('etax_login_success');
    
    console.log('🔍 Authentication status:', {
      userLoggedIn: !!userLoggedIn,
      loginSuccess: !!loginSuccess
    });
    
    // Nếu user đã đăng nhập → redirect về index
    if (userLoggedIn && loginSuccess) {
      console.log('✅ User already logged in → redirect to index');
      showMessage('Đã đăng nhập, đang chuyển hướng...', 'info');
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
      return;
    }
    
    // Kiểm tra device trust NHƯNG KHÔNG TỰ ĐỘNG REDIRECT
    console.log('🔍 Checking device trust...');
    const deviceCheck = await trustedDeviceManager.isDeviceTrusted();
    
    if (!deviceCheck.trusted) {
      console.log('⚠️ Device not trusted - but NOT auto-redirecting');
      showMessage('⚠️ Thiết bị chưa được xác thực. Vui lòng xác thực thiết bị trước khi đăng nhập.', 'warning');
      
      // HIỂN THỊ BUTTON ĐỂ USER TỰ CHỌN
      showDeviceAuthPrompt();
      return;
    }
    
    console.log('✅ Device is trusted → ready for login');
    showMessage('Thiết bị đã được tin cậy. Vui lòng đăng nhập.', 'info');
    
  } catch (error) {
    console.error('❌ Authentication check failed:', error);
    showMessage('Lỗi kiểm tra xác thực: ' + error.message, 'error');
  }
}

// ===== HIỂN THỊ PROMPT XÁC THỰC THIẾT BỊ =====
function showDeviceAuthPrompt() {
  const promptHtml = `
    <div id="deviceAuthPrompt" style="
      background: rgba(255, 152, 0, 0.1);
      border: 1px solid #ff9800;
      border-radius: 8px;
      padding: 16px;
      margin: 16px 0;
      text-align: center;
    ">
      <p style="margin-bottom: 12px; color: #ff9800;">
        ⚠️ Thiết bị chưa được xác thực
      </p>
      <button onclick="redirectToTokenLogin()" style="
        background: #ff9800;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
      ">Xác thực thiết bị</button>
      <button onclick="dismissPrompt()" style="
        background: transparent;
        color: #ff9800;
        border: 1px solid #ff9800;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">Bỏ qua</button>
    </div>
  `;
  
  const container = document.querySelector('.container') || document.body;
  container.insertAdjacentHTML('afterbegin', promptHtml);
}

// ===== REDIRECT ĐẾN TOKEN-LOGIN (CHỈ KHI USER CLICK) =====
function redirectToTokenLogin() {
  console.log('🔄 User manually requesting device auth');
  window.location.href = 'token-login.html';
}

// ===== DISMISS PROMPT =====
function dismissPrompt() {
  const prompt = document.getElementById('deviceAuthPrompt');
  if (prompt) {
    prompt.remove();
  }
  showMessage('Bạn có thể đăng nhập với tài khoản có sẵn hoặc xác thực thiết bị sau.', 'info');
}

// ===== SETUP LOGIN FORM =====
function setupLoginForm() {
  console.log('🎨 Setting up login form...');
  
  // Focus vào ô MST
  const taxIdInput = document.getElementById("tax-id");
  if (taxIdInput) {
    setTimeout(() => taxIdInput.focus(), 100);
  }
  
  // Setup Enter key handlers
  const passwordInput = document.getElementById("password");
  if (passwordInput) {
    passwordInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        login();
      }
    });
  }
  
  if (taxIdInput) {
    taxIdInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (passwordInput) passwordInput.focus();
      }
    });
  }
  
  // Prevent form submission
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      login();
    });
  });
  
  console.log('✅ Login form setup complete');
}

// ===== LOGIN FUNCTION =====
async function login() {
  const taxId = document.getElementById("tax-id")?.value?.trim();
  const password = document.getElementById("password")?.value?.trim();
  
  if (!taxId || !password) {
    showMessage('Vui lòng nhập đầy đủ thông tin', 'error');
    return;
  }
  
  // Hiển thị loading
  const loginBtn = document.querySelector('.btn-login');
  if (loginBtn) {
    loginBtn.classList.add('loading');
    loginBtn.textContent = 'Đang đăng nhập...';
  }
  
  try {
    console.log('🔐 Attempting login for:', taxId);
    
    // Kiểm tra thông tin đăng nhập
    const userRef = db.ref('taxpayers/' + taxId);
    const snapshot = await userRef.once('value');
    
    if (!snapshot.exists()) {
      throw new Error('Mã số thuế không tồn tại');
    }
    
    const userData = snapshot.val();
    if (userData.password !== password) {
      throw new Error('Mật khẩu không chính xác');
    }
    
    // Đăng nhập thành công
    console.log('✅ Login successful');
    
    // Lưu thông tin user
    localStorage.setItem('etax_logged_in_user', taxId);
    localStorage.setItem('etax_login_success', 'true');
    localStorage.setItem('etax_user_data', JSON.stringify(userData));
    
    // Cập nhật last login
    await userRef.update({
      lastLogin: Date.now(),
      lastLoginIP: await getClientIP()
    });
    
    // Redirect đến trang chính
    showMessage('Đăng nhập thành công!', 'success');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
    
  } catch (error) {
    console.error('❌ Login failed:', error);
    showMessage('Lỗi đăng nhập: ' + error.message, 'error');
  } finally {
    // Xóa loading state
    if (loginBtn) {
      loginBtn.classList.remove('loading');
      loginBtn.textContent = 'Đăng nhập';
    }
  }
}

// ===== HELPER FUNCTIONS =====
async function getClientIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    return 'unknown';
  }
}

// ===== MESSAGE DISPLAY =====
function showMessage(text, type = 'info') {
  // Xóa message cũ
  const oldMessage = document.querySelector('.message');
  if (oldMessage) oldMessage.remove();
  
  // Tạo message mới
  const message = document.createElement('div');
  message.className = `message ${type}-msg`;
  message.textContent = text;
  message.style.display = 'block';
  
  // Thêm vào DOM
  const container = document.querySelector('.container') || document.body;
  container.insertBefore(message, container.firstChild);
  
  // Tự động ẩn sau 5 giây
  setTimeout(() => {
    if (message.parentNode) {
      message.remove();
    }
  }, 5000);
}

// ===== COMPATIBILITY FUNCTIONS =====
function showError(message) { showMessage(message, 'error'); }
function showSuccess(message) { showMessage(message, 'success'); }
function showInfo(message) { showMessage(message, 'info'); }
function showWarning(message) { showMessage(message, 'warning'); }

console.log('✅ Fixed login.js loaded - No infinite loop!');