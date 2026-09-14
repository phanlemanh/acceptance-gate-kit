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
#   2  không chạy được suite / P200 chưa từng chạy → không có vật để đo
#   3  P200 in dòng FAIL                            → ca ĐỎ THẬT
#   4  P200 in nhiều hơn một dòng PASS              → bộ lọc hỏng, số không tin được
#   5  P200 chạy nhưng không tới kết luận nào       → đầu ra bị cắt giữa chừng
#   0  xanh
#
# Vì sao 2/3/5 tách (lượt chấm 4 bắt): bản trước gộp cả ba vào 3 với thông điệp
# «ca do hoac chua tung chay», và vì `2>&1` cộng `|| true` nên OUT không bao giờ
# rỗng — lối 2 KHÔNG BAO GIỜ tới được. Hệ quả: suite mất tệp, node vỡ, `ONLY_BLOCK`
# gõ sai tên, đầu ra bị công cụ cắt — tất cả được khai là «P200 ĐỎ», tức hạ tầng tự
# sinh tín hiệu đỏ về một lần cắt số lành. Đó đúng cặp mà hiến pháp bắt phân biệt:
# «bắt đúng lỗi» với «chưa bao giờ chạy». Vật liệu phân biệt đã có sẵn trong đầu
# ra: mã thoát của chính lệnh, dòng tự xưng «khong khop khoi nao» của suite, và
# dòng tiêu đề mà `run()` in TRƯỚC khi chạy khối.
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# Cờ lạ NỔ, đối xứng với chốt `--chan` cưỡng chế cứng của rang-moc.sh. Răng này
# vốn đọc `$@` không một lần nào, nên `--khoi P199` hay `--chan diagram` đều chạy
# như không có tham số rồi thoát 0 — một cờ rơi khỏi config âm thầm thành xanh,
# đúng lớp fail-open mà kit đã đặt luật cho script của chính nó (bắt ở lượt chấm 5).
[ $# -eq 0 ] || { echo "rang-p200: khong nhan tham so: $*" >&2; exit 2; }
BLOCK="P200"
OUT="$(cd "$ROOT" && ONLY_BLOCK="$BLOCK" bash tests/plugins/run-tests.sh 2>&1)"; RC=$?

# ── Lối 2: CHƯA TỪNG CHẠY. Ba dấu hiệu, mỗi cái tự xưng ──────────────────────
if [ "$RC" -eq 127 ] || [ "$RC" -eq 126 ]; then
  echo "DO: khong khoi chay duoc suite plugins (ma thoat ${RC}) — khong co vat de do" >&2
  exit 2
fi
if [ -z "$OUT" ]; then
  echo "DO: suite plugins khong in gi — khong co vat de do" >&2
  exit 2
fi
if printf '%s\n' "$OUT" | grep -qF 'khong khop khoi nao'; then
  echo "DO: ONLY_BLOCK=${BLOCK} khong khop khoi nao trong suite — P200 chua tung chay" >&2
  exit 2
fi
if ! printf '%s\n' "$OUT" | grep -qF "$BLOCK"; then
  echo "DO: dau ra suite khong co mot dong nao nhac ${BLOCK} — P200 chua tung chay" >&2
  exit 2
fi

echo "$OUT" | grep -F 'P200' || true
N="$(printf '%s\n' "$OUT" | grep -c 'PASS: P200' || true)"
NF="$(printf '%s\n' "$OUT" | grep -c 'FAIL: P200' || true)"

# ── Lối 3: ĐỎ THẬT — P200 tự in dòng FAIL của chính nó ───────────────────────
if [ "$NF" -gt 0 ]; then
  echo "DO: P200 in ${NF} dong FAIL — so ban KHONG nhat quan (ca do that, khong phai ha tang)" >&2
  exit 3
fi
if [ "$N" -gt 1 ]; then
  echo "DO: P200 in ${N} dong PASS — bo loc hong, con so khong tin duoc" >&2
  exit 4
fi

# ── Lối 5: KHẲNG ĐỊNH DƯƠNG, không để PASS làm nhánh mặc định ────────────────
# `grep -c … || true` biến MỌI mã thoát của grep — kể cả các mã lỗi ≥2, không chỉ
# mã 1 «không khớp» — thành một phép gán thành công với đầu ra RỖNG. Khi đó
# `[ "" -gt 0 ]` và `[ "" -eq 0 ]` đều in «integer expression expected» rồi trả
# FALSE, nên ba chốt trên rơi xuyên và `echo PASS` cuối tệp là nhánh MẶC ĐỊNH —
# ngược hẳn thế fail-closed của cả tệp (bắt ở lượt chấm 5). Nên phán quyết xanh
# viết ở dạng KHẲNG ĐỊNH: đúng một dòng PASS, không gì khác.
if [ "$N" != "1" ]; then
  echo "DO: so dong PASS: P200 khong phai 1 (doc duoc: '${N}') — chua ket luan duoc" >&2
  exit 5
fi
# DẤU BẢN RĂNG, suy từ chính tệp đang chạy — xem chú thích cùng tên ở rang-moc.sh.
DAU="$(git -C "$ROOT" hash-object "$0" 2>/dev/null | cut -c1-8)"
echo "PASS: P200 xanh (dung 1 dong PASS cua chinh no; phan quyet KHONG lay tu ma thoat tron suite; rang ban ${DAU:-khong-doc-duoc})"
