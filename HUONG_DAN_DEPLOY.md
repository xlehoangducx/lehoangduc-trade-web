# 🚀 HƯỚNG DẪN ĐƯA TRANG WEB LÊN `lehoangduc.pages.dev`

Toàn bộ mã nguồn trang Web đã được tạo sẵn đầy đủ trong thư mục:
👉 `D:\WEB_TRADE_BOT`

Bạn có thể đưa lên Cloudflare Pages theo 1 trong 2 cách cực kỳ nhanh dưới đây:

---

## ⚡ CÁCH 1: KÉO THẢ TRỰC TIẾP (NHANH NHẤT - 10 GIÂY XONG NGAY)
1. Trên tab **Cloudflare Pages**, bấm nút **"Upload your static files"** (hoặc quay lại màn hình chọn template).
2. Đặt tên Project là: **`lehoangduc`** (để nhận domain `lehoangduc.pages.dev`).
3. Mở File Explorer trên máy tính, kéo thả toàn bộ thư mục **`D:\WEB_TRADE_BOT`** vào trình duyệt.
4. Bấm nút **"Deploy site"** $\rightarrow$ Trang web sẽ sáng đèn hoạt động ngay lập tức!

---

## 🐙 CÁCH 2: DÙNG GITHUB (TỰ ĐỘNG ĐỒNG BỘ MỖI KHI CÓ CODE MỚI)
1. Tại tab GitHub mà bạn đang mở trong ảnh (`github.com/new`):
   * Bấm nút xanh lá cây **"Create repository"** ở dưới cùng.
2. Màn hình tiếp theo sẽ hiện: *"Get started by creating a new file or uploading an existing file"*.
   * Bấm vào dòng chữ xanh: **`uploading an existing file`**.
   * Kéo thả toàn bộ các file trong `D:\WEB_TRADE_BOT` (`index.html`, `dashboard.html`, thư mục `css`, thư mục `js`,...) vào ô tải lên.
   * Kéo xuống dưới bấm nút xanh **"Commit changes"**.
3. Quay lại màn hình **Cloudflare Pages** (Ảnh 3 lúc nãy):
   * F5 (Tải lại trang) $\rightarrow$ Chọn repository **`lehoangduc-trade-web`** $\rightarrow$ Bấm **Next**.
   * Project name: Gõ **`lehoangduc`**.
   * Bấm **Save and Deploy**.

---

## 🔑 BƯỚC CUỐI CÙNG (RẤT QUAN TRỌNG ĐỂ ĐĂNG NHẬP GOOGLE HOẠT ĐỘNG):
Vào **Firebase Console → Authentication → Settings → Authorized domains**:
* Bấm **Add domain**.
* Thêm domain của bạn vào: **`lehoangduc.pages.dev`**
*(Nếu không thêm bước này, Google Login sẽ chặn không cho đăng nhập).*
