/**
 * 🎨 THEME MANAGER - HỆ THỐNG QUẢN LÝ GIAO DIỆN ĐỘNG
 * Version: 1.0
 * Author: Cipher (Bác sĩ Mã Nguồn)
 * Date: 2025-01-08
 */

class ThemeManager {
    constructor() {
        this.currentTheme = 'corporate';
        this.themes = this.initializeThemes();
        this.userConfig = {};
    }

    // Khởi tạo các theme chuẩn
    initializeThemes() {
        return {
            // 🏢 THEME DOANH NGHIỆP
            "corporate": {
                name: "Doanh nghiệp",
                description: "Giao diện chuyên nghiệp cho doanh nghiệp",
                colors: {
                    primary: "#1976d2",        // Blue chủ đạo
                    secondary: "#ff5722",      // Orange phụ
                    success: "#4caf50",        // Green thành công
                    warning: "#ff9800",        // Amber cảnh báo
                    error: "#f44336",          // Red lỗi
                    background: "#f5f7fa",     // Xám nhạt nền
                    surface: "#ffffff",        // Trắng surface
                    text: "#212121",           // Đen chữ chính
                    textSecondary: "#757575"   // Xám chữ phụ
                },
                layout: {
                    type: "sidebar-left",
                    sidebarWidth: "280px",
                    headerHeight: "64px",
                    contentPadding: "24px",
                    borderRadius: "8px"
                },
                typography: {
                    fontFamily: "'Roboto', 'SF Pro Display', sans-serif",
                    fontSize: {
                        h1: "2.5rem",
                        h2: "2rem", 
                        h3: "1.75rem",
                        body: "1rem",
                        small: "0.875rem"
                    },
                    fontWeight: {
                        light: 300,
                        normal: 400,
                        medium: 500,
                        bold: 700
                    }
                },
                features: ["dashboard", "tax", "report", "bank", "employee", "analytics"],
                components: {
                    button: "elevated",
                    card: "outlined", 
                    table: "striped",
                    form: "filled"
                }
            },

            // 👤 THEME CÁ NHÂN
            "individual": {
                name: "Cá nhân",
                description: "Giao diện thân thiện cho người dùng cá nhân",
                colors: {
                    primary: "#4caf50",        // Green chủ đạo
                    secondary: "#ffeb3b",      // Yellow phụ
                    success: "#8bc34a",        // Light green
                    warning: "#ff9800",        // Orange
                    error: "#f44336",          // Red
                    background: "#e8f5e8",     // Light green nền
                    surface: "#ffffff",        // Trắng
                    text: "#1b5e20",           // Dark green
                    textSecondary: "#4caf50"   // Medium green
                },
                layout: {
                    type: "top-nav",
                    sidebarWidth: "0px",
                    headerHeight: "56px", 
                    contentPadding: "16px",
                    borderRadius: "16px"
                },
                typography: {
                    fontFamily: "'Inter', 'SF Pro Display', sans-serif",
                    fontSize: {
                        h1: "2.25rem",
                        h2: "1.875rem",
                        h3: "1.5rem", 
                        body: "1rem",
                        small: "0.875rem"
                    },
                    fontWeight: {
                        light: 300,
                        normal: 400,
                        medium: 500,
                        bold: 600
                    }
                },
                features: ["dashboard", "tax", "personal", "calculator", "guide"],
                components: {
                    button: "contained",
                    card: "elevated",
                    table: "simple", 
                    form: "outlined"
                }
            },

            // 🏛️ THEME CƠ QUAN NHÀ NƯỚC
            "government": {
                name: "Cơ quan nhà nước",
                description: "Giao diện trang trọng cho cơ quan chính phủ",
                colors: {
                    primary: "#d32f2f",        // Red chủ đạo
                    secondary: "#ffc107",      // Gold phụ
                    success: "#388e3c",        // Green
                    warning: "#f57c00",        // Orange
                    error: "#d32f2f",          // Red
                    background: "#fff8e1",     // Light gold nền
                    surface: "#ffffff",        // Trắng
                    text: "#b71c1c",           // Dark red
                    textSecondary: "#d32f2f"   // Medium red
                },
                layout: {
                    type: "sidebar-right",
                    sidebarWidth: "300px",
                    headerHeight: "72px",
                    contentPadding: "32px", 
                    borderRadius: "4px"
                },
                typography: {
                    fontFamily: "'Times New Roman', 'serif'",
                    fontSize: {
                        h1: "2.75rem",
                        h2: "2.25rem",
                        h3: "1.875rem",
                        body: "1.125rem", 
                        small: "1rem"
                    },
                    fontWeight: {
                        light: 300,
                        normal: 400,
                        medium: 600,
                        bold: 700
                    }
                },
                features: ["dashboard", "official", "document", "approval", "seal", "archive"],
                components: {
                    button: "outlined",
                    card: "elevated",
                    table: "bordered",
                    form: "standard"
                }
            }
        };
    }

    // Áp dụng theme
    async applyTheme(themeName, userConfig = {}) {
        try {
            console.log(`🎨 Applying theme: ${themeName}`);
            
            const theme = this.themes[themeName];
            if (!theme) {
                console.error(`❌ Theme '${themeName}' not found`);
                return false;
            }

            // Merge với user config
            const finalTheme = this.mergeWithUserConfig(theme, userConfig);

            // Apply CSS variables
            this.applyCSSVariables(finalTheme);
            
            // Apply layout
            this.applyLayout(finalTheme);
            
            // Load theme CSS
            await this.loadThemeCSS(themeName);
            
            // Apply typography
            this.applyTypography(finalTheme);
            
            // Set current theme
            this.currentTheme = themeName;
            this.userConfig = userConfig;

            console.log(`✅ Theme '${themeName}' applied successfully`);
            
            // Trigger theme change event
            this.triggerThemeChangeEvent(themeName, finalTheme);
            
            return true;
        } catch (error) {
            console.error('❌ Error applying theme:', error);
            return false;
        }
    }

    // Áp dụng CSS variables
    applyCSSVariables(theme) {
        const root = document.documentElement;
        
        // Colors
        Object.keys(theme.colors).forEach(colorKey => {
            root.style.setProperty(`--color-${colorKey}`, theme.colors[colorKey]);
        });
        
        // Layout
        Object.keys(theme.layout).forEach(layoutKey => {
            root.style.setProperty(`--layout-${layoutKey}`, theme.layout[layoutKey]);
        });
        
        // Typography
        root.style.setProperty('--font-family', theme.typography.fontFamily);
        Object.keys(theme.typography.fontSize).forEach(sizeKey => {
            root.style.setProperty(`--font-size-${sizeKey}`, theme.typography.fontSize[sizeKey]);
        });
        Object.keys(theme.typography.fontWeight).forEach(weightKey => {
            root.style.setProperty(`--font-weight-${weightKey}`, theme.typography.fontWeight[weightKey]);
        });
    }

    // Áp dụng layout
    applyLayout(theme) {
        // Remove existing layout classes
        document.body.className = document.body.className.replace(/layout-\S+/g, '');
        document.body.className = document.body.className.replace(/theme-\S+/g, '');
        
        // Add new classes
        document.body.classList.add(`theme-${this.currentTheme}`);
        document.body.classList.add(`layout-${theme.layout.type}`);
        
        // Apply layout-specific attributes
        document.body.setAttribute('data-layout', theme.layout.type);
        document.body.setAttribute('data-theme', this.currentTheme);
    }

    // Load theme-specific CSS
    async loadThemeCSS(themeName) {
        return new Promise((resolve) => {
            // Remove existing theme CSS
            const existingThemeCSS = document.querySelector('link[data-theme-css]');
            if (existingThemeCSS) {
                existingThemeCSS.remove();
            }
            
            // Load new theme CSS
            const themeCSS = document.createElement('link');
            themeCSS.rel = 'stylesheet';
            themeCSS.href = `css/themes/${themeName}.css`;
            themeCSS.setAttribute('data-theme-css', themeName);
            themeCSS.onload = () => resolve();
            themeCSS.onerror = () => {
                console.warn(`⚠️ Theme CSS not found: ${themeName}.css`);
                resolve();
            };
            
            document.head.appendChild(themeCSS);
        });
    }

    // Áp dụng typography
    applyTypography(theme) {
        // Apply font family to body
        document.body.style.fontFamily = theme.typography.fontFamily;
    }

    // Merge theme với user config
    mergeWithUserConfig(theme, userConfig) {
        const merged = JSON.parse(JSON.stringify(theme)); // Deep clone
        
        // Override colors if user has custom colors
        if (userConfig.ui_preferences?.colors) {
            Object.assign(merged.colors, userConfig.ui_preferences.colors);
        }
        
        // Override layout if specified
        if (userConfig.ui_preferences?.layout) {
            Object.assign(merged.layout, userConfig.ui_preferences.layout);
        }
        
        // Override typography if specified
        if (userConfig.ui_preferences?.typography) {
            Object.assign(merged.typography, userConfig.ui_preferences.typography);
        }
        
        return merged;
    }

    // Trigger theme change event
    triggerThemeChangeEvent(themeName, theme) {
        const event = new CustomEvent('themeChanged', {
            detail: {
                themeName: themeName,
                theme: theme,
                userConfig: this.userConfig
            }
        });
        document.dispatchEvent(event);
    }

    // Get available themes
    getAvailableThemes() {
        return Object.keys(this.themes).map(key => ({
            key: key,
            name: this.themes[key].name,
            description: this.themes[key].description
        }));
    }

    // Get current theme
    getCurrentTheme() {
        return {
            key: this.currentTheme,
            theme: this.themes[this.currentTheme],
            userConfig: this.userConfig
        };
    }

    // Save user theme preference
    async saveUserThemePreference(mst, themeName, customConfig = {}) {
        try {
            if (firebase && firebase.database) {
                await firebase.database().ref(`user_configs/${mst}`).update({
                    theme: themeName,
                    ui_preferences: customConfig,
                    updated_at: new Date().toISOString()
                });
                console.log(`✅ Saved theme preference for ${mst}: ${themeName}`);
                return true;
            }
        } catch (error) {
            console.error('❌ Error saving theme preference:', error);
            return false;
        }
    }

    // Load user theme preference
    async loadUserThemePreference(mst) {
        try {
            if (firebase && firebase.database) {
                const snapshot = await firebase.database().ref(`user_configs/${mst}`).once('value');
                if (snapshot.exists()) {
                    const config = snapshot.val();
                    return {
                        theme: config.theme || 'corporate',
                        userConfig: config
                    };
                }
            }
        } catch (error) {
            console.error('❌ Error loading theme preference:', error);
        }
        
        return {
            theme: 'corporate',
            userConfig: {}
        };
    }

    // Auto-detect user type and suggest theme
    detectUserTypeTheme(userType) {
        const typeToTheme = {
            'company': 'corporate',
            'corporate': 'corporate', 
            'business': 'corporate',
            'individual': 'individual',
            'personal': 'individual',
            'government': 'government',
            'official': 'government',
            'state': 'government'
        };
        
        return typeToTheme[userType] || 'corporate';
    }
}

// Export for global usage
window.ThemeManager = ThemeManager;

// Auto-initialize
document.addEventListener('DOMContentLoaded', function() {
    if (!window.themeManager) {
        window.themeManager = new ThemeManager();
        console.log('🎨 Theme Manager initialized');
    }
});

console.log('🎨 Theme Manager v1.0 loaded successfully!');