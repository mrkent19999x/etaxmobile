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

console.log('🔧 Bắt đầu sửa layout theo chuẩn hoadondt.html...');

// Lấy template chuẩn từ hoadondt.html
const templatePath = path.join(__dirname, 'hoadondt.html');
const templateContent = fs.readFileSync(templatePath, 'utf8');

// Trích xuất phần CSS và structure chuẩn
const cssMatch = templateContent.match(/<style>([\s\S]*?)<\/style>/);
const standardCSS = cssMatch ? cssMatch[1] : '';

const scriptMatch = templateContent.match(/<script>([\s\S]*?)<\/script>/);
const standardScript = scriptMatch ? scriptMatch[1] : '';

function createPageContent(pageData) {
    // Tạo grid icon theo layout chuẩn
    let iconRows = '';
    
    // Chia icon thành các hàng, mỗi hàng 3 icon
    for (let i = 0; i < pageData.icons.length; i += 3) {
        const rowIcons = pageData.icons.slice(i, i + 3);
        iconRows += `    <div style="display: flex; justify-content: center; gap: 16px; margin-bottom: 20px;">\\n`;
        
        rowIcons.forEach(icon => {
            iconRows += `      <div style="text-align: center; width: 200px;">
        <div onclick="window.location.href='${icon.link}'" style="text-align: center; cursor: pointer;">
        <img src="${icon.img}" style="width: 65px; height: 65px;" /><br>
            <span style="display: inline-block; line-height: 1.4;">
                ${icon.text}
            </span>
        </div>
      </div>\\n`;
        });
        
        iconRows += `    </div>\\n`;
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
${standardCSS}
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

        <div>   &nbsp; </div>
${iconRows}   
    </div>

    <script>
${standardScript}
    </script>
</body>
</html>`;
}

// Sửa từng trang
pagesToFix.forEach(pageData => {
    const filePath = path.join(__dirname, pageData.file);
    
    if (fs.existsSync(filePath)) {
        console.log(`🛠️ Đang sửa ${pageData.file}...`);
        
        const newContent = createPageContent(pageData);
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        console.log(`✅ Đã sửa xong ${pageData.file}`);
    } else {
        console.log(`❌ Không tìm thấy ${pageData.file}`);
    }
});

console.log('\\n🎉 Hoàn thành sửa layout theo chuẩn!');