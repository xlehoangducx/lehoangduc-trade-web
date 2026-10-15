# 🔒 Cấu Hình Firestore Security Rules

Vào **Firebase Console → Firestore Database → tab Rules**, xóa hết và dán đoạn mã này vào:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Hàm kiểm tra Super Admin
    function isAdmin() {
      return request.auth != null && 
        (request.auth.token.email == "xlehoangducx@gmail.com" || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin");
    }

    // Collection users: Quản lý thành viên & phân quyền
    match /users/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if isAdmin() || (request.auth != null && request.auth.uid == userId);
      allow delete: if isAdmin();
    }

    // Collection bots_telemetry: Dữ liệu Lãi/Lỗ & Trạng thái Bot từ máy tính (Client) gửi lên
    match /bots_telemetry/{userId} {
      allow read: if request.auth != null;
      allow write: if true;
    }

    // Collection bot_commands: Điều khiển Bật / Tắt / Đổi cấu hình Bot từ Web
    match /bot_commands/{userId} {
      allow read, write: if true;
    }
  }
}
```

Bấm nút **Publish** (Xuất bản) để kích hoạt bảo mật.
