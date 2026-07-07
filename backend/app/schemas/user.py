"""
File này minh họa khái niệm: Validation với Pydantic (Giai đoạn 2)

Pydantic schemas là "hợp đồng" dữ liệu: định nghĩa chính xác dữ liệu
đầu vào (request) và đầu ra (response) trông như thế nào.
FastAPI dùng Pydantic để tự động validate và serialize/deserialize JSON.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr, field_validator


class UserCreate(BaseModel):
    """Schema cho request đăng ký: dữ liệu client gửi lên."""
    email: EmailStr  # Pydantic tự validate định dạng email, không cần viết regex
    password: str
    display_name: str | None = None

    @field_validator('password')
    @classmethod
    def password_must_be_strong_enough(cls, v: str) -> str:
        # Validator chạy tự động trước khi dữ liệu đến route handler
        # Nếu raise ValueError, FastAPI tự trả về HTTP 422 với thông báo lỗi rõ ràng
        if len(v) < 6:
            raise ValueError('Mật khẩu phải có ít nhất 6 ký tự')
        return v


class UserResponse(BaseModel):
    """Schema cho response: dữ liệu trả về cho client.
    Lưu ý: KHÔNG có trường password/hashed_password ở đây.
    Đây là cách đảm bảo mật khẩu không bao giờ bị leak qua API."""
    id: UUID
    email: str
    display_name: str | None
    created_at: datetime

    # model_config với from_attributes=True cho phép tạo schema từ SQLAlchemy model
    # (vì SQLAlchemy model không phải dict thông thường)
    model_config = {"from_attributes": True}
