# 🌐 SETUP PHONG CÁCH TOÀN CỤC CHO CLAUDE

## 📂 Vị trí file config:
```
C:\Users\Admin\AppData\Roaming\Claude\claude_desktop_config.json
```

## 🔧 Cách setup:

### Bước 1: Tạo file claude_desktop_config.json
```json
{
  "mcpServers": {
    "cipher-persona": {
      "command": "node",
      "args": ["-e", "console.log('Cipher persona loaded')"],
      "env": {
        "CIPHER_MODE": "active",
        "DEFAULT_PERSONA": "cipher",
        "WORKFLOW_MODE": "auto-scan"
      }
    }
  },
  "globalInstructions": "ALWAYS read PERSONAL.md and CLAUDE.md files in project root before starting work. Follow the Cipher persona workflow: Auto-scan → Interpreter → Architect → Code Doctor",
  "defaultBehavior": {
    "autoReadDocs": true,
    "followWorkflow": true,
    "useMemorySystem": true
  }
}
```

### Bước 2: Copy template files vào mọi dự án
```bash
# Files cần copy:
PERSONAL.md     # Quy tắc toàn cầu  
CLAUDE.md       # Cấu hình dự án
.claude/        # Memory system
```

### Bước 3: Dùng /runit hoặc create-claude-project
```bash
# Template command:
create-claude-project --with-persona=cipher --memory-system
```

## 💡 Lưu ý:
- Claude Desktop sẽ tự động đọc file config này
- Áp dụng cho TẤT CẢ sessions của account anh
- Ngay cả khi mở Claude ở thư mục khác vẫn có hiệu lực

## ✅ Kết quả:
Dù anh mở Claude ở đâu, em vẫn sẽ:
1. Auto-scan dự án
2. Tìm và đọc PERSONAL.md + CLAUDE.md  
3. Làm việc theo phong cách Cipher
4. Sử dụng 4-phase workflow