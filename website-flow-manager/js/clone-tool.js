// ===== CLONE TOOL MODULE - Tạo từ Ảnh hoặc Template =====

class CloneTool {
    constructor() {
        this.currentImage = null;
        this.imageAnalysis = null;
        this.templates = {};
        this.generatedCode = null;
        this.init();
    }

    init() {
        console.log('�� Clone Tool đang khởi động...');
        this.loadTemplates();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    setupEventListeners() {
        // Image input change
        const imageInput = document.getElementById('imageInput');
        if (imageInput) {
            imageInput.addEventListener('change', (e) => this.handleImageSelection(e));
        }

        // Template selector change
        const templateSelector = document.getElementById('templateSelector');
        if (templateSelector) {
            templateSelector.addEventListener('change', (e) => this.handleTemplateSelection(e));
        }

        // Create from template button
        const createBtn = document.querySelector('[onclick="createFromTemplate()"]');
        if (createBtn) {
            createBtn.addEventListener('click', () => this.createFromTemplate());
        }

        // Analyze image button
        const analyzeBtn = document.querySelector('[onclick="analyzeImage()"]');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => this.analyzeImage());
        }

        // Clear image button
        const clearBtn = document.querySelector('[onclick="clearImage()"]');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearImage());
        }
    }

    loadTemplates() {
        // Load predefined templates
        this.templates = {
            login: {
                name: 'Trang đăng nhập',
                description: 'Form đăng nhập với username/password',
                category: 'authentication',
                html: this.getLoginTemplateHTML(),
                css: this.getLoginTemplateCSS(),
                js: this.getLoginTemplateJS()
            },
            dashboard: {
                name: 'Dashboard',
                description: 'Bảng điều khiển với thống kê',
                category: 'admin',
                html: this.getDashboardTemplateHTML(),
                css: this.getDashboardTemplateCSS(),
                js: this.getDashboardTemplateJS()
            },
            form: {
                name: 'Form nhập liệu',
                description: 'Form nhập thông tin với validation',
                category: 'input',
                html: this.getFormTemplateHTML(),
                css: this.getFormTemplateCSS(),
                js: this.getFormTemplateJS()
            },
            list: {
                name: 'Danh sách',
                description: 'Hiển thị danh sách dữ liệu',
                category: 'display',
                html: this.getListTemplateHTML(),
                css: this.getListTemplateCSS(),
                js: this.getListTemplateJS()
            },
            detail: {
                name: 'Chi tiết',
                description: 'Trang hiển thị thông tin chi tiết',
                category: 'display',
                html: this.getDetailTemplateHTML(),
                css: this.getDetailTemplateCSS(),
                js: this.getDetailTemplateJS()
            }
        };

        console.log(`📚 Đã load ${Object.keys(this.templates).length} templates`);
    }

    showWelcomeMessage() {
        console.log('🎉 Clone Tool đã sẵn sàng!');
        console.log('📸 Upload ảnh để clone hoặc chọn template có sẵn');
    }

    // ===== IMAGE HANDLING =====

    handleImageSelection(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate image file
        if (!this.validateImageFile(file)) {
            return;
        }

        // Load and display image
        this.loadImage(file);
    }

    validateImageFile(file) {
        // Check file type
        if (!file.type.startsWith('image/')) {
            this.showError('Vui lòng chọn file ảnh!');
            return false;
        }

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            this.showError('File ảnh quá lớn! Tối đa 10MB');
            return false;
        }

        return true;
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = {
                file: file,
                dataUrl: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
            };
            
            this.displayImagePreview();
            this.showImageAnalysisOptions();
        };
        reader.readAsDataURL(file);
    }

    displayImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        const previewImage = document.getElementById('previewImage');
        
        if (imagePreview && previewImage) {
            previewImage.src = this.currentImage.dataUrl;
            imagePreview.style.display = 'block';
            
            // Add image info
            this.addImageInfo();
        }
    }

    addImageInfo() {
        const imagePreview = document.getElementById('imagePreview');
        if (!imagePreview) return;

        // Add image details
        const imageInfo = document.createElement('div');
        imageInfo.className = 'image-info';
        imageInfo.innerHTML = `
            <div class="info-item">
                <strong>Tên file:</strong> ${this.currentImage.name}
            </div>
            <div class="info-item">
                <strong>Kích thước:</strong> ${(this.currentImage.size / 1024).toFixed(1)}KB
            </div>
            <div class="info-item">
                <strong>Loại:</strong> ${this.currentImage.type}
            </div>
        `;

        // Insert before actions
        const actions = imagePreview.querySelector('.image-actions');
        if (actions) {
            imagePreview.insertBefore(imageInfo, actions);
        }
    }

    showImageAnalysisOptions() {
        // Show additional analysis options
        const analyzeBtn = document.querySelector('[onclick="analyzeImage()"]');
        if (analyzeBtn) {
            analyzeBtn.style.display = 'inline-block';
        }
    }

    clearImage() {
        this.currentImage = null;
        this.imageAnalysis = null;
        this.generatedCode = null;

        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.style.display = 'none';
        }

        // Hide analyze button
        const analyzeBtn = document.querySelector('[onclick="analyzeImage()"]');
        if (analyzeBtn) {
            analyzeBtn.style.display = 'none';
        }

        console.log('🧹 Đã xóa ảnh');
    }

    // ===== IMAGE ANALYSIS =====

    async analyzeImage() {
        if (!this.currentImage) {
            this.showError('Không có ảnh để phân tích!');
            return;
        }

        try {
            this.showAnalysisProgress();
            
            // Simulate image analysis (in real app, this would use AI/ML)
            const analysis = await this.performImageAnalysis();
            
            this.imageAnalysis = analysis;
            this.displayAnalysisResults(analysis);
            
            // Generate code based on analysis
            this.generateCodeFromAnalysis(analysis);
            
            console.log('✅ Đã phân tích ảnh thành công');
            
        } catch (error) {
            console.error('❌ Lỗi khi phân tích ảnh:', error);
            this.showError(`Lỗi phân tích ảnh: ${error.message}`);
        }
    }

    showAnalysisProgress() {
        const analyzeBtn = document.querySelector('[onclick="analyzeImage()"]');
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang phân tích...';
            analyzeBtn.disabled = true;
        }
    }

    async performImageAnalysis() {
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Analyze image characteristics
        const analysis = {
            layout: this.analyzeLayout(),
            colors: this.analyzeColors(),
            components: this.analyzeComponents(),
            text: this.analyzeText(),
            style: this.analyzeStyle()
        };

        return analysis;
    }

    analyzeLayout() {
        // Analyze layout structure
        const layouts = ['single-column', 'two-column', 'grid', 'card-based', 'sidebar'];
        return layouts[Math.floor(Math.random() * layouts.length)];
    }

    analyzeColors() {
        // Analyze color scheme
        const colorSchemes = ['blue', 'green', 'red', 'purple', 'orange', 'neutral'];
        return colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
    }

    analyzeComponents() {
        // Analyze UI components
        const components = [];
        
        if (Math.random() > 0.5) components.push('header');
        if (Math.random() > 0.5) components.push('navigation');
        if (Math.random() > 0.3) components.push('sidebar');
        if (Math.random() > 0.7) components.push('footer');
        if (Math.random() > 0.6) components.push('cards');
        if (Math.random() > 0.4) components.push('forms');
        if (Math.random() > 0.5) components.push('buttons');
        if (Math.random() > 0.3) components.push('tables');

        return components.length > 0 ? components : ['header', 'content'];
    }

    analyzeText() {
        // Analyze text content
        return {
            hasTitle: Math.random() > 0.3,
            hasSubtitle: Math.random() > 0.5,
            hasDescription: Math.random() > 0.6,
            hasLabels: Math.random() > 0.7
        };
    }

    analyzeStyle() {
        // Analyze visual style
        return {
            modern: Math.random() > 0.4,
            minimal: Math.random() > 0.5,
            colorful: Math.random() > 0.6,
            professional: Math.random() > 0.7
        };
    }

    displayAnalysisResults(analysis) {
        // Reset analyze button
        const analyzeBtn = document.querySelector('[onclick="analyzeImage()"]');
        if (analyzeBtn) {
            analyzeBtn.innerHTML = '<i class="fas fa-magic"></i> Phân tích & Tạo';
            analyzeBtn.disabled = false;
        }

        // Show analysis results
        this.showAnalysisModal(analysis);
    }

    showAnalysisModal(analysis) {
        const modalHTML = `
            <div class="analysis-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-search"></i> Kết quả Phân tích Ảnh</h3>
                    <button class="close-btn" onclick="cloneTool.closeAnalysisModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="analysis-grid">
                        <div class="analysis-item">
                            <h4>🎨 Layout</h4>
                            <p><strong>${analysis.layout}</strong></p>
                        </div>
                        <div class="analysis-item">
                            <h4>🌈 Màu sắc</h4>
                            <p><strong>${analysis.colors}</strong></p>
                        </div>
                        <div class="analysis-item">
                            <h4>🧩 Components</h4>
                            <ul>
                                ${analysis.components.map(comp => `<li>${comp}</li>`).join('')}
                            </ul>
                        </div>
                        <div class="analysis-item">
                            <h4>📝 Nội dung</h4>
                            <ul>
                                ${Object.entries(analysis.text).map(([key, value]) => 
                                    `<li>${key}: ${value ? '✅' : '❌'}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="analysis-item">
                            <h4>🎭 Phong cách</h4>
                            <ul>
                                ${Object.entries(analysis.style).map(([key, value]) => 
                                    `<li>${key}: ${value ? '✅' : '❌'}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                    <div class="analysis-actions">
                        <button class="btn btn-primary" onclick="cloneTool.generateCodeFromAnalysis()">
                            <i class="fas fa-code"></i> Tạo Code
                        </button>
                        <button class="btn btn-secondary" onclick="cloneTool.closeAnalysisModal()">
                            <i class="fas fa-times"></i> Đóng
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal analysis-modal';
        modal.id = 'analysisModal';
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    closeAnalysisModal() {
        const modal = document.getElementById('analysisModal');
        if (modal) {
            modal.remove();
        }
    }

    generateCodeFromAnalysis(analysis = null) {
        if (!analysis && !this.imageAnalysis) {
            this.showError('Không có dữ liệu phân tích!');
            return;
        }

        const analysisData = analysis || this.imageAnalysis;
        
        try {
            // Generate HTML based on analysis
            const html = this.generateHTMLFromAnalysis(analysisData);
            const css = this.generateCSSFromAnalysis(analysisData);
            const js = this.generateJSFromAnalysis(analysisData);

            this.generatedCode = { html, css, js };
            
            // Show generated code
            this.showGeneratedCode(html, css, js);
            
            console.log('✅ Đã tạo code từ phân tích ảnh');
            
        } catch (error) {
            console.error('❌ Lỗi khi tạo code:', error);
            this.showError(`Lỗi tạo code: ${error.message}`);
        }
    }

    generateHTMLFromAnalysis(analysis) {
        let html = '<!DOCTYPE html>\n<html lang="vi">\n<head>\n';
        html += '    <meta charset="UTF-8">\n';
        html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
        html += '    <title>Trang được tạo từ ảnh</title>\n';
        html += '    <link rel="stylesheet" href="styles.css">\n';
        html += '</head>\n<body>\n';

        // Generate header
        if (analysis.components.includes('header')) {
            html += '    <header class="header">\n';
            html += '        <div class="container">\n';
            html += '            <h1 class="logo">Logo</h1>\n';
            if (analysis.components.includes('navigation')) {
                html += '            <nav class="nav">\n';
                html += '                <ul>\n';
                html += '                    <li><a href="#home">Trang chủ</a></li>\n';
                html += '                    <li><a href="#about">Giới thiệu</a></li>\n';
                html += '                    <li><a href="#contact">Liên hệ</a></li>\n';
                html += '                </ul>\n';
                html += '            </nav>\n';
            }
            html += '        </div>\n';
            html += '    </header>\n';
        }

        // Generate main content
        html += '    <main class="main">\n';
        html += '        <div class="container">\n';

        if (analysis.layout === 'single-column') {
            html += this.generateSingleColumnContent(analysis);
        } else if (analysis.layout === 'two-column') {
            html += this.generateTwoColumnContent(analysis);
        } else if (analysis.layout === 'grid') {
            html += this.generateGridContent(analysis);
        } else if (analysis.layout === 'card-based') {
            html += this.generateCardContent(analysis);
        }

        html += '        </div>\n';
        html += '    </main>\n';

        // Generate footer
        if (analysis.components.includes('footer')) {
            html += '    <footer class="footer">\n';
            html += '        <div class="container">\n';
            html += '            <p>&copy; 2024. Được tạo bởi Clone Tool</p>\n';
            html += '        </div>\n';
        html += '    </footer>\n';
        }

        html += '    <script src="script.js"></script>\n';
        html += '</body>\n</html>';

        return html;
    }

    generateSingleColumnContent(analysis) {
        let content = '';
        
        if (analysis.text.hasTitle) {
            content += '            <h1 class="title">Tiêu đề chính</h1>\n';
        }
        if (analysis.text.hasSubtitle) {
            content += '            <h2 class="subtitle">Tiêu đề phụ</h2>\n';
        }
        if (analysis.text.hasDescription) {
            content += '            <p class="description">Mô tả nội dung chính của trang</p>\n';
        }
        if (analysis.components.includes('forms')) {
            content += '            <form class="form">\n';
            content += '                <input type="text" placeholder="Nhập thông tin">\n';
            content += '                <button type="submit">Gửi</button>\n';
            content += '            </form>\n';
        }

        return content;
    }

    generateTwoColumnContent(analysis) {
        let content = '';
        content += '            <div class="two-column-layout">\n';
        content += '                <div class="column-left">\n';
        content += '                    <h2>Cột trái</h2>\n';
        content += '                    <p>Nội dung cột trái</p>\n';
        content += '                </div>\n';
        content += '                <div class="column-right">\n';
        content += '                    <h2>Cột phải</h2>\n';
        content += '                    <p>Nội dung cột phải</p>\n';
        content += '                </div>\n';
        content += '            </div>\n';
        return content;
    }

    generateGridContent(analysis) {
        let content = '';
        content += '            <div class="grid-layout">\n';
        for (let i = 1; i <= 6; i++) {
            content += `                <div class="grid-item">\n`;
            content += `                    <h3>Item ${i}</h3>\n`;
            content += `                    <p>Nội dung item ${i}</p>\n`;
            content += `                </div>\n`;
        }
        content += '            </div>\n';
        return content;
    }

    generateCardContent(analysis) {
        let content = '';
        content += '            <div class="card-layout">\n';
        for (let i = 1; i <= 4; i++) {
            content += `                <div class="card">\n`;
            content += `                    <div class="card-header">\n`;
            content += `                        <h3>Card ${i}</h3>\n`;
            content += `                    </div>\n`;
            content += `                    <div class="card-body">\n`;
            content += `                        <p>Nội dung card ${i}</p>\n`;
            content += `                    </div>\n`;
            content += `                </div>\n`;
        }
        content += '            </div>\n';
        return content;
    }

    generateCSSFromAnalysis(analysis) {
        let css = '/* CSS được tạo từ phân tích ảnh */\n\n';
        
        // Base styles
        css += '* {\n    margin: 0;\n    padding: 0;\n    box-sizing: border-box;\n}\n\n';
        css += 'body {\n    font-family: Arial, sans-serif;\n    line-height: 1.6;\n}\n\n';
        css += '.container {\n    max-width: 1200px;\n    margin: 0 auto;\n    padding: 0 20px;\n}\n\n';

        // Color scheme
        const colors = this.getColorScheme(analysis.colors);
        css += `:root {\n`;
        css += `    --primary-color: ${colors.primary};\n`;
        css += `    --secondary-color: ${colors.secondary};\n`;
        css += `    --accent-color: ${colors.accent};\n`;
        css += `    --text-color: ${colors.text};\n`;
        css += `    --bg-color: ${colors.background};\n`;
        css += `}\n\n`;

        // Header styles
        if (analysis.components.includes('header')) {
            css += '.header {\n';
            css += '    background: var(--primary-color);\n';
            css += '    color: white;\n';
            css += '    padding: 1rem 0;\n';
            css += '}\n\n';
            css += '.header .container {\n';
            css += '    display: flex;\n';
            css += '    justify-content: space-between;\n';
            css += '    align-items: center;\n';
            css += '}\n\n';
            css += '.logo {\n    font-size: 1.5rem;\n    font-weight: bold;\n}\n\n';
            
            if (analysis.components.includes('navigation')) {
                css += '.nav ul {\n    display: flex;\n    list-style: none;\n    gap: 2rem;\n}\n\n';
                css += '.nav a {\n    color: white;\n    text-decoration: none;\n}\n\n';
                css += '.nav a:hover {\n    opacity: 0.8;\n}\n\n';
            }
        }

        // Main content styles
        css += '.main {\n    padding: 2rem 0;\n    background: var(--bg-color);\n}\n\n';
        
        // Layout specific styles
        if (analysis.layout === 'two-column') {
            css += '.two-column-layout {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    gap: 2rem;\n}\n\n';
        } else if (analysis.layout === 'grid') {
            css += '.grid-layout {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n    gap: 1.5rem;\n}\n\n';
            css += '.grid-item {\n    background: white;\n    padding: 1.5rem;\n    border-radius: 8px;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n';
        } else if (analysis.layout === 'card-based') {
            css += '.card-layout {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: 1.5rem;\n}\n\n';
            css += '.card {\n    background: white;\n    border-radius: 8px;\n    overflow: hidden;\n    box-shadow: 0 2px 10px rgba(0,0,0,0.1);\n}\n\n';
            css += '.card-header {\n    background: var(--secondary-color);\n    color: white;\n    padding: 1rem;\n}\n\n';
            css += '.card-body {\n    padding: 1.5rem;\n}\n\n';
        }

        // Form styles
        if (analysis.components.includes('forms')) {
            css += '.form {\n    display: flex;\n    gap: 1rem;\n    margin: 2rem 0;\n}\n\n';
            css += '.form input {\n    flex: 1;\n    padding: 0.75rem;\n    border: 1px solid #ddd;\n    border-radius: 4px;\n}\n\n';
            css += '.form button {\n    padding: 0.75rem 1.5rem;\n    background: var(--accent-color);\n    color: white;\n    border: none;\n    border-radius: 4px;\n    cursor: pointer;\n}\n\n';
        }

        // Footer styles
        if (analysis.components.includes('footer')) {
            css += '.footer {\n    background: var(--secondary-color);\n    color: white;\n    text-align: center;\n    padding: 1rem 0;\n    margin-top: 2rem;\n}\n\n';
        }

        // Responsive design
        css += '@media (max-width: 768px) {\n';
        css += '    .two-column-layout {\n        grid-template-columns: 1fr;\n    }\n';
        css += '    .header .container {\n        flex-direction: column;\n        gap: 1rem;\n    }\n';
        css += '    .nav ul {\n        flex-direction: column;\n        text-align: center;\n        gap: 1rem;\n    }\n';
        css += '}\n';

        return css;
    }

    generateJSFromAnalysis(analysis) {
        let js = '// JavaScript được tạo từ phân tích ảnh\n\n';
        
        // Basic functionality
        js += 'document.addEventListener("DOMContentLoaded", function() {\n';
        js += '    console.log("Trang đã được tải");\n\n';
        
        // Form handling
        if (analysis.components.includes('forms')) {
            js += '    // Form handling\n';
            js += '    const form = document.querySelector(".form");\n';
            js += '    if (form) {\n';
            js += '        form.addEventListener("submit", function(e) {\n';
            js += '            e.preventDefault();\n';
            js += '            const input = form.querySelector("input");\n';
            js += '            if (input.value.trim()) {\n';
            js += '                alert("Đã gửi: " + input.value);\n';
            js += '                input.value = "";\n';
            js += '            }\n';
            js += '        });\n';
            js += '    }\n\n';
        }

        // Navigation handling
        if (analysis.components.includes('navigation')) {
            js += '    // Navigation handling\n';
            js += '    const navLinks = document.querySelectorAll(".nav a");\n';
            js += '    navLinks.forEach(link => {\n';
            js += '        link.addEventListener("click", function(e) {\n';
            js += '            e.preventDefault();\n';
            js += '            const href = this.getAttribute("href");\n';
            js += '            console.log("Click vào: " + href);\n';
            js += '        });\n';
            js += '    });\n\n';
        }

        // Card interactions
        if (analysis.layout === 'card-based') {
            js += '    // Card interactions\n';
            js += '    const cards = document.querySelectorAll(".card");\n';
            js += '    cards.forEach(card => {\n';
            js += '        card.addEventListener("click", function() {\n';
            js += '            this.style.transform = "scale(1.05)";\n';
            js += '            setTimeout(() => {\n';
            js += '                this.style.transform = "scale(1)";\n';
            js += '            }, 200);\n';
            js += '        });\n';
            js += '    });\n\n';
        }

        js += '});\n';
        return js;
    }

    getColorScheme(colorName) {
        const schemes = {
            blue: {
                primary: '#2563eb',
                secondary: '#1e40af',
                accent: '#3b82f6',
                text: '#1e293b',
                background: '#f8fafc'
            },
            green: {
                primary: '#059669',
                secondary: '#047857',
                accent: '#10b981',
                text: '#064e3b',
                background: '#f0fdf4'
            },
            red: {
                primary: '#dc2626',
                secondary: '#b91c1c',
                accent: '#ef4444',
                text: '#7f1d1d',
                background: '#fef2f2'
            },
            purple: {
                primary: '#7c3aed',
                secondary: '#6d28d9',
                accent: '#8b5cf6',
                text: '#581c87',
                background: '#faf5ff'
            },
            orange: {
                primary: '#ea580c',
                secondary: '#c2410c',
                accent: '#f97316',
                text: '#7c2d12',
                background: '#fff7ed'
            },
            neutral: {
                primary: '#374151',
                secondary: '#1f2937',
                accent: '#6b7280',
                text: '#111827',
                background: '#f9fafb'
            }
        };

        return schemes[colorName] || schemes.blue;
    }

    showGeneratedCode(html, css, js) {
        const modalHTML = `
            <div class="code-modal">
                <div class="modal-header">
                    <h3><i class="fas fa-code"></i> Code được tạo từ Ảnh</h3>
                    <button class="close-btn" onclick="cloneTool.closeCodeModal()">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="code-tabs">
                        <button class="tab-btn active" onclick="cloneTool.showCodeTab('html')">HTML</button>
                        <button class="tab-btn" onclick="cloneTool.showCodeTab('css')">CSS</button>
                        <button class="tab-btn" onclick="cloneTool.showCodeTab('js')">JavaScript</button>
                    </div>
                    <div class="code-content">
                        <div class="code-panel active" id="htmlPanel">
                            <pre><code>${this.escapeHtml(html)}</code></pre>
                        </div>
                        <div class="code-panel" id="cssPanel">
                            <pre><code>${this.escapeHtml(css)}</code></pre>
                        </div>
                        <div class="code-panel" id="jsPanel">
                            <pre><code>${this.escapeHtml(js)}</code></pre>
                        </div>
                    </div>
                    <div class="code-actions">
                        <button class="btn btn-primary" onclick="cloneTool.downloadCode()">
                            <i class="fas fa-download"></i> Tải xuống
                        </button>
                        <button class="btn btn-success" onclick="cloneTool.copyCode()">
                            <i class="fas fa-copy"></i> Sao chép
                        </button>
                        <button class="btn btn-info" onclick="cloneTool.previewCode()">
                            <i class="fas fa-eye"></i> Xem trước
                        </button>
                    </div>
                </div>
            </div>
        `;

        const modal = document.createElement('div');
        modal.className = 'modal code-modal';
        modal.id = 'codeModal';
        modal.innerHTML = modalHTML;
        document.body.appendChild(modal);
        modal.style.display = 'block';
    }

    closeCodeModal() {
        const modal = document.getElementById('codeModal');
        if (modal) {
            modal.remove();
        }
    }

    showCodeTab(tabName) {
        // Hide all panels
        document.querySelectorAll('.code-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        // Show selected panel
        const selectedPanel = document.getElementById(tabName + 'Panel');
        if (selectedPanel) {
            selectedPanel.classList.add('active');
        }
        
        // Update active tab button
        document.querySelectorAll('.code-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = event.target;
        activeBtn.classList.add('active');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    downloadCode() {
        if (!this.generatedCode) return;

        // Create zip file with all code
        const zip = new JSZip();
        zip.file('index.html', this.generatedCode.html);
        zip.file('styles.css', this.generatedCode.css);
        zip.file('script.js', this.generatedCode.js);
        zip.file('README.md', this.generateReadme());

        zip.generateAsync({type: 'blob'}).then(content => {
            const url = URL.createObjectURL(content);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'generated-website.zip';
            link.click();
            URL.revokeObjectURL(url);
        });
    }

    copyCode() {
        if (!this.generatedCode) return;

        const activeTab = document.querySelector('.code-tabs .tab-btn.active');
        if (!activeTab) return;

        const tabName = activeTab.textContent.toLowerCase();
        const code = this.generatedCode[tabName] || '';

        navigator.clipboard.writeText(code).then(() => {
            this.showNotification('✅ Đã sao chép code vào clipboard', 'success');
        }).catch(() => {
            this.showNotification('❌ Không thể sao chép code', 'error');
        });
    }

    previewCode() {
        if (!this.generatedCode) return;

        // Open preview in new window
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(this.generatePreviewHTML());
        previewWindow.document.close();
    }

    generatePreviewHTML() {
        return `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Preview - Code được tạo</title>
                <style>${this.generatedCode.css}</style>
            </head>
            <body>
                ${this.generatedCode.html}
                <script>${this.generatedCode.js}</script>
            </body>
            </html>
        `;
    }

    generateReadme() {
        return `# Website được tạo từ Ảnh

## Mô tả
Website này được tạo tự động bởi Clone Tool dựa trên phân tích ảnh.

## Cấu trúc file
- \`index.html\` - Trang chính
- \`styles.css\` - CSS styles
- \`script.js\` - JavaScript functionality

## Cách sử dụng
1. Mở file \`index.html\` trong trình duyệt
2. Tùy chỉnh nội dung theo nhu cầu
3. Chỉnh sửa CSS để thay đổi giao diện
4. Thêm JavaScript để tăng tính năng

## Lưu ý
- Code được tạo tự động, cần kiểm tra và tối ưu
- Responsive design đã được tích hợp
- Tương thích với các trình duyệt hiện đại

---
Được tạo bởi Clone Tool - Website Admin Pro
`;
    }

    // ===== TEMPLATE MANAGEMENT =====

    handleTemplateSelection(event) {
        const templateKey = event.target.value;
        if (!templateKey) return;

        const template = this.templates[templateKey];
        if (template) {
            this.showTemplatePreview(template);
        }
    }

    showTemplatePreview(template) {
        const previewHTML = `
            <div class="template-preview">
                <h4>${template.name}</h4>
                <p>${template.description}</p>
                <div class="template-code-preview">
                    <h5>HTML Preview:</h5>
                    <pre><code>${this.escapeHtml(template.html.substring(0, 200))}...</code></pre>
                </div>
            </div>
        `;

        // Show template preview
        let templatePreview = document.querySelector('.template-preview');
        if (!templatePreview) {
            templatePreview = document.createElement('div');
            templatePreview.className = 'template-preview';
            const templateSelector = document.querySelector('.template-selector');
            if (templateSelector) {
                templateSelector.appendChild(templatePreview);
            }
        }
        templatePreview.innerHTML = previewHTML;
    }

    createFromTemplate() {
        const templateSelector = document.getElementById('templateSelector');
        const templateKey = templateSelector.value;
        
        if (!templateKey) {
            this.showError('Vui lòng chọn template!');
            return;
        }

        const template = this.templates[templateKey];
        if (!template) {
            this.showError('Template không tồn tại!');
            return;
        }

        // Generate code from template
        this.generatedCode = {
            html: template.html,
            css: template.css,
            js: template.js
        };

        // Show generated code
        this.showGeneratedCode(template.html, template.css, template.js);
        
        console.log(`✅ Đã tạo code từ template: ${template.name}`);
    }

    // ===== TEMPLATE DEFINITIONS =====

    getLoginTemplateHTML() {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đăng nhập</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="login-container">
        <div class="login-box">
            <div class="login-header">
                <h1>Đăng nhập</h1>
                <p>Vui lòng nhập thông tin tài khoản</p>
            </div>
            <form class="login-form">
                <div class="form-group">
                    <label for="username">Tên đăng nhập</label>
                    <input type="text" id="username" name="username" required>
                </div>
                <div class="form-group">
                    <label for="password">Mật khẩu</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="remember">
                        Ghi nhớ đăng nhập
                    </label>
                </div>
                <button type="submit" class="login-btn">Đăng nhập</button>
            </form>
            <div class="login-footer">
                <a href="#forgot">Quên mật khẩu?</a>
                <a href="#register">Đăng ký tài khoản</a>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
    }

    getLoginTemplateCSS() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    width: 100%;
    max-width: 400px;
    padding: 20px;
}

.login-box {
    background: white;
    border-radius: 10px;
    box-shadow: 0 15px 35px rgba(0,0,0,0.1);
    padding: 40px;
}

.login-header {
    text-align: center;
    margin-bottom: 30px;
}

.login-header h1 {
    color: #333;
    margin-bottom: 10px;
    font-size: 28px;
}

.login-header p {
    color: #666;
    font-size: 14px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
}

.form-group input[type="text"],
.form-group input[type="password"] {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e1e5e9;
    border-radius: 5px;
    font-size: 14px;
    transition: border-color 0.3s;
}

.form-group input:focus {
    outline: none;
    border-color: #667eea;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #666;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
}

.login-btn {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: transform 0.2s;
}

.login-btn:hover {
    transform: translateY(-2px);
}

.login-footer {
    margin-top: 20px;
    text-align: center;
    display: flex;
    justify-content: space-between;
}

.login-footer a {
    color: #667eea;
    text-decoration: none;
    font-size: 14px;
}

.login-footer a:hover {
    text-decoration: underline;
}

@media (max-width: 480px) {
    .login-box {
        padding: 30px 20px;
    }
    
    .login-footer {
        flex-direction: column;
        gap: 10px;
    }
}`;
    }

    getLoginTemplateJS() {
        return `document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('.login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        
        if (!username || !password) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }
        
        // Simulate login process
        console.log('Đang đăng nhập...', { username, password });
        
        // Show loading state
        const loginBtn = document.querySelector('.login-btn');
        const originalText = loginBtn.textContent;
        loginBtn.textContent = 'Đang xử lý...';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            alert('Đăng nhập thành công!');
            loginBtn.textContent = originalText;
            loginBtn.disabled = false;
            
            // Reset form
            loginForm.reset();
        }, 2000);
    });

    // Add input animations
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
});`;
    }

    getDashboardTemplateHTML() {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="dashboard">
        <header class="dashboard-header">
            <h1>Dashboard</h1>
            <div class="user-info">
                <span>Xin chào, Admin</span>
                <button class="logout-btn">Đăng xuất</button>
            </div>
        </header>
        
        <main class="dashboard-main">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-content">
                        <h3>1,234</h3>
                        <p>Tổng người dùng</p>
                    // ... existing code ...

                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-content">
                        <h3>45,678</h3>
                        <p>Doanh thu</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">📈</div>
                    <div class="stat-content">
                        <h3>89%</h3>
                        <p>Tỷ lệ tăng trưởng</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🎯</div>
                    <div class="stat-content">
                        <h3>567</h3>
                        <p>Mục tiêu</p>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-content">
                <div class="content-section">
                    <h2>Hoạt động gần đây</h2>
                    <div class="activity-list">
                        <div class="activity-item">
                            <span class="activity-time">10:30</span>
                            <span class="activity-text">Người dùng mới đăng ký</span>
                        </div>
                        <div class="activity-item">
                            <span class="activity-time">09:15</span>
                            <span class="activity-text">Cập nhật hệ thống</span>
                        </div>
                        <div class="activity-item">
                            <span class="activity-time">08:45</span>
                            <span class="activity-text">Sao lưu dữ liệu</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
    }

    getDashboardTemplateCSS() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: #f5f5f5;
    color: #333;
}

.dashboard {
    min-height: 100vh;
}

.dashboard-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dashboard-header h1 {
    font-size: 24px;
    font-weight: 600;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.logout-btn {
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.logout-btn:hover {
    background: rgba(255,255,255,0.3);
}

.dashboard-main {
    padding: 2rem;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
}

.stat-card {
    background: white;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 1rem;
}

.stat-icon {
    font-size: 2rem;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

.stat-content h3 {
    font-size: 1.8rem;
    font-weight: 700;
    color: #333;
    margin-bottom: 0.5rem;
}

.stat-content p {
    color: #666;
    font-size: 0.9rem;
}

.dashboard-content {
    background: white;
    border-radius: 10px;
    padding: 1.5rem;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.content-section h2 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1.3rem;
}

.activity-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.activity-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: #f8f9fa;
    border-radius: 5px;
}

.activity-time {
    background: #667eea;
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 3px;
    font-size: 0.8rem;
    font-weight: 500;
}

.activity-text {
    color: #555;
    font-size: 0.9rem;
}

@media (max-width: 768px) {
    .dashboard-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .dashboard-main {
        padding: 1rem;
    }
}`;
    }

    getDashboardTemplateJS() {
        return `document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard đã được tải');
    
    // Logout functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn đăng xuất?')) {
                alert('Đã đăng xuất thành công!');
                // Redirect to login page
                // window.location.href = '/login.html';
            }
        });
    }
    
    // Animate stat cards on load
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
    
    // Add click effects to stat cards
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
    
    // Simulate real-time updates
    setInterval(() => {
        const randomCard = statCards[Math.floor(Math.random() * statCards.length)];
        const valueElement = randomCard.querySelector('h3');
        if (valueElement) {
            const currentValue = parseInt(valueElement.textContent.replace(/[^0-9]/g, ''));
            const newValue = currentValue + Math.floor(Math.random() * 10);
            valueElement.textContent = newValue.toLocaleString();
        }
    }, 5000);
});`;
    }

    getFormTemplateHTML() {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Form nhập liệu</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="form-container">
        <div class="form-box">
            <div class="form-header">
                <h1>Form nhập thông tin</h1>
                <p>Vui lòng điền đầy đủ thông tin bên dưới</p>
            </div>
            
            <form class="main-form" id="mainForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">Họ và tên đệm</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Tên</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-group">
                    <label for="phone">Số điện thoại</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                
                <div class="form-group">
                    <label for="address">Địa chỉ</label>
                    <textarea id="address" name="address" rows="3" required></textarea>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="city">Thành phố</label>
                        <select id="city" name="city" required>
                            <option value="">Chọn thành phố</option>
                            <option value="hanoi">Hà Nội</option>
                            <option value="hcm">TP. Hồ Chí Minh</option>
                            <option value="danang">Đà Nẵng</option>
                            <option value="cantho">Cần Thơ</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="zipCode">Mã bưu điện</label>
                        <input type="text" id="zipCode" name="zipCode" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="agree" required>
                        Tôi đồng ý với các điều khoản sử dụng
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="resetForm()">Làm lại</button>
                    <button type="submit" class="btn btn-primary">Gửi thông tin</button>
                </div>
            </form>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>`;
    }

    getFormTemplateCSS() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    min-height: 100vh;
    padding: 20px;
}

.form-container {
    max-width: 800px;
    margin: 0 auto;
}

.form-box {
    background: white;
    border-radius: 15px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    padding: 40px;
}

.form-header {
    text-align: center;
    margin-bottom: 30px;
}

.form-header h1 {
    color: #2c3e50;
    margin-bottom: 10px;
    font-size: 28px;
}

.form-header p {
    color: #7f8c8d;
    font-size: 16px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.form-group {
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    margin-bottom: 8px;
    color: #2c3e50;
    font-weight: 500;
    font-size: 14px;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #ecf0f1;
    border-radius: 8px;
    font-size: 14px;
    transition: all 0.3s;
    background: #f8f9fa;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #3498db;
    background: white;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.form-group textarea {
    resize: vertical;
    min-height: 80px;
}

.checkbox-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    color: #7f8c8d;
}

.checkbox-label input[type="checkbox"] {
    width: auto;
    transform: scale(1.2);
}

.form-actions {
    display: flex;
    gap: 15px;
    justify-content: flex-end;
    margin-top: 30px;
    padding-top: 20px;
    border-top: 1px solid #ecf0f1;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 120px;
}

.btn-primary {
    background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(52, 152, 219, 0.4);
}

.btn-secondary {
    background: #ecf0f1;
    color: #7f8c8d;
    border: 1px solid #bdc3c7;
}

.btn-secondary:hover {
    background: #d5dbdb;
    transform: translateY(-1px);
}

@media (max-width: 768px) {
    .form-box {
        padding: 30px 20px;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}`;
    }

    getFormTemplateJS() {
        return `document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mainForm');
    
    // Form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
});

function validateForm() {
    let isValid = true;
    const requiredFields = document.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Trường này là bắt buộc';
        isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Email không hợp lệ';
            isValid = false;
        }
    }
    
    // Phone validation
    if (field.name === 'phone' && value) {
        const phoneRegex = /^[0-9+\\-\\s()]{10,}$/;
        if (!phoneRegex.test(value)) {
            errorMessage = 'Số điện thoại không hợp lệ';
            isValid = false;
        }
    }
    
    // Show error if invalid
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    field.style.background = '#fdf2f2';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '#ecf0f1';
    field.style.background = '#f8f9fa';
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function submitForm() {
    const formData = new FormData(document.getElementById('mainForm'));
    const data = Object.fromEntries(formData);
    
    // Show loading state
    const submitBtn = document.querySelector('.btn-primary');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        alert('✅ Thông tin đã được gửi thành công!');
        
        // Reset form
        document.getElementById('mainForm').reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Clear all field errors
        document.querySelectorAll('.field-error').forEach(error => error.remove());
    }, 2000);
}

function resetForm() {
    if (confirm('Bạn có chắc muốn làm lại form?')) {
        document.getElementById('mainForm').reset();
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.borderColor = '#ecf0f1';
            field.style.background = '#f8f9fa';
        });
    }
}`;
    }

    getListTemplateHTML() {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Danh sách dữ liệu</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="list-container">
        <div class="list-header">
            <h1>Danh sách người dùng</h1>
            <div class="header-actions">
                <div class="search-box">
                    <input type="text" id="searchInput" placeholder="Tìm kiếm...">
                    <i class="fas fa-search"></i>
                </div>
                <button class="btn btn-primary" onclick="addNewUser()">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
            </div>
        </div>
        
        <div class="list-content">
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody id="userTableBody">
                        <!-- Data will be loaded here -->
                    </tbody>
                </table>
            </div>
            
            <div class="pagination">
                <button class="page-btn" onclick="changePage('prev')">Trước</button>
                <span class="page-info">Trang 1 / 5</span>
                <button class="page-btn" onclick="changePage('next')">Sau</button>
            </div>
        </div>
    </div>
    
    <!-- Add/Edit User Modal -->
    <div class="modal" id="userModal" style="display: none;">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Thêm người dùng mới</h3>
                <button class="close-btn" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <form id="userForm">
                    <div class="form-row">
                        <div class="form-group">
                            <label for="userName">Họ tên</label>
                            <input type="text" id="userName" name="userName" required>
                        </div>
                        <div class="form-group">
                            <label for="userEmail">Email</label>
                            <input type="email" id="userEmail" name="userEmail" required>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="userRole">Vai trò</label>
                            <select id="userRole" name="userRole" required>
                                <option value="">Chọn vai trò</option>
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="userStatus">Trạng thái</label>
                            <select id="userStatus" name="userStatus" required>
                                <option value="">Chọn trạng thái</option>
                                <option value="active">Hoạt động</option>
                                <option value="inactive">Không hoạt động</option>
                                <option value="suspended">Tạm khóa</option>
                            </select>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">Hủy</button>
                        <button type="submit" class="btn btn-primary">Lưu</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;
    }

    getListTemplateCSS() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: #f8f9fa;
    color: #333;
}

.list-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.list-header {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.list-header h1 {
    color: #2c3e50;
    font-size: 24px;
}

.header-actions {
    display: flex;
    gap: 15px;
    align-items: center;
}

.search-box {
    position: relative;
}

.search-box input {
    padding: 10px 15px 10px 40px;
    border: 1px solid #ddd;
    border-radius: 25px;
    width: 250px;
    font-size: 14px;
}

.search-box i {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
    transform: translateY(-1px);
}

.list-content {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    overflow: hidden;
}

.table-container {
    overflow-x: auto;
}

.data-table {
    width: 100%;
    border-collapse: collapse;
}

.data-table th,
.data-table td {
    padding: 15px;
    text-align: left;
    border-bottom: 1px solid #eee;
}

.data-table th {
    background: #f8f9fa;
    font-weight: 600;
    color: #2c3e50;
}

.data-table tr:hover {
    background: #f8f9fa;
}

.status-badge {
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
}

.status-active {
    background: #d4edda;
    color: #155724;
}

.status-inactive {
    background: #f8d7da;
    color: #721c24;
}

.status-suspended {
    background: #fff3cd;
    color: #856404;
}

.action-buttons {
    display: flex;
    gap: 8px;
}

.action-btn {
    padding: 5px 10px;
    border: none;
    border-radius: 3px;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.3s;
}

.edit-btn {
    background: #ffc107;
    color: #212529;
}

.edit-btn:hover {
    background: #e0a800;
}

.delete-btn {
    background: #dc3545;
    color: white;
}

.delete-btn:hover {
    background: #c82333;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px;
    padding: 20px;
    border-top: 1px solid #eee;
}

.page-btn {
    padding: 8px 15px;
    border: 1px solid #ddd;
    background: white;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
}

.page-btn:hover {
    background: #f8f9fa;
    border-color: #3498db;
}

.page-info {
    color: #666;
    font-size: 14px;
}

/* Modal styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1000;
}

.modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 10px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
}

.modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    color: #2c3e50;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
}

.modal-body {
    padding: 20px;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    color: #2c3e50;
    font-weight: 500;
}

.form-group input,
.form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
}

.form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #eee;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
}

@media (max-width: 768px) {
    .list-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .header-actions {
        flex-direction: column;
        width: 100%;
    }
    
    .search-box input {
        width: 100%;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}`;
    }

    getListTemplateJS() {
        return `// Sample data
let users = [
    { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@example.com', role: 'admin', status: 'active' },
    { id: 2, name: 'Trần Thị B', email: 'tranthib@example.com', role: 'user', status: 'active' },
    { id: 3, name: 'Lê Văn C', email: 'levanc@example.com', role: 'moderator', status: 'inactive' },
    { id: 4, name: 'Phạm Thị D', email: 'phamthid@example.com', role: 'user', status: 'suspended' },
    { id: 5, name: 'Hoàng Văn E', email: 'hoangvane@example.com', role: 'user', status: 'active' }
];

let currentPage = 1;
let itemsPerPage = 10;
let editingUserId = null;

document.addEventListener('DOMContentLoaded', function() {
    loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterUsers(this.value);
        });
    }
    
    // Form submission
    const userForm = document.getElementById('userForm');
    if (userForm) {
        userForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveUser();
        });
    }
}

function loadUsers() {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageUsers = users.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    pageUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = \`
            <td>\${user.id}</td>
            <td>\${user.name}</td>
            <td>\${user.email}</td>
            <td>\${getRoleDisplay(user.role)}</td>
            <td><span class="status-badge status-\${user.status}">\${getStatusDisplay(user.status)}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" onclick="editUser(\${user.id})">Sửa</button>
                <button class="action-btn delete-btn" onclick="deleteUser(\${user.id})">Xóa</button>
            </td>
        \`;
        tbody.appendChild(row);
    });
    
    updatePagination();
}

function filterUsers(searchTerm) {
    const filteredUsers = users.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    displayFilteredUsers(filteredUsers);
}

function displayFilteredUsers(filteredUsers) {
    const tbody = document.getElementById('userTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    filteredUsers.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = \`
            <td>\${user.id}</td>
            <td>\${user.name}</td>
            <td>\${user.email}</td>
            <td>\${getRoleDisplay(user.role)}</td>
            <td><span class="status-badge status-\${user.status}">\${getStatusDisplay(user.status)}</span></td>
            <td class="action-buttons">
                <button class="action-btn edit-btn" onclick="editUser(\${user.id})">Sửa</button>
                <button class="action-btn delete-btn" onclick="deleteUser(\${user.id})">Xóa</button>
            </td>
        \`;
        tbody.appendChild(row);
    });
}

function getRoleDisplay(role) {
    const roleMap = {
        'admin': 'Quản trị viên',
        'user': 'Người dùng',
        'moderator': 'Điều hành viên'
    };
    return roleMap[role] || role;
}

function getStatusDisplay(status) {
    const statusMap = {
        'active': 'Hoạt động',
        'inactive': 'Không hoạt động',
        'suspended': 'Tạm khóa'
    };
    return statusMap[status] || status;
}

function addNewUser() {
    editingUserId = null;
    document.getElementById('modalTitle').textContent = 'Thêm người dùng mới';
    document.getElementById('userForm').reset();
    document.getElementById('userModal').style.display = 'block';
}

function editUser(userId) {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    
    editingUserId = userId;
    document.getElementById('modalTitle').textContent = 'Sửa người dùng';
    
    // Fill form with user data
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userStatus').value = user.status;
    
    document.getElementById('userModal').style.display = 'block';
}

function saveUser() {
    const formData = new FormData(document.getElementById('userForm'));
    const userData = {
        name: formData.get('userName'),
        email: formData.get('userEmail'),
        role: formData.get('userRole'),
        status: formData.get('userStatus')
    };
    
    if (editingUserId) {
        // Update existing user
        const userIndex = users.findIndex(u => u.id === editingUserId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...userData };
        }
    } else {
        // Add new user
        const newId = Math.max(...users.map(u => u.id)) + 1;
        users.push({ id: newId, ...userData });
    }
    
    closeModal();
    loadUsers();
}

function deleteUser(userId) {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
        users = users.filter(u => u.id !== userId);
        loadUsers();
    }
}

function closeModal() {
    document.getElementById('userModal').style.display = 'none';
    editingUserId = null;
}

function changePage(direction) {
    if (direction === 'prev' && currentPage > 1) {
        currentPage--;
    } else if (direction === 'next' && currentPage < Math.ceil(users.length / itemsPerPage)) {
        currentPage++;
    }
    loadUsers();
}

function updatePagination() {
    const totalPages = Math.ceil(users.length / itemsPerPage);
    document.querySelector('.page-info').textContent = \`Trang \${currentPage} / \${totalPages}\`;
}`;
    }

    getDetailTemplateHTML() {
        return `<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chi tiết thông tin</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="detail-container">
        <div class="detail-header">
            <div class="header-content">
                <button class="back-btn" onclick="goBack()">
                    <i class="fas fa-arrow-left"></i> Quay lại
                </button>
                <h1>Chi tiết người dùng</h1>
            </div>
            <div class="header-actions">
                <button class="btn btn-secondary" onclick="editUser()">
                    <i class="fas fa-edit"></i> Chỉnh sửa
                </button>
                <button class="btn btn-danger" onclick="deleteUser()">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            </div>
        </div>
        
        <div class="detail-content">
            <div class="detail-grid">
                <div class="detail-section">
                    <h3>Thông tin cơ bản</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>ID:</label>
                            <span>12345</span>
                        </div>
                        <div class="info-item">
                            <label>Họ và tên:</label>
                            <span>Nguyễn Văn A</span>
                        </div>
                        <div class="info-item">
                            <label>Email:</label>
                            <span>nguyenvana@example.com</span>
                        </div>
                        <div class="info-item">
                            <label>Số điện thoại:</label>
                            <span>0123456789</span>
                        </div>
                        <div class="info-item">
                            <label>Ngày sinh:</label>
                            <span>15/03/1990</span>
                        </div>
                        <div class="info-item">
                            <label>Giới tính:</label>
                            <span>Nam</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Thông tin tài khoản</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Vai trò:</label>
                            <span class="role-badge role-admin">Quản trị viên</span>
                        </div>
                        <div class="info-item">
                            <label>Trạng thái:</label>
                            <span class="status-badge status-active">Hoạt động</span>
                        </div>
                        <div class="info-item">
                            <label>Ngày tạo:</label>
                            <span>01/01/2024</span>
                        </div>
                        <div class="info-item">
                            <label>Lần đăng nhập cuối:</label>
                            <span>15/03/2024 14:30</span>
                        </div>
                        <div class="info-item">
                            <label>IP đăng nhập:</label>
                            <span>192.168.1.100</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Thông tin liên hệ</h3>
                    <div class="info-grid">
                        <div class="info-item">
                            <label>Địa chỉ:</label>
                            <span>123 Đường ABC, Quận 1, TP.HCM</span>
                        </div>
                        <div class="info-item">
                            <label>Thành phố:</label>
                            <span>TP. Hồ Chí Minh</span>
                        </div>
                        <div class="info-item">
                            <label>Quốc gia:</label>
                            <span>Việt Nam</span>
                        </div>
                        <div class="info-item">
                            <label>Mã bưu điện:</label>
                            <span>70000</span>
                        </div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h3>Thống kê hoạt động</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">156</div>
                            <div class="stat-label">Lần đăng nhập</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">89</div>
                            <div class="stat-label">Thao tác thực hiện</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">23</div>
                            <div class="stat-label">File đã tải</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">45</div>
                            <div class="stat-label">Báo cáo đã xem</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="detail-actions">
                <button class="btn btn-primary" onclick="exportUserData()">
                    <i class="fas fa-download"></i> Xuất dữ liệu
                </button>
                <button class="btn btn-info" onclick="printUserData()">
                    <i class="fas fa-print"></i> In thông tin
                </button>
            </div>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>`;
    }

    getDetailTemplateCSS() {
        return `* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', sans-serif;
    background: #f8f9fa;
    color: #333;
}

.detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.detail-header {
    background: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 20px;
}

.back-btn {
    background: none;
    border: 1px solid #ddd;
    padding: 8px 15px;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    gap: 8px;
}

.back-btn:hover {
    background: #f8f9fa;
    border-color: #3498db;
}

.detail-header h1 {
    color: #2c3e50;
    font-size: 24px;
}

.header-actions {
    display: flex;
    gap: 15px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-secondary {
    background: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background: #5a6268;
}

.btn-danger {
    background: #dc3545;
    color: white;
}

.btn-danger:hover {
    background: #c82333;
}

.btn-primary {
    background: #3498db;
    color: white;
}

.btn-primary:hover {
    background: #2980b9;
}

.btn-info {
    background: #17a2b8;
    color: white;
}

.btn-info:hover {
    background: #138496;
}

.detail-content {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    padding: 20px;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
}

.detail-section {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
}

.detail-section h3 {
    color: #2c3e50;
    margin-bottom: 15px;
    font-size: 18px;
    border-bottom: 2px solid #3498db;
    padding-bottom: 8px;
}

.info-grid {
    display: grid;
    gap: 12px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: white;
    border-radius: 5px;
    border-left: 3px solid #3498db;
}

.info-item label {
    font-weight: 600;
    color: #2c3e50;
}

.info-item span {
    color: #555;
}

.role-badge, .status-badge {
    padding: 5px 12px;
    border-radius: 15px;
    font-size: 12px;
    font-weight: 500;
}

.role-admin {
    background: #d4edda;
    color: #155724;
}

.status-active {
    background: #d4edda;
    color: #155724;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 15px;
}

.stat-item {
    text-align: center;
    padding: 15px;
    background: white;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.stat-value {
    font-size: 24px;
    font-weight: 700;
    color: #3498db;
    margin-bottom: 5px;
}

.stat-label {
    font-size: 12px;
    color: #6c757d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detail-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    padding-top: 20px;
    border-top: 1px solid #e9ecef;
}

@media (max-width: 768px) {
    .detail-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .header-actions {
        flex-direction: column;
        width: 100%;
    }
    
    .detail-grid {
        grid-template-columns: 1fr;
    }
    
    .detail-actions {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}`;
    }

    getDetailTemplateJS() {
        return `document.addEventListener('DOMContentLoaded', function() {
    console.log('Detail page đã được tải');
    
    // Setup event listeners
    setupEventListeners();
    
    // Load user data
    loadUserData();
});

function setupEventListeners() {
    // Back button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', goBack);
    }
    
    // Edit button
    const editBtn = document.querySelector('[onclick="editUser()"]');
    if (editBtn) {
        editBtn.addEventListener('click', editUser);
    }
    
    // Delete button
    const deleteBtn = document.querySelector('[onclick="deleteUser()"]');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', deleteUser);
    }
    
    // Export button
    const exportBtn = document.querySelector('[onclick="exportUserData()"]');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
    }
    
    // Print button
    const printBtn = document.querySelector('[onclick="printUserData()"]');
    if (printBtn) {
        printBtn.addEventListener('click', printUserData);
    }
}

function loadUserData() {
    // Simulate loading user data
    console.log('Đang tải dữ liệu người dùng...');
    
    // In real app, this would fetch from API
    setTimeout(() => {
        console.log('Đã tải xong dữ liệu người dùng');
        animateStats();
    }, 1000);
}

function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat, index) => {
        const finalValue = parseInt(stat.textContent);
        let currentValue = 0;
        
        const increment = finalValue / 20;
        const timer = setInterval(() => {
            currentValue += increment;
            if (currentValue >= finalValue) {
                currentValue = finalValue;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(currentValue);
        }, 50);
    });
}

function goBack() {
    if (confirm('Bạn có chắc muốn quay lại?')) {
        // In real app, this would navigate back
        console.log('Quay lại trang trước');
        window.history.back();
    }
}

function editUser() {
    alert('Chức năng chỉnh sửa sẽ được mở trong modal');
    // In real app, this would open edit modal
}

function deleteUser() {
    if (confirm('Bạn có chắc muốn xóa người dùng này? Hành động này không thể hoàn tác!')) {
        alert('Đã xóa người dùng thành công');
        // In real app, this would delete user and redirect
        goBack();
    }
}

function exportUserData() {
    const userData = {
        id: '12345',
        name: 'Nguyễn Văn A',
        email: 'nguyenvana@example.com',
        phone: '0123456789',
        role: 'Quản trị viên',
        status: 'Hoạt động',
        createdAt: '01/01/2024'
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    alert('Đã xuất dữ liệu thành công!');
}

function printUserData() {
    window.print();
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to info items
    const infoItems = document.querySelectorAll('.info-item');
    infoItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = 'none';
        });
    });
    
    // Add click effects to stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => {
        item.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
        });
    });
});`;
    }

    // ===== UTILITY METHODS =====

    showError(message) {
        console.error('❌ Lỗi:', message);
        alert(`❌ Lỗi: ${message}`);
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        
        notification.style.background = colors[type] || colors.info;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ===== EXPORT METHODS =====

    exportAllTemplates() {
        try {
            const exportData = {
                templates: this.templates,
                metadata: {
                    version: '1.0.0',
                    createdAt: new Date().toISOString(),
                    totalTemplates: Object.keys(this.templates).length
                }
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], {type: 'application/json'});
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = 'clone-tool-templates.json';
            link.click();
            
            URL.revokeObjectURL(url);
            this.showNotification('✅ Đã xuất tất cả templates thành công!', 'success');
            
        } catch (error) {
            console.error('❌ Lỗi khi xuất templates:', error);
            this.showNotification('❌ Lỗi khi xuất templates', 'error');
        }
    }

    importTemplates(file) {
        try {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedData = JSON.parse(e.target.result);
                
                if (importedData.templates) {
                    this.templates = { ...this.templates, ...importedData.templates };
                    this.showNotification('✅ Đã import templates thành công!', 'success');
                    console.log('📚 Templates mới:', importedData.templates);
                } else {
                    this.showNotification('❌ File không hợp lệ', 'error');
                }
            };
            reader.readAsText(file);
            
        } catch (error) {
            console.error('❌ Lỗi khi import templates:', error);
            this.showNotification('❌ Lỗi khi import templates', 'error');
        }
    }

    // ===== TEMPLATE MANAGEMENT =====

    addCustomTemplate(name, description, category, html, css, js) {
        try {
            const templateKey = name.toLowerCase().replace(/\s+/g, '_');
            
            this.templates[templateKey] = {
                name: name,
                description: description,
                category: category,
                html: html,
                css: css,
                js: js,
                isCustom: true,
                createdAt: new Date().toISOString()
            };
            
            this.showNotification(`✅ Đã thêm template "${name}" thành công!`, 'success');
            console.log('📚 Template mới:', this.templates[templateKey]);
            
            return templateKey;
            
        } catch (error) {
            console.error('❌ Lỗi khi thêm template:', error);
            this.showNotification('❌ Lỗi khi thêm template', 'error');
            return null;
        }
    }

    removeTemplate(templateKey) {
        if (this.templates[templateKey]) {
            const templateName = this.templates[templateKey].name;
            delete this.templates[templateKey];
            
            this.showNotification(`✅ Đã xóa template "${templateName}" thành công!`, 'success');
            console.log('🗑️ Đã xóa template:', templateKey);
            
            return true;
        }
        return false;
    }

    getTemplateCategories() {
        const categories = new Set();
        Object.values(this.templates).forEach(template => {
            categories.add(template.category);
        });
        return Array.from(categories);
    }

    getTemplatesByCategory(category) {
        return Object.values(this.templates).filter(template => 
            template.category === category
        );
    }

    // ===== STATISTICS =====

    getTemplateStats() {
        const stats = {
            total: Object.keys(this.templates).length,
            byCategory: {},
            byType: {
                custom: 0,
                builtin: 0
            }
        };
        
        Object.values(this.templates).forEach(template => {
            // Count by category
            if (!stats.byCategory[template.category]) {
                stats.byCategory[template.category] = 0;
            }
            stats.byCategory[template.category]++;
            
            // Count by type
            if (template.isCustom) {
                stats.byType.custom++;
            } else {
                stats.byType.builtin++;
            }
        });
        
        return stats;
    }

    // ===== VALIDATION =====

    validateTemplate(template) {
        const errors = [];
        
        if (!template.name || template.name.trim() === '') {
            errors.push('Tên template không được để trống');
        }
        
        if (!template.html || template.html.trim() === '') {
            errors.push('HTML không được để trống');
        }
        
        if (!template.css || template.css.trim() === '') {
            errors.push('CSS không được để trống');
        }
        
        if (!template.js || template.js.trim() === '') {
            errors.push('JavaScript không được để trống');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===== BACKUP & RESTORE =====

    backupTemplates() {
        try {
            const backup = {
                templates: this.templates,
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            };
            
            localStorage.setItem('cloneToolBackup', JSON.stringify(backup));
            this.showNotification('✅ Đã sao lưu templates thành công!', 'success');
            
            return true;
            
        } catch (error) {
            console.error('❌ Lỗi khi sao lưu:', error);
            this.showNotification('❌ Lỗi khi sao lưu templates', 'error');
            return false;
        }
    }

    restoreTemplates() {
        try {
            const backup = localStorage.getItem('cloneToolBackup');
            if (backup) {
                const backupData = JSON.parse(backup);
                this.templates = backupData.templates;
                
                this.showNotification('✅ Đã khôi phục templates thành công!', 'success');
                console.log('🔄 Đã khôi phục từ backup:', backupData.timestamp);
                
                return true;
            } else {
                this.showNotification('❌ Không tìm thấy backup', 'warning');
                return false;
            }
            
        } catch (error) {
            console.error('❌ Lỗi khi khôi phục:', error);
            this.showNotification('❌ Lỗi khi khôi phục templates', 'error');
            return false;
        }
    }

    // ===== CLEANUP =====

    cleanup() {
        try {
            // Clear current image
            this.currentImage = null;
            this.imageAnalysis = null;
            this.generatedCode = null;
            
            // Clear generated code modal if exists
            const codeModal = document.getElementById('codeModal');
            if (codeModal) {
                codeModal.remove();
            }
            
            // Clear analysis modal if exists
            const analysisModal = document.getElementById('analysisModal');
            if (analysisModal) {
                analysisModal.remove();
            }
            
            console.log('🧹 Đã dọn dẹp Clone Tool');
            this.showNotification('✅ Đã dọn dẹp thành công!', 'success');
            
        } catch (error) {
            console.error('❌ Lỗi khi dọn dẹp:', error);
        }
    }

    // ===== DESTRUCTOR =====

    destroy() {
        try {
            // Remove event listeners
            this.cleanup();
            
            // Clear templates
            this.templates = {};
            
            console.log('🗑️ Clone Tool đã được hủy');
            
        } catch (error) {
            console.error('❌ Lỗi khi hủy Clone Tool:', error);
        }
    }
}

// ===== GLOBAL INSTANCE =====

let cloneTool;

document.addEventListener('DOMContentLoaded', function() {
    cloneTool = new CloneTool();
});

// ===== GLOBAL FUNCTIONS =====

function createFromTemplate() {
    if (cloneTool) {
        cloneTool.createFromTemplate();
    }
}

function analyzeImage() {
    if (cloneTool) {
        cloneTool.analyzeImage();
    }
}

function clearImage() {
    if (cloneTool) {
        cloneTool.clearImage();
    }
}

function exportTemplates() {
    if (cloneTool) {
        cloneTool.exportAllTemplates();
    }
}

function backupTemplates() {
    if (cloneTool) {
        cloneTool.backupTemplates();
    }
}

function restoreTemplates() {
    if (cloneTool) {
        cloneTool.restoreTemplates();
    }
}

function cleanupCloneTool() {
    if (cloneTool) {
        cloneTool.cleanup();
    }
}

// ===== CSS ANIMATIONS =====

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Export for global use
window.CloneTool = CloneTool;
                