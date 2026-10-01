#!/usr/bin/env bash
# Răng hồ sơ thuoc-biet-truoc-khong-phan-duoc. Mỗi chân chạy MỘT nhóm của lưới
# thường trực tests/scripts/s4-args-judgment-inputs.test.mjs trên cây thật (đối
# chứng dương) rồi trên BẢN SAO TRỌN CÂY đã tiêm một đột biến thay thế nguyên văn
# (chiều đỏ: exit ≠ 0 VÀ dòng FAIL có tên ca). Sau khi tiêm, chân chứng mũi tiêm
# trúng: mẫu khớp ĐÚNG một chỗ, bản sao khác bản thật, mutant chạy được. Bảng
# đột biến: design doc §3. Đường dẫn suy từ vị trí script; không hardcode ROOT.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
REL_NET="tests/scripts/s4-args-judgment-inputs.test.mjs"
REL_S4="feature-loop/scripts/s4-args.mjs"
REL_HOI="feature-loop/scripts/lib/hoi-ngoai-inputs.mjs"
REL_WF="feature-loop/workflows/acceptance-verify.js"
REL_QUET="docs/findings/assets/2026-10-01-quet-judgment-hoi-ngoai-inputs.cjs"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED ) (${PASS} pass, ${FAIL} do)"; [ $FAIL -eq 0 ] || exit 1; exit 0; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

CHAN=""
while [ $# -gt 0 ]; do case "$1" in --chan) CHAN="$2"; shift 2;; *) echo "rang.sh: tham số lạ $1"; exit 3;; esac; done
[ -n "$CHAN" ] || { echo "rang.sh: thiếu --chan"; exit 3; }

# Bản sao TRỌN cây làm việc (giữ _acceptance/ và docs/: JI10 dò bộ hồ sơ thật,
# JI12 chạy script quét của bản ghi phát hiện).
copy_tree() {
  local d="$TMP/copy-$RANDOM"; mkdir -p "$d"
  rsync -a --exclude .git --exclude node_modules --exclude .claude --exclude .acceptance-runs "$KIT/" "$d/" || { echo "rang.sh: rsync bản sao thất bại"; exit 1; }
  COPY="$d"
}
# Tiêm MỘT phép thay thế nguyên văn vào tệp $2 của bản sao. $1=tên $3=trước $4=sau.
inject() {
  local name="$1" rel="$2" before="$3" after="$4" f="$COPY/$2"
  COUNT=$(python3 - "$f" "$before" "$after" <<'PY'
import sys
f,b,a=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(f,encoding='utf8').read(); n=s.count(b)
if n==1: open(f,'w',encoding='utf8').write(s.replace(b,a))
print(n)
PY
)
  if [ "$COUNT" != "1" ]; then bad "đột biến $name: mẫu nguyên văn khớp $COUNT lần trong $rel (cần đúng 1) — mũi tiêm KHÔNG trúng"; return 1; fi
  if cmp -s "$KIT/$rel" "$f"; then bad "đột biến $name: bản sao BẰNG bản thật sau khi tiêm"; return 1; fi
  if ! node --check "$f" 2>/dev/null; then bad "đột biến $name: mutant lỗi cú pháp — không chạy được"; return 1; fi
  ok "đột biến $name: mũi tiêm trúng $rel, mutant chạy được"
}
# Đột biến — bảng ở design doc §3. Mỗi cặp _F (tệp) _B (trước) _A (sau).
BO_RANG_F="$REL_S4";   BO_RANG_B='const hoi = hoiNgoaiInputs(e.question);'; BO_RANG_A='const hoi = null;'
MIEN_F="$REL_S4";      MIEN_B='if (hoi) die('; MIEN_A='if (hoi && !(e.inputs || []).some(p => /diff/i.test(p))) die('
KHONG_GOP_F="$REL_HOI"; KHONG_GOP_B="String(question == null ? '' : question).replace(/\\s+/g, ' ')"; KHONG_GOP_A="String(question == null ? '' : question)"
BO_LOI_B_F="$REL_S4";  BO_LOI_B_B='(b) vế cần phán'; BO_LOI_B_A='vế cần phán'
DO_RONG_F="$REL_HOI";  DO_RONG_B='export const DIFF_REQ = /\bgit'; DO_RONG_A='export const DIFF_REQ = /\bdiff\b|\bgit'
CHAY_F="$REL_HOI";     CHAY_B='(Run|Chạy|Chay)\s*:?\s*`'; CHAY_A='(Run|Chạy|Chay)\s*:?'
HOI_DONG_F="$REL_WF";  HOI_DONG_B='BLIND: KHONG doc diff, '; HOI_DONG_A='BLIND: '
HOI_DONG2_F="$REL_WF"; HOI_DONG2_B='CHI duoc doc dung cac file liet ke'; HOI_DONG2_A='Duoc doc cac file liet ke'
SAO_LENH_F="scripts/eval-coverage-lint.js"; SAO_LENH_B="'use strict';"
SAO_LENH_A=$'\'use strict\';\nconst CMD_REQ_BAN_SAO = /(^|\\s)(Run|Chạy|Chay)\\s*:?\\s*`/i;'
SAO_F="$REL_QUET";     SAO_B="'use strict';"
SAO_A=$'\'use strict\';\nconst DIFF_REQ_BAN_SAO = /\\bdiffBase\\b|\\.\\.\\.\\s*HEAD\\b/i;'

# Chạy một nhóm của lưới trong cây $1. Trả OUT + RC.
run_group() { OUT="$(node "$1/$REL_NET" --only "$2" 2>&1)"; RC=$?; }
xanh_that() {
  run_group "$KIT" "$1"
  if [ $RC -eq 0 ] && printf '%s' "$OUT" | grep -q "PASS: $1 " && ! printf '%s' "$OUT" | grep -q "FAIL:"; then ok "cây thật: nhóm $1 xanh"; else bad "cây thật: nhóm $1 KHÔNG xanh (rc=$RC)"; printf '%s\n' "$OUT" | tail -5; fi
}
# Chiều đỏ: nhóm $1 trên bản sao tiêm đột biến $2 (biến tiền tố $3), dòng ghim $4.
do_mutant() {
  local grp="$1" name="$2" pre="$3" pin="$4" fv bv av
  fv="${pre}_F"; bv="${pre}_B"; av="${pre}_A"
  copy_tree; inject "$name" "${!fv}" "${!bv}" "${!av}" || return
  run_group "$COPY" "$grp"
  if [ $RC -ne 0 ] && printf '%s' "$OUT" | grep -qF "$pin"; then ok "chiều đỏ ($name): nhóm $grp đỏ với dòng ghim «$pin»"
  else bad "chiều đỏ ($name): nhóm $grp KHÔNG đỏ đúng cách (rc=$RC, ghim $( printf '%s' "$OUT" | grep -qF "$pin" && echo có || echo VẮNG ))"; printf '%s\n' "$OUT" | tail -5; fi
}

case "$CHAN" in
  hoi-diff)            # AC-1
    xanh_that JI7
    do_mutant JI7 bo-rang BO_RANG "FAIL: JI7 exit 2"
    do_mutant JI7 khong-gop KHONG_GOP "FAIL: JI7 khối gấp exit 2"
    do_mutant JI7 bo-loi-b BO_LOI_B "FAIL: JI7 thông điệp có đủ hai lối ra" ;;
  chay-lenh)           # AC-2
    xanh_that JI8
    do_mutant JI8 bo-rang BO_RANG "FAIL: JI8 «Run: \`» exit 2" ;;
  ten-diff-khong-mien) # AC-3
    xanh_that JI9
    do_mutant JI9 bo-rang BO_RANG "FAIL: JI9 exit 2"
    do_mutant JI9 mien-ten-diff MIEN "FAIL: JI9 exit 2" ;;
  khong-chan-oan)      # AC-4
    xanh_that JI10
    do_mutant JI10 do-rong DO_RONG "FAIL: JI10 «diff» nghĩa khác exit 0"
    do_mutant JI10 chay-khong-backtick CHAY "FAIL: JI10 «đang chạy:» exit 0" ;;
  mot-nguon)           # AC-5
    xanh_that JI12
    do_mutant JI12 ban-sao-khuon SAO "FAIL: JI12 khuôn bộ dò chỉ ở một module — «hỏi diff»"
    do_mutant JI12 ban-sao-lenh SAO_LENH "FAIL: JI12 khuôn bộ dò chỉ ở một module — «bảo chạy lệnh»" ;;
  tien-de-hoi-dong)    # AC-6
    xanh_that JI11
    do_mutant JI11 noi-hoi-dong HOI_DONG "FAIL: JI11 lời giao việc hội đồng còn mù diff"
    do_mutant JI11 noi-hoi-dong-2 HOI_DONG2 "FAIL: JI11 lời giao việc hội đồng còn mù diff" ;;
  *) echo "rang.sh: chân lạ «$CHAN» (hoi-diff|chay-lenh|ten-diff-khong-mien|khong-chan-oan|mot-nguon|tien-de-hoi-dong)"; exit 3 ;;
esac
done_chan
