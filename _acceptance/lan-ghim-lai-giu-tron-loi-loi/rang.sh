#!/usr/bin/env bash
# Bộ răng hồ sơ lan-ghim-lai-giu-tron-loi-loi — mỗi chân một AC (evals.yaml E1…E7).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
[ "${1:-}" = "--chan" ] && [ -n "${2:-}" ] || { echo "rang.sh: dùng --chan <tên>" >&2; exit 3; }
case "$2" in
  nhat-ky-tron|xanh-im) F="$HERE/rang/chan-nhat-ky.mjs" ;;
  dau-do|nghia-khong-doi|do-khong-thanh-bang-chung) F="$HERE/rang/chan-dau-do.mjs" ;;
  bo-doc-im) F="$HERE/rang/chan-bo-doc.mjs" ;;
  thoi-luong) F="$HERE/rang/chan-thoi-luong.mjs" ;;
  tai-may) F="$HERE/rang/chan-tai-may.mjs" ;;
  *) echo "rang.sh: chân lạ: $2" >&2; exit 3 ;;
esac
[ -f "$F" ] || { echo "rang.sh: chân chưa dựng: $2 ($(basename "$F") vắng)" >&2; exit 2; }
exec node "$F" "$2"
