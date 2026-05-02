import test from 'node:test';
import assert from 'node:assert/strict';
import { planOperation, scanText, redactObject, scopeMatrix } from '../src/index.js';

test('plans a read-only gmail search from fixtures', async () => {
  const plan = await planOperation({ service: 'gmail', operation: 'search', options: { query: 'invoice' } });
  assert.equal(plan.mode, 'dry-run');
  assert.equal(plan.safety.executesRequest, false);
  assert.equal(plan.scopes[0].name, 'gmail.readonly');
  assert.equal(plan.fixture.items[0].id, 'msg_001');
});

test('marks mutating operations as blocked', async () => {
  const plan = await planOperation({ service: 'calendar', operation: 'create', options: { summary: 'hold' } });
  assert.equal(plan.safety.blocked, true);
  assert.match(plan.safety.reason, /not executed|mutations/i);
});

test('redacts nested secrets', () => {
  assert.deepEqual(redactObject({ client_secret: 'abc', nested: { ok: 'yes' } }), { client_secret: '[REDACTED]', nested: { ok: 'yes' } });
});

test('secret scanner finds google-like api keys', () => {
  assert.equal(scanText('api_key: AIza12345678901234567890abcd').length, 1);
});

test('scope matrix includes contacts lookup', () => {
  assert.ok(scopeMatrix().some((row) => row.service === 'contacts' && row.operation === 'lookup'));
});
