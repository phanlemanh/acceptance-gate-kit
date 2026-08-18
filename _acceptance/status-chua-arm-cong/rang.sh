#!/usr/bin/env bash
# Răng hồ sơ status-chua-arm-cong (E5e): GUIDE có ĐÚNG MỘT hàng bảng «chưa arm
# cổng» trong khối §7 (cắt "## 7." → "### 7.1") và ĐÚNG MỘT gạch «không dựng
# răng» trong khối §7.1 (cắt "### 7.1" → "## 8"). Hai chiều đỏ chạy CÙNG LƯỢT
# trên bản sao GUIDE (gỡ hàng / gỡ gạch) qua CHÍNH hàm đếm — không vào suite
# vĩnh viễn (nếp răng-hồ-sơ). Đường dẫn suy từ vị trí script.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/../.." && pwd)"
GUIDE="${1:-$ROOT/GUIDE.md}"
count_row()  { awk '/^## 7\./{f=1;next} /^### 7\.1/{f=0} f' "$1" | grep -c 'chưa arm cổng' ; }
count_dash() { awk '/^### 7\.1/{f=1;next} /^## 8/{f=0} f' "$1" | grep -c '^- \*\*Mốc phát hành KHÔNG dựng răng\*\*' ; }
judge() { # <guide> → 0 iff cả hai đếm = 1; in dòng ghim khi lệch
  local r d rc=0; r=$(count_row "$1"); d=$(count_dash "$1")
  [ "$r" -eq 1 ] || { echo "GUIDE 7: $r hàng «chưa arm cổng» (cần 1)"; rc=1; }
  [ "$d" -eq 1 ] || { echo "GUIDE 7.1: $d dòng «không dựng răng» (cần 1)"; rc=1; }
  return $rc
}
fail=0
if judge "$GUIDE"; then echo "RANG-ARM ok: GUIDE 7 hàng=1, 7.1 gạch=1"; else fail=1; fi
# chiều đỏ 1: gỡ hàng bảng §7
T="$(mktemp -d)"; trap 'rm -rf "$T"' EXIT
grep -v 'chưa arm cổng' "$GUIDE" > "$T/g1.md"
if judge "$T/g1.md" 2>&1 | grep -q 'GUIDE 7: 0 hàng «chưa arm cổng»'; then echo "RANG-ARM đỏ-1 ok"; else echo "RANG-ARM đỏ-1 KHÔNG ĐỎ — răng mù với hàng bảng"; fail=1; fi
# chiều đỏ 2: gỡ gạch §7.1
grep -v '^- \*\*Mốc phát hành KHÔNG dựng răng\*\*' "$GUIDE" > "$T/g2.md"
if judge "$T/g2.md" 2>&1 | grep -q 'GUIDE 7.1: 0 dòng «không dựng răng»'; then echo "RANG-ARM đỏ-2 ok"; else echo "RANG-ARM đỏ-2 KHÔNG ĐỎ — răng mù với gạch §7.1"; fail=1; fi
exit $fail
