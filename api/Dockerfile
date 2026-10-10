FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Render puts Cloudflare and its own load balancers in front of the service: X-Forwarded-For arrives with
# 3 entries and the last one is an edge address that is not the visitor (it even changes between two
# requests of the same visitor), so the per-client limits would not work. Cloudflare sets
# CF-Connecting-IP to the visitor and overwrites any value sent by the client. Only valid behind such an
# edge: if this image is exposed directly the header can be forged, so run it with CLIENT_IP_HEADER=
# (empty) or override it. Checked with GET /api/client on the deployed API.
ENV CLIENT_IP_HEADER=CF-Connecting-IP

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# `csimx info` prints which parser backend is active (native C++ or the slow pure-Python fallback), so
# a deploy shows it in the logs. `;` so that a failure there never keeps the API from starting.
CMD ["sh", "-c", "csimx info; uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]