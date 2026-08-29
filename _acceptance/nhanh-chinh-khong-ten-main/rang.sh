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
  tar -C "$KIT" -cf - feature-loop lib skills 2>/dev/null | tar -x -C "$dest"
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
    grep -q "diff-base" "$TMP/m.txt" && ok "chiều đỏ: cắt danh sách → nhánh master rơi đúng câu có hướng dẫn" \
      || bad "chiều đỏ đỏ nhưng sai thông điệp: $(tail -1 "$TMP/m.txt")"
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
  SRC_R="$(node -e "
const {execFileSync}=require('child_process');
const s=execFileSync('node',['-e','1'],{encoding:'utf8'});" 2>/dev/null; \
    node --input-type=module -e "
import {execFileSync} from 'node:child_process';
const out=execFileSync('git',['-C','$REPO','remote','show','origin'],{encoding:'utf8'});
process.stdout.write(/HEAD branch:\s*(\S+)/.exec(out)[1]);")"
  [ "$SRC_R" = "phat-trien" ] && ok "nguồn remote thật sự khai tên ngoài danh sách (phat-trien)" \
    || bad "fixture remote không khai đúng tên: $SRC_R"
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
  else ok "chiều đỏ: phá bước đọc remote → mất đường remote, đòi --diff-base"; fi
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

hai-vai-hai-ham)
  # AC-4: neo vào MARKER vùng dò, không vào hình dạng mã quanh nó.
  REG="$(sed -n '/<<<PROBE-REGION/,/PROBE-REGION>>>/p' "$S4ARGS")"
  [ -n "$REG" ] && ok "tìm được vùng dò theo marker PROBE-REGION" || { bad "KHÔNG tìm thấy marker vùng dò — đỏ, không xanh rỗng"; done_chan; }
  N="$(echo "$REG" | grep -c "gitTry(")"
  [ "$N" -ge 2 ] && ok "vùng dò có $N lời gọi, tất cả qua hàm dò" || bad "vùng dò chỉ có $N lời gọi hàm dò (cần ≥2)"
  echo "$REG" | grep -qE "(^|[^a-zA-Z])git\(" && bad "vùng dò còn gọi cửa fail-closed — hình dạng mã chết quay lại" \
    || ok "vùng dò KHÔNG còn lời gọi cửa fail-closed"
  # chiều đỏ 1: gỡ marker → phải đỏ vì không tìm thấy vùng
  MUT3="$TMP/mut3"; snapshot_tree "$MUT3"
  sed -i.bak 's/<<<PROBE-REGION/vung-do-cu/' "$MUT3/feature-loop/scripts/s4-args.mjs"
  R2="$(sed -n '/<<<PROBE-REGION/,/PROBE-REGION>>>/p' "$MUT3/feature-loop/scripts/s4-args.mjs")"
  [ -z "$R2" ] && ok "chiều đỏ: gỡ marker → bộ dò vùng trả rỗng (ca sẽ đỏ, không xanh rỗng)" || bad "gỡ marker mà vẫn tìm được vùng"
  # chiều đỏ 2: khôi phục lời gọi cũ trong vùng → phải bắt được
  MUT4="$TMP/mut4"; snapshot_tree "$MUT4"
  python3 - "$MUT4/feature-loop/scripts/s4-args.mjs" <<'PYX'
import sys
p=sys.argv[1]; s=open(p,encoding='utf-8').read()
m=s.replace("if (gitTry('rev-parse', '--verify', '--quiet', b) !== null)","if (git('rev-parse', '--verify', '--quiet', b) !== null)")
assert m!=s
open(p,'w',encoding='utf-8').write(m)
PYX
  R3="$(sed -n '/<<<PROBE-REGION/,/PROBE-REGION>>>/p' "$MUT4/feature-loop/scripts/s4-args.mjs")"
  echo "$R3" | grep -qE "(^|[^a-zA-Z])git\(" && ok "chiều đỏ: khôi phục lời gọi cũ → phép đo bắt được" \
    || bad "khôi phục lời gọi cũ mà phép đo không bắt được"
  done_chan ;;

remote-co-tran)
  # AC-5: đo QUAN HỆ THỜI GIAN thật, không grep hình dạng tham số.
  TRAN="$(grep -o 'REMOTE_TIMEOUT_MS = [0-9_]*' "$S4ARGS" | head -1 | grep -o '[0-9][0-9_]*' | tr -d '_')"
  [ -n "$TRAN" ] && [ "$TRAN" -gt 0 ] && ok "trần thời gian khai trong nguồn: ${TRAN}ms" || bad "không rút được trần thời gian dương"
  build_repo master
  # remote TREO thật: IP không định tuyến (RFC5737 TEST-NET-1), giao thức git
  git -C "$REPO" remote add origin "git://192.0.2.1/khong-ton-tai.git"
  rm -f "$TMP/args.json"
  T0=$(date +%s)
  run_args; RC=$?
  T1=$(date +%s); DT=$((T1-T0))
  BIEN=$(( TRAN/1000 + 20 ))
  [ $DT -lt $BIEN ] && ok "remote treo: bước chuẩn bị args về sau ${DT}s (< ${BIEN}s) — không treo theo" \
    || bad "treo theo remote: ${DT}s ≥ ${BIEN}s"
  [ $RC -eq 0 ] && ok "remote treo → rơi đúng đường dò tên quen, vẫn sinh args" \
    || bad "remote treo làm hỏng lượt sinh args: $(tail -1 "$TMP/out.txt")"
  done_chan ;;

*)
  echo "rang.sh --chan <master-khong-remote|nhanh-la-cau-huong-dan|remote-tra-loi|doc-bat-buoc-van-dong|hai-vai-hai-ham|remote-co-tran>"; exit 2 ;;
esac
