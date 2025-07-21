/**
 * 📝 ETAX RICH TEXT EDITOR
 * PWA-styled content editor với design system match eTax Mobile
 * Support live preview, mobile responsive, và Firebase sync
 */

class ETaxRichEditor {
  constructor(containerId, options = {}) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.options = {
      showPreview: true,
      autoSave: true,
      mobileFirst: true,
      theme: 'etax',
      ...options
    };
    
    this.editor = null;
    this.previewPanel = null;
    this.content = '';
    this.isFullscreen = false;
    
    this.init();
  }

  // 🚀 Khởi tạo editor
  init() {
    this.createEditorHTML();
    this.setupEventListeners();
    this.loadETaxStyles();
    this.updatePreview();
    
    console.log('✅ ETax Rich Editor initialized');
  }

  // 🎨 Tạo HTML structure cho editor
  createEditorHTML() {
    this.container.innerHTML = `
      <div class="etax-editor-container">
        <!-- Toolbar -->
        <div class="etax-toolbar">
          <div class="toolbar-section">
            <h4 style="color: #333; margin: 0; font-size: 16px;">📝 EDITOR NỐI DUNG ETAX</h4>
            <div class="toolbar-actions">
              <button class="toolbar-btn" onclick="etaxEditor.togglePreview()" title="Bật/tắt preview">
                👁️ Preview
              </button>
              <button class="toolbar-btn" onclick="etaxEditor.toggleFullscreen()" title="Toàn màn hình">
                ⛶ Fullscreen
              </button>
            </div>
          </div>
          
          <!-- Text Formatting -->
          <div class="toolbar-group">
            <label class="toolbar-label">🎨 Định dạng text:</label>
            <button class="format-btn" onclick="etaxEditor.execCommand('bold')" title="Đậm">
              <strong>B</strong>
            </button>
            <button class="format-btn" onclick="etaxEditor.execCommand('italic')" title="Nghiêng">
              <em>I</em>
            </button>
            <button class="format-btn" onclick="etaxEditor.execCommand('underline')" title="Gạch dưới">
              <u>U</u>
            </button>
            
            <select class="format-select" onchange="etaxEditor.changeTextSize(this.value)">
              <option value="">📏 Cỡ chữ</option>
              <option value="12px">Nhỏ (12px)</option>
              <option value="14px">Bình thường (14px)</option>
              <option value="16px">Trung bình (16px)</option>
              <option value="18px">Lớn (18px)</option>
              <option value="24px">Tiêu đề (24px)</option>
            </select>
            
            <select class="format-select" onchange="etaxEditor.changeTextColor(this.value)">
              <option value="">🎨 Màu chữ</option>
              <option value="#333">Đen (#333)</option>
              <option value="#b71c1c">Đỏ eTax (#b71c1c)</option>
              <option value="#666">Xám (#666)</option>
              <option value="#white">Trắng</option>
            </select>
          </div>

          <!-- Layout Tools -->
          <div class="toolbar-group">
            <label class="toolbar-label">📊 Bố cục:</label>
            <button class="format-btn" onclick="etaxEditor.execCommand('justifyLeft')" title="Căn trái">
              ◧
            </button>
            <button class="format-btn" onclick="etaxEditor.execCommand('justifyCenter')" title="Căn giữa">
              ▣
            </button>
            <button class="format-btn" onclick="etaxEditor.execCommand('justifyRight')" title="Căn phải">
              ◨
            </button>
            
            <button class="format-btn" onclick="etaxEditor.execCommand('insertUnorderedList')" title="Danh sách">
              • List
            </button>
            <button class="format-btn" onclick="etaxEditor.execCommand('insertOrderedList')" title="Đánh số">
              1. List
            </button>
          </div>

          <!-- PWA Components -->
          <div class="toolbar-group">
            <label class="toolbar-label">📱 PWA Components:</label>
            <button class="component-btn" onclick="etaxEditor.insertETaxHeader()" title="Header eTax">
              🔴 Header
            </button>
            <button class="component-btn" onclick="etaxEditor.insertETaxCard()" title="Card section">
              📦 Card
            </button>
            <button class="component-btn" onclick="etaxEditor.insertETaxButton()" title="Button eTax">
              🔘 Button  
            </button>
            <button class="component-btn" onclick="etaxEditor.insertETaxTable()" title="Bảng dữ liệu">
              📊 Table
            </button>
          </div>
        </div>

        <!-- Editor Layout -->
        <div class="editor-layout ${this.options.showPreview ? 'split-view' : 'single-view'}">
          <!-- Content Editor -->
          <div class="editor-panel">
            <div class="editor-header">
              <h5>✏️ CHỈNH SỬA NỘI DUNG</h5>
              <div class="editor-info">
                <span id="wordCount">0 từ</span> • 
                <span id="charCount">0 ký tự</span>
              </div>
            </div>
            <div 
              id="etaxContentEditor" 
              class="content-editor" 
              contenteditable="true"
              data-placeholder="Nhập nội dung tại đây... Sử dụng toolbar để định dạng theo phong cách eTax Mobile"
            ></div>
          </div>

          <!-- Live Preview -->
          ${this.options.showPreview ? `
          <div class="preview-panel">
            <div class="preview-header">
              <h5>👁️ XEM TRƯỚC</h5>
              <div class="preview-controls">
                <button class="preview-btn active" onclick="etaxEditor.setPreviewMode('mobile')">
                  📱 Mobile
                </button>
                <button class="preview-btn" onclick="etaxEditor.setPreviewMode('tablet')">
                  📟 Tablet  
                </button>
                <button class="preview-btn" onclick="etaxEditor.setPreviewMode('desktop')">
                  🖥️ Desktop
                </button>
              </div>
            </div>
            <div class="preview-container">
              <div id="etaxPreviewFrame" class="preview-frame mobile-view">
                <div class="etax-preview-content">
                  <!-- Content sẽ được render ở đây -->
                </div>
              </div>
            </div>
          </div>
          ` : ''}
        </div>

        <!-- Save Controls -->
        <div class="save-controls">
          <button class="save-btn draft" onclick="etaxEditor.saveDraft()">
            💾 Lưu nháp
          </button>
          <button class="save-btn publish" onclick="etaxEditor.publishContent()">
            🚀 Xuất bản
          </button>
          <div class="save-status" id="saveStatus">
            💾 Đã lưu tự động
          </div>
        </div>
      </div>
    `;
  }

  // 🎨 Load eTax design system styles
  loadETaxStyles() {
    const style = document.createElement('style');
    style.textContent = `
      /* eTax Rich Editor Styles */
      .etax-editor-container {
        background: white;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        overflow: hidden;
        font-family: 'Segoe UI', 'Tahoma', 'Microsoft Sans Serif', 'Arial', sans-serif;
      }

      /* Toolbar Styles */
      .etax-toolbar {
        background: linear-gradient(135deg, #b71c1c 0%, #8e0000 100%);
        color: white;
        padding: 15px 20px;
      }

      .toolbar-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .toolbar-actions {
        display: flex;
        gap: 10px;
      }

      .toolbar-btn {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
        transition: all 0.3s;
      }

      .toolbar-btn:hover {
        background: rgba(255, 255, 255, 0.3);
      }

      .toolbar-group {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 10px;
        flex-wrap: wrap;
      }

      .toolbar-label {
        color: white;
        font-size: 12px;
        font-weight: 600;
        margin-right: 10px;
      }

      .format-btn, .component-btn {
        background: rgba(255, 255, 255, 0.15);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 6px 10px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 11px;
        transition: all 0.3s;
        min-width: 35px;
      }

      .format-btn:hover, .component-btn:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-1px);
      }

      .format-select {
        background: rgba(255, 255, 255, 0.9);
        border: none;
        padding: 6px 8px;
        border-radius: 4px;
        font-size: 11px;
        color: #333;
        cursor: pointer;
      }

      /* Editor Layout */
      .editor-layout {
        display: grid;
        min-height: 500px;
      }

      .editor-layout.split-view {
        grid-template-columns: 1fr 1fr;
      }

      .editor-layout.single-view {
        grid-template-columns: 1fr;
      }

      .editor-panel, .preview-panel {
        border-right: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;
      }

      .preview-panel {
        border-right: none;
        background: #f8f9fa;
      }

      .editor-header, .preview-header {
        background: #f8f9fa;
        padding: 12px 15px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .editor-header h5, .preview-header h5 {
        margin: 0;
        font-size: 14px;
        color: #333;
      }

      .editor-info {
        font-size: 11px;
        color: #666;
      }

      .preview-controls {
        display: flex;
        gap: 5px;
      }

      .preview-btn {
        background: #e0e0e0;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        transition: all 0.3s;
      }

      .preview-btn.active {
        background: #b71c1c;
        color: white;
      }

      /* Content Editor */
      .content-editor {
        flex: 1;
        padding: 20px;
        outline: none;
        font-size: 14px;
        line-height: 1.6;
        color: #333;
        overflow-y: auto;
      }

      .content-editor[data-placeholder]:empty:before {
        content: attr(data-placeholder);
        color: #999;
        font-style: italic;
      }

      /* Preview Frame */
      .preview-container {
        flex: 1;
        padding: 15px;
        overflow: hidden;
      }

      .preview-frame {
        width: 100%;
        height: 100%;
        background: white;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        overflow-y: auto;
        transition: all 0.3s;
      }

      .preview-frame.mobile-view {
        max-width: 375px;
        margin: 0 auto;
      }

      .preview-frame.tablet-view {
        max-width: 768px;
        margin: 0 auto;
      }

      .preview-frame.desktop-view {
        max-width: 100%;
      }

      .etax-preview-content {
        padding: 20px;
        min-height: 400px;
      }

      /* Save Controls */
      .save-controls {
        background: #f8f9fa;
        padding: 15px 20px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .save-btn {
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s;
        font-size: 14px;
      }

      .save-btn.draft {
        background: #6c757d;
        color: white;
      }

      .save-btn.publish {
        background: #28a745;
        color: white;
      }

      .save-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }

      .save-status {
        font-size: 12px;
        color: #666;
      }

      /* eTax PWA Components Preview Styles */
      .etax-preview-content .etax-header {
        background: linear-gradient(135deg, #b71c1c 0%, #8e0000 100%);
        color: white;
        padding: 15px;
        border-radius: 10px 10px 0 0;
        margin: -20px -20px 20px -20px;
        text-align: center;
        font-weight: 600;
      }

      .etax-preview-content .etax-card {
        background: white;
        border-radius: 14px;
        padding: 20px;
        margin: 15px 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        border: 1px solid #f0f0f0;
      }

      .etax-preview-content .etax-button {
        background: #b71c1c;
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: inline-block;
        text-decoration: none;
        margin: 5px;
      }

      .etax-preview-content .etax-table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
        background: white;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      }

      .etax-preview-content .etax-table th,
      .etax-preview-content .etax-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
        font-size: 13px;
      }

      .etax-preview-content .etax-table th {
        background: #f8f9fa;
        font-weight: 600;
        color: #333;
      }

      /* Responsive */
      @media (max-width: 768px) {
        .editor-layout.split-view {
          grid-template-columns: 1fr;
        }
        
        .preview-panel {
          display: none;
        }
        
        .toolbar-group {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      /* Fullscreen Mode */
      .etax-editor-container.fullscreen {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 999999;
        border-radius: 0;
      }
    `;
    document.head.appendChild(style);
  }

  // 🔧 Setup event listeners
  setupEventListeners() {
    const editor = document.getElementById('etaxContentEditor');
    
    // Content change events
    editor.addEventListener('input', () => {
      this.updateWordCount();
      this.updatePreview();
      if (this.options.autoSave) {
        this.autoSave();
      }
    });

    editor.addEventListener('keyup', () => {
      this.updateWordCount();
    });

    // Paste handling
    editor.addEventListener('paste', (e) => {
      e.preventDefault();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    });
  }

  // 📊 Update word count
  updateWordCount() {
    const editor = document.getElementById('etaxContentEditor');
    const text = editor.innerText || '';
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const chars = text.length;

    document.getElementById('wordCount').textContent = `${words.length} từ`;
    document.getElementById('charCount').textContent = `${chars} ký tự`;
  }

  // 👁️ Update preview
  updatePreview() {
    if (!this.options.showPreview) return;

    const editor = document.getElementById('etaxContentEditor');
    const preview = document.querySelector('.etax-preview-content');
    
    if (editor && preview) {
      preview.innerHTML = editor.innerHTML || '<p style="color: #999; font-style: italic;">Nội dung preview sẽ hiển thị ở đây...</p>';
    }
  }

  // ⚙️ Format commands
  execCommand(command, value = null) {
    document.execCommand(command, false, value);
    this.updatePreview();
  }

  // 📏 Change text size
  changeTextSize(size) {
    if (!size) return;
    document.execCommand('fontSize', false, '7');
    const fontElements = document.querySelectorAll('font[size="7"]');
    fontElements.forEach(el => {
      el.removeAttribute('size');
      el.style.fontSize = size;
    });
    this.updatePreview();
  }

  // 🎨 Change text color
  changeTextColor(color) {
    if (!color) return;
    document.execCommand('foreColor', false, color);
    this.updatePreview();
  }

  // 📱 Insert eTax Header
  insertETaxHeader() {
    const headerHTML = `
      <div class="etax-header">
        🏛️ TIÊU ĐỀ ETAX
      </div>
    `;
    document.execCommand('insertHTML', false, headerHTML);
    this.updatePreview();
  }

  // 📦 Insert eTax Card
  insertETaxCard() {
    const cardHTML = `
      <div class="etax-card">
        <h4 style="margin-top: 0; color: #333;">📋 Tiêu đề Card</h4>
        <p style="color: #666; margin-bottom: 0;">Nội dung card ở đây. Có thể chứa text, danh sách, hoặc bất kỳ nội dung nào.</p>
      </div>
    `;
    document.execCommand('insertHTML', false, cardHTML);
    this.updatePreview();
  }

  // 🔘 Insert eTax Button
  insertETaxButton() {
    const buttonHTML = `
      <a href="#" class="etax-button">🔴 Button eTax</a>
    `;
    document.execCommand('insertHTML', false, buttonHTML);
    this.updatePreview();
  }

  // 📊 Insert eTax Table
  insertETaxTable() {
    const tableHTML = `
      <table class="etax-table">
        <thead>
          <tr>
            <th>Cột 1</th>
            <th>Cột 2</th>
            <th>Cột 3</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dữ liệu 1</td>
            <td>Dữ liệu 2</td>
            <td>Dữ liệu 3</td>
          </tr>
          <tr>
            <td>Dữ liệu 4</td>
            <td>Dữ liệu 5</td>
            <td>Dữ liệu 6</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHTML);
    this.updatePreview();
  }

  // 👁️ Toggle preview panel
  togglePreview() {
    const layout = document.querySelector('.editor-layout');
    const isShowing = layout.classList.contains('split-view');
    
    if (isShowing) {
      layout.classList.remove('split-view');
      layout.classList.add('single-view');
    } else {
      layout.classList.remove('single-view');
      layout.classList.add('split-view');
    }
    
    this.options.showPreview = !isShowing;
  }

  // ⛶ Toggle fullscreen
  toggleFullscreen() {
    const container = document.querySelector('.etax-editor-container');
    this.isFullscreen = !this.isFullscreen;
    
    if (this.isFullscreen) {
      container.classList.add('fullscreen');
    } else {
      container.classList.remove('fullscreen');
    }
  }

  // 📱 Set preview mode
  setPreviewMode(mode) {
    const frame = document.getElementById('etaxPreviewFrame');
    const buttons = document.querySelectorAll('.preview-btn');
    
    // Update buttons
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[onclick="etaxEditor.setPreviewMode('${mode}')"]`).classList.add('active');
    
    // Update frame
    frame.className = `preview-frame ${mode}-view`;
  }

  // 💾 Save draft
  saveDraft() {
    const content = document.getElementById('etaxContentEditor').innerHTML;
    localStorage.setItem('etax_content_draft', content);
    this.showSaveStatus('💾 Đã lưu nháp');
  }

  // 🚀 Publish content
  publishContent() {
    const content = document.getElementById('etaxContentEditor').innerHTML;
    // TODO: Integrate với Firebase
    console.log('Publishing content:', content);
    this.showSaveStatus('🚀 Đã xuất bản');
  }

  // ⏰ Auto save
  autoSave() {
    clearTimeout(this.autoSaveTimeout);
    this.autoSaveTimeout = setTimeout(() => {
      this.saveDraft();
    }, 3000);
  }

  // 📄 Show save status
  showSaveStatus(message) {
    const status = document.getElementById('saveStatus');
    status.textContent = message;
    
    setTimeout(() => {
      status.textContent = '💾 Đã lưu tự động';
    }, 3000);
  }

  // 📋 Get content
  getContent() {
    return document.getElementById('etaxContentEditor').innerHTML;
  }

  // 📝 Set content
  setContent(html) {
    document.getElementById('etaxContentEditor').innerHTML = html;
    this.updatePreview();
    this.updateWordCount();
  }

  // 🧹 Cleanup
  destroy() {
    clearTimeout(this.autoSaveTimeout);
    this.container.innerHTML = '';
  }
}

// 🌐 Global instance
let etaxEditor = null;

// 🚀 Initialize function
function initETaxRichEditor(containerId, options = {}) {
  etaxEditor = new ETaxRichEditor(containerId, options);
  return etaxEditor;
}