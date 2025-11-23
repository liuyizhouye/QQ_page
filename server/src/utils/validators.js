const ISO_REGEX = /^\d{4}-\d{2}-\d{2}([T\s]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:\d{2})?)?$/;

export function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function sanitizeText(value, maxLength = 5000) {
  if (typeof value !== 'string') {
    return '';
  }
  const trimmed = value.trim().slice(0, maxLength);
  return escapeHtml(trimmed);
}

export function ensureArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value;
}

export function validateISODate(value) {
  if (!value || typeof value !== 'string') {
    return false;
  }
  return ISO_REGEX.test(value.trim());
}

export function clampToPositive(value, fallback = 0) {
  const num = parseInt(value, 10);
  if (Number.isNaN(num) || num < 0) {
    return fallback;
  }
  return num;
}
