#!/usr/bin/env bash
# Răng hồ sơ inputs-tinh-tu-goc-kho. Bốn chân đầu chạy MỘT nhóm của lưới thường
# trực tests/scripts/s4-args-judgment-inputs.test.mjs trên cây thật (đối chứng
# dương) rồi trên BẢN SAO TRỌN CÂY đã tiêm một đột biến thay thế nguyên văn
# (chiều đỏ: exit ≠ 0 VÀ dòng FAIL có tên ca). Sau khi tiêm, chân assert mũi tiêm
# trúng (bản sao khác bản thật) và mutant chạy được (node --check). Hai chân sau
# đo «lane hội đồng không đổi» (vế sống so mốc đã ký + vế chứng-một-lần trên
# khoảng đã giao; xem hồ sơ thuoc-khai-mot-dang-do-mot-neo) và «tài liệu không còn
# đường cũ» (grep âm tính khối inputs:, chiều đỏ tiêm dòng).
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
MUT_FAIL_OPEN_B='if (st && st.isFile()) return abs;'
MUT_FAIL_OPEN_A='return abs;'
MUT_THU_MUC_LOT_B='if (st && st.isFile()) return abs;'
MUT_THU_MUC_LOT_A='if (st) return abs;'
MUT_BO_MIEN_TRU_B='if (!path.isAbsolute(p) && norm.startsWith(EVIDENCE_PREFIX)) {'
MUT_BO_MIEN_TRU_A='if (false) {'
MUT_MIEN_TRU_RONG_B='if (!path.isAbsolute(p) && norm.startsWith(EVIDENCE_PREFIX)) {'
MUT_MIEN_TRU_RONG_A="if (!path.isAbsolute(p) && norm.includes('/evidence/')) {"
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

# ── AC-6: lane hội đồng không đổi — HAI vế, hai bản chất khác nhau ──
# Vá 06/09/2026 bởi hồ sơ thuoc-khai-mot-dang-do-mot-neo. Bản cũ lấy mốc bằng
# `git merge-base main HEAD`, tức đo HÌNH DẠNG NHÁNH của tác giả: đúng trên nhánh
# viết ra nó, đỏ vĩnh viễn với mọi người đi sau (trên `main` sạch: 0 pass, 3 do).
# HAI mốc dưới đây là hằng có chủ ý — đổi lane hợp pháp về sau thì phải dời mốc kèm
# lý do, như tree-hash của NOTICE ở P196.
MOC_KY="9b3d6f64aa4ec39e076e9a867293cda5698b362d"   # verified_commit đã ký của hồ sơ này
MOC_GOP="1765b5504b52bb5cb3f8f22ca5deaf58d8347799"  # cha^1 của merge commit 5c15e065

# Mốc vắng (lịch sử viết lại, clone nông) → ĐỎ gọi tên sha, không xanh im lặng.
co_moc() {
  local repo="$1"; shift; local sha
  for sha in "$@"; do
    git -C "$repo" cat-file -e "${sha}^{commit}" 2>/dev/null || { echo "DO: mốc đã neo không có trong kho: $sha"; return 1; }
  done
  return 0
}

# Vế MỘT — SỐNG trên cây hôm nay: lane hội đồng phải giống bản tại mốc đã ký.
# Ai sửa acceptance-verify.js là đỏ ngay, ở mọi cây, mọi ngày.
lane_song() {
  local repo="$1" r
  r="$(co_moc "$repo" "$MOC_KY")" || { echo "$r"; return 1; }
  # So CÂY LÀM VIỆC (không nêu HEAD) — sửa chưa commit cũng phải bị bắt.
  if ! git -C "$repo" diff --quiet "$MOC_KY" -- "$REL_WF"; then
    echo "DO: lane hội đồng đã đổi: $REL_WF trên cây khác bản tại mốc ký $MOC_KY"; return 1
  fi
  echo "OK: vế lane (sống) — $REL_WF trên cây giống bản tại mốc ký $MOC_KY"; return 0
}

# ── Độc lập HEAD, đo bằng phép QUÉT TĨNH trên chính thân hai hàm ──
# Vì sao không đo bằng cách chạy hai lượt trên hai cây: `lane_song` và `tap_file`
# chỉ đọc hai hằng mốc cộng cây làm việc, nên chúng độc lập HEAD *theo cấu trúc* —
# hai lượt bằng nhau là tất yếu, không phải tính chất đo được, và mọi «đối chứng
# âm» dựng quanh nó lại là hằng đúng (S4 vòng 1 và 2 đều REJECT đúng chỗ này).
# Tính chất cấu trúc thì đo bằng phép quét cấu trúc: thân hai hàm KHÔNG được nhắc
# tới điểm neo động nào. Chiều đỏ rẻ và thật — thêm `HEAD` vào là đỏ ngay.
NEO_DONG='HEAD|merge-base|rev-parse|@\{|ORIG_HEAD|FETCH_HEAD'
than_ham() { # in thân hàm $2 trong file $1 — chỉ MÃ, bỏ dòng chú thích thuần
  # Bỏ chú thích là bắt buộc: chính chú thích của các hàm này NÓI về HEAD (đó là
  # điều chúng khai không dùng), nên quét cả văn xuôi thì phép đo tự cắn mình.
  awk -v f="$2" 'BEGIN{inf=0} $0 ~ "^"f"\\(\\) \\{" {inf=1} inf{print} inf && /^\}$/{exit}' "$1" | grep -vE '^[[:space:]]*#'
}
quet_neo_dong() { # $1 file răng; in vi phạm, rc 1 nếu có
  local f="$1" ham hit rc=0
  for ham in lane_song tap_file co_moc; do
    hit="$(than_ham "$f" "$ham" | grep -nE "$NEO_DONG" || true)"
    if [ -n "$hit" ]; then echo "DO: thân $ham nhắc điểm neo ĐỘNG — phép đo hết độc lập HEAD: $(printf '%s' "$hit" | tr '\n' ' ')"; rc=1; fi
  done
  [ $rc -eq 0 ] && echo "OK: thân lane_song · tap_file · co_moc không nhắc điểm neo động nào ($NEO_DONG)"
  return $rc
}

# Vế HAI — CHỨNG-MỘT-LẦN về đợt đã giao: trong khoảng cố định, tập file mã đổi
# đúng bằng {REL_S4}. Với đối số thật vế này cho câu trả lời HẰNG (chỉ còn hai kết
# cục: xanh, hoặc mốc-mất) — điều đó khai thẳng ở contract, và chiều đỏ của nó
# được dựng trên KHO GIẢ đi qua đúng chữ ký hàm này.
tap_file() {
  local repo="$1" base="$2" tip="$3" changed r
  r="$(co_moc "$repo" "$base" "$tip")" || { echo "$r"; return 1; }
  changed="$(git -C "$repo" diff --name-only "$base".."$tip" | grep -vE '^(tests/|docs/|skills/|feature-loop/skills/|_acceptance/|\.github/|PRODUCT-MAP\.md$)' | sort | tr '\n' ' ' | sed 's/ $//')"
  if [ "$changed" != "$REL_S4" ]; then echo "DO: tập file mã đổi ≠ {$REL_S4}: {$changed}"; return 1; fi
  echo "OK: vế tập-file (chứng-một-lần) — trong $base..$tip tập file mã đổi = {$REL_S4}"; return 0
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
  bang-chung-cung-ho-so)
    xanh_that JI5
    do_mutant JI5 bo-mien-tru "$MUT_BO_MIEN_TRU_B" "$MUT_BO_MIEN_TRU_A" "FAIL: JI5 bằng chứng cùng hồ sơ chưa có → vẫn sinh args"
    do_mutant JI5 mien-tru-rong "$MUT_MIEN_TRU_RONG_B" "$MUT_MIEN_TRU_RONG_A" "FAIL: JI5 evidence của hồ sơ KHÁC vắng → exit 2"
    done_chan ;;
  thu-muc-khong-phai-file)
    xanh_that JI6
    do_mutant JI6 thu-muc-lot "$MUT_THU_MUC_LOT_B" "$MUT_THU_MUC_LOT_A" "FAIL: JI6 thư mục → exit 2"
    done_chan ;;
  lane-doc-khong-doi)
    R="$(lane_song "$KIT")"; RC=$?; echo "  $R"
    [ $RC -eq 0 ] && ok "cây thật: vế lane (sống) — lane hội đồng chưa đổi" || bad "cây thật: $R"
    R="$(tap_file "$KIT" "$MOC_GOP" "$MOC_KY")"; RC=$?; echo "  $R"
    [ $RC -eq 0 ] && ok "cây thật: vế tập-file (chứng-một-lần) — đợt đã giao đúng một file mã" || bad "cây thật: $R"

    # ── chiều đỏ 1 (vế lane, SỐNG): clone sửa workflow trên cây hôm nay ──
    CL="$TMP/clone"; git clone -q "$KIT" "$CL" 2>/dev/null || { bad "clone tạm thất bại"; done_chan; }
    git -C "$CL" config user.email t@t.t; git -C "$CL" config user.name T
    printf '\n// dong tiem thu\n' >> "$CL/$REL_WF"; git -C "$CL" commit -qam "tiem"
    R2="$(lane_song "$CL")"; RC2=$?
    if [ $RC2 -ne 0 ] && printf '%s' "$R2" | grep -q "lane hội đồng đã đổi"; then ok "chiều đỏ 1: clone sửa acceptance-verify.js → vế lane ĐỎ với dòng ghim"; else bad "chiều đỏ 1 KHÔNG đỏ đúng cách (rc=$RC2): $R2"; fi

    # ── KHO GIẢ: chiều đỏ 2 của vế tập-file đi qua ĐÚNG chữ ký production ──
    # Hai tip trên CÙNG một fixture: tip1 chỉ đổi REL_S4 (phải XANH), tip2 thêm
    # một file mã lạ (phải ĐỎ nêu tên). Không đi vòng qua HEAD của clone.
    FAKE="$TMP/kho-gia"; mkdir -p "$FAKE/$(dirname "$REL_S4")" "$FAKE/lib" "$FAKE/tests"
    git -C "$FAKE" init -q 2>/dev/null || { bad "kho giả: init thất bại"; done_chan; }
    git -C "$FAKE" config user.email t@t.t; git -C "$FAKE" config user.name T
    echo "goc" > "$FAKE/$REL_S4"; echo "doc" > "$FAKE/tests/x.md"
    git -C "$FAKE" add -A; git -C "$FAKE" commit -qm "goc"
    FBASE="$(git -C "$FAKE" rev-parse HEAD)"
    echo "doi" >> "$FAKE/$REL_S4"; echo "doc2" >> "$FAKE/tests/x.md"
    git -C "$FAKE" add -A; git -C "$FAKE" commit -qm "chi s4-args"
    FTIP1="$(git -C "$FAKE" rev-parse HEAD)"
    R3="$(tap_file "$FAKE" "$FBASE" "$FTIP1")"; RC3=$?
    if [ $RC3 -eq 0 ]; then ok "kho giả, đối chứng dương: khoảng chỉ đổi $REL_S4 → vế tập-file xanh"; else bad "kho giả, đối chứng dương KHÔNG xanh (rc=$RC3): $R3"; fi
    echo "export const la = 1;" > "$FAKE/lib/tiem-file-la.mjs"
    git -C "$FAKE" add -A; git -C "$FAKE" commit -qm "them file la"
    FTIP2="$(git -C "$FAKE" rev-parse HEAD)"
    R4="$(tap_file "$FAKE" "$FBASE" "$FTIP2")"; RC4=$?
    if [ $RC4 -ne 0 ] && printf '%s' "$R4" | grep -qF "tập file mã đổi ≠ {$REL_S4}" && printf '%s' "$R4" | grep -qF "lib/tiem-file-la.mjs"; then ok "chiều đỏ 2: kho giả có file mã lạ trong khoảng → vế tập-file ĐỎ nêu tên file"; else bad "chiều đỏ 2 KHÔNG đỏ đúng cách (rc=$RC4): $R4"; fi

    # ── chiều đỏ 3 (fail-closed): kho KHÔNG có mốc đã neo ──
    NOM="$TMP/kho-khong-moc"; mkdir -p "$NOM"
    git -C "$NOM" init -q 2>/dev/null || { bad "kho không-mốc: init thất bại"; done_chan; }
    git -C "$NOM" config user.email t@t.t; git -C "$NOM" config user.name T
    echo x > "$NOM/a.txt"; git -C "$NOM" add -A; git -C "$NOM" commit -qm a
    R5="$(lane_song "$NOM")"; RC5=$?
    R6="$(tap_file "$NOM" "$MOC_GOP" "$MOC_KY")"; RC6=$?
    if [ $RC5 -ne 0 ] && [ $RC6 -ne 0 ] && printf '%s' "$R5" | grep -qF "mốc đã neo không có trong kho: $MOC_KY" && printf '%s' "$R6" | grep -q "mốc đã neo không có trong kho"; then ok "chiều đỏ 3: kho thiếu mốc → CẢ HAI vế đỏ và gọi tên sha thiếu"; else bad "chiều đỏ 3 KHÔNG đỏ đúng cách (rc=$RC5/$RC6): $R5 | $R6"; fi

    # ── chiều đỏ 1b (phần tử còn lại của lớp AC-2): sửa CHƯA COMMIT ──
    # AC-2 tuyên lớp {đã commit, chưa commit}; chiều đỏ 1 chỉ phủ phần tử đầu, nên
    # một mình nó không phân biệt được `diff MOC_KY -- FILE` với `diff MOC_KY..HEAD -- FILE`.
    CLD="$TMP/clone-dirty"; git clone -q "$KIT" "$CLD" 2>/dev/null || { bad "clone tạm dirty thất bại"; done_chan; }
    printf '\n// dong tiem chua commit\n' >> "$CLD/$REL_WF"
    RD="$(lane_song "$CLD")"; RCD=$?
    if [ $RCD -ne 0 ] && printf '%s' "$RD" | grep -q "lane hội đồng đã đổi"; then ok "chiều đỏ 1b: clone sửa acceptance-verify.js mà CHƯA commit → vế lane ĐỎ (phân biệt so-cây với so-HEAD)"; else bad "chiều đỏ 1b KHÔNG đỏ đúng cách (rc=$RCD): $RD — phép đo đang so HEAD chứ không so cây"; fi

    # ── độc lập HEAD, đo bằng phép quét TĨNH (đối chứng hai chiều) ──
    RQ="$(quet_neo_dong "$HERE/rang.sh")"; RCQ=$?
    if [ $RCQ -eq 0 ]; then ok "độc lập HEAD (quét tĩnh): $RQ"; else bad "độc lập HEAD: $RQ"; fi
    # chiều đỏ của chính phép quét: bản sao răng có một điểm neo động trong thân hàm
    BS="$TMP/rang-neo-dong.sh"; sed 's|git -C "$repo" diff --quiet "$MOC_KY" -- "$REL_WF"|git -C "$repo" diff --quiet "$MOC_KY"..HEAD -- "$REL_WF"|' "$HERE/rang.sh" > "$BS"
    if cmp -s "$HERE/rang.sh" "$BS"; then bad "chiều đỏ 4: mũi tiêm KHÔNG trúng — bản sao giống hệt bản thật"
    else
      RQ2="$(quet_neo_dong "$BS")"; RCQ2=$?
      if [ $RCQ2 -ne 0 ] && printf '%s' "$RQ2" | grep -q "thân lane_song nhắc điểm neo ĐỘNG"; then ok "chiều đỏ 4: bản sao đưa HEAD vào thân lane_song → phép quét ĐỎ nêu đúng tên hàm"; else bad "chiều đỏ 4 KHÔNG đỏ đúng cách (rc=$RCQ2): $RQ2"; fi
    fi
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
