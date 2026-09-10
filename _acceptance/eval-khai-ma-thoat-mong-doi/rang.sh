#!/usr/bin/env bash
# Răng hồ sơ eval-khai-ma-thoat-mong-doi — PHẦN MỘT + vá task-7a: bảy chân
# (mot-nguon · khai-sai · luat-ghim · l1-nhat-quan · lan-ghim · gioi-han-het ·
# ... gioi-han-het dựng SAU khi lỗ AC-10 ở acceptance-verify.js/repin-lane.mjs
# đã vá — xem task-7a-report.md).
# Sáu chân còn lại (s4-dat-gioi-han · known-limits · xung-dot-lenh · so-ky-vong ·
# tai-lieu · loi-dan-soan · dau-cuoi-that) do phiên khác dựng sau — ở đây chúng
# thoát khác 0 với thông điệp «chân chưa dựng», không im lặng thoát 0.
#
# Khuôn chép từ _acceptance/duong-lui-phai-song/rang.sh: set -uo pipefail;
# HERE/KIT suy từ vị trí script; ok/bad/done_chan; TMP có trap dọn; copy_tree;
# inject (thay nguyên văn ĐÚNG một lần, đếm và báo khi khác 1). Thêm inject_file
# (cùng ba đảm bảo với inject, nhưng before/after đọc từ TỆP thay vì argv — cho
# khối nhiều dòng có backtick/${...} mà truyền qua argv bash sẽ vỡ cú pháp).
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
KIT="$(cd "$HERE/../.." && pwd)"
HARNESS="$KIT/tests/workflows/harness.mjs"
WF="$KIT/feature-loop/workflows/acceptance-verify.js"
PASS=0; FAIL=0
ok()  { echo "  PASS: $1"; PASS=$((PASS+1)); }
bad() { echo "  DO: $1"; FAIL=$((FAIL+1)); }
done_chan() { echo "Results: chan ${CHAN} $( [ $FAIL -eq 0 ] && echo passed || echo FAILED ) (${PASS} pass, ${FAIL} do)"; [ $FAIL -eq 0 ] || exit 1; exit 0; }
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT

CHAN=""
while [ $# -gt 0 ]; do case "$1" in --chan) CHAN="$2"; shift 2;; *) echo "rang.sh: tham số lạ $1"; exit 3;; esac; done
[ -n "$CHAN" ] || { echo "rang.sh: thiếu --chan"; exit 3; }

has() { printf '%s\n' "$1" | grep -qF -- "$2"; }

# copy_tree → COPY: bản sao TRỌN cây kit (trừ .git/node_modules/.claude/_acceptance/docs).
copy_tree() {
  local d="$TMP/copy-$RANDOM"; mkdir -p "$d"
  rsync -a --exclude .git --exclude node_modules --exclude .claude --exclude _acceptance --exclude docs "$KIT/" "$d/"
  COPY="$d"
}
# inject <tên> <file tương đối trong COPY> <trước> <sau> — thay nguyên văn đúng 1 lần.
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
# inject_file <tên> <file tương đối> <tệp-trước> <tệp-sau> — CÙNG ba đảm bảo với
# inject(), nhưng before/after là NỘI DUNG TỆP (khối nhiều dòng an toàn qua heredoc
# 'EOF', không phải argv bash — tránh vỡ cú pháp trên backtick/${...} lồng nhau).
inject_file() {
  local name="$1" rel="$2" bf="$3" af="$4" f="$COPY/$2"
  COUNT=$(python3 - "$f" "$bf" "$af" <<'PY'
import sys
f,bf,af=sys.argv[1],sys.argv[2],sys.argv[3]
s=open(f,encoding='utf8').read()
b=open(bf,encoding='utf8').read(); a=open(af,encoding='utf8').read()
n=s.count(b)
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
# run_checks <tệp-out-của-node> — đọc dòng CHECK-OK:/CHECK-BAD: thành ok()/bad().
run_checks() {
  local out="$1"
  while IFS= read -r line; do
    case "$line" in
      CHECK-OK:*) ok "${line#CHECK-OK: }" ;;
      CHECK-BAD:*) bad "${line#CHECK-BAD: }" ;;
    esac
  done < "$out"
}

case "$CHAN" in

  # ── mot-nguon (AC-1) ───────────────────────────────────────────────────────
  # Ràng buộc tĩnh (bốn tệp tiêu thụ khớp 'expected_exit' đúng 0 lần, nguồn thật
  # lib/eval-yaml.cjs khớp >0) + chiều đỏ (mũi vào bản sao) + ma trận 16 ô
  # (4 bộ đọc tiêu thụ thật × 4 fixture code-sinh), tự đếm số ô.
  mot-nguon)
    for f in feature-loop/scripts/s4-args.mjs feature-loop/workflows/acceptance-verify.js \
             feature-loop/scripts/repin-lane.mjs lib/evidence-core.cjs; do
      n=$(grep -c 'expected_exit' "$KIT/$f" || true)
      if [ "$n" -eq 0 ]; then ok "cây lành: $f khớp 'expected_exit' đúng 0 lần"; else bad "loi doc thu sau: $f khop 'expected_exit' $n lan"; fi
    done
    n=$(grep -c 'expected_exit' "$KIT/lib/eval-yaml.cjs" || true)
    if [ "$n" -gt 0 ]; then ok "nguồn thật lib/eval-yaml.cjs khớp 'expected_exit' $n lần (>0, đúng vai MỘT nguồn)"; else bad "nguon that khong con khop 'expected_exit'"; fi

    copy_tree
    inject mot-nguon-tinh feature-loop/scripts/repin-lane.mjs \
      "const { parseEvals, expectedExits } = require_(path.join(agRoot, 'lib', 'eval-yaml.cjs'));" \
      "const { parseEvals, expectedExits } = require_(path.join(agRoot, 'lib', 'eval-yaml.cjs')); const expected_exit = 1;"
    n=$(grep -c 'expected_exit' "$COPY/feature-loop/scripts/repin-lane.mjs" || true)
    if [ "$n" -gt 0 ]; then ok "chiều đỏ ràng buộc tĩnh: mũi vào bản sao → bắt được lối đọc thứ sáu — loi doc thu sau: feature-loop/scripts/repin-lane.mjs khop 'expected_exit' $n lan"
    else bad "chiều đỏ KHÔNG chạy: mũi vào bản sao repin-lane.mjs mà đếm vẫn 0"; fi

    cat > "$TMP/mn-matrix.mjs" <<'MNEOF'
import path from 'node:path';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const KIT = process.argv[2];
const require_ = createRequire(import.meta.url);
const core = require_(path.join(KIT, 'lib', 'evidence-core.cjs'));
const fx = await import(path.join(KIT, '_acceptance', 'eval-khai-ma-thoat-mong-doi', 'fixture.mjs'));
const { mkRepo, writeEvalsDir, SHAPES } = fx;

let okc = 0, badc = 0;
function cell(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}

function runS4(shapeLine) {
  const { root } = mkRepo({
    config: { executors: { e1: 'exit 2', suite: 'exit 0' }, suiteKeys: ['executors.script.suite'] },
    evals: [{ id: 'E1', cmd: 'config:executors.script.e1', expectedExitLine: shapeLine }],
  });
  const r = spawnSync('node', ['feature-loop/scripts/s4-args.mjs', '--slug', 'fx', '--root', root, '--ag-root', KIT, '--round', '1', '--no-carry'],
    { cwd: KIT, encoding: 'utf8' });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}
const s4a = runS4(SHAPES.valid);
let s4aVal = null; try { s4aVal = JSON.parse(s4a.stdout).evals[0].expectedExit; } catch { /* stays null */ }
cell('s4-args × khai n hợp lệ → expectedExit=2', s4a.code === 0 && s4aVal === 2, `code=${s4a.code} val=${s4aVal}`);
const s4b = runS4(SHAPES.zero);
let s4bVal = null; try { s4bVal = JSON.parse(s4b.stdout).evals[0].expectedExit; } catch { /* stays null */ }
cell('s4-args × khai 0 tường minh → expectedExit=0', s4b.code === 0 && s4bVal === 0, `code=${s4b.code} val=${s4bVal}`);
const s4c = runS4(SHAPES.absent);
let s4cVal = null; try { s4cVal = JSON.parse(s4c.stdout).evals[0].expectedExit; } catch { /* stays null */ }
cell('s4-args × vắng trường → BẰNG HỆT khai 0 tường minh (expectedExit=0)', s4c.code === 0 && s4cVal === 0 && s4cVal === s4bVal, `code=${s4c.code} b=${s4bVal} c=${s4cVal}`);
const s4d = runS4(SHAPES.invalid);
cell('s4-args × khai sai luật → NỔ (exit 2, KHÔNG trả một số)', s4d.code === 2 && /sai luật/.test(s4d.stderr), `code=${s4d.code} err=${s4d.stderr.slice(-200)}`);

function runRepin(shapeLine, cmd) {
  const { root } = mkRepo({
    config: { executors: { e1: cmd, suite: 'exit 0' }, suiteKeys: ['executors.script.suite'] },
    evals: [{ id: 'E1', cmd: 'config:executors.script.e1', expectedExitLine: shapeLine }],
  });
  const r = spawnSync('node', ['feature-loop/scripts/repin-lane.mjs', '--root', root, '--slug', 'fx', '--ag-root', KIT],
    { cwd: KIT, encoding: 'utf8' });
  return { code: r.status, stdout: r.stdout || '', stderr: r.stderr || '' };
}
const rpa = runRepin(SHAPES.valid, 'exit 2');
let rpaJson = null; try { rpaJson = JSON.parse(rpa.stdout); } catch { /* stays null */ }
cell('repin-lane × khai n hợp lệ → evals_exit giữ mã thật, gọi tên "đạt-có-giới-hạn"',
  rpa.code === 0 && rpaJson && rpaJson.slugs.fx.evals_exit.E1 === 2 && /đạt-có-giới-hạn: E1=2/.test(rpaJson.slugs.fx.section),
  `code=${rpa.code}`);
const rpb = runRepin(SHAPES.zero, 'exit 0');
let rpbJson = null; try { rpbJson = JSON.parse(rpb.stdout); } catch { /* stays null */ }
const rpbHasLimit = !!(rpbJson && /đạt-có-giới-hạn/.test(rpbJson.slugs.fx.section));
cell('repin-lane × khai 0 tường minh → evals_exit=0, KHÔNG "đạt-có-giới-hạn"',
  rpb.code === 0 && rpbJson && rpbJson.slugs.fx.evals_exit.E1 === 0 && !rpbHasLimit, `code=${rpb.code}`);
const rpc = runRepin(SHAPES.absent, 'exit 0');
let rpcJson = null; try { rpcJson = JSON.parse(rpc.stdout); } catch { /* stays null */ }
const rpcHasLimit = !!(rpcJson && /đạt-có-giới-hạn/.test(rpcJson.slugs.fx.section));
cell('repin-lane × vắng trường → BẰNG HỆT khai 0 tường minh (evals_exit=0, không "đạt-có-giới-hạn")',
  rpc.code === 0 && rpcJson && rpcJson.slugs.fx.evals_exit.E1 === 0 && rpcHasLimit === rpbHasLimit,
  `code=${rpc.code} b=${rpbHasLimit} c=${rpcHasLimit}`);
const rpd = runRepin(SHAPES.invalid, 'exit 2');
cell('repin-lane × khai sai luật → NỔ (exit 2, KHÔNG trả một số)', rpd.code === 2 && /sai luật/.test(rpd.stderr), `code=${rpd.code} err=${rpd.stderr.slice(-200)}`);

function evalsTxt(shapeLine) {
  return 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: x\n' + (shapeLine === undefined ? '' : `    expected_exit: ${shapeLine}\n`);
}
const creA = core.checkRepinEvals({ run_id: 'r', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsTxt(SHAPES.valid), 'fx', '- eval: E1\n  exit_code: 2\n');
cell('checkRepinEvals × khai n hợp lệ → NHẬN (0 lỗi)', creA.errs.length === 0, JSON.stringify(creA.errs));
const creB = core.checkRepinEvals({ run_id: 'r', sha: 'a'.repeat(40), evals_exit: { E1: 0 } }, evalsTxt(SHAPES.zero), 'fx', '');
cell('checkRepinEvals × khai 0 tường minh → NHẬN (0 lỗi)', creB.errs.length === 0, JSON.stringify(creB.errs));
const creC = core.checkRepinEvals({ run_id: 'r', sha: 'a'.repeat(40), evals_exit: { E1: 0 } }, evalsTxt(SHAPES.absent), 'fx', '');
cell('checkRepinEvals × vắng trường → BẰNG HỆT khai 0 tường minh (0 lỗi)', creC.errs.length === 0 && creC.errs.length === creB.errs.length, JSON.stringify(creC.errs));
const creD = core.checkRepinEvals({ run_id: 'r', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsTxt(SHAPES.invalid), 'fx', '- eval: E1\n  exit_code: 2\n');
cell('checkRepinEvals × khai sai luật → NỔ (errs>0, KHÔNG trả một số)', creD.errs.length > 0, JSON.stringify(creD.errs));

function mkPayload(code) {
  return ['---', 'schema_version: 2', 'feature_slug: fx', 'verdict: PASS', '---', '', '# Evidence Report: fx', '', '## Evidence', '',
    '- eval: E1', '  run_id: fx-E1-001', `  exit_code: ${code}`, '  verifier: config:e', '  verified_at: 2026-09-09T00:00:00Z', ''].join('\n');
}
const dirA = writeEvalsDir([{ id: 'E1', executor: 'script', cmd: 'x', expectedExitLine: SHAPES.valid }]);
const eeA = core.evaluateEvidence(mkPayload(2), { fileDir: dirA });
cell('evaluateEvidence × khai n hợp lệ → KHÔNG vi phạm', eeA.consistencyFailure === null, String(eeA.consistencyFailure));
const dirB = writeEvalsDir([{ id: 'E1', executor: 'script', cmd: 'x', expectedExitLine: SHAPES.zero }]);
const eeB = core.evaluateEvidence(mkPayload(0), { fileDir: dirB });
cell('evaluateEvidence × khai 0 tường minh → KHÔNG vi phạm', eeB.consistencyFailure === null, String(eeB.consistencyFailure));
const dirC = writeEvalsDir([{ id: 'E1', executor: 'script', cmd: 'x', expectedExitLine: SHAPES.absent }]);
const eeC = core.evaluateEvidence(mkPayload(0), { fileDir: dirC });
cell('evaluateEvidence × vắng trường → BẰNG HỆT khai 0 tường minh (KHÔNG vi phạm)', eeC.consistencyFailure === null && eeC.consistencyFailure === eeB.consistencyFailure, String(eeC.consistencyFailure));
const dirD = writeEvalsDir([{ id: 'E1', executor: 'script', cmd: 'x', expectedExitLine: SHAPES.invalid }]);
const eeD = core.evaluateEvidence(mkPayload(2), { fileDir: dirD });
cell('evaluateEvidence × khai sai luật → NỔ (vi phạm, KHÔNG trả một số)', eeD.consistencyFailure !== null, String(eeD.consistencyFailure));

console.log(`CHECK-INFO: tong o = ${okc + badc}`);
if (okc + badc !== 16) console.log(`CHECK-BAD: so o lech: ${okc + badc} (can 16)`);
process.exit(badc > 0 || (okc + badc) !== 16 ? 1 : 0);
MNEOF
    node "$TMP/mn-matrix.mjs" "$KIT" > "$TMP/mn-matrix.out" 2>&1
    RC=$?
    cat "$TMP/mn-matrix.out"
    run_checks "$TMP/mn-matrix.out"
    [ "$RC" -eq 0 ] || bad "mot-nguon: mn-matrix.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── khai-sai (AC-2) ────────────────────────────────────────────────────────
  khai-sai)
    copy_tree
    inject khai-sai-e lib/eval-yaml.cjs \
      "if (raw === '' || (/^\d+\$/.test(raw) && Number(raw) === 0)) { byId.set(id, 0); continue; }" \
      "if (raw === '') { byId.set(id, 0); continue; }"
    COPY_E="$COPY/lib/eval-yaml.cjs"

    copy_tree
    cat > "$TMP/hatang-before.txt" <<'EOF'
    if (EXPECTED_EXIT_BANNED.includes(n)) {
      errs.push(`eval ${id}: expected_exit ${n} là mã hạ tầng (${EXPECTED_EXIT_BANNED.join(', ')}) — không khai được; hạ tầng hỏng đi đường cannotRun, không đi đường giới hạn đã khai`);
      byId.set(id, 0); continue;
    }
EOF
    cat > "$TMP/hatang-after.txt" <<'EOF'
    if (EXPECTED_EXIT_BANNED.includes(n)) {
      byId.set(id, n); continue;
    }
EOF
    inject_file khai-sai-hatang lib/eval-yaml.cjs "$TMP/hatang-before.txt" "$TMP/hatang-after.txt"
    COPY_H="$COPY/lib/eval-yaml.cjs"

    cat > "$TMP/khai-sai-check.mjs" <<'KSEOF'
import path from 'node:path';
import { createRequire } from 'node:module';

const [, , KIT, COPY_E, COPY_H] = process.argv;
const require_ = createRequire(import.meta.url);
const healthy = require_(path.join(KIT, 'lib', 'eval-yaml.cjs'));
const mutantE = require_(COPY_E);
const mutantH = require_(COPY_H);

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
function yaml(executor, line) {
  return `evals:\n  - id: E1\n    criterion: AC-1\n    executor: ${executor}\n    cmd: x\n` + (line === undefined ? '' : `    expected_exit: ${line}\n`);
}
const silent0 = (r) => r.byId.get('E1') === 0 && r.errs.length === 0;

// (a) không phải số nguyên 0-255.
for (const raw of ['hai', '-1', '256', '2.5']) {
  const r = healthy.expectedExits(yaml('script', raw));
  check(`(a) "${raw}" không phải số nguyên 0-255 → lỗi gọi tên eval, KHÔNG rơi thầm về 0`,
    r.errs.length > 0 && r.errs[0].includes('E1') && !silent0(r), JSON.stringify(r));
}
// (b) mã hạ tầng 97 và 127.
for (const raw of ['97', '127']) {
  const r = healthy.expectedExits(yaml('script', raw));
  check(`(b) mã hạ tầng ${raw} → lỗi nêu "mã hạ tầng" + tên eval, KHÔNG rơi thầm về 0`,
    r.errs.length > 0 && r.errs[0].includes('mã hạ tầng') && r.errs[0].includes('E1') && !silent0(r), JSON.stringify(r));
}
// (c) executor judgment và ui-check khai expected_exit khác 0.
for (const ex of ['judgment', 'ui-check']) {
  const r = healthy.expectedExits(yaml(ex, '2'));
  check(`(c) executor "${ex}" khai expected_exit → lỗi nêu tên executor + tên eval, KHÔNG rơi thầm về 0`,
    r.errs.length > 0 && r.errs[0].includes(ex) && r.errs[0].includes('E1') && !silent0(r), JSON.stringify(r));
}
// (d) đối chứng dương: expected_exit hợp lệ.
{
  const r = healthy.expectedExits(yaml('script', '2'));
  check('(d) đối chứng dương: expected_exit: 2 hợp lệ → không lỗi nào', r.errs.length === 0 && r.byId.get('E1') === 2, JSON.stringify(r));
}
// (e) đối chứng dương: expected_exit: 0 tường minh → không lỗi, không tính là giới hạn đã khai.
{
  const r = healthy.expectedExits(yaml('script', '0'));
  check('(e) đối chứng dương: expected_exit: 0 tường minh → không lỗi, byId=0 (không phải giới hạn)', r.errs.length === 0 && r.byId.get('E1') === 0, JSON.stringify(r));
}

// Chiều đỏ (b): bản sao đổi errs.push của nhánh mã hạ tầng thành byId.set(id, n) → rơi thầm.
{
  const r = mutantH.expectedExits(yaml('script', '97'));
  check('CHIỀU ĐỎ (b): mutant (byId.set(id,n) thay errs.push) mã hạ tầng 97 → rơi thầm về 0 (errs rỗng, không còn báo lỗi)',
    r.errs.length === 0, JSON.stringify(r));
}

// Chiều đỏ (e): bản sao coi "có trường" (kể cả giá trị 0) là đã-khai → executor
// không hợp lệ + expected_exit: 0 giờ CŨNG bị kiểm executor (lẽ ra 0 là không-khai).
{
  const rHealthy = healthy.expectedExits(yaml('judgment', '0'));
  const rMutant = mutantE.expectedExits(yaml('judgment', '0'));
  check('CHIỀU ĐỎ (e): cây lành — judgment + expected_exit:0 tường minh KHÔNG lỗi (0 không phải giới hạn)', rHealthy.errs.length === 0, JSON.stringify(rHealthy));
  check('CHIỀU ĐỎ (e): mutant (bỏ nhánh tắt "khai 0 tường minh") — khai 0 bị tính là giới hạn, executor judgment giờ bị kiểm và NỔ',
    rMutant.errs.length > 0 && rMutant.errs[0].includes('judgment'), JSON.stringify(rMutant));
}

process.exit(badc > 0 ? 1 : 0);
KSEOF
    node "$TMP/khai-sai-check.mjs" "$KIT" "$COPY_E" "$COPY_H" > "$TMP/khai-sai.out" 2>&1
    RC=$?
    cat "$TMP/khai-sai.out"
    run_checks "$TMP/khai-sai.out"
    [ "$RC" -eq 0 ] || bad "khai-sai: khai-sai-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    # (e)-thật: eval khai expected_exit:0 tường minh chạy qua CHÍNH acceptance-verify.js
    # (harness thật) → không dòng Known limits/"đạt-có-giới-hạn"/"GIOI HAN DA KHAI KHONG CON"
    # nào — hồ sơ vẫn xanh-sạch được (không bị tính là giới hạn đã khai).
    cat > "$TMP/khai-sai-s4.mjs" <<'KS4EOF'
import path from 'node:path';
const [, , KIT] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const args = {
  slug: 'fx', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 0 }],
  suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
};
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'ok', runId: '', cannotRun: false };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
  throw new Error('unexpected ' + l);
};
const { result, calls } = await runWorkflow(WF, args, responder);
const p = calls.find(c => c.label === 'synthesize:report').prompt;
const ok1 = result.verdict === 'PASS';
const ok2 = !/KNOWN LIMITS —/.test(p) && !/GIOI HAN DA KHAI KHONG CON/.test(p) && !/dat-co-gioi-han/i.test(p);
if (ok1 && ok2) console.log('CHECK-OK: (e)-thật qua S4: expected_exit:0 tường minh + exit 0 → PASS, KHÔNG dòng Known limits/gọi tên giới hạn nào');
else console.log(`CHECK-BAD: (e)-thật qua S4 -- verdict=${result.verdict} klMarker=${/KNOWN LIMITS —/.test(p)} ghkMarker=${/GIOI HAN DA KHAI KHONG CON/.test(p)}`);
process.exit(ok1 && ok2 ? 0 : 1);
KS4EOF
    node "$TMP/khai-sai-s4.mjs" "$KIT" > "$TMP/khai-sai-s4.out" 2>&1
    RC=$?
    cat "$TMP/khai-sai-s4.out"
    run_checks "$TMP/khai-sai-s4.out"
    [ "$RC" -eq 0 ] || bad "khai-sai: khai-sai-s4.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── luat-ghim (AC-8) ───────────────────────────────────────────────────────
  # Luật hai vế của checkRepinEvals, đo trên BÁO CÁO THẬT (round-trip rút từ
  # prompt của chính acceptance-verify.js qua tests/workflows/harness.mjs).
  luat-ghim)
    copy_tree
    cat > "$TMP/luat-before.txt" <<'EOF'
    if (signed == null) {
      red.push(`${i}=${JSON.stringify(got)} (không đọc được báo cáo đã ký để đối chiếu — vế hai của luật không kiểm được)`);
      continue;
    }
    if (signed.get(i) !== want) {
      red.push(`${i}=${JSON.stringify(got)} (tiền đề vừa mất: báo cáo đã ký ghi ${signed.has(i) ? signed.get(i) : 'không ghi mã nào'}, làn nay trả ${got} — một mã khác 0 MỚI xuất hiện chưa ai ký nhận)`);
    }
EOF
    cat > "$TMP/luat-after.txt" <<'EOF'
    if (signed == null) {
      red.push(`${i}=${JSON.stringify(got)} (không đọc được báo cáo đã ký để đối chiếu — vế hai của luật không kiểm được)`);
      continue;
    }
EOF
    inject_file luat-ghim-signed lib/evidence-core.cjs "$TMP/luat-before.txt" "$TMP/luat-after.txt"
    COPY_CORE="$COPY/lib/evidence-core.cjs"

    cat > "$TMP/luat-ghim-check.mjs" <<'LGEOF'
import path from 'node:path';
import { createRequire } from 'node:module';

const [, , KIT, COPY_CORE] = process.argv;
const require_ = createRequire(import.meta.url);
const coreHealthy = require_(path.join(KIT, 'lib', 'evidence-core.cjs'));
const coreMutant = require_(COPY_CORE);
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const { buildReportFromPrompt } = await import(path.join(KIT, '_acceptance', 'eval-khai-ma-thoat-mong-doi', 'fixture.mjs'));
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
function baseArgs() {
  return {
    slug: 'fx', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
  };
}
function responder(exitCode) {
  return (call) => {
    const l = call.label;
    if (l.startsWith('machine:')) return { exitCode, outputTail: 'ok', runId: '', cannotRun: false };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
    throw new Error('unexpected ' + l);
  };
}
async function realReport(exitCode, opts) {
  const { calls } = await runWorkflow(WF, baseArgs(), responder(exitCode));
  const synth = calls.find(c => c.label === 'synthesize:report');
  return buildReportFromPrompt(synth.prompt, { slug: 'fx', ...opts });
}
const evalsDeclared2 = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: x\n    expected_exit: 2\n';
const evalsAbsent = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: script\n    cmd: x\n';

// (a) khai 2 + báo cáo thật ghi 2 (round-trip) + làn trả 2 → NHẬN, không lỗi nào.
const repA = await realReport(2);
{
  const r = coreHealthy.checkRepinEvals({ run_id: 'r1', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsDeclared2, 'fx', repA.text);
  check('(a) khai 2 + báo cáo thật ghi 2 + làn trả 2 → NHẬN, 0 lỗi', r.errs.length === 0, JSON.stringify(r.errs));
}
// (b) khai 2 + báo cáo ghi 0 (round-trip: lượt chạy trước xanh sạch) + làn trả 2 → ĐỎ "tiền đề".
const repB0 = await realReport(0);
{
  const r = coreHealthy.checkRepinEvals({ run_id: 'r1', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsDeclared2, 'fx', repB0.text);
  check('(b) khai 2 + báo cáo (thật) ghi 0 + làn trả 2 → ĐỎ, chứa "tiền đề"', r.errs.length > 0 && r.errs[0].includes('tiền đề'), JSON.stringify(r.errs));
}
// (c) KHÔNG khai + báo cáo ghi 2 (round-trip, tái dùng repA) + làn trả 2 → ĐỎ "chưa khai".
{
  const r = coreHealthy.checkRepinEvals({ run_id: 'r1', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsAbsent, 'fx', repA.text);
  check('(c) KHÔNG khai + báo cáo (thật) ghi 2 + làn trả 2 → ĐỎ, chứa "chưa khai"', r.errs.length > 0 && r.errs[0].includes('chưa khai'), JSON.stringify(r.errs));
}

// Chiều đỏ của chính lưới round-trip: writer đổi tên trường (exit_status thay
// exit_code) mà reader (EXIT_LINE_RE) không đổi → checkRepinEvals không còn đọc
// được mã đã ký, đọc thành "không ghi mã nào" → tiền đề vừa mất SAI (thực ra
// writer chỉ đổi tên trường, không đổi mã) — writer trôi khỏi reader.
const repDrift = await realReport(2, { fieldName: 'exit_status' });
{
  const r = coreHealthy.checkRepinEvals({ run_id: 'r1', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsDeclared2, 'fx', repDrift.text);
  check('CHIỀU ĐỎ round-trip: writer đổi tên trường (exit_status) mà reader không đổi → writer trôi khỏi reader (đọc nhầm thành tiền đề mất)',
    r.errs.length > 0 && r.errs[0].includes('tiền đề'), JSON.stringify(r.errs));
}

// Chiều đỏ bảng: bỏ nhánh đối chiếu signed.get(i) trong checkRepinEvals → ca (b) im re (fail-open).
{
  const r = coreMutant.checkRepinEvals({ run_id: 'r1', sha: 'a'.repeat(40), evals_exit: { E1: 2 } }, evalsDeclared2, 'fx', repB0.text);
  check('CHIỀU ĐỎ bảng: mutant (bỏ nhánh signed.get(i)) — ca (b) không còn NỔ (fail-open, "tiền đề" biến mất)',
    r.errs.length === 0, JSON.stringify(r.errs));
}

process.exit(badc > 0 ? 1 : 0);
LGEOF
    node "$TMP/luat-ghim-check.mjs" "$KIT" "$COPY_CORE" > "$TMP/luat-ghim.out" 2>&1
    RC=$?
    cat "$TMP/luat-ghim.out"
    run_checks "$TMP/luat-ghim.out"
    [ "$RC" -eq 0 ] || bad "luat-ghim: luat-ghim-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── l1-nhat-quan (AC-9) ────────────────────────────────────────────────────
  l1-nhat-quan)
    copy_tree
    sed -n '608,634p' "$KIT/lib/evidence-core.cjs" > "$TMP/l1-before.txt"
    cat > "$TMP/l1-after.txt" <<'EOF'
  const { byEval: blockExits } = walkEvalExits(payload);
  const NONZERO_EXIT_RE = /(?:exit_code|verifier_exit_code|exit)\s*[:=]\s*(-?[1-9]\d*)\b/i;
  let consistencyFailure = null;
  if (NONZERO_EXIT_RE.test(payload)) {
    consistencyFailure = 'PASS report contains a failed eval (exit_code != 0) — the verdict must be REJECT';
  } else if (FAILED_JUDGMENT_RE.test(payload)) {
    consistencyFailure = 'PASS report contains a failed judgment (verdict: FAIL) — the verdict must be REJECT';
  }
EOF
    inject_file l1-nhat-quan lib/evidence-core.cjs "$TMP/l1-before.txt" "$TMP/l1-after.txt"
    COPY_CORE="$COPY/lib/evidence-core.cjs"

    cat > "$TMP/l1-check.mjs" <<'L1EOF'
import path from 'node:path';
import { createRequire } from 'node:module';

const [, , KIT, COPY_CORE] = process.argv;
const require_ = createRequire(import.meta.url);
const coreHealthy = require_(path.join(KIT, 'lib', 'evidence-core.cjs'));
const coreMutant = require_(COPY_CORE);
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const { buildReportFromPrompt, writeEvalsDir } = await import(path.join(KIT, '_acceptance', 'eval-khai-ma-thoat-mong-doi', 'fixture.mjs'));
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
function baseArgs() {
  return {
    slug: 'fx', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
  };
}
function responder(exitCode) {
  return (call) => {
    const l = call.label;
    if (l.startsWith('machine:')) return { exitCode, outputTail: 'ok', runId: '', cannotRun: false };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
    throw new Error('unexpected ' + l);
  };
}
async function realReport(exitCode) {
  const { calls } = await runWorkflow(WF, baseArgs(), responder(exitCode));
  const synth = calls.find(c => c.label === 'synthesize:report');
  return buildReportFromPrompt(synth.prompt, { slug: 'fx' });
}

// (a) mã khác 0 TRONG khối của eval đã khai đúng mã (round-trip thật) → KHÔNG vi phạm.
const repA = await realReport(2);
const dirDeclared2 = writeEvalsDir([{ id: 'E1', executor: 'script', cmd: 'x', expectedExitLine: '2' }]);
const resA = coreHealthy.evaluateEvidence(repA.text, { fileDir: dirDeclared2 });
check('(a) exit trong khối = mã đã khai (đạt-có-giới-hạn) → KHÔNG vi phạm — đối chứng dương', resA.consistencyFailure === null, String(resA.consistencyFailure));

// (b) CÙNG báo cáo thật, đổi mã trong khối sang 3 → vi phạm, nêu tên eval.
if (!repA.text.includes('  exit_code: 2')) throw new Error('l1-check: bao cao thieu dong exit_code: 2 (mau khong khop)');
const repB = repA.text.replace('  exit_code: 2', '  exit_code: 3');
const resB = coreHealthy.evaluateEvidence(repB, { fileDir: dirDeclared2 });
check('(b) mã lệch (3 thay 2) trong khối → vi phạm, nêu tên eval E1', resB.consistencyFailure !== null && resB.consistencyFailure.includes('E1'), String(resB.consistencyFailure));

// (c) mã khác 0 NẰM NGOÀI mọi khối eval.
const repC = repA.text.replace('## Evidence', 'exit_code: 9\n\n## Evidence');
const resC = coreHealthy.evaluateEvidence(repC, { fileDir: dirDeclared2 });
check('(c) mã ngoài mọi khối eval → vi phạm "ngoài mọi khối eval"', resC.consistencyFailure !== null && resC.consistencyFailure.includes('ngoài mọi khối eval'), String(resC.consistencyFailure));

// (d) mã khác 0 trong khối của eval KHÔNG khai.
const dirAbsent = writeEvalsDir([{ id: 'E1', executor: 'script', cmd: 'x' }]);
const resD = coreHealthy.evaluateEvidence(repA.text, { fileDir: dirAbsent });
check('(d) mã trong khối của eval KHÔNG khai → vi phạm, nêu tên eval E1', resD.consistencyFailure !== null && resD.consistencyFailure.includes('E1'), String(resD.consistencyFailure));

check('số assert = số hình dạng (4)', (okc + badc) === 4, String(okc + badc));

// Chứng thêm: báo cáo mà MỌI eval máy đều khai mã khác 0 vẫn thoả hình dạng L1
// (không đòi một dòng exit_code:0 không thể tồn tại) — HAS_EXIT_ZERO chấp nhận
// một mã khác 0 KHỚP đúng giới hạn đã khai.
{
  const missing = coreHealthy.evaluateEvidence(repA.text, { fileDir: dirDeclared2 }).missing;
  if (!missing.includes('exit_code: 0')) console.log('CHECK-OK: chứng thêm — báo cáo toàn eval đạt-có-giới-hạn vẫn thoả hình dạng L1 (không đòi exit_code:0)');
  else console.log('CHECK-BAD: chứng thêm -- vẫn đòi exit_code:0 dù toàn eval đạt-có-giới-hạn: ' + JSON.stringify(missing));
}

// Chiều đỏ: mutant (quét trọn chuỗi NONZERO_EXIT_RE.test(payload)) làm ca (a) —
// vốn XANH, một giới hạn đã khai hợp lệ — hoá bị flag sai; đồng thời KHÔNG còn
// khả năng nói "ngoài mọi khối eval" (c) hay gọi tên eval (b)/(d) vì quét trọn
// chuỗi không biết khối nào, eval nào.
const resAmut = coreMutant.evaluateEvidence(repA.text, { fileDir: dirDeclared2 });
if (resAmut.consistencyFailure !== null) { console.log('CHECK-OK: CHIỀU ĐỎ l1-nhat-quan: mutant (NONZERO_EXIT_RE.test trọn chuỗi) làm ca (a) hoá vi phạm sai (mất "ngoài mọi khối eval" cho (c), mất tên eval cho (b)/(d))'); okc++; }
else { console.log('CHECK-BAD: CHIỀU ĐỎ KHÔNG chạy -- mutant vẫn null trên ca (a)'); badc++; }

process.exit(badc > 0 ? 1 : 0);
L1EOF
    node "$TMP/l1-check.mjs" "$KIT" "$COPY_CORE" > "$TMP/l1.out" 2>&1
    RC=$?
    cat "$TMP/l1.out"
    run_checks "$TMP/l1.out"
    [ "$RC" -eq 0 ] || bad "l1-nhat-quan: l1-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── lan-ghim (AC-7) ────────────────────────────────────────────────────────
  # Làn ghim lại chấm theo kỳ vọng — CẢ nhánh ghi thật (--write) lẫn nhánh đỏ
  # (lệnh trả mã lệch → KHÔNG ghi gì, so byte trước/sau).
  lan-ghim)
    node "$HERE/fixture.mjs" mkRepo '{"config":{"executors":{"e1":"exit 2","suite":"exit 0"},"suiteKeys":["executors.script.suite"]},"evals":[{"id":"E1","cmd":"config:executors.script.e1","expectedExitLine":"2"}],"evidence":{"evalBlocks":[{"id":"E1","exitCode":2,"verifier":"config:executors.script.e1","runId":"fx-E1-001"}]},"runLogLines":[{"run_id":"fx-E1-001","evalId":"E1","exit_code":2,"cmd":"exit 2"}]}' > "$TMP/fx-green.txt"
    FX_GREEN="$(sed -n '1p' "$TMP/fx-green.txt")"
    cp "$FX_GREEN/_acceptance/fx/run-log.jsonl" "$TMP/rl-before.jsonl"
    cp "$FX_GREEN/_acceptance/fx/evidence-report.md" "$TMP/ev-before.md"
    OUT_W=$(node "$KIT/feature-loop/scripts/repin-lane.mjs" --root "$FX_GREEN" --slug fx --ag-root "$KIT" --write 2>&1); RC_W=$?
    if [ "$RC_W" -eq 0 ] && has "$OUT_W" "recheck-evidence xanh"; then ok "đối chứng dương: --write đi TRỌN nhánh ghi thật rồi TỰ KIỂM XANH bằng recheck-evidence.cjs"
    else bad "--write không xanh (rc=$RC_W): $(printf '%s\n' "$OUT_W" | tail -5 | tr '\n' ' ')"; fi
    if grep -q '"evals_exit":{"E1":2}' "$FX_GREEN/_acceptance/fx/run-log.jsonl"; then ok "run-log dòng kind:repin giữ MÃ THẬT 2 trong evals_exit (không quy về 0)"
    else bad "run-log KHÔNG giữ mã thật 2: $(tail -1 "$FX_GREEN/_acceptance/fx/run-log.jsonl")"; fi
    SECTION="$(tail -5 "$FX_GREEN/_acceptance/fx/evidence-report.md")"
    if has "$SECTION" "đạt-có-giới-hạn: E1=2"; then ok "dòng chữ mục Re-pin gọi tên eval đạt-có-giới-hạn (E1=2), đếm từ mã thật"
    else bad "dòng chữ mục Re-pin KHÔNG gọi tên eval — nghi 'đếm từ độ dài mảng': $SECTION"; fi

    # Chiều đỏ (bảng): khuôn cũ lấy số từ s.evals.length, mất gọi tên.
    copy_tree
    inject lan-ghim-cu feature-loop/scripts/repin-lane.mjs \
      'evals: ${dat}/${s.evals.length} eval máy đạt kỳ vọng${veGioiHan}${veHet}\n`;' \
      'evals: ${s.evals.length}/${s.evals.length} eval máy đạt kỳ vọng\n`;'
    node "$HERE/fixture.mjs" mkRepo '{"config":{"executors":{"e1":"exit 2","suite":"exit 0"},"suiteKeys":["executors.script.suite"]},"evals":[{"id":"E1","cmd":"config:executors.script.e1","expectedExitLine":"2"}],"evidence":{"evalBlocks":[{"id":"E1","exitCode":2,"verifier":"config:executors.script.e1","runId":"fx-E1-001"}]},"runLogLines":[{"run_id":"fx-E1-001","evalId":"E1","exit_code":2,"cmd":"exit 2"}]}' > "$TMP/fx-mut.txt"
    FX_MUT="$(sed -n '1p' "$TMP/fx-mut.txt")"
    node "$COPY/feature-loop/scripts/repin-lane.mjs" --root "$FX_MUT" --slug fx --ag-root "$KIT" > "$TMP/mut.json" 2>"$TMP/mut.err"
    MUT_SECTION="$(node -e 'const o=require("'"$TMP"'/mut.json"); process.stdout.write(o.slugs.fx.section)' 2>/dev/null || true)"
    if [ -n "$MUT_SECTION" ] && ! has "$MUT_SECTION" "đạt-có-giới-hạn"; then ok "chiều đỏ: khuôn cũ (đếm từ độ dài mảng) làm mất gọi tên đạt-có-giới-hạn — đếm từ độ dài mảng"
    else bad "chiều đỏ KHÔNG chạy: mutant vẫn gọi tên đạt-có-giới-hạn — $MUT_SECTION"; fi

    # Chiều đỏ (thêm): cùng hồ sơ xanh, đổi lệnh sang trả 1 (lệch mã đã khai) → làn ĐỎ, KHÔNG ghi gì.
    node "$HERE/fixture.mjs" mkRepo '{"config":{"executors":{"e1":"exit 1","suite":"exit 0"},"suiteKeys":["executors.script.suite"]},"evals":[{"id":"E1","cmd":"config:executors.script.e1","expectedExitLine":"2"}],"evidence":{"evalBlocks":[{"id":"E1","exitCode":2,"verifier":"config:executors.script.e1","runId":"fx-E1-001"}]},"runLogLines":[{"run_id":"fx-E1-001","evalId":"E1","exit_code":2,"cmd":"exit 2"}]}' > "$TMP/fx-red.txt"
    FX_RED="$(sed -n '1p' "$TMP/fx-red.txt")"
    H1RL="$(md5 -q "$FX_RED/_acceptance/fx/run-log.jsonl" 2>/dev/null || md5sum "$FX_RED/_acceptance/fx/run-log.jsonl" | cut -d' ' -f1)"
    H1EV="$(md5 -q "$FX_RED/_acceptance/fx/evidence-report.md" 2>/dev/null || md5sum "$FX_RED/_acceptance/fx/evidence-report.md" | cut -d' ' -f1)"
    OUT_R=$(node "$KIT/feature-loop/scripts/repin-lane.mjs" --root "$FX_RED" --slug fx --ag-root "$KIT" --write 2>&1); RC_R=$?
    H2RL="$(md5 -q "$FX_RED/_acceptance/fx/run-log.jsonl" 2>/dev/null || md5sum "$FX_RED/_acceptance/fx/run-log.jsonl" | cut -d' ' -f1)"
    H2EV="$(md5 -q "$FX_RED/_acceptance/fx/evidence-report.md" 2>/dev/null || md5sum "$FX_RED/_acceptance/fx/evidence-report.md" | cut -d' ' -f1)"
    if [ "$RC_R" -eq 1 ] && has "$OUT_R" "LÀN ĐỎ" && [ "$H1RL" = "$H2RL" ] && [ "$H1EV" = "$H2EV" ]; then
      ok "chiều đỏ: cùng hồ sơ, lệnh trả 1 (lệch mã khai 2) → làn ĐỎ (exit 1), run-log VÀ evidence-report còn NGUYÊN BYTE"
    else bad "chiều đỏ KHÔNG đúng: rc=$RC_R rl_equal=$([ "$H1RL" = "$H2RL" ] && echo y || echo n) ev_equal=$([ "$H1EV" = "$H2EV" ] && echo y || echo n) — $(printf '%s\n' "$OUT_R" | tail -3 | tr '\n' ' ')"; fi
    ;;

  # ── gioi-han-het (AC-10) — một cải thiện KHÔNG bị phạt, và KHÔNG được IM ────
  # Lỗ đã vá (task-7a): acceptance-verify.js dòng ~1010 nay có isHetHan loại
  # trừ đúng định nghĩa của repin-lane.mjs (expected khác 0 VÀ exit thật = 0).
  # Chân đo TRÊN HARNESS THẬT (tests/workflows/harness.mjs), hai chiều trên
  # CÙNG fixture (giới hạn hết → ĐẠT + được NÊU RA; mã lệch → vẫn REJECT), rồi
  # hai mũi tiêm — một ở acceptance-verify.js (khối lời dặn), một ở
  # repin-lane.mjs (định nghĩa hetHan) — mỗi mũi đòi ĐỎ với chuỗi ghim riêng.
  gioi-han-het)
    cat > "$TMP/ghh-check.mjs" <<'GHHEOF'
import path from 'node:path';
const [, , KIT, WF_PATH, EXPECT_SILENT] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const expectSilent = EXPECT_SILENT === '1';

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
function baseArgs() {
  return {
    slug: 'fx', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
  };
}
function responder(exitCode) {
  return (call) => {
    const l = call.label;
    if (l.startsWith('machine:')) return { exitCode, outputTail: exitCode === 0 ? 'ok' : 'boom', runId: '', cannotRun: false };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
    throw new Error('unexpected ' + l);
  };
}

// Chieu 1: eval khai expectedExit=2, lan chay tra 0 — gioi han da khai KHONG
// CON, mot cai thien. AC-10: KHONG duoc phat (failedEvals rong, verdict khac
// REJECT) VA KHONG duoc IM (loi dan soan bao cao van phai neu ten eval).
const { result: rHet, calls: callsHet } = await runWorkflow(WF_PATH, baseArgs(), responder(0));
check('gioi han het -> failedEvals RONG (khong phat mot cai thien)', (rHet.failedEvals || []).length === 0, JSON.stringify(rHet.failedEvals));
check('gioi han het -> verdict KHONG phai REJECT', rHet.verdict !== 'REJECT', rHet.verdict);
const synthHet = callsHet.find(c => c.label === 'synthesize:report');
const pHet = synthHet ? synthHet.prompt : '';
const hasBlock = /GIOI HAN DA KHAI KHONG CON/.test(pHet) && pHet.includes('E1') && pHet.includes('AC-1');
if (expectSilent) {
  check('MUTANT (i) -- giới hạn hết mà im: loi dan soan bao cao KHONG CON goi ten gioi han da khai khong con', !hasBlock, pHet.slice(0, 200));
} else {
  check('doi chung duong: loi dan soan bao cao MANG khoi GIOI HAN DA KHAI KHONG CON, goi ten eval E1/AC-1', hasBlock, pHet.slice(0, 200));
}

// Chieu 2 (doi chung tren CUNG fixture): ma LECH — khac 0 VA khac ky vong da
// khai (2) — day KHONG phai gioi han da khai khong con, van la mot luot truot
// that: phai o trong failedEvals va verdict REJECT (o CA hai ban, mutant (i)
// khong dung toi nhanh nay nen phai giu nguyen — luoi chan hoi quy).
const { result: rLech } = await runWorkflow(WF_PATH, baseArgs(), responder(1));
check('ma lech (1, khac 0 va khac ky vong 2) -> co trong failedEvals', (rLech.failedEvals || []).includes('E1'), JSON.stringify(rLech.failedEvals));
check('ma lech -> verdict REJECT', rLech.verdict === 'REJECT', rLech.verdict);

process.exit(badc > 0 ? 1 : 0);
GHHEOF

    # ── Bản lành: chạy trên CHÍNH acceptance-verify.js thật → đòi XANH ────────
    node "$TMP/ghh-check.mjs" "$KIT" "$WF" 0 > "$TMP/ghh-healthy.out" 2>&1
    RC=$?
    cat "$TMP/ghh-healthy.out"
    run_checks "$TMP/ghh-healthy.out"
    [ "$RC" -eq 0 ] || bad "gioi-han-het: bản lành ghh-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    # ── Mũi (i): bỏ khối GIOI HAN DA KHAI KHONG CON khỏi lời dặn soạn báo cáo ─
    copy_tree
    python3 - "$TMP/ghh-i-before.txt" "$TMP/ghh-i-after.txt" <<'PYEOF'
import sys
before, after = sys.argv[1], sys.argv[2]
target = "${gioiHanHet.length ? `\\nGIOI HAN DA KHAI KHONG CON — chep NGUYEN VAN vao muc \"## Known limits\":\\n${gioiHanHet.join('\\n')}\\n` : ''}"
open(before, 'w', encoding='utf8').write(target)
open(after, 'w', encoding='utf8').write('')
PYEOF
    inject_file ghh-prompt feature-loop/workflows/acceptance-verify.js "$TMP/ghh-i-before.txt" "$TMP/ghh-i-after.txt"
    COPY_WF="$COPY/feature-loop/workflows/acceptance-verify.js"
    node "$TMP/ghh-check.mjs" "$KIT" "$COPY_WF" 1 > "$TMP/ghh-i.out" 2>&1
    RC=$?
    cat "$TMP/ghh-i.out"
    run_checks "$TMP/ghh-i.out"
    [ "$RC" -eq 0 ] || bad "gioi-han-het: mũi (i) ghh-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    # ── Mũi (ii): repin-lane.mjs — ép hetHan luôn false → phạt một cải thiện ──
    copy_tree
    inject ghh-repin feature-loop/scripts/repin-lane.mjs \
      "const hetHan = e.expected !== 0 && e.exit === 0;" \
      "const hetHan = false;"
    FXCFG='{"config":{"executors":{"e1":"exit 0","suite":"exit 0"},"suiteKeys":["executors.script.suite"]},"evals":[{"id":"E1","cmd":"config:executors.script.e1","expectedExitLine":"2"}]}'
    node "$HERE/fixture.mjs" mkRepo "$FXCFG" > "$TMP/ghh-fx-healthy.txt"
    FX_H="$(sed -n '1p' "$TMP/ghh-fx-healthy.txt")"
    OUT_H=$(node "$KIT/feature-loop/scripts/repin-lane.mjs" --root "$FX_H" --slug fx --ag-root "$KIT" 2>&1); RC_H=$?
    if [ "$RC_H" -eq 0 ] && has "$OUT_H" "giới hạn đã khai không còn"; then
      ok "đối chứng dương: repin-lane thật trên eval cải thiện (khai 2, chạy trả 0) → LÀN XANH, gọi tên 'giới hạn đã khai không còn'"
    else bad "đối chứng dương KHÔNG xanh (rc=$RC_H): $(printf '%s\n' "$OUT_H" | tail -5 | tr '\n' ' ')"; fi

    node "$HERE/fixture.mjs" mkRepo "$FXCFG" > "$TMP/ghh-fx-mut.txt"
    FX_M="$(sed -n '1p' "$TMP/ghh-fx-mut.txt")"
    OUT_M=$(node "$COPY/feature-loop/scripts/repin-lane.mjs" --root "$FX_M" --slug fx --ag-root "$KIT" 2>&1); RC_M=$?
    if [ "$RC_M" -eq 1 ] && has "$OUT_M" "LÀN ĐỎ"; then
      ok "MŨI (ii) -- phạt cải thiện: repin-lane với hetHan=false ép eval cải thiện (khai 2, chạy trả 0) thành LÀN ĐỎ"
    else bad "mũi (ii) KHÔNG đúng: rc=$RC_M — $(printf '%s\n' "$OUT_M" | tail -5 | tr '\n' ' ')"; fi
    ;;

  # ── sáu chân còn lại của hồ sơ này: phiên khác dựng sau ────────────────────
  s4-dat-gioi-han|known-limits|xung-dot-lenh|so-ky-vong|tai-lieu|loi-dan-soan|dau-cuoi-that)
    bad "chân chưa dựng: $CHAN — thuộc phần hai (sáu chân còn lại + tài liệu), phiên khác làm sau"
    ;;

  *) echo "rang.sh: chân lạ '$CHAN'"; exit 3 ;;
esac
done_chan
