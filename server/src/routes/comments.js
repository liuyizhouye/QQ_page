import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';
import requireApiKey from '../middleware/apiKey.js';
import { sanitizeText, clampToPositive } from '../utils/validators.js';
import { mapCommentRow } from '../transformers.js';
import config from '../config.js';

const router = Router();

const commentLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MINUTES * 60 * 1000,
  max: Math.max(config.RATE_LIMIT_MAX_REQUESTS, 20),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  message: { error: '操作过于频繁，请稍后再试' },
});

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // 设置响应头，防止缓存，确保所有用户都能看到最新评论
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const pageSize = Math.min(Math.max(parseInt(req.query.pageSize || '5', 10), 1), 100);
    const offset = (page - 1) * pageSize;
    
    // 检查是否有管理员权限（通过 x-api-key header）
    const hasAdminKey = req.headers['x-api-key'] === config.ADMIN_API_KEY && config.ADMIN_API_KEY;
    
    // 管理员可以看到所有留言（包括隐藏的），访客只能看到公开的
    const whereClause = hasAdminKey ? '' : 'WHERE is_public = 1';
    const total = db.prepare(`SELECT COUNT(*) as count FROM comments ${whereClause}`).get().count;
    const rows = db
      .prepare(
        `SELECT * FROM comments
         ${whereClause}
         ORDER BY created_at DESC
         LIMIT @limit OFFSET @offset`
      )
      .all({ limit: pageSize, offset });
    res.json({
      data: rows.map(mapCommentRow),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  })
);

router.post(
  '/',
  commentLimiter,
  asyncHandler(async (req, res) => {
    const author = sanitizeText(req.body.author, 100);
    const message = sanitizeText(req.body.message, 1000);
    if (!message) {
      return res.status(400).json({ error: '留言内容不能为空' });
    }
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO comments (id, author, message, created_at, ip_address, is_public)
       VALUES (@id, @author, @message, @created_at, @ip_address, 1)`
    ).run({
      id,
      author,
      message,
      created_at: now,
      ip_address: req.ip,
    });
    const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(id);
    res.status(201).json({ data: mapCommentRow(row) });
  })
);

router.delete(
  '/:id',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    db.prepare('DELETE FROM comments WHERE id = ?').run(id);
    res.status(204).end();
  })
);

router.post(
  '/:id/hide',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    db.prepare('UPDATE comments SET is_public = 0 WHERE id = ?').run(id);
    res.status(200).json({ data: { id, hidden: true } });
  })
);

export default router;
