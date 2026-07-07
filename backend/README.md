# BackendPath — Backend (FastAPI)

Tài liệu kỹ thuật cho phần backend của dự án BackendPath — một API học tập giúp bạn thực hành các khái niệm backend qua code thực tế.

---

## 1. Tổng quan kiến trúc

```
backend/
├── app/
│   ├── config.py          # Đọc biến môi trường (.env) qua Pydantic Settings
│   ├── database.py        # Khởi tạo SQLAlchemy engine + SessionLocal + Base
│   ├── exceptions.py      # Custom exceptions (UserNotFoundError, InvalidCredentialsError, ...)
│   ├── main.py            # Điểm vào của FastAPI app, đăng ký routers + middleware
│   ├── core/
│   │   ├── deps.py        # Dependency Injection: get_db(), get_current_user()
│   │   └── security.py    # Hash mật khẩu (bcrypt) + tạo/xác minh JWT token
│   ├── models/
│   │   ├── user.py        # SQLAlchemy model: bảng users
│   │   └── progress.py    # SQLAlchemy models: bảng progress, quiz_attempts, badges
│   ├── schemas/
│   │   ├── auth.py        # Pydantic schemas: LoginRequest, TokenResponse
│   │   ├── user.py        # Pydantic schemas: UserCreate, UserResponse
│   │   └── progress.py    # Pydantic schemas: ProgressUpdate, QuizAttemptCreate, ProgressResponse, BadgeResponse
│   ├── routers/
│   │   ├── auth.py        # Endpoints: POST /auth/register, POST /auth/login
│   │   ├── users.py       # Endpoints: GET /users/me
│   │   └── progress.py    # Endpoints: PATCH /progress/{node_id}, POST /progress/{node_id}/quiz-attempt, GET /progress, GET /badges
│   └── middleware/
│       └── error_handler.py  # Bắt custom exceptions → chuyển thành HTTP response phù hợp
└── tests/
    ├── conftest.py        # Fixtures dùng chung: SQLite test DB, TestClient
    ├── test_auth.py       # Tests cho đăng ký, đăng nhập, lấy thông tin user
    └── test_progress.py   # Tests cho cập nhật tiến độ, quiz, badge
```

**Luồng xử lý một HTTP request:**

```
Client → FastAPI Router → Dependency Injection (get_db, get_current_user)
       → Route Handler → Service Logic → SQLAlchemy ORM → PostgreSQL
       → Pydantic Schema (serialize) → JSON Response → Client
```

**Công nghệ sử dụng:**

| Thành phần | Thư viện | Vai trò |
|---|---|---|
| Web framework | FastAPI | Xử lý HTTP, routing, OpenAPI docs tự động |
| ORM | SQLAlchemy 2.0 | Map Python objects ↔ SQL tables |
| Database | PostgreSQL 16 | Lưu trữ dữ liệu production |
| Validation | Pydantic v2 | Validate request/response, đọc config |
| Auth | python-jose + passlib | Tạo JWT token, hash mật khẩu bcrypt |
| Migration | Alembic | Quản lý thay đổi schema database |

---

## 2. Bảng mapping File → Khái niệm Roadmap

| File | Khái niệm | Giai đoạn |
|---|---|---|
| `app/main.py` | HTTP & REST API — điểm vào của app, đăng ký routes | Giai đoạn 1 — Nền tảng |
| `app/routers/auth.py` | HTTP & REST API — request/response lifecycle, status codes | Giai đoạn 1 — Nền tảng |
| `app/schemas/user.py` | Validation với Pydantic — contract dữ liệu vào/ra | Giai đoạn 1 — Nền tảng |
| `app/schemas/auth.py` | JWT Token — cấu trúc token request/response | Giai đoạn 1 — Nền tảng |
| `app/database.py` | ORM & Database — khởi tạo engine, session factory, Base | Giai đoạn 2 — Core Backend |
| `app/models/user.py` | ORM & Database — định nghĩa model, map Python ↔ SQL | Giai đoạn 2 — Core Backend |
| `app/models/progress.py` | ORM & Database — quan hệ 1-nhiều (ForeignKey, relationship) | Giai đoạn 2 — Core Backend |
| `app/core/deps.py` | Dependency Injection — tái sử dụng DB session, xác thực user | Giai đoạn 2 — Core Backend |
| `app/core/security.py` | Authentication — bcrypt hash, JWT tạo & xác minh | Giai đoạn 2 — Core Backend |
| `app/routers/progress.py` | Business Logic — cập nhật tiến độ, trao badge tự động | Giai đoạn 2 — Core Backend |
| `app/exceptions.py` | Error Handling — custom exceptions, HTTP status codes | Giai đoạn 2 — Core Backend |
| `app/middleware/error_handler.py` | Middleware — bắt exceptions toàn cục, chuẩn hóa lỗi | Giai đoạn 2 — Core Backend |
| `app/config.py` | Config & .env — quản lý secrets, biến môi trường | Giai đoạn 3 — Vận hành |
| `alembic/` | Database Migration — quản lý thay đổi schema | Giai đoạn 3 — Vận hành |
| `tests/conftest.py` | Testing — fixtures, SQLite test database, dependency override | Giai đoạn 3 — Vận hành |
| `tests/test_auth.py` | Testing — integration tests cho auth endpoints | Giai đoạn 3 — Vận hành |
| `tests/test_progress.py` | Testing — integration tests cho progress endpoints | Giai đoạn 3 — Vận hành |

---

## 3. Cách chạy locally

### Yêu cầu

- Python 3.11+
- Docker Desktop (để chạy PostgreSQL)

### Các bước

```bash
# Bước 1: Khởi động PostgreSQL bằng Docker (chạy từ thư mục gốc backendpath/)
docker compose up -d

# Bước 2: Di chuyển vào thư mục backend
cd backend

# Bước 3: Tạo môi trường ảo và cài dependencies
python -m venv .venv
source .venv/bin/activate        # macOS/Linux
# .venv\Scripts\activate         # Windows

pip install -r requirements.txt

# Bước 4: Sao chép file cấu hình
cp .env.example .env
# Chỉnh sửa .env nếu cần (mặc định đã khớp với docker-compose.yml)

# Bước 5: Chạy migration để tạo bảng trong DB
alembic upgrade head

# Bước 6: Khởi động server
uvicorn app.main:app --reload
```

Sau khi khởi động:

- API: [http://localhost:8000](http://localhost:8000)
- Swagger UI (docs): [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 4. Cách chạy tests

Tests dùng **SQLite in-memory** thay vì PostgreSQL thật — không cần Docker khi chạy test.

```bash
# Đảm bảo đang ở thư mục backend/ và đã activate virtual env
cd backend
source .venv/bin/activate

# Chạy toàn bộ tests
pytest tests/

# Chạy với output chi tiết hơn (thấy tên từng test)
pytest tests/ -v

# Chỉ chạy tests auth
pytest tests/test_auth.py -v

# Chỉ chạy tests progress
pytest tests/test_progress.py -v

# Chạy một test cụ thể
pytest tests/test_auth.py::test_register_success -v

# Hiển thị print() output (hữu ích khi debug)
pytest tests/ -v -s
```

**Lưu ý về isolation:** Mỗi test function nhận fixture `client` mới, fixture này tạo bảng SQLite trước test và xóa sạch sau test. Các tests hoàn toàn độc lập với nhau — thứ tự chạy không ảnh hưởng kết quả.

**Lý do dùng SQLite thay vì PostgreSQL cho tests:**
- Không cần Docker đang chạy
- Mỗi test có DB riêng → không có side effects
- Tốc độ nhanh hơn (in-memory hoặc file tạm)
- Nhược điểm: SQLite không hỗ trợ `UUID` type native như PostgreSQL — models cần tương thích (dùng `String` hoặc kiểm tra dialect khi cần)
