"""
Tests cho auth endpoints.
Minh họa khái niệm: Testing - viết test cho API.
"""

import pytest


def test_register_success(client):
    """Đăng ký thành công với email và password hợp lệ."""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password123",
        "display_name": "Test User"
    })
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert data["display_name"] == "Test User"
    # Đảm bảo password không bị leak trong response
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    """Đăng ký 2 lần với cùng email phải trả về 409."""
    payload = {"email": "duplicate@example.com", "password": "password123"}
    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 409
    assert response.json()["error"] == "USER_ALREADY_EXISTS"


def test_register_weak_password(client):
    """Password quá ngắn phải trả về 422 (validation error)."""
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "123"
    })
    assert response.status_code == 422


def test_login_success(client):
    """Đăng nhập thành công phải trả về JWT token."""
    # Tạo user trước
    client.post("/auth/register", json={
        "email": "login@example.com",
        "password": "password123"
    })

    response = client.post("/auth/login", json={
        "email": "login@example.com",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    # Token phải là chuỗi có 3 phần (header.payload.signature)
    assert len(data["access_token"].split(".")) == 3


def test_login_wrong_password(client):
    """Đăng nhập sai mật khẩu phải trả về 401."""
    client.post("/auth/register", json={
        "email": "user@example.com",
        "password": "correctpassword"
    })

    response = client.post("/auth/login", json={
        "email": "user@example.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401
    assert response.json()["error"] == "INVALID_CREDENTIALS"


def test_login_nonexistent_user(client):
    """Đăng nhập với email không tồn tại phải trả về 401 (không phải 404)."""
    response = client.post("/auth/login", json={
        "email": "nobody@example.com",
        "password": "password123"
    })
    # Trả về 401, không phải 404, để tránh user enumeration attack
    assert response.status_code == 401


def test_get_me_with_valid_token(client):
    """GET /users/me với token hợp lệ phải trả về thông tin user."""
    client.post("/auth/register", json={
        "email": "me@example.com",
        "password": "password123",
        "display_name": "Me User"
    })
    login_response = client.post("/auth/login", json={
        "email": "me@example.com",
        "password": "password123"
    })
    token = login_response.json()["access_token"]

    response = client.get("/users/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"


def test_get_me_without_token(client):
    """GET /users/me không có token phải trả về 403."""
    response = client.get("/users/me")
    assert response.status_code == 403
