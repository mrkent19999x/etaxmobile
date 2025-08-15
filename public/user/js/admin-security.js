/**
 * 🔒 ADMIN SECURITY SYSTEM
 * Hệ thống bảo mật chung cho tất cả trang admin
 * Áp dụng cho toàn bộ dự án eTax
 */

// ===== ADMIN CREDENTIALS =====
const ADMIN_CREDENTIALS = {
    'admin': 'Baoan2022@',
    'nghia': 'nghia2024'
};

// ===== SECURITY FUNCTIONS =====

/**
 * Kiểm tra quyền truy cập admin
 * @returns {boolean} true nếu có quyền, false nếu không
 */
function checkAdminAccess() {
    const adminData = localStorage.getItem('etax_admin');
    
    if (!adminData) {
        console.log('🔒 Không có session admin');
        redirectToLogin();
        return false;
    }
    
    try {
        const admin = JSON.parse(adminData);
        
        // Kiểm tra format dữ liệu
        if (!admin.username || !admin.isLoggedIn || !admin.expiresAt) {
            console.log('🔒 Format session admin không hợp lệ');
            clearAdminSession();
            redirectToLogin();
            return false;
        }
        
        // Kiểm tra thời gian hết hạn
        if (admin.expiresAt < Date.now()) {
            console.log('🔒 Session admin đã hết hạn');
            clearAdminSession();
            redirectToLogin();
            return false;
        }
        
        // Kiểm tra username có hợp lệ không
        if (!ADMIN_CREDENTIALS[admin.username]) {
            console.log('🔒 Username admin không hợp lệ');
            clearAdminSession();
            redirectToLogin();
            return false;
        }
        
        console.log('✅ Admin access granted:', admin.username);
        return true;
        
    } catch (error) {
        console.error('🔒 Lỗi parse admin session:', error);
        clearAdminSession();
        redirectToLogin();
        return false;
    }
}

/**
 * Tạo session admin mới
 * @param {string} username - Tên đăng nhập admin
 * @param {string} password - Mật khẩu admin
 * @returns {boolean} true nếu đăng nhập thành công
 */
function createAdminSession(username, password) {
    if (!ADMIN_CREDENTIALS[username] || ADMIN_CREDENTIALS[username] !== password) {
        console.log('🔒 Thông tin đăng nhập không đúng');
        return false;
    }
    
    const adminData = {
        username: username,
        isLoggedIn: true,
        loginTime: new Date().toISOString(),
        expiresAt: Date.now() + (24 * 60 * 60 * 1000), // 24 giờ
        lastActivity: Date.now()
    };
    
    localStorage.setItem('etax_admin', JSON.stringify(adminData));
    console.log('✅ Admin session created:', username);
    return true;
}

/**
 * Cập nhật thời gian hoạt động cuối
 */
function updateAdminActivity() {
    const adminData = localStorage.getItem('etax_admin');
    if (adminData) {
        try {
            const admin = JSON.parse(adminData);
            admin.lastActivity = Date.now();
            localStorage.setItem('etax_admin', JSON.stringify(admin));
        } catch (error) {
            console.error('🔒 Lỗi cập nhật activity:', error);
        }
    }
}

/**
 * Xóa session admin
 */
function clearAdminSession() {
    localStorage.removeItem('etax_admin');
    console.log('🔒 Admin session cleared');
}

/**
 * Chuyển hướng về trang đăng nhập
 */
function redirectToLogin() {
    window.location.href = '/admin/admin-login.html';
}

/**
 * Lấy thông tin admin hiện tại
 * @returns {object|null} Thông tin admin hoặc null
 */
function getCurrentAdmin() {
    const adminData = localStorage.getItem('etax_admin');
    if (!adminData) return null;
    
    try {
        return JSON.parse(adminData);
    } catch (error) {
        console.error('🔒 Lỗi parse admin data:', error);
        return null;
    }
}

/**
 * Logout admin
 */
function adminLogout() {
    clearAdminSession();
    redirectToLogin();
}

// ===== AUTO SECURITY CHECKS =====

// Kiểm tra bảo mật khi load trang (CHỈ CHẠY TRÊN TRANG ADMIN, KHÔNG CHẠY TRÊN TRANG LOGIN)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔒 Admin Security System loaded');
    
    // ✅ KIỂM TRA: Chỉ chạy security check nếu KHÔNG phải trang login
    const currentPage = window.location.pathname;
    const isLoginPage = currentPage.includes('/admin/admin-login.html') || 
                       currentPage.includes('login.html') ||
                       currentPage === '/' ||
                       currentPage === '/index.html';
    
    if (isLoginPage) {
        console.log('🔒 Login page detected - skipping security check');
        return; // Không chạy security check trên trang login
    }
    
    // Kiểm tra quyền truy cập (chỉ trên trang admin)
    if (!checkAdminAccess()) {
        return;
    }
    
    // Cập nhật activity
    updateAdminActivity();
    
    // Kiểm tra activity định kỳ (mỗi 5 phút)
    setInterval(() => {
        const admin = getCurrentAdmin();
        if (admin && (Date.now() - admin.lastActivity) > (30 * 60 * 1000)) { // 30 phút không hoạt động
            console.log('🔒 Admin session timeout due to inactivity');
            clearAdminSession();
            redirectToLogin();
        }
    }, 5 * 60 * 1000);
    
    // Cập nhật activity khi user tương tác
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, updateAdminActivity, { passive: true });
    });
});

// ===== EXPORT FUNCTIONS =====
window.AdminSecurity = {
    checkAdminAccess,
    createAdminSession,
    updateAdminActivity,
    clearAdminSession,
    redirectToLogin,
    getCurrentAdmin,
    adminLogout
};
