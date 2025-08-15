// ===== WEBSITE ADMIN PRO - MAIN LOGIC =====

class WebsiteAdminPro {
    constructor() {
        this.projectData = null;
        this.currentProject = null;
        this.fileStructure = {};
        this.analysisResults = {};
        this.currentEditorFile = null;
        this.editorHistory = [];
        this.init();
    }

    init() {
        console.log('🚀 Website Admin Pro đang khởi động...');
        this.setupEventListeners();
        this.loadSavedData();
        this.showWelcomeMessage();
        this.initializeModules();
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

        // Image input for clone tool
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageSelection(e));
        }
    }

    initializeModules() {
        // Wait for all modules to be ready
        setTimeout(() => {
            try {
                // Check if FlowManager is available
                if (window.flowManager && typeof window.flowManager.init === 'function') {
                    console.log('✅ Flow Manager đã sẵn sàng');
                    window.flowManager.init();
                } else {
                    console.log('⚠️ Flow Manager chưa sẵn sàng, sẽ thử lại sau...');
                    // Retry after 500ms
                    setTimeout(() => this.initializeModules(), 500);
                    return;
                }

                // Check other modules
                if (window.mobilePreview) {
                    console.log('✅ Mobile Preview đã sẵn sàng');
                    window.mobilePreview.init();
                }

                if (window.contentEditor) {
                    console.log('✅ Content Editor đã sẵn sàng');
                    window.contentEditor.init();
                }

                if (window.cloneTool) {
                    console.log('✅ Clone Tool đã sẵn sàng');
                    window.cloneTool.init();
                }

                if (window.fileAnalyzer) {
                    console.log('✅ File Analyzer đã sẵn sàng');
                    window.fileAnalyzer.init();
                }

                console.log('🎉 Tất cả modules đã sẵn sàng!');
                
            } catch (error) {
                console.error('❌ Lỗi khi khởi tạo modules:', error);
                // Retry after 1 second
                setTimeout(() => this.initializeModules(), 1000);
            }
        }, 100);
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
            console.log(` Đang xử lý ${files.length} file...`);
            
            // Process files
            await this.analyzeProjectStructure(files);
            
            // Update UI immediately after processing
            this.updateProjectInfo();
            this.renderFlowDiagram();
            this.showSuccessMessage(`✅ Đã xử lý xong dự án: ${this.currentProject}`);
            
        } catch (error) {
            console.error('❌ Lỗi khi xử lý files:', error);
            this.showErrorMessage('❌ Lỗi khi xử lý files: ' + error.message);
        }
    }

    updateProjectInfo() {
        console.log('🔄 Đang cập nhật thông tin dự án...');
        
        const projectInfo = document.getElementById('projectInfo');
        if (!projectInfo) {
            console.error('❌ Không tìm thấy element projectInfo');
            return;
        }

        if (this.projectData) {
            const totalFiles = this.projectData.files.html.length + 
                             this.projectData.files.css.length + 
                             this.projectData.files.javascript.length;
            
            projectInfo.innerHTML = `
                <div class="info-item">
                    <strong>Tên dự án:</strong> ${this.currentProject || 'public'}
                </div>
                <div class="info-item">
                    <strong>Số file:</strong> ${totalFiles}
                </div>
                <div class="info-item">
                    <strong>Trạng thái:</strong> <span class="status-success">Đã quét</span>
                </div>
                <div class="info-item">
                    <strong>Luồng chính:</strong> ${this.getMainFlow()}
                </div>
            `;
            
            console.log('✅ Đã cập nhật thông tin dự án');
        } else {
            console.log('⚠️ Không có dữ liệu dự án để cập nhật');
        }
    }

    getMainFlow() {
        if (!this.projectData || !this.projectData.files.html.length) {
            return 'Chưa xác định';
        }
        
        // Find main entry points
        const mainFiles = this.projectData.files.html.filter(f => 
            f.name.includes('index') || f.name.includes('login') || f.name.includes('home')
        );
        
        if (mainFiles.length > 0) {
            return mainFiles.map(f => f.name).join(' → ');
        }
        
        return 'Chưa xác định';
    }

    renderFlowDiagram() {
        console.log('🔄 Đang render sơ đồ luồng...');
        
        const flowContainer = document.getElementById('flowContainer');
        if (!flowContainer) {
            console.error('❌ Không tìm thấy element flowContainer');
            return;
        }

        if (this.projectData && this.projectData.files.html.length > 0) {
            const htmlFiles = this.projectData.files.html;
            let flowHTML = '<div class="flow-diagram">';
            
            htmlFiles.forEach((file, index) => {
                flowHTML += `
                    <div class="flow-page" data-file="${file.name}">
                        <div class="page-icon">📄</div>
                        <div class="page-name">${file.name}</div>
                        <div class="page-actions">
                            <button onclick="viewPage('${file.name}')" class="btn-view">👁️ Xem</button>
                            <button onclick="editPage('${file.name}')" class="btn-edit">✏️ Sửa</button>
                        </div>
                    </div>
                `;
                
                // Add connection arrow if not last
                if (index < htmlFiles.length - 1) {
                    flowHTML += '<div class="flow-arrow">→</div>';
                }
            });
            
            flowHTML += '</div>';
            flowContainer.innerHTML = flowHTML;
            
            console.log('✅ Đã render sơ đồ luồng');
        } else {
            flowContainer.innerHTML = '<p class="no-data">Chưa có dữ liệu để hiển thị</p>';
            console.log('⚠️ Không có dữ liệu để render sơ đồ luồng');
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
                lastModified: file.lastModified,
                content: null // Will be loaded when needed
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
        
        return rootDir || 'Dự án Website eTAX';
    }

    generateDefaultFlow(categorizedFiles) {
        const flow = {
            login: 'login.html',
            index: 'index.html',
            pages: []
        };

        // Tìm file login.html
        const loginFile = categorizedFiles.html.find(f => f.name.toLowerCase().includes('login'));
        if (loginFile) {
            flow.login = loginFile.name;
        }

        // Tìm file index.html
        const indexFile = categorizedFiles.html.find(f => f.name.toLowerCase().includes('index'));
        if (indexFile) {
            flow.index = indexFile.name;
        }

        // Thêm các trang khác
        categorizedFiles.html.forEach(file => {
            if (file.name !== flow.login && file.name !== flow.index) {
                flow.pages.push(file.name);
            }
        });

        return flow;
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
                file.content = content; // Store content for editor
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
                file.content = content; // Store content for editor
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
                cssFile.content = content; // Store content for editor
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
            // Check if file is valid
            if (!file || !(file instanceof File)) {
                reject(new Error('File không hợp lệ'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            
            try {
                reader.readAsText(file);
            } catch (error) {
                reject(new Error(`Không thể đọc file: ${error.message}`));
            }
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

            // Hiển thị luồng chính
            const mainFlowElement = document.getElementById('mainFlow');
            if (mainFlowElement) {
                mainFlowElement.textContent = `${this.projectData.flow.login} → ${this.projectData.flow.index}`;
            }
        }
    }

    showMainPanels() {
        // Hiển thị các panel chính
        const panels = ['flowManager', 'mobilePreview', 'contentEditor', 'cloneTool', 'databaseManager', 'userManager'];
        panels.forEach(panelId => {
            const panel = document.getElementById(panelId);
            if (panel) {
                panel.style.display = 'block';
            }
        });
    }

    updateFileSelector() {
        const fileSelector = document.getElementById('fileSelector');
        if (!fileSelector) return;

        fileSelector.innerHTML = '<option value="">Chọn file để chỉnh sửa</option>';

        // Thêm HTML files
        this.projectData.files.html.forEach(file => {
            const option = document.createElement('option');
            option.value = file.name;
            option.textContent = `📄 ${file.name}`;
            fileSelector.appendChild(option);
        });

        // Thêm CSS files
        this.projectData.files.css.forEach(file => {
            const option = document.createElement('option');
            option.value = file.name;
            option.textContent = `🎨 ${file.name}`;
            fileSelector.appendChild(option);
        });

        // Thêm JavaScript files
        this.projectData.files.javascript.forEach(file => {
            const option = document.createElement('option');
            option.value = file.name;
            option.textContent = `⚡ ${file.name}`;
            fileSelector.appendChild(option);
        });
    }

    // ===== IMAGE HANDLING =====
    handleImageSelection(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            this.displayImagePreview(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview(imageSrc) {
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        if (imagePreview && previewImage) {
            previewImage.src = imageSrc;
            imagePreview.style.display = 'block';
        }
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
            const saved = localStorage.getItem('websiteAdminProData');
            if (saved) {
                this.projectData = JSON.parse(saved);
                this.displayProjectInfo();
                this.showMainPanels();
                this.updateFileSelector();
            }
        } catch (error) {
            console.warn('Không thể load dữ liệu đã lưu:', error);
        }
    }

    saveProjectData() {
        try {
            localStorage.setItem('websiteAdminProData', JSON.stringify(this.projectData));
        } catch (error) {
            console.warn('Không thể lưu dữ liệu:', error);
        }
    }

    showWelcomeMessage() {
        console.log('🎉 Website Admin Pro đã sẵn sàng!');
        console.log('📁 Kéo thả thư mục website eTAX vào khu vực upload để bắt đầu');
    }

    handleGlobalClick(event) {
        // Handle global click events if needed
    }
}

// ===== GLOBAL FUNCTIONS =====
let adminPro;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for DOM to be fully ready
    setTimeout(() => {
        window.flowManager = new FlowManager();
        console.log('✅ Flow Manager đã được khởi tạo thành công');
    }, 100);
});

// Global functions for HTML onclick
function openProject() {
    document.getElementById('folderInput').click();
}

function showHelp() {
    const modal = document.getElementById('helpModal');
    if (modal) modal.style.display = 'block';
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function showMobilePreview() {
    showPanel('mobilePreview');
}

function showPanel(panelId) {
    // Hide all panels first
    const panels = ['flowManager', 'mobilePreview', 'contentEditor', 'cloneTool', 'databaseManager', 'userManager'];
    panels.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.style.display = 'none';
    });
    
    // Show selected panel
    const selectedPanel = document.getElementById(panelId);
    if (selectedPanel) {
        selectedPanel.style.display = 'block';
    }

    // Update active sidebar button
    document.querySelectorAll('.sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const activeBtn = document.querySelector(`[onclick="showPanel('${panelId}')"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Flow Manager functions
function addNewPage() {
    alert('Tính năng thêm trang mới sẽ được phát triển trong Module tiếp theo!');
}

function editFlow() {
    alert('Tính năng chỉnh sửa luồng sẽ được phát triển trong Module tiếp theo!');
}

function testFlow() {
    alert('Tính năng test luồng sẽ được phát triển trong Module tiếp theo!');
}

function editPage(pageName) {
    showPanel('contentEditor');
    // Load file for editing
    if (adminPro && adminPro.projectData) {
        const file = adminPro.projectData.files.html.find(f => f.name === pageName) ||
                    adminPro.projectData.files.css.find(f => f.name === pageName) ||
                    adminPro.projectData.files.javascript.find(f => f.name === pageName);
        
        if (file) {
            document.getElementById('fileSelector').value = file.name;
            if (window.contentEditor) {
                window.contentEditor.loadFile(file);
            }
        }
    }
}

function previewPage(pageName) {
    showPanel('mobilePreview');
    // Load page for preview
    if (adminPro && adminPro.projectData) {
        const file = adminPro.projectData.files.html.find(f => f.name === pageName);
        if (file && window.mobilePreview) {
            window.mobilePreview.loadPage(file);
        }
    }
}

function manageOtherPages() {
    alert('Tính năng quản lý các trang khác sẽ được phát triển trong Module tiếp theo!');
}

// Mobile Preview functions
function rotateDevice() {
    if (window.mobilePreview) {
        window.mobilePreview.rotateDevice();
    }
}

function fullscreenPreview() {
    if (window.mobilePreview) {
        window.mobilePreview.fullscreen();
    }
}

// Content Editor functions
function loadFileForEdit() {
    const fileSelector = document.getElementById('fileSelector');
    const fileName = fileSelector.value;
    
    if (!fileName || !adminPro || !adminPro.projectData) return;
    
    const file = adminPro.projectData.files.html.find(f => f.name === fileName) ||
                adminPro.projectData.files.css.find(f => f.name === fileName) ||
                adminPro.projectData.files.javascript.find(f => f.name === fileName);
    
    if (file && window.contentEditor) {
        window.contentEditor.loadFile(file);
    }
}

function saveChanges() {
    if (window.contentEditor) {
        window.contentEditor.saveChanges();
    }
}

function previewChanges() {
    if (window.contentEditor) {
        window.contentEditor.previewChanges();
    }
}

function undoChanges() {
    if (window.contentEditor) {
        window.contentEditor.undoChanges();
    }
}

function showEditorTab(tabName) {
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
    
    const activeBtn = event.target;
    activeBtn.classList.add('active');
}

// Clone Tool functions
function analyzeImage() {
    if (window.cloneTool) {
        window.cloneTool.analyzeImage();
    }
}

function clearImage() {
    const imagePreview = document.getElementById('imagePreview');
    const imageInput = document.getElementById('imageInput');
    
    if (imagePreview) imagePreview.style.display = 'none';
    if (imageInput) imageInput.value = '';
}

function createFromTemplate() {
    if (window.cloneTool) {
        window.cloneTool.createFromTemplate();
    }
}

// Database Manager functions
function connectDatabase() {
    if (window.databaseManager) {
        window.databaseManager.connect();
    }
}

function viewData() {
    if (window.databaseManager) {
        window.databaseManager.viewData();
    }
}

function addRecord() {
    if (window.databaseManager) {
        window.databaseManager.addRecord();
    }
}

function backupData() {
    if (window.databaseManager) {
        window.databaseManager.backup();
    }
}

// User Manager functions
function addUser() {
    if (window.userManager) {
        window.userManager.addUser();
    }
}

function importUsers() {
    if (window.userManager) {
        window.userManager.importUsers();
    }
}

function exportUsers() {
    if (window.userManager) {
        window.userManager.exportUsers();
    }
}

// Deploy function
function deployToFirebase() {
    alert('Tính năng Deploy Firebase sẽ được phát triển trong Module tiếp theo!');
}
