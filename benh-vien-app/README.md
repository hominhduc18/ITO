# ITO Clinic Intake (Clean Architecture, Vite + React + TS)

Giao diện tiếp nhận đăng ký khám & chỉ định cận lâm sàng, tách lớp theo Clean Architecture.

## Chạy nhanh
```bash
npm install
npm run dev
```
Mặc định **giả lập API** (không cần BE). Để gọi API thật:
- Tạo file `.env` và đặt `VITE_API_BASE_URL=http://localhost:3000/api`

## Cấu trúc chính
- `domain/` entities, repositories (ports)
- `application/` usecases, dto
- `infrastructure/` adapters (HTTP), env
- `presentation/` React UI (không gọi fetch trực tiếp)
- `app/di/` wiring container + make use case
