#!/usr/bin/env bash
# AC-8 — 2 cảnh báo lint của repo tiêu thụ: `catch (_) {}` bind một biến rồi
# bỏ trống. Đổi sang optional catch binding + ghi chú lý do.
#
# Sanity counter: file phải CÒN ít nhất 2 khối catch. Không có nó thì "0 khối
# catch (_) rỗng" cũng đúng với một file đã bị xoá sạch catch — phép đo tự-khớp.
set -u
ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
F="$ROOT/scripts/recheck-evidence.cjs"
[ -f "$F" ] || { echo "FAIL: không thấy $F" >&2; exit 2; }

total_catch="$(grep -c 'catch' "$F")"
bad="$(grep -nE 'catch[[:space:]]*\([[:space:]]*_[[:space:]]*\)[[:space:]]*\{[[:space:]]*\}' "$F" || true)"
n_bad="$(printf '%s\n' "$bad" | grep -c . )"

echo "sanity: ${total_catch} khối catch trong recheck-evidence.cjs (sàn 2)"
echo "đo:     ${n_bad} khối \`catch (_) {}\` rỗng còn lại"

rc=0
if [ "$total_catch" -lt 2 ]; then
  echo "FAIL: sanity dưới sàn — file chỉ còn $total_catch khối catch, phép đo không phân biệt được 'đã sửa' với 'đã xoá'" >&2
  rc=1
fi
if [ "$n_bad" -ne 0 ]; then
  echo "FAIL: còn khối catch bind biến rồi bỏ trống:" >&2
  printf '%s\n' "$bad" | sed 's/^/    /' >&2
  rc=1
fi
# File phải vẫn chạy được sau khi sửa lint (cú pháp optional catch binding cần Node ≥10)
node --check "$F" || { echo "FAIL: recheck-evidence.cjs không parse được" >&2; rc=1; }

[ "$rc" -eq 0 ] && echo "RECHECK-LINT OK"
exit "$rc"
