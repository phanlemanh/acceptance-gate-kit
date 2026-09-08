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
        OUT="$(cd "$FX_ROOT" && env PATH=/usr/bin:/bin bash scripts/pre-merge-check.sh . --base "$FX_A" 2>&1)"; VIOL="$(printf '%s\n' "$OUT" | grep -c '^VIOLATION' || true)"
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
    WHY_MJS="$(cd "$KIT" && node -e '
      import(process.argv[1]).then(m=>{const fs=require("fs");const c=fs.readFileSync(process.argv[2]+"/contract.md","utf8");const e=fs.readFileSync(process.argv[2]+"/evidence-report.md","utf8");process.stdout.write(m.xanhSach(c,e).why);});
    ' "$KIT/scripts/khong-can-nguoi.mjs" "$FX_ROOT/_acceptance/fx")"
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
  *) echo "rang.sh: chân lạ '$CHAN'"; exit 3 ;;
esac
done_chan
