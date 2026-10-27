#!/usr/bin/env bash
# Lệnh của các eval df_* (hồ sơ design-floor-vendor-va-ban-va-a): mỗi lệnh chạy CHIỀU XANH trên cây thật rồi
# CHIỀU ĐỎ (đột biến của tu-thu.mjs mang cùng nhãn). Một chỗ cho chuỗi lệnh, để config.yaml khỏi lồng nháy.
set -u
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"
cd "$ROOT" || exit 2
case "${1:-}" in
  va01) node "$HERE/rao-dong.mjs" --chi VA-01 && node "$HERE/tu-thu.mjs" --chi VA-01 ;;
  fn01) node "$HERE/rao-dong.mjs" --chi FN-01 && node "$HERE/tu-thu.mjs" --chi FN-01 ;;
  bg01) node "$HERE/rao-dong.mjs" --chi BG-01 && node "$HERE/tu-thu.mjs" --chi BG-01 ;;
  ngoai-tuyen)
    DESIGN_FLOOR_KHONG_MANG=1 bash "$HERE/run-tests.sh" || exit 1
    y="$(sed -n '/^  design-floor:/,/^  [a-z][a-z-]*:$/p' .github/workflows/gate.yml)"
    case "$y" in
      *DESIGN_FLOOR_KHONG_MANG*run-tests.sh*) echo 'gate.yml: job design-floor đặt DESIGN_FLOOR_KHONG_MANG và chạy run-tests.sh' ;;
      *) echo 'gate.yml: job design-floor THIẾU DESIGN_FLOOR_KHONG_MANG trước run-tests.sh'; exit 1 ;;
    esac ;;
  ban-va-a)
    node "$HERE/hop-dong.mjs" --chi DF-07,DF-08 && node "$HERE/rao-dong.mjs" --chi FN-02 \
      && node "$HERE/khoi-may-ban-va-a.mjs" && node "$HERE/tu-thu.mjs" --chi BAN-VA-A ;;
  xfail-con) node "$HERE/hop-dong.mjs" --chi DF-01,DF-02,DF-03,DF-04,DF-05,DF-06,DF-09 ;;
  luat-gioi-han)
    node "$HERE/tu-thu.mjs" --chi LUAT || exit 1
    md="$(cat design-floor/HOP-DONG-NHAP.md)"
    case "$md" in *pr_upstream*) echo 'HOP-DONG-NHAP.md còn pr_upstream'; exit 1 ;; esac
    case "$md" in *'"ban_va"'*) echo 'HOP-DONG-NHAP.md: không còn pr_upstream, giới hạn mang ban_va' ;; *) echo 'HOP-DONG-NHAP.md thiếu ban_va'; exit 1 ;; esac ;;
  vo) node "$HERE/rao-dong.mjs" --chi FN-04 && node "$HERE/tu-thu.mjs" --chi VO ;;
  dong-bo) node "$HERE/dong-bo.mjs" --kiem && node "$HERE/tu-thu.mjs" --chi DONG-BO ;;
  *) echo "eval.sh: không biết eval «${1:-}» — va01 fn01 bg01 ngoai-tuyen ban-va-a xfail-con luat-gioi-han vo dong-bo" >&2; exit 2 ;;
esac
