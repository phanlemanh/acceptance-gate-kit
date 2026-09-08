#!/usr/bin/env bash
# rang.sh — răng của hồ sơ gom-duc-ket-2-10-0. Chết theo hồ sơ khi merge (cùng nếp
# không-vào-suite-vĩnh-viễn với các bộ răng hồ sơ khác).
#
#   rang.sh --chan cay-that          # AC-5(e): lint trên cây kit + cây tiêu thụ CÓ MẶT
#   rang.sh --chan loop-health-that  # AC-8(b): số máy so số đếm tay tại sha bất biến
#
# Đường quét lấy từ --dev-root (mặc định THƯ MỤC CHA của kit) — không hardcode đường
# dẫn máy tác giả. Cây vắng in `SKIP <tên>: vắng` rồi đi tiếp: bất biến thường trực chỉ
# nói về cây CÓ MẶT, số đo từng cây là chứng-một-lần (ghi ở bằng chứng + Notes).
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
CHAN=""
DEV="$(dirname "$ROOT")"
while [ $# -gt 0 ]; do
  case "$1" in
    --chan) CHAN="${2:-}"; shift 2 ;;
    --dev-root) DEV="${2:-}"; shift 2 ;;
    *) echo "rang.sh: tham số lạ '$1'" >&2; exit 2 ;;
  esac
done

case "$CHAN" in
  cay-that)
    # Bất biến ghim: 0 dòng «W8 surfaces carry token» ở MỌI cây có mặt (nhánh token-lạ
    # đã gỡ — AC-5d). Hai cột còn lại CHỈ IN: số nghĩa vụ và W6 là sự thật của cây tại
    # thời điểm đo, không phải lời hứa của mã.
    printf 'repo | W8-token | W8-nghia-vu | W6\n'
    bad=0
    for r in "$ROOT" "$DEV/artifact-platform" "$DEV/oneflow" "$DEV/crm"; do
      n="$(basename "$r")"
      if [ ! -d "$r/_acceptance" ]; then echo "SKIP $n: vắng"; continue; fi
      o="$(node "$ROOT/scripts/eval-coverage-lint.js" "$r" 2>&1)"
      tk="$(printf '%s\n' "$o" | grep -c 'W8 surfaces carry token' || true)"
      nv="$(printf '%s\n' "$o" | grep -c 'W8 surfaces include a human-visible' || true)"
      w6="$(printf '%s\n' "$o" | grep -c '\] W6 ' || true)"
      printf '%s | %s | %s | %s\n' "$n" "$tk" "$nv" "$w6"
      if [ "$tk" -ne 0 ]; then echo "FAIL: $n còn $tk dòng W8-token (nhánh đã gỡ mà vẫn nổ)"; bad=1; fi
    done
    if [ "$bad" -eq 0 ]; then echo "PASS: CAY-THAT"; else exit 1; fi
    ;;
  loop-health-that)
    node "$ROOT/scripts/loop-health.mjs" --root "$ROOT" --at 8caa9998 --check-hand "$HERE/mocs-tay.json"
    ;;
  *)
    echo "usage: rang.sh --chan cay-that|loop-health-that [--dev-root <dir>]" >&2; exit 2 ;;
esac
