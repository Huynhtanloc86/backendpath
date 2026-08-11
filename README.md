# BackendPath

Ứng dụng học lập trình backend cho người mới bắt đầu. Backend Python thật + PostgreSQL để người học vừa dùng vừa mổ xẻ code.

## Tech stack

| Layer | Công nghệ |
|---|---|
| Frontend | Next.js 14, React 18, Tailwind CSS, TypeScript |
| Backend | FastAPI, Python, SQLAlchemy, Alembic |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose + passlib/bcrypt) |
| Dev tools | Docker Compose, pgAdmin 4 |

## Kiến trúc

```
Frontend (Next.js :3000)  →  Backend (FastAPI :8000)  →  PostgreSQL (:5433)
                                                       ↑
                                                 pgAdmin (:5050)
```

**Database schema:**
```
users ──< progress       (1 user → nhiều progress records theo node)
users ──< quiz_attempts  (1 user → nhiều lần làm quiz)
users ──< badges         (1 user → nhiều badge theo stage)
```

## Cài đặt & chạy

### Yêu cầu

- Docker & Docker Compose
- Python 3.11+
- Node.js 18+

### Bước 1 — Khởi động PostgreSQL

```bash
docker compose up -d
```

### Bước 2 — Cấu hình backend

```bash
cd backend

# Tạo virtual environment
python3 -m venv .venv && source .venv/bin/activate

# Cài dependencies
pip install -r requirements.txt

# Tạo file .env (copy từ example)
cp .env.example .env

# Chạy migration để tạo schema
alembic upgrade head
```

### Bước 3 — Cài dependencies frontend

```bash
cd frontend && npm install
```

### Bước 4 — Chạy cả hai cùng lúc

```bash
# Từ thư mục gốc (backendpath/)
npm install   # chỉ cần chạy lần đầu
npm run dev
```

Hoặc chạy riêng từng service:

```bash
npm run dev:backend   # chỉ FastAPI
npm run dev:frontend  # chỉ Next.js
```

## URL

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Swagger UI | http://localhost:8000/docs |
| pgAdmin | http://localhost:5050 |

**pgAdmin:** `admin@example.com` / `admin123`

## Biến môi trường

Tạo file `backend/.env` với nội dung:

```env
DATABASE_URL=postgresql://backendpath:backendpath123@localhost:5433/backendpath_db
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=1440
```

## API endpoints

| Method | Path | Mô tả | Auth |
|---|---|---|---|
| POST | `/auth/register` | Đăng ký tài khoản | Không |
| POST | `/auth/login` | Đăng nhập, trả JWT | Không |
| GET | `/users/me` | Thông tin user hiện tại | Bearer token |
| GET | `/progress` | Toàn bộ progress của user | Bearer token |
| POST | `/progress/{node_id}` | Cập nhật progress (theory/quiz) | Bearer token |
| POST | `/progress/{node_id}/quiz-attempt` | Ghi lại một lần làm quiz | Bearer token |
| GET | `/progress/badges` | Danh sách badge đã nhận | Bearer token |
| GET | `/health` | Health check | Không |

## Lộ trình học (4 giai đoạn — 15 bài)

| Stage | Bài học |
|---|---|
| 1 — Nền tảng | Backend là gì, HTTP & REST, Internet hoạt động thế nào |
| 2 — Core Backend | Request lifecycle, ORM & Database, Auth, Error handling, Validation, Pagination & Filtering |
| 3 — Vận hành | Config & .env, Testing, Deployment, Database Migrations (Alembic), Logging & Observability |
| 4 — Nâng cao | Scaling & Performance |

**Luồng học mỗi bài:**
1. Đọc lý thuyết → đánh dấu đã đọc
2. Làm quiz (cần đạt 80% để pass)
3. Xem code thật từ backend này với giải thích
4. Hoàn thành stage → nhận badge

## Cấu trúc dự án

```
backendpath/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, router registration
│   │   ├── config.py            # Settings từ .env (pydantic-settings)
│   │   ├── database.py          # SQLAlchemy engine & session
│   │   ├── exceptions.py        # Custom exception hierarchy
│   │   ├── core/
│   │   │   ├── security.py      # bcrypt hash, JWT create/decode
│   │   │   └── deps.py          # Dependency injection (get_db, get_current_user)
│   │   ├── middleware/
│   │   │   └── error_handler.py # Global exception → JSON error response
│   │   ├── models/
│   │   │   ├── user.py          # User, relationships
│   │   │   └── progress.py      # Progress, QuizAttempt, Badge
│   │   ├── schemas/
│   │   │   ├── auth.py          # LoginRequest, TokenResponse
│   │   │   ├── user.py          # UserCreate, UserResponse
│   │   │   └── progress.py      # ProgressUpdate, BadgeResponse
│   │   └── routers/
│   │       ├── auth.py          # POST /auth/register, /auth/login
│   │       ├── users.py         # GET /users/me
│   │       └── progress.py      # GET/POST /progress, /badges
│   ├── alembic/                 # Database migrations
│   ├── tests/                   # pytest (auth + progress)
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx           # Root layout với navbar
│   │   ├── page.tsx             # Redirect → /roadmap
│   │   ├── (auth)/
│   │   │   ├── login/           # Trang đăng nhập
│   │   │   └── register/        # Trang đăng ký
│   │   ├── roadmap/
│   │   │   ├── page.tsx         # Roadmap 4 stage, hiển thị progress
│   │   │   └── [nodeId]/        # Trang bài học (theory / quiz / code)
│   │   └── playground/          # Swagger UI embed
│   ├── components/
│   │   ├── RoadmapNode.tsx      # Card bài học với trạng thái lock/progress
│   │   ├── QuizComponent.tsx    # Quiz trắc nghiệm A/B/C/D
│   │   └── CodeBlock.tsx        # Code snippet với nút copy
│   ├── hooks/
│   │   ├── useAuth.ts           # Auth state
│   │   └── useProgress.ts       # Progress state
│   ├── lib/
│   │   └── api.ts               # API client, token helpers
│   └── content/
│       └── lessons.ts           # Nội dung tất cả bài học (static)
├── docker-compose.yml           # PostgreSQL + pgAdmin
└── package.json                 # npm run dev (chạy cả hai)
```

## Chạy tests

```bash
cd backend
source .venv/bin/activate
pytest tests/ -v
```

## Lưu ý

- PostgreSQL chạy ở port **5433** (không phải 5432) để tránh xung đột với instance local
- JWT lưu ở `localStorage` — đơn giản cho mục đích học, không dùng cho production
- Mỗi file backend có docstring giải thích nó minh họa khái niệm gì trong roadmap — đọc từ `backend/app/` để học
- Badge được trao khi hoàn thành tất cả bài trong một stage
