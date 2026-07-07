"""
File này minh họa khái niệm: HTTP & REST + Authentication (Giai đoạn 2 - Core Backend)

Router này xử lý 2 endpoint quan trọng nhất của bất kỳ web app nào:
- POST /auth/register: tạo tài khoản mới
- POST /auth/login: đăng nhập, nhận JWT token

Luồng request đăng nhập (ví dụ thực tế để học):
  Client gửi POST /auth/login
    → FastAPI validate body với LoginRequest schema (Pydantic)
    → Tìm user trong DB theo email
    → Verify password (bcrypt compare)
    → Tạo JWT token
    → Trả về token cho client
"""

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backendpath.backend.app.core.deps import get_db
from backendpath.backend.app.core.security import create_access_token, hash_password, verify_password
from backendpath.backend.app.exceptions import InvalidCredentialsError, UserAlreadyExistsError
from backendpath.backend.app.models.user import User
from backendpath.backend.app.schemas.auth import LoginRequest, TokenResponse
from backendpath.backend.app.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    """Đăng ký tài khoản mới.

    status_code=201 (Created) thay vì 200 (OK) vì đây là tạo resource mới.
    Đây là convention của REST API.
    """
    # Kiểm tra email đã tồn tại chưa
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        # Ném exception, middleware/error_handler.py sẽ bắt và trả về HTTP 409
        raise UserAlreadyExistsError(f"Email {user_data.email} đã được sử dụng")

    # Hash mật khẩu TRƯỚC khi lưu vào DB - không bao giờ lưu mật khẩu thô
    new_user = User(
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        display_name=user_data.display_name,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)  # refresh để lấy id và created_at vừa được DB tạo

    return new_user


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Đăng nhập và nhận JWT access token."""
    # Tìm user theo email
    user = db.query(User).filter(User.email == login_data.email).first()

    # Quan trọng: luôn kiểm tra cả user tồn tại VÀ password đúng trong cùng 1 điều kiện.
    # Nếu tách ra 2 điều kiện, attacker có thể biết email có tồn tại hay không (user enumeration).
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise InvalidCredentialsError("Email hoặc mật khẩu không đúng")

    # Tạo JWT token chứa user_id, có thời hạn theo cấu hình trong .env
    token = create_access_token(str(user.id))

    return TokenResponse(access_token=token)
