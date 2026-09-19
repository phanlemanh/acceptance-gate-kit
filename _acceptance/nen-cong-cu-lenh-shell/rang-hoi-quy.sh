#!/usr/bin/env bash
# Răng của AC-8 — ma trận hồi quy TOÀN PHẦN cho bộ ca đường nền: số assert bằng số phần
# tử. Không lấy phán quyết từ mã thoát trọn suite: một ca bị đổi tên, bị return sớm nuốt,
# hay rơi khỏi vòng quét *.test.mjs vẫn cho suite thoát 0 — đó là lớp lỗi răng này canh.
# Đường dẫn suy từ vị trí script, không hardcode gốc kho.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"

# Ma trận viết TRƯỚC: 13 ca có từ trước vòng này + 6 ca vòng này thêm.
CA_CU="NEN0 NEN1 NEN2 NEN3 NEN4 NEN4b NEN5 NEN5-IM NEN6 NEN6-IM NEN7 NEN8 NEN9"
CA_MOI="NEN-TD1 NEN-TD2 NEN-TD3 NEN-TD4 NEN-TD5 NEN-TD6"
TONG=19

OUT="$(cd "$ROOT" && node tests/scripts/duong-nen.test.mjs 2>&1)"; RC=$?
printf '%s\n' "$OUT" | tail -n 5
if [ "$RC" -ne 0 ]; then echo "FAIL: HQ0 tep ca thoat $RC"; exit 1; fi

thieu=""
for c in $CA_CU $CA_MOI; do
  printf '%s\n' "$OUT" | grep -qF "PASS: $c " || thieu="$thieu $c"
done
if [ -n "$thieu" ]; then echo "FAIL: HQ1 vang dong PASS cua ca:$thieu"; exit 1; fi
echo "PASS: HQ1 du 13 ca cu va 6 ca moi co mat bang TEN"

# Đếm — bắt cả chiều NGƯỢC: ca bị xoá khỏi tệp mà tên vẫn nằm trong danh sách trên thì
# vòng lặp bắt được; ca bị đổi tên thành một tên NEN khác thì chỉ phép đếm này bắt được.
n="$(printf '%s\n' "$OUT" | grep -cE '^  PASS: NEN')"
if [ "$n" -ne "$TONG" ]; then
  echo "FAIL: HQ2 so dong PASS NEN la $n, ma tran khai $TONG"
  exit 1
fi
echo "PASS: HQ2 so dong PASS NEN dung bang $TONG"
