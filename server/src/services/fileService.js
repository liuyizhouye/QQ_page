import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import config from '../config.js';

const dataUrlPattern = /^data:(.+);base64,(.+)$/;
const MAX_UPLOAD_BYTES = config.MAX_UPLOAD_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_BY_SUBDIR = {
  letters: ['application/pdf'],
  moments: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm'],
  misc: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'],
};
const DEFAULT_ALLOWED_MIME_TYPES = Array.from(new Set(Object.values(ALLOWED_MIME_BY_SUBDIR).flat()));

function ensureSubDir(subDir) {
  const targetDir = path.join(config.UPLOAD_DIR, subDir);
  return fs.mkdir(targetDir, { recursive: true }).then(() => targetDir);
}

export async function saveDataUrlToFile(dataUrl, subDir, originalName = '') {
  if (!dataUrl || typeof dataUrl !== 'string') {
    throw new Error('Invalid data URL');
  }
  const match = dataUrl.match(dataUrlPattern);
  if (!match) {
    throw new Error('Unsupported data URL format');
  }
  const [, mimeType, base64Data] = match;
  const buffer = Buffer.from(base64Data, 'base64');
  const validation = await validateUpload(buffer, mimeType, subDir, originalName);
  const extension = validation.extension;
  const fileId = uuid();
  const filename = `${fileId}${extension}`;
  const subDirectory = await ensureSubDir(subDir);
  const filePath = path.join(subDirectory, filename);
  await fs.writeFile(filePath, buffer);
  return {
    relativePath: `${subDir}/${filename}`.replace(/\\/g, '/'),
    publicPath: buildPublicUrl(`${subDir}/${filename}`),
    absolutePath: filePath,
    size: buffer.length,
    mimeType: validation.mimeType,
    filename,
  };
}

export async function deleteStoredFile(relativePath) {
  if (!relativePath) {
    return;
  }
  const safePath = path.normalize(relativePath).replace(/^(\.\.(\/|\\|$))+/, '');
  const absolutePath = path.join(config.UPLOAD_DIR, safePath);
  try {
    await fs.unlink(absolutePath);
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('Failed to remove file', absolutePath, error);
    }
  }
}

function determineExtension(mimeType, originalName) {
  if (!mimeType) {
    return '';
  }
  switch (mimeType) {
    case 'application/pdf':
      return '.pdf';
    case 'image/jpeg':
      return '.jpg';
    case 'image/png':
      return '.png';
    case 'image/gif':
      return '.gif';
    case 'image/webp':
      return '.webp';
    case 'video/mp4':
      return '.mp4';
    case 'video/webm':
      return '.webm';
    default:
      if (originalName) {
        const ext = path.extname(originalName);
        if (ext) {
          return ext;
        }
      }
      return '';
  }
}

export async function ensureUploadSubdirs() {
  await Promise.all([
    ensureSubDir('letters'),
    ensureSubDir('moments'),
    ensureSubDir('moments/thumbs'),
    ensureSubDir('misc'),
  ]);
}

async function validateUpload(buffer, declaredMime, subDir, originalName) {
  if (!Buffer.isBuffer(buffer)) {
    throw new Error('Upload payload is not a valid file buffer');
  }
  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error(`File size exceeds limit of ${config.MAX_UPLOAD_SIZE_MB}MB`);
  }

  const allowedMimes = ALLOWED_MIME_BY_SUBDIR[subDir] || DEFAULT_ALLOWED_MIME_TYPES;
  const normalizedDeclared = (declaredMime || '').split(';')[0].trim().toLowerCase();
  const mimeType = detectMimeType(buffer, normalizedDeclared);

  if (!mimeType || !allowedMimes.includes(mimeType)) {
    throw new Error('Unsupported or unsafe file type');
  }

  let extension = determineExtension(mimeType, '');
  if (!extension) {
    extension = determineExtension(mimeType, originalName);
  }

  return { mimeType, extension: extension || '' };
}

function detectMimeType(buffer, declaredMime) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 4) {
    return declaredMime;
  }

  const checks = [
    { mime: 'image/png', signature: Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]) },
    { mime: 'image/jpeg', signature: Buffer.from([0xff, 0xd8, 0xff]) },
    { mime: 'image/gif', signature: Buffer.from('47494638', 'hex') },
    { mime: 'image/webp', signature: 'RIFF', offsetCheck: { offset: 8, value: 'WEBP' } },
    { mime: 'application/pdf', signature: '%PDF-' },
    { mime: 'video/webm', signature: Buffer.from('1A45DFA3', 'hex') },
    { mime: 'video/mp4', signature: Buffer.from([0x00, 0x00, 0x00]), offsetCheck: { offset: 4, value: 'ftyp' } },
  ];

  for (const check of checks) {
    const { mime, signature, offsetCheck } = check;
    if (!bufferStartsWith(buffer, signature)) {
      continue;
    }
    if (offsetCheck) {
      const { offset, value } = offsetCheck;
      const candidate = buffer.slice(offset, offset + value.length).toString('ascii');
      if (candidate !== value) {
        continue;
      }
    }
    return mime;
  }

  return declaredMime;
}

function bufferStartsWith(buffer, signature) {
  if (typeof signature === 'string') {
    return buffer.slice(0, signature.length).toString('ascii') === signature;
  }
  if (!Buffer.isBuffer(signature)) {
    return false;
  }
  if (buffer.length < signature.length) {
    return false;
  }
  return signature.every
    ? signature.every((value, index) => buffer[index] === value)
    : buffer.slice(0, signature.length).equals(signature);
}

function buildPublicUrl(relativePath) {
  const safePath = relativePath.replace(/\\/g, '/').replace(/^\/+/, '');
  const normalized = `/uploads/${safePath}`;
  if (config.MEDIA_BASE_URL) {
    return `${config.MEDIA_BASE_URL}${normalized}`;
  }
  return normalized;
}
