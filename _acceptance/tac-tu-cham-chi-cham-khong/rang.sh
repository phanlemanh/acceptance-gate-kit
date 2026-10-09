#!/usr/bin/env bash
# Răng hồ sơ tac-tu-cham-chi-cham-khong. Mỗi chân chạy MỘT nhóm của lưới thường trực
# (tests/workflows/tac-tu-cham-hep.test.mjs cho AT1–AT4, tests/scripts/ghi-boi-tac-tu-cham.test.mjs
# cho AT5–AT6) trên cây thật (đối chứng dương) rồi trên BẢN SAO TRỌN CÂY đã tiêm một đột biến thay
# thế nguyên văn (chiều đỏ: exit ≠ 0 VÀ dòng FAIL có tên ca). Sau khi tiêm, chân chứng mũi tiêm
# trúng: mẫu khớp ĐÚNG một chỗ, bản sao khác bản thật, mutant .js/.mjs chạy được. Bảng đột biến:
# design doc §7 + kế hoạch Task 5. Đường dẫn suy từ vị trí script; không hardcode ROOT. Bản sao
# không có .git → AT3 lấy v2.26.0 từ kho gốc qua AT_GOC.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
REL_WF_TEST="tests/workflows/tac-tu-cham-hep.test.mjs"
REL_SC_TEST="tests/scripts/ghi-boi-tac-tu-cham.test.mjs"
REL_AV="feature-loop/workflows/acceptance-verify.js"
REL_GB="feature-loop/scripts/lib/ghi-boi.mjs"
REL_S4="feature-loop/scripts/s4-args.mjs"
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
  case "$rel" in *.js|*.mjs) if ! node --check "$f" 2>/dev/null; then bad "đột biến $name: mutant lỗi cú pháp — không chạy được"; return 1; fi;; esac
  ok "đột biến $name: mũi tiêm trúng $rel"
}
# Đột biến — mỗi bộ _F (tệp) _B (trước) _A (sau).
WRITE_DOC_F="feature-loop/agents/cham-doc.md";  WRITE_DOC_B='tools: Read, Grep, Glob';        WRITE_DOC_A='tools: Read, Grep, Glob, Write'
EDIT_LENH_F="feature-loop/agents/cham-lenh.md"; EDIT_LENH_B='tools: Bash, Read, Grep, Glob';  EDIT_LENH_A='tools: Bash, Read, Grep, Glob, Edit'
GO_EDIT_UI_F="feature-loop/agents/cham-ui.md";  GO_EDIT_UI_B='disallowedTools: Edit, Write, NotebookEdit'; GO_EDIT_UI_A='disallowedTools: Write, NotebookEdit'
BO_LOAI_F="$REL_AV";   BO_LOAI_B='const vaiOpt = role => ({ ...modelOpt(role), agentType: AGENT_TYPES[role] })'; BO_LOAI_A='const vaiOpt = role => ({ ...modelOpt(role) })'
DAO_JUDGE_F="$REL_AV"; DAO_JUDGE_B="judge: 'feature-loop:cham-doc', triage:"; DAO_JUDGE_A="judge: 'feature-loop:cham-lenh', triage:"
DE_BAI_F="$REL_AV";    DE_BAI_B='const DUOI_LENH_MAY = `KHONG sua code.'; DE_BAI_A='const DUOI_LENH_MAY = `KHONG sua code.x'
MOI_LOI_F="$REL_AV";   MOI_LOI_B='if (!opts.agentType || !LOAI_VANG_RE.test(msg)) throw e'; MOI_LOI_A='if (!opts.agentType) throw e'
KHONG_DONG_F="$REL_AV"; KHONG_DONG_B='const ghiLoaiVang = lines => {'; KHONG_DONG_A='const ghiLoaiVang = lines => { return;'
GHI_RE_F="$REL_GB";    GHI_RE_B='export const GHI_RE = /^('; GHI_RE_A='export const GHI_RE = /()|^('
NHANH_CD_F="$REL_GB";  NHANH_CD_B="if (tk[0] === 'cd' && tk[1]) { cwd = thuc(path.resolve(cwd, tk[1])); continue; }"; NHANH_CD_A="if (tk[0] === 'cd' && tk[1]) { continue; }"
TU_RESET_F="feature-loop/scripts/thuoc-vat.mjs"; TU_RESET_B="fs.appendFileSync(runLogPath, dg + '\\n');"; TU_RESET_A="fs.appendFileSync(runLogPath, dg + '\\n'); execFileSync('git', ['-C', root, 'reset', '-q', '--keep', cay.sha]);"
CA_LUOT_F="$REL_AV";   CA_LUOT_B='if (loaiVangCaLuot && opts.agentType) {'; CA_LUOT_A='if (false) {'
CHUOI_CON_F="$REL_GB"; CHUOI_CON_B='    const sub = gitCon(tk);'; CHUOI_CON_A="    const sub = /^git\\b/.test(d) ? ((d.match(/\\b(checkout|restore|apply|am|stash|reset|rebase|merge|cherry-pick|rm|mv|commit)\\b/) || [])[1] || 'x') : null;"

run_group() { OUT="$(AT_GOC="$KIT" node "$1/$2" --only "$3" 2>&1)"; RC=$?; }
xanh_that() {   # $1=tệp test $2=nhóm
  run_group "$KIT" "$1" "$2"
  if [ $RC -eq 0 ] && printf '%s' "$OUT" | grep -q "PASS: $2 " && ! printf '%s' "$OUT" | grep -q "FAIL:"; then ok "cây thật: nhóm $2 xanh"; else bad "cây thật: nhóm $2 KHÔNG xanh (rc=$RC)"; printf '%s\n' "$OUT" | tail -5; fi
}
# Chiều đỏ: nhóm $2 của tệp $1 trên bản sao tiêm đột biến $3 (biến tiền tố $4), dòng ghim $5.
do_mutant() {
  local tep="$1" grp="$2" name="$3" pre="$4" pin="$5" fv bv av
  fv="${pre}_F"; bv="${pre}_B"; av="${pre}_A"
  copy_tree; inject "$name" "${!fv}" "${!bv}" "${!av}" || return
  run_group "$COPY" "$tep" "$grp"
  if [ $RC -ne 0 ] && printf '%s' "$OUT" | grep -qF "$pin"; then ok "chiều đỏ ($name): nhóm $grp đỏ với dòng ghim «$pin»"
  else bad "chiều đỏ ($name): nhóm $grp KHÔNG đỏ đúng cách (rc=$RC, ghim $( printf '%s' "$OUT" | grep -qF "$pin" && echo có || echo VẮNG ))"; printf '%s\n' "$OUT" | tail -5; fi
}

case "$CHAN" in
  dinh-nghia)   # AC-1
    xanh_that "$REL_WF_TEST" AT1
    do_mutant "$REL_WF_TEST" AT1 them-write-cham-doc WRITE_DOC "FAIL: AT1 cham-doc Write"
    do_mutant "$REL_WF_TEST" AT1 them-edit-cham-lenh EDIT_LENH "FAIL: AT1 cham-lenh Edit"
    do_mutant "$REL_WF_TEST" AT1 go-edit-cham-ui GO_EDIT_UI "FAIL: AT1 cham-ui Edit" ;;
  bang-vai)     # AC-2
    xanh_that "$REL_WF_TEST" AT2
    do_mutant "$REL_WF_TEST" AT2 agentT-bo-loai BO_LOAI "FAIL: AT2 thieu agentType"
    do_mutant "$REL_WF_TEST" AT2 dao-judge DAO_JUDGE "FAIL: AT2 judge" ;;
  luot-sach)    # AC-3
    xanh_that "$REL_WF_TEST" AT3
    do_mutant "$REL_WF_TEST" AT3 chen-ky-tu-de-bai DE_BAI "FAIL: AT3 de bai" ;;
  duong-roi)    # AC-4
    xanh_that "$REL_WF_TEST" AT4
    do_mutant "$REL_WF_TEST" AT4 goi-lai-moi-loi MOI_LOI "FAIL: AT4 im"
    do_mutant "$REL_WF_TEST" AT4 khong-ghi-dong KHONG_DONG "FAIL: AT4 dong"
    do_mutant "$REL_WF_TEST" AT4 bo-co-ca-luot CA_LUOT "FAIL: AT4 ca luot" ;;
  quy-trach)    # AC-5
    xanh_that "$REL_SC_TEST" AT5
    do_mutant "$REL_SC_TEST" AT5 bo-ghi-re GHI_RE "FAIL: AT5 hang 7"
    do_mutant "$REL_SC_TEST" AT5 bo-nhanh-cd NHANH_CD "FAIL: AT5 hang 8"
    do_mutant "$REL_SC_TEST" AT5 git-theo-chuoi-con CHUOI_CON "FAIL: AT5 hang 12" ;;
  khong-doi-cay) # AC-6
    xanh_that "$REL_SC_TEST" AT6
    do_mutant "$REL_SC_TEST" AT6 tu-reset-sau-luot TU_RESET "FAIL: AT6 khong doi cay" ;;
  *) echo "rang.sh: chân lạ «$CHAN» (dinh-nghia|bang-vai|luot-sach|duong-roi|quy-trach|khong-doi-cay)"; exit 3 ;;
esac
done_chan
