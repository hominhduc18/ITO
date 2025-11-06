# ITO  (Clean Architecture, Vite + React + TS)



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
