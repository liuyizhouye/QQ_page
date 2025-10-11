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
  return {
    id: row.id,
    title: row.title,
    occurredAt: row.occurred_at,
    description: row.description || '',
    tags: safeParseJson(row.tags_json, []),
    media: safeParseJson(row.media_json, []),
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
    pdfUrl: row.pdf_path || '',
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
