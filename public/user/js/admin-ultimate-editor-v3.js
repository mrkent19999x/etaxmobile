// ===== ADMIN ULTIMATE EDITOR V3 JAVASCRIPT =====
// Professional Design System

// ===== GLOBAL VARIABLES =====
let editor;
let currentPage = 'index_main';
let selectedUser = null;
let isRightPanelOpen = true;

// ===== FIREBASE CONFIGURATION =====
const firebaseConfig = {
  apiKey: "AIzaSyD_rJgBFgBulheVenQUE2KXr4PBpSpTCxw",
  authDomain: "etax-7fbf8.firebaseapp.com",
  databaseURL: "https://etax-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "etax-7fbf8",
  storageBucket: "etax-7fbf8.appspot.com",
  messagingSenderId: "1030026724634",
  appId: "1:1030026724634:web:d76f5f9dad43bad6fd58a3"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
  initializeEditor();
  setupEventListeners();
  hideLoading();
});

// ===== GRAPESJS INITIALIZATION =====
function initializeEditor() {
  editor = grapesjs.init({
    container: '#gjs',
    height: '100%',
    width: '100%',
    storageManager: false,
    
    // Configure panels
    panels: {
      defaults: [
        {
          id: 'basic-actions',
          el: '.gjs-pn-panel',
          buttons: [
            {
              id: 'visibility',
              active: true,
              className: 'btn-toggle-borders',
              label: '<i class="fa fa-clone"></i>',
              command: 'sw-visibility',
            }
          ]
        }
      ]
    },
    
    // Device Manager
    deviceManager: {
      devices: [
        {
          name: 'Mobile',
          width: '375px',
          height: '667px',
        },
        {
          name: 'Tablet',
          width: '768px',
          height: '1024px',
        }
      ]
    },

    // Block Manager với components eTax
    blockManager: {
      blocks: [
        {
          id: 'etax-header',
          label: 'eTax Header',
          category: 'eTax Components',
          content: `
            <div style="background: linear-gradient(135deg, #d62828 0%, #b71c1c 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
              <div style="font-size: 24px; cursor: pointer;">☰</div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="assets/logo.png" style="height: 32px;">
                <span style="font-weight: 700; font-size: 18px;">eTax Mobile</span>
              </div>
              <div style="display: flex; gap: 12px;">
                <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <i class="fas fa-qrcode" style="color: white;"></i>
                </div>
                <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <i class="fas fa-bell" style="color: white;"></i>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'etax-card',
          label: 'User Info Card',
          category: 'eTax Components',
          content: `
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; margin: 16px; border-radius: 16px; box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="width: 60px; height: 60px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                  <i class="fas fa-user" style="font-size: 24px; color: white;"></i>
                </div>
                <div>
                  <h3 style="margin: 0; font-size: 18px; font-weight: 600;">Nguyễn Văn A</h3>
                  <p style="margin: 4px 0 0 0; opacity: 0.9;">MST: 0123456789</p>
                  <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 14px;">Công ty TNHH ABC</p>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'etax-button',
          label: 'eTax Button',
          category: 'eTax Components',  
          content: `
            <button style="background: linear-gradient(135deg, #d62828 0%, #b71c1c 100%); color: white; border: none; padding: 16px 24px; border-radius: 12px; font-weight: 600; font-size: 16px; cursor: pointer; width: 100%; margin: 8px; box-shadow: 0 4px 16px rgba(214, 40, 40, 0.3); transition: all 0.3s ease;">
              <i class="fas fa-arrow-right" style="margin-right: 8px;"></i>
              Thực hiện
            </button>
          `
        },
        {
          id: 'etax-form',
          label: 'Form Input',
          category: 'eTax Components',
          content: `
            <div style="padding: 16px; margin: 8px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Nhập thông tin</label>
              <input type="text" placeholder="Nhập dữ liệu..." style="width: 100%; padding: 16px; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 16px; transition: border-color 0.3s ease;">
              <div style="margin-top: 8px; font-size: 14px; color: #64748b;">Thông tin bổ sung</div>
            </div>
          `
        },
        {
          id: 'etax-list',
          label: 'List Item',
          category: 'eTax Components',
          content: `
            <div style="background: white; border-radius: 12px; margin: 8px 16px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); overflow: hidden;">
              <div style="padding: 16px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: between;">
                <div style="display: flex; align-items: center; gap: 12px;">
                  <div style="width: 40px; height: 40px; background: #3b82f6; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                    <i class="fas fa-file-alt" style="color: white; font-size: 16px;"></i>
                  </div>
                  <div>
                    <div style="font-weight: 600; color: #1e293b;">Khai thuế TNCN</div>
                    <div style="font-size: 14px; color: #64748b;">Hạn nộp: 31/03/2024</div>
                  </div>
                </div>
                <div style="padding: 6px 12px; background: #10b981; color: white; border-radius: 20px; font-size: 12px; font-weight: 600;">
                  Hoàn thành
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'etax-nav',
          label: 'Bottom Navigation',
          category: 'eTax Components',
          content: `
            <div style="background: white; border-top: 1px solid #e2e8f0; padding: 12px 0; display: flex; justify-content: space-around; position: fixed; bottom: 0; left: 0; right: 0;">
              <div style="text-align: center; color: #d62828;">
                <div style="font-size: 20px; margin-bottom: 4px;"><i class="fas fa-home"></i></div>
                <div style="font-size: 12px; font-weight: 600;">Trang chủ</div>
              </div>
              <div style="text-align: center; color: #64748b;">
                <div style="font-size: 20px; margin-bottom: 4px;"><i class="fas fa-file-invoice"></i></div>
                <div style="font-size: 12px;">Khai thuế</div>
              </div>
              <div style="text-align: center; color: #64748b;">
                <div style="font-size: 20px; margin-bottom: 4px;"><i class="fas fa-bell"></i></div>
                <div style="font-size: 12px;">Thông báo</div>
              </div>
              <div style="text-align: center; color: #64748b;">
                <div style="font-size: 20px; margin-bottom: 4px;"><i class="fas fa-user"></i></div>
                <div style="font-size: 12px;">Cá nhân</div>
              </div>
            </div>
          `
        }
      ]
    },

    // Style Manager
    styleManager: {
      sectors: [
        {
          name: 'General',
          open: false,
          buildProps: ['width', 'height', 'margin', 'padding'],
        },
        {
          name: 'Typography',
          open: false,
          buildProps: ['font-family', 'font-size', 'font-weight', 'color', 'text-align'],
        },
        {
          name: 'Background',
          open: false,
          buildProps: ['background-color', 'background-image', 'background-size'],
        }
      ]
    }
  });

  // Set initial content
  editor.setComponents(`
    <div style="background: #f8fafc; min-height: 100vh; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
      <div style="background: linear-gradient(135deg, #d62828 0%, #b71c1c 100%); color: white; padding: 20px; display: flex; justify-content: space-between; align-items: center;">
        <div style="font-size: 24px; cursor: pointer;">☰</div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="assets/logo.png" style="height: 32px;">
          <span style="font-weight: 700; font-size: 18px;">eTax Mobile</span>
        </div>
        <div style="display: flex; gap: 12px;">
          <div style="width: 36px; height: 36px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <i class="fas fa-qrcode" style="color: white;"></i>
          </div>
        </div>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #1e293b; margin-bottom: 20px;">Chào mừng đến với eTax</h2>
        <p style="color: #64748b; margin-bottom: 20px;">Kéo thả các components từ bảng bên phải để thiết kế giao diện</p>
      </div>
    </div>
  `);

  // Setup right panel integration
  setupRightPanelIntegration();
}

// ===== RIGHT PANEL INTEGRATION =====
function setupRightPanelIntegration() {
  // Move GrapesJS panels to right panel
  setTimeout(() => {
    const stylesContainer = document.getElementById('gjs-styles-container');
    const layersContainer = document.getElementById('gjs-layers-container');
    
    if (stylesContainer && editor.StyleManager) {
      stylesContainer.appendChild(editor.StyleManager.render());
    }
    
    if (layersContainer && editor.LayerManager) {
      layersContainer.appendChild(editor.LayerManager.render());
    }
  }, 1000);
}

// ===== UI FUNCTIONS =====
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const icon = document.getElementById('toggleIcon');
  
  sidebar.classList.toggle('collapsed');
  
  if (sidebar.classList.contains('collapsed')) {
    icon.className = 'fas fa-chevron-right';
  } else {
    icon.className = 'fas fa-bars';
  }
}

function toggleRightPanel() {
  const rightPanel = document.getElementById('rightPanel');
  const btn = document.getElementById('blocksToggle');
  
  isRightPanelOpen = !isRightPanelOpen;
  
  if (isRightPanelOpen) {
    rightPanel.style.display = 'flex';
    btn.classList.add('active');
  } else {
    rightPanel.style.display = 'none';
    btn.classList.remove('active');
  }
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.add('hidden');
  });
  
  // Show selected tab
  document.getElementById(tabName + 'Tab').classList.remove('hidden');
  
  // Update active tab button
  document.querySelectorAll('.panel-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
}

// ===== PAGE MANAGEMENT =====
function loadPage(pageName) {
  currentPage = pageName;
  
  // Update active navigation
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Load page content
  fetch(`${pageName}.html`)
    .then(response => response.text())
    .then(html => {
      editor.setComponents(html);
      showNotification(`Đã tải ${pageName}.html thành công`, 'success');
    })
    .catch(error => {
      showNotification(`Không thể tải ${pageName}.html`, 'error');
      console.error('Error loading page:', error);
    });
}

function loadTemplate(templateName) {
  // Load predefined templates
  const templates = {
    'modern-login': `
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 20px;">
        <div style="background: rgba(255,255,255,0.1); backdrop-filter: blur(20px); border-radius: 24px; padding: 40px; width: 100%; max-width: 400px; text-align: center;">
          <h1 style="color: white; margin-bottom: 20px; font-size: 28px;">Đăng nhập</h1>
          <div style="margin-bottom: 20px;">
            <input type="text" placeholder="Mã số thuế" style="width: 100%; padding: 16px; border: none; border-radius: 12px; font-size: 16px;">
          </div>
          <div style="margin-bottom: 30px;">
            <input type="password" placeholder="Mật khẩu" style="width: 100%; padding: 16px; border: none; border-radius: 12px; font-size: 16px;">
          </div>
          <button style="background: #d62828; color: white; border: none; padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; width: 100%;">Đăng nhập</button>
        </div>
      </div>
    `
  };
  
  if (templates[templateName]) {
    editor.setComponents(templates[templateName]);
    showNotification(`Đã tải template ${templateName}`, 'success');
  }
}

// ===== PROJECT MANAGEMENT =====
function previewMode() {
  showNotification('Chế độ preview', 'info');
}

function saveProject() {
  const html = editor.getHtml();
  const css = editor.getCss();
  
  // Save to Firebase
  if (selectedUser) {
    db.ref(`userLayouts/${selectedUser}/${currentPage}`).set({
      html: html,
      css: css,
      timestamp: Date.now()
    }).then(() => {
      showNotification('Đã lưu thành công', 'success');
    }).catch(error => {
      showNotification('Lỗi khi lưu: ' + error.message, 'error');
    });
  } else {
    showNotification('Vui lòng chọn người dùng trước khi lưu', 'warning');
  }
}

function exportProject() {
  const html = editor.getHtml();
  const css = editor.getCss();
  
  const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${currentPage}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>${css}</style>
</head>
<body>${html}</body>
</html>`;
  
  const blob = new Blob([fullHtml], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${currentPage}.html`;
  a.click();
  URL.revokeObjectURL(url);
  
  showNotification('Đã xuất file HTML', 'success');
}

// ===== EVENT LISTENERS =====
function setupEventListeners() {
  // Block drag and drop
  document.querySelectorAll('.block-item').forEach(block => {
    block.addEventListener('click', function() {
      const blockId = this.dataset.block;
      if (editor && editor.BlockManager) {
        const blockManager = editor.BlockManager;
        const block = blockManager.get(blockId);
        if (block) {
          editor.getWrapper().append(block.get('content'));
          showNotification(`Đã thêm ${block.get('label')}`, 'success');
        }
      }
    });
  });

  // Mobile responsive
  window.addEventListener('resize', handleResize);
  handleResize();
}

function handleResize() {
  const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
  if (window.innerWidth <= 768) {
    mobileSidebarBtn.style.display = 'flex';
  } else {
    mobileSidebarBtn.style.display = 'none';
  }
}

// ===== UTILITY FUNCTIONS =====
function hideLoading() {
  const loadingOverlay = document.getElementById('loadingOverlay');
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
}

function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  if (!notification) return;
  
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

// ===== CONSOLE LOG FOR DEBUG =====
console.log('🎨 eTax Ultimate Editor V3 initialized successfully!');