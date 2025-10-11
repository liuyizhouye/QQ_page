import { Router } from 'express';
import { v4 as uuid } from 'uuid';
import db from '../db.js';
import asyncHandler from '../middleware/asyncHandler.js';
import requireApiKey from '../middleware/apiKey.js';
import { sanitizeText, validateISODate } from '../utils/validators.js';
import { mapLoveNoteRow } from '../transformers.js';
import { saveDataUrlToFile, deleteStoredFile } from '../services/fileService.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const writer = sanitizeText(req.query.writer, 50);
    let query = 'SELECT * FROM love_notes';
    const params = {};
    if (writer) {
      query += ' WHERE writer = @writer';
      params.writer = writer;
    }
    query += ' ORDER BY date DESC';
    const rows = db.prepare(query).all(params);
    res.json({ data: rows.map(mapLoveNoteRow) });
  })
);

router.post(
  '/',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const writer = sanitizeText(req.body.writer, 50);
    const recipient = sanitizeText(req.body.recipient, 50);
    const date = sanitizeText(req.body.date, 50);
    const title = sanitizeText(req.body.title, 200);
    const excerpt = sanitizeText(req.body.excerpt, 1000);
    const pdfName = sanitizeText(req.body.pdfName, 255);
    const pdfData = req.body.pdfData;

    if (!writer || !validateISODate(date) || !pdfData) {
      return res.status(400).json({ error: '写信人、日期与 PDF 文件为必填项' });
    }

    const storedPdf = await saveDataUrlToFile(pdfData, 'letters', pdfName || 'letter.pdf');
    const id = uuid();
    const now = new Date().toISOString();
    db.prepare(
      `INSERT INTO love_notes
        (id, writer, recipient, date, title, excerpt, pdf_path, pdf_name, pdf_size, created_at, updated_at)
       VALUES
        (@id, @writer, @recipient, @date, @title, @excerpt, @pdf_path, @pdf_name, @pdf_size, @created_at, @updated_at)`
    ).run({
      id,
      writer,
      recipient,
      date,
      title,
      excerpt,
      pdf_path: storedPdf.publicPath,
      pdf_name: pdfName || storedPdf.filename,
      pdf_size: storedPdf.size,
      created_at: now,
      updated_at: now,
    });
    const row = db.prepare('SELECT * FROM love_notes WHERE id = ?').get(id);
    res.status(201).json({ data: mapLoveNoteRow(row) });
  })
);

router.delete(
  '/:id',
  requireApiKey,
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    const existing = db.prepare('SELECT pdf_path FROM love_notes WHERE id = ?').get(id);
    if (existing) {
      await deleteStoredFile(stripUploadsPrefix(existing.pdf_path));
    }
    db.prepare('DELETE FROM love_notes WHERE id = ?').run(id);
    res.status(204).end();
  })
);

function stripUploadsPrefix(path) {
  if (!path) return '';
  return path.replace(/^\/?uploads\//, '');
}

export default router;
