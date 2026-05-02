const SECRET_RULES = [
  { id: 'google-api-key', pattern: /AIza[0-9A-Za-z_-]{20,}/g, severity: 'high' },
  { id: 'oauth-token', pattern: /ya29\.[0-9A-Za-z._-]+/g, severity: 'high' },
  { id: 'private-key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH |)PRIVATE KEY-----/g, severity: 'critical' },
  { id: 'generic-secret-key', pattern: /(?:client_secret|refresh_token|access_token|api_key)\s*[:=]\s*["']?[^"'\s,}]{8,}/gi, severity: 'medium' }
];

export function scanText(text) {
  const findings = [];
  for (const rule of SECRET_RULES) {
    for (const match of String(text).matchAll(rule.pattern)) {
      findings.push({ rule: rule.id, severity: rule.severity, index: match.index ?? 0, sample: String(match[0]).slice(0, 18) + '…' });
    }
  }
  return findings;
}

export function assertNoSecrets(text, label = 'input') {
  const findings = scanText(text);
  if (findings.length) {
    const error = new Error(`${label} contains ${findings.length} possible secret(s)`);
    error.findings = findings;
    throw error;
  }
  return true;
}
