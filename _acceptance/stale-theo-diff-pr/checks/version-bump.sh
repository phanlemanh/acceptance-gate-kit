#!/usr/bin/env bash
# E6/AC-6 — bump acceptance-gate 1.39.1 → 1.39.2 phải là ĐỔI THẬT, đo bằng so
# với số cũ trên toàn cây chứ không phải "có một con số" (bài học manifest-bump
# của consumer-copy-cjs). Đường dẫn suy từ vị trí script (bất biến CLAUDE.md:
# không hardcode ROOT).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../../.." && pwd)"
OLD="1.39.1"; NEW="1.39.2"
fail=0

# Quét TOÀN CÂY manifest plugin.json (không danh-sách-đóng — allowlist phải có
# RED ngoài danh sách): mọi file plugin.json còn mang version cũ là ĐỎ.
stale_manifests="$(grep -rln "\"version\": \"$OLD\"" "$ROOT" --include=plugin.json 2>/dev/null | grep -v node_modules || true)"
if [ -n "$stale_manifests" ]; then
  echo "RED: manifest còn mang $OLD:"; printf '%s\n' "$stale_manifests"
  fail=1
fi

# Sanity counter: số manifest mang version MỚI phải ≥ 4 (2 nguồn + codex twin
# + mirror). 0-hit hay ít hơn nghĩa là grep hỏng hoặc bump thiếu — không phải sạch.
new_count="$(grep -rln "\"version\": \"$NEW\"" "$ROOT" --include=plugin.json 2>/dev/null | grep -v node_modules | wc -l | tr -d ' ')"
echo "manifest @ $NEW: $new_count (sàn 4)"
if [ "$new_count" -lt 4 ]; then
  echo "RED: chỉ $new_count manifest mang $NEW — bump thiếu hoặc phép đếm hỏng"
  fail=1
fi

# Nguồn và mirror phải nói CÙNG một số (quan hệ, không giá trị đơn lẻ).
src_v="$(sed -n 's/.*"version": "\([0-9.]*\)".*/\1/p' "$ROOT/.claude-plugin/plugin.json" | head -1)"
mir_v="$(sed -n 's/.*"version": "\([0-9.]*\)".*/\1/p' "$ROOT/plugins/acceptance-gate/.codex-plugin/plugin.json" | head -1)"
echo "nguồn=.claude-plugin:$src_v mirror=plugins/acceptance-gate:$mir_v"
if [ "$src_v" != "$NEW" ] || [ "$mir_v" != "$NEW" ]; then
  echo "RED: nguồn ($src_v) / mirror ($mir_v) không cùng đứng ở $NEW"
  fail=1
fi

[ "$fail" -eq 0 ] && echo "VERSION-BUMP OK: $OLD → $NEW, $new_count manifest, nguồn == mirror"
exit "$fail"
