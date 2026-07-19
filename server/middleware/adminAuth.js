/**
 * Minimal password gate for admin endpoints. Checks the 'x-admin-password'
 * header against ADMIN_PASSWORD in server/.env. Not a full auth system —
 * fine for a small team checking submissions; upgrade to real sessions/JWT
 * if this ever needs multiple admin users or finer-grained permissions.
 */
export function isAdminRequest(req, { allowQueryPassword = false } = {}) {
  if (!process.env.ADMIN_PASSWORD) {
    return false;
  }
  const provided = req.header('x-admin-password')
    || (allowQueryPassword ? req.query.adminPassword : undefined);
  return provided === process.env.ADMIN_PASSWORD;
}

export function requireAdmin(req, res, next) {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'ADMIN_PASSWORD is not set on the server — add it to server/.env' });
  }
  if (!isAdminRequest(req)) {
    return res.status(401).json({ error: 'Incorrect admin password' });
  }
  next();
}
