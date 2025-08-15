/**
 * 🔒 SECURITY BLOCKER - CHẶN LINK RA NGOÀI
 * Áp dụng cho toàn bộ dự án eTax
 * Ngăn chặn mọi truy cập ra website bên ngoài
 */

(function() {
    'use strict';

    // ===== CẤU HÌNH BẢO MẬT =====
    const SECURITY_CONFIG = {
        allowedDomains: [
            window.location.hostname, // Domain hiện tại
            'etax-7fbf8.web.app',     // Firebase hosting
            'etax-7fbf8.firebaseapp.com' // Firebase app
        ],
        allowedProtocols: [
            'mailto:',  // Email
            'tel:',     // Phone
            'sms:',     // SMS
            '#'         // Anchor links
        ],
        blockMessage: '🔒 Bảo mật: Không được phép truy cập link bên ngoài hệ thống',
        logAttempts: true
    };

    // ===== LOGGING SYSTEM =====
    function logSecurityAttempt(url, type) {
        if (SECURITY_CONFIG.logAttempts) {
            console.warn(`🔒 SECURITY BLOCKED: ${type} attempt to ${url}`);
            
            // Gửi log lên Firebase nếu có
            if (typeof firebase !== 'undefined' && firebase.database) {
                const db = firebase.database();
                db.ref('securityLogs').push({
                    timestamp: new Date().toISOString(),
                    type: type,
                    blockedUrl: url,
                    userAgent: navigator.userAgent,
                    currentPage: window.location.href
                });
            }
        }
    }

    // ===== URL VALIDATION =====
    function isAllowedUrl(url) {
        try {
            const urlObj = new URL(url);
            
            // Kiểm tra domain được phép
            if (SECURITY_CONFIG.allowedDomains.includes(urlObj.hostname)) {
                return true;
            }
            
            // Kiểm tra protocol được phép
            for (const protocol of SECURITY_CONFIG.allowedProtocols) {
                if (url.startsWith(protocol)) {
                    return true;
                }
            }
            
            return false;
        } catch (e) {
            // URL không hợp lệ, chặn luôn
            return false;
        }
    }

    // ===== BLOCK CLICK EVENTS =====
    function blockExternalLinks(e) {
        const target = e.target.closest('a');
        if (target && target.href) {
            if (!isAllowedUrl(target.href)) {
                e.preventDefault();
                e.stopPropagation();
                alert(SECURITY_CONFIG.blockMessage);
                logSecurityAttempt(target.href, 'CLICK');
                return false;
            }
        }
    }

    // ===== BLOCK WINDOW.OPEN =====
    function blockWindowOpen() {
        const originalWindowOpen = window.open;
        window.open = function(url, target, features) {
            if (url && typeof url === 'string') {
                if (!isAllowedUrl(url)) {
                    alert(SECURITY_CONFIG.blockMessage);
                    logSecurityAttempt(url, 'WINDOW.OPEN');
                    return null;
                }
            }
            return originalWindowOpen.call(this, url, target, features);
        };
    }

    // ===== BLOCK LOCATION.HREF =====
    function blockLocationHref() {
        const originalLocationHref = Object.getOwnPropertyDescriptor(window.location, 'href');
        Object.defineProperty(window.location, 'href', {
            set: function(url) {
                if (url && typeof url === 'string') {
                    if (!isAllowedUrl(url)) {
                        alert(SECURITY_CONFIG.blockMessage);
                        logSecurityAttempt(url, 'LOCATION.HREF');
                        return;
                    }
                }
                originalLocationHref.set.call(this, url);
            },
            get: originalLocationHref.get
        });
    }

    // ===== BLOCK LOCATION.ASSIGN =====
    function blockLocationAssign() {
        const originalAssign = window.location.assign;
        window.location.assign = function(url) {
            if (url && typeof url === 'string') {
                if (!isAllowedUrl(url)) {
                    alert(SECURITY_CONFIG.blockMessage);
                    logSecurityAttempt(url, 'LOCATION.ASSIGN');
                    return;
                }
            }
            return originalAssign.call(this, url);
        };
    }

    // ===== BLOCK LOCATION.REPLACE =====
    function blockLocationReplace() {
        const originalReplace = window.location.replace;
        window.location.replace = function(url) {
            if (url && typeof url === 'string') {
                if (!isAllowedUrl(url)) {
                    alert(SECURITY_CONFIG.blockMessage);
                    logSecurityAttempt(url, 'LOCATION.REPLACE');
                    return;
                }
            }
            return originalReplace.call(this, url);
        };
    }

    // ===== BLOCK FORM SUBMISSION =====
    function blockFormSubmission(e) {
        const form = e.target;
        if (form.action) {
            if (!isAllowedUrl(form.action)) {
                e.preventDefault();
                alert(SECURITY_CONFIG.blockMessage);
                logSecurityAttempt(form.action, 'FORM_SUBMIT');
                return false;
            }
        }
    }

    // ===== BLOCK IFRAME SRC =====
    function blockIframeSrc() {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                mutation.addedNodes.forEach(function(node) {
                    if (node.nodeType === 1 && node.tagName === 'IFRAME') {
                        if (node.src && !isAllowedUrl(node.src)) {
                            node.remove();
                            alert(SECURITY_CONFIG.blockMessage);
                            logSecurityAttempt(node.src, 'IFRAME');
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ===== INITIALIZE SECURITY =====
    function initializeSecurity() {
        // Chặn click events
        document.addEventListener('click', blockExternalLinks, true);
        
        // Chặn window.open
        blockWindowOpen();
        
        // Chặn location.href
        blockLocationHref();
        
        // Chặn location.assign
        blockLocationAssign();
        
        // Chặn location.replace
        blockLocationReplace();
        
        // Chặn form submission
        document.addEventListener('submit', blockFormSubmission, true);
        
        // Chặn iframe src
        blockIframeSrc();
        
        console.log('🔒 Security Blocker đã được kích hoạt');
    }

    // ===== AUTO INITIALIZE =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeSecurity);
    } else {
        initializeSecurity();
    }

    // ===== EXPORT FOR MANUAL USE =====
    window.SecurityBlocker = {
        isAllowedUrl: isAllowedUrl,
        logSecurityAttempt: logSecurityAttempt,
        SECURITY_CONFIG: SECURITY_CONFIG
    };

})();
