"""
Fixture cho test suite.
Dùng SQLite in-memory thay vì PostgreSQL để test nhanh, không cần Docker.
"""

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
from app.core.deps import get_db
from app.main import app

# SQLite in-memory cho test - không cần PostgreSQL đang chạy
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_backendpath.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db():
    """Tạo database sạch cho mỗi test function, xóa sau khi xong."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    """HTTP test client với DB đã được override."""
    def override_get_db():
        try:
            yield db
        finally:
            pass

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
