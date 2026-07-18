#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

sync_overlay() {
  local src="$1" dst="$2"
  if [ -d "$src" ]; then
    rsync -a --exclude '.DS_Store' "$src/" "$dst/"
  fi
}

build_acceptance() {
  local out="$ROOT/plugins/acceptance-gate"
  rm -rf "$out"
  mkdir -p "$out"
  rsync -a --exclude '.DS_Store' "$ROOT/skills/" "$out/skills/"
  rsync -a --exclude '.DS_Store' --exclude 'sync-plugin-packages.sh' "$ROOT/scripts/" "$out/scripts/"
  rsync -a --exclude '.DS_Store' "$ROOT/lib/" "$out/lib/"
  rsync -a --exclude '.DS_Store' "$ROOT/vendor/" "$out/vendor/"
  rsync -a --exclude '.DS_Store' "$ROOT/hooks/" "$out/hooks/"
  for file in README.md QUICKSTART.md GUIDE.md; do
    rsync -a "$ROOT/$file" "$out/$file"
  done
  sync_overlay "$ROOT/codex/acceptance-gate" "$out"
}

build_feature_loop() {
  local out="$ROOT/plugins/feature-loop-codex"
  rm -rf "$out"
  mkdir -p "$out"
  sync_overlay "$ROOT/codex/feature-loop-codex" "$out"
}

build_design_loop() {
  local out="$ROOT/plugins/design-loop-codex"
  rm -rf "$out"
  mkdir -p "$out"
  rsync -a --exclude '.DS_Store' "$ROOT/design-loop/scripts/" "$out/scripts/"
  rsync -a --exclude '.DS_Store' "$ROOT/design-loop/skills/" "$out/skills/"
  rsync -a --exclude '.DS_Store' "$ROOT/design-loop/README.md" "$out/README.md"
  sync_overlay "$ROOT/codex/design-loop" "$out"
}

build_acceptance
build_feature_loop
build_design_loop

echo "Synced Codex packages: acceptance-gate@1.15.0 feature-loop-codex@1.12.0 design-loop@0.2.1"
