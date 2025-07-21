const fs = require('fs');
const path = require('path');

// Files that need structural fixes
const filesToFix = [
    'thongbao.html',
    'dangky.html', 
    'thietlap.html',
    'ho-tro-qtt.html',
    'nopthue.html'
];

console.log('🔧 Starting final structure fixes...');

filesToFix.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        console.log(`\n🛠️ Fixing ${filename}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix missing home button in header
        if (!content.includes('<i class="fas fa-house" onclick="window.location.href=\'index.html\'"></i>')) {
            content = content.replace(
                /<div class="header-title">([^<]+)<\/div>/,
                `<div class="header-title">$1</div>
            <i class="fas fa-house" onclick="window.location.href='index.html'"></i>`
            );
        }
        
        // Fix broken content structure - move content outside of content-area wrapper
        if (filename === 'thongbao.html') {
            // Fix thongbao.html specific structure issues
            content = content.replace(
                /<!-- ✅ CONTENT AREA -->\s*<div class="content-area">\s*<div class="orientation-warning">[\s\S]*?<\/div>\s*<\/div>/,
                `<!-- ✅ CONTENT AREA -->
        <div class="content-area">
            <!-- Tabs Section -->
            <div class="tabs-container">
                <div style="display: flex; background: #f44336; padding: 0; border-bottom: 1px solid #ddd; width: 100%;">
                    <!-- Tab đang chọn -->
                    <div style="flex: 1; background: rgba(255,255,255,0.2); border-radius: 12px; padding: 8px 6px; margin: 6px 4px; text-align: center; color: white; font-size: 13px; font-weight: 500; line-height: 1.3;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <div style="background: white; color: red; font-weight: bold; width: 25px; height: 20px; font-size: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">0</div>
                            <div style="text-align: left;">Thông báo<br>hành chính của<br>CQT</div>
                        </div>
                    </div>
                    
                    <!-- Tab chưa chọn -->
                    <div style="flex: 1; background: transparent; padding: 8px 6px; margin: 6px 4px; text-align: center; color: white; font-size: 13px; font-weight: 500; line-height: 1.3;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <div style="background: white; color: red; font-weight: bold; width: 20px; height: 20px; font-size: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">0</div>
                            <div style="text-align: left;">Biến động<br>nghĩa vụ thuế</div>
                        </div>
                    </div>
                    
                    <!-- Tab chưa chọn -->
                    <div style="flex: 1; background: transparent; padding: 8px 6px; margin: 6px 4px; text-align: center; color: white; font-size: 13px; font-weight: 500; line-height: 1.3;">
                        <div style="display: flex; align-items: center; justify-content: center; gap: 6px;">
                            <div style="background: white; color: red; font-weight: bold; width: 20px; height: 20px; font-size: 12px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">0</div>
                            <div style="text-align: left;">Thông báo<br>khác</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Search Section -->
            <div class="search-container" style="margin: 20px 0;">
                <div class="search-bar" style="display: flex; gap: 10px; align-items: center;">
                    <input type="text" class="search-input" placeholder="Tìm theo nội dung hoặc ngày" style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
                    <button class="advanced-btn" style="padding: 10px 15px; background: #f44336; color: white; border: none; border-radius: 5px;">
                        <i class="fas fa-plus"></i> Nâng cao
                    </button>
                </div>
            </div>

            <!-- Notification List -->
            <div class="notification-list">
                <div class="notification-item" style="background: white; margin: 10px 0; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="notification-time" style="color: #666; font-size: 12px; margin-bottom: 5px;">27/06/2025 15:05:59</div>
                    <div class="notification-title" style="font-weight: bold; margin-bottom: 8px;">Thông báo kế hoạch tạm dừng hệ thống</div>
                    <div class="notification-content" style="color: #333; line-height: 1.4;">
                        Cục Thuế thông báo về việc tạm dừng các hệ thống thuế điện tử từ 13h00 ngày 27/6/2025 (...)
                    </div>
                </div>

                <div class="notification-item" style="background: white; margin: 10px 0; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="notification-time" style="color: #666; font-size: 12px; margin-bottom: 5px;">13/06/2025 16:34:34</div>
                    <div class="notification-title" style="font-weight: bold; margin-bottom: 8px;">Thông báo kế hoạch tạm dừng hệ thống</div>
                    <div class="notification-content" style="color: #333; line-height: 1.4;">
                        Cục Thuế thông báo về việc tạm dừng Dịch vụ Thuế điện tử trên thiết bị di động (eTax Mobile)...
                    </div>
                </div>

                <div class="notification-item" style="background: white; margin: 10px 0; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <div class="notification-time" style="color: #666; font-size: 12px; margin-bottom: 5px;">04/06/2025 10:09:38</div>
                    <div class="notification-title" style="font-weight: bold; margin-bottom: 8px;">Giao dịch nộp thuế</div>
                    <div class="notification-content" style="color: #333; line-height: 1.4;">
                        Người nộp thuế đã nộp thuế thành công cho mã số thuế 8868112232-002, mã tham chiếu: 1...
                    </div>
                </div>
            </div>`
            );
            
            // Remove broken content that appears after
            content = content.replace(/<!-- Tab chưa chọn -->[\s\S]*?<!-- Notification List -->[\s\S]*?<\/div>\s*<\/main>\s*<\/div>/, '');
        }
        
        if (filename === 'dangky.html') {
            // Fix dangky.html - move content outside of content-area
            content = content.replace(
                /<!-- ✅ CONTENT AREA -->\s*<div class="content-area">[\s\S]*?<\/div>\s*<!-- ✅ CONSISTENT HEADER WITH PWA TEMPLATE -->/,
                `<!-- ✅ CONTENT AREA -->
        <div class="content-area">
            <div style="margin: 20px 0;"></div>
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <div style="text-align: center; width: 180px; margin: 10px;">
                    <div onclick="window.location.href='thaydoittdkthue.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/dk1.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px;">
                            Thay đổi<br>thông tin đăng<br>ký thuế
                        </span>
                    </div>
                </div>
                
                <div style="text-align: center; width: 180px; margin: 10px;">
                    <div onclick="window.location.href='tracuttnpt.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/dk2.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px;">
                            Tra cứu thông<br>tin người phụ<br>thuộc
                        </span>
                    </div>
                </div>
                
                <div style="text-align: center; width: 180px; margin: 10px;">
                    <div onclick="window.location.href='hsdkythue.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/dk3.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px;">
                            Hồ sơ đăng ký<br>thuế
                        </span>
                    </div>
                </div>
            </div>`
            );
            
            // Remove the duplicate content section
            content = content.replace(/\s*<\/div>\s*<div style="margin: 10px;"><\/div>[\s\S]*?<\/div>\s*<!-- ✅ CONTENT AREA WITH PROPER SCROLLING -->/, '');
        }
        
        if (filename === 'ho-tro-qtt.html') {
            // Fix ho-tro-qtt.html structure
            content = content.replace(
                /<!-- ✅ CONTENT AREA -->\s*<div class="content-area">[\s\S]*?<\/div>/,
                `<!-- ✅ CONTENT AREA -->
        <div class="content-area">
            <div style="margin: 20px 0;"></div>
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap; margin-bottom: 20px;">
                <div style="text-align: center; width: 120px; margin: 10px;">
                    <div onclick="window.location.href='thaydoittdkthue.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/htqt1.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px; font-size: 12px;">
                            Hồ sơ quyết<br>toán thuế
                        </span>
                    </div>
                </div>
                
                <div style="text-align: center; width: 120px; margin: 10px;">
                    <div onclick="window.location.href='tracuttnpt.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/htqt2.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px; font-size: 12px;">
                            Tra cứu thông<br>tin quyết toán
                        </span>
                    </div>
                </div>
                
                <div style="text-align: center; width: 120px; margin: 10px;">
                    <div onclick="window.location.href='hsdkythue.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/htqt3.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px; font-size: 12px;">
                            Tra cứu phản<br>ánh QTT gửi<br>đến CQT
                        </span>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                <div style="text-align: center; width: 120px; margin: 10px;">
                    <div onclick="window.location.href='thaydoittdkthue.html'" style="text-align: center; cursor: pointer;">
                        <img src="assets/htqt4.png" style="width: 65px; height: 65px;" /><br>
                        <span style="display: inline-block; line-height: 1.4; margin-top: 8px; font-size: 12px;">
                            Hỗ trợ lập tờ<br>khai quyết<br>toán
                        </span>
                    </div>
                </div>
            </div>`
            );
            
            // Remove duplicate content
            content = content.replace(/\s*<div style="margin: 10px;"><\/div>[\s\S]*?<\/div>\s*<\/div>/, '');
        }
        
        // Ensure proper closing
        if (!content.includes('        </div>')) {
            content = content.replace(/<\/body>/, '        </div>\n    </div>\n</body>');
        }
        
        // Write the fixed content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Fixed ${filename}`);
    } else {
        console.log(`❌ File ${filename} not found`);
    }
});

console.log('\n🎉 Final structure fixes completed!');