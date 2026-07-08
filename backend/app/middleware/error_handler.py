"""
File này minh họa khái niệm: Error Handling - Global Exception Handler (Giai đoạn 2)

Thay vì mỗi route tự xử lý lỗi, ta đăng ký 1 handler toàn cục ở đây.
Khi bất kỳ đâu trong app throw exception, handler này sẽ bắt và trả về
JSON response có format chuẩn nhất quán.

Format lỗi chuẩn:
  { "error": "USER_NOT_FOUND", "message": "Không tìm thấy user" }
Thay vì mỗi route trả về format khác nhau.
"""

from fastapi import Request
from fastapi.responses import JSONResponse

from app.exceptions import (
    InvalidCredentialsError,
    ProgressNotFoundError,
    UserAlreadyExistsError,
    UserNotFoundError,
)


async def custom_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Handler toàn cục bắt tất cả exception chưa được xử lý."""

    # Map từng loại exception sang HTTP status code và error code tương ứng
    exception_map = {
        UserNotFoundError: (404, "USER_NOT_FOUND"),
        InvalidCredentialsError: (401, "INVALID_CREDENTIALS"),
        UserAlreadyExistsError: (409, "USER_ALREADY_EXISTS"),
        ProgressNotFoundError: (404, "PROGRESS_NOT_FOUND"),
    }

    for exc_class, (status_code, error_code) in exception_map.items():
        if isinstance(exc, exc_class):
            return JSONResponse(
                status_code=status_code,
                content={
                    "error": error_code,
                    "message": str(exc) if str(exc) else exc_class.__doc__,
                },
            )

    # Nếu không match exception nào, trả về 500 (lỗi không mong đợi)
    # Trong production, không nên expose chi tiết lỗi để tránh leak thông tin
    return JSONResponse(
        status_code=500,
        content={"error": "INTERNAL_SERVER_ERROR", "message": "Đã xảy ra lỗi không mong đợi"},
    )
