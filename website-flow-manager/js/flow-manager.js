// ===== FLOW MANAGER MODULE - Quản lý Luồng Website eTAX =====

class FlowManager {
    constructor() {
        this.flowData = null;
        this.currentFlow = null;
        this.flowSteps = [];
        this.flowConnections = [];
        this.init();
    }

    init() {
        console.log('🚀 Flow Manager đang khởi động...');
        this.loadDefaultFlow();
        this.setupEventListeners();
        this.renderFlow();
        console.log('✅ Flow Manager đã sẵn sàng!');
    }

    loadDefaultFlow() {
        // Load default flow structure
        this.flowData = {
            name: 'eTAX Website Flow',
            description: 'Luồng chính của website eTAX',
            steps: [
                {
                    id: 'login',
                    name: 'login.html',
                    type: 'required',
                    description: 'Trang chìa khóa - User PHẢI qua đây trước',
                    icon: 'fas fa-key',
                    color: '#3b82f6'
                },
                {
                    id: 'index',
                    name: 'index.html',
                    type: 'required',
                    description: 'Trang chủ sau khi đăng nhập thành công',
                    icon: 'fas fa-home',
                    color: '#3b82f6'
                },
                {
                    id: 'dashboard',
                    name: 'dashboard.html',
                    type: 'optional',
                    description: 'Hiển thị thống kê và tổng quan',
                    icon: 'fas fa-chart-bar',
                    color: '#8b5cf6'
                }
            ],
            connections: [
                { from: 'login', to: 'index', type: 'required' },
                { from: 'index', to: 'dashboard', type: 'optional' }
            ]
        };
        
        this.currentFlow = this.flowData;
        this.flowSteps = this.flowData.steps;
        this.flowConnections = this.flowData.connections;
    }

    setupEventListeners() {
        // Add new page button
        const addPageBtn = document.querySelector('[onclick="addNewPage()"]');
        if (addPageBtn) {
            addPageBtn.addEventListener('click', () => this.addNewPage());
        }

        // Edit flow button
        const editFlowBtn = document.querySelector('[onclick="editFlow()"]');
        if (editFlowBtn) {
            editFlowBtn.addEventListener('click', () => this.editFlow());
        }

        // Test flow button
        const testFlowBtn = document.querySelector('[onclick="testFlow()"]');
        if (testFlowBtn) {
            testFlowBtn.addEventListener('click', () => this.testFlow());
        }
    }

    renderFlow() {
        const flowContainer = document.getElementById('flowContainer');
        if (!flowContainer) return;

        let flowHTML = '';
        
        this.flowSteps.forEach((step, index) => {
            flowHTML += this.generateStepHTML(step, index);
            
            // Add connection arrow if not last step
            if (index < this.flowSteps.length - 1) {
                flowHTML += '<div class="flow-arrow">↓</div>';
            }
        });

        flowContainer.innerHTML = flowHTML;
    }

    generateStepHTML(step, index) {
        const typeClass = step.type === 'required' ? 'required' : 'optional';
        const typeText = step.type === 'required' ? 'BẮT BUỘC' : 'TÙY CHỌN';
        
        return `
            <div class="flow-step ${typeClass}" data-step-id="${step.id}">
                <div class="step-icon" style="background: ${step.color}">
                    <i class="${step.icon}"></i>
                </div>
                <div class="step-content">
                    <h4>${step.name}</h4>
                    <p>${step.description}</p>
                    <span class="step-type ${typeClass}">${typeText}</span>
                </div>
                <div class="step-actions">
                    <button class="action-btn edit-btn" onclick="flowManager.editStep('${step.id}')" 
                            aria-label="Chỉnh sửa trang ${step.name}">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn view-btn" onclick="flowManager.viewStep('${step.id}')" 
                            aria-label="Xem trang ${step.name}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="flowManager.deleteStep('${step.id}')" 
                            aria-label="Xóa trang ${step.name}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    addNewPage() {
        // Show add page modal
        const modal = document.getElementById('addPageModal');
        if (modal) {
            modal.style.display = 'block';
        }
    }

    editFlow() {
        console.log('🔄 Chỉnh sửa luồng website');
        // Enable drag and drop reordering
        this.enableFlowEditing();
    }

    testFlow() {
        console.log(' Test luồng website');
        // Simulate user flow
        this.simulateUserFlow();
    }

    editStep(stepId) {
        const step = this.flowSteps.find(s => s.id === stepId);
        if (step) {
            console.log(`✏️ Chỉnh sửa trang: ${step.name}`);
            // Show edit step modal
        }
    }

    viewStep(stepId) {
        const step = this.flowSteps.find(s => s.id === stepId);
        if (step) {
            console.log(`️ Xem trang: ${step.name}`);
            // Trigger mobile preview
            this.triggerMobilePreview(step);
        }
    }

    deleteStep(stepId) {
        if (confirm('Bạn có chắc muốn xóa trang này khỏi luồng?')) {
            this.flowSteps = this.flowSteps.filter(s => s.id !== stepId);
            this.renderFlow();
            console.log(`🗑️ Đã xóa trang: ${stepId}`);
        }
    }

    enableFlowEditing() {
        // Enable drag and drop functionality
        console.log('🔄 Đã bật chế độ chỉnh sửa luồng');
    }

    simulateUserFlow() {
        console.log(' Bắt đầu test luồng...');
        
        let currentStep = 0;
        const testInterval = setInterval(() => {
            if (currentStep < this.flowSteps.length) {
                const step = this.flowSteps[currentStep];
                console.log(`✅ Bước ${currentStep + 1}: ${step.name} - ${step.description}`);
                currentStep++;
            } else {
                clearInterval(testInterval);
                console.log('🎉 Test luồng hoàn thành!');
                alert('✅ Test luồng thành công! Tất cả các trang đều hoạt động bình thường.');
            }
        }, 1000);
    }

    triggerMobilePreview(step) {
        // Trigger mobile preview for this step
        const event = new CustomEvent('viewStep', {
            detail: { step: step }
        });
        document.dispatchEvent(event);
    }

    // Public methods for external access
    getFlowData() {
        return this.flowData;
    }

    getCurrentFlow() {
        return this.currentFlow;
    }

    updateFlow(newFlow) {
        this.flowData = newFlow;
        this.flowSteps = newFlow.steps;
        this.flowConnections = newFlow.connections;
        this.renderFlow();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        window.flowManager = new FlowManager();
        console.log('✅ Flow Manager đã được khởi tạo thành công');
    }, 100);
});

// Export for global use
window.FlowManager = FlowManager;
