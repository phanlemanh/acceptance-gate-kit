#!/usr/bin/env bash
# rang.sh — răng hồ sơ cham-dung-cay-dung-cho-dung. Nếp không-vào-suite-vĩnh-viễn.
# Fixture CODE-SINH trong chính lần chạy; đường dẫn suy từ vị trí script.
set -u
CHAN=""
[ "${1:-}" = "--chan" ] && CHAN="${2:-}"
KIT="$(cd "$(dirname "$0")/../.." && pwd)"
S4ARGS="$KIT/feature-loop/scripts/s4-args.mjs"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
PASS=0; FAIL=0
ok()   { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad()  { echo "  FAIL: $1"; FAIL=$((FAIL+1)); }
done_chan() {
  echo "rang[$CHAN]: $PASS pass, $FAIL fail"
  [ "$FAIL" -eq 0 ] || exit 1
  exit 0
}

# ── fixture: repo git tạm có xưởng + hồ sơ demo, nhánh chính + nhánh feature ──
build_fixture() {
  REPO="$TMP/repo"
  mkdir -p "$REPO/_acceptance/demo"
  git -C "$TMP" init -q -b main repo
  git -C "$REPO" config user.email t@t && git -C "$REPO" config user.name t
  cat > "$REPO/_acceptance/config.yaml" <<'YAML'
schema_version: 1
executors:
  test:
    demo: "echo demo-suite"
    build: "echo demo-build"
  script:
    kiem: "echo demo-script"
risk_tiers:
  t1_skip_globs:
    - "docs/**"
  t3_paths:
    - "core/**"
feature_loop:
  suite_keys:
    - executors.test.demo
    - executors.test.build
YAML
  cat > "$REPO/_acceptance/demo/contract.md" <<'MD'
---
schema_version: 1
feature: demo
slug: demo
risk_tier: T2
status: implemented
---
# Acceptance Contract: demo
## Criteria
- AC-1: Given a, When b, Then c.
MD
  cat > "$REPO/_acceptance/demo/evals.yaml" <<'YAML'
schema_version: 1
feature_slug: demo
evals:
  - id: E1
    criterion: AC-1
    executor: script
    cmd: config:executors.script.kiem
    expected: >
      demo expected.
    evidence_required: [run_id, exit_code, verifier, verified_at, output]
    paths: ["src/a.js"]
  - id: E2
    criterion: AC-1
    executor: judgment
    question: "demo judgment?"
    inputs: [gap-probe-demo.md]
YAML
  echo "demo" > "$REPO/_acceptance/demo/gap-probe-demo.md"
  git -C "$REPO" add -A && git -C "$REPO" commit -qm base
  git -C "$REPO" checkout -qb feat/demo
  echo x > "$REPO/x.txt" && git -C "$REPO" add x.txt && git -C "$REPO" commit -qm feat
}

run_s4args() { # $@ = cờ thêm; args ra $TMP/args.json; stdout/err ra $TMP/out.txt
  node "$S4ARGS" --slug demo --root "$REPO" --ag-root "$KIT" --out "$TMP/args.json" "$@" >"$TMP/out.txt" 2>&1
}

case "$CHAN" in

args-du-truong)
  build_fixture
  if ! run_s4args; then bad "s4-args chạy được trên fixture lành (đối chứng dương): $(tail -3 "$TMP/out.txt")"; done_chan; fi
  MB="$(git -C "$REPO" merge-base main HEAD)"
  HEADSHA="$(git -C "$REPO" rev-parse HEAD)"
  RREPO="$(cd "$REPO" && pwd -P)"
  node - "$TMP/args.json" "$MB" "$HEADSHA" "$RREPO" "$KIT" <<'NODE'
const fs=require('fs');
const [f,MB,HEAD,REPO,KIT]=process.argv.slice(2);
const a=JSON.parse(fs.readFileSync(f,'utf8'));
let pass=0,fail=0;
const ck=(name,cond)=>{ if(cond){console.log('  PASS: ve '+name);pass++;} else {console.log('  FAIL: ve '+name);fail++;} };
ck('1-slug', a.slug==='demo');
ck('2-round', a.round===1);
ck('3-riskTier', a.riskTier==='T2');
ck('4-evals-resolved', Array.isArray(a.evals) && a.evals.find(e=>e.id==='E1').cmd==='echo demo-script');
ck('5-ref-goc', a.evals.find(e=>e.id==='E1').ref==='config:executors.script.kiem');
ck('6-suiteCommands', JSON.stringify(a.suiteCommands)===JSON.stringify(['echo demo-suite','echo demo-build']));
ck('7-diffBase-merge-base', a.diffBase===MB && a.diffBase!==HEAD);
ck('8-repoRoot', a.repoRoot===REPO);
ck('9-personasPath', fs.existsSync(a.personasPath));
ck('10-templatePath', fs.existsSync(a.templatePath));
ck('11-toolKillRule-nguyen-van', a.toolKillRule===fs.readFileSync(KIT+'/skills/acceptance/references/tool-kill-rule.md','utf8'));
ck('12-contractPath', a.contractPath===REPO+'/_acceptance/demo/contract.md');
ck('13-invokedAt-ISO', /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(a.invokedAt));
ck('14-invokedSha', a.invokedSha===HEAD);
const cmds=[...a.evals.map(e=>e.cmd||''),...a.suiteCommands];
ck('15-khong-cd-nuong-san', cmds.every(c=>!/^cd /.test(String(c))));
if(a.evals.find(e=>e.id==='E2').inputs.every(p=>p.startsWith('/'))) {console.log('  PASS: ve-phu inputs-abs');pass++;} else {console.log('  FAIL: ve-phu inputs-abs');fail++;}
process.exitCode = fail?1:0;
console.log(`  ma tran: ${pass} pass, ${fail} fail`);
NODE
  [ $? -eq 0 ] && ok "ma trận 15 vế đủ" || bad "ma trận 15 vế"
  # chiều đỏ lớp 1: xoá suite_keys → exit ≠ 0 ghim tên phần thiếu, KHÔNG sinh tệp
  sed -i.bak '/suite_keys:/,/executors.test.build/d' "$REPO/_acceptance/config.yaml"
  rm -f "$TMP/args.json"
  if run_s4args; then bad "thiếu suite_keys mà vẫn exit 0"; else
    if grep -q "suite_keys" "$TMP/out.txt" && [ ! -f "$TMP/args.json" ]; then ok "chiều đỏ: thiếu suite_keys → kêu to, không sinh tệp"; else bad "chiều đỏ suite_keys: thông điệp không ghim hoặc tệp vẫn sinh: $(tail -2 "$TMP/out.txt")"; fi
  fi
  mv "$REPO/_acceptance/config.yaml.bak" "$REPO/_acceptance/config.yaml"
  # chiều đỏ lớp 2 (mutant vật): diffBase = HEAD thay merge-base → vế 7 phải đỏ
  MUT="$TMP/s4-args-mut.mjs"
  sed 's/merge-base/rev-parse/' "$S4ARGS" > "$MUT"
  if node "$MUT" --slug demo --root "$REPO" --ag-root "$KIT" --out "$TMP/args-mut.json" >/dev/null 2>&1; then
    if node -e "const a=require('$TMP/args-mut.json'); process.exit(a.diffBase==='$MB'?1:0)"; then ok "mutant diffBase≠merge-base bị vế 7 phân biệt (giá trị lệch thật)"; else bad "mutant không đổi được diffBase — chiều đỏ chết"; fi
  else ok "mutant chết sớm (cũng tính phân biệt được)"; fi
  done_chan ;;

ref-hong)
  build_fixture
  sed -i.bak 's|config:executors.script.kiem|config:executors.script.khong_ton_tai|' "$REPO/_acceptance/demo/evals.yaml"
  rm -f "$TMP/args.json"
  if run_s4args; then bad "ref hỏng mà vẫn exit 0"; else
    if grep -q "executors.script.khong_ton_tai" "$TMP/out.txt"; then ok "chiều đỏ: exit ≠ 0, thông điệp ghim đúng tên ref"; else bad "thông điệp không ghim tên ref: $(tail -2 "$TMP/out.txt")"; fi
    [ ! -f "$TMP/args.json" ] && ok "fail-closed: không sinh tệp args" || bad "tệp args vẫn được sinh dù ref hỏng"
  fi
  mv "$REPO/_acceptance/demo/evals.yaml.bak" "$REPO/_acceptance/demo/evals.yaml"
  if run_s4args && [ -f "$TMP/args.json" ]; then ok "đối chứng dương: ref thật → exit 0, tệp sinh ra"; else bad "đối chứng dương hỏng: $(tail -2 "$TMP/out.txt")"; fi
  done_chan ;;

round-tu-dem)
  build_fixture
  cat > "$REPO/_acceptance/demo/evidence-report.md" <<'MD'
---
verdict: REJECT
---
# Evidence Report: demo

## Iterations

- Round 1: REJECT — 2 eval đỏ.
- Round 2: REJECT — 1 eval đỏ.
MD
  if run_s4args --no-carry && node -e "process.exit(require('$TMP/args.json').round===3?0:1)"; then ok "Iterations 2 round → round 3"; else bad "round không ra 3: $(tail -2 "$TMP/out.txt")"; fi
  rm "$REPO/_acceptance/demo/evidence-report.md"
  if run_s4args && node -e "process.exit(require('$TMP/args.json').round===1?0:1)"; then ok "không evidence-report → round 1"; else bad "round không ra 1"; fi
  cat > "$REPO/_acceptance/demo/evidence-report.md" <<'MD'
---
verdict: REJECT
---
## Lich su vong

- Round 1: REJECT.
MD
  if run_s4args; then bad "section Iterations vắng mà vẫn exit 0 (đoán round)"; else
    grep -q "không đếm được round" "$TMP/out.txt" && ok "chiều đỏ: section lạ → kêu to, không đoán" || bad "thông điệp không ghim: $(tail -2 "$TMP/out.txt")"
  fi
  done_chan ;;

carry-da-goi)
  build_fixture
  ANCHOR="$(git -C "$REPO" rev-parse HEAD)"
  # round 1 đã chạy: run-log có dòng E1 xanh tại ANCHOR (dòng eval thật KHÔNG mang
  # field kind — carry-plan lọc `!l.kind`); sau đó cây đổi ở x2.txt, không chạm paths E1
  RID="minted-demo-E1-r1"
  printf '%s\n' "{\"ts\":\"2026-08-29T00:00:00Z\",\"sha\":\"$ANCHOR\",\"round\":1,\"evalId\":\"E1\",\"run_id\":\"$RID\",\"exit_code\":0,\"cmd\":\"echo demo-script\"}" > "$REPO/_acceptance/demo/run-log.jsonl"
  printf '%s\n' "{\"ts\":\"2026-08-29T00:00:01Z\",\"sha\":\"$ANCHOR\",\"round\":1,\"kind\":\"baseline\",\"evals_hash\":\"KHAC\",\"non_discriminating\":[]}" >> "$REPO/_acceptance/demo/run-log.jsonl"
  cat > "$REPO/_acceptance/demo/evidence-report.md" <<'MD'
---
verdict: REJECT
---
## Iterations

- Round 1: REJECT.
MD
  echo y > "$REPO/x2.txt" && git -C "$REPO" add -A && git -C "$REPO" commit -qm r1-fix
  if run_s4args --carry-anchor "$ANCHOR"; then
    node - "$TMP/args.json" "$RID" <<'NODE'
const [f,RID]=process.argv.slice(2);
const a=require(f); let fail=0;
const ck=(n,c)=>{ if(c){console.log('  PASS: '+n);} else {console.log('  FAIL: '+n);fail++;} };
ck('carriedEvals có E1 giữ run_id', Array.isArray(a.carriedEvals) && a.carriedEvals.some(c=>c.id==='E1'&&c.runId===RID));
ck('evalsHash có mặt (P2)', typeof a.evalsHash==='string' && a.evalsHash.length===64);
ck('runBaseline true khi hash khác', a.runBaseline===true);
ck('judgment E2 mang inputsHash (P3)', a.evals.some(e=>e.id==='E2'&&typeof e.inputsHash==='string'&&e.inputsHash.length===64));
process.exitCode=fail?1:0;
NODE
    [ $? -eq 0 ] && ok "carry tự gọi: carried + P2 + P3 đủ" || bad "carry thiếu mảnh (xem trên)"
  else bad "round 2 có anchor mà exit ≠ 0: $(tail -3 "$TMP/out.txt")"; fi
  # chiều đỏ: round ≥2 không khai gì → exit ≠ 0 ghim thông điệp
  if run_s4args; then bad "round ≥2 thiếu khai carry mà vẫn exit 0"; else
    grep -q "carry-anchor" "$TMP/out.txt" && ok "chiều đỏ: thiếu khai carry → kêu to" || bad "thông điệp không ghim --carry-anchor: $(tail -2 "$TMP/out.txt")"
  fi
  done_chan ;;

loi-khai)
  build_fixture
  run_s4args || { bad "không sinh được args: $(tail -3 "$TMP/out.txt")"; done_chan; }
  H1="$(git -C "$REPO" rev-parse HEAD)"
  node -e "const a=require('$TMP/args.json'); process.exit(a.generated_sha==='$H1' && /^\d{4}-\d{2}-\d{2}T/.test(a.generated_at)?0:1)" \
    && ok "tệp args mang generated_at + generated_sha khớp HEAD" || bad "lời khai phạm vi thiếu/lệch"
  echo z > "$REPO/z.txt" && git -C "$REPO" add -A && git -C "$REPO" commit -qm drift
  H2="$(git -C "$REPO" rev-parse HEAD)"
  if [ "$H1" != "$H2" ] && ! node -e "const a=require('$TMP/args.json'); process.exit(a.generated_sha==='$H2'?0:1)"; then
    ok "chiều đỏ vế tệp: cây đổi → bộ so BÁO lệch (phép so sống)"
  else bad "bộ so không phát hiện cây đổi"; fi
  SKILL_MD="$KIT/feature-loop/skills/feature-loop/SKILL.md"
  BLOCK="$(sed -n '/<<<S4-ARGS-FRESHNESS/,/S4-ARGS-FRESHNESS>>>/p' "$SKILL_MD")"
  if [ -n "$BLOCK" ] && echo "$BLOCK" | grep -q "generated_sha" && echo "$BLOCK" | grep -q -e "SINH LẠI" -e "sinh lại"; then
    ok "vế SKILL: khối S4-ARGS-FRESHNESS chứa generated_sha + hành-động-sinh-lại"
  else bad "vế SKILL: khối S4-ARGS-FRESHNESS thiếu/rỗng ruột"; fi
  # chiều đỏ vế SKILL: rỗng ruột khối trong BẢN SAO → phép kiểm phải đỏ
  CP="$TMP/skill-copy.md"
  sed '/<<<S4-ARGS-FRESHNESS/,/S4-ARGS-FRESHNESS>>>/{/<<<S4-ARGS-FRESHNESS/!{/S4-ARGS-FRESHNESS>>>/!d;};}' "$SKILL_MD" > "$CP"
  B2="$(sed -n '/<<<S4-ARGS-FRESHNESS/,/S4-ARGS-FRESHNESS>>>/p' "$CP")"
  if echo "$B2" | grep -q "generated_sha"; then bad "mutant rỗng-ruột không có tác dụng — chiều đỏ vế SKILL chết"; else ok "chiều đỏ vế SKILL: bản sao rỗng ruột → phép kiểm đỏ được"; fi
  done_chan ;;

skill-khong-fallback)
  SKILL_MD="$KIT/feature-loop/skills/feature-loop/SKILL.md"
  # vế (a): khối điều khoản DỪNG có mặt và NỘI DUNG chứa cả hành-động-dừng lẫn cấm-fallback
  BLOCK="$(sed -n '/<<<S4-ARGS-CLAUSE/,/S4-ARGS-CLAUSE>>>/p' "$SKILL_MD")"
  if [ -n "$BLOCK" ] && echo "$BLOCK" | grep -q "DỪNG" && echo "$BLOCK" | grep -q "soạn args bằng tay"; then
    ok "vế (a): khối S4-ARGS-CLAUSE đủ hành-động-dừng + cấm-fallback"
  else bad "vế (a): khối S4-ARGS-CLAUSE thiếu/rỗng ruột"; fi
  # vế (b): khối 14-gạch soạn-tay cũ đã VẮNG — hai chuỗi mồi đại diện của bản cũ
  M1="đi theo dotted path"; M2="shasum -a 256"
  if grep -qF "$M1" "$SKILL_MD" || grep -qF "$M2" "$SKILL_MD"; then
    bad "vế (b): SKILL còn dấu vết công thức soạn-tay (mồi: $M1 / $M2)"
  else ok "vế (b): công thức soạn-tay cũ đã vắng khỏi SKILL"; fi
  # chiều đỏ (b): chèn lại một dòng soạn-tay vào BẢN SAO → phép kiểm phải đỏ
  CP="$TMP/skill-copy.md"
  { cat "$SKILL_MD"; printf '\n   - Resolve mỗi `cmd: config:a.b.c` → đọc config.yaml, đi theo dotted path.\n'; } > "$CP"
  if grep -qF "$M1" "$CP"; then ok "chiều đỏ (b): bản sao chèn lại soạn-tay → phép kiểm đỏ được"; else bad "chiều đỏ (b) chết — mồi không bắt được dòng chèn"; fi
  # chiều đỏ (a): rỗng ruột khối trong bản sao → vế (a) phải đỏ
  CP2="$TMP/skill-copy2.md"
  sed '/<<<S4-ARGS-CLAUSE/,/S4-ARGS-CLAUSE>>>/{/<<<S4-ARGS-CLAUSE/!{/S4-ARGS-CLAUSE>>>/!d;};}' "$SKILL_MD" > "$CP2"
  B2="$(sed -n '/<<<S4-ARGS-CLAUSE/,/S4-ARGS-CLAUSE>>>/p' "$CP2")"
  if echo "$B2" | grep -q "DỪNG"; then bad "chiều đỏ (a) chết — mutant rỗng ruột không tác dụng"; else ok "chiều đỏ (a): bản sao rỗng ruột → vế (a) đỏ được"; fi
  done_chan ;;

*)
  echo "rang.sh --chan <args-du-truong|ref-hong|round-tu-dem|carry-da-goi|loi-khai|skill-khong-fallback>"; exit 2 ;;
esac
