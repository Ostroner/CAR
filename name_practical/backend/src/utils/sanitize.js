import sanitizeHtml from 'sanitize-html';

export function cleanString(value) {
  if (typeof value !== 'string') return value;
  return sanitizeHtml(value.trim(), { allowedTags: [], allowedAttributes: {} });
}

export function cleanObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  return Object.fromEntries(Object.entries(obj).map(([key, value]) => [key, cleanString(value)]));
}
