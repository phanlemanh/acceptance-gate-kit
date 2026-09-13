#!/usr/bin/env bash
# rang-p200.sh — răng của hồ sơ release-2-12-0, chân `cat-so`.
#
# Vì sao tồn tại thay vì gọi thẳng suite: phản biện context sạch chỉ ra lệnh cũ
# `ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh | grep -F P200` lấy MÃ THOÁT
# của TRỌN suite. `ONLY_BLOCK` chỉ lọc các khối đi qua hàm `run()`; chính chú
# thích trong suite khai «~46 khối viết thẳng bằng echo+if KHÔNG đi qua run() nên
# vẫn chạy» và vẫn cộng vào `failures`. Hệ quả: một khối rời không liên quan đỏ
# thì E1 đỏ, và người đọc kết luận «số 2.12.0 không nhất quán» về một lần cắt số
# hoàn toàn lành — đúng lớp «hạ tầng tự sinh tín hiệu đỏ» mà hồ sơ này ghi là ba
# cửa sổ liên tiếp.
#
# Phán quyết ở đây rút TỪ DÒNG CỦA CHÍNH P200: hàm `pass()` của suite in đúng một
# dòng `  PASS: <tên>`; đếm dòng ấy là đọc kết quả của P200, không phải của suite.
#
#   2  không chạy được suite       → không có vật để đo
#   3  P200 KHÔNG in dòng PASS nào → ca đỏ hoặc chưa từng chạy
#   4  P200 in nhiều hơn một dòng  → bộ lọc hỏng, con số không tin được
#   0  xanh
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$(cd "$ROOT" && ONLY_BLOCK=P200 bash tests/plugins/run-tests.sh 2>&1)" || true
if [ -z "$OUT" ]; then
  echo "DO: suite plugins khong in gi — khong co vat de do" >&2
  exit 2
fi
echo "$OUT" | grep -F 'P200' || true
N="$(printf '%s\n' "$OUT" | grep -c 'PASS: P200' || true)"
if [ "$N" -eq 0 ]; then
  echo "DO: P200 KHONG in dong PASS nao — ca do hoac chua tung chay" >&2
  exit 3
fi
if [ "$N" -gt 1 ]; then
  echo "DO: P200 in ${N} dong PASS — bo loc hong, con so khong tin duoc" >&2
  exit 4
fi
echo "PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite)"
