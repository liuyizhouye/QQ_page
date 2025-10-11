import fs from 'fs/promises';
import path from 'path';
import { v4 as uuid } from 'uuid';
import config from '../config.js';

const dataUrlPattern = /^data:(.+);base64,(.+)$/;

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
  const extension = determineExtension(mimeType, originalName);
  const fileId = uuid();
  const filename = `${fileId}${extension}`;
  const subDirectory = await ensureSubDir(subDir);
  const filePath = path.join(subDirectory, filename);
  await fs.writeFile(filePath, buffer);
  return {
    relativePath: `${subDir}/${filename}`.replace(/\\/g, '/'),
    publicPath: `/uploads/${subDir}/${filename}`.replace(/\\/g, '/'),
    absolutePath: filePath,
    size: buffer.length,
    mimeType,
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
  if (originalName) {
    const ext = path.extname(originalName);
    if (ext) {
      return ext;
    }
  }
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
