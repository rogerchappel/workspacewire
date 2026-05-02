#!/usr/bin/env bash
set -euo pipefail
node src/cli.js plan gmail search --query invoice --format text >/tmp/workspacewire-smoke.txt
grep -q "workspacewire dry-run" /tmp/workspacewire-smoke.txt
node src/cli.js plan contacts lookup --query ari --format json | grep -q '"contacts"'
node src/cli.js scopes --format text | grep -q 'gmail/search'
echo "smoke ok"
