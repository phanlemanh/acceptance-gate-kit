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
console.log('  (inputs judgment abs: '+(a.evals.find(e=>e.id==='E2').inputs||[]).join(',')+')');
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

*)
  echo "rang.sh --chan <args-du-truong|ref-hong>"; exit 2 ;;
esac
