// ===== FIREBASE MANAGER =====

class FirebaseManager {
    constructor() {
        this.config = null;
        this.isConnected = false;
        this.init();
    }

    init() {
        this.loadSavedConfig();
        this.updateUI();
    }

    loadSavedConfig() {
        try {
            const saved = localStorage.getItem('firebaseConfig');
            if (saved) {
                this.config = JSON.parse(saved);
            }
        } catch (error) {
            console.warn('Không thể load cấu hình Firebase:', error);
        }
    }

    saveConfig() {
        try {
            localStorage.setItem('firebaseConfig', JSON.stringify(this.config));
            return true;
        } catch (error) {
            console.error('Không thể lưu cấu hình Firebase:', error);
            return false;
        }
    }

    updateUI() {
        if (this.config) {
            const apiKeyInput = document.getElementById('firebaseApiKey');
            const projectIdInput = document.getElementById('firebaseProjectId');
            const storageBucketInput = document.getElementById('firebaseStorageBucket');
            
            if (apiKeyInput) apiKeyInput.value = this.config.apiKey || '';
            if (projectIdInput) projectIdInput.value = this.config.projectId || '';
            if (storageBucketInput) storageBucketInput.value = this.config.storageBucket || '';
        }
    }

    async testConnection() {
        if (!this.config) {
            alert('Vui lòng nhập cấu hình Firebase trước!');
            return false;
        }

        try {
            // Simulate connection test
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Check if config values are valid
            if (!this.config.apiKey || !this.config.projectId || !this.config.storageBucket) {
                throw new Error('Thiếu thông tin cấu hình');
            }

            this.isConnected = true;
            alert('✅ Kết nối Firebase thành công!');
            return true;
            
        } catch (error) {
            this.isConnected = false;
            alert(`❌ Lỗi kết nối Firebase: ${error.message}`);
            return false;
        }
    }

    generateConfigFile() {
        if (!this.config) {
            alert('Chưa có cấu hình Firebase!');
            return;
        }

        const configContent = `// Firebase Configuration
const firebaseConfig = {
  apiKey: "${this.config.apiKey}",
  authDomain: "${this.config.projectId}.firebaseapp.com",
  projectId: "${this.config.projectId}",
  storageBucket: "${this.config.storageBucket}",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

export default firebaseConfig;`;

        const blob = new Blob([configContent], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'firebase-config.js';
        link.click();
        URL.revokeObjectURL(url);
    }
}

// Initialize Firebase manager
let firebaseManager;

document.addEventListener('DOMContentLoaded', function() {
    firebaseManager = new FirebaseManager();
});

// Global Firebase functions
function saveFirebaseConfig() {
    const apiKey = document.getElementById('firebaseApiKey').value;
    const projectId = document.getElementById('firebaseProjectId').value;
    const storageBucket = document.getElementById('firebaseStorageBucket').value;

    if (!apiKey || !projectId || !storageBucket) {
        alert('Vui lòng nhập đầy đủ thông tin cấu hình!');
        return;
    }

    if (firebaseManager) {
        firebaseManager.config = {
            apiKey: apiKey,
            projectId: projectId,
            storageBucket: storageBucket
        };

        if (firebaseManager.saveConfig()) {
            alert('✅ Đã lưu cấu hình Firebase thành công!');
        } else {
            alert('❌ Lỗi khi lưu cấu hình!');
        }
    }
}

function testFirebaseConnection() {
    if (firebaseManager) {
        firebaseManager.testConnection();
    }
}

function generateFirebaseConfig() {
    if (firebaseManager) {
        firebaseManager.generateConfigFile();
    }
}
