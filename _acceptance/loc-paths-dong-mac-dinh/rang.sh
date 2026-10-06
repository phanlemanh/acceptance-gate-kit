#!/usr/bin/env bash
# Bộ răng hồ sơ loc-paths-dong-mac-dinh — mỗi chân một AC (evals.yaml E1…E9).
# Đường dẫn suy từ vị trí tệp này. Chân chưa dựng → thoát 2 có tên (không phải xanh).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
[ "${1:-}" = "--chan" ] && [ -n "${2:-}" ] || { echo "rang.sh: dùng --chan <tên>" >&2; exit 3; }
CHAN="$2"
case "$CHAN" in
  ma-tran|doi-chung-crm|cay) F="$HERE/rang/chan-lib.mjs" ;;
  truoc-merge|mot-nguon|doc-cu) F="$HERE/rang/chan-premerge.mjs" ;;
  lan-mot-bo-doc|bo-may-cu) F="$HERE/rang/chan-lan.mjs" ;;
  tai-lieu) F="$HERE/rang/chan-tai-lieu.mjs" ;;
  *) echo "rang.sh: chân lạ: $CHAN" >&2; exit 3 ;;
esac
[ -f "$F" ] || { echo "rang.sh: chân chưa dựng: $CHAN ($(basename "$F") vắng)" >&2; exit 2; }
exec node "$F" "$CHAN"
