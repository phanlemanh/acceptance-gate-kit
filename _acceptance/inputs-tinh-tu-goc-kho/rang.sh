#!/usr/bin/env bash
# Răng hồ sơ inputs-tinh-tu-goc-kho. Bốn chân đầu chạy MỘT nhóm của lưới thường
# trực tests/scripts/s4-args-judgment-inputs.test.mjs trên cây thật (đối chứng
# dương) rồi trên BẢN SAO TRỌN CÂY đã tiêm một đột biến thay thế nguyên văn
# (chiều đỏ: exit ≠ 0 VÀ dòng FAIL có tên ca). Sau khi tiêm, chân assert mũi tiêm
# trúng (bản sao khác bản thật) và mutant chạy được (node --check). Hai chân sau
# đo «lane hội đồng không đổi» (git diff so mốc gộp, chiều đỏ trên clone tạm) và
# «tài liệu không còn đường cũ» (grep âm tính khối inputs:, chiều đỏ tiêm dòng).
# Đường dẫn suy từ vị trí script; không hardcode ROOT.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
REL_NET="tests/scripts/s4-args-judgment-inputs.test.mjs"
REL_S4="feature-loop/scripts/s4-args.mjs"
REL_WF="feature-loop/workflows/acceptance-verify.js"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED ) (${PASS} pass, ${FAIL} do)"; [ $FAIL -eq 0 ] || exit 1; exit 0; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

CHAN=""
while [ $# -gt 0 ]; do case "$1" in --chan) CHAN="$2"; shift 2;; *) echo "rang.sh: tham số lạ $1"; exit 3;; esac; done
[ -n "$CHAN" ] || { echo "rang.sh: thiếu --chan"; exit 3; }

# Bản sao TRỌN cây làm việc (không .git, không node_modules, không hồ sơ xưởng —
# lưới chỉ cần feature-loop/ lib/ skills/ tests/ để chạy với --ag-root).
copy_tree() {
  local d="$TMP/copy-$RANDOM"; mkdir -p "$d"
  rsync -a --exclude .git --exclude node_modules --exclude .claude --exclude _acceptance --exclude docs "$KIT/" "$d/" || { echo "rang.sh: rsync bản sao thất bại"; exit 1; }
  COPY="$d"
}
# Tiêm MỘT phép thay thế nguyên văn vào s4-args.mjs của bản sao. $1=tên $2=trước $3=sau.
inject() {
  local name="$1" before="$2" after="$3" f="$COPY/$REL_S4"
  COUNT=$(python3 - "$f" "$before" "$after" <<'PY'
import sys
f,b,a=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(f,encoding='utf8').read(); n=s.count(b)
if n==1: open(f,'w',encoding='utf8').write(s.replace(b,a))
print(n)
PY
)
  if [ "$COUNT" != "1" ]; then bad "đột biến $name: mẫu nguyên văn khớp $COUNT lần (cần đúng 1) — mũi tiêm KHÔNG trúng"; return 1; fi
  if cmp -s "$KIT/$REL_S4" "$f"; then bad "đột biến $name: bản sao BẰNG bản thật sau khi tiêm"; return 1; fi
  if ! node --check "$f" 2>/dev/null; then bad "đột biến $name: mutant lỗi cú pháp — không chạy được"; return 1; fi
  ok "đột biến $name: mũi tiêm trúng, mutant chạy được"
}
MUT_GOC_CU_B='const abs = path.isAbsolute(p) ? p : path.resolve(root, p);'
MUT_GOC_CU_A='const abs = path.isAbsolute(p) ? p : path.resolve(ws, p);'
MUT_FAIL_OPEN_B='if (fs.existsSync(abs)) return abs;'
MUT_FAIL_OPEN_A='return abs;'
MUT_GOI_Y_SAI_B='viết lại thành «${path.relative(root, legacy)}»'
MUT_GOI_Y_SAI_A='viết lại thành «${legacy}»'

# Chạy một nhóm của lưới trong cây $1. Trả OUT + RC.
run_group() { OUT="$(node "$1/$REL_NET" --only "$2" 2>&1)"; RC=$?; }
# Đối chứng dương trên cây thật cho nhóm $1.
xanh_that() {
  run_group "$KIT" "$1"
  if [ $RC -eq 0 ] && printf '%s' "$OUT" | grep -q "PASS: $1 " && ! printf '%s' "$OUT" | grep -q "FAIL:"; then ok "cây thật: nhóm $1 xanh"; else bad "cây thật: nhóm $1 KHÔNG xanh (rc=$RC)"; printf '%s\n' "$OUT" | tail -5; fi
}
# Chiều đỏ: nhóm $1 trên bản sao đã tiêm đột biến $2 (trước $3, sau $4), dòng ghim $5.
do_mutant() {
  local grp="$1" name="$2" b="$3" a="$4" pin="$5"
  copy_tree; inject "$name" "$b" "$a" || return
  run_group "$COPY" "$grp"
  if [ $RC -ne 0 ] && printf '%s' "$OUT" | grep -qF "$pin"; then ok "chiều đỏ ($name): nhóm $grp đỏ với dòng ghim «$pin»"
  else bad "chiều đỏ ($name): nhóm $grp KHÔNG đỏ đúng cách (rc=$RC, ghim $( printf '%s' "$OUT" | grep -qF "$pin" && echo có || echo VẮNG ))"; printf '%s\n' "$OUT" | tail -5; fi
}

# ── AC-6: lane hội đồng không đổi — hàm kiểm dùng chung cho cây thật và clone ──
check_lane() {
  local repo="$1" base changed
  base="$(git -C "$repo" merge-base main HEAD 2>/dev/null || git -C "$repo" merge-base origin/main HEAD 2>/dev/null)"
  [ -n "$base" ] || { echo "DO: không tìm được mốc gộp với nhánh chính (main/origin/main)"; return 1; }
  if ! git -C "$repo" diff --quiet "$base"..HEAD -- "$REL_WF"; then echo "DO: lane hội đồng đã đổi: $REL_WF có diff so mốc $base"; return 1; fi
  changed="$(git -C "$repo" diff --name-only "$base"..HEAD | grep -vE '^(tests/|docs/|skills/|feature-loop/skills/|_acceptance/|\.github/|PRODUCT-MAP\.md$)' | sort | tr '\n' ' ' | sed 's/ $//')"
  if [ "$changed" != "$REL_S4" ]; then echo "DO: tập file mã đổi ≠ {$REL_S4}: {$changed}"; return 1; fi
  echo "OK: $REL_WF diff rỗng; tập file mã đổi = {$REL_S4}"; return 0
}

# ── AC-5: khối inputs: không còn phần tử theo thư mục hồ sơ; không còn câu cũ ──
DOC_FILES=(skills/acceptance/references/eval-executors.md skills/acceptance/SKILL.md feature-loop/skills/feature-loop/SKILL.md)
scan_docs() { # $1 = thư mục gốc chứa ba file; in từng vi phạm "file:dòng: lý do"; rc 1 nếu có
  python3 - "$1" "${DOC_FILES[@]}" <<'PY'
import re,sys,os
root=sys.argv[1]; bad=[]
for rel in sys.argv[2:]:
    p=os.path.join(root,rel)
    if not os.path.exists(p): bad.append(f"{rel}:0: file vắng"); continue
    inb=False
    for i,l in enumerate(open(p,encoding='utf8'),1):
        if '`inputs` judgment → abs path ·' in l: bad.append(f"{rel}:{i}: còn câu cũ «inputs judgment → abs path» trần")
        m=re.match(r'^\s*inputs:\s*(.*)$',l)
        if m:
            v=m.group(1).strip()
            if v.startswith('['):
                items=[x.strip().strip('"\'') for x in v.strip('[]').split(',') if x.strip()]
                for it in items:
                    if re.match(r'^(contract\.md|evidence/|\.\./)',it): bad.append(f"{rel}:{i}: inputs theo thư mục hồ sơ: {it}")
                inb=False
            else: inb=(v=='')
            continue
        if inb:
            im=re.match(r'^\s*-\s+(\S+)',l)
            if im:
                it=im.group(1).strip('"\'')
                if re.match(r'^(contract\.md|evidence/|\.\./)',it): bad.append(f"{rel}:{i}: inputs theo thư mục hồ sơ: {it}")
            elif l.strip() and not l.strip().startswith('#'): inb=False
for b in bad: print(b)
sys.exit(1 if bad else 0)
PY
}

case "$CHAN" in
  goc-kho-giu)
    xanh_that JI1
    do_mutant JI1 goc-cu "$MUT_GOC_CU_B" "$MUT_GOC_CU_A" "FAIL: JI1 inputs = abs path tính từ gốc kho"
    done_chan ;;
  thieu-exit-2)
    xanh_that JI2
    do_mutant JI2 fail-open "$MUT_FAIL_OPEN_B" "$MUT_FAIL_OPEN_A" "FAIL: JI2 exit 2"
    done_chan ;;
  duong-cu-goi-y)
    xanh_that JI3
    do_mutant JI3 goc-cu "$MUT_GOC_CU_B" "$MUT_GOC_CU_A" "FAIL: JI3 exit 2, không sinh tệp"
    do_mutant JI3 goi-y-sai "$MUT_GOI_Y_SAI_B" "$MUT_GOI_Y_SAI_A" "FAIL: JI3 gợi ý viết lại «src/a.ts»"
    done_chan ;;
  abs-hai-chieu)
    xanh_that JI4
    do_mutant JI4 fail-open "$MUT_FAIL_OPEN_B" "$MUT_FAIL_OPEN_A" "FAIL: JI4 abs path không có → exit 2 nêu tên, không sinh tệp"
    done_chan ;;
  lane-doc-khong-doi)
    R="$(check_lane "$KIT")"; RC=$?; echo "  $R"
    [ $RC -eq 0 ] && ok "cây thật: lane hội đồng không đổi, tập file mã đổi đúng" || bad "cây thật: $R"
    CL="$TMP/clone"; git clone -q "$KIT" "$CL" 2>/dev/null || { bad "clone tạm thất bại"; done_chan; }
    git -C "$CL" config user.email t@t.t; git -C "$CL" config user.name T
    printf '\n// dong tiem thu\n' >> "$CL/$REL_WF"; git -C "$CL" commit -qam "tiem" 
    R2="$(check_lane "$CL")"; RC2=$?
    if [ $RC2 -ne 0 ] && printf '%s' "$R2" | grep -q "lane hội đồng đã đổi"; then ok "chiều đỏ 1: clone có commit chạm acceptance-verify.js → đỏ với dòng ghim"; else bad "chiều đỏ 1 KHÔNG đỏ đúng cách (rc=$RC2): $R2"; fi
    CL2="$TMP/clone2"; git clone -q "$KIT" "$CL2" 2>/dev/null || { bad "clone tạm 2 thất bại"; done_chan; }
    git -C "$CL2" config user.email t@t.t; git -C "$CL2" config user.name T
    printf 'export const la = 1;\n' > "$CL2/lib/tiem-file-la.mjs"; git -C "$CL2" add lib/tiem-file-la.mjs; git -C "$CL2" commit -qm "tiem file la"
    R3="$(check_lane "$CL2")"; RC3=$?
    if [ $RC3 -ne 0 ] && printf '%s' "$R3" | grep -qF "tập file mã đổi ≠ {$REL_S4}" && printf '%s' "$R3" | grep -qF "lib/tiem-file-la.mjs"; then ok "chiều đỏ 2: clone có commit thêm file mã lạ lib/tiem-file-la.mjs → đỏ với dòng ghim nêu tên file"; else bad "chiều đỏ 2 KHÔNG đỏ đúng cách (rc=$RC3): $R3"; fi
    done_chan ;;
  tai-lieu-khong-con-duong-cu)
    R="$(scan_docs "$KIT")"; RC=$?
    [ $RC -eq 0 ] && ok "cây thật: ba file tài liệu không còn inputs theo thư mục hồ sơ, không còn câu cũ" || { bad "cây thật còn vi phạm:"; printf '%s\n' "$R"; }
    D="$TMP/docs"; for f in "${DOC_FILES[@]}"; do mkdir -p "$D/$(dirname "$f")"; cp "$KIT/$f" "$D/$f"; done
    printf '\n    inputs:\n      - contract.md\n' >> "$D/${DOC_FILES[0]}"
    LN=$(wc -l < "$D/${DOC_FILES[0]}" | tr -d ' ')
    R2="$(scan_docs "$D")"; RC2=$?
    if [ $RC2 -ne 0 ] && printf '%s' "$R2" | grep -qF "${DOC_FILES[0]}:${LN}: inputs theo thư mục hồ sơ: contract.md"; then ok "chiều đỏ 1: tiêm «- contract.md» dưới inputs: → bắt đúng file + dòng $LN"; else bad "chiều đỏ 1 KHÔNG bắt đúng (rc=$RC2): $R2"; fi
    printf '\n· `inputs` judgment → abs path ·\n' >> "$D/${DOC_FILES[2]}"
    LN2=$(wc -l < "$D/${DOC_FILES[2]}" | tr -d ' ')
    R3="$(scan_docs "$D")"; RC3=$?
    if [ $RC3 -ne 0 ] && printf '%s' "$R3" | grep -qF "${DOC_FILES[2]}:${LN2}: còn câu cũ"; then ok "chiều đỏ 2: tiêm câu cũ → bắt đúng file + dòng $LN2"; else bad "chiều đỏ 2 KHÔNG bắt đúng (rc=$RC3): $R3"; fi
    done_chan ;;
  *) echo "rang.sh: chân lạ: $CHAN"; exit 3 ;;
esac
