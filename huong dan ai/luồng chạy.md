# 🚀 LUỒNG CHẠY HỆ THỐNG ETAX MOBILE PWA

**Ngày cập nhật:** 30/07/2025 - 23:59  
**Phiên bản:** v4.0 - Hệ thống quản lý thuế điện tử nâng cao  
**Ngôn ngữ:** 100% Tiếng Việt

---

## 📋 **TỔNG QUAN HỆ THỐNG**

### 🔐 **1. HỆ THỐNG ĐĂNG NHẬP NGƯỜI DÙNG (MỚI)**
- **Tệp chính:** `login.html`
- **Luồng:** Link định danh (Token) → Xác thực MST & Mật khẩu → `index.html` (Ứng dụng chính)
- **Đặc điểm:**
  - Không sử dụng `pre-login.html` và OTP.
  - Link đăng nhập duy nhất cho mỗi user, được tạo bởi Admin.
  - `login.html` xác thực token và chỉ cho phép MST tương ứng đăng nhập.
  - Sau đăng nhập thành công, phiên làm việc được lưu để truy cập trực tiếp lần sau.
  - Tích hợp "Bảng điều khiển Debug" trên `login.html` để theo dõi quá trình xác thực.

### 🏠 **2. ỨNG DỤNG CHÍNH**
- **Tệp chính:** `index.html`
- **Đồng bộ MST & Thông tin:** Thanh bên + Hồ sơ tự động đồng bộ từ dữ liệu `fullName` và các trường khác.
- **Chức năng chính:**
  - 📄 Tra cứu chứng từ (`tra-cuu-chung-tu.html`)
  - 📊 Thông tin nghiệp vụ thuế (`thongtin.html`)
  - 🔔 Thông báo hệ thống (`thongbao.html`)
  - 👤 Hồ sơ người dùng (`hoso.html`)

---

## 🎛️ **HỆ THỐNG QUẢN TRỊ (ADMIN PANEL)**

### 🔧 **3. XÁC THỰC QUẢN TRỊ**
- **Tệp chính:** `admin-panel-working.html`
- **Truy cập:** Đăng nhập quản trị trực tiếp bằng tài khoản hardcode.
- **Đặc điểm:**
  - Không có liên kết về trang chủ eTax.
  - Tài khoản admin được hardcode (ví dụ: `admin_super`, `admin_content`).

### 👥 **4. QUẢN LÝ NGƯỜI DÙNG**
- **Tệp chính:** `admin-users.html`
- **Tính năng:**
  - **Tạo tài khoản mới:** Với các trường `Họ và tên`, `MST`, `Chi cục thuế`, `Địa chỉ`, `Số điện thoại`, `Email`, `Công ty`, `Mật khẩu`.
  - **Backdate:** Cho phép Admin tùy chỉnh "Ngày tạo" và "Giờ tạo" tài khoản.
  - **Link Định danh:** Tự động sinh link đăng nhập duy nhất cho mỗi user.
  - **Quản lý toàn quyền:** "Xem chi tiết", "Khôi phục mật khẩu", "Xóa tài khoản".
  - **Regex MST linh hoạt:** Chấp nhận cả MST có hậu tố `-XXX`.

### 📄 **5. QUẢN LÝ PDF & TÀI LIỆU**
- **Tệp chính:** `admin-pdf.html`
- **Tính năng:**
  - **Upload & Phân tích:** Tự động trích xuất thông tin từ PDF.
  - **Kiểm tra OCR:** Hiển thị toàn bộ nội dung văn bản quét được từ PDF để Admin đối chiếu.
  - **Gán tự động & Xác thực MST:** Bắt buộc quét MST từ PDF, tự động gán cho user tương ứng. Báo lỗi nếu MST không tồn tại hoặc không khớp.
  - **Tự động tạo thông báo:** Sau khi upload PDF thành công, tự động tạo thông báo "Giao dịch nộp thuế" cho user liên quan.

### ✏️ **6. CÔNG CỤ TẠO NỘI DUNG**
- **Tệp chính:** `admin-content.html`
- **Tính năng:**
  - Trình soạn thảo WYSIWYG (CKEditor).
  - Tạo thông báo chung cho toàn hệ thống.
  - **Đã loại bỏ chức năng tạo thông báo cá nhân thủ công.**

### 📝 **7. QUẢN LÝ NGHĨA VỤ THUẾ**
- **Tệp chính:** `admin-nghiavu.html` (MỚI)
- **Tính năng:**
  - Nhập thủ công các khoản nghĩa vụ thuế cho từng user.
  - Giao diện 2 cột với form nhập liệu chi tiết và live preview.

### 🎨 **8. VISUAL DESIGN EDITOR**
- **Tệp chính:** `admin-design.html`
- **Tình trạng:** Đã tạo file, chưa triển khai tính năng cụ thể.

### ⚙️ **9. CÀI ĐẶT & LOGS**
- **Tệp chính:** `admin-settings.html`
- **Tính năng:**
  - Quản lý các cài đặt hệ thống.
  - Xem logs hoạt động.
  - **Đã loại bỏ chức năng quản lý Admin và các tùy chọn liên quan đến OTP.**

---

## 📊 **LUỒNG TÀI LIỆU THUẾ (NGƯỜI DÙNG)**

### 🔍 **10. HỆ THỐNG TÌM KIẾM CHỨNG TỪ**
- **Tệp chính:** `tra-cuu-chung-tu.html`
- **Phạm vi ngày:** Tra cứu trong vòng 2 năm gần nhất (realtime).
- **Tính năng:**
  - Form tìm kiếm với các trường "Từ ngày", "Đến ngày", "Mã tham chiếu".
  - Giao diện form được sắp xếp lại, căn lề trái.
  - Icon lịch có tông màu đỏ hơn.

### 🔔 **11. HỆ THỐNG THÔNG BÁO**
- **Tệp chính:** `thongbao.html`
- **Tính năng:**
  - Hiển thị danh sách thông báo (từ CQT, biến động nghĩa vụ, thông báo khác).
  - Giao diện với khung tabs và thanh tìm kiếm + nút "Nâng cao".
  - Ngày giờ thông báo nằm ngoài khung kẻ, tiêu đề không in đậm.
  - Mỗi thông báo có thể click để xem chi tiết.

### 📄 **12. CHI TIẾT THÔNG BÁO**
- **Tệp chính:** `chi-tiet-thong-bao.html` (MỚI)
- **Tính năng:**
  - Hiển thị chi tiết nội dung thông báo.
  - Bao gồm "Số thông báo" (tạo tự động theo định dạng `ddmmyyHHMMss/yyyy/TB-TDT`), "Ngày thông báo".
  - Có nút "Xem tệp đính kèm".

### 📋 **13. HIỂN THỊ THÔNG TIN TÀI KHOẢN**
- **Tệp chính:** `thongtin.html`
- **Tính năng:** Hiển thị thông tin chi tiết của người dùng (MST, Họ tên, Địa chỉ, Chi cục thuế, SĐT, Email) một cách ổn định và chính xác.

### 📝 **14. HIỂN THỊ NGHĨA VỤ THUẾ**
- **Tệp chính:** `nghiavu.html`
- **Tính năng:**
  - Hiển thị danh sách các khoản nghĩa vụ thuế của người dùng.
  - Pop-up chi tiết hiển thị đầy đủ 15 trường thông tin, bao gồm logic tính toán trạng thái "Còn phải nộp" / "Đã nộp".

---

## 🔄 **LUỒNG HOÀN CHỈNH (CẬP NHẬT)**

### 📍 **HÀNH TRÌNH NGƯỜI DÙNG:**
```
1. Admin tạo User & Link định danh (admin-users.html)
   ↓
2. User click Link ➞ login.html?token=[token]
   ↓ (login.html xác thực token & mật khẩu)
3. index.html (Ứng dụng chính - phiên làm việc được lưu)
   ├─ Tra cứu chứng từ → tra-cuu-chung-tu.html
   ├─ Thông tin tài khoản → thongtin.html
   ├─ Thông báo → thongbao.html → chi-tiet-thong-bao.html
   ├─ Tra cứu nghĩa vụ thuế → nghiavu.html
   └─ Hồ sơ → quản lý hồ sơ
```

### 📍 **LUỒNG QUẢN TRỊ:**
```
1. admin-panel-working.html (Đăng nhập Admin)
   ↓ (Bảng điều khiển quản trị)
2. admin-dashboard.html
   ├─ Quản lý Người dùng → admin-users.html (Tạo, Xem, Sửa, Xóa user, Backdate, Link định danh)
   ├─ Quản lý PDF & Tài liệu → admin-pdf.html (Upload, OCR, Xác thực MST tự động)
   ├─ Tạo Nội dung → admin-content.html (Tạo thông báo chung)
   ├─ Quản lý Nghĩa vụ thuế → admin-nghiavu.html (Nhập nghĩa vụ thuế thủ công, Live Preview)
   ├─ Visual Design Editor → admin-design.html (Chưa triển khai)
   └─ Cài đặt & Logs → admin-settings.html
```

---

## 🔥 **CẤU TRÚC FIREBASE (CẬP NHẬT)**

```
etax-7fbf8/
├── users/ (Người dùng)
│   └── [MST]/
│       ├── fullName (Họ tên đầy đủ)
│       ├── mst (Mã số thuế)
│       ├── taxOffice (Chi cục thuế)
│       ├── address (Địa chỉ)
│       ├── phone (Số điện thoại)
│       ├── email (Email)
│       ├── company (Công ty)
│       ├── password (Mật khẩu)
│       ├── createdAt (Timestamp ngày giờ tạo)
│       ├── status (active/blocked)
│       └── loginLink (Link định danh duy nhất)
├── loginTokens/ (Ánh xạ Token với MST)
│   └── [token_duy_nhat]: { mst: "[MST]" }
├── pdfDocuments/ (Tài liệu PDF đã upload)
│   └── [pdfId]/
│       ├── fileName (Tên tệp)
│       ├── fileSize (Kích thước)
│       ├── uploadTime (Thời gian tải lên)
│       ├── extractedData/ (Dữ liệu trích xuất từ OCR)
│       │   ├── referenceNumber (Mã tham chiếu)
│       │   ├── amount (Số tiền)
│       │   ├── paymentDate (Ngày nộp)
│       │   ├── mst (MST từ PDF)
│       │   └── hour (Giờ từ PDF)
│       └── assignedCustomers/ (Khách hàng được gán)
├── customerPDFs/ (Liên kết PDF với Khách hàng)
│   └── [MST]/
│       └── [pdfId]/
│           ├── assignedAt (Thời gian gán)
│           └── assignedBy (Admin gán)
├── notifications/ (Thông báo hệ thống & cá nhân)
│   └── [notificationId]/
│       ├── title (Tiêu đề)
│       ├── content (Nội dung)
│       ├── type (general/personal)
│       ├── targetUser (MST nếu là personal)
│       ├── publishDate (Ngày xuất bản - có thể backdate)
│       └── backdate (Ngày quá khứ - nếu có)
├── userTaxObligations/ (Nghĩa vụ thuế của người dùng)
│   └── [MST]/
│       └── [obligationId]/
│           ├── doiThue (Đội thuế)
│           ├── loaiNV (Loại NV)
│           ├── tieuMuc (Tiểu mục)
│           ├── soTien (Số tiền)
│           ├── goiYXl (Gợi ý XL)
│           ├── thuTu (Thứ tự)
│           ├── idKhoan (ID khoản)
│           ├── soQDTB (Số QD,TB)
│           ├── ngayQD (Ngày QD)
│           ├── chuong (Chương)
│           ├── ky (Kỳ)
│           ├── diaBan (Địa bàn)
│           ├── hanNop (Hạn nộp)
│           ├── daNop (Đã nộp)
│           └── soTT (Số TT)
└── adminLogs/ (Logs hoạt động của Admin)
    └── [logId]/
        ├── action (Hành động)
        ├── timestamp (Thời gian)
        ├── adminId (Admin thực hiện)
        └── details (Chi tiết)
```

---

## 🔄 **NHẬT KÝ CẬP NHẬT (CHI TIẾT)**

### **Phiên làm việc hiện tại (Từ 21/07/2025 - 20:50 đến nay):**

*   **Đã hoàn thành:**
    *   **Hệ thống Đăng nhập & Xác thực:**
        *   Loại bỏ hoàn toàn `pre-login.html` và logic OTP.
        *   Triển khai đăng nhập bằng Link Định danh (Token) cho người dùng.
        *   Khôi phục giao diện `login.html` và thêm "Bảng điều khiển Debug".
        *   Sửa lỗi chuyển hướng bất thường và lỗi hiển thị tên `undefined` trên `index.html` và `thongtin.html`.
        *   Đảm bảo phiên đăng nhập được lưu trữ để người dùng không cần đăng nhập lại mỗi lần.
    *   **Quản lý Người dùng (`admin-users.html`):**
        *   Thêm chức năng Backdate cho ngày giờ tạo tài khoản.
        *   Bổ sung các chức năng quản lý: Xem chi tiết, Khôi phục mật khẩu, Xóa tài khoản.
        *   Cập nhật Regex MST để nhận diện cả định dạng `-XXX`.
    *   **Quản lý PDF & Tài liệu (`admin-pdf.html`):**
        *   Tích hợp chức năng "Kiểm tra OCR" hiển thị toàn bộ nội dung quét được.
        *   Thay đổi luồng upload: Tự động quét và xác thực MST từ PDF, không cho phép chọn MST thủ công. Báo lỗi nếu MST không tồn tại/không khớp.
        *   Cập nhật Regex MST để nhận diện cả định dạng `-XXX` trong PDF.
    *   **Quản lý Thông báo (`admin-content.html`, `thongbao.html`, `chi-tiet-thong-bao.html`):**
        *   Loại bỏ chức năng tạo thông báo cá nhân thủ công trong `admin-content.html`.
        *   Nâng cấp `thongbao.html`: Khôi phục giao diện tabs, thanh tìm kiếm, và tinh chỉnh hiển thị thông báo (ngày giờ ngoài khung, tiêu đề không in đậm).
        *   Tạo trang `chi-tiet-thong-bao.html` để hiển thị chi tiết thông báo với số thông báo tự động.
    *   **Quản lý Nghĩa vụ thuế (`admin-nghiavu.html`, `nghiavu.html`):**
        *   Tạo trang `admin-nghiavu.html` cho Admin nhập nghĩa vụ thuế với live preview.
        *   Xây dựng trang `nghiavu.html` cho người dùng xem danh sách nghĩa vụ và chi tiết pop-up.
    *   **Tra cứu Chứng từ (`tra-cuu-chung-tu.html`):**
        *   Cập nhật logic thời gian (giới hạn 2 năm, realtime).
        *   Tinh chỉnh giao diện form tìm kiếm (căn lề, icon lịch đỏ hơn).

*   **Các vấn đề đã được giải quyết:**
    *   Lỗi chuyển hướng về `pre-login.html` hoặc `token-login.html` sau khi đăng nhập.
    *   Lỗi hiển thị tên `undefined` và nhấp nháy trên `index.html`.
    *   Lỗi không nhận diện được MST có định dạng `-XXX` trong PDF.
    *   Lỗi không hiển thị toàn bộ nội dung OCR khi upload PDF.
    *   Lỗi giao diện `thongbao.html` bị mất các thành phần.

*   **Các hạng mục đang chờ kiểm tra/test:**
    *   **Toàn bộ luồng đăng nhập và quản lý người dùng mới:** Cần anh Nghĩa kiểm tra lại kỹ lưỡng để đảm bảo mọi thứ hoạt động ổn định và không có lỗi phát sinh.
    *   **Luồng upload PDF với OCR và xác thực MST tự động:** Cần anh Nghĩa test với các file PDF thực tế để đảm bảo tính chính xác của việc trích xuất và đồng bộ dữ liệu.
    *   **Luồng thông báo và nghĩa vụ thuế:** Cần kiểm tra hiển thị và tương tác của người dùng.

*   **Các hạng mục còn lại (Chưa thực hiện):**
    1.  **Dữ liệu "List Chuẩn" cho Địa chỉ & Cơ quan Thuế:**
        *   **Tình trạng:** Cần dữ liệu chuẩn (Excel/JSON) về các đơn vị hành chính và cơ quan thuế để tích hợp vào form tạo người dùng trong `admin-users.html`.
        *   **Hỗ trợ cần thiết:** Anh cung cấp file dữ liệu để Phong hướng dẫn anh import lên Firebase.
    2.  **Hoàn thiện `admin-design.html` (Visual Design Editor):**
        *   **Tình trạng:** Module đã tạo nhưng chưa triển khai tính năng.
        *   **Hỗ trợ cần thiết:** Anh cung cấp yêu cầu chi tiết về các chức năng mong muốn.
    3.  **UI/UX "Clone" cho `tra-cuu-chung-tu.html`:**
        *   **Tình trạng:** Anh đã gửi đường dẫn ảnh, nhưng Phong không thể truy cập trực tiếp.
        *   **Hỗ trợ cần thiết:** Anh mô tả chi tiết giao diện hoặc cung cấp link công khai đến hình ảnh.
    4.  **Chức năng "Nút chn để chonfile a đòn" trong `tra-cuu-chung-tu.html`:**
        *   **Tình trạng:** Chức năng này vẫn chưa rõ ràng.
        *   **Hỗ trợ cần thiết:** Anh vui lòng giải thích chi tiết hơn về chức năng và mục đích của nút này.

---

Anh Nghĩa cứ xem xét bản tổng hợp này nhé. Khi nào anh sẵn sàng, chúng ta sẽ tiếp tục công việc. Phong luôn ở đây để hỗ trợ anh.