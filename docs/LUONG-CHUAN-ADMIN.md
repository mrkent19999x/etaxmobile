# 🎯 LUỒNG CHUẨN HỆ THỐNG ADMIN ETAX

## 📋 Luồng hoạt động chính

```
🔐 admin_login_etax.html 
    ↓ (sau khi đăng nhập thành công)
🏠 admin_dashboard_etax.html
    ↓ (click "Vào trình thiết kế")  
🎨 admin_ultimate_editor_v2_clean.html
    ↓ (các trang admin khác trong hệ thống)
📄 Các trang admin con khác...
```

## 🔑 Tài khoản đăng nhập

| Username | Password | Role |
|----------|----------|------|
| `admin` | `Baoan2022@` | Super Admin |
| `nghia` | `nghia2024` | Admin |

## 📁 Cấu trúc file CHÍNH cần giữ

### ✅ Files chính - KHÔNG XÓA
- `admin_login_etax.html` - Trang đăng nhập admin
- `admin_dashboard_etax.html` - Dashboard chính
- `admin_ultimate_editor_v2_clean.html` - Editor chính (đã tách CSS/JS)
- `css/admin-ultimate-editor-v2.css` - CSS của editor
- `js/admin-ultimate-editor-v2.js` - JavaScript của editor
- `assets/` - Thư mục hình ảnh và tài nguyên
- `firebase.json` - Config Firebase
- `manifest.json` - PWA config

### ✅ Files user interface - CẦN KIỂM TRA
- `index.html` - Trang chính người dùng
- `login.html` - Đăng nhập người dùng  
- `dangky.html` - Đăng ký
- `khaithue.html` - Khai thuế
- `nopthue.html` - Nộp thuế
- `thongbao.html` - Thông báo
- Các trang còn lại...

## 🗑️ Files RÁC cần xóa

### ❌ Files admin cũ/trùng lặp
- `admin_ultimate_editor.html` (bản cũ)
- `admin_ultimate_editor_v2.html` (bản gốc chưa tách)
- `admin_ultimate_editor_v2_backup.html` (backup)
- `admin_editor_enhanced.html`
- `admin_editor_etax.html` 
- `admin_visual_system.html`
- `multi-page-visual-editor.html`

### ❌ Files không cần thiết
- `grapesjs_etax_editor (3) (1).html`
- `grapesjs_etax_editor (3).html`
- `demo.html`
- `index_simple.html`
- `login_simple.html`
- `admin-common.css` (nếu không dùng)
- `admin-content.html`
- `admin-content.js`
- `admin-dashboard.html` (trùng với etax version)
- `admin-design.html`
- `admin-nghiavu.html`
- `admin-panel-working.html`
- `admin-panel.js`
- `admin-pdf.html`
- `admin-settings.html`
- `admin-users.html`
- `admin-users.js`

### ❌ Thư mục con cũ
- `admin/` (thư mục con cũ)
- `src/` (backup code)
- `etaxmobile/` (nếu không dùng)
- `rustdesk/` (không liên quan)
- `huong dan ai/` (chỉ là doc)
- `ảnh gốc/`

### ❌ Files docs/config không cần
- `HUONG-DAN-ADMIN-KEO-THA.md`
- `README.md` (cũ)
- `Resilio Sync.code-workspace`
- `claude.cmd`
- `how`
- Các file `.jpg` rời

## 🧹 HƯỚNG DẪN DỌN DẸP

### Bước 1: Backup quan trọng
```bash
# Backup files chính trước khi xóa
mkdir backup_important
cp admin_login_etax.html backup_important/
cp admin_dashboard_etax.html backup_important/  
cp admin_ultimate_editor_v2_clean.html backup_important/
cp -r css backup_important/
cp -r js backup_important/
cp -r assets backup_important/
```

### Bước 2: Test luồng hoạt động
1. Mở `admin_login_etax.html`
2. Đăng nhập với `admin` / `Baoan2022@`
3. Kiểm tra dashboard hiển thị OK
4. Click "Vào trình thiết kế" → Kiểm tra editor load OK
5. Test các chức năng chính

### Bước 3: Xóa files rác (sau khi test OK)
```bash
# Xóa files admin cũ
rm admin_ultimate_editor.html
rm admin_ultimate_editor_v2.html  
rm admin_ultimate_editor_v2_backup.html
rm admin_editor_*.html
rm admin_visual_system.html
rm multi-page-visual-editor.html

# Xóa files demo/test
rm grapesjs_etax_editor*.html
rm demo.html
rm *_simple.html

# Xóa thư mục không cần
rm -rf admin/
rm -rf etaxmobile/
rm -rf rustdesk/ 
rm -rf "huong dan ai/"
rm -rf "ảnh gốc/"

# Xóa docs cũ
rm HUONG-DAN-ADMIN-KEO-THA.md
rm README.md
rm "Resilio Sync.code-workspace"
rm claude.cmd
```

## 🚀 DEPLOY LÊN FIREBASE

### Cấu trúc sau khi dọn dẹp:
```
etax-project/
├── admin_login_etax.html          # ✅ Admin login  
├── admin_dashboard_etax.html      # ✅ Admin dashboard
├── admin_ultimate_editor_v2_clean.html  # ✅ Editor chính
├── css/
│   └── admin-ultimate-editor-v2.css     # ✅ CSS editor
├── js/ 
│   └── admin-ultimate-editor-v2.js      # ✅ JS editor
├── assets/                        # ✅ Hình ảnh
├── index.html                     # ✅ User homepage
├── login.html                     # ✅ User login
├── dangky.html                    # ✅ User pages...
└── firebase.json                  # ✅ Config
```

### Deploy command:
```bash
firebase deploy --only hosting
```

## ✅ CHECKLIST CUỐI CÙNG

- [ ] Test login admin: `admin` / `Baoan2022@` 
- [ ] Test dashboard load OK
- [ ] Test editor load đầy đủ chức năng
- [ ] Test responsive mobile
- [ ] Xóa files rác (theo danh sách trên)
- [ ] Deploy lên Firebase
- [ ] Test trên production: https://etax-7fbf8.web.app/admin_dashboard_etax.html

---
*Cập nhật: $(date +"%Y-%m-%d %H:%M:%S")*