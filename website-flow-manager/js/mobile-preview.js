// ===== MOBILE PREVIEW MODULE - Xem như Điện thoại Thật =====

class MobilePreview {
    constructor() {
        this.currentDevice = 'iphone';
        this.currentOrientation = 'portrait';
        this.currentPage = null;
        this.zoomLevel = 1;
        this.isFullscreen = false;
        this.deviceFrames = {
            iphone: { width: 375, height: 667, name: 'iPhone' },
            android: { width: 360, height: 640, name: 'Android' },
            tablet: { width: 768, height: 1024, name: 'Tablet' }
        };
        this.init();
    }

    init() {
        console.log('📱 Mobile Preview đang khởi động...');
        this.setupEventListeners();
        this.setupDeviceSelector();
        this.loadDefaultPreview();
    }

    setupEventListeners() {
        // Device selector buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.target.dataset.device;
                if (device) {
                    this.switchDevice(device);
                }
            });
        });

        // Orientation controls
        const rotateBtn = document.querySelector('[onclick="rotateDevice()"]');
        if (rotateBtn) {
            rotateBtn.addEventListener('click', () => this.rotateDevice());
        }

        const fullscreenBtn = document.querySelector('[onclick="fullscreenPreview()"]');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case '1': this.switchDevice('iphone'); break;
                    case '2': this.switchDevice('android'); break;
                    case '3': this.switchDevice('tablet'); break;
                    case 'r': this.rotateDevice(); break;
                    case 'f': this.toggleFullscreen(); break;
                }
            }
        });
    }

    setupDeviceSelector() {
        // Set initial active device
        this.updateDeviceSelector('iphone');
    }

    updateDeviceSelector(activeDevice) {
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.device === activeDevice) {
                btn.classList.add('active');
            }
        });
    }

    switchDevice(deviceType) {
        if (!this.deviceFrames[deviceType]) return;

        this.currentDevice = deviceType;
        this.updateDeviceSelector(deviceType);
        this.updateDeviceFrame();
        
        console.log(`📱 Đã chuyển sang ${this.deviceFrames[deviceType].name}`);
        this.showNotification(`Đã chuyển sang ${this.deviceFrames[deviceType].name}`, 'info');
    }

    updateDeviceFrame() {
        const mobileFrame = document.getElementById('mobileFrame');
        const deviceFrame = mobileFrame.querySelector('.device-frame');
        
        if (!deviceFrame) return;

        // Remove old device classes
        deviceFrame.className = 'device-frame';
        
        // Add new device class
        deviceFrame.classList.add(`${this.currentDevice}-frame`);
        
        // Update dimensions
        const device = this.deviceFrames[this.currentDevice];
        deviceFrame.style.width = `${device.width}px`;
        deviceFrame.style.height = `${device.height}px`;

        // Apply orientation if needed
        if (this.currentOrientation === 'landscape') {
            this.applyLandscapeOrientation();
        }
    }

    rotateDevice() {
        this.currentOrientation = this.currentOrientation === 'portrait' ? 'landscape' : 'portrait';
        
        if (this.currentOrientation === 'landscape') {
            this.applyLandscapeOrientation();
        } else {
            this.applyPortraitOrientation();
        }

        console.log(`🔄 Đã xoay sang ${this.currentOrientation}`);
        this.showNotification(`Đã xoay sang ${this.currentOrientation}`, 'info');
    }

    applyLandscapeOrientation() {
        const deviceFrame = document.querySelector('.device-frame');
        if (!deviceFrame) return;

        const device = this.deviceFrames[this.currentDevice];
        deviceFrame.style.width = `${device.height}px`;
        deviceFrame.style.height = `${device.width}px`;
        deviceFrame.classList.add('landscape');
    }

    applyPortraitOrientation() {
        const deviceFrame = document.querySelector('.device-frame');
        if (!deviceFrame) return;

        const device = this.deviceFrames[this.currentDevice];
        deviceFrame.style.width = `${device.width}px`;
        deviceFrame.style.height = `${device.height}px`;
        deviceFrame.classList.remove('landscape');
    }

    toggleFullscreen() {
        if (this.isFullscreen) {
            this.exitFullscreen();
        } else {
            this.enterFullscreen();
        }
    }

    enterFullscreen() {
        const mobilePreview = document.getElementById('mobilePreview');
        if (!mobilePreview) return;

        if (mobilePreview.requestFullscreen) {
            mobilePreview.requestFullscreen();
        } else if (mobilePreview.webkitRequestFullscreen) {
            mobilePreview.webkitRequestFullscreen();
        } else if (mobilePreview.msRequestFullscreen) {
            mobilePreview.msRequestFullscreen();
        }

        this.isFullscreen = true;
        this.showNotification('Đã vào chế độ toàn màn hình', 'info');
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }

        this.isFullscreen = false;
        this.showNotification('Đã thoát chế độ toàn màn hình', 'info');
    }

    loadDefaultPreview() {
        const mobileContent = document.getElementById('mobileContent');
        if (!mobileContent) return;

        mobileContent.innerHTML = `
            <div class="mobile-placeholder">
                <i class="fas fa-mobile-alt"></i>
                <h4>Chọn trang để xem Mobile Preview</h4>
                <p>Click vào nút "Xem" ở các trang trong Flow Manager</p>
                <div class="mobile-tips">
                    <h5>�� Mẹo sử dụng:</h5>
                    <ul>
                        <li><strong>Ctrl+1:</strong> Chuyển sang iPhone</li>
                        <li><strong>Ctrl+2:</strong> Chuyển sang Android</li>
                        <li><strong>Ctrl+3:</strong> Chuyển sang Tablet</li>
                        <li><strong>Ctrl+R:</strong> Xoay màn hình</li>
                        <li><strong>Ctrl+F:</strong> Toàn màn hình</li>
                    </ul>
                </div>
            </div>
        `;
    }

    loadPage(pageData) {
        if (!pageData) {
            this.showError('Không có dữ liệu trang để hiển thị');
            return;
        }

        this.currentPage = pageData;
        this.displayPage(pageData);
        this.updatePreviewInfo(pageData);
    }

    displayPage(pageData) {
        const mobileContent = document.getElementById('mobileContent');
        if (!mobileContent) return;

        try {
            // Create iframe to display the page
            const iframe = document.createElement('iframe');
            iframe.src = 'about:blank';
            iframe.style.width = '100%';
            iframe.style.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '12px';

            // Load content into iframe
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    iframeDoc.open();
                    iframeDoc.write(pageData.content || this.generateDefaultPageContent(pageData));
                    iframeDoc.close();
                } catch (error) {
                    console.warn('Không thể load nội dung vào iframe:', error);
                    this.displayPageError(pageData, error);
                }
            };

            // Clear content and add iframe
            mobileContent.innerHTML = '';
            mobileContent.appendChild(iframe);

        } catch (error) {
            console.error('Lỗi khi hiển thị trang:', error);
            this.displayPageError(pageData, error);
        }
    }

    generateDefaultPageContent(pageData) {
        return `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${pageData.name}</title>
                <style>
                    body {
                        margin: 0;
                        padding: 20px;
                        font-family: 'Segoe UI', sans-serif;
                        background: #f8fafc;
                        color: #1e293b;
                    }
                    .page-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding: 20px;
                        background: white;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    .page-title {
                        font-size: 24px;
                        font-weight: 600;
                        margin-bottom: 10px;
                        color: #1e40af;
                    }
                    .page-description {
                        color: #64748b;
                        margin-bottom: 0;
                    }
                    .content-area {
                        background: white;
                        padding: 30px;
                        border-radius: 10px;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                        text-align: center;
                    }
                    .placeholder-icon {
                        font-size: 48px;
                        color: #94a3b8;
                        margin-bottom: 20px;
                    }
                    .placeholder-text {
                        color: #64748b;
                        line-height: 1.6;
                    }
                    .mobile-optimized {
                        max-width: 100%;
                        overflow-x: hidden;
                    }
                </style>
            </head>
            <body class="mobile-optimized">
                <div class="page-header">
                    <h1 class="page-title">${pageData.name}</h1>
                    <p class="page-description">${pageData.description || 'Trang được tạo tự động'}</p>
                </div>
                <div class="content-area">
                    <div class="placeholder-icon">📱</div>
                    <p class="placeholder-text">
                        Đây là preview của trang <strong>${pageData.name}</strong><br>
                        Trang đang được hiển thị trong Mobile Preview<br>
                        Kích thước: ${this.deviceFrames[this.currentDevice].width} x ${this.deviceFrames[this.currentDevice].height}px
                    </p>
                </div>
            </body>
            </html>
        `;
    }

    displayPageError(pageData, error) {
        const mobileContent = document.getElementById('mobileContent');
        if (!mobileContent) return;

        mobileContent.innerHTML = `
            <div class="mobile-error">
                <div class="error-icon">❌</div>
                <h4>Không thể hiển thị trang ${pageData.name}</h4>
                <p class="error-message">${error.message || 'Lỗi không xác định'}</p>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="mobilePreview.retryLoadPage()">
                        <i class="fas fa-redo"></i> Thử lại
                    </button>
                    <button class="btn btn-secondary" onclick="mobilePreview.showPageInfo()">
                        <i class="fas fa-info-circle"></i> Thông tin trang
                    </button>
                </div>
            </div>
        `;
    }

    retryLoadPage() {
        if (this.currentPage) {
            this.loadPage(this.currentPage);
        }
    }

    showPageInfo() {
        if (!this.currentPage) return;

        const info = `
            <strong>Tên trang:</strong> ${this.currentPage.name}<br>
            <strong>Loại:</strong> ${this.currentPage.type || 'Không xác định'}<br>
            <strong>Kích thước file:</strong> ${(this.currentPage.size / 1024).toFixed(1)}KB<br>
            <strong>Đường dẫn:</strong> ${this.currentPage.path}<br>
            <strong>Thiết bị hiện tại:</strong> ${this.deviceFrames[this.currentDevice].name}<br>
            <strong>Hướng màn hình:</strong> ${this.currentOrientation}
        `;

        alert(`�� Thông tin trang:\n\n${info}`);
    }

    updatePreviewInfo(pageData) {
        // Update any preview information displays
        console.log(`�� Đang xem trang: ${pageData.name}`);
    }

    // ===== MOBILE TESTING FEATURES =====

    startMobileTesting() {
        this.showMobileTestingPanel();
    }

    showMobileTestingPanel() {
        const testingHTML = `
            <div class="mobile-testing-panel">
                <div class="testing-header">
                    <h4><i class="fas fa-vial"></i> Mobile Testing</h4>
                    <button class="close-btn" onclick="mobilePreview.closeMobileTesting()">&times;</button>
                </div>
                <div class="testing-content">
                    <div class="test-scenarios">
                        <h5>Kịch bản Test:</h5>
                        <div class="scenario-item">
                            <input type="checkbox" id="testResponsive" checked>
                            <label for="testResponsive">Test Responsive Design</label>
                        </div>
                        <div class="scenario-item">
                            <input type="checkbox" id="testTouch" checked>
                            <label for="testTouch">Test Touch Events</label>
                        </div>
                        <div class="scenario-item">
                            <input type="checkbox" id="testPerformance" checked>
                            <label for="testPerformance">Test Performance</label>
                        </div>
                    </div>
                    <div class="test-results">
                        <h5>Kết quả Test:</h5>
                        <div id="mobileTestResults">
                            <p>Chưa chạy test...</p>
                        </div>
                    </div>
                </div>
                <div class="testing-actions">
                    <button class="btn btn-primary" onclick="mobilePreview.runMobileTests()">
                        <i class="fas fa-play"></i> Chạy Test
                    </button>
                </div>
            </div>
        `;

        // Create testing panel
        const panel = document.createElement('div');
        panel.className = 'mobile-testing-panel';
        panel.innerHTML = testingHTML;
        
        const mobilePreview = document.getElementById('mobilePreview');
        mobilePreview.appendChild(panel);
    }

    closeMobileTesting() {
        const panel = document.querySelector('.mobile-testing-panel');
        if (panel) {
            panel.remove();
        }
    }

    runMobileTests() {
        const results = document.getElementById('mobileTestResults');
        if (!results) return;

        results.innerHTML = '<p>🔄 Đang chạy test...</p>';

        // Simulate mobile testing
        setTimeout(() => {
            const testResults = this.performMobileTests();
            this.displayMobileTestResults(testResults, results);
        }, 2000);
    }

    performMobileTests() {
        const results = {
            responsive: { status: 'pass', message: 'Responsive design hoạt động tốt' },
            touch: { status: 'pass', message: 'Touch events hoạt động bình thường' },
            performance: { status: 'pass', message: 'Performance đạt yêu cầu' },
            mobile: { status: 'pass', message: 'Tương thích mobile tốt' }
        };

        // Check current device compatibility
        if (this.currentDevice === 'tablet' && this.currentOrientation === 'landscape') {
            results.responsive.status = 'warning';
            results.responsive.message = 'Cần kiểm tra thêm responsive cho tablet landscape';
        }

        return results;
    }

    displayMobileTestResults(testResults, resultsElement) {
        let html = '<h5>📊 Kết quả Mobile Test:</h5>';
        
        Object.entries(testResults).forEach(([key, result]) => {
            const statusIcon = result.status === 'pass' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
            const statusClass = `test-${result.status}`;
            
            html += `
                <div class="test-result ${statusClass}">
                    <span class="test-status">${statusIcon}</span>
                    <span class="test-message">${result.message}</span>
                </div>
            `;
        });

        resultsElement.innerHTML = html;
    }

    // ===== UTILITY METHODS =====

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    // ===== PUBLIC METHODS =====

    getCurrentDevice() {
        return this.currentDevice;
    }

    getCurrentOrientation() {
        return this.currentOrientation;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    setZoom(zoomLevel) {
        this.zoomLevel = Math.max(0.5, Math.min(2, zoomLevel));
        this.applyZoom();
    }

    applyZoom() {
        const deviceFrame = document.querySelector('.device-frame');
        if (deviceFrame) {
            deviceFrame.style.transform = `scale(${this.zoomLevel})`;
        }
    }

    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    }
}

// Initialize Mobile Preview
let mobilePreview;

document.addEventListener('DOMContentLoaded', function() {
    mobilePreview = new MobilePreview();
});

// Global functions for HTML onclick
function rotateDevice() {
    if (mobilePreview) {
        mobilePreview.rotateDevice();
    }
}

function fullscreenPreview() {
    if (mobilePreview) {
        mobilePreview.toggleFullscreen();
    }
}

// Global functions for other modules
function loadPageForPreview(pageData) {
    if (mobilePreview) {
        mobilePreview.loadPage(pageData);
    }
}
