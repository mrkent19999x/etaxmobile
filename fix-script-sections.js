const fs = require('fs');
const path = require('path');

const pagesToFix = [
    'dangky.html', 'khaithue.html', 'ho-tro-qtt.html', 'nopthue.html', 
    'nghiavu.html', 'tienich.html', 'hotro.html', 'thietlap.html', 'thongbao.html'
];

console.log('🔧 Sửa script sections...');

// Script chuẩn từ hoadondt.html
const standardScript = `        // ✅ THÊM: PWA device auth check
        document.addEventListener('DOMContentLoaded', function() {
            // Check if user is logged in
            const loggedInUser = localStorage.getItem('etax_logged_in_user');
            if (!loggedInUser) {
                window.location.href = 'login.html';
                return;
            }

            console.log('✅ Page loaded for user:', loggedInUser);
        });

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

pagesToFix.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        console.log(`🛠️ Đang sửa script trong ${filename}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Thay thế script section
        content = content.replace(
            /<script>[\s\S]*?<\/script>/,
            `<script>\n${standardScript}\n    </script>`
        );
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Đã sửa xong ${filename}`);
    } else {
        console.log(`❌ Không tìm thấy ${filename}`);
    }
});

console.log('\\n🎉 Hoàn thành sửa script sections!');