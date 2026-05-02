const DEFAULT_KEYS = ['access_token', 'refresh_token', 'client_secret', 'private_key', 'api_key', 'authorization', 'cookie', 'password'];
const TOKENISH = /(ya29\.[A-Za-z0-9._-]+|gh[pousr]_[A-Za-z0-9_]{20,}|xox[baprs]-[A-Za-z0-9-]+|AIza[0-9A-Za-z_-]{20,})/g;

export function redactValue(value) {
  if (typeof value !== 'string') return value;
  return value.replace(TOKENISH, '[REDACTED_TOKEN]');
}

export function redactObject(input, keys = DEFAULT_KEYS) {
  if (Array.isArray(input)) return input.map((item) => redactObject(item, keys));
  if (!input || typeof input !== 'object') return redactValue(input);
  return Object.fromEntries(Object.entries(input).map(([key, value]) => {
    const sensitive = keys.some((needle) => key.toLowerCase().includes(needle));
    return [key, sensitive ? '[REDACTED]' : redactObject(value, keys)];
  }));
}

export function redactText(text) {
  return redactValue(String(text));
}
