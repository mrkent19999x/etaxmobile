// ===== PLACEHOLDER SCANNER - TỰ ĐỘNG QUÉT PLACEHOLDER PATTERNS =====
// Version: 1.0
// Author: Cipher (Bác sĩ Mã Nguồn)
// Date: 2025-01-08

class PlaceholderScanner {
    constructor() {
        this.pages = [
            'index_main.html',
            'dangky.html',
            'khaithue.html',
            'nghiavu.html',
            'nopthue.html',
            'thongbao.html',
            'tra-cuu-chung-tu.html',
            'hoso.html',
            'hoadondt.html',
            'hotro.html',
            'tienich.html',
            'thietlap.html',
            'ho-tro-qtthue.html',
            'hsdkythue.html',
            'thongtin.html',
            'thongtinnvt.html',
            'chi-tiet-thong-bao.html',
            'page-thongbao.html',
            'thongtin-chitiet.html',
            'doimatkhau.html',
            'thaydoittdkthue.html',
            'tracuttnpt.html',
            'van-tay.html',
            'login.html'
        ];
        
        this.scanResults = {};
        this.placeholderPatterns = [];
        this.hardcodedData = [];
    }

    // Quét một trang cụ thể
    async scanPage(pageName) {
        try {
            console.log(`🔍 Đang quét trang: ${pageName}`);
            
            const response = await fetch(pageName);
            if (!response.ok) {
                console.warn(`⚠️ Không thể load trang: ${pageName}`);
                return;
            }
            
            const html = await response.text();
            const results = this.analyzeHTML(html, pageName);
            
            this.scanResults[pageName] = results;
            
            console.log(`✅ Đã quét xong: ${pageName} - Tìm thấy ${results.placeholders.length} placeholder`);
            
        } catch (error) {
            console.error(`❌ Lỗi quét trang ${pageName}:`, error);
            this.scanResults[pageName] = {
                placeholders: [],
                hardcodedData: [],
                error: error.message
            };
        }
    }

    // Phân tích HTML content
    analyzeHTML(html, pageName) {
        const results = {
            placeholders: [],
            hardcodedData: [],
            pageName: pageName,
            timestamp: Date.now()
        };

        // Tìm placeholder patterns
        const placeholderRegex = /\{\{([^}]+)\}\}/g;
        let match;
        while ((match = placeholderRegex.exec(html)) !== null) {
            const placeholder = match[0];
            const field = match[1];
            
            if (!results.placeholders.includes(placeholder)) {
                results.placeholders.push(placeholder);
            }
        }

        // Tìm dữ liệu hardcoded (có thể chuyển thành placeholder)
        this.findHardcodedData(html, results);

        return results;
    }

    // Tìm dữ liệu hardcoded
    findHardcodedData(html, results) {
        // Patterns cho dữ liệu có thể chuyển thành placeholder
        const patterns = [
            // MST patterns
            { regex: /\b\d{10,13}\b/g, type: 'mst', description: 'Mã số thuế' },
            
            // Phone patterns
            { regex: /\b0\d{9,10}\b/g, type: 'phone', description: 'Số điện thoại' },
            
            // Email patterns
            { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, type: 'email', description: 'Email' },
            
            // Address patterns
            { regex: /\d+\s+[A-Za-zÀ-ỹ\s]+,\s*(?:Quận|Huyện|Phường|Xã)/g, type: 'address', description: 'Địa chỉ' },
            
            // Company patterns
            { regex: /(?:Công ty|Doanh nghiệp|TNHH|CP|JSC)\s+[A-Za-zÀ-ỹ\s]+/g, type: 'company', description: 'Tên công ty' },
            
            // Bank patterns
            { regex: /(?:Vietcombank|BIDV|Agribank|Techcombank|MB|ACB|Sacombank|VPBank|TPBank|HDBank)/g, type: 'bank', description: 'Tên ngân hàng' }
        ];

        patterns.forEach(pattern => {
            const matches = html.match(pattern.regex);
            if (matches) {
                matches.forEach(match => {
                    if (!results.hardcodedData.some(item => item.value === match)) {
                        results.hardcodedData.push({
                            value: match,
                            type: pattern.type,
                            description: pattern.description,
                            suggestedPlaceholder: `{{${pattern.type}}}`
                        });
                    }
                });
            }
        });
    }

    // Tạo báo cáo tổng hợp
    generateReport() {
        const report = {
            totalPages: this.pages.length,
            scannedPages: Object.keys(this.scanResults).length,
            totalPlaceholders: 0,
            totalHardcodedData: 0,
            placeholders: [],
            hardcodedData: [],
            pageDetails: {},
            timestamp: Date.now()
        };

        // Tổng hợp dữ liệu từ tất cả trang
        Object.keys(this.scanResults).forEach(pageName => {
            const results = this.scanResults[pageName];
            
            // Đếm placeholder
            results.placeholders.forEach(placeholder => {
                if (!report.placeholders.includes(placeholder)) {
                    report.placeholders.push(placeholder);
                }
            });
            
            // Đếm hardcoded data
            results.hardcodedData.forEach(data => {
                const existing = report.hardcodedData.find(item => 
                    item.value === data.value && item.type === data.type
                );
                if (!existing) {
                    report.hardcodedData.push(data);
                }
            });
            
            // Chi tiết từng trang
            report.pageDetails[pageName] = {
                placeholders: results.placeholders.length,
                hardcodedData: results.hardcodedData.length,
                hasErrors: !!results.error
            };
        });

        report.totalPlaceholders = report.placeholders.length;
        report.totalHardcodedData = report.hardcodedData.length;

        return report;
    }

    // Tạo placeholder từ dữ liệu thực tế
    generatePlaceholdersFromRealData() {
        const placeholders = [];
        
        // Từ hardcoded data
        this.scanResults.forEach(pageResults => {
            pageResults.hardcodedData.forEach(data => {
                const existing = placeholders.find(p => p.field === data.type);
                if (!existing) {
                    placeholders.push({
                        code: `{{${data.type}}}`,
                        field: data.type,
                        description: data.description,
                        example: data.value,
                        source: 'hardcoded_data',
                        suggested: true
                    });
                }
            });
        });

        // Từ placeholder patterns tìm thấy
        this.scanResults.forEach(pageResults => {
            pageResults.placeholders.forEach(placeholder => {
                const field = placeholder.replace(/\{\{|\}\}/g, '');
                const existing = placeholders.find(p => p.code === placeholder);
                if (!existing) {
                    placeholders.push({
                        code: placeholder,
                        field: field,
                        description: this.getFieldDescription(field),
                        example: this.getFieldExample(field),
                        source: 'existing_pattern',
                        suggested: false
                    });
                }
            });
        });

        return placeholders;
    }

    // Lưu kết quả vào Firebase
    async saveToFirebase() {
        try {
            const report = this.generateReport();
            const placeholders = this.generatePlaceholdersFromRealData();
            
            const data = {
                scan_report: report,
                auto_placeholders: placeholders,
                timestamp: Date.now()
            };
            
            await firebase.database().ref('placeholder_scans').push(data);
            console.log('✅ Đã lưu kết quả scan vào Firebase');
            
        } catch (error) {
            console.error('❌ Lỗi lưu vào Firebase:', error);
        }
    }

    // Lấy mô tả field
    getFieldDescription(field) {
        const descriptions = {
            'mst': 'Mã số thuế',
            'fullName': 'Họ tên đầy đủ',
            'company': 'Tên công ty',
            'address': 'Địa chỉ',
            'phone': 'Số điện thoại',
            'email': 'Email',
            'bankAccount': 'Số tài khoản ngân hàng',
            'bankName': 'Tên ngân hàng',
            'taxDepartment': 'Chi cục thuế',
            'taxCode': 'Mã số thuế',
            'businessType': 'Loại hình doanh nghiệp',
            'registrationDate': 'Ngày đăng ký',
            'currentDate': 'Ngày hiện tại',
            'currentYear': 'Năm hiện tại',
            'currentMonth': 'Tháng hiện tại',
            'currentTime': 'Giờ hiện tại',
            'revenue': 'Doanh thu',
            'profit': 'Lợi nhuận',
            'taxAmount': 'Số tiền thuế',
            'taxRate': 'Tỷ lệ thuế',
            'currency': 'Đơn vị tiền tệ',
            'status': 'Trạng thái',
            'note': 'Ghi chú'
        };
        
        return descriptions[field] || `Thông tin ${field}`;
    }

    // Lấy ví dụ cho field
    getFieldExample(field) {
        const examples = {
            'mst': '0123456789',
            'fullName': 'Nguyễn Văn A',
            'company': 'Công ty TNHH ABC',
            'address': '123 Nguyễn Văn A, Q1, TP.HCM',
            'phone': '0901234567',
            'email': 'contact@abc.com.vn',
            'bankAccount': '1234567890',
            'bankName': 'Vietcombank',
            'taxDepartment': 'Chi cục thuế Quận 1',
            'taxCode': '0123456789',
            'businessType': 'Công ty TNHH',
            'registrationDate': '15/03/2020',
            'currentDate': new Date().toLocaleDateString('vi-VN'),
            'currentYear': new Date().getFullYear().toString(),
            'currentMonth': (new Date().getMonth() + 1).toString(),
            'currentTime': new Date().toLocaleTimeString('vi-VN'),
            'revenue': '1,000,000,000 VNĐ',
            'profit': '200,000,000 VNĐ',
            'taxAmount': '50,000,000 VNĐ',
            'taxRate': '5%',
            'currency': 'VNĐ',
            'status': 'Đã nộp',
            'note': 'Hồ sơ hoàn chỉnh'
        };
        
        return examples[field] || 'Ví dụ dữ liệu';
    }

    // Quét tất cả trang
    async scanAllPages() {
        console.log('🚀 Bắt đầu quét tất cả trang...');
        
        for (const page of this.pages) {
            await this.scanPage(page);
            // Delay nhỏ để tránh overload
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log('✅ Đã quét xong tất cả trang');
        return this.generateReport();
    }

    // Lấy danh sách trang cần quét
    getPagesList() {
        return this.pages;
    }

    // Thêm trang vào danh sách quét
    addPage(pageName) {
        if (!this.pages.includes(pageName)) {
            this.pages.push(pageName);
            console.log(`📄 Đã thêm trang: ${pageName}`);
        }
    }

    // Xóa trang khỏi danh sách quét
    removePage(pageName) {
        const index = this.pages.indexOf(pageName);
        if (index > -1) {
            this.pages.splice(index, 1);
            console.log(`🗑️ Đã xóa trang: ${pageName}`);
        }
    }

    // Lấy thông tin hệ thống
    getSystemInfo() {
        return {
            version: '1.0',
            totalPages: this.pages.length,
            scannedPages: Object.keys(this.scanResults).length,
            lastScan: this.scanResults.length > 0 ? Math.max(...Object.values(this.scanResults).map(r => r.timestamp)) : null
        };
    }
}

// ===== GLOBAL FUNCTIONS =====
// Để có thể gọi từ admin interface

// Khởi tạo scanner
window.createPlaceholderScanner = function() {
    return new PlaceholderScanner();
};

// Quét tất cả trang
window.scanAllPages = async function() {
    const scanner = new PlaceholderScanner();
    return await scanner.scanAllPages();
};

// Quét một trang cụ thể
window.scanPage = async function(pageName) {
    const scanner = new PlaceholderScanner();
    return await scanner.scanPage(pageName);
};

console.log('🔍 Placeholder Scanner v1.0 loaded successfully!');
