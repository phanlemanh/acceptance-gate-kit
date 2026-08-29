#!/usr/bin/env bash
# Răng hồ sơ nhanh-chinh-khong-ten-main. Mỗi chân dựng fixture CODE-SINH trong
# CHÍNH lần chạy (repo git thật), đường dẫn suy từ vị trí script, và mang theo
# đối chứng dương + chiều đỏ của riêng nó. Cố ý không vào bộ kiểm thường trực:
# các ca này dựng repo git tạm, chậm và không phải lưới hồi quy.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
S4ARGS="$KIT/feature-loop/scripts/s4-args.mjs"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED )"; [ $FAIL -eq 0 ] || exit 1; exit 0; }

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

# Dựng repo fixture: $1 = tên nhánh chính. Trả đường dẫn qua biến REPO.
build_repo() {
  local branch="$1"
  local d="$TMP/repo-$branch-$RANDOM"
  mkdir -p "$d/_acceptance/demo"
  git -C "$d" init -q -b "$branch" 2>/dev/null || { mkdir -p "$d"; git -C "$d" init -q; git -C "$d" checkout -q -b "$branch"; }
  git -C "$d" config user.email t@t.t; git -C "$d" config user.name T
  cat > "$d/_acceptance/config.yaml" <<'YAML'
schema_version: 1
executors:
  test:
    api: "echo api"
feature_loop:
  suite_keys:
    - executors.test.api
YAML
  cat > "$d/_acceptance/demo/contract.md" <<'MD'
---
schema_version: 1
slug: demo
risk_tier: T2
status: implemented
---
MD
  cat > "$d/_acceptance/demo/evals.yaml" <<'YAML'
schema_version: 1
feature_slug: demo
evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.api
    expected: xanh
YAML
  echo base > "$d/f.txt"
  git -C "$d" add -A >/dev/null; git -C "$d" commit -qm base
  # nhánh feature cắt từ nhánh chính → mốc so sánh KHÁC HEAD
  git -C "$d" checkout -q -b feat/x; echo more >> "$d/f.txt"
  git -C "$d" add -A >/dev/null; git -C "$d" commit -qm work
  REPO="$d"
}
# Bản sao để tiêm đột biến phải chụp CÂY ĐANG LÀM VIỆC, không phải HEAD: mã vừa
# sửa chưa commit thì bản dựng từ HEAD thiếu nó và mọi mutant "không tác dụng" —
# đỏ vì HẠ TẦNG chứ không vì vật. Lấy TRỌN thư mục, không liệt file lẻ.
snapshot_tree() {
  local dest="$1"; mkdir -p "$dest"
  # Chép TRỌN cây làm việc trừ rác nặng — không liệt danh sách thư mục tay.
  # Mọi đường hỏng gọi `bad` (tăng bộ đếm): in chữ trần thì hạ-tầng-hỏng cho
  # CÙNG MÀU với đạt — đúng lớp mà S4-r2 bắt được.
  ( cd "$KIT" && tar -cf - --exclude=.git --exclude=node_modules . ) | ( cd "$dest" && tar -xf - ) \
    || { bad "snapshot_tree: chép cây thất bại"; return 1; }
  [ -f "$dest/feature-loop/scripts/s4-args.mjs" ] || { bad "snapshot_tree: bản sao thiếu vật được đo"; return 1; }
  # Đối chứng dương TRÊN CHÍNH BẢN SAO, dùng repo RIÊNG với biến CỤC BỘ: bản cũ
  # gọi build_repo nên ghi đè biến REPO dùng chung và bản tiêm chạy nhầm fixture
  # — chiều đỏ mất lực nhân quả mà vẫn xanh (S4-r2, AC-6).
  local save_repo="${REPO:-}"
  build_repo master
  local check_repo="$REPO"
  REPO="$save_repo"   # trả fixture đang đo về nguyên trạng
  if node "$dest/feature-loop/scripts/s4-args.mjs" --slug demo --root "$check_repo" --ag-root "$dest" --no-carry --out "$TMP/snap-check.json" >"$TMP/snap.txt" 2>&1; then
    ok "bản sao chưa tiêm chạy XANH (đối chứng dương của bản sao)"
  else
    bad "bản sao chưa tiêm đã đỏ — mọi chiều đỏ từ nó vô nghĩa: $(tail -1 "$TMP/snap.txt")"; return 1
  fi
}
run_args() { node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/out.txt" 2>&1; }

CHAN="${2:-}"
[ "${1:-}" = "--chan" ] || { echo "usage: rang.sh --chan <ten>"; exit 2; }

case "$CHAN" in

master-khong-remote)
  # AC-1: bốn tên dự phòng đều phải được thử THẬT — tham số hoá trên danh sách
  # RÚT từ marker MAIN-BRANCH-CANDIDATES của chính script (không gõ literal).
  # bash 3.2 (macOS) không có mapfile — đọc bằng vòng, giữ nguyên nguồn rút
  TENS=()
  while IFS= read -r t; do [ -n "$t" ] && TENS+=("$t"); done < <(
    sed -n '/<<<MAIN-BRANCH-CANDIDATES/,/MAIN-BRANCH-CANDIDATES>>>/p' "$S4ARGS" | grep -o "'[a-z]*'" | tr -d "'")
  [ "${#TENS[@]}" -eq 4 ] && ok "danh sách tên rút từ marker: ${TENS[*]} (4 tên)" \
    || bad "rút danh sách tên thất bại (được ${#TENS[@]}: ${TENS[*]:-rỗng}) — writer/reader trôi khỏi nhau"
  for b in "${TENS[@]}"; do
    build_repo "$b"; rm -f "$TMP/args.json"
    if run_args; then
      MB="$(git -C "$REPO" merge-base "$b" HEAD)"
      HD="$(git -C "$REPO" rev-parse HEAD)"
      GOT="$(node -e "process.stdout.write(require('$TMP/args.json').diffBase)")"
      [ "$GOT" = "$MB" ] && [ "$GOT" != "$HD" ] \
        && ok "nhánh '$b': mốc so sánh BẰNG merge-base độc lập và khác HEAD" \
        || bad "nhánh '$b': mốc lệch (got=$GOT merge-base=$MB head=$HD)"
    else bad "nhánh '$b': s4-args exit ≠ 0 — $(tail -1 "$TMP/out.txt")"; fi
  done
  # Chiều đỏ: cắt danh sách còn MỘT tên trong bản sao trọn cây → ba tên kia phải chết
  MUT="$TMP/mut"; snapshot_tree "$MUT"
  python3 - "$MUT/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
m=s.replace("const MAIN_BRANCH_CANDIDATES = ['main', 'master', 'develop', 'trunk'];","const MAIN_BRANCH_CANDIDATES = ['main'];")
assert m!=s, "mutant khong tac dung"
open(p,'w',encoding='utf-8').write(m)
PYX
  build_repo master; rm -f "$TMP/args.json"
  if node "$MUT/feature-loop/scripts/s4-args.mjs" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/m.txt" 2>&1; then
    bad "chiều đỏ hỏng: cắt danh sách còn 1 tên mà nhánh master vẫn sinh được args"
  else
    NEEDLE1="$(grep -o "không nhận diện được nhánh chính[^\`']*" "$S4ARGS" | head -1 | cut -c1-40)"
    if grep -qF "$NEEDLE1" "$TMP/m.txt" && ! grep -q "usage:" "$TMP/m.txt" && ! grep -q "cờ không nhận diện" "$TMP/m.txt"; then
      ok "chiều đỏ: cắt danh sách → nhánh master rơi đúng câu có hướng dẫn (ghim đủ, loại lỗi dùng sai cờ)"
    else bad "chiều đỏ đỏ nhưng sai thông điệp: $(tail -1 "$TMP/m.txt")"; fi
  fi
  done_chan ;;

nhanh-la-cau-huong-dan)
  # AC-2: tên ngoài danh sách → câu CÓ HƯỚNG DẪN, không phải «lệnh git thất bại»,
  # không phải vết đổ tiến trình. Chuỗi ghim RÚT từ chính script.
  NEEDLE="$(grep -o "không nhận diện được nhánh chính[^']*" "$S4ARGS" | head -1 | cut -c1-40)"
  [ -n "$NEEDLE" ] && ok "rút được câu hướng dẫn từ nguồn" || bad "không rút được câu hướng dẫn từ s4-args.mjs"
  build_repo phat-trien; rm -f "$TMP/args.json"
  if run_args; then bad "nhánh lạ mà vẫn exit 0 — lẽ ra phải đòi --diff-base"; else
    if grep -qF "$NEEDLE" "$TMP/out.txt" && ! grep -q "lệnh git thất bại" "$TMP/out.txt" && ! grep -q "node:internal" "$TMP/out.txt"; then
      ok "nhánh lạ → câu có hướng dẫn, không thông điệp sai, không vết đổ"
    else bad "thông điệp sai loại: $(tail -2 "$TMP/out.txt" | tr '\n' ' ')"; fi
  fi
  # đối chứng dương: cùng fixture đổi tên nhánh về master → xanh
  git -C "$REPO" branch -m phat-trien master
  rm -f "$TMP/args.json"
  run_args && ok "đối chứng dương: đổi tên về master → sinh args" || bad "đối chứng dương hỏng: $(tail -1 "$TMP/out.txt")"
  done_chan ;;

remote-tra-loi)
  # AC-6: đường REMOTE trả lời được — đường phổ biến nhất ở consumer thật, và là
  # đường duy nhất trước đây không phép đo nào chạm.
  build_repo master
  BARE="$TMP/bare.git"; git init -q --bare -b phat-trien "$BARE"
  git -C "$REPO" branch -f phat-trien master
  git -C "$REPO" remote add origin "$BARE"
  git -C "$REPO" push -q origin phat-trien master feat/x
  git -C "$REPO" remote set-head origin phat-trien
  rm -f "$TMP/args.json"
  if run_args; then
    MB="$(git -C "$REPO" merge-base phat-trien HEAD)"
    GOT="$(node -e "process.stdout.write(require('$TMP/args.json').diffBase)")"
    [ "$GOT" = "$MB" ] && ok "remote khai nhánh NGOÀI 4 tên quen → vẫn giải đúng mốc" \
      || bad "mốc lệch khi giải qua remote (got=$GOT want=$MB)"
  else bad "remote trả lời mà s4-args vẫn hỏng: $(tail -1 "$TMP/out.txt")"; fi
  # phân biệt NGUỒN: fixture này phải là 'remote', fixture không remote là 'fallback'
  # Đo ĐẦU RA của vật được giao (args.json), KHÔNG đo lại fixture: đo fixture thì
  # assert xanh y hệt dù trường nguồn có tồn tại hay không.
  SRC_R="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).source||'VANG')" 2>/dev/null || echo VANG)"
  BR_R="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).branch||'VANG')" 2>/dev/null || echo VANG)"
  [ "$SRC_R" = "remote" ] && ok "đầu ra khai nguồn = remote (phân biệt được hai đường)" \
    || bad "đầu ra không khai nguồn remote (được: $SRC_R) — vế AC-6 không có vật"
  case "$BR_R" in *phat-trien) ok "đầu ra khai đúng nhánh ngoài bốn tên quen: $BR_R" ;; *) bad "đầu ra khai nhánh sai: $BR_R" ;; esac
  # chiều đỏ: phá bước bóc kết quả remote trong bản sao trọn cây → phải rơi về
  # fallback và KHÔNG giải được (nhánh chính không thuộc 4 tên quen)
  MUT2="$TMP/mut2"; snapshot_tree "$MUT2"
  python3 - "$MUT2/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
m=s.replace("const out = gitTry('remote', 'show', 'origin');","const out = null;")
assert m!=s, "mutant khong tac dung"
open(p,'w',encoding='utf-8').write(m)
PYX
  git -C "$REPO" branch -D master >/dev/null 2>&1
  rm -f "$TMP/args.json"
  if node "$MUT2/feature-loop/scripts/s4-args.mjs" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/m2.txt" 2>&1; then
    bad "chiều đỏ hỏng: phá bước đọc remote mà vẫn giải được nhánh chính"
  else
    # GHIM THÔNG ĐIỆP: kết luận từ mã thoát trần thì bản tiêm chưa từng dựng
    # (tar hỏng, tiêm nổ, exit 3 usage) cũng thành xanh — «assertion âm tính một
    # mình». Chuỗi ghim rút từ chính nguồn.
    grep -qF "$(grep -o "không nhận diện được nhánh chính[^\`']*" "$S4ARGS" | head -1 | cut -c1-40)" "$TMP/m2.txt" \
      && ok "chiều đỏ: phá bước đọc remote → rơi đúng câu đòi --diff-base (ghim thông điệp)" \
      || bad "chiều đỏ đỏ nhưng SAI lý do: $(tail -2 "$TMP/m2.txt" | tr '\n' ' ')"
  fi
  done_chan ;;

doc-bat-buoc-van-dong)
  # AC-3: cửa fail-closed KHÔNG bị nới trong lúc sửa phép dò.
  build_repo master; rm -f "$TMP/args.json"
  node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --diff-base khong-ton-tai-ref --out "$TMP/args.json" >"$TMP/o.txt" 2>&1
  RC=$?
  [ $RC -eq 2 ] && grep -q "lệnh git thất bại" "$TMP/o.txt" && [ ! -f "$TMP/args.json" ] \
    && ok "ref hỏng → exit 2, nêu tên phần hỏng, không sinh tệp" \
    || bad "cửa đọc bị nới: rc=$RC msg=$(tail -1 "$TMP/o.txt")"
  rm -f "$TMP/args.json"
  node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --diff-base master --out "$TMP/args.json" >/dev/null 2>&1 \
    && [ -f "$TMP/args.json" ] && ok "đối chứng dương: --diff-base master → sinh tệp" || bad "đối chứng dương hỏng"
  done_chan ;;



ci-single-branch)
  # AC-7 (S4-r1): hình dạng repo của CI — clone single-branch/shallow. Remote VẪN
  # khai «HEAD branch: <tên>» nhưng ref cục bộ của tên đó KHÔNG tồn tại; đưa
  # thẳng vào phép đọc bắt buộc là chết với đúng thông điệp AC-2 gọi là sai loại.
  build_repo master
  BARE2="$TMP/bare2.git"; git init -q --bare -b master "$BARE2"
  git -C "$REPO" remote add origin "$BARE2"
  git -C "$REPO" push -q origin master feat/x
  CI="$TMP/ci-clone"
  git clone -q --single-branch --branch feat/x "$BARE2" "$CI"
  cp -R "$REPO/_acceptance" "$CI/_acceptance"
  # ref cục bộ 'master' phải THỰC SỰ vắng thì ca mới có nghĩa
  git -C "$CI" rev-parse --verify --quiet master >/dev/null 2>&1 \
    && bad "fixture sai: clone single-branch vẫn có ref master cục bộ" \
    || ok "fixture đúng hình dạng CI: ref 'master' cục bộ VẮNG, remote vẫn khai nó"
  # Ô 1 — clone single-branch: KHÔNG ref nào của nhánh chính (cả local lẫn
  # origin/*). Hành vi ĐÚNG là câu có hướng dẫn, KHÔNG phải «lệnh git thất bại».
  rm -f "$TMP/args.json"
  if node "$S4ARGS" --slug demo --root "$CI" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/ci.txt" 2>&1; then
    bad "ô 1: không ref nhánh chính nào mà vẫn sinh args — đoán bừa mốc so sánh"
  else
    # Sau S4-r4, remote CÓ khai tên nên câu đúng là câu «remote khai … không giải
    # được … --diff-base» (nêu đích danh tên remote khai — tốt hơn câu chung).
    # Cả hai câu đều rút từ nguồn; điều cấm vẫn là thông điệp SAI LOẠI.
    N_REMOTE="$(grep -o "remote khai nhánh chính[^\`\$]*" "$S4ARGS" | head -1 | cut -c1-28)"
    N_CHUNG="$(grep -o "không nhận diện được nhánh chính[^\`']*" "$S4ARGS" | head -1 | cut -c1-40)"
    if { grep -qF "$N_REMOTE" "$TMP/ci.txt" || grep -qF "$N_CHUNG" "$TMP/ci.txt"; } \
       && grep -q -- "--diff-base" "$TMP/ci.txt" \
       && ! grep -q "lệnh git thất bại" "$TMP/ci.txt" && ! grep -q "node:internal" "$TMP/ci.txt"; then
      ok "ô 1 (single-branch, không ref nhánh chính): câu có hướng dẫn + chỉ lối --diff-base, KHÔNG thông điệp sai loại"
    else bad "ô 1: sai loại thông điệp — $(grep -m1 . "$TMP/ci.txt")"; fi
  fi
  # Ô 2 — hình dạng CI phổ biến hơn: ref local vắng nhưng `origin/<tên>` CÓ.
  CI2="$TMP/ci-clone2"; git clone -q "$BARE2" "$CI2"
  cp -R "$REPO/_acceptance" "$CI2/_acceptance"
  git -C "$CI2" checkout -q feat/x
  git -C "$CI2" branch -D master >/dev/null 2>&1
  git -C "$CI2" rev-parse --verify --quiet master >/dev/null 2>&1 && bad "ô 2: ref local master lẽ ra phải vắng" \
    || ok "ô 2 đúng hình dạng: ref local 'master' vắng, 'origin/master' còn"
  rm -f "$TMP/args.json"
  if node "$S4ARGS" --slug demo --root "$CI2" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/ci2.txt" 2>&1; then
    MB="$(git -C "$CI2" merge-base origin/master HEAD)"
    GOT="$(node -e "process.stdout.write(require('$TMP/args.json').diffBase)")"
    SRC="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).source||'VANG')")"
    [ "$GOT" = "$MB" ] && ok "ô 2: giải qua origin/<tên>, mốc BẰNG merge-base độc lập" || bad "ô 2 mốc lệch (got=$GOT want=$MB)"
    [ "$SRC" = "remote" ] && ok "ô 2: đầu ra khai nguồn = remote" || bad "ô 2 nguồn khai sai: $SRC"
  else bad "ô 2 vẫn chết dù có origin/master: $(grep -m1 . "$TMP/ci2.txt")"; fi
  # chiều đỏ: bỏ bước kiểm-tồn-tại trong bản sao → phải chết ĐÚNG thông điệp cũ
  MUT5="$TMP/mut5"; snapshot_tree "$MUT5" || done_chan
  python3 - "$MUT5/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
old="""    for (const cand of [m[1], `origin/${m[1]}`]) {
      if (gitTry('rev-parse', '--verify', '--quiet', cand) !== null) { mainBranch = cand; mainBranchSource = 'remote'; break; }
    }"""
new="""    mainBranch = m[1]; mainBranchSource = 'remote';"""
assert old in s, "mutant khong tac dung"
open(p,'w',encoding='utf-8').write(s.replace(old,new))
PYX
  rm -f "$TMP/args.json"
  if node "$MUT5/feature-loop/scripts/s4-args.mjs" --slug demo --root "$CI2" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/m5.txt" 2>&1; then
    bad "chiều đỏ hỏng: bỏ bước kiểm-tồn-tại mà clone single-branch vẫn chạy được"
  else
    grep -q "lệnh git thất bại" "$TMP/m5.txt" \
      && ok "chiều đỏ: bỏ kiểm-tồn-tại → chết đúng thông điệp sai-loại mà AC-2 cấm" \
      || bad "chiều đỏ đỏ nhưng sai lý do: $(grep -m1 . "$TMP/m5.txt")"
  fi
  done_chan ;;

khong-doan-sang-ten-khac)
  # AC-8 (S4-r4): hồi quy do chính vòng này đẻ ra. Remote KHAI một tên mà cây
  # không giải được ⇒ KHÔNG được lặng lẽ nhận tên khác. Bản trước S4-r1 chết to;
  # bản r1/r2 trả lời sai êm ru — đây là ca giữ cho nó không quay lại.
  build_repo master
  BARE3="$TMP/bare3.git"; git init -q --bare -b main "$BARE3"
  git -C "$REPO" branch -f main master
  git -C "$REPO" remote add origin "$BARE3"
  git -C "$REPO" push -q origin main master feat/x
  git -C "$REPO" remote set-head origin main
  # remote vẫn khai 'main', nhưng cả ref local lẫn origin/main đều bị xoá —
  # 'master' còn sống, đúng cái bẫy để máy nhận bừa
  git -C "$REPO" branch -D main -q
  git -C "$REPO" update-ref -d refs/remotes/origin/main
  git -C "$REPO" remote show origin 2>/dev/null | grep -q "HEAD branch: main" \
    && ok "fixture đúng bẫy: remote khai «main», ref main vắng, «master» còn sống" \
    || bad "fixture không dựng được bẫy"
  rm -f "$TMP/args.json"
  if node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/kd.txt" 2>&1; then
    SRC="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).source||'VANG')" 2>/dev/null || echo VANG)"
    BR="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).branch||'VANG')" 2>/dev/null || echo VANG)"
    bad "ĐOÁN BỪA: sinh args với nhánh «$BR» (nguồn $SRC) trong khi remote khai «main» — mốc so sánh sai lặng lẽ"
  else
    if grep -q "remote khai nhánh chính" "$TMP/kd.txt" && grep -q "main" "$TMP/kd.txt" \
       && grep -q -- "--diff-base" "$TMP/kd.txt" && ! grep -q "usage:" "$TMP/kd.txt"; then
      ok "KHÔNG đoán sang tên khác: nêu đúng tên remote khai + chỉ lối --diff-base"
    else bad "đỏ nhưng sai thông điệp: $(grep -m1 . "$TMP/kd.txt")"; fi
    [ ! -f "$TMP/args.json" ] && ok "không sinh tệp args (fail-closed)" || bad "vẫn sinh tệp args dù không giải được nhánh"
  fi
  # đối chứng dương CÙNG fixture: trả ref main về → giải được, sinh args
  git -C "$REPO" branch main master
  rm -f "$TMP/args.json"
  if node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/kd2.txt" 2>&1; then
    SRC2="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).source||'VANG')")"
    [ "$SRC2" = "remote" ] && ok "đối chứng dương: trả ref main về → giải bằng remote, sinh args" \
      || bad "đối chứng dương: nguồn sai ($SRC2)"
  else bad "đối chứng dương hỏng: $(grep -m1 . "$TMP/kd2.txt")"; fi
  # chiều đỏ: bản sao cho vòng dò chạy VÔ ĐIỀU KIỆN (bản r1/r2) → phải đoán bừa
  MUT6="$TMP/mut6"; snapshot_tree "$MUT6" || done_chan
  python3 - "$MUT6/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
old="if (!mainBranch && !remoteDeclared) {"
assert old in s, "mutant khong tac dung"
open(p,'w',encoding='utf-8').write(s.replace(old,"if (!mainBranch) {"))
PYX
  git -C "$REPO" branch -D main -q
  rm -f "$TMP/args.json"
  if node "$MUT6/feature-loop/scripts/s4-args.mjs" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/m6.txt" 2>&1; then
    BRM="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).branch||'VANG')")"
    [ "$BRM" = "master" ] && ok "chiều đỏ: bản cho vòng dò chạy vô điều kiện ĐOÁN BỪA sang «master» (ca phân biệt được)" \
      || bad "chiều đỏ: bản tiêm ra nhánh lạ «$BRM»"
  else bad "chiều đỏ: bản tiêm cũng đỏ — ca không phân biệt được hai bản"; fi
  done_chan ;;

remote-hoi-khong-duoc)
  # AC-9 (S4-r5): cùng lớp mốc-sai-lặng-lẽ với AC-8, vào bằng cửa MẠNG.
  build_repo phat-trien
  git -C "$REPO" branch master HEAD~1        # tên quen còn sống làm mồi
  git -C "$REPO" remote add origin "https://192.0.2.1/nope.git"
  rm -f "$TMP/args.json"
  if node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/rk.txt" 2>&1; then
    BR="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).branch||'VANG')" 2>/dev/null || echo VANG)"
    bad "ĐOÁN BỪA khi remote không hỏi được: nhận «$BR», mốc so sánh sai lặng lẽ"
  else
    N9="$(grep -o "KHÔNG hỏi được nó[^\`\$]*" "$S4ARGS" | head -1 | cut -c1-20)"
    if grep -qF "$N9" "$TMP/rk.txt" && grep -q -- "--diff-base" "$TMP/rk.txt" && ! grep -q "giải bằng fallback" "$TMP/rk.txt"; then
      ok "có origin mà hỏi không được → kêu to đúng loại, KHÔNG rơi về đoán tên quen"
    else bad "đỏ nhưng sai thông điệp: $(grep -m1 . "$TMP/rk.txt")"; fi
    [ ! -f "$TMP/args.json" ] && ok "không sinh tệp args (fail-closed)" || bad "vẫn sinh tệp args"
  fi
  # đối chứng dương CÙNG fixture: gỡ remote → dò tên quen chạy lại bình thường
  git -C "$REPO" remote remove origin
  rm -f "$TMP/args.json"
  if node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/rk2.txt" 2>&1; then
    SRC="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).source||'VANG')")"
    [ "$SRC" = "fallback" ] && ok "đối chứng dương: gỡ remote → dò tên quen, nguồn = fallback" || bad "đối chứng dương: nguồn sai ($SRC)"
  else bad "đối chứng dương hỏng: $(grep -m1 . "$TMP/rk2.txt")"; fi
  # chiều đỏ: bản sao bỏ bước phân biệt «có origin» → phải đoán bừa (bản trước r5)
  MUT7="$TMP/mut7"; snapshot_tree "$MUT7" || done_chan
  python3 - "$MUT7/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys, re
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
a=s.index("  if (originUrl && out === null) {")
b=s.index("  const m = out && out.match", a)
assert a < b, "mutant khong tac dung"
open(p,'w',encoding='utf-8').write(s[:a]+s[b:])
PYX
  git -C "$REPO" remote add origin "https://192.0.2.1/nope.git"
  rm -f "$TMP/args.json"
  if node "$MUT7/feature-loop/scripts/s4-args.mjs" --slug demo --root "$REPO" --ag-root "$KIT" --no-carry --out "$TMP/args.json" >"$TMP/m7.txt" 2>&1; then
    BRM="$(node -e "const a=require('$TMP/args.json'); process.stdout.write(((a.mainBranchInfo)||{}).branch||'VANG')")"
    [ "$BRM" = "master" ] && ok "chiều đỏ: bản bỏ bước phân biệt ĐOÁN BỪA sang «master» (ca phân biệt được)" \
      || bad "chiều đỏ: bản tiêm ra nhánh lạ «$BRM»"
  else bad "chiều đỏ: bản tiêm cũng đỏ — ca không phân biệt được hai bản"; fi
  done_chan ;;

*)
  echo "rang.sh --chan <master-khong-remote|nhanh-la-cau-huong-dan|remote-tra-loi|doc-bat-buoc-van-dong|ci-single-branch|khong-doan-sang-ten-khac|remote-hoi-khong-duoc>"; exit 2 ;;
esac
