import config from '../config.js';

export default function requireApiKey(req, res, next) {
  if (!config.ADMIN_API_KEY) {
    return res.status(500).json({ error: 'Server API key not configured' });
  }
  const headerKey = req.header('x-api-key') || req.header('authorization') || '';
  const token = headerKey.startsWith('Bearer ') ? headerKey.slice(7) : headerKey;
  if (!token || token !== config.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}
