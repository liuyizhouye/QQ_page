import config from './config.js';

export function mapMilestoneRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    occurredAt: row.occurred_at,
    location: row.location || '',
    detail: row.detail || '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapMomentRow(row) {
  if (!row) return null;
  const media = safeParseJson(row.media_json, []);
  // Transform media URLs if MEDIA_BASE_URL is set
  const transformedMedia = media.map(item => ({
    ...item,
    url: resolveUrl(item.url)
  }));

  return {
    id: row.id,
    title: row.title,
    occurredAt: row.occurred_at,
    description: row.description || '',
    tags: safeParseJson(row.tags_json, []),
    media: transformedMedia,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapCommentRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    author: row.author || '',
    message: row.message,
    createdAt: row.created_at,
  };
}

export function mapLoveNoteRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    writer: row.writer,
    recipient: row.recipient || '',
    date: row.date,
    title: row.title || '',
    excerpt: row.excerpt || '',
    pdfUrl: resolveUrl(row.pdf_path),
    pdfName: row.pdf_name || '',
    pdfSize: row.pdf_size || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function safeParseJson(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) || typeof parsed === 'object' ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function resolveUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  
  if (config.MEDIA_BASE_URL) {
    const cleanPath = path.startsWith('/') ? path : '/' + path;
    return config.MEDIA_BASE_URL + cleanPath;
  }
  return path;
}
