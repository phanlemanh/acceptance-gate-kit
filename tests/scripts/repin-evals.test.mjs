// RE — luật «làn re-pin phải chạy lại eval MÁY của chính hồ sơ» (hồ sơ
// repin-chay-lai-eval, 2026-09-07). Lỗ gốc (crm-onehub, sổ vấp 07/09): làn
// re-pin chỉ chứng bốn lệnh suite, dòng repin chỉ mang suites_exit; hồ sơ mất
// tiền đề sau hợp nhất 88 commit vẫn ghim lại xanh, CI xanh suốt.
//
// Owner 08/09/2026: KHÔNG có mốc ngày, KHÔNG grandfather — làn thiếu evals_exit
// đỏ bất kể ts; nợ của chính kit đặt tên ở mirror-sync-grandfather.mjs.
// Luật kit: âm tính có đối chứng dương + ghim ĐÚNG thông điệp; hai bên đọc
// (recheck-evidence.cjs · pre-merge-check.sh) phải cùng đỏ cùng thông điệp;
// mutant phá phần mã bị canh → ca đổi màu (phép đo sống, không phải trang trí).
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { mkRepinFixture, SHA_A, TS_NEW, evalsYamlWith } from './repin-fixture.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const RC = path.join(ROOT, 'scripts', 'recheck-evidence.cjs');
const CHECK = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const rc = (report, script = RC) => {
  try { execFileSync('node', [script, report], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); return { code: 0, err: '' }; }
  catch (e) { return { code: e.status, err: String(e.stderr || '') }; }
};
const pm = (root, script = CHECK) => {
  try { return { code: 0, out: execFileSync('bash', [script, root], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }; }
  catch (e) { return { code: e.status, out: String(e.stdout || '') + String(e.stderr || '') }; }
};
// Ca chuẩn: làn ts mới, hồ sơ có eval máy E1; fixture mặc định đã đủ bộ.
const NEW = (extra = {}) => mkRepinFixture({ ts: TS_NEW, ...extra });

check('RE0 đối chứng dương: làn mới ghi evals_exit phủ đủ eval máy, exit 0 → cả hai bên đọc clean, không NOTE suite-only', () => {
  const f = NEW({ evalsExit: { E1: 0 } });
  const r = rc(f.report); assert.equal(r.code, 0, `recheck: ${r.err}`);
  const p = pm(f.root); assert.equal(p.code, 0, `pre-merge: ${p.out}`);
  assert.doesNotMatch(p.out, /suite-only/);
});

check('RE1 LỖ GỐC: làn mới KHÔNG ghi evals_exit (chỉ suites_exit) → recheck ĐỎ đích danh', () => {
  const f = NEW({ noEvalsExit: true });
  const r = rc(f.report);
  assert.equal(r.code, 1, 'hồ sơ mất tiền đề vẫn ghim lại xanh — lỗ re-pin còn nguyên');
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" \(ts 2026-09-09T00:00:00Z\) backs verified_commit a{40} but recorded no evals_exit/);
  assert.match(r.err, /repin-lane\.mjs/, 'thông điệp phải chỉ đường: chạy làn eval bằng script');
});

check('RE1p LỖ GỐC ở bên đọc thứ hai: pre-merge VIOLATION cùng thông điệp', () => {
  const f = NEW({ noEvalsExit: true });
  const p = pm(f.root);
  assert.equal(p.code, 1, `pre-merge vẫn xanh:\n${p.out}`);
  assert.match(p.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" \(ts 2026-09-09T00:00:00Z\) backs verified_commit a{40} but recorded no evals_exit/);
});

check('RE2 phủ thiếu: evals.yaml có E1+E2 máy, làn chỉ ghi E1 → ĐỎ gọi tên E2 (cả hai bên đọc)', () => {
  const f = mkRepinFixture({ ts: TS_NEW, evalsYaml: evalsYamlWith(['E1', 'E2']), evalsExit: { E1: 0 } });
  const r = rc(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" evals_exit lacks eval\(s\) E2 declared in evals\.yaml \(executor test\/script\)/);
  const p = pm(f.root);
  assert.equal(p.code, 1);
  assert.match(p.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" evals_exit lacks eval\(s\) E2/);
});

check('RE2+ đối chứng: eval judgment/ui-check KHÔNG bị đòi — E1 máy + E8 judgment, làn ghi {E1:0} → clean', () => {
  const extra = '  - id: E8\n    criterion: AC-8\n    executor: judgment\n    cmd: judgment\n    expected: >\n      Người phán.\n  - id: E9\n    criterion: AC-9\n    executor: ui-check\n    cmd: config:executors.ui.x\n    expected: >\n      Máy nhìn frame.\n';
  const f = mkRepinFixture({ ts: TS_NEW, evalsYaml: evalsYamlWith(['E1'], extra), evalsExit: { E1: 0 } });
  assert.equal(rc(f.report).code, 0, rc(f.report).err);
  assert.equal(pm(f.root).code, 0, pm(f.root).out);
});

check('RE3 eval đỏ: evals_exit {E1:1} → ĐỎ đích danh (làn đỏ không chống lưng được pin)', () => {
  const f = NEW({ evalsExit: { E1: 1 } });
  const r = rc(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" evals_exit has nonzero exit for E1=1/);
  assert.match(pm(f.root).out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" evals_exit has nonzero exit for E1=1/);
});

check('RE4 evals_exit sai khuôn (mảng thay vì object) → ĐỎ đích danh', () => {
  const f = NEW({ evalsExitRaw: '[0]' });
  const r = rc(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" evals_exit is not an object of \{evalId: exit\}/);
  assert.match(pm(f.root).out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" evals_exit is not an object/);
});

check('RE5 KHÔNG sử liệu (owner 08/09): làn ts CŨ không có evals_exit → cả hai bên đọc ĐỎ cùng thông điệp, không NOTE', () => {
  const f = mkRepinFixture({ noEvalsExit: true }); // ts mặc định = TS_OLD
  const r = rc(f.report);
  assert.equal(r.code, 1, 'làn suite-only đời cũ vẫn được coi là sử liệu — owner đã bỏ mốc');
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" \(ts 2026-08-05T01:00:00Z\) backs verified_commit a{40} but recorded no evals_exit/);
  const p = pm(f.root);
  assert.equal(p.code, 1);
  assert.match(p.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" \(ts 2026-08-05T01:00:00Z\) backs verified_commit a{40} but recorded no evals_exit/);
  assert.doesNotMatch(p.out, /NOTE \[feat-repin\]: re-pin lane/);
});

check('RE5b dòng ts CŨ có evals_exit: {E1:0} clean; {E1:1} ĐỎ — luật không nhìn ngày', () => {
  const ok = mkRepinFixture({ evalsExit: { E1: 0 } });
  assert.equal(rc(ok.report).code, 0); const p = pm(ok.root); assert.equal(p.code, 0); assert.doesNotMatch(p.out, /suite-only/);
  const bad = mkRepinFixture({ evalsExit: { E1: 1 } });
  assert.equal(rc(bad.report).code, 1); assert.match(rc(bad.report).err, /nonzero exit for E1=1/);
});

check('RE6 dòng repin KHÔNG có ts và không evals_exit → ĐỎ, thông điệp in ts ?', () => {
  const f = NEW({ noTs: true, noEvalsExit: true });
  const r = rc(f.report);
  assert.equal(r.code, 1, 'dòng không ts lọt qua như sử liệu — fail-open');
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" \(ts \?\) backs verified_commit a{40} but recorded no evals_exit/);
});

check('RE7 làn mới nhưng hồ sơ KHÔNG có evals.yaml → ĐỎ (không có gì để chứng pin)', () => {
  const f = mkRepinFixture({ ts: TS_NEW, noEvalsYaml: true });
  const r = rc(f.report);
  assert.equal(r.code, 1);
  assert.match(r.err, /REPIN x re-pin lane "repin-test-1" backs verified_commit a{40} but _acceptance\/feat-repin\/evals\.yaml is missing/);
  assert.match(pm(f.root).out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" backs verified_commit a{40} but _acceptance\/feat-repin\/evals\.yaml is missing/);
});

check('RE8 chỉ làn CHỐNG LƯNG verified_commit bị xét: làn 1 (mới, thiếu evals_exit, sha≠vc) + làn 2 khớp vc đủ bộ → clean', () => {
  const f = mkRepinFixture({ ts: TS_NEW, noEvalsExit: true, secondEvent: { runId: 'repin-test-2', sha: 'b'.repeat(40), ts: TS_NEW, evalsExit: { E1: 0 } } });
  const r = rc(f.report); assert.equal(r.code, 0, r.err);
  const p = pm(f.root); assert.equal(p.code, 0, p.out);
});

// ── RE9 phạm vi: sử liệu CHỈ theo diff PR (cùng guard với recheck, ADR 0010) ──
// Kho git code-sinh: hồ sơ ghim bằng làn suite-only. Ngoài diff → im + NOTE đếm;
// --recheck-all → đỏ; trong diff → đỏ. Đối chứng dương: cùng ba nhánh với làn đủ bộ → clean.
// touch: 'src' → PR chỉ đổi mã ngoài hồ sơ (hồ sơ NGOÀI diff) · 'notes' → PR chạm
// thư mục hồ sơ (TRONG diff, không lệch cây). base = commit evidence.
function gitFixture(opts, touch) {
  const f = mkRepinFixture(opts);
  const g = (...a) => execFileSync('git', ['-C', f.root, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  g('init', '-q'); g('add', '-A'); g('commit', '-qm', 'impl');
  const head = g('rev-parse', 'HEAD');
  writeFileSync(f.report, readFileSync(f.report, 'utf8').replaceAll(SHA_A, head));
  const log = path.join(f.dir, 'run-log.jsonl');
  writeFileSync(log, readFileSync(log, 'utf8').replaceAll(SHA_A, head));
  g('add', '-A'); g('commit', '-qm', 'evidence');
  const base = g('rev-parse', 'HEAD');
  if (touch === 'src') writeFileSync(path.join(f.root, 'src2.js'), 'other feature\n');
  else writeFileSync(path.join(f.dir, 'notes.md'), 'chạm hồ sơ\n');
  g('add', '-A'); g('commit', '-qm', `PR ${touch}`);
  return { f, base };
}
const pmArgs = (root, ...extra) => { try { return { code: 0, out: execFileSync('bash', [CHECK, root, '--no-t1-escape', ...extra], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }) }; } catch (e) { return { code: e.status, out: String(e.stdout || '') + String(e.stderr || '') }; } };
check('RE9a hồ sơ nợ NGOÀI diff PR → pre-merge clean + NOTE «eval-lane scope — 1 slug»; --recheck-all → VIOLATION', () => {
  const { f, base } = gitFixture({ noEvalsExit: true }, 'src');
  const r = pmArgs(f.root, '--base', base);
  assert.equal(r.code, 0, `nợ ngoài diff chặn PR không liên quan:\n${r.out}`);
  assert.match(r.out, /NOTE: eval-lane scope — 1 slug ngoài diff PR không được soi làn ghim lại/);
  assert.doesNotMatch(r.out, /VIOLATION \[feat-repin\]: re-pin lane/);
  const all = pmArgs(f.root, '--base', base, '--recheck-all');
  assert.equal(all.code, 1, '--recheck-all mà nợ vẫn im');
  assert.match(all.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" .*recorded no evals_exit/);
});
check('RE9b hồ sơ nợ TRONG diff PR → VIOLATION đích danh, không NOTE scope', () => {
  const { f, base } = gitFixture({ noEvalsExit: true }, 'notes');
  const r = pmArgs(f.root, '--base', base);
  assert.equal(r.code, 1, `chạm hồ sơ nợ mà vẫn xanh:\n${r.out}`);
  assert.match(r.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1" .*recorded no evals_exit/);
  assert.doesNotMatch(r.out, /eval-lane scope/);
});
check('RE9+ đối chứng dương: làn đủ bộ → cả ba nhánh (ngoài diff · --recheck-all · trong diff) đều clean', () => {
  const a = gitFixture({}, 'src'); const b = gitFixture({}, 'notes');
  for (const [root, args] of [[a.f.root, ['--base', a.base]], [a.f.root, ['--base', a.base, '--recheck-all']], [b.f.root, ['--base', b.base]]]) {
    const r = pmArgs(root, ...args); assert.equal(r.code, 0, `${args.join(' ')}:\n${r.out}`);
  }
});

// ── Mutant: phá phần mã bị canh → ca đổi màu (phép đo sống). Bản sao lấy TRỌN
// thư mục scripts/ + lib/ (không chép danh sách file tay — P150).
function mutantTree(mutate) {
  const d = mkdtempSync(path.join(tmpdir(), 'repin-mut-'));
  cpSync(path.join(ROOT, 'scripts'), path.join(d, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(d, 'lib'), { recursive: true });
  for (const [rel, from, to] of mutate) {
    const f = path.join(d, rel); const src = readFileSync(f, 'utf8');
    assert.ok(src.includes(from), `mutant không áp được — neo "${from.slice(0, 50)}" không còn trong ${rel}`);
    writeFileSync(f, src.replace(from, to));
  }
  return { rc: path.join(d, 'scripts', 'recheck-evidence.cjs'), pm: path.join(d, 'scripts', 'pre-merge-check.sh') };
}
check('REm1 mutant lib: danh sách executor máy → [] ⇒ ca phủ-thiếu (RE2) HOÁ XANH — phép đo tựa vào đúng danh sách đó', () => {
  const f = mkRepinFixture({ ts: TS_NEW, evalsYaml: evalsYamlWith(['E1', 'E2']), evalsExit: { E1: 0 } });
  assert.equal(rc(f.report).code, 1, 'đối chứng: bản thật phải đỏ trước');
  const m = mutantTree([['lib/evidence-core.cjs', "const REPIN_MACHINE_EXECUTORS = ['test', 'script'];", 'const REPIN_MACHINE_EXECUTORS = [];']]);
  assert.equal(rc(f.report, m.rc).code, 0, 'mutant xoá danh sách executor mà reader vẫn đỏ — phép đo không đo danh sách');
  assert.equal(pm(f.root, m.pm).code, 0, 'pre-merge không đi qua cùng nguồn luật (lib) — hai reader lệch nguồn');
});
check('REm3 mutant dây nối: recheck bỏ lời gọi checkRepinEvals ⇒ RE1 xanh ở recheck nhưng pre-merge VẪN đỏ (mỗi reader nối riêng)', () => {
  const f = NEW({ noEvalsExit: true });
  const m = mutantTree([['scripts/recheck-evidence.cjs', 'for (const x of core.checkRepinEvals(e, evalsText, slug).errs) errs.push(`REPIN x ${x}`);', '/* mutant */']]);
  assert.equal(rc(f.report, m.rc).code, 0);
  assert.equal(pm(f.root, m.pm).code, 1);
});
check('REm4 mutant dây nối: pre-merge không đếm VIOLATION của luật (1) repin_bad=1 → : ) ⇒ RE1 xanh ở pre-merge dù in VIOLATION', () => {
  const f = NEW({ noEvalsExit: true });
  const m = mutantTree([['scripts/pre-merge-check.sh', '          1) repin_bad=1 ;;', '          1) : ;;']]);
  const p = pm(f.root, m.pm);
  assert.equal(p.code, 0, 'mutant không đếm mà vẫn đỏ — có đường đếm khác?');
  assert.match(p.out, /VIOLATION \[feat-repin\]: re-pin lane "repin-test-1"/, 'dòng VIOLATION vẫn phải in (chỉ mất đếm)');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
