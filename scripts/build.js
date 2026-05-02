#!/usr/bin/env node
import { mkdir, cp, writeFile } from 'node:fs/promises';
await mkdir('dist', { recursive: true });
await cp('src', 'dist/src', { recursive: true });
await writeFile('dist/README.txt', 'workspacewire build artifact: source copied for package smoke tests.
');
console.log('build ok: dist/src ready');
