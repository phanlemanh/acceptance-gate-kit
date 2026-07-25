#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# --check: build into a temp dir and diff against the committed plugins/ mirror.
# Exit 1 on drift (CI guard — see docs/adr/0001). Default (no flag): sync in place.
MODE="${1:-}"
if [ "$MODE" = "--check" ]; then
  DEST="$(mktemp -d)"
  trap 'rm -rf "$DEST"' EXIT
else
  DEST="$ROOT/plugins"
fi

sync_overlay() {
  local src="$1" dst="$2"
  if [ -d "$src" ]; then
    rsync -a --exclude '.DS_Store' "$src/" "$dst/"
  fi
}

build_acceptance() {
  local out="$DEST/acceptance-gate"
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
  local out="$DEST/feature-loop-codex"
  rm -rf "$out"
  mkdir -p "$out/scripts"
  # resolve-plugin.mjs has ONE source of truth (feature-loop/scripts) and ships in
  # both editions — the Codex skill invokes it via ${PLUGIN_ROOT}.
  rsync -a "$ROOT/feature-loop/scripts/resolve-plugin.mjs" "$out/scripts/"
  sync_overlay "$ROOT/codex/feature-loop-codex" "$out"
}

build_design_loop() {
  local out="$DEST/design-loop-codex"
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

if [ "$MODE" = "--check" ]; then
  drift=0
  for pkg in acceptance-gate feature-loop-codex design-loop-codex; do
    if ! diff -r -x .DS_Store "$DEST/$pkg" "$ROOT/plugins/$pkg" >/dev/null 2>&1; then
      echo "DRIFT: plugins/$pkg lệch nguồn — chạy scripts/sync-plugin-packages.sh rồi commit mirror" >&2
      diff -r -q -x .DS_Store "$DEST/$pkg" "$ROOT/plugins/$pkg" >&2 || true
      drift=1
    fi
  done
  if [ "$drift" -eq 0 ]; then echo "plugins/ mirror in sync."; fi
  exit "$drift"
fi

echo "Synced Codex packages: acceptance-gate@1.20.1 feature-loop-codex@1.16.1 design-loop@0.3.0"
