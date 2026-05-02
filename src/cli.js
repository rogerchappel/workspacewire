#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { planOperation } from './planner.js';
import { scopeMatrix, explainScopes } from './scopes.js';
import { renderJson } from './renderers/json.js';
import { renderText } from './renderers/text.js';
import { scanText } from './secrets.js';

function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift();
  const positional = [];
  const flags = {};
  while (args.length) {
    const token = args.shift();
    if (token.startsWith('--')) {
      const [rawKey, inline] = token.slice(2).split('=');
      flags[rawKey] = inline ?? (args[0] && !args[0].startsWith('--') ? args.shift() : true);
    } else positional.push(token);
  }
  return { command, positional, flags };
}

function help() {
  return `workspacewire — local-first Google Workspace operation planner

Usage:
  workspacewire plan <gmail|calendar|drive|contacts> <operation> [--query text] [--fileId id] [--format text|json]
  workspacewire scopes [--format text|json]
  workspacewire scan --config path

Examples:
  workspacewire plan gmail search --query invoice --format text
  workspacewire plan drive find --query roadmap --format json
`;
}

async function main() {
  const { command, positional, flags } = parseArgs(process.argv.slice(2));
  if (!command || command === 'help' || flags.help) { process.stdout.write(help()); return; }
  if (command === 'plan') {
    const [service, operation] = positional;
    const plan = await planOperation({ service, operation, options: flags, fixtureDir: flags['fixture-dir'] });
    process.stdout.write(flags.format === 'json' ? renderJson(plan) : renderText(plan));
    return;
  }
  if (command === 'scopes') {
    const matrix = scopeMatrix();
    if (flags.format === 'json') process.stdout.write(`${JSON.stringify(matrix, null, 2)}\n`);
    else process.stdout.write(matrix.map((row) => `${row.service}/${row.operation}: ${row.scopes.map((scope) => scope.name).join(', ')}${row.mutates ? ' [disabled/mutating]' : ''}`).join('\n') + '\n');
    return;
  }
  if (command === 'explain-scope') {
    process.stdout.write(`${JSON.stringify(explainScopes(positional), null, 2)}\n`);
    return;
  }
  if (command === 'scan') {
    if (!flags.config) throw new Error('scan requires --config <path>');
    const raw = await readFile(flags.config, 'utf8');
    const findings = scanText(raw);
    process.stdout.write(`${JSON.stringify({ ok: findings.length === 0, findings }, null, 2)}
`);
    if (findings.length) process.exitCode = 2;
    return;
  }
  throw new Error(`Unknown command "${command}".
${help()}`);
}

main().catch((error) => { console.error(`workspacewire: ${error.message}`); process.exit(1); });
