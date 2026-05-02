# Orchestration

`workspacewire` is meant to sit before any live workspace automation.

1. An agent asks for a plan with a service, operation, filters, and output format.
2. The planner validates required options and loads local fixtures.
3. The planner returns a dry-run request description, scope rationale, and redacted preview.
4. A human or higher-level orchestrator reviews the plan.
5. Future adapters remain disabled unless a separate project explicitly enables them.

## Guardrails

- Prefer metadata-only scopes when a task does not need content.
- Never ask for send/write scopes for read-only tasks.
- Keep fixture data in versioned test files.
- Scan config files before they are handed to an adapter.
- Treat JSON output as the canonical agent handoff format.
