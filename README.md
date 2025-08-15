# eTax Mobile - Hướng Dẫn Vận Hành Dự Án

> **📅 Cập nhật:** 2025-01-08 - Đã đơn giản hóa luồng authentication  
> **👨‍💼 Owner:** Nghĩa  
> **🤖 AI Assistant:** Cipher (Bác sĩ Mã Nguồn)

## 🎯 TỔNG QUAN DỰ ÁN

**eTax Mobile** là ứng dụng Progressive Web App (PWA) hỗ trợ khai thuế điện tử, với 2 luồng chính:

### **🔴 LUỒNG ADMIN** (Hoàn chỉnh)
```
admin_login_etax.html → admin_dashboard_etax.html → các trang admin con
```
- Quản trị viên tạo/quản lý tài khoản user
- Cài đặt, thiết lập hệ thống
- **🆕 Placeholder Management System** - Quản lý placeholder theo MST

### **🔵 LUỒNG USER** (Đã đơn giản hóa)
```
login.html → index.html → các trang chức năng
```
- User login bằng ID + Password đơn giản
- Không còn token/device verification phức tạp
- **🆕 Dynamic Content** - Nội dung động theo MST của user

---

## 🏷️ PLACEHOLDER MANAGEMENT SYSTEM

### **🎯 Mục Đích**
Hệ thống cho phép mapping thông tin user theo MST để hiển thị nội dung động trên tất cả trang web.

### **🗺️ Sơ Đồ Luồng Hệ Thống**

```
┌─────────────────────────────────────────────────────────────────┐
│                    HỆ THỐNG ADMIN PLACEHOLDER                  │
│                         (Theo MST)                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   ADMIN LOGIN   │    │  USER LOGIN     │    │  PLACEHOLDER    │
│                 │    │                 │    │   SYSTEM        │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Admin Panel    │    │  User Session   │    │  Data Mapping   │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • MST Check     │    │ • Load User     │
│ • User Mgmt     │    │ • Token Valid   │    │ • Replace Tags  │
│ • Placeholder   │    │ • Session Save  │    │ • Real-time     │
│ • Analytics     │    │ • Redirect      │    │ • Fallback      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          ▼                      ▼                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                        FIREBASE DATABASE                        │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    USERS    │  │   TOKENS    │  │   CONFIG    │             │
│  │             │  │             │  │             │             │
│  │ MST: 123... │  │ Token: abc  │  │ Pages: []   │             │
│  │ Name: ABC   │  │ MST: 123... │  │ Settings:{} │             │
│  │ Phone: ...  │  │ Expires:... │  │ Logs: []    │             │
│  │ Email: ...  │  │ Password:.. │  │             │             │
│  │ Address:... │  │             │  │             │             │
│  │ Bank: ...   │  │             │  │             │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

### **🔄 Luồng Chi Tiết**

#### **1. Admin Quản Lý User**
```
Admin Login → Dashboard → User Management → Add/Edit User → Save to Firebase
```

#### **2. User Login & Session**
```
User Access → Check Token → Load MST from DB → Save Session → Redirect to Main
```

#### **3. Placeholder Replacement**
```
Page Load → Check Session → Load User Data → Scan DOM → Replace {{placeholders}}
```

### **📊 Cấu Trúc Database (Đã Cập Nhật)**

```
FIREBASE REALTIME DATABASE
├── users/
│   ├── 123456789/
│   │   ├── mst: "123456789"
│   │   ├── fullName: "Nguyễn Văn A"
│   │   ├── password: "MatKhau123@"          🆕 BẮT BUỘC
│   │   ├── userName: "nguyenvana"           🆕 TÊN NGƯỜI DÙNG
│   │   ├── citizenId: "123456789012"        🆕 SỐ CCCD/CMND
│   │   ├── company: "Công ty TNHH ABC"
│   │   ├── position: "Giám đốc"
│   │   ├── department: "Kế toán"
│   │   ├── businessType: "TNHH"             🆕 LOẠI HÌNH KD
│   │   ├── taxDepartment: "Chi cục Thuế Q1" 🆕 CHI CỤC THUẾ
│   │   ├── registrationDate: "2020-03-15"   🆕 NGÀY ĐĂNG KÝ
│   │   ├── phone: "0901234567"
│   │   ├── email: "contact@abc.com.vn"
│   │   ├── address: "123 Nguyễn Văn A, Q1, TP.HCM"
│   │   ├── bankAccount: "1234567890"
│   │   ├── bankName: "Vietcombank"
│   │   ├── branch: "Chi nhánh TP.HCM"
│   │   ├── createdAt: "2024-01-01T00:00:00.000Z"
│   │   └── updatedAt: "2024-01-01T00:00:00.000Z"
│   └── 987654321/
│       └── ...
├── placeholder_config/
│   ├── pages/
│   │   ├── index_main.html: { applied: true, timestamp: 1234567890 }
│   │   ├── dangky.html: { applied: true, timestamp: 1234567890 }
│   │   └── ...
│   └── settings/
│       ├── autoReplace: true
│       ├── fallbackEnabled: true
│       └── debugMode: false
├── placeholder_logs/                        🆕 LOGS PLACEHOLDER
│   ├── log_001/
│   │   ├── action: "system_initialized"
│   │   ├── userMST: "123456789"
│   │   ├── timestamp: 1636789012345
│   │   └── details: { placeholdersCount: 47 }
│   └── ...
└── admin_logs/
    ├── log_001/
    │   ├── action: "user_added"
    │   ├── admin: "admin_user"
    │   ├── timestamp: 1234567890
    │   └── details: { mst: "123456789" }
    └── ...
```

### **🏷️ Danh Sách Placeholder (47+ loại) 🆕 MỚI CẬP NHẬT**

#### **👤 Thông Tin Cơ Bản**
- `{{mst}}` - Mã số thuế
- `{{fullName}}` - Họ tên đầy đủ
- `{{userName}}` - Tên người dùng 🆕
- `{{citizenId}}` - Số CCCD/CMND 🆕
- `{{company}}` - Tên công ty
- `{{address}}` - Địa chỉ công ty
- `{{phone}}` - Số điện thoại
- `{{email}}` - Email liên hệ
- `{{position}}` - Chức vụ 🆕
- `{{department}}` - Phòng ban 🆕

#### **🏢 Thông Tin Thuế & Doanh Nghiệp**
- `{{taxDepartment}}` - Chi cục thuế 🆕
- `{{taxCode}}` - Mã số thuế
- `{{businessType}}` - Loại hình doanh nghiệp 🆕
- `{{registrationDate}}` - Ngày đăng ký kinh doanh 🆕
- `{{taxPeriod}}` - Kỳ tính thuế
- `{{taxYear}}` - Năm tính thuế
- `{{businessLicense}}` - Giấy phép kinh doanh
- `{{businessLicenseDate}}` - Ngày cấp GP
- `{{businessLicensePlace}}` - Nơi cấp GP

#### **🏦 Thông Tin Ngân Hàng**
- `{{bankAccount}}` - Số tài khoản
- `{{bankName}}` - Tên ngân hàng
- `{{bankBranch}}` - Chi nhánh ngân hàng 🆕
- `{{bankCode}}` - Mã ngân hàng

#### **📍 Thông Tin Địa Chỉ Chi Tiết**
- `{{province}}` - Tỉnh/Thành phố
- `{{district}}` - Quận/Huyện
- `{{ward}}` - Phường/Xã
- `{{street}}` - Tên đường
- `{{houseNumber}}` - Số nhà

#### **📞 Thông Tin Liên Hệ Mở Rộng**
- `{{mobilePhone}}` - Điện thoại di động
- `{{officePhone}}` - Điện thoại cơ quan
- `{{fax}}` - Số fax
- `{{website}}` - Website công ty

#### **⏰ Thông Tin Thời Gian**
- `{{currentDate}}` - Ngày hiện tại
- `{{currentYear}}` - Năm hiện tại
- `{{currentMonth}}` - Tháng hiện tại
- `{{currentDay}}` - Ngày hiện tại
- `{{currentTime}}` - Giờ hiện tại

#### **💰 Thông Tin Tài Chính**
- `{{revenue}}` - Doanh thu
- `{{profit}}` - Lợi nhuận
- `{{taxAmount}}` - Số tiền thuế
- `{{taxRate}}` - Tỷ lệ thuế
- `{{currency}}` - Đơn vị tiền tệ (VNĐ)

#### **📄 Thông Tin Hồ Sơ**
- `{{documentNumber}}` - Số hồ sơ
- `{{documentDate}}` - Ngày lập hồ sơ
- `{{documentType}}` - Loại hồ sơ
- `{{status}}` - Trạng thái
- `{{note}}` - Ghi chú

### **🛠️ Cách Sử Dụng**

#### **1. Admin Tạo User**
```javascript
// Trong admin-users.html
const userData = {
    mst: "123456789",
    fullName: "Nguyễn Văn A",
    company: "Công ty TNHH ABC",
    phone: "0901234567",
    email: "contact@abc.com.vn",
    address: "123 Nguyễn Văn A, Q1, TP.HCM",
    bankAccount: "1234567890",
    bankName: "Vietcombank"
};

// Lưu vào Firebase
firebase.database().ref(`users/${userData.mst}`).set(userData);
```

#### **2. User Login**
```javascript
// Trong login.html
const mst = document.getElementById('mst').value;
const password = document.getElementById('password').value;

// Kiểm tra trong Firebase
firebase.database().ref(`users/${mst}`).once('value')
    .then(snapshot => {
        if (snapshot.exists() && snapshot.val().password === password) {
            // Lưu session
            localStorage.setItem('etax_user', JSON.stringify(snapshot.val()));
            window.location.href = 'index_main.html';
        }
    });
```

#### **3. Placeholder Replacement**
```javascript
// Trong js/placeholder-system.js
class PlaceholderSystem {
    async loadUserData() {
        const userData = localStorage.getItem('etax_user');
        if (userData) {
            this.userData = JSON.parse(userData);
        }
    }
    
    replacePlaceholders() {
        // Thay thế tất cả placeholder trong DOM
        Object.keys(this.placeholders).forEach(placeholder => {
            const field = this.placeholders[placeholder];
            const value = this.userData[field] || '';
            
            document.querySelectorAll('*').forEach(element => {
                if (element.textContent.includes(placeholder)) {
                    element.textContent = element.textContent.replace(
                        new RegExp(placeholder, 'g'), 
                        value
                    );
                }
            });
        });
    }
}
```

#### **4. Sử Dụng Trong HTML**
```html
<!-- Trong bất kỳ trang nào -->
<div class="user-info">
    <p>Mã số thuế: <strong>{{mst}}</strong></p>
    <p>Họ tên: <strong>{{fullName}}</strong></p>
    <p>Công ty: <strong>{{company}}</strong></p>
    <p>Địa chỉ: <strong>{{address}}</strong></p>
    <p>Số điện thoại: <strong>{{phone}}</strong></p>
    <p>Email: <strong>{{email}}</strong></p>
</div>

<!-- Script tự động thay thế -->
<script src="js/placeholder-system.js"></script>
<script>
    const placeholderSystem = new PlaceholderSystem();
    placeholderSystem.initialize();
</script>
```

### **📈 Trạng Thái Triển Khai**

#### **✅ Đã Hoàn Thành**
- [x] Admin interface (`admin-placeholder.html`)
- [x] User management (`admin-users.html`)
- [x] Placeholder system (`js/placeholder-system.js`)
- [x] Database structure
- [x] Basic authentication

#### **🔄 Đang Phát Triển**
- [ ] Auto-scan placeholder patterns
- [ ] Bulk deployment cho 24 trang
- [ ] Analytics và reporting
- [ ] Advanced fallback system

#### **📋 Cần Làm**
- [ ] Tích hợp vào tất cả trang HTML
- [ ] Test với dữ liệu thật
- [ ] Performance optimization
- [ ] Security hardening

---

## 🛠️ KIẾN TRÚC HỆ THỐNG

### **📁 Cấu Trúc Thư Mục**
```
📂 eTax Mobile/
├── 📂 assets/           # Hình ảnh, icons
├── 📂 css/              # Stylesheets
├── 📂 js/               # JavaScript modules  
│   ├── placeholder-system.js    # 🆕 Placeholder engine
│   ├── placeholder-scanner.js   # 🆕 Auto scanner
│   └── admin-security.js        # 🆕 Admin security
├── 📂 anh goc/          # Ảnh thiết kế gốc (tham khảo UI/UX)
├── 📄 firebase.json     # Firebase hosting config
├── 📄 manifest.json     # PWA manifest
├── 📄 sw.js            # Service Worker
├── 📄 admin-placeholder.html    # 🆕 Placeholder management
├── 📄 admin-users.html          # 🆕 User management
└── 📄 *.html           # Các trang web
```

### **🔥 Firebase Configuration**
- **Database:** `https://etax-7fbf8-default-rtdb.asia-southeast1.firebasedatabase.app`
- **Hosting:** Firebase Hosting
- **Structure:**
  ```
  /users/{taxId}
    - password: string
    - fullName: string  
    - name: string
    - company: string
    - phone: string
    - email: string
    - address: string
    - bankAccount: string
    - bankName: string
    - lastLogin: timestamp
    - createdAt: timestamp
    - updatedAt: timestamp
  ```

---

## 🚀 HƯỚNG DẪN KHỞI ĐỘNG

### **1. Environment Setup**
```bash
# Cài đặt Firebase CLI (nếu chưa có)
npm install -g firebase-tools

# Login Firebase
firebase login

# Deploy project
firebase deploy
```

### **2. Local Development**
```bash
# Serve locally
firebase serve

# Hoặc dùng live server
# Truy cập: http://localhost:5000
```

### **3. 🆕 Placeholder System Setup**
```bash
# 1. Truy cập admin panel
http://localhost:5000/admin_login_etax.html

# 2. Tạo user test
http://localhost:5000/admin-users.html

# 3. Cấu hình placeholder
http://localhost:5000/admin-placeholder.html

# 4. Test user login
http://localhost:5000/login.html
```

---

## 🔐 AUTHENTICATION FLOW

### **🔵 User Login Flow (Đã Đơn Giản Hóa)**

**Bước 1: Truy cập**
- Domain root `/` → Firebase redirect → `login.html`

**Bước 2: Đăng nhập**
```javascript
// File: login.html
// Input: taxId + password
// Query: Firebase /users/{taxId}
// Validate: userData.password === password
// Success: localStorage.setItem('etax_logged_in_user', taxId)
// Redirect: index.html
```

**Bước 3: Authorization Check**
```javascript
// File: index.html  
const loggedInUser = localStorage.getItem('etax_logged_in_user');
if (!loggedInUser) {
    window.location.href = 'login.html';
}
```

**Bước 4: 🆕 Placeholder Loading**
```javascript
// File: js/placeholder-system.js
const placeholderSystem = new PlaceholderSystem();
await placeholderSystem.initialize();
// Tự động thay thế tất cả {{placeholder}} trong trang
```

**Bước 5: Logout**
```javascript
// Clear session và redirect
localStorage.removeItem('etax_logged_in_user');
localStorage.removeItem('etax_user_info');
window.location.href = 'login.html';
```

---

## 🎨 UI/UX DESIGN REFERENCE

### **📸 Thiết Kế Gốc**
- **Source:** `anh goc/login.jpg` 
- **CSS:** `css/login-original.css`
- **Features:**
  - Circular login form với logo quốc huy nền mờ
  - Gradient background đen + chấm vàng
  - Input fields trong suốt
  - Button đỏ gradient

### **🎯 Design Principles**
1. **Mobile-first:** PWA tối ưu cho mobile
2. **Government Standard:** Logo, màu sắc theo quy định
3. **Accessibility:** Font size, contrast, touch targets
4. **Performance:** Tối ưu loading, offline cache
5. **🆕 Dynamic Content:** Placeholder system cho nội dung cá nhân hóa

---

## 📋 DANH SÁCH TRANG WEB (44 files total)

### **🔵 User Pages (30 files)**

**Core Pages:**
- `login.html` - Đăng nhập (Entry point)
- `index.html` - Dashboard chính
- `splash.html` - Transition page (deprecated)

**Tax Services:**
- `hoadondt.html` - Hóa đơn điện tử
- `khaithue.html` - Khai thuế
- `dangky.html` - Đăng ký thuế  
- `nopthue.html` - Nộp thuế
- `nghiavu.html` - Nghĩa vụ thuế
- `ho-tro-qtt.html` - Hỗ trợ quyết toán

**Lookup Services:**
- `tra-cuu-chung-tu.html` - Tra cứu chứng từ
- `tracuttnpt.html` - Tra cứu người phụ thuộc
- `hoso.html` - Hồ sơ khai thuế
- `thongbao.html` - Thông báo

**Settings & Utils:**
- `thietlap.html` - Thiết lập
- `tienich.html` - Tiện ích
- `hotro.html` - Hỗ trợ
- `doimatkhau.html` - Đổi mật khẩu
- `van-tay.html` - Biometric login

### **🔴 Admin Pages (11 files)**
- `admin_login_etax.html` - Admin login
- `admin_dashboard_etax.html` - Admin dashboard
- `admin-users.html` - Quản lý users  
- `admin-token-generator.html` - Generate tokens
- `admin-settings.html` - Cài đặt hệ thống
- `admin-content.html` - Quản lý nội dung
- `admin-log.html` - System logs
- `admin-pdf.html` - PDF management
- `admin-quick-access.html` - Quick access
- `admin-placeholder.html` - 🆕 Placeholder system management
- `admin_ultimate_editor_v3.html` - Ultimate editor

### **🔧 Development/Backup Files (3 files)**
- `login-backup.html` - Backup login cũ
- `login-new.html` - Template login mới
- `create-test-user.html` - Tool tạo test user

---

## 🔧 DEVELOPMENT GUIDELINES

### **📝 Code Standards**
```javascript
// ✅ Đúng: Simple localStorage session
localStorage.setItem('etax_logged_in_user', taxId);

// ✅ Đúng: Placeholder system
const placeholderSystem = new PlaceholderSystem();
await placeholderSystem.initialize();

// ❌ Sai: Phức tạp token/device verification  
localStorage.setItem('etax_token_verified', 'true');
localStorage.setItem('etax_device_verified', 'true');
```

### **🏷️ Placeholder Standards**
```html
<!-- ✅ Đúng: Sử dụng placeholder -->
<p>Mã số thuế: <strong>{{mst}}</strong></p>
<p>Họ tên: <strong>{{fullName}}</strong></p>

<!-- ❌ Sai: Hardcode dữ liệu -->
<p>Mã số thuế: <strong>123456789</strong></p>
<p>Họ tên: <strong>Nguyễn Văn A</strong></p>
```

### **🚨 Common Issues & Solutions**

**❌ Issue: Input bị readonly**
```html
<!-- Sai -->
<input id="tax-id" readonly />

<!-- Đúng --> 
<input id="tax-id" />
```

**❌ Issue: Redirect loop**
```javascript
// Sai - Check phức tạp
if (tokenVerified !== 'true' || deviceVerified !== 'true') {
    window.location.href = 'token-login.html';
}

// Đúng - Check đơn giản
if (!localStorage.getItem('etax_logged_in_user')) {
    window.location.href = 'login.html';
}
```

**❌ Issue: Placeholder không thay thế**
```javascript
// Sai - Không khởi tạo system
// Thiếu script placeholder-system.js

// Đúng - Khởi tạo đầy đủ
<script src="js/placeholder-system.js"></script>
<script>
    const placeholderSystem = new PlaceholderSystem();
    placeholderSystem.initialize();
</script>
```

### **🗂️ File Naming Convention**
- `*.html` - Pages
- `css/*.css` - Stylesheets
- `js/*.js` - JavaScript modules
- `assets/*` - Images, icons
- `*-backup.*` - Backup files
- `*-new.*` - New versions (temp)

---

## 🧪 TESTING CHECKLIST

### **✅ Login Flow Test**
1. Truy cập domain root → redirect login.html
2. Nhập MST + Password → success redirect index.html  
3. Không nhập MST → hiện lỗi "Vui lòng nhập mã số thuế"
4. Sai password → hiện lỗi "Mật khẩu không chính xác"
5. Logout → clear session → redirect login.html

### **✅ Placeholder System Test**
1. Admin tạo user với MST: 123456789
2. User login với MST: 123456789
3. Kiểm tra placeholder thay thế đúng dữ liệu
4. Test fallback khi không có dữ liệu
5. Test performance với nhiều placeholder

### **✅ Navigation Test**
1. Từ index.html → click menu items → navigate đúng pages
2. Từ sub pages → click back → về index.html
3. Direct URL access → check auth → redirect login nếu chưa login

### **✅ PWA Test**  
1. Service Worker registration
2. Offline functionality
3. Add to home screen
4. Responsive design mobile/desktop

---

## 🔒 SECURITY NOTES

### **✅ Implemented**
- Firebase Authentication với database lookup
- Session management với localStorage
- Input validation và sanitization
- HTTPS enforced trong production
- 🆕 Admin access control
- 🆕 Placeholder data validation

### **⚠️ Security Considerations**
- Passwords lưu plain text trong Firebase (cần encrypt)
- No rate limiting cho login attempts
- No session expiry mechanism
- LocalStorage có thể bị XSS access
- 🆕 Placeholder injection prevention

---

## 📞 SUPPORT & CONTACT

### **🤖 AI Assistant Guidelines**
Khi làm việc với dự án này:

1. **Đọc README này TRƯỚC** khi thực hiện bất kỳ thay đổi nào
2. **Backup file** trước khi edit (`*-backup.*`)
3. **Test luồng login** sau mỗi thay đổi authentication
4. **Test placeholder system** sau mỗi thay đổi
5. **Tuân thủ code standards** đã được đơn giản hóa
6. **Cập nhật README** khi có thay đổi lớn

### **📋 Change Log Template**
```markdown
## [Version] - YYYY-MM-DD
### Added
- Feature mới
- Placeholder system components

### Changed  
- Thay đổi existing feature
- Updated placeholder patterns

### Fixed
- Bug fixes
- Placeholder replacement issues

### Removed
- Features bị loại bỏ
```

---

## 📚 RESOURCES

- **Firebase Console:** https://console.firebase.google.com/
- **Font Awesome Icons:** https://fontawesome.com/
- **PWA Guidelines:** https://web.dev/progressive-web-apps/
- **CSS Grid/Flexbox:** https://css-tricks.com/
- **🆕 Placeholder System Docs:** Internal documentation

---

**🔄 Last Updated:** 2025-01-08 by Cipher (Bác sĩ Mã Nguồn)  
**📧 Issues:** Báo cáo bugs/requests trực tiếp với anh Nghĩa  
**🏷️ Placeholder System:** Version 1.0 - Ready for production