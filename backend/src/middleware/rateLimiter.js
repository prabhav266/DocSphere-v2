const requestCounts = new Map();

const rateLimiter = ({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests, please try again later." } = {}) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
    const key = `${req.baseUrl}${req.path}:${ip}`;
    const now = Date.now();

    const record = requestCounts.get(key) || { count: 0, resetTime: now + windowMs };

    if (now > record.resetTime) {
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count += 1;
    requestCounts.set(key, record);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({ message });
    }

    next();
  };
};

const authLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: "Too many authentication attempts. Please try again in 15 minutes.",
});

const uploadLimiter = rateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: "Upload rate limit exceeded. Please try again later.",
});

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 300,
  message: "Too many requests to the server.",
});

module.exports = {
  rateLimiter,
  authLimiter,
  uploadLimiter,
  apiLimiter,
};
