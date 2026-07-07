"""
File này minh họa khái niệm: Error Handling (Giai đoạn 2 - Core Backend)

Thay vì dùng Exception chung chung, ta định nghĩa các exception riêng cho từng loại lỗi.
Lý do: giúp code rõ ràng hơn, và middleware có thể bắt từng loại lỗi để trả về
HTTP status code phù hợp (401, 404, 409...).
"""


class BackendPathException(Exception):
    """Lớp cha cho tất cả custom exceptions của app này."""
    pass


class UserNotFoundError(BackendPathException):
    """Ném ra khi không tìm thấy user trong database."""
    pass


class InvalidCredentialsError(BackendPathException):
    """Ném ra khi email/password không khớp trong quá trình đăng nhập."""
    pass


class UserAlreadyExistsError(BackendPathException):
    """Ném ra khi cố đăng ký email đã tồn tại."""
    pass


class ProgressNotFoundError(BackendPathException):
    """Ném ra khi không tìm thấy progress record."""
    pass
