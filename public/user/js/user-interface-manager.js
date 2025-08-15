/**
 * 👤 USER INTERFACE MANAGER - QUẢN LÝ GIAO DIỆN NGƯỜI DÙNG
 * Version: 1.0
 * Author: Cipher (Bác sĩ Mã Nguồn)
 * Date: 2025-01-08
 * 
 * Hệ thống quản lý giao diện động cho từng người dùng
 */

class UserInterfaceManager {
    constructor() {
        this.currentUser = null;
        this.userConfig = {};
        this.layoutElements = {};
        this.isInitialized = false;
        this.defaultTheme = 'corporate';
        
        // Mapping user types to themes
        this.userTypeToTheme = {
            'company': 'corporate',
            'corporate': 'corporate',
            'business': 'corporate',
            'enterprise': 'corporate',
            'individual': 'individual', 
            'personal': 'individual',
            'citizen': 'individual',
            'government': 'government',
            'official': 'government',
            'state': 'government',
            'public': 'government'
        };
    }

    // Khởi tạo User Interface Manager
    async initialize() {
        try {
            console.log('👤 Khởi tạo User Interface Manager...');
            
            // Load current user từ localStorage hoặc Firebase
            await this.loadCurrentUser();
            
            // Determine theme dựa trên user
            const theme = this.determineUserTheme();
            
            // Initialize layout elements
            this.initializeLayoutElements();
            
            // Apply theme
            if (window.themeManager) {
                await window.themeManager.applyTheme(theme, this.userConfig);
                console.log(`🎨 Applied theme: ${theme} for user: ${this.currentUser?.mst || 'unknown'}`);
            }
            
            // Setup user interface
            this.setupUserInterface();
            
            // Setup event listeners
            this.setupEventListeners();
            
            this.isInitialized = true;
            console.log('✅ User Interface Manager khởi tạo thành công');
            
        } catch (error) {
            console.error('❌ Lỗi khởi tạo User Interface Manager:', error);
        }
    }

    // Load current user data
    async loadCurrentUser() {
        try {
            // Check localStorage first
            const loggedInUser = localStorage.getItem('etax_logged_in_user');
            const userData = localStorage.getItem('etax_user');
            
            let userId = null;
            
            if (userData) {
                const user = JSON.parse(userData);
                userId = user.id || user.mst;
                this.currentUser = user;
            } else if (loggedInUser) {
                userId = loggedInUser;
            }

            if (!userId) {
                console.warn('⚠️ Không tìm thấy user, sử dụng default');
                this.currentUser = this.getDefaultUser();
                return;
            }

            // Load user config từ Firebase
            if (firebase && firebase.database) {
                const userRef = firebase.database().ref(`users/${userId}`);
                const configRef = firebase.database().ref(`user_configs/${userId}`);
                
                // Load user data
                const userSnapshot = await userRef.once('value');
                if (userSnapshot.exists()) {
                    this.currentUser = userSnapshot.val();
                }
                
                // Load user config (theme preferences, etc.)
                const configSnapshot = await configRef.once('value');
                if (configSnapshot.exists()) {
                    this.userConfig = configSnapshot.val();
                }
                
                console.log('✅ Loaded user data:', this.currentUser);
                console.log('✅ Loaded user config:', this.userConfig);
            }
            
        } catch (error) {
            console.error('❌ Lỗi load user data:', error);
            this.currentUser = this.getDefaultUser();
        }
    }

    // Determine theme for current user
    determineUserTheme() {
        // Ưu tiên user preference
        if (this.userConfig.theme) {
            return this.userConfig.theme;
        }
        
        // Dựa trên business type
        if (this.currentUser?.businessType) {
            const businessType = this.currentUser.businessType.toLowerCase();
            for (const [key, theme] of Object.entries(this.userTypeToTheme)) {
                if (businessType.includes(key)) {
                    return theme;
                }
            }
        }
        
        // Dựa trên user type
        if (this.currentUser?.userType) {
            const userType = this.currentUser.userType.toLowerCase();
            return this.userTypeToTheme[userType] || this.defaultTheme;
        }
        
        // Auto detect từ MST pattern (experimental)
        if (this.currentUser?.mst) {
            const mst = this.currentUser.mst;
            // Government MSTs thường có pattern đặc biệt
            if (mst.startsWith('01') || mst.startsWith('02')) {
                return 'government';
            }
            // Corporate MSTs
            if (mst.length === 10 && !mst.startsWith('0')) {
                return 'corporate';
            }
            // Individual tax codes
            if (mst.length === 12) {
                return 'individual';
            }
        }
        
        return this.defaultTheme;
    }

    // Initialize layout elements
    initializeLayoutElements() {
        this.layoutElements = {
            header: document.querySelector('.app-header') || this.createHeader(),
            sidebar: document.querySelector('.app-sidebar') || this.createSidebar(),
            main: document.querySelector('.app-main') || this.createMain(),
            footer: document.querySelector('.app-footer') || this.createFooter()
        };
    }

    // Create header element
    createHeader() {
        const header = document.createElement('div');
        header.className = 'app-header';
        header.innerHTML = `
            <div class="header-brand">
                <h1>eTax Mobile</h1>
            </div>
            <div class="header-user">
                <span class="user-info">
                    <i class="fas fa-user"></i>
                    <span class="user-name">{{fullName}}</span>
                    <span class="user-mst">({{mst}})</span>
                </span>
                <button class="btn-theme-switcher" onclick="window.uiManager.showThemeSwitcher()">
                    <i class="fas fa-palette"></i>
                </button>
                <button class="btn-logout" onclick="window.uiManager.logout()">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
        
        // Insert at top of body
        document.body.insertBefore(header, document.body.firstChild);
        return header;
    }

    // Create sidebar element  
    createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.className = 'app-sidebar';
        sidebar.innerHTML = `
            <div class="nav-menu">
                <div class="nav-section">
                    <div class="nav-section-title">Dashboard</div>
                    <div class="nav-item active">
                        <a href="index.html" class="nav-link">
                            <i class="nav-icon fas fa-home"></i>
                            Trang chủ
                        </a>
                    </div>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Khai thuế</div>
                    <div class="nav-item">
                        <a href="hoso.html" class="nav-link">
                            <i class="nav-icon fas fa-file-alt"></i>
                            Hồ sơ thuế
                        </a>
                    </div>
                    <div class="nav-item">
                        <a href="tra-cuu-chung-tu.html" class="nav-link">
                            <i class="nav-icon fas fa-search"></i>
                            Tra cứu chứng từ
                        </a>
                    </div>
                </div>
                
                <div class="nav-section">
                    <div class="nav-section-title">Tài khoản</div>
                    <div class="nav-item">
                        <a href="thongtinnvt.html" class="nav-link">
                            <i class="nav-icon fas fa-user-circle"></i>
                            Thông tin cá nhân
                        </a>
                    </div>
                    <div class="nav-item">
                        <a href="doimatkhau.html" class="nav-link">
                            <i class="nav-icon fas fa-key"></i>
                            Đổi mật khẩu
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(sidebar);
        return sidebar;
    }

    // Create main content area
    createMain() {
        let main = document.querySelector('main') || document.querySelector('.container');
        if (!main) {
            main = document.createElement('div');
            main.className = 'app-main';
            document.body.appendChild(main);
        } else {
            main.classList.add('app-main');
        }
        return main;
    }

    // Create footer element
    createFooter() {
        const footer = document.createElement('div');
        footer.className = 'app-footer';
        footer.innerHTML = `
            <div class="footer-content">
                <span>© 2025 eTax Mobile - Powered by {{company}}</span>
                <span class="footer-theme">Theme: <span id="current-theme-name">Corporate</span></span>
            </div>
        `;
        
        document.body.appendChild(footer);
        return footer;
    }

    // Setup user interface based on current theme
    setupUserInterface() {
        // Update navigation based on user type
        this.updateNavigationForUser();
        
        // Update user info displays
        this.updateUserInfoDisplays();
        
        // Setup theme-specific features
        this.setupThemeFeatures();
        
        // Setup responsive behavior
        this.setupResponsiveBehavior();
    }

    // Update navigation based on user type
    updateNavigationForUser() {
        const navMenu = document.querySelector('.nav-menu');
        if (!navMenu) return;

        const userType = this.currentUser?.userType || 'individual';
        const theme = window.themeManager?.getCurrentTheme()?.key || this.defaultTheme;
        
        // Add theme-specific navigation items
        if (theme === 'government') {
            this.addGovernmentNavItems();
        } else if (theme === 'corporate') {
            this.addCorporateNavItems();
        } else if (theme === 'individual') {
            this.addIndividualNavItems();
        }
    }

    // Add government-specific nav items
    addGovernmentNavItems() {
        const navMenu = document.querySelector('.nav-menu');
        const govSection = document.createElement('div');
        govSection.className = 'nav-section';
        govSection.innerHTML = `
            <div class="nav-section-title">Công vụ</div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-stamp"></i>
                    Phê duyệt hồ sơ
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-archive"></i>
                    Lưu trữ tài liệu
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-chart-bar"></i>
                    Báo cáo thống kê
                </a>
            </div>
        `;
        navMenu.appendChild(govSection);
    }

    // Add corporate-specific nav items
    addCorporateNavItems() {
        const navMenu = document.querySelector('.nav-menu');
        const corpSection = document.createElement('div');
        corpSection.className = 'nav-section';
        corpSection.innerHTML = `
            <div class="nav-section-title">Doanh nghiệp</div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-building"></i>
                    Quản lý chi nhánh
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-users"></i>
                    Nhân viên
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-chart-line"></i>
                    Analytics
                </a>
            </div>
        `;
        navMenu.appendChild(corpSection);
    }

    // Add individual-specific nav items
    addIndividualNavItems() {
        const navMenu = document.querySelector('.nav-menu');
        const indSection = document.createElement('div');
        indSection.className = 'nav-section';
        indSection.innerHTML = `
            <div class="nav-section-title">Cá nhân</div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-calculator"></i>
                    Tính thuế nhanh
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-question-circle"></i>
                    Hướng dẫn
                </a>
            </div>
            <div class="nav-item">
                <a href="#" class="nav-link">
                    <i class="nav-icon fas fa-mobile-alt"></i>
                    Ứng dụng mobile
                </a>
            </div>
        `;
        navMenu.appendChild(indSection);
    }

    // Update user info displays
    updateUserInfoDisplays() {
        // Update current theme name
        const themeNameElement = document.getElementById('current-theme-name');
        if (themeNameElement && window.themeManager) {
            const currentTheme = window.themeManager.getCurrentTheme();
            themeNameElement.textContent = currentTheme.theme.name;
        }

        // Trigger placeholder replacement if available
        if (window.placeholderSystem) {
            window.placeholderSystem.replaceAllPlaceholders();
        }
    }

    // Setup theme-specific features
    setupThemeFeatures() {
        const theme = window.themeManager?.getCurrentTheme()?.key || this.defaultTheme;
        
        // Add theme-specific CSS classes
        document.body.classList.add(`ui-${theme}`);
        
        // Setup theme-specific behaviors
        switch (theme) {
            case 'government':
                this.setupGovernmentFeatures();
                break;
            case 'corporate':
                this.setupCorporateFeatures();
                break;
            case 'individual':
                this.setupIndividualFeatures();
                break;
        }
    }

    // Setup government-specific features
    setupGovernmentFeatures() {
        // Add official seal
        const header = document.querySelector('.app-header');
        if (header) {
            const seal = document.createElement('div');
            seal.className = 'official-seal';
            seal.textContent = 'CHÍNH THỨC';
            header.appendChild(seal);
        }

        // Add priority indicators
        document.querySelectorAll('.card').forEach((card, index) => {
            const priority = ['high', 'normal', 'low'][index % 3];
            card.classList.add(`priority-${priority}`);
        });
    }

    // Setup corporate-specific features
    setupCorporateFeatures() {
        // Add corporate branding
        const header = document.querySelector('.header-brand h1');
        if (header) {
            header.innerHTML = `
                <i class="fas fa-building"></i>
                eTax Corporate
            `;
        }

        // Add analytics widgets
        this.addAnalyticsWidgets();
    }

    // Setup individual-specific features
    setupIndividualFeatures() {
        // Add friendly greeting
        const main = document.querySelector('.app-main');
        if (main && !document.querySelector('.welcome-message')) {
            const welcome = document.createElement('div');
            welcome.className = 'welcome-message alert';
            welcome.innerHTML = `
                <h3>Xin chào {{fullName}}! 👋</h3>
                <p>Chúc bạn một ngày làm việc hiệu quả với eTax Mobile!</p>
            `;
            main.insertBefore(welcome, main.firstChild);
        }

        // Add quick actions
        this.addQuickActions();
    }

    // Add analytics widgets for corporate theme
    addAnalyticsWidgets() {
        const main = document.querySelector('.app-main');
        if (!main || document.querySelector('.analytics-widgets')) return;

        const widgets = document.createElement('div');
        widgets.className = 'analytics-widgets';
        widgets.innerHTML = `
            <div class="widget-grid">
                <div class="stat-card">
                    <div class="stat-number">{{revenue}}</div>
                    <div class="stat-label">Doanh thu</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{taxAmount}}</div>
                    <div class="stat-label">Số thuế phải nộp</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">{{taxRate}}</div>
                    <div class="stat-label">Thuế suất</div>
                </div>
            </div>
        `;
        main.appendChild(widgets);
    }

    // Add quick actions for individual theme
    addQuickActions() {
        const main = document.querySelector('.app-main');
        if (!main || document.querySelector('.quick-actions')) return;

        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        quickActions.innerHTML = `
            <h3>Thao tác nhanh</h3>
            <div class="quick-buttons">
                <button class="btn btn-primary" onclick="location.href='hoso.html'">
                    <i class="fas fa-file-plus"></i>
                    Tạo hồ sơ mới
                </button>
                <button class="btn btn-secondary" onclick="location.href='tra-cuu-chung-tu.html'">
                    <i class="fas fa-search"></i>
                    Tra cứu nhanh
                </button>
                <button class="btn btn-secondary" onclick="window.uiManager.openCalculator()">
                    <i class="fas fa-calculator"></i>
                    Tính thuế
                </button>
            </div>
        `;
        main.appendChild(quickActions);
    }

    // Setup responsive behavior
    setupResponsiveBehavior() {
        // Handle mobile menu toggle
        this.setupMobileMenuToggle();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });
    }

    // Setup mobile menu toggle
    setupMobileMenuToggle() {
        const header = document.querySelector('.app-header');
        const sidebar = document.querySelector('.app-sidebar');
        
        if (!header || !sidebar) return;

        // Add mobile menu button
        const menuBtn = document.createElement('button');
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        menuBtn.onclick = () => this.toggleMobileMenu();
        
        header.insertBefore(menuBtn, header.firstChild);
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const sidebar = document.querySelector('.app-sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    // Handle window resize
    handleWindowResize() {
        const sidebar = document.querySelector('.app-sidebar');
        if (window.innerWidth > 768 && sidebar) {
            sidebar.classList.remove('mobile-open');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Listen for theme changes
        document.addEventListener('themeChanged', (e) => {
            this.handleThemeChange(e.detail);
        });

        // Listen for user changes
        document.addEventListener('userChanged', (e) => {
            this.handleUserChange(e.detail);
        });
    }

    // Handle theme change
    handleThemeChange(themeDetail) {
        console.log('🎨 Theme changed to:', themeDetail.themeName);
        
        // Update UI elements
        this.updateUserInfoDisplays();
        
        // Re-setup theme features
        this.setupThemeFeatures();
        
        // Save preference
        if (this.currentUser?.mst) {
            window.themeManager?.saveUserThemePreference(
                this.currentUser.mst, 
                themeDetail.themeName, 
                themeDetail.userConfig
            );
        }
    }

    // Handle user change
    handleUserChange(userDetail) {
        console.log('👤 User changed:', userDetail);
        this.currentUser = userDetail.user;
        this.userConfig = userDetail.config || {};
        
        // Re-determine theme
        const newTheme = this.determineUserTheme();
        if (window.themeManager) {
            window.themeManager.applyTheme(newTheme, this.userConfig);
        }
    }

    // Show theme switcher dialog
    showThemeSwitcher() {
        if (!window.themeManager) return;

        const themes = window.themeManager.getAvailableThemes();
        const currentTheme = window.themeManager.getCurrentTheme();
        
        const dialog = document.createElement('div');
        dialog.className = 'theme-switcher-dialog';
        dialog.innerHTML = `
            <div class="dialog-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="dialog-content">
                <h3>Chọn giao diện</h3>
                <div class="theme-options">
                    ${themes.map(theme => `
                        <div class="theme-option ${theme.key === currentTheme.key ? 'active' : ''}" 
                             onclick="window.uiManager.switchTheme('${theme.key}')">
                            <div class="theme-preview theme-${theme.key}"></div>
                            <h4>${theme.name}</h4>
                            <p>${theme.description}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="dialog-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.theme-switcher-dialog').remove()">
                        Đóng
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(dialog);
    }

    // Switch theme
    async switchTheme(themeName) {
        if (window.themeManager) {
            await window.themeManager.applyTheme(themeName, this.userConfig);
        }
        
        // Close dialog
        const dialog = document.querySelector('.theme-switcher-dialog');
        if (dialog) dialog.remove();
    }

    // Open calculator
    openCalculator() {
        const calculator = document.createElement('div');
        calculator.className = 'calculator-widget';
        calculator.innerHTML = `
            <div class="widget-backdrop" onclick="this.parentElement.remove()"></div>
            <div class="widget-content">
                <h3>Tính thuế nhanh</h3>
                <div class="calc-form">
                    <div class="form-group">
                        <label>Doanh thu (VNĐ):</label>
                        <input type="number" id="revenue-input" class="form-control" placeholder="Nhập doanh thu">
                    </div>
                    <div class="form-group">
                        <label>Thuế suất (%):</label>
                        <select id="tax-rate-input" class="form-control">
                            <option value="0">0% (Không chịu thuế)</option>
                            <option value="5">5% (Thuế suất thông thường)</option>
                            <option value="10">10% (Thuế suất cao)</option>
                            <option value="20">20% (Thuế suất đặc biệt)</option>
                        </select>
                    </div>
                    <div class="calc-result">
                        <strong>Thuế phải nộp: <span id="tax-result">0 VNĐ</span></strong>
                    </div>
                </div>
                <div class="widget-actions">
                    <button class="btn btn-primary" onclick="window.uiManager.calculateTax()">Tính</button>
                    <button class="btn btn-secondary" onclick="this.closest('.calculator-widget').remove()">Đóng</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(calculator);
    }

    // Calculate tax
    calculateTax() {
        const revenue = parseFloat(document.getElementById('revenue-input').value) || 0;
        const taxRate = parseFloat(document.getElementById('tax-rate-input').value) || 0;
        
        const taxAmount = (revenue * taxRate) / 100;
        const resultElement = document.getElementById('tax-result');
        
        if (resultElement) {
            resultElement.textContent = new Intl.NumberFormat('vi-VN').format(taxAmount) + ' VNĐ';
        }
    }

    // Logout function
    logout() {
        localStorage.removeItem('etax_user');
        localStorage.removeItem('etax_logged_in_user');
        window.location.href = 'login.html';
    }

    // Switch user (for testing)
    async switchUser(mst) {
        try {
            if (firebase && firebase.database) {
                const userRef = firebase.database().ref(`users/${mst}`);
                const configRef = firebase.database().ref(`user_configs/${mst}`);
                
                const userSnapshot = await userRef.once('value');
                const configSnapshot = await configRef.once('value');
                
                if (userSnapshot.exists()) {
                    this.currentUser = userSnapshot.val();
                    this.userConfig = configSnapshot.exists() ? configSnapshot.val() : {};
                    
                    // Update localStorage
                    localStorage.setItem('etax_logged_in_user', mst);
                    localStorage.setItem('etax_user', JSON.stringify(this.currentUser));
                    
                    // Re-initialize
                    await this.initialize();
                    
                    console.log(`✅ Switched to user: ${mst}`);
                    return true;
                }
            }
        } catch (error) {
            console.error('❌ Error switching user:', error);
        }
        return false;
    }

    // Get default user for testing
    getDefaultUser() {
        return {
            mst: '0123456789',
            fullName: 'Nguyễn Văn A',
            company: 'Công ty TNHH ABC',
            userType: 'corporate',
            businessType: 'Công ty TNHH',
            address: '123 Nguyễn Văn A, Quận 1, TP.HCM',
            phone: '0901234567',
            email: 'contact@abc.com.vn'
        };
    }

    // Get system info
    getSystemInfo() {
        return {
            version: '1.0',
            initialized: this.isInitialized,
            currentUser: this.currentUser?.mst || 'unknown',
            theme: window.themeManager?.getCurrentTheme()?.key || 'unknown',
            layoutElements: Object.keys(this.layoutElements).length
        };
    }
}

// Export for global usage
window.UserInterfaceManager = UserInterfaceManager;

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!window.uiManager) {
        window.uiManager = new UserInterfaceManager();
        
        // Wait a bit for other systems to load
        setTimeout(() => {
            window.uiManager.initialize();
        }, 500);
        
        console.log('👤 User Interface Manager initialized');
    }
});

console.log('👤 User Interface Manager v1.0 loaded successfully!');