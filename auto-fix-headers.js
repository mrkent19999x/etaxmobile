// ===== AUTO FIX HEADERS - ÁP DỤNG TEMPLATE TỪ HOADONDT.HTML =====

const fs = require('fs');
const path = require('path');

// Template từ hoadondt.html
const CLEAN_META_TAGS = `<meta charset="UTF-8">
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
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">`;

const CLEAN_CSS_TEMPLATE = `<style>
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
    }

    body {
      padding-top: 0 !important;
      margin-top: 0 !important;
      margin: 0 auto;
      color: #000;
      /* 🔒 KHÓA SCROLL HOÀN TOÀN */
      overflow: hidden;
      touch-action: manipulation;
      /* ✅ Bỏ chức năng vuốt back */
      overscroll-behavior: none;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
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
    }

    @media (min-width: 601px) {
      .phone-frame {
        border-radius: 30px;
        margin: 32px auto;
        box-shadow: 0 0 20px rgba(0,0,0,0.3);
        width: 400px !important;
      }
    }

    /* ✅ HEADER CHUẨN PWA TEMPLATE - EXTENDED TO LOGO BORDER */
    .header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #b71c1c; /* 🔴 Màu đỏ chuẩn mới theo yêu cầu */
      color: white;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 140px; /* 🔧 Tăng cao hơn để xuống đến viền logo */
      /* 🔒 PWA Safe Area */
      padding-top: max(12px, env(safe-area-inset-top));
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    }

/* ✅ THÊM: iOS fallback cho safe areas */
@supports (-webkit-touch-callout: none) {
    .phone-frame {
        padding-top: constant(safe-area-inset-top, 0px);
        padding-bottom: constant(safe-area-inset-bottom, 0px);
        padding-left: constant(safe-area-inset-left, 0px);
        padding-right: constant(safe-area-inset-right, 0px);
    }
}

@media (min-width: 601px) {
    .phone-frame {
        margin: 32px auto !important;
        box-shadow: 0 0 20px rgba(0,0,0,0.3) !important;
        width: 400px !important;
        height: 900px !important;
        max-height: 900px !important;
        border-radius: 30px !important;
    }
}

.header i {
    font-size: 20px;
    cursor: pointer;
    color: white;
    padding: 8px;
    border-radius: 4px;
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

/* ✅ CONTENT AREA WITH PROPER SCROLLING */
.content-area {
    flex: 1;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    background-color: #f3f2f2;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

/* ✅ THÊM: No scroll behaviors */
html {
    overscroll-behavior: none;
    -webkit-overflow-scrolling: auto;
}

body {
    overscroll-behavior: none;
    touch-action: manipulation;
    user-select: none;
    -webkit-user-select: none;
    -webkit-touch-callout: none;
}

/* ✅ THÊM: Optimized click response */
button, input, a, .service-item {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
}
</style>`;

const DOUBLE_TAP_FIX_JS = `
        // ✅ DOUBLE-TAP FIX từ index.html
        // Khắc phục iOS Safari swipe back
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
        });`;

// Danh sách files cần fix
const FILES_TO_FIX = [
  { file: 'khaithue.html', title: 'Khai thuế' },
  { file: 'dangky.html', title: 'Đăng ký thuế' },
  { file: 'ho-tro-qtt.html', title: 'Hỗ trợ quyết toán thuế TNCN' },
  { file: 'nopthue.html', title: 'Nhóm chức năng nộp thuế' },
  { file: 'nghiavu.html', title: 'Tra cứu nghĩa vụ thuế' },
  { file: 'thongbao.html', title: 'Tra cứu thông báo' },
  { file: 'tienich.html', title: 'Tiện ích' },
  { file: 'hotro.html', title: 'Hỗ trợ' },
  { file: 'thietlap.html', title: 'Thiết lập cá nhân' }
];

function cleanFile(filename, pageTitle) {
  try {
    console.log(`🔧 Processing ${filename}...`);
    
    let content = fs.readFileSync(filename, 'utf8');
    
    // 1. CLEAN HEADER - Tìm và thay thế toàn bộ <head>
    const headStart = content.indexOf('<head>');
    const headEnd = content.indexOf('</head>') + 7;
    
    if (headStart !== -1 && headEnd !== -1) {
      const beforeHead = content.substring(0, headStart);
      const afterHead = content.substring(headEnd);
      
      const newHead = `<head>
${CLEAN_META_TAGS}

<title>eTax Mobile - ${pageTitle}</title>

${CLEAN_CSS_TEMPLATE}
</head>`;
      
      content = beforeHead + newHead + afterHead;
    }
    
    // 2. CLEAN BODY - Tìm và thay thế header structure
    const bodyStart = content.indexOf('<body>');
    const bodyEnd = content.indexOf('</body>');
    
    if (bodyStart !== -1 && bodyEnd !== -1) {
      const beforeBody = content.substring(0, bodyStart + 6);
      const afterBodyTag = content.substring(bodyEnd);
      
      // Extract existing content between <body> and </body>
      let bodyContent = content.substring(bodyStart + 6, bodyEnd);
      
      // Remove existing headers, status bars, phone-frames
      bodyContent = bodyContent.replace(/<div[^>]*class="[^"]*header[^"]*"[^>]*>.*?<\/div>/gs, '');
      bodyContent = bodyContent.replace(/<div[^>]*class="[^"]*status[^"]*"[^>]*>.*?<\/div>/gs, '');
      bodyContent = bodyContent.replace(/<div[^>]*class="[^"]*phone-frame[^"]*"[^>]*>/gs, '');
      bodyContent = bodyContent.replace(/<\/div>\s*<\/div>\s*$/gs, '');
      
      // Clean up extra divs and scripts
      bodyContent = bodyContent.replace(/<script[^>]*>.*?<\/script>/gs, '');
      bodyContent = bodyContent.trim();
      
      const cleanBody = `<body>
    <div class="phone-frame">
        <!-- ✅ CONSISTENT HEADER WITH PWA TEMPLATE -->
        <div class="header">
            <i class="fas fa-arrow-left" onclick="window.location.href='index.html'"></i>
            <div class="header-title">${pageTitle}</div>
            <i class="fas fa-house" onclick="window.location.href='index.html'"></i>
        </div>

        <!-- ✅ CONTENT AREA -->
        <div class="content-area">
            ${bodyContent}
        </div>
    </div>

    <script>
        // ✅ PWA device auth check
        document.addEventListener('DOMContentLoaded', function() {
            const loggedInUser = localStorage.getItem('etax_logged_in_user');
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }
            console.log('✅ ${pageTitle} page loaded for user:', loggedInUser);
        });
${DOUBLE_TAP_FIX_JS}
    </script>
</body>`;
      
      content = beforeBody + cleanBody + afterBodyTag;
    }
    
    // 3. Final cleanup - remove empty lines and fix formatting
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
    
    fs.writeFileSync(filename, content);
    console.log(`✅ ${filename} fixed successfully`);
    
  } catch (error) {
    console.log(`❌ Error fixing ${filename}:`, error.message);
  }
}

// Execute cho tất cả files
console.log('🚀 Starting auto-fix headers...');
FILES_TO_FIX.forEach(({file, title}) => {
  cleanFile(file, title);
});

console.log('🎉 Auto-fix headers completed!');
console.log('🔄 All files now use hoadondt.html template with clean headers and double-tap fix.');