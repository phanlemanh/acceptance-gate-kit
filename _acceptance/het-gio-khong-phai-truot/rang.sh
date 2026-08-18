#!/usr/bin/env bash
# Răng hồ sơ het-gio-khong-phai-truot — chết theo hồ sơ khi merge, không vào
# suite vĩnh viễn.
#
# THU PHẠM VI (owner gật 18/08, sau ba vòng S4). Ba vòng liên tiếp, chân
# «tồn-kho» của răng — cái tự dựng phép đo để canh phép đo — lại đẻ một lỗ cùng
# họ: liệt kê theo hình dạng cú pháp → tự-phá-thử hằng đúng → mutant xanh cả khi
# bản tiêm chưa từng dựng được, cộng mốc `origin/main` di động khiến đẳng thức
# tự chết ngay sau merge. Đúng bài học đã ghi trong kit: chốt cưỡng chế mà cần
# chốt cho chính nó thì GỠ, đừng đắp tầng thứ tư.
#
# Còn lại đúng một việc, và nó không thuộc lớp assertion-âm-tính: chứng minh
# lần chạy này THẬT SỰ chạy và các ca của hồ sơ THẬT SỰ xanh —
#   (a) suite exit 0 VÀ in "Results: N passed, 0 failed"  ← không tin riêng cái nào
#   (b) đủ 18 dòng "  PASS: <tên ca>" khớp TRỌN dòng (grep -x: bản substring từng
#       để lọt ca bị đổi tên thành "<tên>x").
# Vế «không sửa case cũ» của AC-7 nay là Known limit — chốt còn lại là người đọc
# diff PR; xem Notes của contract.
set -u
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT" || exit 1
FAILS=0
do_fail() { echo "DO: $1"; FAILS=$((FAILS+1)); }

TEST_FILE="tests/workflows/acceptance-verify.test.mjs"

PINS=(
  "W25 rule rut tu marker"
  "W25 machine prompt chua TOOL-KILL-RULE"
  "W25 ui prompt chua TOOL-KILL-RULE"
  "W25 baseline prompt chua TOOL-KILL-RULE"
  "W25 schema killedByTool"
  "W25 dung 3 luot noi suy rule"
  "W25 mutant machine: xoa rule -> chi machine do"
  "W25 mutant ui: xoa rule -> chi ui do"
  "W25 mutant baseline: xoa rule -> chi baseline do"
  "W26 killedByTool -> BLOCKED"
  "W26 reason agent giu nguyen van"
  "W26 reason trong -> khuon ghim bi cong cu giet"
  "W26 doi chung: exit 1 that -> REJECT"
  "W26 run-log ghi cannot_run, khong ghi exit gia"
  "W26 ui killedByTool -> BLOCKED"
  "W26 ui doi chung: exit 1 that -> REJECT"
  "W27 baseline killed -> n-a"
  "W27 doi chung: baseline exit 1 that -> red"
)

OUT="$(node "$TEST_FILE" 2>&1)"; RC=$?
[ "$RC" -eq 0 ] || do_fail "suite exit $RC (khong duoc nuot ma thoat)"

PASSED="$(printf '%s\n' "$OUT" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\1/p' | tail -1)"
FAILED="$(printf '%s\n' "$OUT" | sed -n 's/^Results: \([0-9]*\) passed, \([0-9]*\) failed.*$/\2/p' | tail -1)"
if [ -z "$PASSED" ] || [ -z "$FAILED" ]; then
  do_fail "khong doc duoc dong tong ket 'Results: N passed, M failed' — suite chua chac da chay"
elif [ "$FAILED" -ne 0 ]; then
  do_fail "suite bao $FAILED ca do"
elif [ "$PASSED" -lt "${#PINS[@]}" ]; then
  do_fail "chi $PASSED ca xanh, it hon ${#PINS[@]} ca ma ho so nay khai — stdout khong phai cua lan chay that"
fi

for nm in "${PINS[@]}"; do
  printf '%s\n' "$OUT" | grep -qxF "  PASS: $nm" || do_fail "thieu dong PASS: $nm"
done

if [ "$FAILS" -gt 0 ]; then
  echo "RANG-HGKPT: $FAILS loi"
  exit 1
fi
echo "RANG-HGKPT OK (${#PINS[@]} pin, suite $PASSED ca xanh / $FAILED do)"
