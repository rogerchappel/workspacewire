import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('cli emits json dry-run plans', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', 'plan', 'drive', 'find', '--query', 'roadmap', '--format', 'json'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.service, 'drive');
  assert.equal(parsed.safety.executesRequest, false);
});

test('cli scan exits nonzero on secrets', () => {
  const result = spawnSync(process.execPath, ['src/cli.js', 'scan', '--config', 'tests/fixtures/unsafe-config.txt'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stdout, /google-api-key|generic-secret-key/);
});
