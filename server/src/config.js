import fs from 'fs';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const resolvePath = (p, fallback) => {
  if (!p) {
    return path.resolve(__dirname, '..', fallback);
  }
  if (p.startsWith('/')) {
    return p;
  }
  return path.resolve(__dirname, '..', p);
};

const PORT = parseInt(process.env.PORT || '8080', 10);
const NODE_ENV = process.env.NODE_ENV || 'production';
const DATABASE_FILE = resolvePath(process.env.DATABASE_FILE, 'database/qq_story.db');
const UPLOAD_DIR = resolvePath(process.env.UPLOAD_DIR, 'uploads');
const LOG_DIR = resolvePath(process.env.LOG_DIR, 'logs');
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';
const MAX_UPLOAD_SIZE_MB = parseInt(process.env.MAX_UPLOAD_SIZE_MB || '20', 10);
const RATE_LIMIT_WINDOW_MINUTES = parseInt(process.env.RATE_LIMIT_WINDOW_MINUTES || '15', 10);
const RATE_LIMIT_MAX_REQUESTS = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10);
const MEDIA_BASE_URL = (process.env.MEDIA_BASE_URL || '').replace(/\/$/, '');

const ALLOWED_ORIGINS = (() => {
  const raw = process.env.ALLOWED_ORIGINS;
  if (!raw || raw.trim() === '' || raw.trim() === '*') {
    return ['*'];
  }
  return raw.split(',').map((entry) => entry.trim()).filter(Boolean);
})();

[path.dirname(DATABASE_FILE), UPLOAD_DIR, LOG_DIR].forEach((dir) => {
  fs.mkdirSync(dir, { recursive: true });
});

export default {
  PORT,
  NODE_ENV,
  DATABASE_FILE,
  UPLOAD_DIR,
  LOG_DIR,
  ADMIN_API_KEY,
  MAX_UPLOAD_SIZE_MB,
  RATE_LIMIT_WINDOW_MINUTES,
  RATE_LIMIT_MAX_REQUESTS,
  MEDIA_BASE_URL,
  ALLOWED_ORIGINS,
};
