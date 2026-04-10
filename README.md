# 🎮 NetBite - Gaming Cafe Food App

NetBite là một ứng dụng web hiện đại được thiết kế dành riêng cho các quán Gaming Cafe (Cyber Core), cho phép khách hàng đặt món ăn và nước uống ngay tại máy với giao diện đậm chất "Gaming" và trải nghiệm mượt mà.

---

## 🚀 Hướng dẫn khởi chạy nhanh

Để chạy dự án này trên máy cục bộ, bạn chỉ cần thực hiện các bước sau:

**1. Clone dự án:**
```bash
git clone <github-url-cua-ban>
cd netbite_app
```

**2. Cài đặt các thư viện cần thiết:**
```bash
npm install
```

**3. Khởi chạy dự án (Cả Frontend và Backend giả lập):**
```bash
npm run dev:all
```
*Sau đó, mở trình duyệt và truy cập: `http://localhost:5173`*

---

## ✨ Tính năng đã hoàn thiện

Dự án hiện đã triển khai các chức năng cốt lõi sau:

### 1. Giao diện người dùng (User Interface)
- **Thiết kế Gaming Đặc trưng**: Sử dụng hệ thống màu Dark-Mode với các điểm nhấn Neon, hiệu ứng Glassmorphism và chuyển động mượt mà.
- **Hot Combos**: Khu vực làm nổi bật các gói ưu đãi với hiệu ứng "nhảy" Card và viền màu thay đổi theo chủ đề.
- **Hệ thống Badge**: Tự động đánh dấu các món "Best Seller" hoặc "Pro Choice" tùy theo cấu hình dữ liệu.

### 2. Thực đơn & Đặt món (Menu & Ordering)
- **Lọc & Sắp xếp**: Tìm kiếm món ăn theo tên, lọc theo danh mục (Mì, Đồ uống, Món chính...) và sắp xếp theo giá cả hoặc độ phổ biến.
- **Hệ thống Topping 3 cấp độ**: 
    - *Level Selector*: Chọn cấp độ cay (0-7), mức đá/đường.
    - *Binary Option*: Thêm thạch, thêm sốt (Checkbox).
    - *Quantifiable*: Thêm trứng, thêm phô mai với nút tăng giảm số lượng.
- **Giỏ hàng real-time**: Tự động tính toán tổng tiền dựa trên giá gốc, giá combo và phụ phí topping.

### 3. Quản trị viên (Admin Portal)
- **Dashboard**: Thống kê nhanh số lượng đơn hàng và doanh thu.
- **Quản lý đơn hàng**: Theo dõi danh sách đơn hàng chi tiết, trạng thái thanh toán và thông tin khách hàng.

---

## 🛠 Công nghệ sử dụng (Tech Stack)

| Công nghệ | Vai trò & Giải thích ngắn gọn |
| :--- | :--- |
| **React 19** | Thư viện chính để xây dựng giao diện người dùng theo dạng component. |
| **Vite** | Công cụ build dự án thế hệ mới, giúp quá trình phát triển (hot reload) cực nhanh. |
| **Tailwind CSS** | Framework CSS giúp thiết kế giao diện Gaming rực rỡ bằng các utility class mà không cần viết CSS thuần. |
| **PostCSS** | Công cụ xử lý CSS (được Tailwind sử dụng), giúp tự động thêm tiền tố (prefix) để giao diện hiển thị tốt trên mọi trình duyệt. |
| **JSON Server** | Giả lập một REST API hoàn chỉnh bằng file `db.json` để quản lý sản phẩm và đơn hàng. |
| **Axios** | Thư viện để gửi yêu cầu (request) lấy dữ liệu từ Backend lên giao diện. |

---

## 📂 Cấu trúc dự án sơ lược

- `/src/pages`: Chứa các trang chính (Home, Menu, ProductDetail, Admin).
- `/src/components`: Các thành phần giao diện dùng chung (Navbar, Layout).
- `/src/services`: Nơi xử lý các lệnh gọi API.
- `/mock-data/db.json`: "Cơ sở dữ liệu" lưu trữ thực đơn và thông tin đơn hàng.

