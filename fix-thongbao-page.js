const fs = require('fs');
const path = require('path');

console.log('🔧 Sửa trang thông báo...');

// Lấy template chuẩn từ hoadondt.html
const templatePath = path.join(__dirname, 'hoadondt.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Trích xuất phần CSS và script chuẩn
const cssMatch = templateContent.match(/<style>([\s\S]*?)<\/style>/);
const standardCSS = cssMatch ? cssMatch[1] : '';

const scriptMatch = templateContent.match(/<script>([\s\S]*?)<\/script>/);
const standardScript = scriptMatch ? scriptMatch[1] : '';

// Nội dung trang thông báo mới với tabs sát header
const thongbaoContent = `<!DOCTYPE html>
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

<title>eTax Mobile - Tra cứu thông báo</title>

<style>
${standardCSS}

/* CSS bổ sung cho tabs */
.tabs-container {
    background: #b71c1c;
    margin: 0;
    padding: 0;
}

.tab-item {
    flex: 1;
    padding: 8px 6px;
    margin: 6px 4px;
    text-align: center;
    color: white;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3;
    border-radius: 12px;
    cursor: pointer;
}

.tab-active {
    background: rgba(255,255,255,0.2);
}

.tab-badge {
    background: white;
    color: red;
    font-weight: bold;
    width: 25px;
    height: 20px;
    font-size: 12px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 4px;
}

.search-container {
    padding: 15px 20px;
    background: #f3f2f2;
}

.search-bar {
    display: flex;
    gap: 10px;
    align-items: center;
}

.search-input {
    flex: 1;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
}

.advanced-btn {
    padding: 12px 16px;
    background: #b71c1c;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
}

.notification-list {
    padding: 0 20px 20px;
    background: #f3f2f2;
}

.notification-item {
    background: white;
    margin: 12px 0;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.notification-time {
    color: #666;
    font-size: 12px;
    margin-bottom: 6px;
}

.notification-title {
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
    font-size: 14px;
}

.notification-content {
    color: #555;
    line-height: 1.4;
    font-size: 13px;
}
</style>
</head>
<body>
    <div class="phone-frame">
        <!-- Header -->
        <div class="header">
            <i class="fas fa-arrow-left" onclick="window.location.href='index.html'"></i>
            <div class="header-title">Tra cứu thông báo</div>
            <i class="fas fa-house" onclick="window.location.href='index.html'"></i>
        </div>

        <!-- Tabs Section - SÁT VỚI HEADER -->
        <div class="tabs-container">
            <div style="display: flex; padding: 0; margin: 0;">
                <!-- Tab đang chọn -->
                <div class="tab-item tab-active">
                    <div class="tab-badge">0</div>
                    <div>Thông báo<br>hành chính của<br>CQT</div>
                </div>
                
                <!-- Tab chưa chọn -->
                <div class="tab-item">
                    <div class="tab-badge">0</div>
                    <div>Biến động<br>nghĩa vụ thuế</div>
                </div>
                
                <!-- Tab chưa chọn -->
                <div class="tab-item">
                    <div class="tab-badge">0</div>
                    <div>Thông báo<br>khác</div>
                </div>
            </div>
        </div>

        <!-- Search Section -->
        <div class="search-container">
            <div class="search-bar">
                <input type="text" class="search-input" placeholder="Tìm theo nội dung hoặc ngày">
                <button class="advanced-btn">
                    <i class="fas fa-plus"></i> Nâng cao
                </button>
            </div>
        </div>

        <!-- Notification List -->
        <div class="notification-list">
            <div class="notification-item">
                <div class="notification-time">27/06/2025 15:05:59</div>
                <div class="notification-title">Thông báo kế hoạch tạm dừng hệ thống</div>
                <div class="notification-content">
                    Cục Thuế thông báo về việc tạm dừng các hệ thống thuế điện tử từ 13h00 ngày 27/6/2025 để thực hiện bảo trì, nâng cấp hệ thống. Thời gian dự kiến hoàn tất: 17h00 cùng ngày.
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-time">13/06/2025 16:34:34</div>
                <div class="notification-title">Thông báo kế hoạch tạm dừng hệ thống</div>
                <div class="notification-content">
                    Cục Thuế thông báo về việc tạm dừng Dịch vụ Thuế điện tử trên thiết bị di động (eTax Mobile) từ 20h00 ngày 13/6/2025 đến 06h00 ngày 14/6/2025 để bảo trì hệ thống.
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-time">13/06/2025 16:24:25</div>
                <div class="notification-title">Thông báo kế hoạch tạm dừng hệ thống</div>
                <div class="notification-content">
                    Cục Thuế thông báo về việc tạm dừng Dịch vụ Thuế điện tử trên thiết bị di động (eTax Mobile) từ 08h00 đến 12h00 ngày 14/6/2025 để triển khai nâng cấp tính năng mới.
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-time">04/06/2025 10:09:38</div>
                <div class="notification-title">Giao dịch nộp thuế</div>
                <div class="notification-content">
                    Người nộp thuế đã nộp thuế thành công cho mã số thuế 8868112232-002, mã tham chiếu: 1717473578. Số tiền: 2,500,000 VNĐ. Thời gian giao dịch: 04/06/2025 10:09:38.
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-time">03/06/2025 17:34:22</div>
                <div class="notification-title">V/v : Tài khoản giao dịch thuế điện tử</div>
                <div class="notification-content">
                    Kính gửi Quý khách hàng, Cục Thuế thông báo tài khoản giao dịch thuế điện tử của Quý khách đã được kích hoạt thành công. Vui lòng kiểm tra thông tin và liên hệ nếu có thắc mắc.
                </div>
            </div>

            <div class="notification-item">
                <div class="notification-time">01/06/2025 09:15:42</div>
                <div class="notification-title">Nhắc nhở nghĩa vụ thuế</div>
                <div class="notification-content">
                    Kính thông báo Quý khách có nghĩa vụ thuế sắp đến hạn nộp. Vui lòng kiểm tra và thực hiện nghĩa vụ thuế đúng thời hạn để tránh phát sinh tiền chậm nộp.
                </div>
            </div>
        </div>
    </div>

    <script>
${standardScript}
    </script>
</body>
</html>`;

// Ghi file thông báo mới
const thongbaoPath = path.join(__dirname, 'thongbao.html');
fs.writeFileSync(thongbaoPath, thongbaoContent, 'utf8');

console.log('✅ Đã sửa xong trang thông báo với tabs sát header và danh sách thông báo đầy đủ!');