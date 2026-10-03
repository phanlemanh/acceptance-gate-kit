#!/usr/bin/env bash
# Bộ răng hồ sơ lan-ghim-lai-theo-paths — mỗi chân một AC (evals.yaml E1…E10).
# Đường dẫn suy từ vị trí tệp này. Chân chưa dựng → thoát 2 có tên (không phải xanh).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
[ "${1:-}" = "--chan" ] && [ -n "${2:-}" ] || { echo "rang.sh: dùng --chan <tên>" >&2; exit 3; }
CHAN="$2"
case "$CHAN" in
  doc-cu|nhay-dac-hieu|chi-thu|hinh-ho-so|khong-chay-duoc|khoa-va-co) F="$HERE/rang/chan-premerge.mjs" ;;
  mot-nguon|lan-doc-cu) F="$HERE/rang/chan-lan.mjs" ;;
  song-song|loi-khong-xen) F="$HERE/rang/chan-song-song.mjs" ;;
  *) echo "rang.sh: chân lạ: $CHAN" >&2; exit 3 ;;
esac
[ -f "$F" ] || { echo "rang.sh: chân chưa dựng: $CHAN ($(basename "$F") vắng)" >&2; exit 2; }
exec node "$F" "$CHAN"
