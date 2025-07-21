# NGỮ CẢNH DỰ ÁN - eTAX MOBILE PWA

> 📋 **Mục đích:** Cung cấp context đầy đủ về dự án cho AI sessions
> 
> 🔄 **Cập nhật:** 18/07/2025

---

## 🎯 **THÔNG TIN DỰ ÁN**

### **Tên dự án:** eTax Mobile PWA
### **Mô tả:** Progressive Web App cho hệ thống thuế điện tử Việt Nam
### **Mục tiêu:** Tạo trải nghiệm mobile native-like cho người dùng khai thuế
### **Target audience:** Cá nhân và doanh nghiệp nộp thuế tại Việt Nam

---

## 🏗️ **KIẾN TRÚC TECHNICAL**

### **Frontend Stack:**
- **HTML5:** Semantic markup, PWA manifest
- **CSS3:** Flexbox/Grid, Custom Properties, Mobile-first responsive
- **JavaScript (Vanilla):** ES6+, Async/await, DOM manipulation
- **PWA Features:** Service Worker, Offline support, App-like experience

### **Backend & Database:**
- **Firebase Realtime Database:** Real-time sync, offline support
- **Firebase Auth:** User authentication system
- **Google Apps Script:** Server-side logic và integrations

### **Security Architecture:**
```
🔐 3-Layer Authentication:
1. Token Verification (token-login.html)
2. Device Verification (device_auth_manager.js)  
3. User Login (login.html)
```

### **Deployment:**
- **Firebase Hosting:** PWA deployment
- **Domain:** Custom domain với SSL
- **CDN:** Firebase CDN cho assets

---

## 📱 **PWA FEATURES**

### **Core PWA Capabilities:**
✅ **Installable:** Manifest.json, add to home screen
✅ **Offline-first:** Service worker caching
✅ **Native feel:** Fixed header, controlled scroll
✅ **Cross-platform:** iPhone Safari, Android Chrome
✅ **Responsive:** Mobile-first design
✅ **Performance:** Optimized loading, minimal animations

### **PWA Manifest Configuration:**
```json
{
  "name": "eTax Mobile",
  "short_name": "eTax",
  "theme_color": "#b71c1c",
  "background_color": "#ffffff",
  "display": "standalone",
  "start_url": "./index.html"
}
```

---

## 🗂️ **CẤU TRÚC FILES**

### **Core Files:**
```
📁 eTax Mobile PWA/
├── 📄 index.html              # Main dashboard
├── 📄 login.html              # User authentication
├── 📄 token-login.html        # Token verification
├── 📄 manifest.json           # PWA manifest
├── 📄 .firebaseignore         # Firebase deployment config
│
├── 📁 css/
│   ├── 📄 etax-template.css   # Standardized styles
│   ├── 📄 pwa-statusbar-fix.css # Cross-platform fixes
│   └── 📄 home.css            # Homepage specific styles
│
├── 📁 js/
│   ├── 📄 app.js              # Main application logic
│   ├── 📄 firebase-config.js  # Firebase configuration
│   └── 📄 device_auth_manager.js # Device authentication
│
├── 📁 assets/
│   ├── 📄 logo.png            # App logo
│   ├── 📄 nen.png             # Background image
│   └── 📂 icons/              # Various UI icons
│
├── 📁 huong dan ai/           # Documentation
│   ├── 📄 luồng chạy.md       # Workflow tracking  
│   ├── 📄 ngữ cảnh.md         # This file
│   └── 📄 phong cách ai.md    # AI work style guide
│
└── 📁 child pages/
    ├── 📄 dangky.html         # Tax registration
    ├── 📄 khaithue.html       # Tax declaration
    ├── 📄 hoadondt.html       # E-invoice
    ├── 📄 tienich.html        # Utilities
    ├── 📄 hotro.html          # Support
    └── 📄 [others...]         # Various tax functions
```

---

## 🎨 **UI/UX DESIGN PRINCIPLES**

### **Design System:**
- **Primary Color:** #b71c1c (Deep Red - government standard)
- **Typography:** Roboto, Arial fallback
- **Layout:** Mobile-first, 420px max-width
- **Spacing:** 8px grid system
- **Icons:** Font Awesome 6.5.0

### **Native App-like Experience:**
✅ **Fixed Header:** Always visible navigation
✅ **Controlled Scroll:** No bounce, no black space
✅ **Touch Optimized:** 44px minimum touch targets
✅ **Smooth Transitions:** Disabled for performance
✅ **Consistent Theming:** Across all pages

### **Current Layout Structure (index.html):**
```
📱 Phone Frame (420px max)
├── 🔒 Fixed Header (140px) - Extended to MST level
├── 📄 Scrollable Content
│   ├── 👤 User Info Section (180px)
│   ├── ⭐ Quick Actions (220px) 
│   └── 📋 Service Grid (450px)
└── 🔄 Scroll Container (native app behavior)
```

---

## 🔐 **AUTHENTICATION FLOW**

### **Current Implementation:**
```
🚀 App Start
    ↓
🎫 token-login.html (Token verification)
    ↓ (if valid)
📱 device_auth_manager.js (Device fingerprinting)
    ↓ (if trusted device)
🔑 login.html (User credentials)  
    ↓ (if authenticated)
🏠 index.html (Main dashboard)
```

### **Security Features:**
- Device fingerprinting
- Token-based authentication
- Trusted device management
- Session persistence
- Automatic logout on security events

---

## 📊 **USER PERSONAS**

### **Primary Users:**
1. **Cá nhân nộp thuế:** 
   - Age: 25-65
   - Tech comfort: Medium
   - Usage: Monthly tax declarations

2. **Kế toán doanh nghiệp:**
   - Age: 28-55  
   - Tech comfort: High
   - Usage: Daily operations, multiple accounts

3. **Chủ doanh nghiệp nhỏ:**
   - Age: 30-60
   - Tech comfort: Low-Medium
   - Usage: Quarterly reports, simple operations

---

## 🚀 **PERFORMANCE REQUIREMENTS**

### **Current Benchmarks:**
- **First Contentful Paint:** < 1.5s
- **Time to Interactive:** < 3s
- **Lighthouse Score:** 90+ (Performance)
- **Bundle Size:** < 500KB total
- **Memory Usage:** < 50MB on mobile

### **Optimization Strategies:**
✅ Disabled CSS animations/transitions
✅ Optimized image formats và sizes
✅ Minimal JavaScript frameworks
✅ Lazy loading for non-critical resources
✅ Efficient Firebase queries

---

## 🌍 **BROWSER SUPPORT**

### **Primary Targets:**
- **Mobile Safari:** iOS 12+ (iPhone users)
- **Chrome Mobile:** Android 8+ (Android users)
- **Samsung Internet:** Android devices
- **Desktop Chrome:** Development/testing

### **PWA Compatibility:**
- **iOS:** Add to Home Screen support
- **Android:** Full PWA installation
- **Desktop:** Web app installation

---

## 📈 **BUSINESS CONTEXT**

### **Stakeholders:**
- **Cục Thuế:** Government tax authority
- **Taxpayers:** End users (individuals/businesses)  
- **Development Team:** Internal team
- **IT Department:** Infrastructure support

### **Compliance Requirements:**
- **Vietnamese Tax Law:** Full compliance
- **Data Privacy:** GDPR-equivalent protection
- **Security Standards:** Government-grade security
- **Accessibility:** WCAG 2.1 AA compliance

---

## 🔄 **CURRENT STATE & PROGRESS**

### **Completed Features:**
✅ 3-layer authentication system
✅ Firebase integration
✅ PWA manifest và service worker
✅ Native app-like scroll behavior
✅ Responsive design system
✅ Cross-platform compatibility
✅ Basic tax functions (registration, declaration, etc.)

### **In Progress:**
🔄 Performance optimization
🔄 Advanced PWA features
🔄 Cross-device testing
🔄 Documentation completion

### **Planned Features:**
📋 Offline functionality
📋 Push notifications
📋 Advanced analytics
📋 Multi-language support
📋 Accessibility improvements

---

## 🛠️ **DEVELOPMENT PRACTICES**

### **Code Standards:**
- **Comments:** Tiếng Việt cho clarity
- **Naming:** Descriptive, consistent
- **Structure:** Modular, maintainable
- **Performance:** Mobile-first optimization

### **Testing Strategy:**
- **Manual Testing:** Cross-device compatibility
- **Performance Testing:** Lighthouse audits
- **User Testing:** Real taxpayer feedback
- **Security Testing:** Penetration testing

### **Deployment Process:**
1. Local development với live-server
2. Testing trên multiple devices
3. Firebase deployment
4. Production monitoring

---

## 💡 **LESSONS LEARNED**

### **Technical Insights:**
- PWA scroll behavior requires precise control
- Fixed positioning works better than sticky for mobile
- Performance trumps fancy animations on mobile
- Cross-platform consistency is challenging but achievable

### **User Experience:**
- Native app feel is more important than web-like behavior
- Loading speed affects user trust significantly
- Simple, clear navigation reduces support requests
- Vietnamese language UI improves adoption

### **Process Improvements:**
- Documentation prevents context loss
- Incremental development reduces bugs
- User feedback drives feature priority
- Performance monitoring catches issues early

---

## 🎯 **SUCCESS METRICS**

### **Technical KPIs:**
- Lighthouse Performance Score: >90
- Page Load Time: <2s
- User Session Duration: >5 minutes
- Bounce Rate: <20%

### **Business KPIs:**
- User Adoption Rate: Monthly active users
- Task Completion Rate: Successful tax submissions
- User Satisfaction: Support ticket volume
- Performance Stability: Uptime percentage

### **Current Status:**
✅ Technical foundation complete
✅ Core features implemented  
✅ Performance optimized
🔄 User adoption growing
🔄 Feature expansion ongoing