// ===== WEBSITE FLOW MANAGER - MAIN LOGIC =====

class WebsiteFlowManager {
    constructor() {
        this.projectData = null;
        this.currentProject = null;
        this.fileStructure = {};
        this.analysisResults = {};
        this.init();
    }

    init() {
        console.log('🚀 Website Flow Manager đang khởi động...');
        this.setupEventListeners();
        this.loadSavedData();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // File input change event
        const folderInput = document.getElementById('folderInput');
        if (folderInput) {
            folderInput.addEventListener('change', (e) => this.handleFolderSelection(e));
        }

        // Drag and drop events
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
            uploadArea.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        }

        // Global click events
        document.addEventListener('click', (e) => this.handleGlobalClick(e));
    }

    // ===== FOLDER SELECTION HANDLING =====
    async handleFolderSelection(event) {
        const files = Array.from(event.target.files);
        if (files.length === 0) return;

        console.log(`📁 Đã chọn ${files.length} file`);
        await this.processFiles(files);
    }

    // ===== DRAG AND DROP HANDLING =====
    handleDragOver(event) {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'copy';
    }

    handleDragEnter(event) {
        event.preventDefault();
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.classList.add('drag-over');
    }

    handleDragLeave(event) {
        event.preventDefault();
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.classList.remove('drag-over');
    }

    async handleDrop(event) {
        event.preventDefault();
        const uploadArea = document.getElementById('uploadArea');
        uploadArea.classList.remove('drag-over');

        const items = Array.from(event.dataTransfer.items);
        const files = [];

        for (const item of items) {
            if (item.kind === 'file') {
                const entry = item.webkitGetAsEntry();
                if (entry) {
                    await this.getFilesFromEntry(entry, files);
                }
            }
        }

        if (files.length > 0) {
            console.log(`�� Đã kéo thả ${files.length} file`);
            await this.processFiles(files);
        }
    }

    async getFilesFromEntry(entry, files, path = '') {
        if (entry.isFile) {
            const file = await this.getFileFromEntry(entry);
            if (file) {
                file.webkitRelativePath = path + entry.name;
                files.push(file);
            }
        } else if (entry.isDirectory) {
            const reader = entry.createReader();
            const entries = await this.readEntries(reader);
            for (const childEntry of entries) {
                await this.getFilesFromEntry(childEntry, files, path + entry.name + '/');
            }
        }
    }

    getFileFromEntry(entry) {
        return new Promise((resolve) => {
            entry.file(resolve);
        });
    }

    readEntries(reader) {
        return new Promise((resolve, reject) => {
            reader.readEntries(resolve, reject);
        });
    }

    // ===== FILE PROCESSING =====
    async processFiles(files) {
        try {
            this.showLoading(true);
            
            // Phân loại file theo loại
            const categorizedFiles = this.categorizeFiles(files);
            
            // Tạo cấu trúc dự án
            this.projectData = {
                name: this.extractProjectName(files),
                files: categorizedFiles,
                totalFiles: files.length,
                createdAt: new Date().toISOString(),
                lastModified: new Date().toISOString()
            };

            // Phân tích cấu trúc
            await this.analyzeProjectStructure();
            
            // Hiển thị kết quả
            this.displayProjectInfo();
            this.showMainPanels();
            
            // Lưu dữ liệu
            this.saveProjectData();
            
            console.log('✅ Đã xử lý xong dự án:', this.projectData.name);
            
        } catch (error) {
            console.error('❌ Lỗi khi xử lý file:', error);
            this.showError('Có lỗi xảy ra khi xử lý file. Vui lòng thử lại.');
        } finally {
            this.showLoading(false);
        }
    }

    categorizeFiles(files) {
        const categories = {
            html: [],
            javascript: [],
            css: [],
            images: [],
            other: []
        };

        files.forEach(file => {
            const extension = this.getFileExtension(file.name);
            const relativePath = file.webkitRelativePath || file.name;
            
            const fileInfo = {
                name: file.name,
                path: relativePath,
                size: file.size,
                type: file.type,
                extension: extension,
                lastModified: file.lastModified
            };

            switch (extension.toLowerCase()) {
                case 'html':
                    categories.html.push(fileInfo);
                    break;
                case 'js':
                    categories.javascript.push(fileInfo);
                    break;
                case 'css':
                    categories.css.push(fileInfo);
                    break;
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'svg':
                    categories.images.push(fileInfo);
                    break;
                default:
                    categories.other.push(fileInfo);
            }
        });

        return categories;
    }

    getFileExtension(filename) {
        return filename.split('.').pop();
    }

    extractProjectName(files) {
        if (files.length === 0) return 'Dự án không tên';
        
        // Tìm thư mục gốc
        const paths = files.map(f => f.webkitRelativePath || f.name);
        const rootDir = paths[0].split('/')[0];
        
        return rootDir || 'Dự án Website';
    }

    // ===== PROJECT ANALYSIS =====
    async analyzeProjectStructure() {
        console.log('�� Đang phân tích cấu trúc dự án...');
        
        // Phân tích HTML files
        this.analysisResults.html = await this.analyzeHtmlFiles();
        
        // Phân tích JavaScript files
        this.analysisResults.javascript = await this.analyzeJavaScriptFiles();
        
        // Phân tích CSS files
        this.analysisResults.css = await this.analyzeCssFiles();
        
        // Tìm vấn đề
        this.analysisResults.issues = this.findProjectIssues();
        
        console.log('✅ Đã phân tích xong cấu trúc dự án');
    }

    async analyzeHtmlFiles() {
        const htmlFiles = this.projectData.files.html;
        const results = [];

        for (const file of htmlFiles) {
            try {
                const content = await this.readFileContent(file);
                const analysis = this.analyzeHtmlContent(content, file);
                results.push(analysis);
            } catch (error) {
                console.warn(`⚠️ Không thể đọc file ${file.name}:`, error);
            }
        }

        return results;
    }

    async analyzeJavaScriptFiles() {
        const jsFiles = this.projectData.files.javascript;
        const results = [];

        for (const file of jsFiles) {
            try {
                const content = await this.readFileContent(file);
                const analysis = this.analyzeJavaScriptContent(content, file);
                results.push(analysis);
            } catch (error) {
                console.warn(`⚠️ Không thể đọc file ${file.name}:`, error);
            }
        }

        return results;
    }

    async analyzeCssFiles() {
        const cssFiles = this.projectData.files.css;
        const results = [];

        for (const cssFile of cssFiles) {
            try {
                const content = await this.readFileContent(cssFile);
                const analysis = this.analyzeCssContent(content, cssFile);
                results.push(analysis);
            } catch (error) {
                console.warn(`⚠️ Không thể đọc file ${cssFile.name}:`, error);
            }
        }

        return results;
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    analyzeHtmlContent(content, file) {
        const analysis = {
            file: file.name,
            path: file.path,
            title: this.extractHtmlTitle(content),
            links: this.extractHtmlLinks(content),
            scripts: this.extractHtmlScripts(content),
            styles: this.extractHtmlStyles(content),
            forms: this.extractHtmlForms(content),
            issues: []
        };

        // Tìm vấn đề
        if (!analysis.title) {
            analysis.issues.push('Thiếu thẻ title');
        }
        if (analysis.links.length === 0) {
            analysis.issues.push('Không có liên kết nào');
        }
        if (analysis.scripts.length === 0) {
            analysis.issues.push('Không có JavaScript');
        }

        return analysis;
    }

    analyzeJavaScriptContent(content, file) {
        const analysis = {
            file: file.name,
            path: file.path,
            functions: this.extractJavaScriptFunctions(content),
            imports: this.extractJavaScriptImports(content),
            variables: this.extractJavaScriptVariables(content),
            issues: []
        };

        // Tìm vấn đề
        if (analysis.functions.length === 0) {
            analysis.issues.push('Không có function nào');
        }
        if (content.includes('console.log')) {
            analysis.issues.push('Có console.log (cần xóa khi production)');
        }

        return analysis;
    }

    analyzeCssContent(content, file) {
        const analysis = {
            file: file.name,
            path: file.path,
            selectors: this.extractCssSelectors(content),
            mediaQueries: this.extractCssMediaQueries(content),
            variables: this.extractCssVariables(content),
            issues: []
        };

        // Tìm vấn đề
        if (analysis.selectors.length === 0) {
            analysis.issues.push('Không có CSS selector nào');
        }

        return analysis;
    }

    // ===== EXTRACTION METHODS =====
    extractHtmlTitle(content) {
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : null;
    }

    extractHtmlLinks(content) {
        const linkMatches = content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi);
        return linkMatches ? linkMatches.map(link => {
            const hrefMatch = link.match(/href=["']([^"']+)["']/i);
            return hrefMatch ? hrefMatch[1] : null;
        }).filter(Boolean) : [];
    }

    extractHtmlScripts(content) {
        const scriptMatches = content.match(/<script[^>]+src=["']([^"']+)["'][^>]*>/gi);
        return scriptMatches ? scriptMatches.map(script => {
            const srcMatch = script.match(/src=["']([^"']+)["']/i);
            return srcMatch ? srcMatch[1] : null;
        }).filter(Boolean) : [];
    }

    extractHtmlStyles(content) {
        const styleMatches = content.match(/<link[^>]+href=["']([^"']+)["'][^>]*rel=["']stylesheet["'][^>]*>/gi);
        return styleMatches ? styleMatches.map(style => {
            const hrefMatch = style.match(/href=["']([^"']+)["']/i);
            return hrefMatch ? hrefMatch[1] : null;
        }).filter(Boolean) : [];
    }

    extractHtmlForms(content) {
        const formMatches = content.match(/<form[^>]*>[\s\S]*?<\/form>/gi);
        return formMatches ? formMatches.length : 0;
    }

    extractJavaScriptFunctions(content) {
        const functionMatches = content.match(/function\s+(\w+)\s*\(/g);
        return functionMatches ? functionMatches.map(fn => {
            const nameMatch = fn.match(/function\s+(\w+)\s*\(/);
            return nameMatch ? nameMatch[1] : null;
        }).filter(Boolean) : [];
    }

    extractJavaScriptImports(content) {
        const importMatches = content.match(/import\s+.*?from\s+["']([^"']+)["']/g);
        return importMatches ? importMatches.map(imp => {
            const fromMatch = imp.match(/from\s+["']([^"']+)["']/);
            return fromMatch ? fromMatch[1] : null;
        }).filter(Boolean) : [];
    }

    extractJavaScriptVariables(content) {
        const varMatches = content.match(/const\s+(\w+)|let\s+(\w+)|var\s+(\w+)/g);
        return varMatches ? varMatches.map(v => {
            const nameMatch = v.match(/(?:const|let|var)\s+(\w+)/);
            return nameMatch ? nameMatch[1] : null;
        }).filter(Boolean) : [];
    }

    extractCssSelectors(content) {
        const selectorMatches = content.match(/([.#]?\w+(?:[^}]*?)\s*\{)/g);
        return selectorMatches ? selectorMatches.length : 0;
    }

    extractCssMediaQueries(content) {
        const mediaMatches = content.match(/@media[^{]+{/g);
        return mediaMatches ? mediaMatches.length : 0;
    }

    extractCssVariables(content) {
        const varMatches = content.match(/--[\w-]+/g);
        return varMatches ? varMatches.length : 0;
    }

    // ===== ISSUE DETECTION =====
    findProjectIssues() {
        const issues = [];
        
        // Kiểm tra file HTML
        if (this.projectData.files.html.length === 0) {
            issues.push({
                type: 'critical',
                message: 'Không có file HTML nào',
                category: 'structure'
            });
        }

        // Kiểm tra file CSS
        if (this.projectData.files.css.length === 0) {
            issues.push({
                type: 'warning',
                message: 'Không có file CSS nào',
                category: 'styling'
            });
        }

        // Kiểm tra file JavaScript
        if (this.projectData.files.javascript.length === 0) {
            issues.push({
                type: 'warning',
                message: 'Không có file JavaScript nào',
                category: 'functionality'
            });
        }

        // Kiểm tra kích thước file
        this.projectData.files.html.forEach(file => {
            if (file.size > 100000) { // 100KB
                issues.push({
                    type: 'warning',
                    message: `File ${file.name} quá lớn (${(file.size / 1024).toFixed(1)}KB)`,
                    category: 'performance'
                });
            }
        });

        return issues;
    }

    // ===== DISPLAY METHODS =====
    displayProjectInfo() {
        const projectInfo = document.getElementById('projectInfo');
        if (projectInfo) {
            projectInfo.style.display = 'block';
            
            document.getElementById('projectName').textContent = this.projectData.name;
            document.getElementById('fileCount').textContent = this.projectData.totalFiles;
            
            const statusElement = document.getElementById('projectStatus');
            statusElement.textContent = 'Đã quét xong';
            statusElement.className = 'value status-badge';
            statusElement.style.background = '#10b981';
            statusElement.style.color = 'white';
        }
    }

    showMainPanels() {
        // Hiển thị các panel chính
        const panels = ['flowDiagram', 'fileAnalysis', 'firebaseManager'];
        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.style.display = 'block';
            }
        });

        // Cập nhật tab content
        this.updateTabContent('html');
    }

    updateTabContent(tabName) {
        const tabContent = document.getElementById('tabContent');
        if (!tabContent) return;

        let content = '';
        
        switch (tabName) {
            case 'html':
                content = this.generateHtmlTabContent();
                break;
            case 'js':
                content = this.generateJavaScriptTabContent();
                break;
            case 'css':
                content = this.generateCssTabContent();
                break;
            case 'issues':
                content = this.generateIssuesTabContent();
                break;
        }

        tabContent.innerHTML = content;
    }

    generateHtmlTabContent() {
        if (!this.analysisResults.html) return '<p>Không có dữ liệu HTML</p>';

        let content = '<div class="file-list">';
        
        this.analysisResults.html.forEach(htmlFile => {
            content += `
                <div class="file-item">
                    <h4>${htmlFile.file}</h4>
                    <div class="file-details">
                        <p><strong>Tiêu đề:</strong> ${htmlFile.title || 'Không có'}</p>
                        <p><strong>Liên kết:</strong> ${htmlFile.links.length} link</p>
                        <p><strong>Scripts:</strong> ${htmlFile.scripts.length} file</p>
                        <p><strong>Styles:</strong> ${htmlFile.styles.length} file</p>
                        <p><strong>Forms:</strong> ${htmlFile.forms} form</p>
                    </div>
                    ${htmlFile.issues.length > 0 ? `
                        <div class="file-issues">
                            <strong>Vấn đề:</strong>
                            <ul>
                                ${htmlFile.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        content += '</div>';
        return content;
    }

    generateJavaScriptTabContent() {
        if (!this.analysisResults.javascript) return '<p>Không có dữ liệu JavaScript</p>';

        let content = '<div class="file-list">';
        
        this.analysisResults.javascript.forEach(jsFile => {
            content += `
                <div class="file-item">
                    <h4>${jsFile.file}</h4>
                    <div class="file-details">
                        <p><strong>Functions:</strong> ${jsFile.functions.length} function</p>
                        <p><strong>Imports:</strong> ${jsFile.imports.length} import</p>
                        <p><strong>Variables:</strong> ${jsFile.variables.length} variable</p>
                    </div>
                    ${jsFile.issues.length > 0 ? `
                        <div class="file-issues">
                            <strong>Vấn đề:</strong>
                            <ul>
                                ${jsFile.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        content += '</div>';
        return content;
    }

    generateCssTabContent() {
        if (!this.analysisResults.css) return '<p>Không có dữ liệu CSS</p>';

        let content = '<div class="file-list">';
        
        this.analysisResults.css.forEach(cssFile => {
            content += `
                <div class="file-item">
                    <h4>${cssFile.file}</h4>
                    <div class="file-details">
                        <p><strong>Selectors:</strong> ${cssFile.selectors} selector</p>
                        <p><strong>Media Queries:</strong> ${cssFile.mediaQueries} query</p>
                        <p><strong>Variables:</strong> ${cssFile.variables} variable</p>
                    </div>
                    ${cssFile.issues.length > 0 ? `
                        <div class="files-issues">
                            <strong>Vấn đề:</strong>
                            <ul>
                                ${cssFile.issues.map(issue => `<li>${issue}</li>`).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            `;
        });

        content += '</div>';
        return content;
    }

    generateIssuesTabContent() {
        if (!this.analysisResults.issues) return '<p>Không có vấn đề nào</p>';

        let content = '<div class="issues-list">';
        
        this.analysisResults.issues.forEach(issue => {
            const typeClass = issue.type === 'critical' ? 'issue-critical' : 'issue-warning';
            content += `
                <div class="issue-item ${typeClass}">
                    <div class="issue-header">
                        <i class="fas fa-${issue.type === 'critical' ? 'exclamation-triangle' : 'info-circle'}"></i>
                        <span class="issue-type">${issue.type === 'critical' ? 'Nghiêm trọng' : 'Cảnh báo'}</span>
                        <span class="issue-category">${issue.category}</span>
                    </div>
                    <p class="issue-message">${issue.message}</p>
                </div>
            `;
        });

        content += '</div>';
        return content;
    }

    // ===== UTILITY METHODS =====
    showLoading(show) {
        const uploadArea = document.getElementById('uploadArea');
        if (uploadArea) {
            if (show) {
                uploadArea.classList.add('loading');
            } else {
                uploadArea.classList.remove('loading');
            }
        }
    }

    showError(message) {
        alert(`❌ Lỗi: ${message}`);
    }

    loadSavedData() {
        try {
            const saved = localStorage.getItem('websiteFlowManagerData');
            if (saved) {
                this.projectData = JSON.parse(saved);
                this.displayProjectInfo();
                this.showMainPanels();
            }
        } catch (error) {
            console.warn('Không thể load dữ liệu đã lưu:', error);
        }
    }

    saveProjectData() {
        try {
            localStorage.setItem('websiteFlowManagerData', JSON.stringify(this.projectData));
        } catch (error) {
            console.warn('Không thể lưu dữ liệu:', error);
        }
    }

    showWelcomeMessage() {
        console.log('🎉 Website Flow Manager đã sẵn sàng!');
        console.log('📁 Kéo thả thư mục website vào khu vực upload để bắt đầu');
    }

    handleGlobalClick(event) {
        // Handle global click events if needed
    }
}

// ===== GLOBAL FUNCTIONS =====
let flowManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    flowManager = new WebsiteFlowManager();
});

// Global functions for HTML onclick
function showTab(tabName) {
    if (flowManager) {
        flowManager.updateTabContent(tabName);
        
        // Update active tab button
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
    }
}

function showPanel(panelId) {
    // Hide all panels first
    const panels = ['flowDiagram', 'fileAnalysis', 'firebaseManager'];
    panels.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.style.display = 'none';
    });
    
    // Show selected panel
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
    }
}

function showHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function openProject() {
    document.getElementById('folderInput').click();
}

function exportProject() {
    if (flowManager && flowManager.projectData) {
        const dataStr = JSON.stringify(flowManager.projectData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${flowManager.projectData.name}-export.json`;
        link.click();
        URL.revokeObjectURL(url);
    } else {
        alert('Chưa có dự án nào để xuất!');
    }
}

// Zoom functions for flow diagram
function zoomIn() {
    // Will be implemented in flow-diagram.js
    console.log('Phóng to');
}

function zoomOut() {
    // Will be implemented in flow-diagram.js
    console.log('Thu nhỏ');
}

function resetZoom() {
    // Will be implemented in flow-diagram.js
    console.log('Reset zoom');
}
