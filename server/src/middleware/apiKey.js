import config from '../config.js';

export function extractApiKey(req) {
  const headerKey = req.header('x-api-key') || req.header('authorization') || '';
  return headerKey.startsWith('Bearer ') ? headerKey.slice(7) : headerKey;
}

export function isValidApiKey(token) {
  if (!config.ADMIN_API_KEYS.length) {
    return false;
  }
  return Boolean(token && config.ADMIN_API_KEYS.includes(token));
}

export function requestHasValidApiKey(req) {
  return isValidApiKey(extractApiKey(req));
}

export default function requireApiKey(req, res, next) {
  if (!config.ADMIN_API_KEYS.length) {
    return res.status(500).json({ error: 'Server API key not configured' });
  }
  if (!requestHasValidApiKey(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
