#!/usr/bin/env bash
# Răng hồ sơ cua-veto-sau-chu-ky (T3) — mỗi chân là MỘT eval của evals.yaml.
#
# VAI KHAI THẲNG: mọi chân chạy CHÍNH scripts/pre-merge-check.sh và CHÍNH
# scripts/start-scan.mjs trên fixture CODE-SINH, kèm chiều đỏ tiêm vào BẢN SAO
# trong cùng lượt. Không chân nào đọc bản chép của luật.
#
# Dùng: rang.sh --chan note-da-ky|that-con-mo|dong-tong|giu-cho|nhan-khong-dong|
#                      dang-thuc|khong-noi|luat-lan-can|cay-that|van-ban
#
# Cùng nếp không-vào-suite-vĩnh-viễn với các bộ răng hồ sơ khác: chúng chết theo
# hồ sơ khi mốc phát hành khép. Lưới thường trực của luật là ca
# tests/scripts/cua-veto-sau-chu-ky.test.mjs.
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
export CVSCK_ROOT="$ROOT"

TEN_CHAN="note-da-ky that-con-mo dong-tong giu-cho nhan-khong-dong dang-thuc khong-noi luat-lan-can cay-that van-ban"
CHAN=""
[ "${1:-}" = "--chan" ] && CHAN="${2:-}"
case " $TEN_CHAN " in
  *" $CHAN "*) ;;
  *) echo "ĐỎ: --chan '$CHAN' không khớp chân nào. Chân có: $TEN_CHAN"; exit 1 ;;
esac

chay() { # <nhãn> <script> [args...]
  local nhan="$1"; shift
  echo "== chân $CHAN: $nhan =="
  if node "$@"; then
    echo "  OK   $nhan"
    exit 0
  else
    echo "  ĐỎ   $nhan (xem thông điệp ở trên)"
    exit 1
  fi
}

case "$CHAN" in
  note-da-ky)       chay "hồ sơ làn V ĐÃ KÝ → cửa veto đã đóng" "$WS/chan-note.mjs" --ky ;;
  that-con-mo)      chay "làn V CHƯA ký → cửa veto vẫn mở"      "$WS/chan-note.mjs" --chua-ky ;;
  dong-tong)        chay "dòng tổng chỉ đếm cửa mở thật"        "$WS/chan-tong.mjs" ;;
  giu-cho)          chay "ma trận giữ-chỗ trên HAI bộ đọc"      "$WS/chan-giu-cho.mjs" ;;
  nhan-khong-dong)  chay "nhãn status không đóng cửa"           "$WS/chan-quet.mjs" ;;
  dang-thuc)        chay "đẳng thức hai bộ đọc trên 78 ô"       "$WS/chan-dang-thuc.mjs" ;;
  khong-noi)        chay "chỉ đổi LỜI, không đổi CHẶN"          "$WS/chan-khong-noi.mjs" ;;
  luat-lan-can)     chay "năm luật chặn vẫn nổ trên hồ sơ đã ký" "$WS/chan-lan-can.mjs" ;;
  cay-that)         chay "cây thật của kit"                     "$WS/chan-cay-that.mjs" ;;
  van-ban)          chay "thân lệnh · START-SCAN-KEYS · CONTEXT" "$WS/chan-van-ban.mjs" ;;
esac
