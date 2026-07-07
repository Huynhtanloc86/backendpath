"""
File này minh họa khái niệm: ORM & Database (Giai đoạn 2 - Core Backend)

ORM (Object-Relational Mapping) cho phép ta làm việc với database bằng Python objects
thay vì viết SQL thuần. SQLAlchemy là ORM phổ biến nhất trong Python.

Luồng hoạt động:
  Python Object (User) ←→ SQLAlchemy ←→ SQL ←→ PostgreSQL
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from backendpath.backend.app.config import settings


# Engine là "cầu nối" giữa Python và PostgreSQL.
# SQLAlchemy dùng DATABASE_URL để biết kết nối tới database nào.
engine = create_engine(
    settings.database_url,
    # pool_pre_ping=True: kiểm tra kết nối còn sống trước mỗi lần dùng
    # Quan trọng trong production vì kết nối có thể bị đóng sau thời gian idle
    pool_pre_ping=True,
)

# SessionLocal là "factory" tạo ra các database session.
# Mỗi request HTTP sẽ có 1 session riêng (xem deps.py để hiểu tại sao).
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base là lớp cha cho tất cả các ORM models.
# Khi ta khai báo class User(Base), SQLAlchemy biết đây là 1 bảng trong DB.
Base = declarative_base()
