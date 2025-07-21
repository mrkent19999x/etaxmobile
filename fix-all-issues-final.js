const fs = require('fs');
const path = require('path');

console.log('🔧 Sửa tất cả vấn đề cuối cùng...');

// 1. Sửa thông báo - tab 2 màu cam
console.log('📋 Sửa tab 2 thông báo sang màu cam...');
const thongbaoPath = path.join(__dirname, 'thongbao.html');
let thongbaoContent = fs.readFileSync(thongbaoPath, 'utf8');

// Thêm CSS cho tab màu cam
const tabOrangeCSS = `
.tab-orange {
    background: rgba(255, 165, 0, 0.8) !important; /* Màu cam */
}`;

thongbaoContent = thongbaoContent.replace(
    '</style>',
    `${tabOrangeCSS}
</style>`
);

// Đổi tab 2 sang màu cam
thongbaoContent = thongbaoContent.replace(
    '<div class="tab-item">',
    '<div class="tab-item tab-orange">'
);

fs.writeFileSync(thongbaoPath, thongbaoContent, 'utf8');
console.log('✅ Đã sửa tab 2 thông báo sang màu cam');

// 2. Sửa hỗ trợ quyết toán - grid 4 xóa link sai
console.log('🔗 Sửa link grid 4 hỗ trợ quyết toán...');
const hotroqttPath = path.join(__dirname, 'ho-tro-qtt.html');
let hotroqttContent = fs.readFileSync(hotroqttPath, 'utf8');

// Xóa link sai ở grid 4, thay bằng #
hotroqttContent = hotroqttContent.replace(
    /onclick="window\.location\.href='thaydoittdkthue\.html'"/g,
    'onclick="#"'
);

fs.writeFileSync(hotroqttPath, hotroqttContent, 'utf8');
console.log('✅ Đã xóa link sai ở grid 4 hỗ trợ quyết toán');

// 3. Sửa thiết lập cá nhân - icon size và màu chuẩn
console.log('🎨 Sửa thiết lập cá nhân - icon size và màu...');
const thietlapPath = path.join(__dirname, 'thietlap.html');
let thietlapContent = fs.readFileSync(thietlapPath, 'utf8');

// Đọc hoadondt.html để lấy chuẩn màu
const hoadondtPath = path.join(__dirname, 'hoadondt.html');
const hoadondtContent = fs.readFileSync(hoadondtPath, 'utf8');

// Tạo lại thiết lập với layout đúng
const thietlapCleanContent = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<!-- PWA Meta Tags -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
<!-- 🔒 KHÓA ORIENTATION CHỈ CHO PHÉP DỌC -->
<meta name="screen-orientation" content="portrait">
<meta name="mobile-web-app-orientations" content="portrait">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="eTax Mobile">
<meta name="mobile-web-app-capable" content="yes">
<meta name="theme-color" content="#b71c1c">

<!-- PWA Icons -->
<link rel="apple-touch-icon" href="assets/logo.png">
<link rel="icon" type="image/png" href="assets/logo.png">
<!-- 🔧 FIX: Conditional manifest để tránh CORS lỗi với file:// -->
<script>
  if (window.location.protocol !== 'file:') {
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = 'manifest.json';
    document.head.appendChild(link);
  }
</script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

<title>eTax Mobile - Thiết lập cá nhân</title>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto', Arial, sans-serif;
  touch-action: manipulation;
  -webkit-overflow-scrolling: touch;
  -webkit-tap-highlight-color: transparent;
  /* ✅ PERFORMANCE OPTIMIZATION */
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  transform: none !important;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  min-height: 100vh;
  min-width: 100vw;
  width: 100vw;
  height: 100vh;
  background: #000 !important;
  box-sizing: border-box;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  /* 🔒 KHÓA XOAY NGANG */
  transform-origin: center center;
  /* 🔒 PWA Safe Area Support */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
  /* 🔒 KHÓA BODY MẠNH HƠN */
  position: fixed;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

body {
  padding-top: 0 !important;
  margin-top: 0 !important;
  margin: 0 auto;
  color: #000;
  /* 🔒 KHÓA SCROLL HOÀN TOÀN */
  overflow: hidden !important;
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
}

.phone-frame {
  width: 100vw !important;
  min-height: 100vh;
  background: #f5f5f5;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 0;
  margin: 0 auto;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  overflow: hidden;
}

@media (min-width: 601px) {
  .phone-frame {
    border-radius: 30px;
    margin: 32px auto;
    box-shadow: 0 0 20px rgba(0,0,0,0.3);
    width: 400px !important;
  }
}

/* ✅ HEADER CHUẨN PWA TEMPLATE */
.header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: #b71c1c;
  color: white;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 140px;
  padding-top: max(12px, env(safe-area-inset-top));
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.header i {
    font-size: 20px;
    cursor: pointer;
    color: white;
    padding: 8px;
    border-radius: 4px;
    /* ✅ CLICK DELAY = 0 */
    transition: none !important;
    transform: none !important;
}

.header i:hover {
    background-color: rgba(255,255,255,0.1);
}

.header-title {
    font-size: 18px;
    font-weight: 500;
    color: white;
    flex: 1;
    text-align: center;
}

/* ✅ CLICK DELAY = 0 - THẬT SỰ MƯỢT */
button, input, a, div[onclick] {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    /* ✅ DELAY = 0 */
    transition: none !important;
    animation: none !important;
    transform: none !important;
    pointer-events: auto;
}

/* ✅ CLICK NGAY LẬP TỨC */
div[onclick]:active {
    background-color: rgba(0,0,0,0.05) !important;
    transition: none !important;
}
</style>
</head>
<body>
    <div class="phone-frame">
        <!-- ✅ HEADER -->
        <div class="header">
            <i class="fas fa-arrow-left" onclick="window.location.href='index.html'"></i>
            <div class="header-title">Thiết lập cá nhân</div>
            <i class="fas fa-house" onclick="window.location.href='index.html'"></i>
        </div>

        <div>&nbsp;</div>
        <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 20px;"><div style="text-align: center; width: 200px;"><div onclick="#" style="text-align: center; cursor: pointer;"><img src="assets/index7.png" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">Thiết lập<br>cá nhân</span></div></div><div style="text-align: center; width: 200px;"><div onclick="#" style="text-align: center; cursor: pointer;"><img src="assets/icon9.png" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">Quản lý<br>tài khoản</span></div></div><div style="text-align: center; width: 200px;"><div onclick="#" style="text-align: center; cursor: pointer;"><img src="assets/icon9.png" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">Bảo mật</span></div></div></div>        <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 20px;"><div style="text-align: center; width: 200px;"><div onclick="#" style="text-align: center; cursor: pointer;"><img src="assets/icon9.png" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">Thông báo</span></div></div><div style="text-align: center; width: 200px;"><div onclick="#" style="text-align: center; cursor: pointer;"><img src="assets/icon9.png" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">Ngôn ngữ</span></div></div><div style="text-align: center; width: 200px;"><div onclick="#" style="text-align: center; cursor: pointer;"><img src="assets/icon9.png" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">Giới thiệu</span></div></div></div>   
    </div>

    <script>
        // ✅ PWA device auth check
        document.addEventListener('DOMContentLoaded', function() {
            const loggedInUser = localStorage.getItem('etax_logged_in_user');
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }
            console.log('✅ Page loaded for user:', loggedInUser);
        });

        // ✅ CLICK DELAY = 0 - NGAY LẬP TỨC
        document.addEventListener('click', function(e) {
            if (e.target.onclick) {
                e.target.onclick();
            }
        });

        // ✅ DOUBLE-TAP FIX - NGAY LẬP TỨC
        document.addEventListener('touchstart', function(e) {
          if (e.touches.length > 1) {
            e.preventDefault();
          }
        });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', function(e) {
          const now = (new Date()).getTime();
          if (now - lastTouchEnd <= 300) {
            e.preventDefault();
          }
          lastTouchEnd = now;
        }, false);

        // Khắc phục double tap zoom
        let lastTouchTime = 0;
        document.addEventListener('touchstart', function(e) {
          const now = Date.now();
          if (now - lastTouchTime <= 500) {
            e.preventDefault();
          }
          lastTouchTime = now;
        });

        // Tắt pull to refresh
        let startY = 0;
        document.addEventListener('touchstart', function(e) {
          startY = e.touches[0].clientY;
        });

        document.addEventListener('touchmove', function(e) {
          const y = e.touches[0].clientY;
          if (startY <= 10 && y > startY) {
            e.preventDefault();
          }
        });

        // 🔒 KHÓA BODY THÊM
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
    </script>
</body>
</html>`;

fs.writeFileSync(thietlapPath, thietlapCleanContent, 'utf8');
console.log('✅ Đã sửa thiết lập cá nhân với icon size chuẩn');

// 4. Sửa nhóm chức năng nộp thuế - tương tự
console.log('💰 Sửa nhóm chức năng nộp thuế...');
const nopthuesPath = path.join(__dirname, 'nopthue.html');
let nopthueContent = fs.readFileSync(nopthuesPath, 'utf8');

// Sửa click delay = 0 cho nopthue
const clickFixCSS = `
/* ✅ CLICK DELAY = 0 - THẬT SỰ MƯỢT */
div[onclick]:active {
    background-color: rgba(0,0,0,0.05) !important;
    transition: none !important;
}`;

nopthueContent = nopthueContent.replace(
    '</style>',
    `${clickFixCSS}
</style>`
);

fs.writeFileSync(nopthuesPath, nopthueContent, 'utf8');
console.log('✅ Đã sửa nhóm chức năng nộp thuế');

// 5. Sửa thông tin tài khoản - xóa orientation-warning
console.log('👤 Sửa thông tin tài khoản - xóa orientation-warning...');
const thongtintkPath = path.join(__dirname, 'thong-tin-tai-khoan.html');
if (fs.existsSync(thongtintkPath)) {
    let thongtintkContent = fs.readFileSync(thongtintkPath, 'utf8');
    
    // Xóa tất cả orientation-warning
    thongtintkContent = thongtintkContent.replace(
        /<div class="orientation-warning">[\s\S]*?<\/div>/g,
        ''
    );
    
    fs.writeFileSync(thongtintkPath, thongtintkContent, 'utf8');
    console.log('✅ Đã xóa orientation-warning ở thông tin tài khoản');
}

// 6. Sửa login.html - xóa header đỏ
console.log('🔐 Sửa login.html - xóa header đỏ...');
const loginPath = path.join(__dirname, 'login.html');
if (fs.existsSync(loginPath)) {
    let loginContent = fs.readFileSync(loginPath, 'utf8');
    
    // Xóa header đỏ nếu có
    loginContent = loginContent.replace(
        /<div class="header">[\s\S]*?<\/div>/g,
        ''
    );
    
    // Xóa CSS header nếu có
    loginContent = loginContent.replace(
        /\.header\s*{[\s\S]*?}/g,
        ''
    );
    
    fs.writeFileSync(loginPath, loginContent, 'utf8');
    console.log('✅ Đã xóa header đỏ ở login.html');
}

console.log('\\n🎉 Hoàn thành sửa tất cả vấn đề!');