#!/usr/bin/env bash
# Răng hồ sơ duong-lui-phai-song — mỗi chân dựng fixture CODE-SINH (fixture.mjs:
# kho git tạm có lib/scripts vendored, một hồ sơ, hai commit), có đối chứng dương
# và chiều đỏ ghim thông điệp. Chiều đỏ của PHÉP ĐO: bản sao trọn `scripts lib`
# của kit bị tiêm một phép thay thế nguyên văn (mũi tiêm phải trúng đúng 1 lần,
# mutant phải chạy được), rồi fixture dựng lại với vendorFrom=bản sao.
# Đường dẫn suy từ vị trí script; không hardcode ROOT.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED ) (${PASS} pass, ${FAIL} do)"; [ $FAIL -eq 0 ] || exit 1; exit 0; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

CHAN=""
while [ $# -gt 0 ]; do case "$1" in --chan) CHAN="$2"; shift 2;; *) echo "rang.sh: tham số lạ $1"; exit 3;; esac; done
[ -n "$CHAN" ] || { echo "rang.sh: thiếu --chan"; exit 3; }

# mk_repo '<json opts>' → FX_ROOT, FX_A, FX_B
mk_repo() {
  local out; out="$(node "$HERE/fixture.mjs" "$1")" || { echo "rang.sh: fixture.mjs lỗi với $1"; exit 3; }
  FX_ROOT="$(printf '%s\n' "$out" | sed -n 1p)"; FX_A="$(printf '%s\n' "$out" | sed -n 2p)"; FX_B="$(printf '%s\n' "$out" | sed -n 3p)"
}
# pmc <root> [args…] → OUT (stdout+stderr), RC; VIOL = số dòng VIOLATION
pmc() { local root="$1"; shift; OUT="$(bash "$root/scripts/pre-merge-check.sh" "$root" "$@" 2>&1)"; RC=$?; VIOL="$(printf '%s\n' "$OUT" | grep -c '^VIOLATION' || true)"; }
# copy_tree [sha] → COPY: bản sao TRỌN scripts + lib (+ commands, skills, feature-loop, tests khi cần)
copy_tree() {
  local d="$TMP/copy-$RANDOM"; mkdir -p "$d"
  if [ -n "${1:-}" ]; then git -C "$KIT" archive "$1" scripts lib | tar -x -C "$d"
  else rsync -a --exclude .git --exclude node_modules --exclude .claude --exclude _acceptance --exclude docs "$KIT/" "$d/"; fi
  COPY="$d"
}
# inject <tên> <file tương đối trong COPY> <trước> <sau> — thay nguyên văn đúng 1 lần; mutant phải chạy được
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
  if [ "$COUNT" != "1" ]; then bad "đột biến $name: mẫu nguyên văn khớp $COUNT lần (cần đúng 1) — mũi tiêm KHÔNG trúng"; return 1; fi
  if cmp -s "$KIT/$rel" "$f"; then bad "đột biến $name: bản sao BẰNG bản thật sau khi tiêm"; return 1; fi
  case "$rel" in
    *.sh) bash -n "$f" 2>/dev/null || { bad "đột biến $name: mutant lỗi cú pháp bash"; return 1; } ;;
    *.cjs|*.mjs|*.js) node --check "$f" 2>/dev/null || { bad "đột biến $name: mutant lỗi cú pháp node"; return 1; } ;;
  esac
  ok "đột biến $name: mũi tiêm trúng, mutant chạy được"
}
has() { printf '%s\n' "$1" | grep -qF -- "$2"; }

case "$CHAN" in
  fixture-song)
    # Đối chứng dương của KHUÔN: fixture nguyên vẹn đi làn V xanh-sạch qua lưới; phá một
    # mục → lưới đòi chữ ký. Mọi chân sau dựa vào hai chiều này.
    mk_repo '{}'
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "NOTE [fx]: xanh-sạch" && [ "$VIOL" = 0 ]; then ok "fixture nguyên vẹn: xanh-sạch, 0 VIOLATION"; else bad "fixture nguyên vẹn không xanh-sạch (rc=$RC): $(printf '%s\n' "$OUT" | grep -E 'VIOLATION|NOTE \[fx\]' | head -3)"; fi
    mk_repo '{"sections":"## Known limits\n- có nội dung thật\n\n## Ngoài hợp đồng\n"}'
    pmc "$FX_ROOT" --base "$FX_A"
    # Làn V (approved_by rỗng) không sạch → lưới đòi chữ ký ngay ở chốt Cổng 1, gọi tên mục bẩn.
    if has "$OUT" "VIOLATION [fx]: status=verified but approved_by is empty — làn V đòi xanh-sạch hoặc chữ ký (mục «Known limits» có nội dung)"; then ok "fixture bẩn một mục: lưới đòi chữ ký, gọi tên mục"; else bad "fixture bẩn mà lưới không đòi chữ ký: $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -2)"; fi
    ;;
  ky-lan-clause)
    # E10: khối SIGNOFF-LANE-CLAUSE ở nguồn và bản chép bằng nhau từng ký tự; mutant đổi 1 ký tự ở bản chép → đỏ gọi tên bản.
    clause_of() { sed -n '/<<<SIGNOFF-LANE-CLAUSE/,/SIGNOFF-LANE-CLAUSE>>>/p' "$1"; }
    SRC="$(clause_of "$KIT/commands/signoff.md")"; CPY="$(clause_of "$KIT/skills/acceptance/SKILL.md")"
    [ -n "$SRC" ] || bad "commands/signoff.md thiếu khối SIGNOFF-LANE-CLAUSE"
    [ -n "$CPY" ] || bad "skills/acceptance/SKILL.md thiếu khối SIGNOFF-LANE-CLAUSE"
    if [ -n "$SRC" ] && [ "$SRC" = "$CPY" ]; then ok "hai bản chép SIGNOFF-LANE-CLAUSE bằng nhau từng ký tự ($(printf '%s\n' "$SRC" | wc -l | tr -d ' ') dòng)"; elif [ -n "$SRC" ]; then bad "lech ban chep: skills/acceptance/SKILL.md"; fi
    # chiều đỏ: bản sao SKILL đổi «--allow-dirty» → «--allow-dirtyX» trong khối, so lại phải lệch
    cp "$KIT/skills/acceptance/SKILL.md" "$TMP/skill-mut.md"; python3 - "$TMP/skill-mut.md" <<'PY'
import sys,re
p=sys.argv[1]; s=open(p,encoding='utf8').read()
a=s.index('<<<SIGNOFF-LANE-CLAUSE'); b=s.index('SIGNOFF-LANE-CLAUSE>>>')
blk=s[a:b]; assert blk.count('--allow-dirty')>=1
open(p,'w',encoding='utf8').write(s[:a]+blk.replace('--allow-dirty','--allow-dirtyX',1)+s[b:])
PY
    MUT="$(clause_of "$TMP/skill-mut.md")"
    if [ "$SRC" != "$MUT" ]; then ok "chiều đỏ: bản chép lệch 1 ký tự → phép so đỏ gọi tên bản (lech ban chep: skills/acceptance/SKILL.md)"; else bad "chiều đỏ KHÔNG chạy: mutant bản chép vẫn bằng nguồn"; fi
    ;;
  ky-lan-song|ky-stale)
    # E4/E5: RÚT dòng lệnh làn từ khối clause (writer→reader), thay placeholder, chạy trên kho git tạm.
    CL="$(sed -n '/<<<SIGNOFF-LANE-CLAUSE/,/SIGNOFF-LANE-CLAUSE>>>/p' "$KIT/commands/signoff.md")"
    L7B="$(printf '%s\n' "$CL" | grep -E '^ *node .*repin-lane\.mjs' | grep -v -- '--write' | head -1 | sed 's/^ *//')"
    L8B="$(printf '%s\n' "$CL" | grep -E '^ *node .*repin-lane\.mjs' | grep -- '--write' | head -1 | sed 's/^ *//')"
    if [ -n "$L7B" ] && has "$L7B" '--allow-dirty' && ! has "$L7B" '--write'; then ok "dòng 7b rút từ khối: có --allow-dirty, không --write"; else bad "lenh trong clause lech: dòng 7b «$L7B»"; fi
    if [ -n "$L8B" ] && has "$L8B" '--write'; then ok "dòng 8b rút từ khối: có --write"; else bad "lenh trong clause lech: dòng 8b «$L8B»"; fi
    # chiều đỏ của phép rút: khối bản sao thêm --write vào dòng 7b → bước rút phải đỏ
    MCL="$(printf '%s\n' "$CL" | python3 -c 'import sys; s=sys.stdin.read(); print(s.replace("--allow-dirty\n","--allow-dirty --write\n",1), end="")')"
    ML7B="$(printf '%s\n' "$MCL" | grep -E '^ *node .*repin-lane\.mjs' | grep -v -- '--write' | head -1)"
    if [ -z "$ML7B" ]; then ok "chiều đỏ: khối bị đổi cờ (7b mang --write) → không rút được dòng 7b hợp lệ (lenh trong clause lech)"; else bad "chiều đỏ KHÔNG chạy: khối đổi cờ mà vẫn rút được 7b"; fi
    subst() { printf '%s' "$1" | sed "s#<feature-loop>#$KIT/feature-loop#g; s#<slug>#fx#g"; }
    RUN7B="$(subst "$L7B") --ag-root $KIT"; RUN8B="$(subst "$L8B") --ag-root $KIT"
    if [ "$CHAN" = ky-lan-song ]; then
      # đối chứng dương: eval xanh → làn xanh → commit chữ ký có mặt
      mk_repo '{"contract":{"status":"verified"}}'
      sed -i '' 's/^human_signoff:.*/human_signoff: t 2026-09-08/' "$FX_ROOT/_acceptance/fx/evidence-report.md"
      (cd "$FX_ROOT" && eval "$RUN7B") > "$TMP/lane1.out" 2>&1; rc=$?
      if [ $rc -eq 0 ] && ! grep -q '"kind":"repin"' "$FX_ROOT/_acceptance/fx/run-log.jsonl"; then ok "7b làn xanh, KHÔNG ghi pin (chỉ đo)"; else bad "7b: rc=$rc hoặc đã ghi pin — $(tail -3 "$TMP/lane1.out" | tr '\n' ' ')"; fi
      if [ $rc -eq 0 ]; then (cd "$FX_ROOT" && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -q -m "Gate 2 signoff: fx — t"); fi
      if [ "$(git -C "$FX_ROOT" log --oneline | grep -c 'Gate 2 signoff')" = 1 ]; then ok "7c: commit chữ ký có mặt sau làn xanh"; else bad "7c: không có commit chữ ký"; fi
      # chiều đỏ: eval đỏ → làn đỏ → KHÔNG commit
      mk_repo '{"contract":{"status":"verified"},"verifyExit":1}'
      sed -i '' 's/^human_signoff:.*/human_signoff: t 2026-09-08/' "$FX_ROOT/_acceptance/fx/evidence-report.md"
      (cd "$FX_ROOT" && eval "$RUN7B") > "$TMP/lane2.out" 2>&1; rc=$?
      if [ $rc -ne 0 ] && grep -q 'LÀN ĐỎ' "$TMP/lane2.out"; then ok "7b làn đỏ: exit $rc, in «LÀN ĐỎ» nguyên văn"; else bad "7b làn đỏ mà rc=$rc / không in LÀN ĐỎ"; fi
      if [ $rc -eq 0 ]; then (cd "$FX_ROOT" && git add -A && git commit -q -m "Gate 2 signoff: fx — t"); fi
      if [ "$(git -C "$FX_ROOT" log --oneline | grep -c 'Gate 2 signoff')" = 0 ]; then ok "làn đỏ → KHÔNG có commit chữ ký (git log không đổi)"; else bad "làn đỏ mà vẫn có commit chữ ký"; fi
    else
      # E5: commit chữ ký chạm file ngoài T1 → stale → ghim lại bằng dòng 8b → lưới sạch → READY
      mk_repo '{"contract":{"status":"verified"},"repinLine":true}'
      sed -i '' 's/^human_signoff:.*/human_signoff: t 2026-09-08/' "$FX_ROOT/_acceptance/fx/evidence-report.md"
      echo v2 > "$FX_ROOT/src.txt"
      (cd "$FX_ROOT" && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -q -m "Gate 2 signoff: fx — t")
      pmc "$FX_ROOT" --base "$FX_A"
      if has "$OUT" "VIOLATION [fx]: evidence is stale"; then ok "sau commit chữ ký chạm file ngoài T1: lưới báo stale"; else bad "lưới không báo stale sau commit chữ ký: $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -2)"; fi
      (cd "$FX_ROOT" && eval "$RUN8B") > "$TMP/lane3.out" 2>&1; rc=$?
      SIG="$(git -C "$FX_ROOT" rev-parse HEAD)"
      if [ $rc -eq 0 ] && grep -q "\"kind\":\"repin\".*\"sha\":\"$SIG\".*evals_exit" "$FX_ROOT/_acceptance/fx/run-log.jsonl" && grep -q "^verified_commit: $SIG" "$FX_ROOT/_acceptance/fx/evidence-report.md"; then ok "8b: làn --write ghim vào commit chữ ký, dòng repin có evals_exit"; else bad "8b: rc=$rc — $(tail -3 "$TMP/lane3.out" | tr '\n' ' ')"; fi
      (cd "$FX_ROOT" && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -q -m "repin(fx): ghim lại sau chữ ký")
      pmc "$FX_ROOT" --base "$FX_A"
      if [ "$VIOL" = 0 ]; then ok "lưới lại sau ghim: 0 VIOLATION → READY"; else bad "lưới lại vẫn đỏ: $(printf '%s\n' "$OUT" | grep '^VIOLATION' | head -2)"; fi
      # chiều đỏ: bỏ bước ghim lại → lưới vẫn stale, không READY
      mk_repo '{"contract":{"status":"verified"},"repinLine":true}'
      sed -i '' 's/^human_signoff:.*/human_signoff: t 2026-09-08/' "$FX_ROOT/_acceptance/fx/evidence-report.md"
      echo v2 > "$FX_ROOT/src.txt"
      (cd "$FX_ROOT" && git -c user.email=t@t -c user.name=t add -A && git -c user.email=t@t -c user.name=t commit -q -m "Gate 2 signoff: fx — t")
      pmc "$FX_ROOT" --base "$FX_A"
      if has "$OUT" "VIOLATION [fx]: evidence is stale" && [ "$VIOL" -ge 1 ]; then ok "chiều đỏ: không ghim lại → vẫn stale, không READY"; else bad "chiều đỏ KHÔNG chạy: bỏ ghim lại mà lưới sạch"; fi
    fi
    ;;
  recheck-vang)
    # E1: recheck strict — soi lại KHÔNG CHẠY ĐƯỢC là VIOLATION gọi tên đường; warn chỉ NOTE; chiều đỏ gỡ dòng mới.
    FXJ='{"signoff":"t 2026-09-08","contract":{"status":"signed-off","approved_by":"t","veto_state":""}}'
    MSG='evidence re-check KHÔNG CHẠY ĐƯỢC'
    mk_repo "$FXJ"; pmc "$FX_ROOT" --base "$FX_A"
    if [ "$VIOL" = 0 ] && has "$OUT" "OK [fx]:"; then ok "đối chứng dương: fixture nguyên strict → 0 VIOLATION, OK [fx]"; else bad "đối chứng dương đỏ: $(printf '%s\n' "$OUT" | grep -E '^(VIOLATION|NOTE) \[fx\]' | head -3 | tr '\n' ' ')"; fi
    mui() { # $1 tên · $2 file KHÔNG vendor (rỗng = đủ) · $3 chuỗi tên đường · $4 chế độ · $5 vendorFrom (rỗng = KIT)
      local ten="$1" tiem="$2" duong="$3" mode="$4" from="${5:-}"
      local j; j="$(printf '%s' "$FXJ" | python3 -c "import sys,json; d=json.load(sys.stdin); d['recheck']='$mode'; f='$from'; (f and d.__setitem__('vendorFrom', f)); o='$tiem'; (o and d.__setitem__('omit', [o])); print(json.dumps(d))")"
      mk_repo "$j"
      if [ "$ten" = "node-vang" ]; then
        # PATH riêng KHÔNG có node, dựng từ mọi lệnh của PATH thật trừ node/nodejs — rồi TỰ KIỂM
        # «node thật sự vắng» trước khi tin kết quả (S4-r1: PATH=/usr/bin:/bin chỉ đúng trên máy tác giả).
        NONODE="$TMP/nonode"; if [ ! -d "$NONODE" ]; then mkdir -p "$NONODE"; IFS=: ; for dd in $PATH; do for b in "$dd"/*; do n="$(basename "$b")"; case "$n" in node|nodejs) continue ;; esac; [ -x "$b" ] && [ ! -e "$NONODE/$n" ] && ln -s "$b" "$NONODE/$n"; done; done; unset IFS; fi
        if env PATH="$NONODE" command -v node >/dev/null 2>&1 || ! env PATH="$NONODE" command -v bash >/dev/null 2>&1; then bad "mũi node-vang KHÔNG trúng: node vẫn thấy được (hoặc bash mất) dưới PATH=$NONODE"; fi
        OUT="$(cd "$FX_ROOT" && env PATH="$NONODE" bash scripts/pre-merge-check.sh . --base "$FX_A" 2>&1)"; VIOL="$(printf '%s\n' "$OUT" | grep -c '^VIOLATION' || true)"
      else pmc "$FX_ROOT" --base "$FX_A"; fi
    }
    for m in "recheck-vang|scripts/recheck-evidence.cjs|recheck-evidence.cjs vắng" "node-vang||node vắng" "exit-2|lib/evidence-core.cjs|exit 2"; do
      ten="${m%%|*}"; r="${m#*|}"; tiem="${r%%|*}"; duong="${r#*|}"
      mui "$ten" "$tiem" "$duong" strict
      if has "$OUT" "VIOLATION [fx]: $MSG ($duong)" && [ "$VIOL" = 1 ]; then ok "strict · $ten: VIOLATION gọi tên đường «$duong», violations=1"; else bad "strict · $ten: VIOL=$VIOL — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
      mui "$ten" "$tiem" "$duong" warn
      if ! has "$OUT" "VIOLATION [fx]" && [ "$VIOL" = 0 ] && has "$OUT" "NOTE [fx]: evidence re-check"; then ok "warn · $ten: chỉ NOTE, 0 VIOLATION"; else bad "warn · $ten: VIOL=$VIOL — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    done
    # chiều đỏ của phép đo: gỡ đúng dòng mới (đường vắng file) khỏi bản sao → mũi (1) phải hết VIOLATION
    copy_tree; inject recheck-vang scripts/pre-merge-check.sh '      if [ "$RECHECK_MODE" = strict ]; then
        if [ ! -f "$RECHECK" ]; then rc_duong="recheck-evidence.cjs vắng"; else rc_duong="node vắng"; fi' '      if false; then
        if [ ! -f "$RECHECK" ]; then rc_duong="recheck-evidence.cjs vắng"; else rc_duong="node vắng"; fi'
    mui recheck-vang "scripts/recheck-evidence.cjs" "recheck-evidence.cjs vắng" strict "$COPY"
    if [ "$VIOL" = 0 ] && has "$OUT" "NOTE [fx]: evidence re-check not vendored"; then ok "chiều đỏ: gỡ dòng mới → strict lại câm (chỉ NOTE) — phép đo bám đúng dòng"; else bad "chiều đỏ KHÔNG chạy: bản sao gỡ dòng mà vẫn VIOLATION ($VIOL)"; fi
    ;;
  lan-v-stale)
    # E2: làn V (không chữ ký, xanh-sạch) vẫn bị kiểm hoá cũ — 5 ô + chiều đỏ gỡ khối DLPS-LAN-V-STALE.
    fxgit() { git -C "$FX_ROOT" -c user.email=t@t -c user.name=t -c commit.gpgsign=false "$@"; }
    STALE_MSG='VIOLATION [fx]: làn V — evidence is stale (code changed after verify, verified_commit '
    # (1) commit C đổi src.txt + sổ → VIOLATION làn V stale nêu vc=A
    mk_repo '{}'; echo v2 > "$FX_ROOT/src.txt"; echo '{"id":"d-1","type":"fix"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"; fxgit add -A >/dev/null; fxgit commit -q -m "C: code"
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "$STALE_MSG$FX_A" && [ "$VIOL" = 1 ] && ! has "$OUT" "NOTE [fx]: xanh-sạch"; then ok "(1) làn V + cây đổi ngoài T1 → VIOLATION làn V stale, không xanh-sạch"; else bad "(1) VIOL=$VIOL — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    # (2) commit C chỉ đổi docs (T1) + sổ → xanh-sạch, 0 VIOLATION
    mk_repo '{}'; echo more >> "$FX_ROOT/docs/README.md"; echo '{"id":"d-1","type":"fix"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"; fxgit add -A >/dev/null; fxgit commit -q -m "C: docs"
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "NOTE [fx]: xanh-sạch" && [ "$VIOL" = 0 ]; then ok "(2) chỉ đổi T1 → vẫn xanh-sạch, 0 VIOLATION (đối chứng dương)"; else bad "(2) VIOL=$VIOL — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    # (3) pin ma
    mk_repo '{"vc":"b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3"}'; echo '{"id":"d-1","type":"fix"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"; fxgit add -A >/dev/null; fxgit commit -q -m "C: so"
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "VIOLATION [fx]: verified_commit b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3b3 does not exist in this repo — the pin is a phantom" && [ "$VIOL" = 1 ]; then ok "(3) pin ma trên làn V → VIOLATION cùng họ P184"; else bad "(3) VIOL=$VIOL — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    # (4) không có verified_commit
    mk_repo '{"vc":""}'; echo '{"id":"d-1","type":"fix"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"; fxgit add -A >/dev/null; fxgit commit -q -m "C: so"
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "NOTE [fx]: report has no verified_commit" && ! has "$OUT" "NOTE [fx]: xanh-sạch"; then ok "(4) vắng pin → NOTE, KHÔNG xanh-sạch"; else bad "(4) — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    # (5) code đổi nhưng hồ sơ NGOÀI diff PR (base = B) → không soi stale, không dòng stale [fx]
    mk_repo '{}'; echo v2 > "$FX_ROOT/src.txt"; fxgit add -A >/dev/null; fxgit commit -q -m "C: code only"
    pmc "$FX_ROOT" --base "$FX_B"
    if ! has "$OUT" "evidence is stale" && has "$OUT" "NOTE [fx]: xanh-sạch"; then ok "(5) hồ sơ ngoài diff PR → không soi stale (stale-theo-diff-pr giữ nguyên)"; else bad "(5) — $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    # chiều đỏ: bản sao gỡ khối → ô (1) thành xanh-sạch
    copy_tree; inject lan-v-stale scripts/pre-merge-check.sh '      if [ "$DIFF_READY" -eq 1 ] && slug_in_diff "$slug"; then # DLPS-LAN-V-STALE' '      if false; then # DLPS-LAN-V-STALE'
    mk_repo "{\"vendorFrom\":\"$COPY\"}"; echo v2 > "$FX_ROOT/src.txt"; echo '{"id":"d-1","type":"fix"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"; fxgit add -A >/dev/null; fxgit commit -q -m "C: code"
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "NOTE [fx]: xanh-sạch" && [ "$VIOL" = 0 ]; then ok "chiều đỏ: gỡ khối DLPS-LAN-V-STALE → làn V lại thoát stale (phép đo bám đúng khối)"; else bad "chiều đỏ KHÔNG chạy: gỡ khối mà vẫn VIOLATION ($VIOL)"; fi
    ;;
  h1-rong)
    # E3: h1 «Known limits» có nội dung → bash và mjs cùng nói VẮNG (ranh #{2,6}); chiều đỏ đưa #{1,6} lại → bash sạch-giả.
    SEC='# Known limits\n- có nội dung\n\n## Ngoài hợp đồng\n'
    mk_repo "{\"sections\":\"$SEC\"}"; pmc "$FX_ROOT" --base "$FX_A"
    # hồ sơ không approved_by dừng ở khối Cổng 1: «làn V đòi xanh-sạch hoặc chữ ký (<why>). Máy…» — rút <why> từ đó
    WHY_BASH="$(printf '%s\n' "$OUT" | grep '^VIOLATION \[fx\]: status=verified but approved_by is empty' | sed -e 's/.*hoặc chữ ký (//' -e 's/)\. Máy .*//')"
    # đường script đi qua ENV, không qua argv: với `node -e`, argv[1] là đối số đầu, và khối CLI của
    # khong-can-nguoi.mjs (Task 5) nhận mình là «main» khi argv[1] trỏ đúng file → thoát 3 trước .then
    WHY_MJS="$(cd "$KIT" && KCN_PATH="$KIT/scripts/khong-can-nguoi.mjs" FX_DIR="$FX_ROOT/_acceptance/fx" node -e '
      import(process.env.KCN_PATH).then(m=>{const fs=require("fs");const d=process.env.FX_DIR;const c=fs.readFileSync(d+"/contract.md","utf8");const e=fs.readFileSync(d+"/evidence-report.md","utf8");process.stdout.write(m.xanhSach(c,e).why);});
    ')"
    EXP='mục «Known limits» VẮNG khỏi báo cáo (vắng ≠ rỗng)'
    if [ "$WHY_BASH" = "$EXP" ]; then ok "bash: h1 Known limits có nội dung → «$EXP»"; else bad "bash nói «$WHY_BASH»"; fi
    if [ "$WHY_MJS" = "$EXP" ] && [ "$WHY_MJS" = "$WHY_BASH" ]; then ok "mjs nói cùng câu từng ký tự với bash"; else bad "mjs nói «$WHY_MJS»"; fi
    if ! has "$OUT" "NOTE [fx]: xanh-sạch"; then ok "h1 có nội dung → KHÔNG xanh-sạch"; else bad "bash vẫn xanh-sạch trên h1 có nội dung"; fi
    # chiều đỏ: bản sao đưa #{1,6} trở lại ở hai dòng ranh → bash sạch-giả trong khi mjs vẫn VẮNG
    copy_tree
    inject h1-rong-a scripts/pre-merge-check.sh 'some(l=>/^#{2,6}\s+/.test(l)' 'some(l=>/^#{1,6}\s+/.test(l)'
    inject h1-rong-b scripts/pre-merge-check.sh 'l.replace(/^#{2,6}\s+/,"")' 'l.replace(/^#{1,6}\s+/,"")'
    mk_repo "{\"sections\":\"$SEC\",\"vendorFrom\":\"$COPY\"}"; pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "NOTE [fx]: xanh-sạch"; then ok "chiều đỏ: ranh #{1,6} → bash sạch-giả trên h1 (bash sach-gia tren h1) — phép đo bám đúng hai dòng ranh"; else bad "chiều đỏ KHÔNG chạy: bản sao #{1,6} mà bash vẫn không xanh-sạch"; fi
    ;;
  veto-ghi)
    # E6: ma trận 4 ô {verified, machine-cleared} × {approved_by, mo}: ghi da-veto (có vết) không bị lưới ghi chặn;
    # đối chứng base (origin/main): ô machine-cleared×mo phải đỏ «Gate 1 approval not recorded». Rồi veto-trace ở pre-merge.
    copy_tree origin/main; BASE_LIB="$COPY/lib/evidence-core.cjs"
    OPENED='2026-09-01T00:00:00Z'
    veto_eval() { # $1 lib · $2 status · $3 approved_by ('' = làn V mo) → in số failure + failures
      node -e '
        const core=require(process.argv[1]); const st=process.argv[2], ap=process.argv[3], op=process.argv[4];
        const fm=(veto)=>["---","schema_version: 1","feature: fx","slug: fx","risk_tier: T2","surfaces: [cli]",`status: ${st}`,`approved_by: ${ap}`,"approved_at:",
          ...(veto||ap===""?[`veto_state: ${veto}`,`veto_opened_at: ${op}`]:[]),"---","","# fx","","## Criteria","","- AC-1: x.",""].join("\n");
        const oldTxt=fm(ap===""?"mo":""); const newTxt=fm("da-veto");
        const r=core.evaluateContractWrite(newTxt, oldTxt); process.stdout.write(r.failures.length+"\n"+r.failures.join("\n"));
      ' "$1" "$2" "$3" "$OPENED"
    }
    for st in verified machine-cleared; do for ap in t ""; do
      lab="$st×$([ -n "$ap" ] && echo approved || echo mo)"
      R="$(veto_eval "$KIT/lib/evidence-core.cjs" "$st" "$ap")"; n="${R%%$'\n'*}"
      if [ "$n" = 0 ]; then ok "lib mới · $lab: ghi da-veto QUA (0 failure)"; else bad "lib mới · $lab: $n failure — $(printf '%s' "$R" | tail -1 | cut -c1-120)"; fi
      RB="$(veto_eval "$BASE_LIB" "$st" "$ap")"; nb="${RB%%$'\n'*}"
      if [ "$st" = machine-cleared ] && [ -z "$ap" ]; then
        if [ "$nb" != 0 ] && has "$RB" "Gate 1 approval not recorded"; then ok "lib base · $lab: đỏ «Gate 1 approval not recorded» (chiều đỏ của luật cũ — gap-probe P0 tái hiện)"; else bad "lib base · $lab: không tái hiện P0 ($nb)"; fi
      else
        if [ "$nb" = 0 ]; then ok "lib base · $lab: cũng QUA (ô không đổi hành vi)"; else bad "lib base · $lab: $nb failure"; fi
      fi
    done; done
    # pre-merge veto-trace: da-veto chưa xử → VIOLATION; lật ngược không sổ → VIOLATION; có sổ → NOTE đã xử
    fxgit() { git -C "$FX_ROOT" -c user.email=t@t -c user.name=t -c commit.gpgsign=false "$@"; }
    mk_repo '{}'; sed -i '' 's/^veto_state: mo$/veto_state: da-veto/' "$FX_ROOT/_acceptance/fx/contract.md"
    fxgit add -A >/dev/null; fxgit commit -q -m "C: veto"; C="$(fxgit rev-parse HEAD)"
    pmc "$FX_ROOT" --base "$FX_A"
    if has "$OUT" "VIOLATION [fx]: veto_state=da-veto chưa xử"; then ok "pre-merge: da-veto chưa xử → VIOLATION (hồ sơ không merge được ở trạng thái veto)"; else bad "pre-merge không báo da-veto chưa xử: $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    sed -i '' 's/^veto_state: da-veto$/veto_state: mo/' "$FX_ROOT/_acceptance/fx/contract.md"; fxgit add -A >/dev/null; fxgit commit -q -m "D: lat nguoc khong so"
    pmc "$FX_ROOT" --base "$C"
    if has "$OUT" "mà KHÔNG có entry sổ quyết định"; then ok "chiều đỏ: lật da-veto→mo KHÔNG entry sổ → VIOLATION (veto người không bốc hơi)"; else bad "lật ngược không sổ mà không đỏ: $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    printf '%s\n' '{"id":"d-v1","type":"veto","stage":"gate2","at":"2026-09-08T00:00:00Z","decision":"xử: về draft làm lại phạm vi","decided_by":"t"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"
    fxgit add -A >/dev/null; fxgit commit -q -m "E: so"
    pmc "$FX_ROOT" --base "$C"
    if has "$OUT" "NOTE [fx]: veto đã xử"; then ok "có entry sổ → NOTE veto đã xử"; else bad "có sổ mà không NOTE đã xử: $(printf '%s\n' "$OUT" | grep -E '\[fx\]' | head -3 | tr '\n' ' ')"; fi
    ;;
  veto-slot)
    # E7: SLOTS/GRAMMAR có nhãn veto; thẻ máy-đi-trước render «veto hay để yên: ___»; checker P192 THẬT (rút từ suite) round-trip; chiều đỏ gỡ dòng SLOTS.
    LAW="$KIT/skills/acceptance/references/human-facing-language.md"
    SL="$(sed -n '/<<<GATE-ONESHOT-SLOTS/,/GATE-ONESHOT-SLOTS>>>/p' "$LAW")"; GR="$(sed -n '/<<<GATE-ONESHOT-GRAMMAR/,/GATE-ONESHOT-GRAMMAR>>>/p' "$LAW")"
    if printf '%s\n' "$SL" | grep -qx 'g2 veto hay để yên'; then ok "SLOTS có dòng «g2 veto hay để yên»"; else bad "SLOTS thiếu dòng veto"; fi
    if has "$GR" 'veto: <lý do>' && has "$GR" 'để yên'; then ok "GRAMMAR mục signoff khai «veto: <lý do>» / «để yên»"; else bad "GRAMMAR thiếu nhãn veto"; fi
    WS="$TMP/ws-g2v"; mkdir -p "$WS"; . "$KIT/tests/plugins/fixtures/viec-cua-anh-scenarios.sh"; vca_scenario gate2-may-di-tiep "$WS"
    node "$KIT/scripts/gate-card.js" --root "$WS" --slug fx --gate 2 > "$TMP/card-g2v.html" 2>"$TMP/card-g2v.err"; rc=$?
    if [ $rc -eq 0 ] && grep -qF 'veto hay để yên: ___' "$TMP/card-g2v.html" && ! grep -qF 'ký hay trả: ___' "$TMP/card-g2v.html"; then ok "thẻ Cổng 2 hồ sơ máy-đi-trước: «veto hay để yên: ___», không «ký hay trả»"; else bad "thẻ g2v: rc=$rc — $(head -c 200 "$TMP/card-g2v.err")"; fi
    # checker P192 rút NGUYÊN VĂN từ suite (writer→reader): thẻ ↔ SLOTS hai chiều
    sed -n "/^cat > \"\$P192TMP\/check-rt.js\" <<'P192JS'$/,/^P192JS$/p" "$KIT/tests/plugins/run-tests.sh" | sed '1d;$d' > "$TMP/check-rt.js"
    [ -s "$TMP/check-rt.js" ] || bad "không rút được checker P192 từ suite"
    WS1="$TMP/ws-g1"; WS2="$TMP/ws-g2"; mkdir -p "$WS1" "$WS2"; vca_scenario gate1-draft "$WS1"; vca_scenario gate2-4loai "$WS2"
    node "$KIT/scripts/gate-card.js" --root "$WS1" --slug fx --gate 1 > "$TMP/card-g1.html" 2>/dev/null; node "$KIT/scripts/gate-card.js" --root "$WS2" --slug fx --gate 2 > "$TMP/card-g2.html" 2>/dev/null
    if node "$TMP/check-rt.js" "$LAW" E9 "$TMP/card-g1.html" "$TMP/card-g2.html" "$TMP/card-g2v.html" >/dev/null 2>"$TMP/rt.err"; then ok "checker P192 thật: ba thẻ ↔ SLOTS khớp hai chiều (đối chứng dương)"; else bad "checker P192 đỏ: $(cat "$TMP/rt.err")"; fi
    grep -v '^g2 veto hay để yên$' "$LAW" > "$TMP/law-mut.md"
    ERR="$(node "$TMP/check-rt.js" "$TMP/law-mut.md" E9 "$TMP/card-g1.html" "$TMP/card-g2.html" "$TMP/card-g2v.html" 2>&1)"; rc=$?
    if [ $rc -ne 0 ] && has "$ERR" 'nhan khong khop SLOTS: veto hay để yên'; then ok "chiều đỏ: gỡ dòng SLOTS → checker đỏ đích danh «veto hay để yên»"; else bad "chiều đỏ KHÔNG chạy: rc=$rc $ERR"; fi
    ;;
  ket-ghi)
    # E8: đường ghi ô kết — --write ghi đúng một dòng status; --check không đổi byte; 4 ô từ chối exit 2; chiều đỏ hai tầng.
    KCN="$KIT/scripts/khong-can-nguoi.mjs"
    kcn() { local r="$1"; shift; KOUT="$(node "$KCN" "$@" --root "$r" --slug fx 2>&1)"; KRC=$?; }
    md5f() { md5 -q "$1" 2>/dev/null || md5sum "$1" | cut -d' ' -f1; }
    mk_repo '{}'; cp "$FX_ROOT/_acceptance/fx/contract.md" "$TMP/c-before.md"; kcn "$FX_ROOT" --write
    D="$(diff "$TMP/c-before.md" "$FX_ROOT/_acceptance/fx/contract.md" | grep -c '^[<>]')"
    if [ $KRC -eq 0 ] && [ "$KOUT" = "machine-cleared: fx" ] && grep -q '^status: machine-cleared$' "$FX_ROOT/_acceptance/fx/contract.md" && [ "$D" = 2 ]; then ok "(1) --write: exit 0, in «machine-cleared: fx», diff đúng một dòng status"; else bad "(1) rc=$KRC out=«$KOUT» diff=$D"; fi
    mk_repo '{}'; H1="$(md5f "$FX_ROOT/_acceptance/fx/contract.md")"; kcn "$FX_ROOT" --check; H2="$(md5f "$FX_ROOT/_acceptance/fx/contract.md")"
    if [ $KRC -eq 0 ] && [ "$KOUT" = "sẽ machine-cleared: fx" ] && [ "$H1" = "$H2" ]; then ok "(1b) --check: exit 0, không đổi byte"; else bad "(1b) rc=$KRC out=«$KOUT» md5 $H1→$H2"; fi
    mk_repo '{"sections":"## Known limits\n- còn một lỗ\n\n## Ngoài hợp đồng\n"}'; H1="$(md5f "$FX_ROOT/_acceptance/fx/contract.md")"; kcn "$FX_ROOT" --write; H2="$(md5f "$FX_ROOT/_acceptance/fx/contract.md")"
    if [ $KRC -eq 2 ] && [ "$KOUT" = "chưa đủ: mục «Known limits» có nội dung" ] && [ "$H1" = "$H2" ]; then ok "(2) Known limits có nội dung → exit 2 nêu đúng điều kiện, không ghi"; else bad "(2) rc=$KRC out=«$KOUT»"; fi
    mk_repo '{}'; sed -i '' 's/| PASS |$/| UNCERTAIN |/' "$FX_ROOT/_acceptance/fx/evidence-report.md"; kcn "$FX_ROOT" --write
    if [ $KRC -eq 2 ] && [ "$KOUT" = "chưa đủ: có mục UNCERTAIN" ]; then ok "(3) mục UNCERTAIN → exit 2"; else bad "(3) rc=$KRC out=«$KOUT»"; fi
    mk_repo '{"contract":{"risk_tier":"T3","approved_by":"t","veto_state":""}}'; kcn "$FX_ROOT" --write
    if [ $KRC -eq 2 ] && [ "$KOUT" = "chưa đủ: hạng T3 (chỉ T2)" ] && ! grep -q machine-cleared "$FX_ROOT/_acceptance/fx/contract.md"; then ok "(4) hạng T3 → exit 2, không ghi"; else bad "(4) rc=$KRC out=«$KOUT»"; fi
    mk_repo '{"contract":{"status":"draft"}}'; kcn "$FX_ROOT" --write
    if [ $KRC -eq 2 ] && [ "$KOUT" = "chưa đủ: status draft (chỉ verified)" ]; then ok "(5) status draft → exit 2"; else bad "(5) rc=$KRC out=«$KOUT»"; fi
    kcn "$FX_ROOT" --nope; [ $KRC -eq 3 ] && ok "(6) thiếu cờ → exit 3" || bad "(6) thiếu cờ mà rc=$KRC"
    # chiều đỏ hai tầng: M1 gỡ cổng «why» → T3 vẫn bị lưới ghi từ chối (tự kiểm sống); M2 gỡ cả hai → T3 bị ghi → phép đo ô (4) đỏ
    copy_tree; inject ket-ghi-m1 scripts/khong-can-nguoi.mjs "  if (why) { console.error(\`chưa đủ: \${why}\`); process.exit(2); }" "  if (false) { console.error(\`chưa đủ: \${why}\`); process.exit(2); }"
    mk_repo '{"contract":{"risk_tier":"T3","approved_by":"t","veto_state":""}}'; KOUT="$(node "$COPY/scripts/khong-can-nguoi.mjs" --write --root "$FX_ROOT" --slug fx 2>&1)"; KRC=$?
    if [ $KRC -eq 2 ] && has "$KOUT" "lưới ghi từ chối:" && has "$KOUT" "T2-ONLY" && ! grep -q machine-cleared "$FX_ROOT/_acceptance/fx/contract.md"; then ok "chiều đỏ M1: gỡ cổng why → T3 vẫn bị lưới ghi (evaluateContractWrite) từ chối — tự kiểm sống"; else bad "M1: rc=$KRC out=«$KOUT»"; fi
    inject ket-ghi-m2 scripts/khong-can-nguoi.mjs "  if (r.anyFailure) { console.error(\`lưới ghi từ chối:" "  if (false) { console.error(\`lưới ghi từ chối:"
    mk_repo '{"contract":{"risk_tier":"T3","approved_by":"t","veto_state":""}}'; KOUT="$(node "$COPY/scripts/khong-can-nguoi.mjs" --write --root "$FX_ROOT" --slug fx 2>&1)"; KRC=$?
    if [ $KRC -eq 0 ] && grep -q '^status: machine-cleared$' "$FX_ROOT/_acceptance/fx/contract.md"; then ok "chiều đỏ M2: gỡ cả hai tầng → T3 bị ghi machine-cleared (ghi machine-cleared cho T3) — phép đo ô (4) đỏ đúng chỗ"; else bad "M2 KHÔNG chạy: rc=$KRC out=«$KOUT»"; fi
    ;;
  su-lieu)
    # E11: trên CÂY THẬT của kit, bản mới không tăng số VIOLATION so với bản gốc origin/main (cùng cây, cùng cờ);
    # hai luật mới (làn V stale · recheck câm) không cắn hồ sơ nào của kit. Đối chứng dương của phép đếm trên fixture stale.
    mkdir -p "$TMP/base"; git -C "$KIT" archive origin/main scripts lib | tar -x -C "$TMP/base"
    OUT_NEW="$(bash "$KIT/scripts/pre-merge-check.sh" "$KIT" --base origin/main --recheck-all 2>&1)"; RC_NEW=$?
    OUT_BASE="$(bash "$TMP/base/scripts/pre-merge-check.sh" "$KIT" --base origin/main --recheck-all 2>&1)"; RC_BASE=$?
    N_NEW="$(printf '%s\n' "$OUT_NEW" | grep -c '^VIOLATION' || true)"; N_BASE="$(printf '%s\n' "$OUT_BASE" | grep -c '^VIOLATION' || true)"
    echo "  [su-lieu] VIOLATION trên cây thật: bản mới=$N_NEW (exit $RC_NEW) · bản gốc origin/main=$N_BASE (exit $RC_BASE)"
    if [ "$N_NEW" -le "$N_BASE" ]; then ok "bản mới không tăng VIOLATION so với bản gốc ($N_NEW ≤ $N_BASE)"; else bad "bản mới TĂNG VIOLATION: $N_NEW > $N_BASE — $(printf '%s\n' "$OUT_NEW" | grep '^VIOLATION' | head -3 | cut -c1-160 | tr '\n' ' ')"; fi
    N_LV="$(printf '%s\n' "$OUT_NEW" | grep -c 'làn V — evidence is stale' || true)"; N_RC="$(printf '%s\n' "$OUT_NEW" | grep -c 're-check KHÔNG CHẠY ĐƯỢC' || true)"
    if [ "$N_LV" = 0 ] && [ "$N_RC" = 0 ]; then ok "hai luật mới không cắn hồ sơ nào của kit (làn V stale=0 · recheck câm=0)"; else bad "luật mới cắn cây thật: làn V stale=$N_LV · recheck câm=$N_RC"; fi
    # đối chứng dương của phép đếm: fixture stale làn V → cùng lệnh đếm cho ≥1
    fxgit() { git -C "$FX_ROOT" -c user.email=t@t -c user.name=t -c commit.gpgsign=false "$@"; }
    mk_repo '{}'; echo v2 > "$FX_ROOT/src.txt"; echo '{"id":"d-1","type":"fix"}' >> "$FX_ROOT/_acceptance/fx/decisions.jsonl"; fxgit add -A >/dev/null; fxgit commit -q -m "C: code"
    pmc "$FX_ROOT" --base "$FX_A"; N_FX="$(printf '%s\n' "$OUT" | grep -c 'làn V — evidence is stale' || true)"
    if [ "$N_FX" -ge 1 ] && [ "$VIOL" -ge 1 ]; then ok "đối chứng dương của phép đếm: fixture stale làn V → đếm được $N_FX (VIOLATION=$VIOL)"; else bad "phép đếm mù: fixture stale mà đếm 0"; fi
    ;;
  *) echo "rang.sh: chân lạ '$CHAN'"; exit 3 ;;
esac
done_chan
