# BackendPath 🎓

Ứng dụng học lập trình backend cho người mới bắt đầu. Backend Python thật + PostgreSQL để người học vừa dùng vừa mổ xẻ code.

## Chạy dự án (3 lệnh)

```bash
# 1. Khởi động PostgreSQL (port 5433)
docker compose up -d

# 2. Chạy backend (từ thư mục backend/)
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload

# 3. Chạy frontend (từ thư mục frontend/, terminal mới)
cd frontend
npm install && npm run dev
```

## URL

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| pgAdmin | http://localhost:5050 (admin@backendpath.local / admin123) |

## Kiến trúc

```
Frontend (Next.js :3000)  →  Backend (FastAPI :8000)  →  PostgreSQL (:5433)
```

## Lưu ý

- PostgreSQL chạy ở port **5433** (không phải 5432) vì port 5432 đã được dùng bởi app khác
- JWT token được lưu ở localStorage (trade-off: đơn giản nhưng kém an toàn hơn httpOnly cookie)
- Để học từ code backend: mở thư mục `backend/app/` và đọc từng file — mỗi file có docstring giải thích nó minh họa khái niệm nào trong roadmap
