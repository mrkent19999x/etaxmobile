const fs = require('fs');
const path = require('path');

// Danh sách trang cần sửa
const pagesToFix = [
    { file: 'dangky.html', title: 'Đăng ký thuế', icons: [
        { img: 'assets/dk1.png', text: 'Thay đổi<br>thông tin đăng<br>ký thuế', link: 'thaydoittdkthue.html' },
        { img: 'assets/dk2.png', text: 'Tra cứu thông<br>tin người phụ<br>thuộc', link: 'tracuttnpt.html' },
        { img: 'assets/dk3.png', text: 'Hồ sơ đăng ký<br>thuế', link: 'hsdkythue.html' }
    ]},
    { file: 'khaithue.html', title: 'Khai thuế', icons: [
        { img: 'assets/kt1.png', text: 'Tờ khai thuế<br>GTGT', link: '#' },
        { img: 'assets/kt2.png', text: 'Tờ khai thuế<br>TNCN', link: '#' },
        { img: 'assets/kt3.png', text: 'Tờ khai thuế<br>khác', link: '#' }
    ]},
    { file: 'ho-tro-qtt.html', title: 'Hỗ trợ quyết toán thuế TNCN', icons: [
        { img: 'assets/htqt1.png', text: 'Hồ sơ quyết<br>toán thuế', link: 'thaydoittdkthue.html' },
        { img: 'assets/htqt2.png', text: 'Tra cứu thông<br>tin quyết toán', link: 'tracuttnpt.html' },
        { img: 'assets/htqt3.png', text: 'Tra cứu phản<br>ánh QTT gửi<br>đến CQT', link: 'hsdkythue.html' },
        { img: 'assets/htqt4.png', text: 'Hỗ trợ lập tờ<br>khai quyết<br>toán', link: 'thaydoittdkthue.html' }
    ]},
    { file: 'nopthue.html', title: 'Nhóm chức năng nộp thuế', icons: [
        { img: 'assets/icon1.png', text: 'Nộp tờ khai<br>thuế', link: '#' },
        { img: 'assets/icon2.png', text: 'Nộp thuế', link: '#' },
        { img: 'assets/icon3.png', text: 'Thanh toán<br>thuế', link: '#' },
        { img: 'assets/icon4.png', text: 'Tra cứu<br>nợ thuế', link: '#' },
        { img: 'assets/icon5.png', text: 'Tính lãi<br>chậm nộp', link: '#' },
        { img: 'assets/icon8.png', text: 'Tra cứu<br>hóa đơn', link: '#' }
    ]},
    { file: 'nghiavu.html', title: 'Tra cứu nghĩa vụ thuế', icons: [
        { img: 'assets/nv1.png', text: 'Nghĩa vụ thuế<br>hiện tại', link: '#' },
        { img: 'assets/nv2.png', text: 'Lịch sử<br>nghĩa vụ thuế', link: '#' },
        { img: 'assets/nv3.png', text: 'Báo cáo<br>thuế', link: '#' }
    ]},
    { file: 'tienich.html', title: 'Tiện ích', icons: [
        { img: 'assets/icon7.png', text: 'Máy tính<br>thuế', link: '#' },
        { img: 'assets/icon8.png', text: 'Tra cứu<br>mã số thuế', link: '#' },
        { img: 'assets/icon9.png', text: 'Hướng dẫn<br>sử dụng', link: '#' }
    ]},
    { file: 'hotro.html', title: 'Hỗ trợ', icons: [
        { img: 'assets/icon9.png', text: 'Liên hệ<br>hỗ trợ', link: '#' },
        { img: 'assets/icon8.png', text: 'Câu hỏi<br>thường gặp', link: '#' },
        { img: 'assets/icon7.png', text: 'Hướng dẫn<br>chi tiết', link: '#' }
    ]},
    { file: 'thietlap.html', title: 'Thiết lập cá nhân', icons: [
        { img: 'assets/index7.png', text: 'Thiết lập<br>cá nhân', link: '#' },
        { img: 'assets/icon9.png', text: 'Quản lý<br>tài khoản', link: '#' },
        { img: 'assets/icon9.png', text: 'Bảo mật', link: '#' },
        { img: 'assets/icon9.png', text: 'Thông báo', link: '#' },
        { img: 'assets/icon9.png', text: 'Ngôn ngữ', link: '#' },
        { img: 'assets/icon9.png', text: 'Giới thiệu', link: '#' }
    ]}
];

console.log('🧹 Làm sạch tất cả trang - xóa \\n, thêm khóa body, tối ưu tốc độ...');

function createCleanPageContent(pageData) {
    // Tạo grid icon sạch sẽ, KHÔNG có \\n
    let iconRows = '';
    
    // Chia icon thành các hàng, mỗi hàng 3 icon
    for (let i = 0; i < pageData.icons.length; i += 3) {
        const rowIcons = pageData.icons.slice(i, i + 3);
        iconRows += `        <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 20px;">`;
        
        rowIcons.forEach(icon => {
            iconRows += `<div style="text-align: center; width: 200px;"><div onclick="window.location.href='${icon.link}'" style="text-align: center; cursor: pointer;"><img src="${icon.img}" style="width: 65px; height: 65px;" /><br><span style="display: inline-block; line-height: 1.4;">${icon.text}</span></div></div>`;
        });
        
        iconRows += `</div>`;
    }

    return `<!DOCTYPE html>
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

<title>eTax Mobile - ${pageData.title}</title>

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
    /* ✅ PHẢN HỒI NGAY LẬP TỨC */
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

/* ✅ THÊM: Optimized click response - NGAY LẬP TỨC */
button, input, a, div[onclick] {
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
    touch-action: manipulation;
    /* ✅ BỎ HẾT DELAY */
    transition: none !important;
    animation: none !important;
    transform: none !important;
}

/* ✅ RESPONSIVE ENHANCEMENTS */
@media screen and (max-width: 375px) {
    .header-title {
        font-size: 16px;
    }
}
</style>
</head>
<body>
    <div class="phone-frame">
        <!-- ✅ CONSISTENT HEADER WITH PWA TEMPLATE -->
        <div class="header">
            <i class="fas fa-arrow-left" onclick="window.location.href='index.html'"></i>
            <div class="header-title">${pageData.title}</div>
            <i class="fas fa-house" onclick="window.location.href='index.html'"></i>
        </div>

        <div>&nbsp;</div>
${iconRows}   
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

        // Khắc phục double tap zoom - NGAY LẬP TỨC
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
}

// Sửa từng trang
pagesToFix.forEach(pageData => {
    const filePath = path.join(__dirname, pageData.file);
    
    if (fs.existsSync(filePath)) {
        console.log(`🧹 Làm sạch ${pageData.file}...`);
        
        const newContent = createCleanPageContent(pageData);
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        console.log(`✅ Đã làm sạch ${pageData.file}`);
    } else {
        console.log(`❌ Không tìm thấy ${pageData.file}`);
    }
});

console.log('\\n🎉 Hoàn thành làm sạch tất cả trang!');