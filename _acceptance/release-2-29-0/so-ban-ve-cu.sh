#!/usr/bin/env bash
# so-ban-ve-cu.sh — cờ «bản vẽ cũ» của câu tín hiệu và tài liệu khối dữ liệu ghi đúng số bản chứa câu cho người gửi.
# Vì sao: hạt giống docs/plans/2026-10-13-hat-giong-co-ban-ve-cu-ghi-dung-so-ban.md — vòng cau-tin-hieu-nguoi-gui dời
# khỏi 2.28, v2.28.0 phát hành không có cau_nguoi_gui, mà cờ bảo «vẽ lại bằng kit ≥ 2.28».
#   bash so-ban-ve-cu.sh [<ref>]   — vắng ref: cây làm việc; có ref: đọc bằng git show <ref>:<tệp>
#   exit 0: KHÔNG còn câu số bản nào nói 2.28 VÀ đúng 5 câu nói 2.29 (2 ở scripts/tin-hieu.mjs, 3 ở tài liệu) · 1 lệch
REF="${1:-}"
doc() { if [ -n "$REF" ]; then git show "$REF:$1"; else cat "$1"; fi; }
MAU='kit (≥|<) 2\.2[89]|trước 2\.2[89]'   # chỉ 2.28/2.29: dòng «trước 2.27» của khối lộ trình là chuyện khác
rc=0
for spec in "scripts/tin-hieu.mjs:2" "skills/acceptance/references/lo-trinh-du-lieu.md:3"; do
  f=${spec%:*}; can=${spec##*:}
  noi=$(doc "$f" | grep -oE "$MAU")
  cu=$(printf '%s\n' "$noi" | grep -vc '2\.29$')
  moi=$(printf '%s\n' "$noi" | grep -c '2\.29$')
  echo "$f: câu nói 2.29 = $moi (cần $can) · câu nói số bản khác = $cu"
  [ "$moi" -eq "$can" ] && [ "$cu" -eq 0 ] || { echo "ĐỎ: $f ghi số bản sai"; rc=1; }
done
[ $rc -eq 0 ] && echo "XANH: cờ và tài liệu nói ≥ 2.29"
exit $rc
