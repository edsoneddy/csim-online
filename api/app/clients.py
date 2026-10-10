"""Who is calling (for fairness limits) and a small per-client rate limiter."""
import collections
import hashlib
import threading
import time


def client_key(headers, peer_host, trusted_hops=1, ip_header=None):
    """A short hash identifying the caller, never the raw address.

    Behind a proxy the real client address comes from X-Forwarded-For. Every proxy APPENDS the
    address of the peer it received the request from, so the entries on the left can be forged by
    the client (it can send its own X-Forwarded-For) and only the ones the trusted proxies added on
    the right can be believed. `trusted_hops` is how many trailing entries were added by proxies we
    trust: with the default 1 we take the last entry, the address Render's proxy saw as its peer.
    Render (Cloudflare + its own load balancer) appends rather than resets the header, so the
    left-most entries are attacker controlled; verify on a deployed instance that the last entry
    is the visitor and not a shared edge address, and raise/lower TRUSTED_PROXY_HOPS or set
    `ip_header` (e.g. "CF-Connecting-IP", an environment-chosen header that a trusted edge sets)
    if it is not. Without the header (local runs) the socket peer is used.
    """
    address = None
    if ip_header:
        address = (headers.get(ip_header) or "").strip() or None
    if address is None:
        forwarded = [p.strip() for p in (headers.get("x-forwarded-for") or "").split(",") if p.strip()]
        if forwarded and trusted_hops >= 1:
            address = forwarded[-trusted_hops] if len(forwarded) >= trusted_hops else forwarded[0]
    if address is None:
        address = peer_host or "unknown"
    return hashlib.sha256(address.encode()).hexdigest()[:12]


class RateLimiter:
    """At most `limit` hits per `window` seconds per key (sliding window, in memory)."""

    MAX_KEYS = 5000

    def __init__(self, limit, window=60.0, clock=time.monotonic):
        self.limit, self.window, self.clock = limit, window, clock
        self.hits = collections.OrderedDict()
        self.lock = threading.Lock()

    def hit(self, key):
        """Count a request. Returns None if allowed, or the seconds to wait if not."""
        with self.lock:
            now = self.clock()
            queue = self.hits.pop(key, None) or collections.deque()
            while queue and now - queue[0] >= self.window:
                queue.popleft()
            if len(queue) >= self.limit:
                self.hits[key] = queue
                return max(0.1, self.window - (now - queue[0]))
            queue.append(now)
            self.hits[key] = queue  # most recently used last
            while len(self.hits) > self.MAX_KEYS:
                self.hits.popitem(last=False)
            return None
