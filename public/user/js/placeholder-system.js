// ===== PLACEHOLDER SYSTEM - HỆ THỐNG QUẢN LÝ PLACEHOLDER =====
// Version: 1.0
// Author: Cipher (Bác sĩ Mã Nguồn)
// Date: 2025-01-08

class PlaceholderSystem {
    constructor() {
        this.placeholders = {};
        this.userData = {};
        this.isInitialized = false;
        this.debugMode = false;
        this.fallbackEnabled = true;
    }

    // Khởi tạo hệ thống
    async initialize() {
        try {
            console.log('🚀 Khởi tạo Placeholder System...');
            
            // Load dữ liệu user từ Firebase
            await this.loadUserData();
            
            // Định nghĩa placeholder patterns
            this.definePlaceholders();
            
            // Replace tất cả placeholder trong trang
            this.replaceAllPlaceholders();
            
            this.isInitialized = true;
            console.log('✅ Placeholder System đã khởi tạo thành công');
            
            // Log activity
            this.logActivity('system_initialized', {
                userMST: this.userData.mst || 'unknown',
                placeholdersCount: Object.keys(this.placeholders).length,
                page: window.location.pathname
            });
            
        } catch (error) {
            console.error('❌ Lỗi khởi tạo Placeholder System:', error);
            this.logActivity('system_error', { error: error.message });
        }
    }

    // Load dữ liệu user từ Firebase
    async loadUserData() {
        try {
            // Lấy user ID từ localStorage
            const userData = localStorage.getItem('etax_user');
            const loggedInUser = localStorage.getItem('etax_logged_in_user');
            
            if (!userData && !loggedInUser) {
                console.warn('⚠️ Chưa có thông tin user, sử dụng dữ liệu mặc định');
                this.userData = this.getDefaultUserData();
                return;
            }

            let userId = null;
            
            // Ưu tiên userData từ localStorage
            if (userData) {
                const user = JSON.parse(userData);
                userId = user.id || user.mst;
                this.userData = user;
            } else if (loggedInUser) {
                userId = loggedInUser;
            }

            if (!userId) {
                console.warn('⚠️ Không tìm thấy user ID, sử dụng dữ liệu mặc định');
                this.userData = this.getDefaultUserData();
                return;
            }

            // Load từ Firebase Realtime Database
            const userRef = firebase.database().ref(`users/${userId}`);
            const snapshot = await userRef.once('value');
            
            if (snapshot.exists()) {
                this.userData = snapshot.val();
                console.log('✅ Đã load dữ liệu user thật từ Firebase:', this.userData);
            } else {
                console.warn('⚠️ Không tìm thấy dữ liệu user trong Firebase, sử dụng dữ liệu mặc định');
                this.userData = this.getDefaultUserData();
            }
        } catch (error) {
            console.error('❌ Lỗi load dữ liệu user:', error);
            this.userData = this.getDefaultUserData();
        }
    }

    // Định nghĩa tất cả placeholder patterns
    definePlaceholders() {
        this.placeholders = {
            // === THÔNG TIN CƠ BẢN ===
            '{{mst}}': 'mst',
            '{{fullName}}': 'fullName',
            '{{company}}': 'company',
            '{{address}}': 'address',
            '{{phone}}': 'phone',
            '{{email}}': 'email',
            '{{representative}}': 'representative',
            '{{position}}': 'position',
            '{{idNumber}}': 'idNumber',
            '{{idIssueDate}}': 'idIssueDate',
            '{{idIssuePlace}}': 'idIssuePlace',
            
            // === THÔNG TIN THUẾ ===
            '{{taxDepartment}}': 'taxDepartment',
            '{{taxCode}}': 'taxCode',
            '{{businessType}}': 'businessType',
            '{{registrationDate}}': 'registrationDate',
            '{{businessLicense}}': 'businessLicense',
            '{{businessLicenseDate}}': 'businessLicenseDate',
            '{{businessLicensePlace}}': 'businessLicensePlace',
            '{{taxPeriod}}': 'taxPeriod',
            '{{taxYear}}': 'taxYear',
            
            // === THÔNG TIN NGÂN HÀNG ===
            '{{bankAccount}}': 'bankAccount',
            '{{bankName}}': 'bankName',
            '{{bankBranch}}': 'bankBranch',
            '{{bankCode}}': 'bankCode',
            
            // === THÔNG TIN ĐỊA CHỈ ===
            '{{province}}': 'province',
            '{{district}}': 'district',
            '{{ward}}': 'ward',
            '{{street}}': 'street',
            '{{houseNumber}}': 'houseNumber',
            
            // === THÔNG TIN LIÊN HỆ ===
            '{{mobilePhone}}': 'mobilePhone',
            '{{officePhone}}': 'officePhone',
            '{{fax}}': 'fax',
            '{{website}}': 'website',
            
            // === THÔNG TIN THỜI GIAN ===
            '{{currentDate}}': 'currentDate',
            '{{currentYear}}': 'currentYear',
            '{{currentMonth}}': 'currentMonth',
            '{{currentDay}}': 'currentDay',
            '{{currentTime}}': 'currentTime',
            
            // === THÔNG TIN TÀI CHÍNH ===
            '{{revenue}}': 'revenue',
            '{{profit}}': 'profit',
            '{{taxAmount}}': 'taxAmount',
            '{{taxRate}}': 'taxRate',
            '{{currency}}': 'currency',
            
            // === THÔNG TIN HỒ SƠ ===
            '{{documentNumber}}': 'documentNumber',
            '{{documentDate}}': 'documentDate',
            '{{documentType}}': 'documentType',
            '{{status}}': 'status',
            '{{note}}': 'note'
        };
    }

    // Thay thế tất cả placeholder trong trang
    replaceAllPlaceholders() {
        try {
            console.log('🔄 Bắt đầu thay thế placeholder...');
            
            let totalReplacements = 0;
            
            // Thay thế trong text content
            totalReplacements += this.replaceInTextContent();
            
            // Thay thế trong attributes
            totalReplacements += this.replaceInAttributes();
            
            // Thay thế trong form values
            totalReplacements += this.replaceInFormValues();
            
            console.log(`✅ Đã thay thế ${totalReplacements} placeholder`);
            
            // Log activity
            this.logActivity('placeholders_replaced', {
                count: totalReplacements,
                page: window.location.pathname
            });
            
        } catch (error) {
            console.error('❌ Lỗi thay thế placeholder:', error);
        }
    }

    // Thay thế trong text content
    replaceInTextContent() {
        let replacements = 0;
        
        // Tìm tất cả text nodes
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        // Thay thế trong từng text node
        textNodes.forEach(textNode => {
            let text = textNode.textContent;
            let originalText = text;
            
            Object.keys(this.placeholders).forEach(placeholder => {
                const field = this.placeholders[placeholder];
                const value = this.getFieldValue(field);
                
                if (text.includes(placeholder)) {
                    text = text.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), value);
                    replacements++;
                }
            });
            
            if (text !== originalText) {
                textNode.textContent = text;
            }
        });
        
        return replacements;
    }

    // Thay thế trong attributes
    replaceInAttributes() {
        let replacements = 0;
        
        const attributesToCheck = ['placeholder', 'title', 'alt', 'aria-label'];
        
        document.querySelectorAll('*').forEach(element => {
            attributesToCheck.forEach(attrName => {
                const attrValue = element.getAttribute(attrName);
                if (attrValue) {
                    let newValue = attrValue;
                    
                    Object.keys(this.placeholders).forEach(placeholder => {
                        const field = this.placeholders[placeholder];
                        const value = this.getFieldValue(field);
                        
                        if (newValue.includes(placeholder)) {
                            newValue = newValue.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), value);
                            replacements++;
                        }
                    });
                    
                    if (newValue !== attrValue) {
                        element.setAttribute(attrName, newValue);
                    }
                }
            });
        });
        
        return replacements;
    }

    // Thay thế trong form values
    replaceInFormValues() {
        let replacements = 0;
        
        document.querySelectorAll('input, textarea, select').forEach(element => {
            if (element.value) {
                let newValue = element.value;
                
                Object.keys(this.placeholders).forEach(placeholder => {
                    const field = this.placeholders[placeholder];
                    const value = this.getFieldValue(field);
                    
                    if (newValue.includes(placeholder)) {
                        newValue = newValue.replace(new RegExp(this.escapeRegExp(placeholder), 'g'), value);
                        replacements++;
                    }
                });
                
                if (newValue !== element.value) {
                    element.value = newValue;
                }
            }
        });
        
        return replacements;
    }

    // Lấy giá trị field với fallback
    getFieldValue(field) {
        // Ưu tiên dữ liệu user
        if (this.userData[field]) {
            return this.userData[field];
        }
        
        // Fallback cho các field đặc biệt
        switch (field) {
            case 'currentDate':
                return new Date().toLocaleDateString('vi-VN');
            case 'currentYear':
                return new Date().getFullYear().toString();
            case 'currentMonth':
                return (new Date().getMonth() + 1).toString();
            case 'currentDay':
                return new Date().getDate().toString();
            case 'currentTime':
                return new Date().toLocaleTimeString('vi-VN');
            case 'currency':
                return 'VNĐ';
            case 'taxRate':
                return '5%';
            default:
                return this.fallbackEnabled ? this.getFallbackValue(field) : '';
        }
    }

    // Giá trị fallback
    getFallbackValue(field) {
        const fallbackValues = {
            'mst': 'Chưa có MST',
            'fullName': 'Chưa có tên',
            'company': 'Chưa có công ty',
            'address': 'Chưa có địa chỉ',
            'phone': 'Chưa có SĐT',
            'email': 'Chưa có email',
            'bankAccount': 'Chưa có TKNH',
            'bankName': 'Chưa có ngân hàng',
            'taxDepartment': 'Chưa có chi cục thuế',
            'status': 'Chưa xác định'
        };
        
        return fallbackValues[field] || 'N/A';
    }

    // Dữ liệu mặc định cho test
    getDefaultUserData() {
        return {
            mst: '0123456789',
            fullName: 'Nguyễn Văn A',
            company: 'Công ty TNHH ABC',
            address: '123 Nguyễn Văn A, Quận 1, TP.HCM',
            phone: '0901234567',
            email: 'contact@abc.com.vn',
            representative: 'Nguyễn Văn A',
            position: 'Giám đốc',
            idNumber: '123456789012',
            idIssueDate: '01/01/2020',
            idIssuePlace: 'Công an TP.HCM',
            taxDepartment: 'Chi cục thuế Quận 1',
            taxCode: '0123456789',
            businessType: 'Công ty TNHH',
            registrationDate: '15/03/2020',
            businessLicense: 'GP123456789',
            businessLicenseDate: '15/03/2020',
            businessLicensePlace: 'Sở KH&ĐT TP.HCM',
            taxPeriod: 'Quý 4/2024',
            taxYear: '2024',
            bankAccount: '1234567890',
            bankName: 'Vietcombank',
            bankBranch: 'Chi nhánh TP.HCM',
            bankCode: 'VCB',
            province: 'TP.HCM',
            district: 'Quận 1',
            ward: 'Phường Bến Nghé',
            street: 'Nguyễn Văn A',
            houseNumber: '123',
            mobilePhone: '0901234567',
            officePhone: '0281234567',
            fax: '0281234568',
            website: 'www.abc.com.vn',
            revenue: '1,000,000,000 VNĐ',
            profit: '200,000,000 VNĐ',
            taxAmount: '50,000,000 VNĐ',
            taxRate: '5%',
            currency: 'VNĐ',
            documentNumber: 'HS001/2024',
            documentDate: new Date().toLocaleDateString('vi-VN'),
            documentType: 'Khai thuế',
            status: 'Đã nộp',
            note: 'Hồ sơ hoàn chỉnh'
        };
    }

    // Load user data by MST
    async loadUserByMST(mst) {
        try {
            const userRef = firebase.database().ref(`users/${mst}`);
            const snapshot = await userRef.once('value');
            
            if (snapshot.exists()) {
                this.userData = snapshot.val();
                this.definePlaceholders();
                this.replaceAllPlaceholders();
                console.log('✅ Đã load user data cho MST:', mst);
                return true;
            } else {
                console.warn('⚠️ Không tìm thấy user với MST:', mst);
                return false;
            }
        } catch (error) {
            console.error('❌ Lỗi load user by MST:', error);
            return false;
        }
    }

    // Get all users from Firebase
    async getAllUsers() {
        try {
            const usersRef = firebase.database().ref('users');
            const snapshot = await usersRef.once('value');
            
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                return {};
            }
        } catch (error) {
            console.error('❌ Lỗi load all users:', error);
            return {};
        }
    }

    // Test placeholder
    testPlaceholder(placeholderCode) {
        const field = this.placeholders[placeholderCode];
        if (field) {
            const value = this.getFieldValue(field);
            console.log(`🧪 Test ${placeholderCode}: ${value}`);
            return value;
        } else {
            console.warn(`⚠️ Không tìm thấy placeholder: ${placeholderCode}`);
            return null;
        }
    }

    // Test all placeholders
    testAllPlaceholders() {
        const results = {};
        Object.keys(this.placeholders).forEach(placeholder => {
            results[placeholder] = this.testPlaceholder(placeholder);
        });
        console.log('📊 Kết quả test tất cả placeholder:', results);
        return results;
    }

    // Enable/disable debug mode
    setDebugMode(enabled) {
        this.debugMode = enabled;
        console.log(`🔧 Debug mode: ${enabled ? 'ON' : 'OFF'}`);
    }

    // Enable/disable fallback
    setFallbackEnabled(enabled) {
        this.fallbackEnabled = enabled;
        console.log(`🔄 Fallback mode: ${enabled ? 'ON' : 'OFF'}`);
    }

    // Log activity
    logActivity(action, details = {}) {
        try {
            if (firebase && firebase.database) {
                firebase.database().ref('placeholder_logs').push({
                    action: action,
                    timestamp: Date.now(),
                    page: window.location.pathname,
                    userMST: this.userData.mst || 'unknown',
                    details: details
                });
            }
        } catch (error) {
            console.warn('⚠️ Không thể log activity:', error);
        }
    }

    // Utility: Escape regex
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Get system info
    getSystemInfo() {
        return {
            version: '1.0',
            initialized: this.isInitialized,
            debugMode: this.debugMode,
            fallbackEnabled: this.fallbackEnabled,
            placeholdersCount: Object.keys(this.placeholders).length,
            userMST: this.userData.mst || 'unknown',
            currentPage: window.location.pathname
        };
    }
}

// ===== AUTO INITIALIZATION =====
// Tự động khởi tạo khi DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra xem có cần khởi tạo placeholder system không
    const shouldInitialize = document.querySelector('*:not(script):not(style)')?.textContent?.includes('{{');
    
    if (shouldInitialize) {
        console.log('🏷️ Phát hiện placeholder trong trang, khởi tạo Placeholder System...');
        
        // Khởi tạo Firebase nếu chưa có
        if (typeof firebase === 'undefined') {
            console.warn('⚠️ Firebase chưa được load, sử dụng dữ liệu mặc định');
        }
        
        // Khởi tạo Placeholder System
        window.placeholderSystem = new PlaceholderSystem();
        window.placeholderSystem.initialize();
    } else {
        console.log('ℹ️ Không tìm thấy placeholder trong trang này');
    }
});

// ===== GLOBAL FUNCTIONS =====
// Để có thể gọi từ HTML

// Test placeholder từ HTML
window.testPlaceholder = function(code) {
    if (window.placeholderSystem) {
        return window.placeholderSystem.testPlaceholder(code);
    } else {
        console.warn('⚠️ Placeholder System chưa được khởi tạo');
        return null;
    }
};

// Test tất cả placeholder
window.testAllPlaceholders = function() {
    if (window.placeholderSystem) {
        return window.placeholderSystem.testAllPlaceholders();
    } else {
        console.warn('⚠️ Placeholder System chưa được khởi tạo');
        return {};
    }
};

// Lấy thông tin hệ thống
window.getPlaceholderSystemInfo = function() {
    if (window.placeholderSystem) {
        return window.placeholderSystem.getSystemInfo();
    } else {
        return { error: 'Placeholder System chưa được khởi tạo' };
    }
};

// Load user by MST
window.loadUserByMST = async function(mst) {
    if (window.placeholderSystem) {
        return await window.placeholderSystem.loadUserByMST(mst);
    } else {
        console.warn('⚠️ Placeholder System chưa được khởi tạo');
        return false;
    }
};

console.log('🏷️ Placeholder System v1.0 loaded successfully!');
