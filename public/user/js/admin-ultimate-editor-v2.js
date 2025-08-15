// ===== GLOBAL VARIABLES =====
let editor;
let currentUser = null;
let isRightPanelOpen = true;
let isLeftPanelOpen = false;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing eTax Editor V2...');
    
    initializeEditor();
    initializePWA();
    loadUsers();
    setupEventListeners();
    
    // Default to blocks tab
    switchPanelTab('blocks');
});

// ===== EDITOR INITIALIZATION =====
function initializeEditor() {
    console.log('📱 Initializing GrapesJS Editor - Mobile First...');
    
    editor = grapesjs.init({
        container: '#gjs',
        deviceManager: {
            devices: [
                {
                    name: 'Mobile',
                    width: '375px',
                    height: '667px',
                    widthMedia: '480px'
                },
                {
                    name: 'Tablet',
                    width: '768px',
                    height: '1024px',
                    widthMedia: '768px'
                },
                {
                    name: 'Desktop',
                    width: '100%',
                    height: '100%',
                    widthMedia: '1200px'
                }
            ]
        },
        panels: {
            defaults: [
                {
                    id: 'basic-actions',
                    el: '.panel__basic-actions',
                    buttons: [
                        {
                            id: 'visibility',
                            active: true,
                            className: 'btn-toggle-borders',
                            label: '<u>B</u>',
                            command: 'sw-visibility'
                        }
                    ]
                },
                {
                    id: 'blocks',
                    el: '#blocksContent .blocks-container',
                    resizable: {
                        maxDim: 350,
                        minDim: 200,
                        tc: 0, cl: 1, cr: 0, bc: 0,
                        keyWidth: 'flex-basis',
                    },
                },
                {
                    id: 'layers',
                    el: '#layersContent .layers-container',
                    resizable: {
                        maxDim: 350,
                        minDim: 200,
                        tc: 0, cl: 1, cr: 0, bc: 0,
                        keyWidth: 'flex-basis',
                    },
                },
                {
                    id: 'styles',
                    el: '#stylesContent .styles-container',
                    resizable: {
                        maxDim: 350,
                        minDim: 200,
                        tc: 0, cl: 1, cr: 0, bc: 0,
                        keyWidth: 'flex-basis',
                    },
                }
            ]
        },
        blockManager: {
            appendTo: '#blocksContent .blocks-container',
            blocks: [
                {
                    id: 'section',
                    label: 'Section',
                    category: 'Basic',
                    content: '<section class="section"><div class="container"><h2>Section Title</h2><p>Section content goes here...</p></div></section>',
                    media: '<i class="fas fa-square"></i>'
                },
                {
                    id: 'text',
                    label: 'Text',
                    category: 'Basic',
                    content: '<div data-gjs-type="text">Insert your text here</div>',
                    media: '<i class="fas fa-font"></i>'
                },
                {
                    id: 'image',
                    label: 'Image',
                    category: 'Basic',
                    content: { type: 'image' },
                    media: '<i class="fas fa-image"></i>'
                },
                {
                    id: 'video',
                    label: 'Video',
                    category: 'Basic',
                    content: { type: 'video' },
                    media: '<i class="fas fa-video"></i>'
                },
                {
                    id: 'map',
                    label: 'Map',
                    category: 'Basic',
                    content: '<div class="map"><iframe src="https://maps.google.com/maps?width=100%&height=400&hl=en&q=1%20Grafton%20Street,%20Dublin,%20Ireland&t=&z=14&ie=UTF8&iwloc=B&output=embed"></iframe></div>',
                    media: '<i class="fas fa-map-marker-alt"></i>'
                },
                {
                    id: 'link',
                    label: 'Link',
                    category: 'Basic',
                    content: '<a href="#" data-gjs-type="link">Link text</a>',
                    media: '<i class="fas fa-link"></i>'
                },
                {
                    id: 'quote',
                    label: 'Quote',
                    category: 'Basic',
                    content: '<blockquote class="quote"><p>A sample quote text...</p><cite>Author, Source</cite></blockquote>',
                    media: '<i class="fas fa-quote-right"></i>'
                },
                {
                    id: 'button',
                    label: 'Button',
                    category: 'Basic',
                    content: '<button class="button">Button</button>',
                    media: '<i class="fas fa-square"></i>'
                },
                {
                    id: 'div',
                    label: 'Div',
                    category: 'Basic',
                    content: '<div data-gjs-type="default" class="div"></div>',
                    media: '<i class="fas fa-square-full"></i>'
                },
                {
                    id: 'span',
                    label: 'Span',
                    category: 'Basic',
                    content: '<span data-gjs-type="text">Span element</span>',
                    media: '<i class="fas fa-minus"></i>'
                },
                {
                    id: 'input',
                    label: 'Input',
                    category: 'Forms',
                    content: '<input data-gjs-type="input" type="text" class="input" placeholder="Insert your text here"/>',
                    media: '<i class="fas fa-pen-square"></i>'
                },
                {
                    id: 'textarea',
                    label: 'Textarea',
                    category: 'Forms',
                    content: '<textarea data-gjs-type="textarea" class="input" placeholder="Insert your text here"></textarea>',
                    media: '<i class="fas fa-text-width"></i>'
                },
                {
                    id: 'select',
                    label: 'Select',
                    category: 'Forms',
                    content: '<select data-gjs-type="select" class="input"><option value="opt1">Option 1</option><option value="opt2">Option 2</option></select>',
                    media: '<i class="fas fa-chevron-down"></i>'
                },
                {
                    id: 'checkbox',
                    label: 'Checkbox',
                    category: 'Forms',
                    content: '<input data-gjs-type="input" type="checkbox" class="input"/>',
                    media: '<i class="fas fa-check-square"></i>'
                },
                {
                    id: 'radio',
                    label: 'Radio',
                    category: 'Forms',
                    content: '<input data-gjs-type="input" type="radio" class="input"/>',
                    media: '<i class="fas fa-dot-circle"></i>'
                },
                {
                    id: 'form',
                    label: 'Form',
                    category: 'Forms',
                    content: '<form data-gjs-type="form" class="form"></form>',
                    media: '<i class="fas fa-wpforms"></i>'
                },
                {
                    id: 'label',
                    label: 'Label',
                    category: 'Forms',
                    content: '<label data-gjs-type="label" class="label">Label</label>',
                    media: '<i class="fas fa-tag"></i>'
                }
            ]
        },
        storageManager: false,
        layerManager: {
            appendTo: '#layersContent .layers-container'
        },
        styleManager: {
            appendTo: '#stylesContent .styles-container'
        }
    });
    
    console.log('✅ GrapesJS Editor initialized successfully');
}

// ===== PANEL MANAGEMENT =====
function toggleRightPanel() {
    const rightPanel = document.getElementById('rightPanel');
    isRightPanelOpen = !isRightPanelOpen;
    
    if (isRightPanelOpen) {
        rightPanel.classList.remove('collapsed');
    } else {
        rightPanel.classList.add('collapsed');
    }
    
    // Trigger editor resize
    if (editor) {
        editor.refresh();
    }
}

function toggleLeftPanel() {
    const leftPanel = document.getElementById('leftPanel');
    isLeftPanelOpen = !isLeftPanelOpen;
    
    if (isLeftPanelOpen) {
        leftPanel.classList.add('open');
    } else {
        leftPanel.classList.remove('open');
    }
}

function switchPanelTab(tabName) {
    // Remove active class from all tabs and contents
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Add active class to selected tab and content
    document.querySelector(`[onclick="switchPanelTab('${tabName}')"]`).classList.add('active');
    document.getElementById(tabName + 'Content').classList.add('active');
    
    // Refresh editor if needed
    if (editor) {
        setTimeout(() => {
            editor.refresh();
        }, 100);
    }
}

// ===== DEVICE MANAGEMENT =====
function switchDevice(deviceName) {
    // Remove active class from all device buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to selected device button
    document.querySelector(`[data-device="${deviceName}"]`).classList.add('active');
    
    // Switch device in GrapesJS
    if (editor) {
        editor.setDevice(deviceName);
    }
}

// ===== EDITOR ACTIONS =====
function clearEditor() {
    if (editor && confirm('Bạn có chắc muốn xóa tất cả nội dung?')) {
        editor.DomComponents.clear();
        editor.CssComposer.clear();
        console.log('✅ Editor cleared');
    }
}

function undoAction() {
    if (editor) {
        editor.UndoManager.undo();
    }
}

function redoAction() {
    if (editor) {
        editor.UndoManager.redo();
    }
}

function newPage() {
    if (confirm('Tạo trang mới? Nội dung hiện tại sẽ bị mất.')) {
        clearEditor();
    }
}

function loadPage() {
    // Implementation for loading pages
    console.log('📂 Load page functionality');
}

function savePage() {
    if (editor) {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        // Save to Firebase or local storage
        console.log('💾 Saving page...', { html, css });
        
        // Show success message
        showNotification('Trang đã được lưu thành công!', 'success');
    }
}

function exportHTML() {
    if (editor) {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        const fullHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported Page</title>
    <style>${css}</style>
</head>
<body>
    ${html}
</body>
</html>`;
        
        // Create download link
        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'exported-page.html';
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Mã HTML đã được xuất!', 'success');
    }
}

function previewPage() {
    if (editor) {
        const html = editor.getHtml();
        const css = editor.getCss();
        
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview</title>
                <style>${css}</style>
            </head>
            <body>
                ${html}
            </body>
            </html>
        `);
        previewWindow.document.close();
    }
}

function fullscreenEditor() {
    const editorContainer = document.querySelector('.editor-container');
    
    if (!document.fullscreenElement) {
        editorContainer.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

// ===== MODAL MANAGEMENT =====
function showImportModal() {
    document.getElementById('importModal').classList.remove('hidden');
}

function closeImportModal() {
    document.getElementById('importModal').classList.add('hidden');
    document.getElementById('importHTML').value = '';
}

function importHTML() {
    const htmlContent = document.getElementById('importHTML').value;
    
    if (htmlContent.trim()) {
        if (editor) {
            editor.DomComponents.clear();
            editor.setComponents(htmlContent);
            closeImportModal();
            showNotification('HTML đã được import thành công!', 'success');
        }
    } else {
        showNotification('Vui lòng nhập nội dung HTML!', 'error');
    }
}

// ===== USER MANAGEMENT =====
function loadUsers() {
    // Load users from Firebase or local storage
    const users = [
        { id: 1, name: 'Admin', email: 'admin@etax.com' },
        { id: 2, name: 'User 1', email: 'user1@etax.com' },
        { id: 3, name: 'User 2', email: 'user2@etax.com' }
    ];
    
    const usersList = document.getElementById('usersList');
    if (usersList) {
        usersList.innerHTML = users.map(user => `
            <div class="user-item" onclick="selectUser(${user.id})">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <div class="user-name">${user.name}</div>
                    <div class="user-email">${user.email}</div>
                </div>
            </div>
        `).join('');
    }
}

function selectUser(userId) {
    currentUser = userId;
    console.log('👤 Selected user:', userId);
    showNotification('Đã chọn người dùng!', 'success');
}

// ===== PWA FEATURES =====
function initializePWA() {
    console.log('📱 Initializing PWA features...');
    
    // Check if PWA is installable
    let deferredPrompt;
    
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        showInstallPrompt();
    });
    
    window.addEventListener('appinstalled', () => {
        console.log('✅ PWA installed successfully');
        hideInstallPrompt();
    });
}

function showInstallPrompt() {
    // Show install prompt UI
    console.log('📱 Show install prompt');
}

function hideInstallPrompt() {
    // Hide install prompt UI
    console.log('📱 Hide install prompt');
}

function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('✅ User accepted PWA installation');
            } else {
                console.log('❌ User dismissed PWA installation');
            }
            deferredPrompt = null;
        });
    }
}

// ===== UTILITY FUNCTIONS =====
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function setupEventListeners() {
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 's':
                    e.preventDefault();
                    savePage();
                    break;
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        redoAction();
                    } else {
                        undoAction();
                    }
                    break;
                case 'e':
                    e.preventDefault();
                    exportHTML();
                    break;
            }
        }
    });
    
    // Close modals on outside click
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.add('hidden');
        }
    });
    
    // Close panels on mobile when clicking outside
    if (window.innerWidth <= 768) {
        document.addEventListener('click', (e) => {
            const leftPanel = document.getElementById('leftPanel');
            const rightPanel = document.getElementById('rightPanel');
            
            if (!leftPanel.contains(e.target) && !e.target.closest('.hamburger-btn')) {
                leftPanel.classList.remove('open');
                isLeftPanelOpen = false;
            }
            
            if (!rightPanel.contains(e.target) && !e.target.closest('[onclick="toggleRightPanel()"]')) {
                rightPanel.classList.remove('open');
                isRightPanelOpen = false;
            }
        });
    }
}

// ===== EXPORT FUNCTIONS =====
window.toggleRightPanel = toggleRightPanel;
window.toggleLeftPanel = toggleLeftPanel;
window.switchPanelTab = switchPanelTab;
window.switchDevice = switchDevice;
window.clearEditor = clearEditor;
window.undoAction = undoAction;
window.redoAction = redoAction;
window.newPage = newPage;
window.loadPage = loadPage;
window.savePage = savePage;
window.exportHTML = exportHTML;
window.previewPage = previewPage;
window.fullscreenEditor = fullscreenEditor;
window.showImportModal = showImportModal;
window.closeImportModal = closeImportModal;
window.importHTML = importHTML;
window.selectUser = selectUser;