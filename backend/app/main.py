"""
File này minh họa khái niệm: Request Lifecycle - Entrypoint FastAPI (Giai đoạn 2)

main.py là điểm khởi đầu của toàn bộ app:
1. Tạo FastAPI instance
2. Đăng ký middleware (xử lý CORS, error handling)
3. Mount các router (nhóm các route liên quan)
4. Định nghĩa health check endpoint

Khi bạn chạy `uvicorn app.main:app`, Uvicorn:
1. Import file này
2. Tìm object tên `app` (FastAPI instance)
3. Chạy ASGI server để lắng nghe request HTTP
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.exceptions import BackendPathException
from app.middleware.error_handler import custom_exception_handler
from app.routers import users
from app.routers import auth, progress

# Tạo FastAPI instance - đây là object trung tâm của toàn app
app = FastAPI(
    title="BackendPath API",
    description="""
API cho ứng dụng học lập trình backend **BackendPath**.

**Dành cho người học:** Đây chính là backend thật của ứng dụng bạn đang dùng.
Hãy khám phá các endpoint ở đây và đối chiếu với source code trong thư mục `backend/`.

Mỗi endpoint minh họa 1 khái niệm trong roadmap học tập:
- `/auth/*` → Authentication & JWT
- `/users/me` → Protected route & Request lifecycle  
- `/progress/*` → ORM & Database, Business logic
    """,
    version="2.0.0",
)

# CORS (Cross-Origin Resource Sharing): cho phép frontend (localhost:3000)
# gọi API backend (localhost:8000). Trình duyệt chặn request cross-origin theo mặc định.
# Trong production, thay "localhost:3000" bằng domain thật của frontend.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Đăng ký global exception handler (xem middleware/error_handler.py)
app.add_exception_handler(BackendPathException, custom_exception_handler)

# Mount các router vào app - mỗi router quản lý 1 nhóm endpoint liên quan
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(progress.router)


@app.get("/health", tags=["System"])
def health_check():
    """Health check endpoint - dùng để kiểm tra app đang chạy.

    Trong thực tế, load balancer hoặc container orchestrator (Kubernetes)
    gọi endpoint này định kỳ để biết service có healthy không.
    HTTP 200 = OK, HTTP 5xx = có vấn đề.
    """
    return {"status": "ok", "service": "backendpath-api", "version": "2.0.0"}
