"""
File này minh họa khái niệm: ORM & Database - quan hệ 1-nhiều (Giai đoạn 2)

Bảng progress và quiz_attempts có quan hệ 1-nhiều với users:
  1 user → nhiều progress records
  1 user → nhiều quiz attempts

Đây là ví dụ thực tế để học cách JOIN bảng trong SQL và ORM.
Bạn có thể mở pgAdmin, vào bảng quiz_attempts và chạy thử:
  SELECT u.email, qa.score, qa.attempted_at
  FROM quiz_attempts qa JOIN users u ON qa.user_id = u.id;
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backendpath.backend.app.database import Base


class Progress(Base):
    __tablename__ = "progress"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    # ForeignKey tạo ràng buộc: user_id phải tồn tại trong bảng users
    # ON DELETE CASCADE: khi user bị xóa, tất cả progress của họ cũng tự xóa
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(String(100), nullable=False)  # ví dụ: "http-rest", "orm-database"
    stage_id = Column(Integer, nullable=False)
    theory_read = Column(Boolean, default=False)
    quiz_best_score = Column(Integer, default=0)  # phần trăm (0-100)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Ràng buộc UNIQUE: mỗi user chỉ có 1 progress record cho mỗi node
    # (tránh duplicate, thay vào đó UPDATE record hiện có)
    __table_args__ = (
        __import__('sqlalchemy').UniqueConstraint('user_id', 'node_id', name='uq_user_node'),
    )

    user = relationship("User", back_populates="progress_records")


class QuizAttempt(Base):
    """Lưu lịch sử MỖI LẦN làm quiz, không chỉ điểm cao nhất.
    Lý do: để người học có thể xem lại tiến trình cải thiện theo thời gian,
    và để chứng minh khái niệm 1-nhiều trong bài học về ORM."""
    __tablename__ = "quiz_attempts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    node_id = Column(String(100), nullable=False)
    score = Column(Integer, nullable=False)
    total_questions = Column(Integer, nullable=False)
    attempted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    user = relationship("User", back_populates="quiz_attempts")


class Badge(Base):
    __tablename__ = "badges"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    stage_id = Column(Integer, nullable=False)
    earned_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        __import__('sqlalchemy').UniqueConstraint('user_id', 'stage_id', name='uq_user_stage_badge'),
    )

    user = relationship("User", back_populates="badges")
