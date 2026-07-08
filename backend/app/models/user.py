"""
File này minh họa khái niệm: ORM & Database - phần Models (Giai đoạn 2)

Mỗi class ở đây tương ứng với 1 bảng trong PostgreSQL.
SQLAlchemy sẽ tự động map các thuộc tính Python sang cột SQL.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    # __tablename__ nói với SQLAlchemy tên bảng trong PostgreSQL là gì
    __tablename__ = "users"

    # UUID thay vì integer ID: an toàn hơn vì không thể đoán được ID của user khác
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    # Lưu hashed_password, KHÔNG BAO GIỜ lưu mật khẩu thô
    hashed_password = Column(String(255), nullable=False)
    display_name = Column(String(100), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # relationship cho phép truy cập progress của user qua user.progress_records
    # back_populates tạo liên kết 2 chiều: user → progress và progress → user
    progress_records = relationship("Progress", back_populates="user", cascade="all, delete-orphan")
    quiz_attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("Badge", back_populates="user", cascade="all, delete-orphan")
