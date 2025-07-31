# 🏗️ CẤU TRÚC LUỒNG CHẠY HỆ THỐNG eTAX MOBILE PWA

**Phiên bản:** v3.5 - Cập nhật ngày 22/07/2025  
**Mục đích:** Tài liệu kỹ thuật chi tiết về kiến trúc và luồng chạy hệ thống  
**Đối tượng:** Developers, System Architects, Technical Team

---

## 📋 **TỔNG QUAN KIẾN TRÚC**

### 🎯 **KIẾN TRÚC TỔNG THỂ**
```
┌─────────────────────────────────────────────────────────────┐
│                     eTAX MOBILE PWA                         │
│                   Kiến trúc 3-Tier                          │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                PRESENTATION LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │USER FRONTEND│  │ADMIN PANEL  │  │PWA SHELL    │         │
│  │             │  │             │  │             │         │
│  │             │  │admin-panel  │  │manifest.json│         │
│  │login.html   │  │-working     │  │sw.js        │         │
│  │index.html   │  │admin-*.html │  │app.js       │         │
│  │modules      │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                BUSINESS LOGIC LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │AUTHENTICATION│ │USER MANAGEMENT│ │PDF PROCESSING│        │
│  │             │  │             │  │             │         │
│  │Pre-Auth     │  │User CRUD    │  │Upload/Parse │         │
│  │OTP System   │  │Profile Mgmt │  │Auto Extract │         │
│  │Session Mgmt │  │Role Control │  │Assignment   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │NOTIFICATIONS│  │CONTENT MGMT │  │SEARCH ENGINE│         │
│  │             │  │             │  │             │         │
│  │System Alerts│  │CMS Editor   │  │Document     │         │
│  │Push Notifs  │  │Templates    │  │Search       │         │
│  │Real-time    │  │Publishing   │  │Filtering    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   DATA ACCESS LAYER                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │FIREBASE DB  │  │FIREBASE     │  │LOCAL        │         │
│  │             │  │STORAGE      │  │STORAGE      │         │
│  │Users        │  │             │  │             │         │
│  │PreAuth      │  │PDF Files    │  │Session Data │         │
│  │PDFs         │  │Images       │  │Cache        │         │
│  │Notifications│  │Assets       │  │Offline Data │         │
│  │Logs         │  │             │  │             │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

## 📊 **SƠ ĐỒ LUỒNG CHÍNH**

```
🔐 ADMIN PANEL → 🚪 PRE-LOGIN → 🔑 LOGIN → 🏠 INDEX → 📱 TRANG CON
```

---

## 🔐 **PHẦN 1: ADMIN PANEL - HỆ THỐNG MODULES**

### **🎛️ ADMIN DASHBOARD: `admin-dashboard.html`**
**🎯 Hub trung tâm cho toàn bộ admin functions:**
```
┌─────────────────────────────────────────────────────────┐
│                  ADMIN DASHBOARD                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │👥 USERS     │  │📄 PDF       │  │✏️ CONTENT   │     │
│  │Management   │  │Management   │  │Creation     │     │
│  │             │  │             │  │             │     │
│  │admin-users  │  │admin-pdf    │  │admin-content│     │
│  │.html        │  │.html        │  │.html        │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │⚙️ SETTINGS  │  │📊 ANALYTICS │  │🔐 SECURITY  │     │
│  │System       │  │Reports      │  │Logs         │     │
│  │             │  │             │  │             │     │
│  │admin-       │  │Built-in     │  │Built-in     │     │
│  │settings.html│  │Dashboard    │  │Features     │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

### **📁 File: `admin-panel-working.html` (Login Gateway)**

**🎯 Chức năng chính:**
- ✅ Admin Authentication Gateway
- ✅ Session Management (24h expiry)
- ✅ Activity Logging & Security
- ✅ Auto redirect to dashboard

**🔄 Workflow Admin Login:**
```
Credentials Check → Session Create → Activity Log → Redirect Dashboard
```

---

## 🚪 **PHẦN 2: PRE-LOGIN (Lớp bảo vệ đầu tiên)**
### **📁 File: `pre-login.html`**

**🔐 3 Bước xác thực:**
```
1️⃣ Nhập MST + Password → 2️⃣ Nhập OTP → 3️⃣ Chuyển đến Login chính
```

**🎯 Demo Accounts:**
- MST: `0123456789` - Pass: `demo123` (Công ty ABC)
- MST: `0987654321` - Pass: `demo456` (Công ty XYZ)  
- MST: `0111222333` - Pass: `demo789` (Công ty DEF)

---

## 🔑 **PHẦN 3: LOGIN CHÍNH** 
### **📁 File: `login.html?preauth=verified`**

**🔒 Xác thực chính:**
- Kiểm tra session từ Pre-login
- Tự động redirect nếu chưa có preauth
- Login với thông tin doanh nghiệp

---

## 🏠 **PHẦN 4: INDEX (Trang chủ chính)**
### **📁 File: `index.html`**

### **📱 HEADER BAR:**
```
🔔 Thông báo → thongbao.html
👤 User Info → thongtin.html (dropdown với icon mũi tên)
```

### **🛠️ SECTION 1: CHỨC NĂNG HAY DÙNG**
```
1️⃣ Tra cứu thông tin người phụ thuộc → tracuttnpt.html
2️⃣ Hồ sơ đăng ký thuế → hddkythue.html  
3️⃣ Hồ sơ quyết toán thuế → (🚧 ĐANG PHÁT TRIỂN)
4️⃣ Tra cứu thông tin quyết toán → (🚧 ĐANG PHÁT TRIỂN)
5️⃣ Tra cứu chứng từ thuế → tra-cuu-chung-tu.html
```

### **🎯 SECTION 2: DANH SÁCH NHÓM DỊCH VỤ**
```
1️⃣ Hóa đơn điện tử → hoadondt.html
   ├── Kê khai tờ khai đăng ký HDĐDT → thaydoittdk.thue
   ├── Tra cứu TNPT → tracuttnpt.html (⚠️ Có vẻ trùng)
   └── Đăng ký thuế → dangky.html

2️⃣ Khai thuế → khaithue.html (4 mục hiển thị)

3️⃣ Đăng ký thuế → dangky.html

4️⃣ Hỗ trợ quyết toán thuế TNCN → ho-tro-qtt.html

5️⃣ Nộp thuế → nopthue.html

6️⃣ Tra cứu nghĩa vụ thuế → nghiavu.html

7️⃣ Tra cứu thông báo → thongbao.html

8️⃣ Tiện ích → tienich.html

9️⃣ Hỗ trợ → hotro.html

🔟 Thiết lập cá nhân → thietlap.html
```

---

## 📄 **PHẦN 5: TRANG CON CHI TIẾT**

### **🔍 Tra cứu chứng từ thuế**
```
tra-cuu-chung-tu.html → Danh sách khách hàng → In chứng từ → PDF Viewer
```
**🎯 Tính năng:**
- Date range picker (giới hạn 1 năm)
- Scroll table hiển thị thông tin
- Xác nhận in → Mở PDF trong native viewer

### **📋 Thông tin chi tiết**  
```
thongtin-chitiet.html → Hiển thị thông tin thuế doanh nghiệp
```

### **🔔 Thông báo**
```
thongbao.html → Danh sách thông báo hệ thống
```

---

## ⚠️ **CÁC TRANG CÓ VẺ TRÙNG LẶP CẦN KIỂM TRA:**

```
🔄 TRÙNG LẶP PHÁT HIỆN:
├── tra-cuu-chung-tu.html vs tracuu-chungtu.html
├── ho-tro-qtt.html vs ho-tro-qtthue.html  
└── tracuttnpt.html (xuất hiện ở 2 nơi khác nhau)
```

---

## 🎨 **TÍNH NĂNG ĐANG CẦN PHÁT TRIỂN:**

### **🏗️ Drag & Drop Interface Builder (Admin Panel)**
```
Tạo Layout → Kéo thả Components → Preview → Deploy to User Pages
```

**🧩 Components cần có:**
- Text Box / Hộp văn bản
- Image Box / Hộp hình ảnh  
- Table / Bảng dữ liệu
- Button / Nút bấm
- Form Fields / Trường nhập liệu
- Grid Layout / Bố cục lưới

### **📱 Mobile PWA Optimizations**
- Service Worker đã có
- Manifest.json đã có
- Responsive design đã có
- Cần thêm: Offline capabilities

---

## 🔥 **WORKFLOW HOÀN CHỈNH:**

```
👨‍💼 ADMIN:
Upload PDF → Parse → Create Content → Assign Customer → Publish

👤 USER:  
Pre-Auth → Login → Index → Browse Services → View Documents → Download PDF
```

---

## 📚 **TẬP TIN HỖ TRỢ HIỆN TẠI:**

```
📁 CSS: etax-template.css, home.css, index.css, styles.css
📁 JS: main.js, etax-rich-editor.js, system-notifications.js  
📁 PWA: service-worker.js, manifest.json
📁 PDF: pdfjs/ (PDF.js library)
📁 Firebase: firebase-config.js, device_auth_manager.js
```

---

**🎯 MỤC TIÊU:** Hệ thống hoàn chỉnh với Admin panel mạnh mẽ, User experience mượt mà, và 100% mobile-first responsive design!

---

*📍 Vị trí file: `C:\Users\Admin\Resilio Sync\Resilio Sync\huong dan ai\CẤU TRÚC LUỒNG CHẠY HỆ THỐNG.md`*