# workspacewire

Status: in-progress

## Scorecard

Total: 82/100
Band: strong
Last scored: 2026-05-02
Scored by: Neo

| Criterion | Points | Notes |
|---|---:|---|
| Problem pain | 17/20 | Developers and agents need scriptable access to Gmail/Calendar/Drive-like workflows, but full Google API CLIs are high-risk. |
| Demand signal | 16/20 | Inspired by steipete/gogcli and broad demand for Google Workspace automation. |
| V1 buildability | 17/20 | A safe fixture-backed command planner and OAuth-scope explainer is feasible today. |
| Differentiation | 13/15 | Safety-first agent command planner rather than broad API clone. |
| Agentic workflow leverage | 13/15 | Helps agents prepare least-privilege workspace operations without touching live data. |
| Distribution potential | 6/10 | Useful if examples are crisp. |

## Pitch

A safety-first Google Workspace command planner for agents: generate least-privilege scopes, dry-run request plans, and fixture-backed JSON outputs before any real API integration.

## Why It Matters

A direct gogcli clone would be too broad and credential-heavy. `workspacewire` gives Roger the same professional signal — terminal automation for productivity systems — while staying original and safe.

## Attribution / Inspiration

Inspired by the category represented by steipete/gogcli. Do not copy commands, code, docs, or naming. Build an original local-first planner with future adapter seams.

## V1 Scope

- CLI commands for Gmail/Calendar/Drive/Contacts *planning* using local fixtures.
- Scope explainer and least-privilege recommendations.
- Dry-run request plan output in JSON and text.
- Redaction helpers and secret scanning for configs.
- Future adapter interface documented, disabled by default.

## Out of Scope

- Live Google OAuth.
- Sending email or mutating calendar/drive data.
- Storing credentials.

## Verification

- Unit tests for planners, scope mapping, redaction, and fixture outputs.
- Real CLI smoke producing dry-run plans.

## Agent Prompt

Build `workspacewire` as a local-first Google Workspace automation planner for agents, inspired by the broad gogcli category but original and non-mutating. Use StackForge, docs, tests, smokes, publish, protect main.
