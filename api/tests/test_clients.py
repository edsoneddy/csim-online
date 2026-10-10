

def test_client_endpoint_reports_the_shape_without_addresses():
    from fastapi.testclient import TestClient
    from app.main import app

    client = TestClient(app)
    first = client.get("/api/client", headers={"X-Forwarded-For": "1.1.1.1, 9.9.9.9", "CF-Connecting-IP": "1.1.1.1"})
    second = client.get("/api/client", headers={"X-Forwarded-For": "2.2.2.2, 8.8.8.8"})
    assert first.status_code == 200 and first.headers["cache-control"] == "no-store"
    body = first.json()
    assert body["forwarded_entries"] == 2 and "cf-connecting-ip" in body["edge_headers"]
    assert "1.1.1.1" not in first.text and "9.9.9.9" not in first.text
    assert body["key"] != second.json()["key"]  # different last entries -> different clients
