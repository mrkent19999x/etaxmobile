# 🚦 DEV RULES - QUY TẮC TẠO FILE/TRANG MỚI

## ⚠️ BẮT BUỘC - ĐỌC TRƯỚC KHI CODE

**Tất cả DEV phải tuân thủ 100% quy tắc này khi tạo file/trang mới. Không có ngoại lệ!**

---

## 📁 CẤU TRÚC THỨ BẬC CHUẨN

```
public/
├── admin/              # 🔐 Admin pages only
│   ├── admin-*.html   # Prefix admin- bắt buộc
│   └── css/admin.css  # CSS riêng cho admin
├── user/              # 👤 User entry points  
│   ├── *.html         # Clean names (login.html, index.html)
│   ├── css/user.css   # CSS riêng cho user
│   └── js/auth.js     # Auth logic
├── user_site/         # 📦 Legacy user pages (26+ pages)
│   ├── *.html         # Tất cả trang cũ
│   └── css/           # CSS legacy
└── shared/            # 🔧 Common resources
    ├── css/base.css   # Base styles
    └── js/firebase-init.js # Firebase config
```

---

## 🎯 QUY TẮC TẠO FILE MỚI

### **1. ADMIN PAGES**
```
Location: public/admin/
Naming: admin-[function].html
Examples: 
  ✅ admin-create.html
  ✅ admin-users.html  
  ✅ admin-settings.html
  ❌ create-admin.html (wrong order)
  ❌ admin_create.html (no underscore)
```

### **2. USER PAGES** 
```
Location: public/user/
Naming: [clean-name].html
Examples:
  ✅ login.html
  ✅ dashboard.html
  ✅ profile.html
  ❌ user-login.html (no prefix needed)
```

### **3. LEGACY PAGES**
```
Location: public/user_site/ 
⚠️ KHÔNG TẠO MỚI Ở ĐÂY!
Chỉ sửa file cũ, không thêm file mới.
```

### **4. SHARED RESOURCES**
```
Location: public/shared/
Usage: Common CSS/JS for multiple sections
Examples:
  ✅ shared/css/base.css
  ✅ shared/js/firebase-init.js
```

---

## 🔧 TEMPLATE CHUẨN

### **Admin Page Template:**
```html
<!DOCTYPE html><html lang="vi"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">
<meta name="apple-mobile-web-app-title" content="eTax Admin">
<title>[Page Title]</title>
<link rel="stylesheet" href="/admin/css/admin.css">
<!-- JS imports here -->
</head><body><div class="wrap">
  <h2>[Page Header]</h2>
  <div class="card">
    <!-- Content here -->
  </div>
</div></body></html>
```

### **User Page Template:**
```html
<!DOCTYPE html><html lang="vi"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>[Page Title]</title>
<link rel="stylesheet" href="/user/css/user.css">
</head><body><div class="wrap">
  <!-- Content here -->
</div></body></html>
```

---

## 🚫 NGHIÊM CẤM

### **❌ WRONG LOCATIONS:**
- ❌ Tạo admin page trong `public/user/`
- ❌ Tạo user page trong `public/admin/`  
- ❌ Tạo file mới trong `public/user_site/`
- ❌ Tạo file CSS riêng cho từng page

### **❌ WRONG NAMING:**
- ❌ `create_admin.html` (underscore)
- ❌ `adminCreate.html` (camelCase)
- ❌ `Admin-Create.html` (uppercase)
- ❌ `createadmin.html` (no separator)

### **❌ WRONG STRUCTURE:**
- ❌ Inline CSS trong HTML
- ❌ Hardcode Firebase config
- ❌ Không có meta viewport
- ❌ Không có error handling

---

## 📋 CHECKLIST TRƯỚC KHI COMMIT

**Trước khi tạo page mới, check:**
- [ ] File đúng thư mục theo function (admin/, user/, shared/)
- [ ] Naming convention đúng (admin-*.html cho admin pages)
- [ ] Sử dụng CSS chuẩn (/admin/css/admin.css hoặc /user/css/user.css)
- [ ] Meta tags đầy đủ (viewport, PWA)
- [ ] Import Firebase từ /shared/js/firebase-init.js
- [ ] Error handling đầy đủ (try-catch, validation)
- [ ] Mobile responsive (test trên mobile)

---

## 🎯 VÍ DỤ CHUẨN

**Vừa tạo: `admin-create.html`**
- ✅ Location: `public/admin/` (đúng thư mục)
- ✅ Naming: `admin-create.html` (đúng prefix)  
- ✅ CSS: `/admin/css/admin.css` (dùng chung)
- ✅ Structure: Wrap + Card layout
- ✅ Firebase: Import từ shared
- ✅ Validation: Full form validation
- ✅ PWA: Safe area meta tags

**➡️ COPY TEMPLATE NÀY CHO TẤT CẢ PAGE MỚI!**

---

*File này là QUY TẮC BẮT BUỘC. Vi phạm = code review reject!*