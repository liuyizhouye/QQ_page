import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';
import requireApiKey from '../middleware/apiKey.js';
import { sanitizeText, validateISODate } from '../utils/validators.js';
import { mapMilestoneRow } from '../transformers.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // 设置响应头，防止缓存，确保所有用户都能看到最新数据
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const rows = db.prepare('SELECT * FROM milestones ORDER BY occurred_at DESC').all();
    res.json({ data: rows.map(mapMilestoneRow) });
  })
);

router.post(
  '/',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const title = sanitizeText(req.body.title, 200);
    const occurredAt = sanitizeText(req.body.occurredAt, 50);
    const location = sanitizeText(req.body.location, 200);
    const detail = sanitizeText(req.body.detail, 2000);
    if (!title || !validateISODate(occurredAt)) {
      return res.status(400).json({ error: '标题和时间是必填项，且时间需为 ISO 格式' });
    }
    const now = new Date().toISOString();
    const id = uuid();
    db.prepare(
      `INSERT INTO milestones (id, title, occurred_at, location, detail, created_at, updated_at)
       VALUES (@id, @title, @occurred_at, @location, @detail, @created_at, @updated_at)`
    ).run({
      id,
      title,
      occurred_at: occurredAt,
      location,
      detail,
      created_at: now,
      updated_at: now,
    });
    const row = db.prepare('SELECT * FROM milestones WHERE id = ?').get(id);
    res.status(201).json({ data: mapMilestoneRow(row) });
  })
);

router.put(
  '/:id',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM milestones WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '未找到对应的里程碑' });
    }
    const title = sanitizeText(req.body.title, 200) || existing.title;
    const occurredAt = sanitizeText(req.body.occurredAt, 50) || existing.occurred_at;
    const location = sanitizeText(req.body.location, 200);
    const detail = sanitizeText(req.body.detail, 2000);
    if (!validateISODate(occurredAt)) {
      return res.status(400).json({ error: '时间格式必须为 ISO 标准' });
    }
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE milestones
       SET title=@title, occurred_at=@occurred_at, location=@location, detail=@detail, updated_at=@updated_at
       WHERE id = @id`
    ).run({
      id,
      title,
      occurred_at: occurredAt,
      location,
      detail,
      updated_at: now,
    });
    const row = db.prepare('SELECT * FROM milestones WHERE id = ?').get(id);
    res.json({ data: mapMilestoneRow(row) });
  })
);

router.delete(
  '/:id',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    db.prepare('DELETE FROM milestones WHERE id = ?').run(id);
    res.status(204).end();
  })
);

export default router;
