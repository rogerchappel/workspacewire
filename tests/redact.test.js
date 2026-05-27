import test from 'node:test';
import assert from 'node:assert/strict';
import { redactObject, redactText } from '../src/redact.js';

test('redactText replaces token-shaped strings in logs', () => {
  assert.equal(
    redactText('Authorization: Bearer ya29.example_token_value'),
    'Authorization: Bearer [REDACTED_TOKEN]'
  );
});

test('redactObject redacts sensitive keys and nested token values', () => {
  const redacted = redactObject({
    client_secret: 'super-secret-value',
    nested: {
      note: 'use ghp_abcdefghijklmnopqrstuvwxyz1234567890 for this call'
    }
  });

  assert.equal(redacted.client_secret, '[REDACTED]');
  assert.equal(redacted.nested.note, 'use [REDACTED_TOKEN] for this call');
});
