import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'voxelis_admin_session';
const SESSION_SECONDS = 60 * 60 * 8;

function sessionSecret() {
  if (!process.env.ADMIN_SESSION_SECRET) {
    throw new Error('ADMIN_SESSION_SECRET is not configured');
  }
  return process.env.ADMIN_SESSION_SECRET;
}

function sign(value) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map((item) => {
    const [key, ...rest] = item.trim().split('=');
    return [key, decodeURIComponent(rest.join('='))];
  }));
}

function safeEqual(a, b) {
  const aBuffer = Buffer.from(a || '');
  const bBuffer = Buffer.from(b || '');
  return aBuffer.length === bBuffer.length && timingSafeEqual(aBuffer, bBuffer);
}

function sessionFromRequest(req) {
  try {
    const token = parseCookies(req)[COOKIE_NAME];
    if (!token) return null;
    const [payload, signature] = token.split('.');
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return null;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return data.exp > Math.floor(Date.now() / 1000) ? data : null;
  } catch {
    return null;
  }
}

function cookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  return [
    'HttpOnly',
    'Path=/',
    `Max-Age=${SESSION_SECONDS}`,
    isProduction ? 'Secure' : '',
    isProduction ? 'SameSite=None' : 'SameSite=Lax',
  ].filter(Boolean).join('; ');
}

export function requireAdmin(req, res, next) {
  if (!sessionFromRequest(req)) return res.status(401).json({ error: 'Admin sign-in required' });
  next();
}

export function isAdminRequest(req) {
  return Boolean(sessionFromRequest(req));
}

export function login(req, res) {
  const password = String(req.body?.password || '');
  if (!process.env.ADMIN_PASSWORD || !safeEqual(password, process.env.ADMIN_PASSWORD)) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  const payload = Buffer.from(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString('base64url');
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${payload}.${sign(payload)}; ${cookieOptions()}`);
  return res.status(204).end();
}

export function logout(req, res) {
  const isProduction = process.env.NODE_ENV === 'production';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; ${isProduction ? 'Secure; SameSite=None' : 'SameSite=Lax'}`);
  return res.status(204).end();
}
