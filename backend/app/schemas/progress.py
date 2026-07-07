"""
File này minh họa khái niệm: Validation - Request/Response schemas (Giai đoạn 2)
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ProgressUpdate(BaseModel):
    """Schema cho request cập nhật progress."""
    theory_read: bool | None = None
    quiz_score: int | None = Field(None, ge=0, le=100)  # ge=0: >= 0, le=100: <= 100


class QuizAttemptCreate(BaseModel):
    """Schema cho request ghi nhận 1 lần làm quiz."""
    score: int = Field(..., ge=0)  # ... nghĩa là bắt buộc phải có
    total_questions: int = Field(..., ge=1)


class ProgressResponse(BaseModel):
    id: UUID
    node_id: str
    stage_id: int
    theory_read: bool
    quiz_best_score: int
    completed: bool
    completed_at: datetime | None
    updated_at: datetime

    model_config = {"from_attributes": True}


class BadgeResponse(BaseModel):
    id: UUID
    stage_id: int
    earned_at: datetime

    model_config = {"from_attributes": True}
