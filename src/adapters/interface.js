export class WorkspaceAdapter {
  constructor() {
    if (new.target === WorkspaceAdapter) throw new Error('WorkspaceAdapter is an interface.');
  }
  async request() { throw new Error('Adapters are disabled by default in workspacewire v1.'); }
}

export function adapterStatus() {
  return { enabled: false, reason: 'No live Google adapter ships in v1; planning is fixture-backed only.' };
}
