# workspacewire

`workspacewire` is a local-first Google Workspace operation planner for agents. It helps you prepare Gmail, Calendar, Drive, and Contacts actions without live OAuth, without mutating data, and without storing credentials.

It is inspired by the general category of terminal automation for productivity systems, but it is deliberately original: a safety-first planner, not a broad Google API clone.

## Personality

Calm, explicit, and a little suspicious in the right places. `workspacewire` assumes future agents should show their work before they touch anyone's inbox, calendar, files, or contacts.

## Install / run locally

```bash
npm install
node src/cli.js help
```

## Examples

```bash
workspacewire plan gmail search --query invoice --format text
workspacewire plan drive find --query roadmap --format json
workspacewire plan contacts lookup --query ari --format json
workspacewire scopes --format text
workspacewire scan --config ./config.json
```

Every plan is a dry run. The output includes:

- the intended request method and path
- least-privilege OAuth scopes with risk notes
- fixture-backed preview results
- safety flags proving no live request is made

## Safety boundaries

`workspacewire` v1 does **not**:

- start Google OAuth flows
- send email
- create or mutate calendar events
- upload, delete, or edit Drive data
- store credentials

Mutating operations may be described so an agent can reason about scope risk, but they are blocked by default.

## Verification

```bash
npm test
npm run check
npm run build
npm run smoke
bash scripts/validate.sh
```

## Future adapter seam

A disabled adapter interface lives in `src/adapters/interface.js`. It documents where a future live adapter could fit after explicit review, granular OAuth consent, and separate integration tests.
