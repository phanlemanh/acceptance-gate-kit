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
# Gốc kho THẬT: chạy từ worktree thì $ROOT là `.claude/worktrees/<x>`, nên cha của nó là
# `.claude/worktrees` — không cây tiêu thụ nào ở đó và răng hoá rỗng LẶNG LẼ (đo 09/09:
# lần dùng đầu tiên chấm đúng 1 cây rồi PASS). Suy qua --git-common-dir để luôn về kho gốc.
MAIN_GIT="$(git -C "$ROOT" rev-parse --path-format=absolute --git-common-dir 2>/dev/null || true)"
if [ -n "$MAIN_GIT" ]; then DEV="$(dirname "$(dirname "$MAIN_GIT")")"; else DEV="$(dirname "$ROOT")"; fi
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
    bad=0; seen=0
    for r in "$ROOT" "$DEV/artifact-platform" "$DEV/oneflow" "$DEV/crm"; do
      n="$(basename "$r")"
      if [ ! -d "$r/_acceptance" ]; then echo "SKIP $n: vắng"; continue; fi
      o="$(node "$ROOT/scripts/eval-coverage-lint.js" "$r" 2>&1)"; rc=$?
      # exit 0 = sạch, 1 = có cảnh báo (đều là ĐÃ CHẠY); ≥2 = lint chết → không được đọc
      # sự VẮNG của dòng W8 như bằng chứng.
      if [ "$rc" -ge 2 ]; then echo "FAIL: $n lint chết (exit $rc): $(printf '%s' "$o" | head -1)"; bad=1; continue; fi
      # dấu hiệu quét DƯƠNG: lint phải nói được nó đã quét (một dòng cảnh báo, hoặc câu sạch)
      case "$o" in *"] W"*|*"no coverage gaps detected"*) : ;; *) echo "FAIL: $n không có dấu hiệu quét — lint chạy mà không nói gì"; bad=1; continue ;; esac
      tk="$(printf '%s\n' "$o" | grep -c 'W8 surfaces carry token' || true)"
      nv="$(printf '%s\n' "$o" | grep -c 'W8 surfaces include a human-visible' || true)"
      w6="$(printf '%s\n' "$o" | grep -c '\] W6 ' || true)"
      printf '%s | %s | %s | %s\n' "$n" "$tk" "$nv" "$w6"; seen=$((seen+1))
      if [ "$tk" -ne 0 ]; then echo "FAIL: $n còn $tk dòng W8-token (nhánh đã gỡ mà vẫn nổ)"; bad=1; fi
    done
    if [ "$bad" -ne 0 ]; then exit 1; fi
    # Cây tiêu thụ VẮNG là chuyện bình thường ở máy khác/CI — AC-5(e) nói SKIP có tên,
    # không nói FAIL. Bất biến thường trực chỉ áp cho cây CÓ MẶT; kit thì luôn có, nên
    # phép đo không bao giờ rỗng. Số ba cây tiêu thụ là CHỨNG-MỘT-LẦN, ghi ở Notes.
    if [ "$seen" -lt 1 ]; then
      echo "FAIL: không chấm được cây nào — kể cả kit ($ROOT) cũng không có _acceptance/"
      exit 1
    fi
    echo "chứng-một-lần: $((seen - 1))/3 cây tiêu thụ có mặt ở dev-root=$DEV"
    echo "PASS: CAY-THAT ($seen cây)"
    ;;
  loop-health-that)
    node "$ROOT/scripts/loop-health.mjs" --root "$ROOT" --at 8caa9998 --check-hand "$HERE/mocs-tay.json"
    ;;
  *)
    echo "usage: rang.sh --chan cay-that|loop-health-that [--dev-root <dir>]" >&2; exit 2 ;;
esac
