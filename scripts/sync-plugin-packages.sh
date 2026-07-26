#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# --check: build into a temp dir and diff against the committed plugins/ mirror.
# Exit 1 on drift (CI guard — see docs/adr/0001). Default (no flag): sync in place.
MODE="${1:-}"
# Mode lạ KHÔNG được âm thầm rơi về "ghi đè": `--chek` từng in "Synced …",
# thoát 0, VÀ xoá luôn drift vừa tiêm — tức một lỗi gõ biến lệnh KIỂM thành
# lệnh GHI, rồi báo thành công. Đây là chốt duy nhất biện minh cho việc miễn
# trừ `plugins/**` khỏi cổng (xem _acceptance/config.yaml), nên nó fail-open là
# cả miễn trừ đó mất căn cứ.
case "$MODE" in
  ""|--check|--write) : ;;
  *) echo "sync-plugin-packages: unknown option $MODE (dùng --check | --write | không tham số)" >&2; exit 2 ;;
esac
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

# Đọc thẳng từ manifest thay vì ghim literal — đúng lớp rot vừa gỡ khỏi P03/P22,
# để lại đây thì script báo một số hiệu không tồn tại.
# Khong nuot loi thanh '?': manifest doi ten / node vang / JSON hong phai NO,
# vi dong nay la thu duy nhat nguoi van hanh doc de biet vua dung goi ban nao.
_v() { node -e 'process.stdout.write(require(process.argv[1]).version)' "$ROOT/$1"; }
echo "Synced Codex packages: acceptance-gate@$(_v .codex-plugin/plugin.json) feature-loop-codex@$(_v feature-loop/.claude-plugin/plugin.json) design-loop@$(_v design-loop/.codex-plugin/plugin.json)"
