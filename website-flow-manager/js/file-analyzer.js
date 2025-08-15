// ===== FILE ANALYZER MODULE - Phân tích File chi tiết =====

class FileAnalyzer {
    constructor() {
        this.analysisCache = new Map();
        this.currentAnalysis = null;
        this.analysisProgress = 0;
        this.init();
    }

    init() {
        console.log('�� File Analyzer đang khởi động...');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Analysis progress events
        document.addEventListener('analysisProgress', (e) => {
            this.updateProgress(e.detail.progress);
        });
    }

    async analyzeFile(file, type) {
        try {
            const content = await this.readFileContent(file);
            const analysis = this.performAnalysis(content, type, file);
            
            // Cache kết quả
            this.analysisCache.set(file.name, analysis);
            
            return analysis;
        } catch (error) {
            console.error(`❌ Lỗi khi phân tích file ${file.name}:`, error);
            return {
                file: file.name,
                error: error.message,
                type: type
            };
        }
    }

    async readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    performAnalysis(content, type, file) {
        switch (type) {
            case 'html':
                return this.analyzeHtmlFile(content, file);
            case 'javascript':
                return this.analyzeJavaScriptFile(content, file);
            case 'css':
                return this.analyzeCssFile(content, file);
            default:
                return this.analyzeGenericFile(content, file);
        }
    }

    analyzeHtmlFile(content, file) {
        const analysis = {
            file: file.name,
            type: 'html',
            size: file.size,
            path: file.webkitRelativePath || file.name,
            analysis: {
                title: this.extractHtmlTitle(content),
                metaTags: this.extractMetaTags(content),
                links: this.extractHtmlLinks(content),
                scripts: this.extractHtmlScripts(content),
                styles: this.extractHtmlStyles(content),
                forms: this.extractHtmlForms(content),
                images: this.extractHtmlImages(content),
                structure: this.analyzeHtmlStructure(content)
            },
            issues: [],
            suggestions: [],
            timestamp: new Date().toISOString()
        };

        // Tìm vấn đề
        this.findHtmlIssues(analysis);
        
        // Đưa ra gợi ý
        this.generateHtmlSuggestions(analysis);

        return analysis;
    }

    analyzeJavaScriptFile(content, file) {
        const analysis = {
            file: file.name,
            type: 'javascript',
            size: file.size,
            path: file.webkitRelativePath || file.name,
            analysis: {
                functions: this.extractJavaScriptFunctions(content),
                classes: this.extractJavaScriptClasses(content),
                imports: this.extractJavaScriptImports(content),
                exports: this.extractJavaScriptExports(content),
                variables: this.extractJavaScriptVariables(content),
                comments: this.extractJavaScriptComments(content),
                complexity: this.calculateJavaScriptComplexity(content)
            },
            issues: [],
            suggestions: [],
            timestamp: new Date().toISOString()
        };

        // Tìm vấn đề
        this.findJavaScriptIssues(analysis);
        
        // Đưa ra gợi ý
        this.generateJavaScriptSuggestions(analysis);

        return analysis;
    }

    analyzeCssFile(content, file) {
        const analysis = {
            file: file.name,
            type: 'css',
            size: file.size,
            path: file.webkitRelativePath || file.name,
            analysis: {
                selectors: this.extractCssSelectors(content),
                properties: this.extractCssProperties(content),
                mediaQueries: this.extractCssMediaQueries(content),
                variables: this.extractCssVariables(content),
                animations: this.extractCssAnimations(content),
                specificity: this.analyzeCssSpecificity(content)
            },
            issues: [],
            suggestions: [],
            timestamp: new Date().toISOString()
        };

        // Tìm vấn đề
        this.findCssIssues(analysis);
        
        // Đưa ra gợi ý
        this.generateCssSuggestions(analysis);

        return analysis;
    }

    // ===== HTML ANALYSIS METHODS =====
    extractHtmlTitle(content) {
        const titleMatch = content.match(/<title[^>]*>([^<]+)<\/title>/i);
        return titleMatch ? titleMatch[1].trim() : null;
    }

    extractMetaTags(content) {
        const metaMatches = content.match(/<meta[^>]+>/gi);
        const metaTags = [];
        
        if (metaMatches) {
            metaMatches.forEach(meta => {
                const nameMatch = meta.match(/name=["']([^"']+)["']/i);
                const contentMatch = meta.match(/content=["']([^"']+)["']/i);
                const propertyMatch = meta.match(/property=["']([^"']+)["']/i);
                
                metaTags.push({
                    name: nameMatch ? nameMatch[1] : null,
                    content: contentMatch ? contentMatch[1] : null,
                    property: propertyMatch ? propertyMatch[1] : null,
                    raw: meta
                });
            });
        }
        
        return metaTags;
    }

    extractHtmlLinks(content) {
        const linkMatches = content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>/gi);
        const links = [];
        
        if (linkMatches) {
            linkMatches.forEach(link => {
                const hrefMatch = link.match(/href=["']([^"']+)["']/i);
                const textMatch = link.match(/>([^<]+)</);
                const targetMatch = link.match(/target=["']([^"']+)["']/i);
                
                links.push({
                    href: hrefMatch ? hrefMatch[1] : null,
                    text: textMatch ? textMatch[1].trim() : null,
                    target: targetMatch ? targetMatch[1] : null,
                    raw: link
                });
            });
        }
        
        return links;
    }

    extractHtmlScripts(content) {
        const scriptMatches = content.match(/<script[^>]*>[\s\S]*?<\/script>/gi);
        const scripts = [];
        
        if (scriptMatches) {
            scriptMatches.forEach(script => {
                const srcMatch = script.match(/src=["']([^"']+)["']/i);
                const typeMatch = script.match(/type=["']([^"']+)["']/i);
                const isInline = !srcMatch;
                
                scripts.push({
                    src: srcMatch ? srcMatch[1] : null,
                    type: typeMatch ? typeMatch[1] : 'text/javascript',
                    isInline: isInline,
                    content: isInline ? script.replace(/<script[^>]*>|<\/script>/gi, '').trim() : null,
                    raw: script
                });
            });
        }
        
        return scripts;
    }

    extractHtmlStyles(content) {
        const styleMatches = content.match(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi);
        const styles = [];
        
        if (styleMatches) {
            styleMatches.forEach(style => {
                const hrefMatch = style.match(/href=["']([^"']+)["']/i);
                const mediaMatch = style.match(/media=["']([^"']+)["']/i);
                
                styles.push({
                    href: hrefMatch ? hrefMatch[1] : null,
                    media: mediaMatch ? mediaMatch[1] : 'all',
                    raw: style
                });
            });
        }
        
        return styles;
    }

    extractHtmlForms(content) {
        const formMatches = content.match(/<form[^>]*>[\s\S]*?<\/form>/gi);
        const forms = [];
        
        if (formMatches) {
            formMatches.forEach(form => {
                const actionMatch = form.match(/action=["']([^"']+)["']/i);
                const methodMatch = form.match(/method=["']([^"']+)["']/i);
                const idMatch = form.match(/id=["']([^"']+)["']/i);
                
                forms.push({
                    action: actionMatch ? actionMatch[1] : null,
                    method: methodMatch ? methodMatch[1] : 'get',
                    id: idMatch ? idMatch[1] : null,
                    raw: form
                });
            });
        }
        
        return forms;
    }

    extractHtmlImages(content) {
        const imgMatches = content.match(/<img[^>]+>/gi);
        const images = [];
        
        if (imgMatches) {
            imgMatches.forEach(img => {
                const srcMatch = img.match(/src=["']([^"']+)["']/i);
                const altMatch = img.match(/alt=["']([^"']+)["']/i);
                const widthMatch = img.match(/width=["']([^"']+)["']/i);
                const heightMatch = img.match(/height=["']([^"']+)["']/i);
                
                images.push({
                    src: srcMatch ? srcMatch[1] : null,
                    alt: altMatch ? altMatch[1] : null,
                    width: widthMatch ? widthMatch[1] : null,
                    height: heightMatch ? heightMatch[1] : null,
                    raw: img
                });
            });
        }
        
        return images;
    }

    analyzeHtmlStructure(content) {
        const structure = {
            doctype: content.match(/<!DOCTYPE[^>]+>/i) ? true : false,
            html: content.match(/<html[^>]*>/i) ? true : false,
            head: content.match(/<head[^>]*>/i) ? true : false,
            body: content.match(/<body[^>]*>/i) ? true : false,
            charset: content.match(/charset=["']([^"']+)["']/i) ? true : false,
            viewport: content.match(/viewport[^>]*>/i) ? true : false,
            responsive: content.match(/@media[^{]+{/i) ? true : false
        };
        
        return structure;
    }

    // ===== JAVASCRIPT ANALYSIS METHODS =====
    extractJavaScriptFunctions(content) {
        const functionMatches = content.match(/function\s+(\w+)\s*\([^)]*\)/g);
        const arrowMatches = content.match(/(?:const|let|var)\s+(\w+)\s*=\s*\([^)]*\)\s*=>/g);
        const methods = content.match(/(\w+)\s*\([^)]*\)\s*{/g);
        
        const functions = [];
        
        if (functionMatches) {
            functionMatches.forEach(fn => {
                const nameMatch = fn.match(/function\s+(\w+)/);
                const paramsMatch = fn.match(/\(([^)]*)\)/);
                
                functions.push({
                    name: nameMatch ? nameMatch[1] : 'anonymous',
                    type: 'function',
                    params: paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()).filter(Boolean) : [],
                    raw: fn
                });
            });
        }
        
        if (arrowMatches) {
            arrowMatches.forEach(fn => {
                const nameMatch = fn.match(/(?:const|let|var)\s+(\w+)/);
                const paramsMatch = fn.match(/\(([^)]*)\)/);
                
                functions.push({
                    name: nameMatch ? nameMatch[1] : 'anonymous',
                    type: 'arrow',
                    params: paramsMatch ? paramsMatch[1].split(',').map(p => p.trim()).filter(Boolean) : [],
                    raw: fn
                });
            });
        }
        
        return functions;
    }

    extractJavaScriptClasses(content) {
        const classMatches = content.match(/class\s+(\w+)(?:\s+extends\s+(\w+))?/g);
        const classes = [];
        
        if (classMatches) {
            classMatches.forEach(cls => {
                const nameMatch = cls.match(/class\s+(\w+)/);
                const extendsMatch = cls.match(/extends\s+(\w+)/);
                
                classes.push({
                    name: nameMatch ? nameMatch[1] : 'anonymous',
                    extends: extendsMatch ? extendsMatch[1] : null,
                    raw: cls
                });
            });
        }
        
        return classes;
    }

    extractJavaScriptImports(content) {
        const importMatches = content.match(/import\s+.*?from\s+["']([^"']+)["']/g);
        const imports = [];
        
        if (importMatches) {
            importMatches.forEach(imp => {
                const fromMatch = imp.match(/from\s+["']([^"']+)["']/);
                const importMatch = imp.match(/import\s+(.*?)\s+from/);
                
                imports.push({
                    imports: importMatch ? importMatch[1].trim() : 'default',
                    from: fromMatch ? fromMatch[1] : null,
                    raw: imp
                });
            });
        }
        
        return imports;
    }

    extractJavaScriptExports(content) {
        const exportMatches = content.match(/export\s+(?:default\s+)?(?:function|class|const|let|var)\s+(\w+)/g);
        const exports = [];
        
        if (exportMatches) {
            exportMatches.forEach(exp => {
                const nameMatch = exp.match(/(?:function|class|const|let|var)\s+(\w+)/);
                const isDefault = exp.includes('default');
                
                exports.push({
                    name: nameMatch ? nameMatch[1] : 'anonymous',
                    isDefault: isDefault,
                    raw: exp
                });
            });
        }
        
        return exports;
    }

    extractJavaScriptVariables(content) {
        const varMatches = content.match(/(?:const|let|var)\s+(\w+)/g);
        const variables = [];
        
        if (varMatches) {
            varMatches.forEach(v => {
                const nameMatch = v.match(/(?:const|let|var)\s+(\w+)/);
                const type = v.startsWith('const') ? 'const' : v.startsWith('let') ? 'let' : 'var';
                
                variables.push({
                    name: nameMatch ? nameMatch[1] : 'unknown',
                    type: type,
                    raw: v
                });
            });
        }
        
        return variables;
    }

    extractJavaScriptComments(content) {
        const singleLineComments = content.match(/\/\/.*$/gm);
        const multiLineComments = content.match(/\/\*[\s\S]*?\*\//g);
        
        return {
            singleLine: singleLineComments ? singleLineComments.length : 0,
            multiLine: multiLineComments ? multiLineComments.length : 0,
            total: (singleLineComments ? singleLineComments.length : 0) + 
                   (multiLineComments ? multiLineComments.length : 0)
        };
    }

    calculateJavaScriptComplexity(content) {
        let complexity = 0;
        
        // Count control structures
        complexity += (content.match(/if\s*\(/g) || []).length;
        complexity += (content.match(/for\s*\(/g) || []).length;
        complexity += (content.match(/while\s*\(/g) || []).length;
        complexity += (content.match(/switch\s*\(/g) || []).length;
        complexity += (content.match(/catch\s*\(/g) || []).length;
        
        // Count logical operators
        complexity += (content.match(/&&|\|\||!/g) || []).length;
        
        // Count function calls
        complexity += (content.match(/\.\w+\(/g) || []).length;
        
        return complexity;
    }

    // ===== CSS ANALYSIS METHODS =====
    extractCssSelectors(content) {
        const selectorMatches = content.match(/([.#]?\w+(?:[^}]*?)\s*\{)/g);
        const selectors = [];
        
        if (selectorMatches) {
            selectorMatches.forEach(selector => {
                const cleanSelector = selector.replace(/\s*\{$/, '').trim();
                
                selectors.push({
                    selector: cleanSelector,
                    type: this.getSelectorType(cleanSelector),
                    specificity: this.calculateSelectorSpecificity(cleanSelector)
                });
            });
        }
        
        return selectors;
    }

    extractCssProperties(content) {
        const propertyMatches = content.match(/([a-zA-Z-]+)\s*:\s*([^;]+);/g);
        const properties = [];
        
        if (propertyMatches) {
            propertyMatches.forEach(prop => {
                const nameMatch = prop.match(/^([a-zA-Z-]+)\s*:/);
                const valueMatch = prop.match(/:\s*([^;]+);/);
                
                properties.push({
                    name: nameMatch ? nameMatch[1] : 'unknown',
                    value: valueMatch ? valueMatch[1].trim() : '',
                    raw: prop
                });
            });
        }
        
        return properties;
    }

    extractCssMediaQueries(content) {
        const mediaMatches = content.match(/@media[^{]+{[\s\S]*?}/g);
        const mediaQueries = [];
        
        if (mediaMatches) {
            mediaMatches.forEach(media => {
                const queryMatch = media.match(/@media\s+([^{]+)/);
                const rulesMatch = media.match(/{([\s\S]*)}/);
                
                mediaQueries.push({
                    query: queryMatch ? queryMatch[1].trim() : '',
                    rules: rulesMatch ? rulesMatch[1].trim() : '',
                    raw: media
                });
            });
        }
        
        return mediaQueries;
    }

    extractCssVariables(content) {
        const varMatches = content.match(/--[\w-]+/g);
        const variables = [];
        
        if (varMatches) {
            const uniqueVars = [...new Set(varMatches)];
            uniqueVars.forEach(variable => {
                const valueMatch = content.match(new RegExp(`${variable}\\s*:\\s*([^;]+);`));
                
                variables.push({
                    name: variable,
                    value: valueMatch ? valueMatch[1].trim() : '',
                    raw: variable
                });
            });
        }
        
        return variables;
    }

    extractCssAnimations(content) {
        const animationMatches = content.match(/@keyframes\s+(\w+)/g);
        const animations = [];
        
        if (animationMatches) {
            animationMatches.forEach(anim => {
                const nameMatch = anim.match(/@keyframes\s+(\w+)/);
                
                animations.push({
                    name: nameMatch ? nameMatch[1] : 'anonymous',
                    raw: anim
                });
            });
        }
        
        return animations;
    }

    getSelectorType(selector) {
        if (selector.startsWith('.')) return 'class';
        if (selector.startsWith('#')) return 'id';
        if (selector.includes(':')) return 'pseudo';
        if (selector.includes('[')) return 'attribute';
        return 'element';
    }

    calculateSelectorSpecificity(selector) {
        let specificity = 0;
        
        // Count IDs
        specificity += (selector.match(/#/g) || []).length * 100;
        
        // Count classes, attributes, pseudo-classes
        specificity += (selector.match(/\.|\[|:/g) || []).length * 10;
        
        // Count elements
        specificity += (selector.match(/[a-zA-Z]/g) || []).length;
        
        return specificity;
    }

    analyzeCssSpecificity(content) {
        const selectors = this.extractCssSelectors(content);
        const specificityScores = selectors.map(s => s.specificity);
        
        return {
            average: specificityScores.reduce((a, b) => a + b, 0) / specificityScores.length || 0,
            highest: Math.max(...specificityScores, 0),
            lowest: Math.min(...specificityScores, 0),
            total: selectors.length
        };
    }

    // ===== ISSUE DETECTION =====
    findHtmlIssues(analysis) {
        const issues = [];
        
        if (!analysis.analysis.title) {
            issues.push({
                type: 'warning',
                message: 'Thiếu thẻ title',
                severity: 'medium',
                suggestion: 'Thêm thẻ title để SEO tốt hơn'
            });
        }
        
        if (!analysis.analysis.structure.charset) {
            issues.push({
                type: 'error',
                message: 'Thiếu khai báo charset',
                severity: 'high',
                suggestion: 'Thêm meta charset="UTF-8"'
            });
        }
        
        if (!analysis.analysis.structure.viewport) {
            issues.push({
                type: 'warning',
                message: 'Thiếu viewport meta tag',
                severity: 'medium',
                suggestion: 'Thêm viewport meta tag cho responsive'
            });
        }
        
        if (analysis.analysis.images.length > 0) {
            analysis.analysis.images.forEach(img => {
                if (!img.alt) {
                    issues.push({
                        type: 'warning',
                        message: `Ảnh ${img.src} thiếu alt text`,
                        severity: 'low',
                        suggestion: 'Thêm alt text cho ảnh'
                    });
                }
            });
        }
        
        analysis.issues = issues;
    }

    findJavaScriptIssues(analysis) {
        const issues = [];
        
        if (analysis.analysis.functions.length === 0) {
            issues.push({
                type: 'warning',
                message: 'Không có function nào',
                severity: 'medium',
                suggestion: 'Thêm các function để tăng tính năng'
            });
        }
        
        if (content.includes('console.log')) {
            issues.push({
                type: 'warning',
                message: 'Có console.log statements',
                severity: 'low',
                suggestion: 'Xóa console.log trước khi deploy'
            });
        }
        
        if (analysis.analysis.complexity > 50) {
            issues.push({
                type: 'warning',
                message: 'Code phức tạp cao',
                severity: 'medium',
                suggestion: 'Chia nhỏ function để dễ bảo trì'
            });
        }
        
        analysis.issues = issues;
    }

    findCssIssues(analysis) {
        const issues = [];
        
        if (analysis.analysis.selectors.length === 0) {
            issues.push({
                type: 'error',
                message: 'Không có CSS selector nào',
                severity: 'high',
                suggestion: 'Thêm CSS styles cho website'
            });
        }
        
        if (analysis.analysis.specificity.average > 100) {
            issues.push({
                type: 'warning',
                message: 'CSS specificity quá cao',
                severity: 'medium',
                suggestion: 'Sử dụng CSS classes thay vì IDs'
            });
        }
        
        analysis.issues = issues;
    }

    // ===== SUGGESTION GENERATION =====
    generateHtmlSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.analysis.structure.responsive === false) {
            suggestions.push({
                type: 'improvement',
                message: 'Thêm responsive design',
                priority: 'high',
                implementation: 'Sử dụng CSS media queries và flexible layouts'
            });
        }
        
        if (analysis.analysis.scripts.length === 0) {
            suggestions.push({
                type: 'feature',
                message: 'Thêm JavaScript functionality',
                priority: 'medium',
                implementation: 'Thêm các script để tăng tính năng'
            });
        }
        
        analysis.suggestions = suggestions;
    }

    generateJavaScriptSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.analysis.classes.length === 0) {
            suggestions.push({
                type: 'improvement',
                message: 'Sử dụng ES6 classes',
                priority: 'medium',
                implementation: 'Chuyển đổi function sang class để code rõ ràng hơn'
            });
        }
        
        if (analysis.analysis.complexity > 30) {
            suggestions.push({
                type: 'refactor',
                message: 'Refactor code để giảm độ phức tạp',
                priority: 'high',
                implementation: 'Chia nhỏ function và sử dụng helper functions'
            });
        }
        
        analysis.suggestions = suggestions;
    }

    generateCssSuggestions(analysis) {
        const suggestions = [];
        
        if (analysis.analysis.variables.length === 0) {
            suggestions.push({
                type: 'improvement',
                message: 'Sử dụng CSS variables',
                priority: 'medium',
                implementation: 'Định nghĩa colors, fonts, spacing trong CSS variables'
            });
        }
        
        if (analysis.analysis.animations.length === 0) {
            suggestions.push({
                type: 'enhancement',
                message: 'Thêm CSS animations',
                priority: 'low',
                implementation: 'Sử dụng @keyframes để tạo hiệu ứng chuyển động'
            });
        }
        
        analysis.suggestions = suggestions;
    }

    // ===== UTILITY METHODS =====
    updateProgress(progress) {
        this.analysisProgress = progress;
        
        // Emit progress event
        const event = new CustomEvent('analysisProgress', {
            detail: { progress: progress }
        });
        document.dispatchEvent(event);
    }

    getAnalysisCache() {
        return this.analysisCache;
    }

    clearCache() {
        this.analysisCache.clear();
    }

    exportAnalysis(analysis) {
        return JSON.stringify(analysis, null, 2);
    }
}

// Initialize File Analyzer
let fileAnalyzer;

document.addEventListener('DOMContentLoaded', function() {
    fileAnalyzer = new FileAnalyzer();
});

// Export for global use
window.FileAnalyzer = FileAnalyzer;
