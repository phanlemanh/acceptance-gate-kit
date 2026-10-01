#!/usr/bin/env bash
# Răng hồ sơ luot-cham-ghi-vao-cay. Mỗi chân chạy MỘT nhóm của lưới thường trực
# tests/scripts/cay-doi-trong-luot.test.mjs trên cây thật (đối chứng dương) rồi trên
# BẢN SAO TRỌN CÂY đã tiêm một đột biến thay thế nguyên văn (chiều đỏ: exit ≠ 0 VÀ dòng
# FAIL có tên ca). Sau khi tiêm, chân chứng mũi tiêm trúng: mẫu khớp ĐÚNG một chỗ, bản
# sao khác bản thật, mutant chạy được. Bảng đột biến: design doc §6. Đường dẫn suy từ vị
# trí script; không hardcode ROOT. Bản sao không có .git → ca «trước vòng» đọc git ở kho
# gốc qua LC_GOC.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
REL_NET="tests/scripts/cay-doi-trong-luot.test.mjs"
REL_CAY="feature-loop/scripts/lib/cay-doi.mjs"
REL_TV="feature-loop/scripts/thuoc-vat.mjs"
REL_S4="feature-loop/scripts/s4-args.mjs"
REL_LIB="lib/nhan-canh-gay.cjs"
REL_RC="scripts/recheck-evidence.cjs"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED ) (${PASS} pass, ${FAIL} do)"; [ $FAIL -eq 0 ] || exit 1; exit 0; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

CHAN=""
while [ $# -gt 0 ]; do case "$1" in --chan) CHAN="$2"; shift 2;; *) echo "rang.sh: tham số lạ $1"; exit 3;; esac; done
[ -n "$CHAN" ] || { echo "rang.sh: thiếu --chan"; exit 3; }

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
# Đột biến — bảng ở design doc §6. Mỗi cặp _F (tệp) _B (trước) _A (sau).
BO_SO_F="$REL_TV";          BO_SO_B='const cay = (argsTep && argsTep.cayChup) || null;'; BO_SO_A='const cay = null;'
CHI_DIFF_F="$REL_CAY";      CHI_DIFF_B="    ...tachZ(git(root, ['log', '--format=', '--name-only', '-z', \`\${sha}..HEAD\`])).map(s => s.trim()).filter(Boolean),"; CHI_DIFF_A=''
TRU_RUNS_F="$REL_CAY";      TRU_RUNS_B="  '.acceptance-runs/',"; TRU_RUNS_A=''
TRU_EVID_F="$REL_CAY";      TRU_EVID_B="  \`_acceptance/\${slug}/evidence/\`,"; TRU_EVID_A=''
TRU_CLAUDE_F="$REL_CAY";    TRU_CLAUDE_B="  '.claude/',"; TRU_CLAUDE_A=''
XET_CHUA_F="$REL_CAY";      XET_CHUA_B='const ung = new Set([...doiSoVoi(root, sha), ...Object.keys(ban)].filter(vung));'; XET_CHUA_A='const ung = new Set([...doiSoVoi(root, sha), ...Object.keys(ban), ...chuaTheoDoiCuaCay(root)].filter(vung));'
HOAN_LAI_F="$REL_S4";       HOAN_LAI_B='  if (L && !daThay) {'; HOAN_LAI_A='  if (false) {'
LIB_CAY_F="$REL_LIB";       LIB_CAY_B='  if (cayDong) {'; LIB_CAY_A='  if (false) {'
NANG_LUC_F="$REL_RC";       NANG_LUC_B="if (ncg && typeof ncg.luotKhongDungDuoc === 'function') {"; NANG_LUC_A='if (ncg) {'

run_group() { OUT="$(LC_GOC="$KIT" node "$1/$REL_NET" --only "$2" 2>&1)"; RC=$?; }
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
  chup)    # AC-1
    xanh_that LC1
    do_mutant LC1 khong-tru-runs TRU_RUNS "FAIL: LC1" ;;
  do)      # AC-2
    xanh_that LC2
    do_mutant LC2 bo-so BO_SO "FAIL: LC2 hang 1"
    do_mutant LC2 chi-diff CHI_DIFF "FAIL: LC2 hang 4" ;;
  im)      # AC-3
    xanh_that LC3
    do_mutant LC3 khong-tru-runs TRU_RUNS "FAIL: LC3 hang 2"
    do_mutant LC3 khong-tru-evidence TRU_EVID "FAIL: LC3 hang 3"
    do_mutant LC3 khong-tru-claude TRU_CLAUDE "FAIL: LC3 hang 10"
    do_mutant LC3 xet-chua-theo-doi XET_CHUA "FAIL: LC3 hang 9" ;;
  lib)     # AC-4
    xanh_that LC4
    do_mutant LC4 lib-bo-cay LIB_CAY "FAIL: LC4" ;;
  round)   # AC-5
    xanh_that LC5
    do_mutant LC5 lib-bo-cay LIB_CAY "FAIL: LC5 round"
    do_mutant LC5 bo-kiem-hoan-lai HOAN_LAI "FAIL: LC5 hoan lai" ;;
  the)     # AC-6
    xanh_that LC6
    do_mutant LC6 lib-bo-cay LIB_CAY "FAIL: LC6" ;;
  luoi)    # AC-7
    xanh_that LC7
    do_mutant LC7 lib-bo-cay LIB_CAY "FAIL: LC7"
    do_mutant LC7 bo-do-nang-luc NANG_LUC "FAIL: LC7 lib doi cu" ;;
  *) echo "rang.sh: chân lạ «$CHAN» (chup|do|im|lib|round|the|luoi)"; exit 3 ;;
esac
done_chan
