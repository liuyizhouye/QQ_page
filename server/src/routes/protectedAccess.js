import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import config from '../config.js';
import {
  clearProtectedAccessCookie,
  isProtectedAccessConfigured,
  isValidProtectedPassword,
  requestHasProtectedAccess,
  setProtectedAccessCookie,
} from '../middleware/protectedAccess.js';

const router = Router();

const unlockLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: { error: '尝试次数过多，请稍后再试' },
});

router.get('/status', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.json({
    data: {
      unlocked: requestHasProtectedAccess(req),
      configured: isProtectedAccessConfigured(),
    },
  });
});

router.post('/unlock', unlockLimiter, (req, res) => {
  res.setHeader('Cache-Control', 'no-store');

  if (!isProtectedAccessConfigured()) {
    return res.status(500).json({ error: 'Protected access password not configured' });
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!password.trim()) {
    return res.status(400).json({ error: 'Password is required' });
  }

  if (!isValidProtectedPassword(password)) {
    clearProtectedAccessCookie(res);
    return res.status(401).json({ error: 'Invalid password' });
  }

  setProtectedAccessCookie(res);
  return res.json({ data: { unlocked: true } });
});

router.post('/logout', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  clearProtectedAccessCookie(res);
  res.json({ data: { unlocked: false } });
});

export default router;
