function isEmpty(v) {
  return v === undefined || v === null || v === '';
}

export function coerceBoolean(v) {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v !== 'string') return v;
  const s = v.trim().toLowerCase();
  if (['true', '1', 'yes', 'on'].includes(s)) return true;
  if (['false', '0', 'no', 'off'].includes(s)) return false;
  return v;
}

export function coerceInt(v) {
  if (isEmpty(v)) return v;
  if (typeof v === 'number' && Number.isInteger(v)) return v;
  const n = parseInt(String(v), 10);
  return Number.isNaN(n) ? v : n;
}

export function coerceFloat(v) {
  if (isEmpty(v)) return v;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v));
  return Number.isNaN(n) ? v : n;
}

export function parseJsonIfString(v) {
  if (typeof v !== 'string') return v;
  const s = v.trim();
  if (!s) return v;
  if (!(s.startsWith('{') || s.startsWith('['))) return v;

  try {
    return JSON.parse(s);
  } catch {
    return v;
  }
}

export function parseStringList(v) {
  if (isEmpty(v)) return null;
  if (Array.isArray(v)) return v;

  const parsed = parseJsonIfString(v);
  if (Array.isArray(parsed)) return parsed;

  if (typeof v === 'string') {
    const items = v
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    return items.length ? items : null;
  }

  return null;
}

export function normalizeProductPayload(raw) {
  const payload = raw && typeof raw === 'object' ? { ...raw } : {};

  // Multipart form-data values arrive as strings.
  payload.category_id = coerceInt(payload.category_id);
  payload.subcategory_id = coerceInt(payload.subcategory_id);
  payload.price = coerceFloat(payload.price);
  payload.discount_price = coerceFloat(payload.discount_price);
  payload.stock_quantity = coerceInt(payload.stock_quantity);
  payload.is_available = coerceBoolean(payload.is_available);
  payload.average_rating = coerceFloat(payload.average_rating);
  payload.total_reviews = coerceInt(payload.total_reviews);
  payload.weight = coerceFloat(payload.weight);

  payload.image_urls = parseStringList(payload.image_urls);
  payload.keywords = parseStringList(payload.keywords);

  const variants = parseJsonIfString(payload.variants);
  if (Array.isArray(variants)) {
    payload.variants = variants;
  }

  return payload;
}

export function normalizeVariantPayload(raw) {
  const payload = raw && typeof raw === 'object' ? { ...raw } : {};

  payload.product_id = coerceInt(payload.product_id);
  payload.price = coerceFloat(payload.price);
  payload.discount_price = coerceFloat(payload.discount_price);
  payload.stock_quantity = coerceInt(payload.stock_quantity);
  payload.is_available = coerceBoolean(payload.is_available);
  payload.weight = coerceFloat(payload.weight);

  return payload;
}
