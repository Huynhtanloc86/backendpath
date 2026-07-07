"""
File này minh họa khái niệm: Authentication & Security (Giai đoạn 2)

Luồng xác thực trong app này:
1. Đăng ký: mật khẩu thô → bcrypt hash → lưu vào DB (không bao giờ lưu mật khẩu thô)
2. Đăng nhập: lấy hash từ DB → verify với mật khẩu thô → tạo JWT token
3. Mọi request sau: client gửi JWT trong header → server giải mã → biết đây là user nào

Tại sao dùng JWT thay vì session?
- Stateless: server không cần lưu session, dễ scale horizontal
- Client tự lưu token (localStorage hoặc httpOnly cookie)
- Token có thời hạn (expire) để tự động logout sau 1 khoảng thời gian
"""

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.context import CryptContext

from backendpath.backend.app.config import settings
from backendpath.backend.app.schemas.auth import TokenData

# CryptContext cấu hình thuật toán hash mật khẩu.
# bcrypt được chọn vì nó chậm theo thiết kế (work factor),
# giúp chống brute force ngay cả khi database bị lộ.
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(plain_password: str) -> str:
    """Chuyển mật khẩu thô thành hash an toàn để lưu vào DB.
    Hàm này chỉ chạy 1 lần khi đăng ký."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """So sánh mật khẩu thô với hash trong DB khi đăng nhập.
    passlib tự xử lý salt và timing-safe comparison."""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(user_id: str) -> str:
    """Tạo JWT token chứa user_id và thời gian hết hạn.

    JWT gồm 3 phần: header.payload.signature
    - header: loại token và thuật toán ký
    - payload: dữ liệu (user_id, expire time) - AI CŨNG CÓ THỂ ĐỌC được nếu biết base64
    - signature: chữ ký dùng JWT_SECRET - ĐẢM BẢO token không bị giả mạo
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    # "sub" (subject) là convention của JWT - thường chứa định danh người dùng
    payload = {"sub": user_id, "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> TokenData | None:
    """Giải mã và verify JWT token.
    Trả về None nếu token không hợp lệ hoặc đã hết hạn."""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        user_id: str | None = payload.get("sub")
        if user_id is None:
            return None
        return TokenData(user_id=user_id)
    except JWTError:
        # JWTError bắt tất cả lỗi: hết hạn, sai signature, format lỗi...
        return None
