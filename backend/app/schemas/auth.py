"""
File này minh họa khái niệm: Auth - JWT Token (Giai đoạn 2)
"""

from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    """Dữ liệu đăng nhập từ client."""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Dữ liệu trả về sau khi đăng nhập thành công.
    access_token là JWT token, client sẽ gửi kèm trong mọi request tiếp theo."""
    access_token: str
    token_type: str = "bearer"  # Chuẩn OAuth2: luôn là "bearer"


class TokenData(BaseModel):
    """Dữ liệu được giải mã từ JWT token (payload).
    Chỉ lưu user_id trong token, không lưu thông tin nhạy cảm."""
    user_id: str | None = None
