// ===== CONTENT EDITOR MODULE - Editor Nội dung Real-time =====

class ContentEditor {
    constructor() {
        this.currentFile = null;
        this.originalContent = null;
        this.editorHistory = [];
        this.historyIndex = -1;
        this.maxHistorySize = 50;
        this.autoSaveInterval = null;
        this.isAutoSaveEnabled = true;
        this.unsavedChanges = false;
        this.init();
    }

    init() {
        console.log('✏️ Content Editor đang khởi động...');
        this.setupEventListeners();
        this.setupAutoSave();
        this.loadEditorSettings();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // File selector change
        const fileSelector = document.getElementById('fileSelector');
        if (fileSelector) {
            fileSelector.addEventListener('change', (e) => this.handleFileSelection(e));
        }

        // Editor textarea events
        this.setupEditorEvents();

        // Save button
        const saveBtn = document.querySelector('[onclick="saveChanges()"]');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveChanges());
        }

        // Preview button
        const previewBtn = document.querySelector('[onclick="previewChanges()"]');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.previewChanges());
        }

        // Undo button
        const undoBtn = document.querySelector('[onclick="undoChanges()"]');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undoChanges());
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch(e.key) {
                    case 's': e.preventDefault(); this.saveChanges(); break;
                    case 'z': e.preventDefault(); this.undoChanges(); break;
                    case 'y': e.preventDefault(); this.redoChanges(); break;
                    case 'p': e.preventDefault(); this.previewChanges(); break;
                }
            }
        });
    }

    setupEditorEvents() {
        const editors = ['htmlEditor', 'cssEditor', 'jsEditor'];
        
        editors.forEach(editorId => {
            const editor = document.getElementById(editorId);
            if (editor) {
                editor.addEventListener('input', (e) => this.handleEditorInput(e));
                editor.addEventListener('keydown', (e) => this.handleEditorKeydown(e));
                editor.addEventListener('paste', (e) => this.handleEditorPaste(e));
            }
        });
    }

    setupAutoSave() {
        if (this.isAutoSaveEnabled) {
            this.autoSaveInterval = setInterval(() => {
                if (this.unsavedChanges && this.currentFile) {
                    this.autoSave();
                }
            }, 30000); // Auto save every 30 seconds
        }
    }

    loadEditorSettings() {
        try {
            const settings = localStorage.getItem('contentEditorSettings');
            if (settings) {
                const parsed = JSON.parse(settings);
                this.isAutoSaveEnabled = parsed.autoSave !== false;
                this.maxHistorySize = parsed.maxHistory || 50;
            }
        } catch (error) {
            console.warn('Không thể load cài đặt editor:', error);
        }
    }

    saveEditorSettings() {
        try {
            const settings = {
                autoSave: this.isAutoSaveEnabled,
                maxHistory: this.maxHistorySize
            };
            localStorage.setItem('contentEditorSettings', JSON.stringify(settings));
        } catch (error) {
            console.warn('Không thể lưu cài đặt editor:', error);
        }
    }

    showWelcomeMessage() {
        console.log('🎉 Content Editor đã sẵn sàng!');
        console.log('⌨️ Shortcuts: Ctrl+S (Lưu), Ctrl+Z (Hoàn tác), Ctrl+P (Xem trước)');
    }

    // ===== FILE MANAGEMENT =====

    handleFileSelection(event) {
        const fileName = event.target.value;
        if (!fileName) return;

        this.loadFile(fileName);
    }

    async loadFile(fileName) {
        try {
            // Find file in project data
            let fileData = null;
            
            if (window.adminPro && window.adminPro.projectData) {
                fileData = adminPro.projectData.files.html.find(f => f.name === fileName) ||
                          adminPro.projectData.files.css.find(f => f.name === fileName) ||
                          adminPro.projectData.files.javascript.find(f => f.name === fileName);
            }

            if (!fileData) {
                this.showError(`Không tìm thấy file ${fileName}`);
                return;
            }

            // Load file content
            await this.loadFileContent(fileData);
            
            // Update UI
            this.updateEditorUI(fileData);
            
            console.log(`✅ Đã load file: ${fileName}`);
            
        } catch (error) {
            console.error('❌ Lỗi khi load file:', error);
            this.showError(`Không thể load file ${fileName}: ${error.message}`);
        }
    }

    async loadFileContent(fileData) {
        if (fileData.content) {
            // File content already loaded
            this.setFileContent(fileData);
        } else {
            // Need to load content from file
            const content = await this.readFileContent(fileData);
            fileData.content = content;
            this.setFileContent(fileData);
        }
    }

    async readFileContent(fileData) {
        return new Promise((resolve, reject) => {
            if (fileData.file) {
                // File object available
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsText(fileData.file);
            } else {
                // Use stored content
                resolve(fileData.content || '');
            }
        });
    }

    setFileContent(fileData) {
        this.currentFile = fileData;
        this.originalContent = fileData.content;
        
        // Clear history for new file
        this.editorHistory = [];
        this.historyIndex = -1;
        this.unsavedChanges = false;

        // Set content based on file type
        const extension = this.getFileExtension(fileData.name);
        
        switch (extension.toLowerCase()) {
            case 'html':
                this.setHtmlContent(fileData.content);
                this.showEditorTab('html');
                break;
            case 'css':
                this.setCssContent(fileData.content);
                this.showEditorTab('css');
                break;
            case 'js':
                this.setJsContent(fileData.content);
                this.showEditorTab('js');
                break;
            default:
                this.setHtmlContent(fileData.content);
                this.showEditorTab('html');
        }

        // Add to history
        this.addToHistory(fileData.content);
    }

    setHtmlContent(content) {
        const htmlEditor = document.getElementById('htmlEditor');
        if (htmlEditor) {
            htmlEditor.value = content || '';
            this.updatePreview();
        }
    }

    setCssContent(content) {
        const cssEditor = document.getElementById('cssEditor');
        if (cssEditor) {
            cssEditor.value = content || '';
            this.updatePreview();
        }
    }

    setJsContent(content) {
        const jsEditor = document.getElementById('jsEditor');
        if (jsEditor) {
            jsEditor.value = content || '';
            this.updatePreview();
        }
    }

    getFileExtension(filename) {
        return filename.split('.').pop();
    }

    updateEditorUI(fileData) {
        // Update file info display
        this.showFileInfo(fileData);
        
        // Update save button state
        this.updateSaveButtonState();
        
        // Update preview
        this.updatePreview();
    }

    showFileInfo(fileData) {
        // Create or update file info display
        let fileInfo = document.querySelector('.file-info');
        if (!fileInfo) {
            fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            const editorControls = document.querySelector('.editor-controls');
            if (editorControls) {
                editorControls.appendChild(fileInfo);
            }
        }

        fileInfo.innerHTML = `
            <div class="file-details">
                <span class="file-name">�� ${fileData.name}</span>
                <span class="file-size">${(fileData.size / 1024).toFixed(1)}KB</span>
                <span class="file-type">${fileData.type || 'text/plain'}</span>
            </div>
        `;
    }

    // ===== EDITOR FUNCTIONALITY =====

    handleEditorInput(event) {
        const content = event.target.value;
        this.addToHistory(content);
        this.unsavedChanges = true;
        this.updateSaveButtonState();
        this.updatePreview();
    }

    handleEditorKeydown(event) {
        // Handle special keys
        if (event.key === 'Tab') {
            event.preventDefault();
            this.insertTab(event.target);
        }
        
        // Auto-indent for HTML
        if (event.key === 'Enter' && event.target.id === 'htmlEditor') {
            this.autoIndentHTML(event);
        }
    }

    handleEditorPaste(event) {
        // Clean up pasted content
        setTimeout(() => {
            this.cleanupPastedContent(event.target);
        }, 100);
    }

    insertTab(textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        
        textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 4;
    }

    autoIndentHTML(event) {
        const textarea = event.target;
        const cursorPos = textarea.selectionStart;
        const lineStart = textarea.value.lastIndexOf('\n', cursorPos - 1) + 1;
        const line = textarea.value.substring(lineStart, cursorPos);
        const indent = line.match(/^\s*/)[0];
        
        // Add proper indentation
        const newIndent = this.calculateHTMLIndent(textarea.value.substring(0, cursorPos));
        const spaces = '    '.repeat(newIndent);
        
        // Insert indentation
        const before = textarea.value.substring(0, cursorPos);
        const after = textarea.value.substring(cursorPos);
        textarea.value = before + '\n' + spaces + after;
        textarea.selectionStart = textarea.selectionEnd = cursorPos + 1 + spaces.length;
        
        event.preventDefault();
    }

    calculateHTMLIndent(content) {
        const lines = content.split('\n');
        let indent = 0;
        
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i].trim();
            if (line.startsWith('</')) {
                indent = Math.max(0, indent - 1);
            } else if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
                indent = indent + 1;
            }
        }
        
        return indent;
    }

    cleanupPastedContent(textarea) {
        // Remove extra whitespace and normalize line endings
        let content = textarea.value;
        content = content.replace(/\r\n/g, '\n'); // Normalize line endings
        content = content.replace(/\t/g, '    '); // Replace tabs with spaces
        
        if (textarea.value !== content) {
            textarea.value = content;
            this.addToHistory(content);
        }
    }

    // ===== HISTORY MANAGEMENT =====

    addToHistory(content) {
        // Remove future history if we're not at the end
        if (this.historyIndex < this.editorHistory.length - 1) {
            this.editorHistory = this.editorHistory.slice(0, this.historyIndex + 1);
        }
        
        // Add new content
        this.editorHistory.push(content);
        this.historyIndex++;
        
        // Limit history size
        if (this.editorHistory.length > this.maxHistorySize) {
            this.editorHistory.shift();
            this.historyIndex--;
        }
        
        this.updateUndoButtonState();
    }

    undoChanges() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const content = this.editorHistory[this.historyIndex];
            this.setContentToActiveEditor(content);
            this.updateUndoButtonState();
            this.unsavedChanges = true;
            this.updateSaveButtonState();
        }
    }

    redoChanges() {
        if (this.historyIndex < this.editorHistory.length - 1) {
            this.historyIndex++;
            const content = this.editorHistory[this.historyIndex];
            this.setContentToActiveEditor(content);
            this.updateUndoButtonState();
            this.unsavedChanges = true;
            this.updateSaveButtonState();
        }
    }

    setContentToActiveEditor(content) {
        const activeEditor = this.getActiveEditor();
        if (activeEditor) {
            activeEditor.value = content;
            this.updatePreview();
        }
    }

    getActiveEditor() {
        const editors = ['htmlEditor', 'cssEditor', 'jsEditor'];
        for (const editorId of editors) {
            const editor = document.getElementById(editorId);
            if (editor && editor.style.display !== 'none') {
                return editor;
            }
        }
        return null;
    }

    updateUndoButtonState() {
        const undoBtn = document.querySelector('[onclick="undoChanges()"]');
        if (undoBtn) {
            undoBtn.disabled = this.historyIndex <= 0;
        }
    }

    // ===== PREVIEW FUNCTIONALITY =====

    updatePreview() {
        if (!this.currentFile) return;

        const htmlContent = this.getHtmlContent();
        const cssContent = this.getCssContent();
        const jsContent = this.getJsContent();

        const previewFrame = document.getElementById('previewFrame');
        if (!previewFrame) return;

        try {
            const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow.document;
            previewDoc.open();
            previewDoc.write(this.generatePreviewHTML(htmlContent, cssContent, jsContent));
            previewDoc.close();
        } catch (error) {
            console.warn('Không thể cập nhật preview:', error);
        }
    }

    generatePreviewHTML(html, css, js) {
        return `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview - ${this.currentFile.name}</title>
                <style>
                    ${css || ''}
                    .preview-notice {
                        position: fixed;
                        top: 10px;
                        right: 10px;
                        background: rgba(0,0,0,0.8);
                        color: white;
                        padding: 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        z-index: 9999;
                    }
                </style>
            </head>
            <body>
                ${html || '<div class="preview-notice">Chưa có nội dung HTML</div>'}
                <div class="preview-notice">🔄 Live Preview - ${new Date().toLocaleTimeString()}</div>
                <script>
                    try {
                        ${js || ''}
                    } catch (error) {
                        console.error('JavaScript Error:', error);
                        document.body.innerHTML += '<div style="color: red; padding: 20px;">JavaScript Error: ' + error.message + '</div>';
                    }
                </script>
            </body>
            </html>
        `;
    }

    getHtmlContent() {
        const htmlEditor = document.getElementById('htmlEditor');
        return htmlEditor ? htmlEditor.value : '';
    }

    getCssContent() {
        const cssEditor = document.getElementById('cssEditor');
        return cssEditor ? cssEditor.value : '';
    }

    getJsContent() {
        const jsEditor = document.getElementById('jsEditor');
        return jsEditor ? jsEditor.value : '';
    }

    // ===== SAVE FUNCTIONALITY =====

    saveChanges() {
        if (!this.currentFile) {
            this.showError('Không có file nào để lưu');
            return;
        }

        try {
            // Update file content
            this.currentFile.content = this.getContentFromActiveEditor();
            
            // Save to localStorage (temporary)
            this.saveToLocalStorage();
            
            // Update project data
            this.updateProjectData();
            
            // Reset unsaved changes
            this.unsavedChanges = false;
            this.updateSaveButtonState();
            
            // Show success message
            this.showNotification('✅ Đã lưu thay đổi thành công!', 'success');
            
            console.log(`💾 Đã lưu file: ${this.currentFile.name}`);
            
        } catch (error) {
            console.error('❌ Lỗi khi lưu file:', error);
            this.showError(`Không thể lưu file: ${error.message}`);
        }
    }

    autoSave() {
        if (this.unsavedChanges && this.currentFile) {
            console.log('�� Auto-saving...');
            this.saveChanges();
        }
    }

    getContentFromActiveEditor() {
        const activeEditor = this.getActiveEditor();
        return activeEditor ? activeEditor.value : '';
    }

    saveToLocalStorage() {
        try {
            const key = `contentEditor_${this.currentFile.name}`;
            localStorage.setItem(key, this.currentFile.content);
        } catch (error) {
            console.warn('Không thể lưu vào localStorage:', error);
        }
    }

    updateProjectData() {
        if (window.adminPro && window.adminPro.projectData) {
            // Find and update file in project data
            const fileTypes = ['html', 'css', 'javascript'];
            
            for (const type of fileTypes) {
                const fileIndex = adminPro.projectData.files[type].findIndex(f => f.name === this.currentFile.name);
                if (fileIndex !== -1) {
                    adminPro.projectData.files[type][fileIndex].content = this.currentFile.content;
                    adminPro.projectData.files[type][fileIndex].lastModified = new Date().toISOString();
                    break;
                }
            }
            
            // Save project data
            adminPro.saveProjectData();
        }
    }

    // ===== UTILITY METHODS =====

    showEditorTab(tabName) {
        // Hide all textareas
        document.querySelectorAll('.code-textarea').forEach(textarea => {
            textarea.style.display = 'none';
        });
        
        // Show selected textarea
        const selectedTextarea = document.getElementById(tabName + 'Editor');
        if (selectedTextarea) {
            selectedTextarea.style.display = 'block';
        }
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[onclick="showEditorTab('${tabName}')"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
    }

    updateSaveButtonState() {
        const saveBtn = document.querySelector('[onclick="saveChanges()"]');
        if (saveBtn) {
            saveBtn.disabled = !this.unsavedChanges;
            saveBtn.innerHTML = this.unsavedChanges ? 
                '<i class="fas fa-save"></i> Lưu thay đổi *' : 
                '<i class="fas fa-save"></i> Lưu thay đổi';
        }
    }

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

    loadFile(fileData) {
        if (fileData) {
            this.setFileContent(fileData);
        }
    }

    getCurrentFile() {
        return this.currentFile;
    }

    hasUnsavedChanges() {
        return this.unsavedChanges;
    }

    enableAutoSave() {
        this.isAutoSaveEnabled = true;
        this.setupAutoSave();
        this.saveEditorSettings();
    }

    disableAutoSave() {
        this.isAutoSaveEnabled = false;
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }
        this.saveEditorSettings();
    }
}

// Initialize Content Editor
let contentEditor;

document.addEventListener('DOMContentLoaded', function() {
    contentEditor = new ContentEditor();
});

// Global functions for HTML onclick
function showEditorTab(tabName) {
    if (contentEditor) {
        contentEditor.showEditorTab(tabName);
    }
}

function saveChanges() {
    if (contentEditor) {
        contentEditor.saveChanges();
    }
}

function previewChanges() {
    if (contentEditor) {
        contentEditor.updatePreview();
        contentEditor.showNotification('🔄 Đã cập nhật preview', 'info');
    }
}

function undoChanges() {
    if (contentEditor) {
        contentEditor.undoChanges();
    }
}

function redoChanges() {
    if (contentEditor) {
        contentEditor.redoChanges();
    }
}

// Global functions for other modules
function loadFileForEdit(fileName) {
    if (contentEditor) {
        contentEditor.loadFile(fileName);
    }
}
