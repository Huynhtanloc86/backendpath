# SPEC: Ứng dụng học Backend cho người mới bắt đầu (v2 — có backend Python + PostgreSQL thật)

> File này là bản đặc tả kỹ thuật đầy đủ. Copy toàn bộ nội dung này và paste vào Claude Code, sau đó nói: "Hãy build ứng dụng theo spec này, thực hiện từng Phase một, sau mỗi phase báo cáo tiến độ." Claude Code sẽ tự đọc và triển khai.

**Điểm khác biệt của v2:** Ứng dụng giờ có **backend Python thật (FastAPI) + PostgreSQL local**, không chỉ để lưu tiến độ mà còn để chính người học **"mổ xẻ" source code backend này** như một case study sống — mỗi khái niệm trong roadmap (request lifecycle, ORM, auth, validation, error handling...) đều có code thật tương ứng ngay trong dự án, kèm chú thích để đối chiếu với bài học.

---

## 1. Tổng quan sản phẩm

**Tên tạm:** BackendPath

**Mục tiêu:** Web app học lập trình backend theo lộ trình trực quan (roadmap 4 giai đoạn), dành cho người **chưa biết gì về backend**. Học lý thuyết ngắn + ví dụ code + quiz, đồng thời có một **backend Python + PostgreSQL thật đang chạy phía sau chính ứng dụng**, được viết theo kiểu "sách giáo khoa sống" — code sạch, chú thích kỹ, cấu trúc rõ ràng — để người học có thể mở source ra đọc và đối chiếu với bài học tương ứng.

**Cách dùng backend làm giáo cụ:** Mỗi trang lesson của một node kỹ thuật (VD: "Auth", "ORM & database", "Error handling") sẽ có thêm 1 tab **"Soi code thật"** trỏ tới đúng file/function trong backend đang chạy, giải thích từng dòng liên quan tới khái niệm vừa học.

**Đối tượng:** Người mới, tự học tại nhà, ưu tiên tiếng Việt, học qua ví dụ thật thay vì code mẫu tách rời.

---

## 2. Kiến trúc tổng thể

```
┌─────────────────────┐        HTTP/JSON        ┌──────────────────────┐        SQL       ┌──────────────┐
│   Frontend           │  ───────────────────▶   │   Backend             │  ─────────────▶  │  PostgreSQL   │
│   Next.js 14 (TS)    │  ◀───────────────────   │   FastAPI (Python)    │  ◀─────────────  │  (local)      │
│   Tailwind + shadcn   │                         │   SQLAlchemy + Alembic │                  │               │
└─────────────────────┘                          └──────────────────────┘                  └──────────────┘
```

- **Frontend**: Next.js — hiển thị roadmap, nội dung bài học (vẫn là file tĩnh JSON/TS như v1, KHÔNG cần đưa nội dung bài học vào DB), gọi API backend cho phần **tiến độ học, user, auth**.
- **Backend**: FastAPI (Python) — API thật để: đăng ký/đăng nhập, lưu & lấy tiến độ học, thống kê, quản lý badge. Đây chính là "dự án thực tế" để người học mổ xẻ.
- **Database**: PostgreSQL chạy local qua Docker Compose — lưu user, progress, quiz attempts, badges.

Lý do tách vậy: nội dung bài học (text/markdown) không cần thiết phải nằm trong DB — để trong code tĩnh giúp Claude Code sinh nội dung dễ và deploy đơn giản. Nhưng **phần "vận hành" (user, tiến độ, auth)** thì bắt buộc phải qua backend + DB thật, vì đó chính là thứ người học cần thấy hoạt động thật.

---

## 3. Tech stack

### Frontend
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui
- lucide-react, framer-motion
- Gọi API backend bằng `fetch` qua 1 lớp `lib/api.ts` duy nhất (dễ soi cách frontend nói chuyện với backend)

### Backend (Python) — đây là phần học chính
- **FastAPI** — framework hiện đại, tự sinh docs Swagger tại `/docs`, cú pháp rõ ràng, rất hợp để người mới đọc hiểu request lifecycle
- **SQLAlchemy 2.0** (ORM) + **Alembic** (migration) — để dạy đúng khái niệm "ORM & database" và "migration" trong roadmap
- **Pydantic v2** — validation request/response, dạy đúng khái niệm "Validation"
- **python-jose** hoặc **PyJWT** — JWT auth, dạy đúng khái niệm "Auth"
- **passlib[bcrypt]** — hash password
- **pytest** + **httpx** (TestClient) — dạy đúng khái niệm "Testing"
- **python-dotenv** — dạy đúng khái niệm "Config & .env"
- **Uvicorn** — ASGI server chạy local

### Database
- **PostgreSQL 16**, chạy qua **Docker Compose** ở local (không cần cài đặt thủ công)
- **pgAdmin** (tùy chọn, thêm vào docker-compose) để người học xem trực tiếp bảng dữ liệu bằng giao diện

### Hạ tầng dev
- **Docker Compose** — 1 lệnh `docker compose up` chạy được cả PostgreSQL (và pgAdmin nếu bật)
- **Alembic** để quản lý version schema, dạy đúng khái niệm migration

---

## 4. Cấu trúc thư mục dự án (monorepo)

```
backendpath/
├── frontend/                      # Next.js app (như spec v1)
│   ├── app/
│   ├── components/
│   ├── content/                   # nội dung bài học tĩnh
│   └── lib/
│       └── api.ts                 # gọi backend
│
├── backend/                        # ⭐ phần mới — dự án thật để mổ xẻ
│   ├── app/
│   │   ├── main.py                # entrypoint FastAPI, mount router — MINH HỌA "Request lifecycle"
│   │   ├── config.py               # đọc biến môi trường từ .env — MINH HỌA "Config & .env"
│   │   ├── database.py             # tạo engine, session SQLAlchemy — MINH HỌA "ORM & database"
│   │   ├── models/
│   │   │   ├── user.py             # model User
│   │   │   ├── progress.py         # model Progress (1 dòng / node đã hoàn thành)
│   │   │   └── quiz_attempt.py     # model QuizAttempt (lịch sử làm quiz)
│   │   ├── schemas/                # Pydantic schemas — MINH HỌA "Validation"
│   │   │   ├── user.py
│   │   │   ├── progress.py
│   │   │   └── auth.py
│   │   ├── routers/                # từng nhóm route — MINH HỌA "HTTP & REST"
│   │   │   ├── auth.py             # /auth/register, /auth/login
│   │   │   ├── progress.py         # /progress (GET, POST)
│   │   │   └── users.py            # /users/me
│   │   ├── core/
│   │   │   ├── security.py         # hash password, tạo/kiểm tra JWT — MINH HỌA "Auth"
│   │   │   └── deps.py             # dependency injection: get_db, get_current_user
│   │   ├── middleware/
│   │   │   └── error_handler.py    # exception handler toàn cục — MINH HỌA "Error handling"
│   │   └── exceptions.py           # custom exception classes
│   ├── alembic/                     # migration files — MINH HỌA "ORM & database" (phần migration)
│   │   └── versions/
│   ├── tests/                       # MINH HỌA "Testing"
│   │   ├── conftest.py             # fixture: test DB, test client
│   │   ├── test_auth.py
│   │   └── test_progress.py
│   ├── .env.example
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md                    # ⭐ giải thích kiến trúc, map từng file với từng bài học
│
├── docker-compose.yml               # postgres + pgadmin + (tùy chọn) backend
└── README.md                        # hướng dẫn chạy toàn bộ dự án
```

**Nguyên tắc bắt buộc khi Claude Code viết code backend:**
- Comment tiếng Việt giải thích **tại sao** làm vậy, không chỉ **làm gì** (vì đây là giáo cụ, không chỉ là code sản phẩm)
- Mỗi file chính phải có docstring đầu file nói rõ: "File này minh họa khái niệm nào trong roadmap"
- Tránh code quá "clever" — ưu tiên rõ ràng, dễ đọc hơn là ngắn gọn/tối ưu

---

## 5. Database schema (PostgreSQL)

```sql
-- users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- progress: 1 dòng cho mỗi node người dùng đã tương tác
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,       -- ví dụ "http-rest"
    stage_id INT NOT NULL,
    theory_read BOOLEAN DEFAULT false,
    quiz_best_score INT DEFAULT 0,       -- %
    completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, node_id)
);

-- quiz_attempts: lịch sử mỗi lần làm quiz (để dạy khái niệm 1-nhiều, JOIN)
CREATE TABLE quiz_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,
    score INT NOT NULL,
    total_questions INT NOT NULL,
    attempted_at TIMESTAMPTZ DEFAULT now()
);

-- badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stage_id INT NOT NULL,
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, stage_id)
);
```

Bảng `progress` + `quiz_attempts` được thiết kế cố ý có quan hệ 1-nhiều (1 user - nhiều lần attempt) để khi dạy bài "SQL cơ bản" và "ORM & database", người học có thể soi đúng bảng thật này, chạy thử JOIN thật trong pgAdmin hoặc psql.

---

## 6. API Endpoints (FastAPI)

| Method | Endpoint | Mô tả | Minh họa khái niệm |
|---|---|---|---|
| POST | `/auth/register` | Đăng ký user mới | Auth, Validation |
| POST | `/auth/login` | Đăng nhập, trả JWT | Auth |
| GET | `/users/me` | Lấy thông tin user hiện tại (cần JWT) | Auth (middleware), Request lifecycle |
| GET | `/progress` | Lấy toàn bộ tiến độ của user hiện tại | ORM & database |
| POST | `/progress/{node_id}` | Cập nhật tiến độ 1 node (theory_read, quiz score) | Request lifecycle, Validation |
| POST | `/progress/{node_id}/quiz-attempt` | Ghi nhận 1 lần làm quiz | ORM & database |
| GET | `/badges` | Lấy danh sách badge đã đạt | ORM & database |
| GET | `/health` | Health check | HTTP & REST cơ bản |

Toàn bộ API tự sinh docs tại `http://localhost:8000/docs` (Swagger UI) — dùng chính trang này làm bài thực hành "HTTP & REST" (cho người học tự bấm thử request).

---

## 7. Tính năng bổ sung nhờ có backend thật

### 7.1 Trang "Soi code thật" trong mỗi lesson
- Thêm 1 tab mới trong trang lesson: **"Soi code thật"**
- Hiển thị đoạn code thật (đọc trực tiếp từ file backend, hoặc copy sẵn vào content khi build) tương ứng với khái niệm, có annotation từng dòng
- Ví dụ bài "Auth": hiển thị `core/security.py` (hàm hash password, tạo JWT) + `routers/auth.py` (route login) + giải thích luồng: request → validate → hash check → tạo token → response

### 7.2 Đăng ký/đăng nhập thật
- Trang `/register`, `/login` — dùng chính API `/auth/register`, `/auth/login`
- Tiến độ giờ lưu vào PostgreSQL thay vì localStorage (đồng bộ đa thiết bị)
- Giữ localStorage làm cache tạm/offline fallback (tùy chọn nâng cao)

### 7.3 "Playground API" — thực hành trực tiếp
- Thêm 1 trang `/playground` nhúng Swagger UI của backend (`iframe` tới `localhost:8000/docs`) để người học tự bấm gọi thử API ngay từ trong app học — biến chính app thành phòng lab

### 7.4 Bài tập "mổ xẻ" cuối mỗi giai đoạn
- Cuối Giai đoạn 2 (Core backend): bài tập yêu cầu người học tự mở file `routers/progress.py`, đọc và trả lời câu hỏi (dạng quiz) về luồng xử lý request thật trong chính app đang dùng
- Cuối Giai đoạn 3 (Vận hành): yêu cầu người học tự chạy `docker compose up`, tự chạy `pytest` trong thư mục `backend/`, chụp lại kết quả để "unlock" node

---

## 8. Cấu trúc dữ liệu nội dung (giữ như v1, không đổi)

Nội dung bài học vẫn là file JSON/TS tĩnh trong `frontend/content/`, theo đúng schema `LessonContent` đã định nghĩa ở v1. Chỉ bổ sung thêm field:

```ts
export interface LessonContent {
  id: string;
  stageId: number;
  title: string;
  shortDescription: string;
  intro: string;
  theory: string;
  commonMistakes: { mistake: string; fix: string }[];
  quiz: QuizQuestion[];
  selfCheckList: string[];
  realCodeReference?: {           // ⭐ mới trong v2
    filePath: string;              // ví dụ "backend/app/core/security.py"
    codeSnippet: string;           // đoạn code thật, copy từ backend
    explanation: string;           // giải thích đối chiếu với lý thuyết
  }[];
}
```

---

## 9. Kế hoạch triển khai (Phases cho Claude Code)

### Phase 0 — Khởi tạo monorepo
- Tạo cấu trúc thư mục `frontend/`, `backend/`, `docker-compose.yml` ở root
- `docker-compose.yml`: service `postgres` (image `postgres:16`, volume để giữ data, biến môi trường user/password/db), service `pgadmin` (tùy chọn)

### Phase 1 — Backend nền tảng
- Khởi tạo FastAPI project trong `backend/`, `requirements.txt`
- `config.py` đọc `.env` (DATABASE_URL, JWT_SECRET...)
- `database.py` tạo engine SQLAlchemy, session, base model
- Setup Alembic, tạo migration đầu tiên cho 4 bảng ở mục 5
- `main.py` chạy được `uvicorn app.main:app --reload`, có `/health` trả 200

### Phase 2 — Auth thật
- Models `User`
- `core/security.py`: hash password (bcrypt), tạo/verify JWT
- `routers/auth.py`: `/auth/register`, `/auth/login`
- `core/deps.py`: dependency `get_current_user` dùng cho các route cần đăng nhập
- Viết test `tests/test_auth.py` (đăng ký, đăng nhập, sai mật khẩu)

### Phase 3 — Progress API
- Models `Progress`, `QuizAttempt`, `Badge`
- `routers/progress.py`: GET/POST progress, POST quiz-attempt
- `routers/users.py`: GET `/users/me`
- Logic tự động tạo badge khi đủ điều kiện hoàn thành 1 giai đoạn (viết trong 1 service function riêng, có comment giải thích rõ — đây cũng là ví dụ tốt cho "business logic" trong request lifecycle)
- Viết test `tests/test_progress.py`

### Phase 4 — Error handling & Validation chuẩn
- `middleware/error_handler.py`: bắt exception toàn cục, trả JSON lỗi chuẩn hoá (status code, message, code lỗi)
- `exceptions.py`: custom exceptions (`UserNotFoundError`, `InvalidCredentialsError`...)
- Pydantic schemas đầy đủ cho request/response, kèm ví dụ validate sai để test

### Phase 5 — Frontend roadmap (như v1)
- Next.js app, roadmap map, lesson page, quiz — theo đúng mục 5-7 của spec v1 (giữ nguyên)
- `lib/api.ts`: hàm gọi các endpoint backend ở mục 6

### Phase 6 — Kết nối Frontend ⇄ Backend
- Trang `/register`, `/login`, lưu JWT (httpOnly cookie hoặc localStorage — ghi rõ trade-off trong README)
- Trang roadmap và lesson chuyển từ đọc localStorage sang gọi API backend để lấy/lưu progress
- Xử lý loading/error state khi gọi API

### Phase 7 — Tính năng "mổ xẻ code thật"
- Bổ sung field `realCodeReference` cho các node: Request lifecycle, ORM & database, Auth, Error handling, Validation, Config & .env, Testing
- Copy đúng đoạn code thật từ `backend/` vào content, kèm giải thích
- Thêm tab "Soi code thật" trong `LessonView`
- Trang `/playground` nhúng Swagger UI

### Phase 8 — Polish & Tài liệu
- Viết `backend/README.md`: giải thích kiến trúc, bảng map file ↔ khái niệm roadmap (giống bảng ở mục 6)
- Viết `README.md` gốc: hướng dẫn chạy toàn bộ dự án bằng 3 lệnh:
  ```bash
  docker compose up -d          # chạy PostgreSQL
  cd backend && alembic upgrade head && uvicorn app.main:app --reload
  cd frontend && npm install && npm run dev
  ```
- Responsive, dark mode, review toàn bộ luồng end-to-end

---

## 10. Yêu cầu chất lượng nội dung (giữ nguyên như v1)

- Viết bằng tiếng Việt tự nhiên, không dịch máy móc
- Luôn có ví dụ ẩn dụ đời thực trước khi vào thuật ngữ kỹ thuật
- Không giả định người đọc biết thuật ngữ trước đó
- Code ví dụ và code backend thật đều phải chạy được, không viết pseudo-code (trừ khi ghi chú rõ là minh họa ý tưởng)
- Riêng phần backend: **comment giải thích "tại sao"**, không chỉ "làm gì" — vì đây là giáo cụ chính

---

## 11. Prompt gợi ý để nói với Claude Code sau khi paste file này

```
Đọc kỹ spec trên (bản v2, có backend Python + PostgreSQL thật).
Hãy khởi tạo dự án theo Phase 0, sau đó lần lượt làm Phase 1 → Phase 8.
Sau mỗi Phase, dừng lại báo cáo ngắn gọn những gì đã làm, chạy thử (test hoặc gọi API) để xác nhận hoạt động, trước khi sang Phase tiếp theo.
Ưu tiên: (1) backend phải chạy thật và có test pass, (2) code backend phải sạch và có comment giải thích rõ vì đây là giáo cụ học tập, (3) nội dung bài học phải dễ hiểu cho người mới.
Nếu thiếu Docker hoặc PostgreSQL trên máy, hãy hướng dẫn tôi cài đặt trước khi tiếp tục Phase 0.
```
