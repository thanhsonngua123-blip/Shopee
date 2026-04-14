# Shopee Clone

Đây là một ứng dụng demo thương mại điện tử giả lập (Shopee clone) được xây dựng bằng `React`, `TypeScript` và `Vite`.

## Tổng quan

Ứng dụng cho phép:

- xem danh sách sản phẩm
- xem chi tiết sản phẩm
- thêm/xóa sản phẩm khỏi giỏ hàng
- đăng nhập và đăng ký người dùng
- truy cập trang người dùng chỉ khi đã xác thực
- xem hồ sơ, thay đổi mật khẩu, xem lịch sử mua hàng
- hỗ trợ đa ngôn ngữ

## Công nghệ chính

- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router v7
- React Query
- i18next
- React Hook Form
- Zod
- Axios
- React Toastify
- Vitest
- ESLint + Prettier

## Cấu trúc thư mục chính

- `src/pages/` — trang chính của ứng dụng
- `src/layouts/` — layout dùng chung
- `src/components/` — component tái sử dụng
- `src/apis/` — gọi API và xử lý dữ liệu
- `src/contexts/` — quản lý trạng thái toàn cục
- `src/hooks/` — hook tùy chỉnh
- `src/constants/` — các hằng số và đường dẫn
- `src/utils/` — tiện ích dùng chung

## Chạy dự án

### Cài đặt

```bash
npm install
```

### Chạy local

```bash
npm run dev
```

### Build production

```bash
npm run build
```

### Preview build

```bash
npm run preview
```

## Kiểm tra chất lượng code

- Kiểm tra ESLint:

```bash
npm run lint
```

- Tự động sửa ESLint:

```bash
npm run lint:fix
```

- Kiểm tra Prettier:

```bash
npm run prettier
```

- Định dạng với Prettier:

```bash
npm run prettier:fix
```

## Test

- Chạy test:

```bash
npm run test
```

- Chạy test watch:

```bash
npm run test:watch
```

- Chạy test và tạo báo cáo coverage:

```bash
npm run coverage
```

## Ghi chú

- `src/useRouteElement.tsx` định nghĩa các route chính và bảo vệ route cho người dùng đã đăng nhập.
- `src/App.tsx` sử dụng `QueryClientProvider` và `ErrorBoundary` để quản lý trạng thái và xử lý lỗi.
- `src/i18n/i18n.ts` khởi tạo cấu hình đa ngôn ngữ.

---
