#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PKG="$ROOT/plugins/acceptance-gate"

# Single source of truth for the version: root .claude-plugin/plugin.json.
# Align .codex-plugin BEFORE copying so the packaged manifests inherit it —
# four manifests, one version, no hand-bumping.
VER="$(node -p "require('$ROOT/.claude-plugin/plugin.json').version")"
node -e "
const fs = require('fs');
const p = process.argv[1], v = process.argv[2];
const j = JSON.parse(fs.readFileSync(p, 'utf8'));
j.version = v;
fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
" "$ROOT/.codex-plugin/plugin.json" "$VER"

rm -rf "$PKG"
mkdir -p "$PKG"

mkdir -p "$PKG/.claude-plugin" "$PKG/.codex-plugin"
rsync -a --exclude '.DS_Store' "$ROOT/.claude-plugin/plugin.json" "$PKG/.claude-plugin/plugin.json"
rsync -a --exclude '.DS_Store' "$ROOT/.codex-plugin/plugin.json" "$PKG/.codex-plugin/plugin.json"
rsync -a --exclude '.DS_Store' "$ROOT/skills/" "$PKG/skills/"
rsync -a --exclude '.DS_Store' "$ROOT/commands/" "$PKG/commands/"
rsync -a --exclude '.DS_Store' "$ROOT/hooks/" "$PKG/hooks/"

mkdir -p "$PKG/scripts" "$PKG/lib" "$PKG/vendor"
rsync -a --exclude '.DS_Store' --exclude 'sync-plugin-packages.sh' "$ROOT/scripts/" "$PKG/scripts/"
rsync -a --exclude '.DS_Store' "$ROOT/lib/" "$PKG/lib/"
# vendor/ is REQUIRED at runtime: lib/design-detect.mjs lazy-imports
# ../vendor/impeccable/engine — a package without it ships a design gate
# that dies with ERR_MODULE_NOT_FOUND on first use.
rsync -a --exclude '.DS_Store' "$ROOT/vendor/" "$PKG/vendor/"
rsync -a --exclude '.DS_Store' "$ROOT/README.md" "$PKG/README.md"
rsync -a --exclude '.DS_Store' "$ROOT/QUICKSTART.md" "$PKG/QUICKSTART.md"

echo "Synced $PKG (version $VER)"
