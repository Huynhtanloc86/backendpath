"""
File này minh họa khái niệm: Request Lifecycle - Authenticated Endpoint (Giai đoạn 2)

Route GET /users/me là ví dụ điển hình của "protected route":
Client phải gửi JWT token hợp lệ thì mới nhận được dữ liệu.

Đây là endpoint thực tế bạn có thể thử trong trang Playground (/playground).
"""

from fastapi import APIRouter, Depends

from backendpath.backend.app.core.deps import get_current_user
from backendpath.backend.app.models.user import User
from backendpath.backend.app.schemas.user import UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Lấy thông tin user đang đăng nhập.

    Depends(get_current_user) làm tất cả công việc phức tạp:
    - Đọc JWT từ header Authorization
    - Verify chữ ký và thời hạn
    - Query DB để lấy User object
    - Inject User vào đây

    Nếu bất kỳ bước nào fail, FastAPI tự động trả về 401 trước khi vào hàm này.
    """
    # current_user đã là User object được xác thực, chỉ cần trả về
    return current_user
