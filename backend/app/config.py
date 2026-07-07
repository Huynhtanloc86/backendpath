"""
File này minh họa khái niệm: Config & .env (Giai đoạn 3 - Vận hành)

Trong thực tế, không bao giờ hard-code thông tin nhạy cảm (mật khẩu DB, secret key)
trực tiếp vào code. Thay vào đó, dùng biến môi trường (.env file).
Lý do: khi deploy lên server, mỗi môi trường (dev/staging/production) có cấu hình khác nhau,
và .env file KHÔNG được commit lên git (để tránh lộ secret).
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Pydantic tự động đọc các giá trị này từ biến môi trường hoặc file .env
    # Nếu biến không tồn tại, sẽ báo lỗi ngay khi khởi động app (fail-fast)
    database_url: str
    jwt_secret: str
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 giờ

    class Config:
        env_file = ".env"  # Đọc từ file .env nếu không có biến môi trường thật


# Tạo 1 instance duy nhất, dùng chung toàn app (Singleton pattern)
settings = Settings()
