#!/usr/bin/env node
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';

const RELEASEBOX_REPO = 'https://github.com/rogerchappel/releasebox.git';
const RELEASEBOX_REF = process.env.RELEASEBOX_REF ?? 'v0.1.0';
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('usage: node scripts/releasebox.mjs <releasebox command> [args...]');
  process.exit(2);
}

const tempRoot = await mkdtemp(join(tmpdir(), 'workspacewire-releasebox-'));
const checkout = join(tempRoot, 'releasebox');

function run(command, commandArgs, options = {}) {
  const result = spawnSync(command, commandArgs, {
    stdio: 'inherit',
    ...options
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

try {
  run('git', ['-c', 'advice.detachedHead=false', 'clone', '--quiet', '--depth', '1', '--branch', RELEASEBOX_REF, RELEASEBOX_REPO, checkout], {
    stdio: ['ignore', 'ignore', 'inherit']
  });
  run('npm', ['ci', '--silent'], { cwd: checkout, stdio: ['ignore', 'ignore', 'inherit'] });
  run('npm', ['run', 'build', '--silent'], { cwd: checkout, stdio: ['ignore', 'ignore', 'inherit'] });
  run('node', [join(checkout, 'bin/releasebox.js'), ...args]);
} finally {
  await rm(tempRoot, { recursive: true, force: true });
}
