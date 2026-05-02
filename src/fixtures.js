import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SERVICES } from './catalog.js';

export async function loadFixture(service, fixtureDir = new URL('../tests/fixtures/', import.meta.url).pathname) {
  const file = SERVICES[service]?.fixture;
  if (!file) throw new Error(`No fixture registered for ${service}`);
  const raw = await readFile(join(fixtureDir, file), 'utf8');
  return JSON.parse(raw);
}

export function filterFixture(service, operation, data, options = {}) {
  const q = String(options.query ?? options.q ?? '').toLowerCase();
  if (!q) return data.items ?? data;
  const items = data.items ?? data;
  return items.filter((item) => JSON.stringify(item).toLowerCase().includes(q));
}
