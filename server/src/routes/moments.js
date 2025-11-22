import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';
import requireApiKey from '../middleware/apiKey.js';
import { sanitizeText, validateISODate, ensureArray } from '../utils/validators.js';
import { mapMomentRow } from '../transformers.js';
import { saveDataUrlToFile, deleteStoredFile } from '../services/fileService.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    // 设置响应头，防止缓存，确保所有用户都能看到最新数据
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    
    const rows = db.prepare('SELECT * FROM moments ORDER BY occurred_at DESC').all();
    res.json({ data: rows.map(mapMomentRow) });
  })
);

router.post(
  '/',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const payload = normalizeMomentPayload(req.body);
    if (!payload.title || !payload.occurredAt) {
      return res.status(400).json({ error: '标题与时间为必填项，且时间须为 ISO 格式' });
    }
    const mediaResult = await processMomentMedia(payload.media);
    const now = new Date().toISOString();
    const id = uuid();
    db.prepare(
      `INSERT INTO moments (id, title, occurred_at, description, tags_json, media_json, created_at, updated_at)
       VALUES (@id, @title, @occurred_at, @description, @tags_json, @media_json, @created_at, @updated_at)`
    ).run({
      id,
      title: payload.title,
      occurred_at: payload.occurredAt,
      description: payload.description,
      tags_json: JSON.stringify(payload.tags),
      media_json: JSON.stringify(mediaResult.media),
      created_at: now,
      updated_at: now,
    });
    const row = db.prepare('SELECT * FROM moments WHERE id = ?').get(id);
    res.status(201).json({ data: mapMomentRow(row) });
  })
);

router.put(
  '/:id',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT * FROM moments WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: '未找到对应的瞬间' });
    }
    const payload = normalizeMomentPayload(req.body, existing);
    if (!payload.title || !payload.occurredAt) {
      return res.status(400).json({ error: '标题与时间为必填项，且时间须为 ISO 格式' });
    }
    const existingMedia = JSON.parse(existing.media_json || '[]');
    const mediaResult = await processMomentMedia(payload.media, existingMedia);
    const now = new Date().toISOString();
    db.prepare(
      `UPDATE moments
       SET title=@title, occurred_at=@occurred_at, description=@description,
           tags_json=@tags_json, media_json=@media_json, updated_at=@updated_at
       WHERE id=@id`
    ).run({
      id,
      title: payload.title,
      occurred_at: payload.occurredAt,
      description: payload.description,
      tags_json: JSON.stringify(payload.tags),
      media_json: JSON.stringify(mediaResult.media),
      updated_at: now,
    });
    await Promise.all(mediaResult.toDelete.map((path) => deleteStoredFile(path)));
    const row = db.prepare('SELECT * FROM moments WHERE id = ?').get(id);
    res.json({ data: mapMomentRow(row) });
  })
);

router.delete(
  '/:id',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT media_json FROM moments WHERE id = ?').get(id);
    if (existing) {
      const media = JSON.parse(existing.media_json || '[]');
      await Promise.all(media.map((item) => deleteStoredFile(stripUploadsPrefix(item.relativePath || item.url))));
    }
    db.prepare('DELETE FROM moments WHERE id = ?').run(id);
    res.status(204).end();
  })
);

function normalizeMomentPayload(body, fallback = {}) {
  const title = sanitizeText(body?.title, 200) || fallback.title;
  const occurredAtRaw = sanitizeText(body?.occurredAt, 50) || fallback.occurred_at;
  const description = sanitizeText(body?.description, 2000) || fallback.description || '';
  const tags = ensureArray(body?.tags).map((tag) => sanitizeText(tag, 50)).filter(Boolean);
  const media = ensureArray(body?.media);
  const occurredAt = validateISODate(occurredAtRaw) ? occurredAtRaw : null;
  return { title, occurredAt, description, tags, media };
}

async function processMomentMedia(mediaItems, existingMedia = []) {
  const result = [];
  const existingMap = new Map();
  const toDelete = [];
  existingMedia.forEach((item) => {
    if (item && item.id) {
      existingMap.set(item.id, item);
    }
  });

  for (const item of mediaItems) {
    if (!item) continue;
    const type = item.type === 'video' ? 'video' : 'image';
    const name = sanitizeText(item.name, 255);
    if (item.id && existingMap.has(item.id) && !isDataUrl(item.src)) {
      const kept = existingMap.get(item.id);
      existingMap.delete(item.id);
      result.push({
        id: kept.id,
        type,
        url: kept.url || kept.publicPath || `/uploads/${kept.relativePath || ''}`,
        relativePath: kept.relativePath || stripUploadsPrefix(kept.url || kept.publicPath),
        name: kept.name || name,
        size: kept.size || item.size || 0,
        mimeType: kept.mimeType || item.mimeType || '',
        poster: kept.poster || '',
      });
      continue;
    }
    if (!item.src || !isDataUrl(item.src)) {
      continue;
    }
    const stored = await saveDataUrlToFile(item.src, 'moments', name);
    result.push({
      id: item.id || uuid(),
      type,
      url: stored.publicPath,
      relativePath: stored.relativePath,
      name: name || stored.filename,
      size: stored.size,
      mimeType: stored.mimeType,
      poster: '',
    });
  }

  existingMap.forEach((value) => {
    if (value.relativePath) {
      toDelete.push(value.relativePath);
    } else if (value.url) {
      toDelete.push(stripUploadsPrefix(value.url));
    }
  });

  return { media: result, toDelete };
}

function isDataUrl(value) {
  return typeof value === 'string' && value.startsWith('data:');
}

function stripUploadsPrefix(urlPath) {
  if (!urlPath) return '';
  return urlPath.replace(/^\/?uploads\//, '');
}

export default router;
