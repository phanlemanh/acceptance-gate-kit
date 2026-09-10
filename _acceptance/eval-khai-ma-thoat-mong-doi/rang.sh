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
# Chốt an toàn (soi phiên trước 09/09): KIT suy từ vị trí script — nếu rang.sh
# bị chép sang một thư mục khác để thử, "$HERE/../.." có thể hoá thành một gốc
# SAI (kể cả "/"), và rsync -a từ đó sẽ bắt đầu quét CẢ Ổ ĐĨA trước khi ai kịp
# Ctrl-C. Đòi ĐỒNG THỜI vài vật đặc trưng của gốc kit thật — không chỉ MỘT tệp,
# để một checkout thiếu-tệp-cục-bộ không giả mạo được — rồi thoát có tên nếu
# thiếu bất kỳ cái nào, TRƯỚC khi rsync chạy.
copy_tree() {
  for must in lib/evidence-core.cjs feature-loop/workflows/acceptance-verify.js _acceptance/config.yaml; do
    [ -f "$KIT/$must" ] || { echo "rang.sh: KIT ('$KIT') khong phai goc kit that — thieu $must, tu choi rsync de tranh quet ca dia"; exit 3; }
  done
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

  # ── s4-dat-gioi-han (AC-3) ───────────────────────────────────────────────────
  # Lớp máy (S4) phải nhận đạt-có-giới-hạn: phép so của `failed` phải so với KỲ
  # VỌNG đã khai (expCmd(m.cmd)), không so trần với 0 — nếu không, một eval đã
  # khai đúng mã (đang được NHẬN hợp lệ) sẽ bị mutant coi là lệch mã mà vẫn
  # nhận rồi REJECT sai.
  s4-dat-gioi-han)
    cat > "$TMP/sdgh-check.mjs" <<'SDGHEOF'
import path from 'node:path';
const [, , KIT, WF_PATH, MODE] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));

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
// eval khai expectedExit=2, lan chay tra DUNG 2 — day la MOT eval DA KHAI
// dung, dang duoc NHAN (dat-co-gioi-han), KHONG phai mot luot truot.
const { result } = await runWorkflow(WF_PATH, baseArgs(), responder(2));
const notRejected = result.verdict !== 'REJECT' && !(result.failedEvals || []).includes('E1');
if (MODE === 'healthy') {
  check('đối chứng dương: mã đúng như khai (2) → verdict KHÔNG REJECT, được NHẬN — không phải lệch mã mà vẫn nhận',
    notRejected, `verdict=${result.verdict} failed=${JSON.stringify(result.failedEvals)}`);
} else {
  check('CHIỀU ĐỎ: mutant (so với 0 thay vì expCmd) coi một eval đã khai đúng (2, đúng ra vẫn phải NHẬN) là lệch mã mà vẫn nhận nên REJECT sai',
    !notRejected, `verdict=${result.verdict} failed=${JSON.stringify(result.failedEvals)}`);
}
process.exit(badc > 0 ? 1 : 0);
SDGHEOF
    node "$TMP/sdgh-check.mjs" "$KIT" "$WF" healthy > "$TMP/sdgh-healthy.out" 2>&1
    RC=$?
    cat "$TMP/sdgh-healthy.out"
    run_checks "$TMP/sdgh-healthy.out"
    [ "$RC" -eq 0 ] || bad "s4-dat-gioi-han: bản lành sdgh-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    copy_tree
    inject sdgh-failed-so-0 feature-loop/workflows/acceptance-verify.js \
      "const failed = machine.filter(m => !m.cannotRun && m.exitCode !== expCmd(m.cmd) && !isHetHan(m.exitCode, m.cmd))" \
      "const failed = machine.filter(m => !m.cannotRun && m.exitCode !== 0 && !isHetHan(m.exitCode, m.cmd))"
    COPY_WF="$COPY/feature-loop/workflows/acceptance-verify.js"
    node "$TMP/sdgh-check.mjs" "$KIT" "$COPY_WF" mutant > "$TMP/sdgh-mut.out" 2>&1
    RC=$?
    cat "$TMP/sdgh-mut.out"
    run_checks "$TMP/sdgh-mut.out"
    [ "$RC" -eq 0 ] || bad "s4-dat-gioi-han: mũi sdgh-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── known-limits (AC-4) ──────────────────────────────────────────────────────
  # Known limits do MÁY tính sẵn (knownLimitLines), bên soạn chỉ chép nguyên
  # văn — nếu JS bỏ trống mảng này, lời dặn soạn báo cáo vắng tên eval đạt-có-
  # giới-hạn, và bên soạn không còn gì để chép.
  known-limits)
    sed -n '1063,1066p' "$KIT/feature-loop/workflows/acceptance-verify.js" > "$TMP/kl-before.txt"
    cat > "$TMP/kl-after.txt" <<'EOF'
const knownLimitLines = []
EOF
    copy_tree
    inject_file known-limits-rong feature-loop/workflows/acceptance-verify.js "$TMP/kl-before.txt" "$TMP/kl-after.txt"
    COPY_WF="$COPY/feature-loop/workflows/acceptance-verify.js"

    cat > "$TMP/kl-check.mjs" <<'KLEOF'
import path from 'node:path';
const [, , KIT, WF_PATH, MODE] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
const baseArgs = {
  slug: 'fx', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 }],
  suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
};
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
  throw new Error('unexpected ' + l);
};
const { calls } = await runWorkflow(WF_PATH, baseArgs, responder);
const synth = calls.find(c => c.label === 'synthesize:report');
const prompt = synth ? synth.prompt : '';
const hasBlock = /KNOWN LIMITS —/.test(prompt) && prompt.includes('E1') && prompt.includes('AC-1');
if (MODE === 'healthy') {
  check('đối chứng dương: eval đạt-có-giới-hạn → prompt mang khối Known limits tính sẵn, gọi tên E1/AC-1', hasBlock, prompt.slice(0, 250));
} else {
  check('CHIỀU ĐỎ: mutant (knownLimitLines rỗng cứng) → Known limits vắng eval E1, prompt KHÔNG còn khối tính sẵn', !hasBlock, prompt.slice(0, 250));
}
process.exit(badc > 0 ? 1 : 0);
KLEOF
    node "$TMP/kl-check.mjs" "$KIT" "$WF" healthy > "$TMP/kl-healthy.out" 2>&1
    RC=$?
    cat "$TMP/kl-healthy.out"
    run_checks "$TMP/kl-healthy.out"
    [ "$RC" -eq 0 ] || bad "known-limits: bản lành kl-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    node "$TMP/kl-check.mjs" "$KIT" "$COPY_WF" mutant > "$TMP/kl-mut.out" 2>&1
    RC=$?
    cat "$TMP/kl-mut.out"
    run_checks "$TMP/kl-mut.out"
    [ "$RC" -eq 0 ] || bad "known-limits: mũi kl-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── xung-dot-lenh (AC-5) ─────────────────────────────────────────────────────
  # Hai eval chung lệnh khai khác mã thoát mong đợi là mâu thuẫn không có lời
  # giải đúng — máy phải BLOCKED có tên cả hai, KHÔNG được chọn thầm một mã.
  xung-dot-lenh)
    cat > "$TMP/xdl-check.mjs" <<'XDLEOF'
import path from 'node:path';
const [, , KIT, WF_PATH, MODE] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
function baseArgs(evals) {
  return {
    slug: 'fx', round: 1, riskTier: 'T2', evals,
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
  };
}
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
  throw new Error('unexpected ' + l);
};

// Ca xung đột: E1 khai 2, E2 khai 3, cùng chung lệnh './x.sh'.
const conflictEvals = [
  { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 },
  { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 3 },
];
const { result } = await runWorkflow(WF_PATH, baseArgs(conflictEvals), responder);
const b = (result.blocked || []).find(x => x.cmd === './x.sh');
const conflictDetected = result.verdict === 'BLOCKED' && !!b && b.reason.includes('E1') && b.reason.includes('E2') && b.reason.includes('2') && b.reason.includes('3');
if (MODE === 'healthy') {
  check('đối chứng dương: hai eval chung lệnh khai KHÁC mã → BLOCKED, gọi tên cả hai eval + cả hai mã', conflictDetected, JSON.stringify(result.blocked));
} else {
  check('CHIỀU ĐỎ: mutant (if (false)) không phát hiện xung đột — máy chọn thầm một mã (2), bỏ qua mã kia (3) của E2, KHÔNG BLOCKED nào',
    !conflictDetected && result.verdict !== 'BLOCKED', `verdict=${result.verdict} blocked=${JSON.stringify(result.blocked)}`);
}

// Đối chứng dương của chiều ngược (bất biến với mutation này: chỉ MỘT giá trị
// phân biệt nên set.length luôn <=1, if(true) hay if(false) đều không chạy):
// hai eval cùng khai 2 → không xung đột, không blocked nào.
const agreeEvals = [
  { id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 },
  { id: 'E2', criterion: 'AC-2', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 },
];
const { result: rAgree } = await runWorkflow(WF_PATH, baseArgs(agreeEvals), responder);
check('đối chứng dương (chiều ngược): hai eval cùng khai mã GIỐNG nhau → không xung đột, không blocked nào',
  (rAgree.blocked || []).length === 0 && rAgree.verdict !== 'BLOCKED', `verdict=${rAgree.verdict} blocked=${JSON.stringify(rAgree.blocked)}`);

process.exit(badc > 0 ? 1 : 0);
XDLEOF
    node "$TMP/xdl-check.mjs" "$KIT" "$WF" healthy > "$TMP/xdl-healthy.out" 2>&1
    RC=$?
    cat "$TMP/xdl-healthy.out"
    run_checks "$TMP/xdl-healthy.out"
    [ "$RC" -eq 0 ] || bad "xung-dot-lenh: bản lành xdl-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    copy_tree
    inject xdl-if-false feature-loop/workflows/acceptance-verify.js \
      "if (set.length > 1) {" \
      "if (false) {"
    COPY_WF="$COPY/feature-loop/workflows/acceptance-verify.js"
    node "$TMP/xdl-check.mjs" "$KIT" "$COPY_WF" mutant > "$TMP/xdl-mut.out" 2>&1
    RC=$?
    cat "$TMP/xdl-mut.out"
    run_checks "$TMP/xdl-mut.out"
    [ "$RC" -eq 0 ] || bad "xung-dot-lenh: mũi xdl-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── so-ky-vong (AC-6) ────────────────────────────────────────────────────────
  # Bốn chỗ đều phải so với KỲ VỌNG đã khai (expCmd), không so trần với 0: đếm
  # lượt đạt (dòng ~647), chọn lượt đại diện chẩn đoán (dòng ~649), mã thoát
  # gộp (dòng ~655), và baselineStatus của làn đối chứng (dòng ~781). BỐN bản
  # sao RIÊNG, mỗi bản hoàn nguyên ĐÚNG MỘT phép so về `=== 0` / `!== 0`, và bốn
  # thông điệp phải KHÁC nhau — dùng chung MỘT fixture (2 lượt chạy: A khớp kỳ
  # vọng, B lệch) để bốn chỗ quan sát được qua bốn TRƯỜNG riêng của cùng entry
  # `machine` (passes/runId/exitCode/baseline), rút từ prompt qua marker
  # "Ket qua may (" — không cần đoán hành vi tổng thể (verdict) vì nhiều chỗ
  # trong bốn chỗ này KHÔNG đổi verdict cuối dù đổi giá trị trung gian.
  so-ky-vong)
    cat > "$TMP/skv-check.mjs" <<'SKVEOF'
import path from 'node:path';
const [, , KIT, WF_PATH, MODE] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const { extractBracketed } = await import(path.join(KIT, '_acceptance', 'eval-khai-ma-thoat-mong-doi', 'fixture.mjs'));

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
const baseArgs = {
  slug: 'fx', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2, runs: 2 }],
  suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
  runBaseline: true,
};
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) {
    if (l.endsWith('#1')) return { exitCode: 2, outputTail: 'A-tail', runId: 'rA', cannotRun: false }; // khop ky vong 2
    if (l.endsWith('#2')) return { exitCode: 9, outputTail: 'B-tail', runId: 'rB', cannotRun: false }; // lech
    throw new Error('unexpected machine label ' + l);
  }
  if (l.startsWith('baseline:')) return { results: [{ cmd: './x.sh', baselineExit: 2, cannotRun: false }] }; // baseline khop ky vong
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
  throw new Error('unexpected ' + l);
};
const { calls } = await runWorkflow(WF_PATH, baseArgs, responder);
const synth = calls.find(c => c.label === 'synthesize:report');
const prompt = synth ? synth.prompt : '';
const arr = extractBracketed(prompt, 'Ket qua may (') || [];
const m = arr.find(x => x.cmd === './x.sh');
if (!m) { console.log('CHECK-BAD: khong tim thay machine entry cho ./x.sh -- ' + JSON.stringify(arr).slice(0, 300)); process.exit(1); }

if (MODE === 'healthy') {
  check('đối chứng dương (đếm lượt đạt): passes=1 — chỉ lượt A khớp kỳ vọng 2', m.passes === 1, `passes=${m.passes}`);
  check('đối chứng dương (đại diện chẩn đoán): chọn lượt LỆCH (B, runId=rB) làm đại diện', m.runId === 'rB', `runId=${m.runId}`);
  check('đối chứng dương (mã thoát gộp): variance → trả mã kỳ vọng đã khai (2), không phải mã raw của lượt lệch', m.exitCode === 2, `exitCode=${m.exitCode}`);
  check('đối chứng dương (baselineStatus): baseline khớp kỳ vọng (2) → green', m.baseline === 'green', `baseline=${m.baseline}`);
} else if (MODE === 'm1') {
  check('CHIỀU ĐỎ (đếm lượt đạt — dòng ~647): mutant so với 0 → passes đếm SAI (0 thay vì 1, vì mã thật là 2 chứ không phải 0)',
    m.passes === 0, `passes=${m.passes}`);
} else if (MODE === 'm2') {
  check('CHIỀU ĐỎ (đại diện chẩn đoán — dòng ~649): mutant so với 0 → chọn NHẦM lượt A (runId=rA, lượt ĐẠT) làm đại diện chẩn đoán thay vì lượt LỆCH (B)',
    m.runId === 'rA', `runId=${m.runId}`);
} else if (MODE === 'm3') {
  check('CHIỀU ĐỎ (mã thoát gộp — dòng ~655): mutant trả hằng số 0 thay vì kỳ vọng đã khai (2)',
    m.exitCode === 0, `exitCode=${m.exitCode}`);
} else if (MODE === 'm4') {
  check('CHIỀU ĐỎ (baselineStatus — dòng ~781): mutant so với 0 → baseline khớp đúng kỳ vọng (2) lại bị đọc SAI thành red',
    m.baseline === 'red', `baseline=${m.baseline}`);
} else {
  throw new Error('MODE la (' + MODE + ')');
}
process.exit(badc > 0 ? 1 : 0);
SKVEOF
    node "$TMP/skv-check.mjs" "$KIT" "$WF" healthy > "$TMP/skv-healthy.out" 2>&1
    RC=$?
    cat "$TMP/skv-healthy.out"
    run_checks "$TMP/skv-healthy.out"
    [ "$RC" -eq 0 ] || bad "so-ky-vong: bản lành skv-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    # Bốn bản sao RIÊNG — mỗi bản hoàn nguyên ĐÚNG MỘT phép so.
    copy_tree
    inject skv-m1-passes feature-loop/workflows/acceptance-verify.js \
      "const passes = ran.filter(r => r.exitCode === expCmd(cmd)).length" \
      "const passes = ran.filter(r => r.exitCode === 0).length"
    node "$TMP/skv-check.mjs" "$KIT" "$COPY/feature-loop/workflows/acceptance-verify.js" m1 > "$TMP/skv-m1.out" 2>&1
    RC=$?
    cat "$TMP/skv-m1.out"
    run_checks "$TMP/skv-m1.out"
    [ "$RC" -eq 0 ] || bad "so-ky-vong: mũi m1 (đếm lượt đạt) skv-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    copy_tree
    inject skv-m2-rep feature-loop/workflows/acceptance-verify.js \
      "const rep = ran.find(r => r.exitCode !== expCmd(cmd)) || ran[0] // ưu tiên lần fail làm đại diện chẩn đoán" \
      "const rep = ran.find(r => r.exitCode !== 0) || ran[0] // ưu tiên lần fail làm đại diện chẩn đoán"
    node "$TMP/skv-check.mjs" "$KIT" "$COPY/feature-loop/workflows/acceptance-verify.js" m2 > "$TMP/skv-m2.out" 2>&1
    RC=$?
    cat "$TMP/skv-m2.out"
    run_checks "$TMP/skv-m2.out"
    [ "$RC" -eq 0 ] || bad "so-ky-vong: mũi m2 (đại diện chẩn đoán) skv-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    copy_tree
    inject skv-m3-exit feature-loop/workflows/acceptance-verify.js \
      "const exitCode = (passes === ran.length || variance) ? expCmd(cmd) : (Number.isInteger(rep.exitCode) ? rep.exitCode : 1)" \
      "const exitCode = (passes === ran.length || variance) ? 0 : (Number.isInteger(rep.exitCode) ? rep.exitCode : 1)"
    node "$TMP/skv-check.mjs" "$KIT" "$COPY/feature-loop/workflows/acceptance-verify.js" m3 > "$TMP/skv-m3.out" 2>&1
    RC=$?
    cat "$TMP/skv-m3.out"
    run_checks "$TMP/skv-m3.out"
    [ "$RC" -eq 0 ] || bad "so-ky-vong: mũi m3 (mã thoát gộp) skv-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    copy_tree
    inject skv-m4-baseline feature-loop/workflows/acceptance-verify.js \
      "return (b.baselineExit === expCmd(cmd) || isHetHan(b.baselineExit, cmd)) ? 'green' : 'red'" \
      "return (b.baselineExit === 0 || isHetHan(b.baselineExit, cmd)) ? 'green' : 'red'"
    node "$TMP/skv-check.mjs" "$KIT" "$COPY/feature-loop/workflows/acceptance-verify.js" m4 > "$TMP/skv-m4.out" 2>&1
    RC=$?
    cat "$TMP/skv-m4.out"
    run_checks "$TMP/skv-m4.out"
    [ "$RC" -eq 0 ] || bad "so-ky-vong: mũi m4 (baselineStatus) skv-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── loi-dan-soan (AC-12) ─────────────────────────────────────────────────────
  # Đo HAI tầng: (a) tầng VẬT — câu chữ trong prompt soạn báo cáo phải cho phép
  # mã khác 0 BÊN TRONG khối của eval đã khai đúng mã, không còn câu cấm cũ
  # (cấm TRỌN mọi nơi); (b) tầng ĐẦU RA THẬT — báo cáo do bước soạn sinh ra
  # (round-trip rút từ chính prompt qua fixture.mjs) phải mang đúng tên trường
  # exit_code, không phải một tên tự chế.
  loi-dan-soan)
    cat > "$TMP/lds-check.mjs" <<'LDSEOF'
import path from 'node:path';
const [, , KIT, WF_PATH, MODE] = process.argv;
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const { buildReportFromPrompt } = await import(path.join(KIT, '_acceptance', 'eval-khai-ma-thoat-mong-doi', 'fixture.mjs'));

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}
const baseArgs = {
  slug: 'fx', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: './x.sh', ref: 'config:executors.script.e1', expectedExit: 2 }],
  suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
};
const responder = (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 2, outputTail: 'ok', runId: '', cannotRun: false };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
  if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
  throw new Error('unexpected ' + l);
};
const OLD_PHRASE = 'report PASS khong duoc chua token exit khac 0 hay chuoi "verdict: FAIL"';
const NEW_PHRASE = 'report PASS chi duoc chua token exit khac 0 BEN TRONG khoi cua eval DA KHAI dung ma do';

const { calls } = await runWorkflow(WF_PATH, baseArgs, responder);
const synth = calls.find(c => c.label === 'synthesize:report');
const prompt = synth ? synth.prompt : '';
const hasOld = prompt.includes(OLD_PHRASE);
const hasNew = prompt.includes(NEW_PHRASE);

// (a) tầng VẬT — phụ thuộc MODE (đây là chỗ mũi tiêm nhắm tới).
if (MODE === 'healthy') {
  check('(a) đối chứng dương — tầng VẬT: lời dặn cho phép mã khác 0 BÊN TRONG khối đã khai, KHÔNG còn câu cấm cũ',
    hasNew && !hasOld, `hasNew=${hasNew} hasOld=${hasOld}`);
} else {
  check('CHIỀU ĐỎ (a) — tầng VẬT: mutant khôi phục câu cấm cũ → lời dặn còn cấm mã khác 0 ở MỌI nơi, không còn cho phép đạt-có-giới-hạn',
    hasOld && !hasNew, `hasNew=${hasNew} hasOld=${hasOld}`);
}

// (b) tầng ĐẦU RA THẬT — bất biến với mutation này (mutation chỉ đổi câu chữ
// chỉ dẫn, không đổi phần JS tính machineForReportB) nên chạy y hệt ở CẢ HAI
// MODE: một writer đúng khuôn PHẢI ra exit_code đúng tên trường, và một writer
// "bịa tên trường" PHẢI bị chân này phát hiện — đo cả hai chiều để (b) không
// chỉ là một bài kiểm trơ (chỉ biết đọc writer đúng, không biết bắt writer sai).
const repGood = buildReportFromPrompt(prompt, { slug: 'fx' });
check('(b) tầng ĐẦU RA THẬT: writer đúng khuôn → báo cáo có dòng "exit_code: 2" ĐÚNG TÊN TRƯỜNG cho eval đạt-có-giới-hạn',
  /  exit_code: 2\b/.test(repGood.text), repGood.text.slice(0, 400));
const repBad = buildReportFromPrompt(prompt, { slug: 'fx', fieldName: 'ma_thoat_tuy_bien' });
check('CHIỀU ĐỎ (b) — bịa tên trường: writer đặt tên trường tự chế (ma_thoat_tuy_bien thay exit_code) → báo cáo KHÔNG còn dòng exit_code đúng tên cho E1',
  !/  exit_code: 2\b/.test(repBad.text), repBad.text.slice(0, 400));

process.exit(badc > 0 ? 1 : 0);
LDSEOF
    node "$TMP/lds-check.mjs" "$KIT" "$WF" healthy > "$TMP/lds-healthy.out" 2>&1
    RC=$?
    cat "$TMP/lds-healthy.out"
    run_checks "$TMP/lds-healthy.out"
    [ "$RC" -eq 0 ] || bad "loi-dan-soan: bản lành lds-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"

    python3 - "$KIT/feature-loop/workflows/acceptance-verify.js" "$TMP/lds-before.txt" "$TMP/lds-after.txt" <<'PYEOF'
import sys
src_path, before_path, after_path = sys.argv[1], sys.argv[2], sys.argv[3]
s = open(src_path, encoding='utf8').read()
start_marker = 'L1 CONSISTENCY: report PASS chi duoc chua'
end_marker = '; L2: verifier la config: ref hoac script path'
i = s.index(start_marker)
j = s.index(end_marker, i)
before = s[i:j]
open(before_path, 'w', encoding='utf8').write(before)
old_clause = 'L1 CONSISTENCY: report PASS khong duoc chua token exit khac 0 hay chuoi "verdict: FAIL"'
open(after_path, 'w', encoding='utf8').write(old_clause)
PYEOF
    copy_tree
    inject_file loi-dan-soan-cau-cam-cu feature-loop/workflows/acceptance-verify.js "$TMP/lds-before.txt" "$TMP/lds-after.txt"
    COPY_WF="$COPY/feature-loop/workflows/acceptance-verify.js"
    node "$TMP/lds-check.mjs" "$KIT" "$COPY_WF" mutant > "$TMP/lds-mut.out" 2>&1
    RC=$?
    cat "$TMP/lds-mut.out"
    run_checks "$TMP/lds-mut.out"
    [ "$RC" -eq 0 ] || bad "loi-dan-soan: mũi lds-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── dau-cuoi-that (AC-13) ────────────────────────────────────────────────────
  # Chân DUY NHẤT chạy lệnh THẬT — bắt lớp lỗi 09/09: khoá khai giải ra vỡ cú
  # pháp nên lệnh thoát 127 (hay 1, hay bất kỳ mã nào của MỘT lệnh khác) chứ
  # KHÔNG phải mã của chính lệnh đã định. Năm nhịp: (1) mk_repo code-sinh một
  # khoá executor trỏ lệnh THẬT `exit 2` + một eval khai mã 2 trỏ đúng khoá đó;
  # (2) giải khoá bằng CHÍNH s4-args.mjs; (3) rút evals[0].cmd, so BẰNG với
  # lệnh đã khai; (4) chạy ĐÚNG chuỗi đó bằng bash -c, LẤY mã thoát THẬT vào một
  # biến (không viết hằng số vào chỗ đáng lẽ là kết quả đo); (5) đưa mã THẬT đó
  # vào workflow qua harness và đòi đạt-có-giới-hạn + Known limits gọi tên eval.
  # Hai đối chứng cùng năm nhịp: khoá thoát 0 + eval KHÔNG khai → PASS trơn,
  # không Known limits; khoá thoát 1 + eval khai 2 → REJECT gọi tên eval.
  dau-cuoi-that)
    cat > "$TMP/dct-check.mjs" <<'DCTEOF'
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const [, , KIT] = process.argv;
const { mkRepo } = await import(path.join(KIT, '_acceptance', 'eval-khai-ma-thoat-mong-doi', 'fixture.mjs'));
const { runWorkflow } = await import(path.join(KIT, 'tests', 'workflows', 'harness.mjs'));
const WF = path.join(KIT, 'feature-loop', 'workflows', 'acceptance-verify.js');

let okc = 0, badc = 0;
function check(name, cond, detail) {
  if (cond) { console.log(`CHECK-OK: ${name}`); okc++; }
  else { console.log(`CHECK-BAD: ${name} -- ${detail || ''}`); badc++; }
}

function runS4Real(root) {
  return spawnSync(process.execPath, [path.join(KIT, 'feature-loop', 'scripts', 's4-args.mjs'), '--slug', 'fx', '--root', root, '--ag-root', KIT, '--round', '1', '--no-carry'],
    { cwd: KIT, encoding: 'utf8' });
}

async function scenario(name, { executorCmd, expectedExitLine, mode }) {
  const evalSpec = { id: 'E1', cmd: 'config:executors.script.e1' };
  if (expectedExitLine !== undefined) evalSpec.expectedExitLine = expectedExitLine;
  const { root } = mkRepo({
    config: { executors: { e1: executorCmd, suite: 'exit 0' }, suiteKeys: ['executors.script.suite'] },
    evals: [evalSpec],
  });

  // Nhịp 2: giải khoá bằng CHÍNH s4-args.mjs thật.
  const s4 = runS4Real(root);
  check(`${name}: (2) s4-args.mjs (THẬT) thoát 0`, s4.status === 0, `exit=${s4.status} stderr=${(s4.stderr || '').slice(-300)}`);
  if (s4.status !== 0) return;

  let parsed;
  try { parsed = JSON.parse(s4.stdout); } catch (e) { check(`${name}: stdout là JSON hợp lệ`, false, String(e) + ' -- ' + s4.stdout.slice(0, 200)); return; }

  // Nhịp 3: rút evals[0].cmd, so BẰNG với chuỗi lệnh đã khai trong config fixture.
  const gotCmd = (parsed.evals[0] || {}).cmd;
  const cmdMatches = gotCmd === executorCmd;
  check(`${name}: (3) khoá khai giải ra ĐÚNG lệnh đã định`, cmdMatches,
    `khoá khai giải ra không phải lệnh đã định — got=${JSON.stringify(gotCmd)} want=${JSON.stringify(executorCmd)}`);
  if (!cmdMatches) return;

  // Nhịp 4: chạy ĐÚNG chuỗi lệnh vừa rút bằng bash -c, LẤY mã thoát THẬT vào
  // một biến — TUYỆT ĐỐI không viết hằng số vào chỗ đáng lẽ là kết quả đo.
  const CMD = gotCmd;
  const real = spawnSync('bash', ['-c', CMD], { encoding: 'utf8' });
  const realExit = real.status;

  // Nhịp 5: đưa mã THẬT vừa đo vào workflow qua harness.
  const expectedExit = parsed.evals[0].expectedExit;
  const baseArgs = {
    slug: 'fx', round: 1, riskTier: 'T2',
    evals: [{ id: 'E1', criterion: 'AC-1', executor: 'script', cmd: CMD, ref: 'config:executors.script.e1', expectedExit }],
    suiteCommands: [], diffBase: 'main', repoRoot: '/repo', personasPath: '/p', templatePath: '/t', invokedAt: '2026-09-09T00:00:00Z',
  };
  const responder = (call) => {
    const l = call.label;
    if (l.startsWith('machine:')) return { exitCode: realExit, outputTail: 'ok', runId: '', cannotRun: false };
    if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: 'a'.repeat(40) };
    if (l === 'synthesize:report') return { report: 'x', findings: 'f' };
    throw new Error('unexpected ' + l);
  };
  const { result, calls } = await runWorkflow(WF, baseArgs, responder);
  const synth = calls.find(c => c.label === 'synthesize:report');
  const prompt = synth ? synth.prompt : '';

  if (mode === 'chinh') {
    check(`${name}: (4) lệnh THẬT tra đúng mã kỳ vọng (2)`, realExit === 2, `realExit=${realExit}`);
    check(`${name}: (5) đạt-có-giới-hạn → KHÔNG trong failedEvals`, !(result.failedEvals || []).includes('E1'), JSON.stringify(result.failedEvals));
    check(`${name}: (5) verdict KHÔNG REJECT`, result.verdict !== 'REJECT', result.verdict);
    check(`${name}: (5) Known limits có dòng gọi tên eval E1/AC-1`, /KNOWN LIMITS —/.test(prompt) && prompt.includes('E1') && prompt.includes('AC-1'), prompt.slice(0, 250));
  } else if (mode === 'pass-tron') {
    check(`${name}: lệnh THẬT trả 0`, realExit === 0, `realExit=${realExit}`);
    check(`${name}: verdict PASS trơn, KHÔNG REJECT`, result.verdict !== 'REJECT', result.verdict);
    check(`${name}: KHÔNG dòng Known limits nào`, !/KNOWN LIMITS —/.test(prompt), prompt.slice(0, 250));
  } else if (mode === 'reject') {
    check(`${name}: lệnh THẬT trả 1 (lệch kỳ vọng 2)`, realExit === 1, `realExit=${realExit}`);
    check(`${name}: verdict REJECT`, result.verdict === 'REJECT', result.verdict);
    check(`${name}: failedEvals gọi tên E1`, (result.failedEvals || []).includes('E1'), JSON.stringify(result.failedEvals));
  }
}

await scenario('chính (khai 2, chạy thật exit 2)', { executorCmd: 'exit 2', expectedExitLine: '2', mode: 'chinh' });
await scenario('đối chứng PASS trơn (không khai, chạy thật exit 0)', { executorCmd: 'exit 0', expectedExitLine: undefined, mode: 'pass-tron' });
await scenario('đối chứng REJECT (khai 2, chạy thật exit 1)', { executorCmd: 'exit 1', expectedExitLine: '2', mode: 'reject' });

process.exit(badc > 0 ? 1 : 0);
DCTEOF
    node "$TMP/dct-check.mjs" "$KIT" > "$TMP/dct.out" 2>&1
    RC=$?
    cat "$TMP/dct.out"
    run_checks "$TMP/dct.out"
    [ "$RC" -eq 0 ] || bad "dau-cuoi-that: dct-check.mjs tự thoát khác 0 ($RC) — xem log ở trên"
    ;;

  # ── chân còn lại của hồ sơ này: phiên khác dựng sau (đo tài liệu chưa tồn tại) ──
  tai-lieu)
    bad "chân chưa dựng: $CHAN — đo tài liệu chưa tồn tại, phiên khác làm sau"
    ;;

  *) echo "rang.sh: chân lạ '$CHAN'"; exit 3 ;;
esac
done_chan
