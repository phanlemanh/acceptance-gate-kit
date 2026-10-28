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
    case "$md" in *'"ban_va"'*|*'"gioi_han": []'*) echo 'HOP-DONG-NHAP.md: không còn pr_upstream, giới hạn mang ban_va' ;; *) echo 'HOP-DONG-NHAP.md thiếu ban_va'; exit 1 ;; esac
    node "$HERE/so-va.mjs" ;;
  vo) node "$HERE/rao-dong.mjs" --chi FN-04 && node "$HERE/tu-thu.mjs" --chi VO ;;
  dong-bo) node "$HERE/dong-bo.mjs" --kiem && node "$HERE/tu-thu.mjs" --chi DONG-BO ;;
  # Hồ sơ design-floor-ban-va-b-c-d (FL3).
  b-df01) node "$HERE/hop-dong.mjs" --chi DF-01 ;;
  b-df04) node "$HERE/hop-dong.mjs" --chi DF-04 ;;
  b-df05) node "$HERE/hop-dong.mjs" --chi DF-05 ;;
  b-df06) node "$HERE/hop-dong.mjs" --chi DF-06 ;;
  c) node "$HERE/hop-dong.mjs" --chi DF-02,DF-03 && node "$HERE/tu-thu.mjs" --chi C ;;
  d) node "$HERE/rao-dong.mjs" --chi FN-02,FN-04 ;;
  bo-ban-va) node "$HERE/tu-thu.mjs" --chi BO-VA ;;
  chuoi-so-va)
    node "$HERE/rao-dong.mjs" --chi VA-01,FN-01,BG-01 && node "$HERE/dong-bo.mjs" --kiem && node "$HERE/tu-thu.mjs" --chi VA-01 ;;
  # Hồ sơ design-floor-moc-s0-s1 (FL4): mỗi lệnh chạy chiều xanh và đột biến cùng nhãn của moc-s0-s1.mjs.
  df4-bac) node "$HERE/moc-s0-s1.mjs" --chi BAC ;;
  df4-bac-hong) node "$HERE/moc-s0-s1.mjs" --chi BAC-HONG ;;
  df4-tri-thuc) node "$HERE/moc-s0-s1.mjs" --chi TT ;;
  df4-tri-thuc-lech) node "$HERE/moc-s0-s1.mjs" --chi TT-LECH ;;
  df4-reuse-plan) node "$HERE/moc-s0-s1.mjs" --chi RP ;;
  df4-flow-lint) node "$HERE/moc-s0-s1.mjs" --chi FL ;;
  df4-the) node "$HERE/moc-s0-s1.mjs" --chi THE ;;
  df4-chi-ghi) node "$HERE/moc-s0-s1.mjs" --chi GHI ;;
  df4-noi-day) node "$HERE/moc-s0-s1.mjs" --chi SKILL ;;
  df4-tri-thuc-that) node "$HERE/moc-s0-s1.mjs" --chi TT-THAT ;;
  *) echo "eval.sh: không biết eval «${1:-}» — va01 fn01 bg01 ngoai-tuyen ban-va-a xfail-con luat-gioi-han vo dong-bo b-df01 b-df04 b-df05 b-df06 c d bo-ban-va chuoi-so-va df4-bac df4-bac-hong df4-tri-thuc df4-tri-thuc-lech df4-reuse-plan df4-flow-lint df4-the df4-chi-ghi df4-noi-day df4-tri-thuc-that" >&2; exit 2 ;;
esac
