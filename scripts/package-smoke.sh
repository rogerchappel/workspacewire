#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

cd "$ROOT_DIR"
npm pack --pack-destination "$TMP_DIR" >/dev/null
PACKAGE_TGZ="$(find "$TMP_DIR" -maxdepth 1 -name 'workspacewire-*.tgz' -print -quit)"
test -n "$PACKAGE_TGZ"

mkdir -p "$TMP_DIR/app"
cd "$TMP_DIR/app"
npm init -y >/dev/null
npm install "$PACKAGE_TGZ" >/dev/null

npx workspacewire help >/dev/null
npx workspacewire plan gmail search --query invoice --format json > "$TMP_DIR/plan.json"
grep -q '"mode": "dry-run"' "$TMP_DIR/plan.json"
grep -q '"source": "gmail.json"' "$TMP_DIR/plan.json"
