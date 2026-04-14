# 🎮 NetBite - Kiến trúc Hệ thống Food Gaming Ecosystem

NetBite là một giải pháp quản lý và đặt món ăn chuyên biệt cho các phòng máy cao cấp. Ứng dụng mang đến trải nghiệm "Native Gaming" với tốc độ xử lý nhanh, giao diện Dark-Mode huyền bí và hệ thống quản trị mạnh mẽ.

---

## 🏗 Kiến trúc Dự án (Architecture)

Dự án được xây dựng theo mô hình **Single Page Application (SPA)** với các thành phần chính:

| Lớp (Layer) | Công nghệ chính | Chức năng |
| :--- | :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite | Xử lý giao diện, trạng thái giỏ hàng và điều hướng. |
| **Styling** | Tailwind CSS | Xử lý giao diện đáp ứng (Responsive) và giao diện Gaming. |
| **State Management** | React Context API | Quản lý giỏ hàng (`CartContext`) và trạng thái xác thực. |
| **Routing** | React Router DOM | Quản lý hệ thống đường dẫn linh hoạt (User & Admin). |
| **API Layer** | Axios | Giao tiếp với Backend thông qua các module API chuyên biệt. |
| **Mock Backend** | JSON Server | Hệ thống giả lập Database & REST API trên cổng 8888. |

---

## ✨ Các Phân hệ Tính năng (Modules)

### 1. Phân hệ Khách hàng (Client Side)
Hệ thống được tối ưu để game thủ có thể đặt món chỉ với vài cú click mà không làm gián đoạn trận đấu:
- **Giao diện Responsive & Premium**: 
    - **Sticky Menu**: Sidebar danh Mục món ăn tự động bám theo màn hình khi cuộn trang, giúp chuyển đổi danh mục tức thì.
    - **Brand Scrolling**: Hệ thống thanh cuộn (Scrollbar) màu đỏ đặc trưng, tăng tính nhận diện thương hiệu.
- **Hệ thống Định danh mới**: Đăng nhập/Đăng ký siêu tốc chỉ bằng **Username** (Không yêu cầu Email).
- **Thực đơn Đa tầng**: Lọc món theo danh mục, tìm kiếm thời gian thực.
- **Tùy biến Topping Chuyên sâu**: Cho phép chọn cấp độ cay, thêm topping có số lượng (trứng, phô mai) hoặc lựa chọn nhị phân.
- **Giỏ hàng Thông minh**: Lưu trữ trạng thái chọn món, tự động tính toán phụ phí và ưu đãi combo.

### 2. Phân hệ Quản trị (Admin Portal)
Giao diện quản lý toàn diện dành cho chủ quán net:
- **Dashboard Thống kê**: Theo dõi doanh thu, số lượng đơn hàng và các chỉ số hoạt động.
- **Quản lý Sản phẩm (CRUD)**: Hệ thống thêm, sửa, xóa sản phẩm với **ID ngẫu nhiên (p_...)** giúp bảo mật dữ liệu.
- **Quản lý Khách hàng & Phân hạng (Rank)**: 
    - Phân loại khách hàng tự động dựa trên chi tiêu: **VIP**, **VÀNG**, **BẠC**.
    - Theo dõi lịch sử giao dịch và tổng mức tích lũy của từng người chơi.
- **Quản lý Đơn hàng**: Tiếp nhận và cập nhật trạng thái đơn hàng thời gian thực.

---

## 🛠 Hướng dẫn Cài đặt & Phát triển

### Yêu cầu hệ thống
- Node.js version 18.0 trở lên.
- Trình quản lý gói `npm`.

### Khởi chạy môi trường Dev
1. **Cài đặt thư viện**: `npm install`
2. **Khởi chạy đồng thời Frontend & Backend**:
   ```bash
   npm run dev:all
   ```
   *Lệnh này sẽ khởi chạy Vite trên cổng 5173 và JSON Server trên cổng 8888.*

---

## 📂 Tổ chức mã nguồn (Project Structure)

```text
/netbite_app
├── /mock-data          # Chứa db.json (Database mockup)
├── /src
│   ├── /components     # UI Components dùng chung (Header, Footer, Cart...)
│   ├── /context        # Quản lý trạng thái toàn cục (CartContext)
│   ├── /hooks          # Custom Hooks xử lý logic Admin & Auth
│   ├── /pages          # Các trang cấp cao (Home, Menu, Checkout...)
│   │   └── /admin      # Phân hệ quản trị chi tiết
│   ├── /services       # Cấu hình API Axios
│   ├── /types          # Định nghĩa kiểu TypeScript cho hệ thống
│   └── App.tsx         # Entry point của ứng dụng
└── README.md           # Tài liệu dự án
```

---

## 🛡 Bảo mật & Quy chuẩn ID
Từ phiên bản 2026, NetBite áp dụng tiêu chuẩn ID mới:
- **User ID**: Định dạng `u_xxxxxxxxx` (Ngẫu nhiên).
- **Product ID**: Định dạng `p_xxxxxxxxx` (Ngẫu nhiên).
- **Username**: Là định danh duy nhất (Unique identifier) trong toàn hệ thống.

---

## 🧪 Chiến lược Kiểm thử (Testing Strategy)
Hệ thống được thiết kế để kiểm thử thông qua các kịch bản thực tế (End-to-End):
- **Xác thực**: Kiểm tra luồng Đăng ký/Đăng nhập bằng Username.
- **Quy trình đặt món**: Thêm món với Topping Level (Cay) và Topping Định lượng -> Kiểm tra giỏ hàng.
- **Thanh toán**: Xác nhận đơn hàng với mã Máy/Bàn và kiểm tra trạng thái trong trang Admin.
- **Admin**: Kiểm tra CRUD sản phẩm và luồng cập nhật trạng thái đơn hàng.

---
*© 2026 NetBite Gaming Cafe Application. All rights reserved.*
