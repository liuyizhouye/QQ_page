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
  const transformedMedia = media
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }
      const rawUrl = item.url || item.publicPath || item.relativePath || '';
      const rawPoster = item.poster || item.posterSrc || '';
      return {
        ...item,
        url: resolveUrl(rawUrl),
        poster: resolveUrl(rawPoster),
      };
    })
    .filter(Boolean);

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
    submittedAt: row.created_at,
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
    if (Array.isArray(fallback)) {
      return Array.isArray(parsed) ? parsed : fallback;
    }
    if (fallback && typeof fallback === 'object') {
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : fallback;
    }
    return parsed;
  } catch {
    return fallback;
  }
}

function resolveUrl(path) {
  if (!path) return '';
  const normalizedPath = normalizePath(path);
  if (/^(https?:|data:)/i.test(normalizedPath)) return normalizedPath;
  if (config.MEDIA_BASE_URL) {
    const cleanPath = normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;
    return config.MEDIA_BASE_URL + cleanPath;
  }
  return normalizedPath.startsWith('/') ? normalizedPath : '/' + normalizedPath;
}

function normalizePath(path) {
  const normalized = String(path || '').trim().replace(/\\/g, '/').replace(/^\.\//, '');
  if (!normalized) {
    return '';
  }
  if (/^(https?:|data:)/i.test(normalized)) {
    return normalized;
  }
  if (normalized.startsWith('/uploads/')) {
    return normalized;
  }
  if (normalized.startsWith('uploads/')) {
    return '/' + normalized;
  }
  const stripped = normalized.replace(/^\/+/, '');
  if (/^(letters|moments|misc)\//i.test(stripped)) {
    return '/uploads/' + stripped;
  }
  return normalized.startsWith('/') ? normalized : '/' + stripped;
}
