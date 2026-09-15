#!/usr/bin/env bash
# Răng của hồ sơ do-tin-tram-phan-loai — lớp MỎNG bọc tests/workflows/triage-do-tin.test.mjs.
#
# Mỗi chân là một ca hai chiều trên harness workflow: nạp TỆP THẬT trong kho (không phải
# bản plugin cache), tác tử giả sinh phản hồi từ tải gửi đi thật, đối chứng dương trên bản
# nguyên vẹn rồi mutant trên bản sao trong bộ nhớ. Răng chỉ làm ba việc: chạy đúng chân,
# chuyển mã thoát, in đúng MỘT dòng PASS của chân đó — mọi dòng khác đi stderr để bên chấm
# không đọc nhầm chữ FAIL của một mutant-đúng-là-phải-đỏ thành lượt đỏ (bài học E5b 2.13).
#
# Mã thoát: 0 xanh · 2 chưa từng chạy (kim mutant không cắm được / chân không có / thiếu
# tệp) · 3 mutant không đỏ · 4 đối chứng dương đỏ · 5 không tới kết luận hoặc lớp không toàn
# phần · 6 thiếu tiền đề (run-log của chân trước, số mã).
#
# Dùng: rang-triage.sh --chan <tên>   (13 tên: xem bảng trong evals.yaml của hồ sơ)
set -u
WS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$WS/../.." && pwd)"
CHAN=""; [ "${1:-}" = "--chan" ] && CHAN="${2:-}"
[ -z "$CHAN" ] && { echo "FAIL: rang-triage.sh --chan <ten>" >&2; exit 2; }
T="$ROOT/tests/workflows/triage-do-tin.test.mjs"
[ -f "$T" ] || { echo "FAIL: khong co $T" >&2; exit 2; }
cd "$ROOT" || exit 2
out="$(node "$T" --chan "$CHAN" 2>&1)"; rc=$?
printf '%s\n' "$out" | grep -v '^PASS: ' | sed 's/^/  /' >&2
n="$(printf '%s\n' "$out" | grep -c '^PASS: ')"
if [ "$rc" -ne 0 ]; then echo "FAIL: chan $CHAN do (ma $rc)" >&2; exit "$rc"; fi
if [ "$n" -ne 1 ]; then echo "FAIL: chan $CHAN in $n dong PASS (doi dung 1)" >&2; exit 5; fi
printf '%s\n' "$out" | grep '^PASS: '
exit 0
