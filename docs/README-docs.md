# 📚 DOCS FOLDER - TỔ CHỨC TÀI LIỆU

**Cập nhật:** 2025-08-09 (Cipher - Clean-up session)

## 📁 CẤU TRÚC THƯ MỤC

### **📂 docs/ - Tài liệu tổ chức**
```
docs/
├── archived/           # File backup, không sử dụng
│   ├── SYSTEM-OVERVIEW.md
│   └── etax-project-summary.md
├── reports/            # Các báo cáo kỹ thuật
│   ├── placeholder-scan-report.md
│   ├── placeholder-implementation-report.md
│   ├── database-expansion-report.md
│   ├── security-audit-report.md
│   ├── admin-security-status-report.md
│   └── admin-users-test-report.md
├── LUONG-CHUAN-ADMIN.md
├── MULTI-USER-THEME-SYSTEM.md
└── README-docs.md      # File này
```

## 🎯 MỤC ĐÍCH CLEAN-UP

### **VẤN ĐỀ TRƯỚC ĐÂY:**
- ❌ 12+ file .md nằm rời rạc ở root
- ❌ File trùng lặp về cùng chủ đề
- ❌ Khó tìm tài liệu cần thiết
- ❌ Không phân biệt được file chính/phụ

### **SAU KHI CLEAN-UP:**
- ✅ File chính ở root: `PERSONAL.md`, `CLAUDE.md`, `README.md`
- ✅ File tài liệu được organize trong `docs/`
- ✅ File backup trong `docs/archived/`
- ✅ Reports trong `docs/reports/`

## 📋 DANH SÁCH FILE SAU CLEAN-UP

### **ROOT FILES (3 file chính):**
- `PERSONAL.md` - Template global cho tất cả dự án
- `CLAUDE.md` - Cấu hình dự án eTax Mobile
- `README.md` - Tài liệu chính của dự án

### **ARCHIVED FILES (2 file):**
- `SYSTEM-OVERVIEW.md` - Backup, đã gộp info vào README.md
- `etax-project-summary.md` - Backup, roadmap đã chuyển vào NEXT-ACTIONS.md

### **REPORTS FILES (6 file):**
- `placeholder-scan-report.md`
- `placeholder-implementation-report.md`  
- `database-expansion-report.md`
- `security-audit-report.md`
- `admin-security-status-report.md`
- `admin-users-test-report.md`

### **OTHER DOCS (2 file):**
- `LUONG-CHUAN-ADMIN.md`
- `MULTI-USER-THEME-SYSTEM.md`

## 🔄 HƯỚNG DẪN SỬ DỤNG

### **Khi cần đọc tài liệu:**
1. **Tài liệu chính:** Đọc `README.md`
2. **Cấu hình AI:** Đọc `PERSONAL.md` + `CLAUDE.md`
3. **Reports kỹ thuật:** Vào `docs/reports/`
4. **Tài liệu cũ:** Vào `docs/archived/`

### **Khi thêm tài liệu mới:**
1. **File chính dự án:** Đặt ở root
2. **Reports:** Vào `docs/reports/`
3. **Tài liệu hệ thống:** Vào `docs/`
4. **Backup cũ:** Vào `docs/archived/`

## 🎯 NGUYÊN TẮC DUY TRÌ

### **✅ PHẢI LÀM:**
- Chỉ giữ 3-5 file .md ở root (file chính)
- Organize tài liệu vào thư mục con
- Backup file cũ trước khi xóa
- Update README-docs.md khi thay đổi

### **❌ CẤM LÀM:**
- Để hàng chục file .md ở root
- Xóa file không backup
- Tạo file trùng lặp
- Quên update documentation

---

*File này giúp team hiểu cấu trúc tài liệu sau khi clean-up*