
# Tóm tắt Dự án etax (Bản mới)

## 1) Yêu cầu ban đầu
- Web chia 2 luồng:
  - **Admin**: đăng nhập bắt buộc, tạo user (MST + MK), nhập thông tin, upload ảnh; trang con admin phải qua `admin-login`.
  - **User**: đăng nhập bằng MST + MK (không email), vào `index.html` và trang con; mỗi MST thấy nội dung/ảnh riêng.
- Ảnh, nội dung **không cố định** trong HTML nữa; quản lý theo MST.
- Chống cache HTML.
- Có **admin-user** giao diện trực quan để upload ảnh, nhập nội dung theo MST, bật/tắt tính năng, đặt link.
- Giữ giao diện user hiện tại, admin nâng cấp.

## 2) Vấn đề bản cũ
- Code lẫn lộn, không tách admin/user.
- Nội dung & ảnh cố định trong HTML.
- Cache HTML cũ sau deploy.
- Đăng nhập chưa theo MST chuẩn.

## 3) Giải pháp bản mới

### 3.1 Kiến trúc thư mục
```
public/
├─ admin/                      # LUỒNG QUẢN TRỊ (mới)
│  ├─ admin-login.html
│  ├─ admin-home.html
│  └─ admin-user.html
│
├─ user/
│  ├─ login.html                # redirect sang login cũ (nếu muốn)
│  └─ index.html                # redirect sang trang chủ cũ (nếu muốn)
│
├─ user_site/                   # Site người dùng cũ
│  └─ ...                       # HTML/CSS/JS hiện có
│
└─ shared/
   └─ js/firebase-init.js       # Cấu hình Firebase
```

### 3.2 Dữ liệu & nội dung
- Firestore: collection `users/{mst}` chứa thông tin người dùng + URL ảnh.
- Storage: `users/{mst}/avatar.png`, `users/{mst}/banner.jpg`, …

### 3.3 Đăng nhập
- MST + MK → map sang email kỹ thuật `MST@etax.local` để dùng Firebase Auth.

### 3.4 Admin-user
- Nhập/sửa hồ sơ MST.
- Upload avatar/banner.
- Tick tính năng + link.
- Tìm nhanh MST.
- Xem trước giao diện user.

### 3.5 Cache HTML
- `firebase.json`:
```json
{
  "hosting": {
    "public": "public",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**/*.html",
        "headers": [
          { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" }
        ]
      }
    ]
  }
}
```

### 3.6 Security Rules
- Firestore:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/$(database)/documents/roles/$(request.auth.uid))
        && get(/databases/$(database)/documents/roles/$(request.auth.uid)).data.role == "admin";
    }
    match /users/{mst} {
      allow read, update: if request.auth != null
        && resource.data.uid == request.auth.uid || isAdmin();
      allow create, delete: if isAdmin();
    }
    match /roles/{uid} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
  }
}
```
- Storage:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null
        && exists(/databases/(default)/documents/roles/$(request.auth.uid))
        && get(/databases/(default)/documents/roles/$(request.auth.uid)).data.role == "admin";
    }
    match /users/{mst}/{allPaths=**} {
      allow read, write: if request.auth != null
        && get(/databases/(default)/documents/users/$(mst)).data.uid == request.auth.uid
        || isAdmin();
    }
  }
}
```

## 4) Checklist terminal

```bash
# B0 - Sao lưu
cp -r public public_backup_$(date +%Y%m%d)

# B1 - Tách thư mục
mkdir -p public/admin public/user public/user_site public/shared/js
# Di chuyển toàn bộ site user cũ vào user_site

# B2 - Thêm admin mới
# Ghi đè admin-login.html, admin-home.html, admin-user.html

# B3 - Firebase init
nano public/shared/js/firebase-init.js
# → Dán config Firebase

# B4 - Redirect user
# login.html & index.html trong /user redirect sang file tương ứng ở user_site

# B5 - Sửa firebase.json (no-cache HTML)
nano firebase.json

# B6 - Gắn rules
nano firestore.rules
nano storage.rules
firebase deploy --only firestore:rules,storage:rules

# B7 - Deploy hosting
firebase deploy --only hosting
```

## 5) Roadmap
- Thêm Cloud Functions tạo tài khoản MST từ admin.
- Chuyển từng trang user sang dữ liệu Firestore theo MST.
