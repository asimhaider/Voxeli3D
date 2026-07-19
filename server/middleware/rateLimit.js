const buckets = new Map();

export function rateLimit({ windowMs, max, message }) {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.path}:${req.ip}`;
    const attempts = (buckets.get(key) || []).filter((time) => now - time < windowMs);
    if (attempts.length >= max) {
      return res.status(429).json({ error: message });
    }
    attempts.push(now);
    buckets.set(key, attempts);
    return next();
  };
}

export function rejectBot(req, res, next) {
  if (String(req.body?.website || '').trim()) {
    return res.status(400).json({ error: 'Could not submit your request' });
  }
  return next();
}
