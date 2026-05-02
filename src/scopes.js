import { SCOPE_DETAILS, SERVICES } from './catalog.js';

export function recommendScopes(service, operation) {
  const serviceSpec = SERVICES[service];
  const opSpec = serviceSpec?.operations?.[operation];
  if (!opSpec) return [];
  return [...opSpec.scopes];
}

export function explainScopes(scopeNames) {
  return scopeNames.map((name) => ({ name, ...(SCOPE_DETAILS[name] ?? { url: name, risk: 'unknown', reason: 'No local explanation available.' }) }));
}

export function scopeMatrix() {
  return Object.entries(SERVICES).flatMap(([service, spec]) => Object.entries(spec.operations).map(([operation, op]) => ({
    service,
    operation,
    mutates: Boolean(op.mutates),
    scopes: explainScopes(op.scopes)
  })));
}
