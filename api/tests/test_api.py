import pytest
from fastapi.testclient import TestClient

from app.main import CSIMX_VERSION, app
from app.worker import run_group

client = TestClient(app)

SNIPPETS = {
    "python_3": (
        "def total(xs):\n    s = 0\n    for x in xs:\n        s += x\n    return s\n",
        "def add_all(items):\n    acc = 0\n    for i in items:\n        acc += i\n    return acc\n",
        "py",
    ),
    "java_24": (
        "class A { int f(int n) { int s = 0; for (int i = 0; i < n; i++) { s += i; } return s; } }",
        "class B { int g(int m) { int t = 0; for (int j = 0; j < m; j++) { t += j; } return t; } }",
        "java",
    ),
    "c": (
        "int f(int n) { int s = 0; for (int i = 0; i < n; i++) { s += i; } return s; }\n",
        "int g(int m) { int t = 0; for (int j = 0; j < m; j++) { t += j; } return t; }\n",
        "c",
    ),
    "kotlin": (
        "fun f(n: Int): Int { var s = 0; for (i in 0 until n) { s += i }; return s }\n",
        "fun g(m: Int): Int { var t = 0; for (j in 0 until m) { t += j }; return t }\n",
        "kt",
    ),
}


def files(lang, extra=None):
    a, b, ext = SNIPPETS[lang]
    out = [
        {"name": f"a.{ext}", "content": a},
        {"name": f"b.{ext}", "content": b},
    ]
    if extra:
        out.append({"name": f"c.{ext}", "content": extra})
    return out


def test_version_reports_csimx_and_limits():
    body = client.get("/api/version").json()
    assert body["csimx_version"] == CSIMX_VERSION
    assert body["speed_factor"] > 0
    assert body["max_estimated_seconds"] > 0 and body["max_files"] > 0


@pytest.mark.parametrize("lang", list(SNIPPETS))
def test_analyze(lang):
    r = client.post(
        "/api/analyze", json={"lang": lang, "files": files(lang)}
    )
    assert r.status_code == 200
    assert 0.9 <= r.json()["result"] <= 1.0


def group(margin=None):
    other = "def main():\n    print(input())\n    print('x' * 3)\n"
    f = files("python_3", other)
    return run_group(
        {
            "names": [x["name"] for x in f],
            "contents": [x["content"] for x in f],
            "lang": "python_3",
            "threshold": 0.8,
            "prefilter_margin": margin,
        }
    )


def test_group_worker_logic():
    body = group()
    assert sorted(body["similarity_groups"][0]) == ["a.py", "b.py"]
    assert body["unique_groups"] == ["c.py"]
    assert body["prefilter_stats"] is None


def test_group_with_prefilter_returns_stats():
    body = group(0.05)
    assert sorted(body["similarity_groups"][0]) == ["a.py", "b.py"]
    assert body["prefilter_stats"]["pairs"] == 3


def group_with_repeated_names(with_ids=True):
    # a zip keeps only the file name of each entry: three files, two of them named "t.py"
    a, b, _ = SNIPPETS["python_3"]
    other = "def main():\n    print(input())\n    print('x' * 3)\n"
    payload = {
        "names": ["t.py", "m.py", "t.py"],
        "contents": [other, a, b],
        "lang": "python_3",
        "threshold": 0.8,
        "prefilter_margin": None,
    }
    if with_ids:
        payload["ids"] = ["id-a", "id-b", "id-c"]
    return run_group(payload)


def test_group_returns_ids_when_names_repeat():
    body = group_with_repeated_names()
    assert sorted(body["similarity_groups"][0]) == ["id-b", "id-c"]
    assert body["unique_groups"] == ["id-a"]
    # the report a person downloads keeps names, told apart
    assert "t.py (2)" in body["printable_output"] and "id-" not in body["printable_output"]


def test_group_without_ids_returns_names():
    body = group_with_repeated_names(with_ids=False)
    assert sorted(body["similarity_groups"][0]) == ["m.py", "t.py (2)"]
    assert body["unique_groups"] == ["t.py"]


def test_ids_all_or_none_and_unique():
    f = files("python_3")
    f[0]["id"] = "x"
    r = client.post("/api/estimate", json={"lang": "python_3", "files": f})
    assert r.status_code == 422
    f[1]["id"] = "x"
    r = client.post("/api/estimate", json={"lang": "python_3", "files": f})
    assert r.status_code == 422
    f[1]["id"] = "y"
    r = client.post("/api/estimate", json={"lang": "python_3", "files": f})
    assert r.status_code == 200


def test_analyze_all_is_gone():
    r = client.post("/api/analyze-all", json={"lang": "python_3", "files": files("python_3")})
    assert r.status_code == 410
    assert r.json()["code"] == "gone" and "Reload" in r.json()["detail"]
    assert client.post("/api/analyze-all").status_code == 410  # even without a body


def test_prefilter_margin_out_of_range():
    r = client.post(
        "/api/estimate",
        json={
            "lang": "python_3",
            "prefilter_margin": 0.9,
            "files": files("python_3"),
        },
    )
    assert r.status_code == 422
