const createRateLimiter = ({ windowMs, max, message }) => {
  const clients = new Map();
  const cleanup = setInterval(() => {
    const cutoff = Date.now() - windowMs;
    clients.forEach((entry, key) => {
      if (entry.startedAt <= cutoff) clients.delete(key);
    });
  }, Math.min(windowMs, 60_000));

  cleanup.unref?.();

  return (req, res, next) => {
    const now = Date.now();
    const key = req.ip || req.socket?.remoteAddress || "unknown";
    const current = clients.get(key);
    const entry = !current || now - current.startedAt >= windowMs
      ? { startedAt: now, count: 0 }
      : current;

    entry.count += 1;
    clients.set(key, entry);
    res.set("RateLimit-Limit", String(max));
    res.set("RateLimit-Remaining", String(Math.max(0, max - entry.count)));

    if (entry.count > max) {
      const retryAfter = Math.max(1, Math.ceil((entry.startedAt + windowMs - now) / 1000));
      res.set("Retry-After", String(retryAfter));
      return res.status(429).json({
        success: false,
        message: message || "Too many requests. Please try again later.",
      });
    }

    return next();
  };
};

module.exports = { createRateLimiter };
