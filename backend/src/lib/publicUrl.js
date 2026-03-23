export function getRequestBaseUrl(req) {
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = (forwardedProto ? String(forwardedProto) : req.protocol)
    .split(',')[0]
    .trim();
  const host = req.get('host');
  return `${proto}://${host}`;
}

export function toPublicUrl(req, pathOrUrl) {
  if (!pathOrUrl) return null;
  const value = String(pathOrUrl);
  if (/^https?:\/\//i.test(value)) return value;
  const normalized = value.startsWith('/') ? value : `/${value}`;
  return `${getRequestBaseUrl(req)}${normalized}`;
}
