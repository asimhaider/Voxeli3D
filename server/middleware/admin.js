/** Protect internal submission listings with a bearer token. */
export function requireAdmin(req, res, next) {
  const token = process.env.ADMIN_API_TOKEN;
  const authorization = req.get('authorization');
  if (!token) return res.status(503).json({ error: 'ADMIN_API_TOKEN is not configured' });
  if (authorization !== `Bearer ${token}`) return res.status(401).json({ error: 'Unauthorized' });
  next();
}
