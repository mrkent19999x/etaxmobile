// ===== FLOW DIAGRAM MANAGER =====

class FlowDiagramManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.zoom = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        this.isDragging = false;
        this.lastX = 0;
        this.lastY = 0;
        this.nodes = [];
        this.connections = [];
        this.init();
    }

    init() {
        this.canvas = document.getElementById('flowCanvas');
        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.setupEventListeners();
            this.drawInitialDiagram();
        }
    }

    setupEventListeners() {
        if (!this.canvas) return;

        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('wheel', (e) => this.handleWheel(e));
    }

    handleMouseDown(e) {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }

    handleMouseMove(e) {
        if (this.isDragging) {
            const deltaX = e.clientX - this.lastX;
            const deltaY = e.clientY - this.lastY;
            
            this.offsetX += deltaX;
            this.offsetY += deltaY;
            
            this.lastX = e.clientX;
            this.lastY = e.clientY;
            
            this.redraw();
        }
    }

    handleMouseUp(e) {
        this.isDragging = false;
        this.canvas.style.cursor = 'grab';
    }

    handleWheel(e) {
        e.preventDefault();
        const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
        this.zoom *= zoomFactor;
        this.zoom = Math.max(0.1, Math.min(3, this.zoom));
        this.redraw();
    }

    drawInitialDiagram() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid
        this.drawGrid();
        
        // Draw welcome message
        this.drawWelcomeMessage();
    }

    drawGrid() {
        const gridSize = 20;
        const gridColor = '#f0f0f0';
        
        this.ctx.strokeStyle = gridColor;
        this.ctx.lineWidth = 0.5;
        
        for (let x = 0; x < this.canvas.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        for (let y = 0; y < this.canvas.height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawWelcomeMessage() {
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '24px Segoe UI';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Kéo thả thư mục website để xem sơ đồ luồng', this.canvas.width / 2, this.canvas.height / 2);
        
        this.ctx.font = '16px Segoe UI';
        this.ctx.fillText('Sơ đồ sẽ hiển thị mối liên kết giữa các file HTML, JS, CSS', this.canvas.width / 2, this.canvas.height / 2 + 40);
    }

    generateFlowDiagram(projectData) {
        if (!projectData || !this.ctx) return;
        
        this.nodes = [];
        this.connections = [];
        
        // Generate nodes for HTML files
        let x = 100;
        let y = 100;
        
        projectData.files.html.forEach((file, index) => {
            this.nodes.push({
                id: `html_${index}`,
                type: 'html',
                name: file.name,
                x: x + (index * 300),
                y: y,
                width: 200,
                height: 100
            });
        });
        
        // Generate nodes for JS files
        y = 300;
        projectData.files.javascript.forEach((file, index) => {
            this.nodes.push({
                id: `js_${index}`,
                type: 'javascript',
                name: file.name,
                x: x + (index * 300),
                y: y,
                width: 200,
                height: 100
            });
        });
        
        // Generate nodes for CSS files
        y = 500;
        projectData.files.css.forEach((file, index) => {
            this.nodes.push({
                id: `css_${index}`,
                type: 'css',
                name: file.name,
                x: x + (index * 300),
                y: y,
                width: 200,
                height: 100
            });
        });
        
        // Generate connections
        this.generateConnections(projectData);
        
        this.redraw();
    }

    generateConnections(projectData) {
        // Connect HTML files to their JS and CSS dependencies
        projectData.files.html.forEach((htmlFile, htmlIndex) => {
            const htmlNode = this.nodes.find(n => n.id === `html_${htmlIndex}`);
            if (!htmlNode) return;
            
            // Connect to JS files
            projectData.files.javascript.forEach((jsFile, jsIndex) => {
                if (htmlFile.scripts && htmlFile.scripts.includes(jsFile.name)) {
                    this.connections.push({
                        from: `html_${htmlIndex}`,
                        to: `js_${jsIndex}`,
                        type: 'script'
                    });
                }
            });
            
            // Connect to CSS files
            projectData.files.css.forEach((cssFile, cssIndex) => {
                if (htmlFile.styles && htmlFile.styles.includes(cssFile.name)) {
                    this.connections.push({
                        from: `html_${htmlIndex}`,
                        to: `css_${cssIndex}`,
                        type: 'style'
                    });
                }
            });
        });
    }

    redraw() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Apply transformations
        this.ctx.save();
        this.ctx.translate(this.offsetX, this.offsetY);
        this.ctx.scale(this.zoom, this.zoom);
        
        // Draw grid
        this.drawGrid();
        
        // Draw connections
        this.drawConnections();
        
        // Draw nodes
        this.drawNodes();
        
        this.ctx.restore();
    }

    drawNodes() {
        this.nodes.forEach(node => {
            // Node background
            const colors = {
                html: '#3b82f6',
                javascript: '#f59e0b',
                css: '#10b981'
            };
            
            this.ctx.fillStyle = colors[node.type] || '#64748b';
            this.ctx.fillRect(node.x, node.y, node.width, node.height);
            
            // Node border
            this.ctx.strokeStyle = '#1e293b';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(node.x, node.y, node.width, node.height);
            
            // Node text
            this.ctx.fillStyle = 'white';
            this.ctx.font = '12px Segoe UI';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(node.name, node.x + node.width / 2, node.y + node.height / 2 + 4);
            
            // Node type
            this.ctx.font = '10px Segoe UI';
            this.ctx.fillText(node.type.toUpperCase(), node.x + node.width / 2, node.y + node.height / 2 + 20);
        });
    }

    drawConnections() {
        this.connections.forEach(connection => {
            const fromNode = this.nodes.find(n => n.id === connection.from);
            const toNode = this.nodes.find(n => n.id === connection.to);
            
            if (!fromNode || !toNode) return;
            
            const fromX = fromNode.x + fromNode.width / 2;
            const fromY = fromNode.y + fromNode.height / 2;
            const toX = toNode.x + toNode.width / 2;
            const toY = toNode.y + toNode.height / 2;
            
            // Connection line
            this.ctx.strokeStyle = connection.type === 'script' ? '#f59e0b' : '#10b981';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(fromX, fromY);
            this.ctx.lineTo(toX, toY);
            this.ctx.stroke();
            
            // Arrow
            this.drawArrow(fromX, fromY, toX, toY);
        });
    }

    drawArrow(fromX, fromY, toX, toY) {
        const headLength = 10;
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        this.ctx.strokeStyle = '#1e293b';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
        this.ctx.stroke();
    }
}

// Initialize flow diagram manager
let flowDiagramManager;

document.addEventListener('DOMContentLoaded', function() {
    flowDiagramManager = new FlowDiagramManager();
});

// Global zoom functions
function zoomIn() {
    if (flowDiagramManager) {
        flowDiagramManager.zoom *= 1.2;
        flowDiagramManager.zoom = Math.min(3, flowDiagramManager.zoom);
        flowDiagramManager.redraw();
    }
}

function zoomOut() {
    if (flowDiagramManager) {
        flowDiagramManager.zoom *= 0.8;
        flowDiagramManager.zoom = Math.max(0.1, flowDiagramManager.zoom);
        flowDiagramManager.redraw();
    }
}

function resetZoom() {
    if (flowDiagramManager) {
        flowDiagramManager.zoom = 1;
        flowDiagramManager.offsetX = 0;
        flowDiagramManager.offsetY = 0;
        flowDiagramManager.redraw();
    }
}
