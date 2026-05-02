import { getOperation } from './catalog.js';
import { loadFixture, filterFixture } from './fixtures.js';
import { explainScopes } from './scopes.js';
import { redactObject } from './redact.js';

export async function planOperation({ service, operation, options = {}, fixtureDir } = {}) {
  const { serviceSpec, opSpec } = getOperation(service, operation);
  const missing = (opSpec.required ?? []).filter((key) => !options[key]);
  if (missing.length) throw new Error(`Missing required option(s): ${missing.join(', ')}`);
  const fixture = await loadFixture(service, fixtureDir);
  const preview = filterFixture(service, operation, fixture, options).slice(0, Number(options.limit ?? 5));
  const path = opSpec.path.replace('{fileId}', encodeURIComponent(options.fileId ?? 'FILE_ID'));
  const blocked = Boolean(opSpec.mutates || opSpec.disabledReason);
  return redactObject({
    tool: 'workspacewire',
    mode: 'dry-run',
    service,
    serviceName: serviceSpec.displayName,
    operation,
    safety: {
      liveOAuth: false,
      executesRequest: false,
      storesCredentials: false,
      blocked,
      reason: blocked ? opSpec.disabledReason ?? 'Mutating operations are never executed.' : 'Fixture-backed read-only plan.'
    },
    request: {
      method: opSpec.method,
      path,
      params: options,
      body: blocked ? '[not generated: disabled operation]' : null
    },
    scopes: explainScopes(opSpec.scopes),
    fixture: {
      source: serviceSpec.fixture,
      matched: preview.length,
      items: preview
    },
    nextSteps: [
      'Review the scope explanation before any future live adapter is enabled.',
      'Keep using --format json for agent handoff and --format text for humans.',
      'Do not paste OAuth secrets into config files; run workspacewire scan first.'
    ]
  });
}
