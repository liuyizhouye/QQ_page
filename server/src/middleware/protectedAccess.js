import crypto from 'crypto';
import config from '../config.js';
import { requestHasValidApiKey } from './apiKey.js';

const COOKIE_NAME = 'qq_story_unlock';

export function isProtectedAccessConfigured() {
  return Boolean(config.PROTECTED_ACCESS_PASSWORD);
}

export function isValidProtectedPassword(password) {
  if (!isProtectedAccessConfigured()) {
    return false;
  }
  return safeEqual(String(password || ''), config.PROTECTED_ACCESS_PASSWORD);
}

export function requestHasProtectedAccess(req) {
  if (requestHasValidApiKey(req)) {
    return true;
  }
  if (!isProtectedAccessConfigured()) {
    return false;
  }
  const cookies = parseCookies(req);
  const token = cookies[COOKIE_NAME] || '';
  const expected = createProtectedAccessToken();
  return Boolean(token && expected && safeEqual(token, expected));
}

export function setProtectedAccessCookie(res) {
  const token = createProtectedAccessToken();
  if (!token) {
    return;
  }
  res.append('Set-Cookie', serializeCookie(COOKIE_NAME, token, {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax',
    secure: config.NODE_ENV === 'production',
  }));
}

export function clearProtectedAccessCookie(res) {
  res.append('Set-Cookie', serializeCookie(COOKIE_NAME, '', {
    httpOnly: true,
    path: '/',
    sameSite: 'Lax',
    secure: config.NODE_ENV === 'production',
    expires: new Date(0),
    maxAge: 0,
  }));
}

export default function requireProtectedAccess(req, res, next) {
  if (requestHasProtectedAccess(req)) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized' });
}

function createProtectedAccessToken() {
  if (!isProtectedAccessConfigured()) {
    return '';
  }
  const secret = config.ADMIN_API_KEYS.length
    ? config.ADMIN_API_KEYS.join('\n')
    : config.PROTECTED_ACCESS_PASSWORD;
  return crypto
    .createHmac('sha256', secret)
    .update(config.PROTECTED_ACCESS_PASSWORD)
    .digest('hex');
}

function parseCookies(req) {
  const header = req.headers.cookie || '';
  if (!header) {
    return {};
  }
  return header.split(';').reduce((acc, part) => {
    const trimmed = part.trim();
    if (!trimmed) {
      return acc;
    }
    const separatorIndex = trimmed.indexOf('=');
    const key = separatorIndex >= 0 ? trimmed.slice(0, separatorIndex).trim() : trimmed;
    const value = separatorIndex >= 0 ? trimmed.slice(separatorIndex + 1).trim() : '';
    if (!key) {
      return acc;
    }
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a || ''), 'utf8');
  const right = Buffer.from(String(b || ''), 'utf8');
  if (left.length !== right.length) {
    return false;
  }
  return crypto.timingSafeEqual(left, right);
}

function serializeCookie(name, value, options = {}) {
  const segments = [`${name}=${encodeURIComponent(value)}`];
  if (options.maxAge !== undefined) {
    segments.push(`Max-Age=${options.maxAge}`);
  }
  if (options.expires) {
    segments.push(`Expires=${options.expires.toUTCString()}`);
  }
  if (options.path) {
    segments.push(`Path=${options.path}`);
  }
  if (options.httpOnly) {
    segments.push('HttpOnly');
  }
  if (options.secure) {
    segments.push('Secure');
  }
  if (options.sameSite) {
    segments.push(`SameSite=${options.sameSite}`);
  }
  return segments.join('; ');
}
