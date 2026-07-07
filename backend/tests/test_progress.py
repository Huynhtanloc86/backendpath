"""
Tests cho progress endpoints.
"""


def _register_and_login(client, email="progress@example.com"):
    """Helper: tạo user và lấy token."""
    client.post("/auth/register", json={"email": email, "password": "password123"})
    resp = client.post("/auth/login", json={"email": email, "password": "password123"})
    return resp.json()["access_token"]


def test_get_progress_empty(client):
    """User mới chưa có progress nào."""
    token = _register_and_login(client)
    response = client.get("/progress", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == []


def test_update_progress_theory_read(client):
    """Cập nhật theory_read cho 1 node."""
    token = _register_and_login(client)
    response = client.post(
        "/progress/http-rest",
        json={"theory_read": True},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["node_id"] == "http-rest"
    assert data["theory_read"] is True
    assert data["completed"] is False  # Chưa đủ điều kiện hoàn thành


def test_update_progress_quiz_score(client):
    """Cập nhật quiz score cho 1 node."""
    token = _register_and_login(client)
    client.post("/progress/http-rest", json={"theory_read": True},
                headers={"Authorization": f"Bearer {token}"})
    response = client.post(
        "/progress/http-rest",
        json={"quiz_score": 85},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["quiz_best_score"] == 85
    # theory_read=True + quiz_best_score=85 >= 80 → completed
    assert data["completed"] is True


def test_quiz_score_keeps_best(client):
    """quiz_best_score chỉ tăng, không giảm khi nộp điểm thấp hơn."""
    token = _register_and_login(client)
    client.post("/progress/http-rest", json={"quiz_score": 90},
                headers={"Authorization": f"Bearer {token}"})
    response = client.post("/progress/http-rest", json={"quiz_score": 60},
                           headers={"Authorization": f"Bearer {token}"})
    assert response.json()["quiz_best_score"] == 90


def test_record_quiz_attempt(client):
    """Ghi nhận 1 lần làm quiz."""
    token = _register_and_login(client)
    response = client.post(
        "/progress/http-rest/quiz-attempt",
        json={"score": 3, "total_questions": 4},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["percentage"] == 75


def test_get_badges_empty(client):
    """User mới chưa có badge."""
    token = _register_and_login(client)
    response = client.get("/progress/badges", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json() == []


def test_progress_unauthenticated(client):
    """Không có token thì không thể truy cập progress."""
    response = client.get("/progress")
    assert response.status_code == 403
