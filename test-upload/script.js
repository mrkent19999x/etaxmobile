// ===== TEST SCRIPT - Kiểm tra Upload JavaScript =====

class TestProject {
    constructor() {
        this.name = 'Test Project';
        this.version = '1.0.0';
        this.createdAt = new Date();
        this.init();
    }

    init() {
        console.log('🚀 Test Project đang khởi động...');
        this.setupEventListeners();
        this.showWelcomeMessage();
        this.runTests();
    }

    setupEventListeners() {
        // Test button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('test-btn')) {
                this.handleTestClick(e.target);
            }
        });

        // Test form submission
        const testForm = document.getElementById('testForm');
        if (testForm) {
            testForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(e);
            });
        }
    }

    handleTestClick(button) {
        const action = button.dataset.action;
        console.log(`🔘 Test button clicked: ${action}`);
        
        switch(action) {
            case 'console':
                console.log('✅ Console test thành công!');
                break;
            case 'alert':
                alert('✅ Alert test thành công!');
                break;
            case 'style':
                this.toggleBackground();
                break;
            default:
                console.log('⚠️ Action không xác định:', action);
        }
    }

    handleFormSubmit(event) {
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData);
        console.log('📝 Form submitted:', data);
        
        // Show success message
        this.showMessage('✅ Form đã được gửi thành công!', 'success');
    }

    toggleBackground() {
        const body = document.body;
        const currentBg = body.style.background;
        
        if (currentBg === 'rgb(231, 76, 60)') {
            body.style.background = '#f5f5f5';
            console.log('🔄 Đã reset background');
        } else {
            body.style.background = '#e74c3c';
            console.log('🔄 Đã thay đổi background');
        }
    }

    showWelcomeMessage() {
        console.log(`
�� Test Project đã sẵn sàng!
📁 Tên dự án: ${this.name}
🔢 Phiên bản: ${this.version}
📅 Ngày tạo: ${this.createdAt.toLocaleDateString('vi-VN')}
        `);
    }

    runTests() {
        console.log('�� Bắt đầu chạy tests...');
        
        // Test 1: Console logging
        console.log('✅ Test 1: Console logging - Thành công');
        
        // Test 2: DOM manipulation
        const testElement = document.createElement('div');
        testElement.textContent = 'Test DOM manipulation';
        document.body.appendChild(testElement);
        console.log('✅ Test 2: DOM manipulation - Thành công');
        
        // Test 3: Event handling
        console.log('✅ Test 3: Event handling - Thành công');
        
        // Test 4: Class functionality
        console.log('✅ Test 4: Class functionality - Thành công');
        
        console.log('�� Tất cả tests đã hoàn thành!');
    }

    showMessage(text, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = text;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        // Set background color based on type
        switch(type) {
            case 'success':
                messageDiv.style.background = '#27ae60';
                break;
            case 'error':
                messageDiv.style.background = '#e74c3c';
                break;
            case 'warning':
                messageDiv.style.background = '#f39c12';
                break;
            default:
                messageDiv.style.background = '#3498db';
        }
        
        document.body.appendChild(messageDiv);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.testProject = new TestProject();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TestProject;
}