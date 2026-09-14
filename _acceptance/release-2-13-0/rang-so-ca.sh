#!/usr/bin/env bash
# rang-so-ca.sh — răng của hồ sơ release-2-13-0, cho AC-3.
#
# Vì sao tồn tại, và vì sao 2.12.0 không cần nó: mốc này SỬA chính
# `tests/plugins/run-tests.sh`, còn 2.12.0 không chạm tệp ca nào. Suite ấy kết bằng
# `Results: all plugin tests passed` KHÔNG kèm số, và biến đếm duy nhất của nó là
# `failures`. Nên một sửa đổi làm bảng khối gãy giữa chừng — dấu ngoặc lệch, một
# `exit 0` lọt, heredoc không đóng — vẫn cho suite in đúng câu ấy và thoát 0, trong
# khi hàng chục khối phía sau IM LẶNG không chạy. `ONLY_BLOCK=P93` của rang-p93.sh
# không bắt được: nó chỉ chứng minh riêng khối P93 còn sống.
# Phản biện context sạch bắt (P1, 14/09).
#
# Phép đo: đếm dòng `  PASS: ` mà hàm `pass()` của suite in, so với SÀN đo được tại
# S1 trên cây lành. Chiều so là MỘT PHÍA — thêm ca không bao giờ làm đỏ, chỉ MẤT ca
# mới đỏ. Sàn là một con số ghim, và nó ghim ở ĐÂY chứ không trong `expected`, vì
# `expected` là văn người đọc còn đây là vật máy chạy.
#
#   2  chưa chạy được suite / suite không in gì        → không có vật để đo
#   3  suite thoát khác 0                              → hồi quy thật
#   4  số ca ÍT HƠN sàn                                → khối im lặng không chạy
#   5  không đọc được số ca (đếm ra rỗng)              → chưa kết luận được
#   8  không đọc được dấu bản răng                     → hạ tầng sau-khi-đã-chạy
#   0  xanh
#
# Gốc kho suy TỪ VỊ TRÍ SCRIPT (bài học P150), không từ thư mục gọi.
set -u
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
# SÀN: đo 14/09 trên cây lành tại HEAD của cửa sổ (266 dòng PASS, 0 FAIL), TRƯỚC nhát
# vá P93. Nhát vá không thêm không bớt khối nào, nên sàn giữ nguyên qua mốc.
SAN=266

[ $# -eq 0 ] || { echo "rang-so-ca: khong nhan tham so: $*" >&2; exit 2; }
TEP="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
DAU="$(git -C "$ROOT" hash-object "$TEP" 2>/dev/null | cut -c1-8)"
[ -n "$DAU" ] || { echo "DO: khong doc duoc dau ban rang cua ${TEP}" >&2; exit 8; }

OUT="$(cd "$ROOT" && bash tests/plugins/run-tests.sh 2>&1)"; RC=$?
if [ "$RC" -eq 127 ] || [ "$RC" -eq 126 ]; then
  echo "DO: khong khoi chay duoc suite plugins (ma thoat ${RC}) — khong co vat de do" >&2; exit 2; fi
[ -n "$OUT" ] || { echo "DO: suite plugins khong in gi — khong co vat de do" >&2; exit 2; }

printf '%s\n' "$OUT" | tail -2
if [ "$RC" -ne 0 ]; then
  echo "DO: suite plugins thoat ${RC} — hoi quy that:" >&2
  printf '%s\n' "$OUT" | grep '^  FAIL: ' >&2 || true
  exit 3
fi
N="$(printf '%s\n' "$OUT" | grep -c '^  PASS: ' || true)"
case "$N" in ''|*[!0-9]*) echo "DO: khong doc duoc so ca (doc duoc '${N}') — chua ket luan duoc" >&2; exit 5 ;; esac
if [ "$N" -lt "$SAN" ]; then
  echo "DO: suite plugins chay ${N} ca, IT HON san ${SAN} — co khoi im lang khong chay du suite thoat 0" >&2
  exit 4
fi
echo "PASS: suite plugins xanh va chay ${N} ca (san ${SAN}, so mot phia — them ca khong lam do; rang ban ${DAU})"
