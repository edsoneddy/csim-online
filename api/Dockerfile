FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# `csim info` prints which parser backend is active (native C++ or the slow pure-Python fallback), so
# a deploy shows it in the logs. `;` so that a failure there never keeps the API from starting.
CMD ["sh", "-c", "csim info; uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]