"""
File này minh họa khái niệm: ORM & Database + Business Logic (Giai đoạn 2 - Core Backend)

Router này xử lý toàn bộ logic tiến độ học tập:
- Lấy progress hiện tại
- Cập nhật khi đọc lý thuyết hoặc làm quiz
- Tự động trao badge khi hoàn thành 1 giai đoạn

Đây là ví dụ thực tế về "business logic" trong request lifecycle:
  Request → Validate → Query DB → Xử lý logic nghiệp vụ → Update DB → Response
"""

from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backendpath.backend.app.core.deps import get_current_user, get_db
from backendpath.backend.app.models.progress import Badge, Progress, QuizAttempt
from backendpath.backend.app.models.user import User
from backendpath.backend.app.schemas.progress import BadgeResponse, ProgressResponse, ProgressUpdate, QuizAttemptCreate

router = APIRouter(prefix="/progress", tags=["Progress"])

# Cấu hình: các node thuộc từng giai đoạn
# stage_id → list các node_id cần hoàn thành để nhận badge
STAGE_NODES: dict[int, list[str]] = {
    1: ["what-is-backend", "http-rest", "how-internet-works"],
    2: ["request-lifecycle", "orm-database", "auth", "error-handling", "validation"],
    3: ["config-env", "testing", "deployment"],
    4: ["scaling", "monitoring", "microservices"],
}


@router.get("", response_model=list[ProgressResponse])
def get_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy toàn bộ tiến độ của user hiện tại.

    Dùng relationship SQLAlchemy thay vì viết SQL JOIN thủ công:
    current_user.progress_records đã có sẵn nhờ relationship trong models/user.py
    """
    return current_user.progress_records


@router.post("/{node_id}", response_model=ProgressResponse)
def update_progress(
    node_id: str,
    update_data: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cập nhật tiến độ 1 node.

    Dùng upsert pattern:
    Nếu chưa có record → tạo mới, nếu đã có → cập nhật.
    Tránh việc caller phải biết record đã tồn tại chưa.
    """
    # Tìm record hiện tại (nếu có)
    progress = db.query(Progress).filter(
        Progress.user_id == current_user.id,
        Progress.node_id == node_id,
    ).first()

    if progress is None:
        # Xác định stage_id từ node_id
        stage_id = _get_stage_for_node(node_id)
        progress = Progress(
            user_id=current_user.id,
            node_id=node_id,
            stage_id=stage_id,
        )
        db.add(progress)

    # Cập nhật các field được gửi lên (None nghĩa là không cập nhật field đó)
    if update_data.theory_read is not None:
        progress.theory_read = update_data.theory_read

    if update_data.quiz_score is not None:
        # Chỉ cập nhật nếu điểm mới cao hơn điểm hiện tại
        progress.quiz_best_score = max(progress.quiz_best_score or 0, update_data.quiz_score)

    # Kiểm tra hoàn thành: đã đọc lý thuyết VÀ đạt ít nhất 80% quiz
    if progress.theory_read and (progress.quiz_best_score or 0) >= 80:
        if not progress.completed:
            progress.completed = True
            progress.completed_at = datetime.now(timezone.utc)
            # Kiểm tra xem có đủ điều kiện nhận badge không
            _check_and_award_badge(current_user.id, progress.stage_id, db)

    progress.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(progress)

    return progress


@router.post("/{node_id}/quiz-attempt", response_model=dict)
def record_quiz_attempt(
    node_id: str,
    attempt_data: QuizAttemptCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Ghi nhận 1 lần làm quiz (lưu vào bảng quiz_attempts).

    Bảng này lưu TẤT CẢ các lần làm, không chỉ lần tốt nhất.
    Lý do: đây là ví dụ thực tế của quan hệ 1-nhiều để học SQL JOIN trong pgAdmin.
    """
    attempt = QuizAttempt(
        user_id=current_user.id,
        node_id=node_id,
        score=attempt_data.score,
        total_questions=attempt_data.total_questions,
    )
    db.add(attempt)
    db.commit()

    return {
        "message": "Đã ghi nhận kết quả quiz",
        "score": attempt_data.score,
        "total": attempt_data.total_questions,
        "percentage": round(attempt_data.score / attempt_data.total_questions * 100),
    }


@router.get("/badges", response_model=list[BadgeResponse])
def get_badges(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Lấy danh sách badge đã đạt được."""
    return current_user.badges


def _get_stage_for_node(node_id: str) -> int:
    """Tìm stage_id của 1 node. Trả về 1 nếu không tìm thấy."""
    for stage_id, nodes in STAGE_NODES.items():
        if node_id in nodes:
            return stage_id
    return 1


def _check_and_award_badge(user_id, stage_id: int, db: Session) -> None:
    """Kiểm tra và trao badge nếu user hoàn thành tất cả node của 1 giai đoạn.

    Đây là ví dụ về "service function" - logic nghiệp vụ tách riêng khỏi route handler.
    Lý do tách ra: dễ test độc lập, dễ tái sử dụng, route handler không bị phức tạp.
    """
    # Kiểm tra badge đã có chưa (tránh trao 2 lần)
    existing_badge = db.query(Badge).filter(
        Badge.user_id == user_id,
        Badge.stage_id == stage_id,
    ).first()
    if existing_badge:
        return

    required_nodes = STAGE_NODES.get(stage_id, [])
    if not required_nodes:
        return

    # Đếm số node đã hoàn thành trong giai đoạn này
    completed_count = db.query(Progress).filter(
        Progress.user_id == user_id,
        Progress.stage_id == stage_id,
        Progress.completed == True,
    ).count()

    # Trao badge nếu đã hoàn thành đủ node
    if completed_count >= len(required_nodes):
        badge = Badge(user_id=user_id, stage_id=stage_id)
        db.add(badge)
        # Không commit ở đây vì caller (route handler) sẽ commit toàn bộ transaction
