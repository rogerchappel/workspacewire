# Future adapter interface

The v1 package includes `WorkspaceAdapter` only as a seam. It throws by default and no live Google adapter is exported.

A future adapter must provide:

- explicit OAuth consent outside the planner
- per-operation scope checks
- a no-credential-storage default
- integration tests against a disposable account
- a separate review for every mutating operation

Until then, `workspacewire` remains a planner that produces auditable dry-run requests.
