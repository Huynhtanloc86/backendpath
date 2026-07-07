"""
File này minh họa khái niệm: Dependency Injection trong FastAPI (Giai đoạn 2)

Dependency Injection (DI) là pattern FastAPI dùng để "inject" (tiêm) các dependency
vào route handler. Thay vì mỗi route tự tạo DB session hoặc tự parse JWT,
ta khai báo dependency 1 lần và FastAPI tự gọi khi cần.

Lợi ích:
- Tránh lặp code (DRY)
- Dễ test: có thể override dependency trong test
- Quản lý vòng đời resource tốt hơn (ví dụ: đảm bảo DB session luôn được đóng)
"""

import uuid
from typing import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from backendpath.backend.app.core.security import decode_access_token
from backendpath.backend.app.database import SessionLocal
from backendpath.backend.app.models.user import User

# HTTPBearer tự động đọc JWT từ header: "Authorization: Bearer <token>"
security = HTTPBearer()


def get_db() -> Generator[Session, None, None]:
    """Tạo database session cho mỗi request, đảm bảo đóng sau khi xong.

    Đây là ví dụ điển hình của Python context manager dùng với yield.
    FastAPI đảm bảo phần sau yield (db.close()) luôn chạy, kể cả khi có exception.
    """
    db = SessionLocal()
    try:
        yield db  # FastAPI inject session này vào route handler
    finally:
        db.close()  # Luôn đóng session để trả connection về pool


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """Dependency để xác thực user từ JWT token.

    Mọi route cần đăng nhập chỉ cần thêm: current_user: User = Depends(get_current_user)
    FastAPI sẽ tự:
    1. Lấy JWT từ header Authorization
    2. Gọi hàm này để verify và lấy User object
    3. Inject User vào route handler
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token không hợp lệ hoặc đã hết hạn",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = decode_access_token(credentials.credentials)
    if token_data is None:
        raise credentials_exception

    # Chuyển string UUID thành UUID object để tương thích cả SQLite (test) và PostgreSQL (production)
    try:
        user_uuid = uuid.UUID(token_data.user_id)
    except (ValueError, AttributeError):
        raise credentials_exception

    user = db.query(User).filter(User.id == user_uuid).first()
    if user is None:
        raise credentials_exception

    return user
