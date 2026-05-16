export function productPayloadToFormData(payload) {
  const formData = new FormData();
  const data = payload && typeof payload === 'object' ? payload : {};

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (value === null) continue;

    if (Array.isArray(value) || (typeof value === 'object' && value !== null)) {
      formData.append(key, JSON.stringify(value));
      continue;
    }

    formData.append(key, String(value));
  }

  return formData;
}
