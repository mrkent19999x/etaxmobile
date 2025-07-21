const fs = require('fs');
const path = require('path');

// Files to clean up
const filesToClean = [
    'thongbao.html',
    'dangky.html', 
    'thietlap.html',
    'ho-tro-qtt.html',
    'nopthue.html'
];

console.log('🧹 Starting HTML structure cleanup...');

filesToClean.forEach(filename => {
    const filePath = path.join(__dirname, filename);
    
    if (fs.existsSync(filePath)) {
        console.log(`\n🔧 Cleaning ${filename}...`);
        
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Fix 1: Remove duplicate <body> tags - keep only the first one
        content = content.replace(/<body><body>/g, '<body>');
        content = content.replace(/<\/body><\/body>/g, '</body>');
        
        // Fix 2: Remove duplicate header sections that are not in the main template structure
        // Keep only the main header div that follows the template
        const lines = content.split('\n');
        let inDuplicateHeaderSection = false;
        let cleanedLines = [];
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Detect start of duplicate content areas that contain extra headers
            if (line.includes('<!-- ✅ HEADER CHUẨN APP GỐC -->') || 
                line.includes('<header class="header">') ||
                (line.includes('<!-- ✅ CONSISTENT HEADER') && !line.includes('PWA TEMPLATE')) ||
                (line.includes('<!-- ✅ HEADER CHUẨN PWA -->') && line.trim() !== '')) {
                inDuplicateHeaderSection = true;
                continue;
            }
            
            // Look for orphaned elements that should be removed
            if (line.includes('<i class="fas fa-house" onclick="window.location.href=\'index.html\'"></i>') && 
                !line.includes('<div class="header">')) {
                continue; // Skip orphaned home button
            }
            
            // Skip duplicate content-area divs
            if (line.includes('<div class="content-area">') && cleanedLines.some(l => l.includes('<div class="content-area">'))) {
                continue;
            }
            
            // Skip closing divs that would be orphaned
            if (inDuplicateHeaderSection && line.trim() === '</div>') {
                inDuplicateHeaderSection = false;
                continue;
            }
            
            if (!inDuplicateHeaderSection) {
                cleanedLines.push(line);
            }
        }
        
        content = cleanedLines.join('\n');
        
        // Fix 3: Clean up excessive empty divs and spacing
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        // Fix 4: Ensure proper closing structure
        content = content.replace(/}\s*<\/style>/g, '}\n</style>');
        
        // Write cleaned content
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Cleaned ${filename}`);
    } else {
        console.log(`❌ File ${filename} not found`);
    }
});

console.log('\n🎉 HTML structure cleanup completed!');