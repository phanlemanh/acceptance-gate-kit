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
  # Entry LẠ dưới plugins/ phải nổ: `_acceptance/config.yaml` miễn trừ trọn
  # `plugins/**` khỏi cổng, và biện minh duy nhất là chốt này — nên chốt phải
  # rộng ĐÚNG BẰNG miễn trừ. Một package thứ tư, hay một file rơi vào đây, hiện
  # được miễn mà không ai so.
  # `find` chứ không phải glob: pathname expansion BỎ QUA dotfile, trong khi
  # `match_globs` của pre-merge-check dùng `case` nên `plugins/**` VẪN khớp
  # `plugins/.x/y.js`. Dùng glob ở đây làm chốt hẹp hơn miễn trừ đúng ở chỗ
  # khó thấy nhất.
  while IFS= read -r entry; do
    [ -n "$entry" ] || continue
    name="$(basename "$entry")"
    case "$name" in
      acceptance-gate|feature-loop-codex|design-loop-codex|.DS_Store) : ;;
      *)
        echo "DRIFT: plugins/$name không nằm trong danh sách package được sync — hoặc thêm nó vào vòng lặp, hoặc thu hẹp t1_skip_globs (miễn trừ plugins/** đang rộng hơn chốt này)" >&2
        drift=1 ;;
    esac
  done <<ENTRIES
$(find "$ROOT/plugins" -mindepth 1 -maxdepth 1 2>/dev/null)
ENTRIES
  if [ "$drift" -eq 0 ]; then echo "plugins/ mirror in sync."; fi
  exit "$drift"
fi

# Đọc thẳng từ manifest thay vì ghim literal — đúng lớp rot vừa gỡ khỏi P03/P22,
# để lại đây thì script báo một số hiệu không tồn tại.
# Đọc từ manifest, KHÔNG ghim literal. Hai cái bẫy đã dẫm:
#  1. `set -e` KHÔNG kích hoạt khi command substitution hỏng trong danh sách đối
#     số của `echo` — bản trước bỏ `|| echo '?'` mà vẫn in version RỖNG và thoát
#     0. Gán vào biến thì `-e` mới nổ, nên gán trước rồi mới in.
#  2. Phải đọc đúng manifest ĐƯỢC ĐỒNG BỘ vào mirror (overlay dưới codex/), không
#     phải manifest gốc repo — hôm nay trùng số nên vô hại, mai một overlay bump
#     độc lập là script báo số hiệu nó không hề đồng bộ.
_v() { node -e 'process.stdout.write(require(process.argv[1]).version)' "$ROOT/$1"; }
AG_V="$(_v codex/acceptance-gate/.codex-plugin/plugin.json)"
FL_V="$(_v codex/feature-loop-codex/.codex-plugin/plugin.json)"
DL_V="$(_v codex/design-loop/.codex-plugin/plugin.json)"
for _pair in "acceptance-gate:$AG_V" "feature-loop-codex:$FL_V" "design-loop:$DL_V"; do
  [ -n "${_pair#*:}" ] || { echo "sync-plugin-packages: không đọc được version của ${_pair%%:*}" >&2; exit 1; }
done
echo "Synced Codex packages: acceptance-gate@$AG_V feature-loop-codex@$FL_V design-loop@$DL_V"
