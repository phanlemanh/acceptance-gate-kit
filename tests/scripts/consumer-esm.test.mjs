// CE (consumer-esm, bugfix 1.39.1) — lớp "vật chép sang consumer chưa từng
// được đo ở consumer": repo tiêu thụ khai `"type": "module"` làm Node đọc file
// `.js` chép sang thành ESM, `require()` bên trong nổ ReferenceError, và tầng
// recheck + gap-probe chết CÂM trong khi suite tự-host của kit vẫn xanh (kho
// kit không có package.json gốc nên `.js` = CJS ở xưởng). GĐ2 ván 1
// (floorplanstudio, sổ vấp #23-24) trả giá bằng một pre-merge đỏ chặn merge.
//
// Phép đo dựng CONSUMER GIẢ-LẬP bằng code trong chính lần chạy:
//   1. Danh sách chép round-trip từ commands/acceptance-init.md (marker
//      INIT-CI-COPY-LIST) — KHÔNG chép tay, để danh-sách-thiếu tự làm test đỏ.
//   2. QUAN HỆ "mọi lib pre-merge dùng ⊆ danh sách chép" ghim bằng máy — thêm
//      một lib mới vào pre-merge mà quên khai chép là ĐỎ ngay tại đây.
//   3. Chiều XANH: recheck exit 0 trên evidence lành + exit 1 ĐÚNG THÔNG ĐIỆP
//      trên bản tiêm (chứng minh nó CHẤM thật, không phải chết-mà-im); pre-merge
//      chạy trọn `rules ran=3`, không một dòng NOT ENFORCED / fallback nào.
//   4. Chiều ĐỎ: cùng NỘI DUNG file nhưng mang đuôi .js (đúng layout trước vá)
//      phải nổ ReferenceError "require is not defined" — đối chứng dương là
//      chính bản .cjs cùng nội dung, cùng repo, đã xanh ở (3).
import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync, mkdirSync, copyFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// ── 1. Round-trip danh sách chép từ chỉ dẫn thật ────────────────────────────
const initMd = readFileSync(path.join(ROOT, 'commands', 'acceptance-init.md'), 'utf8');
const listBlock = (initMd.split('<!-- <<<INIT-CI-COPY-LIST -->')[1] || '').split('<!-- INIT-CI-COPY-LIST>>> -->')[0];
const COPIES = [];
for (const m of listBlock.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([^`]+)`\s*→\s*`([^`]+)\//g)) {
  COPIES.push({ src: m[1], dstDir: m[2] });
}

check('CE1 danh sách chép trích được từ marker (sanity ≥ 7 mục, mọi src tồn tại)', () => {
  assert.ok(COPIES.length >= 7, `chỉ trích được ${COPIES.length} mục từ INIT-CI-COPY-LIST — marker/khuôn hỏng`);
  for (const c of COPIES) {
    assert.ok(existsSync(path.join(ROOT, c.src)), `src trong danh sách chép không tồn tại ở kho: ${c.src}`);
  }
});

// Dùng chung cho CE2 (bản thật) và CE2m (mutant trong-lần-chạy): trích tập file
// pre-merge/recheck DÙNG, rồi so với một danh-sách-khai bất kỳ.
function usedVsDeclared(declaredSrcs) {
  const pm = readFileSync(path.join(ROOT, 'scripts', 'pre-merge-check.sh'), 'utf8');
  const rc = readFileSync(path.join(ROOT, 'scripts', 'recheck-evidence.cjs'), 'utf8');
  const used = new Set(['scripts/pre-merge-check.sh']);
  for (const m of pm.matchAll(/lib\/([a-z-]+\.cjs)/g)) used.add(`lib/${m[1]}`);
  for (const m of pm.matchAll(/([a-z-]+\.cjs)"/g)) { if (m[1] === 'recheck-evidence.cjs') used.add('scripts/recheck-evidence.cjs'); }
  for (const m of rc.matchAll(/'([a-z-]+\.cjs)'/g)) used.add(`lib/${m[1]}`);
  const declared = new Set(declaredSrcs);
  return { used, missing: [...used].filter(u => !declared.has(u)) };
}

check('CE2 QUAN HỆ đủ-bộ: mọi file scripts/+lib/ mà pre-merge-check.sh và recheck dùng đều nằm trong danh sách chép', () => {
  const { used, missing } = usedVsDeclared(COPIES.map(c => c.src));
  assert.ok(used.size >= 7, `sanity: chỉ nhận diện ${used.size} file dùng — phép nhận diện hỏng`);
  assert.deepEqual(missing, [], `pre-merge/recheck dùng file KHÔNG có trong danh sách chép của acceptance-init: ${missing.join(', ')}`);
});

check('CE2m mutant trong-lần-chạy: bỏ 1 mục khỏi danh-sách-khai → quan hệ phải ĐỎ ghim đúng tên (gap-probe S1 P1#1)', () => {
  const mutated = COPIES.map(c => c.src).filter(s => s !== 'lib/gap-probe.cjs');
  assert.equal(mutated.length, COPIES.length - 1, 'mutant không bỏ được mục nào — tên mục trong danh sách đã đổi?');
  const { missing } = usedVsDeclared(mutated);
  assert.ok(missing.includes('lib/gap-probe.cjs'), `phép đo quan hệ không đỏ khi thiếu lib/gap-probe.cjs (missing=${JSON.stringify(missing)})`);
});

// ── 2. Dựng consumer giả-lập type:module theo đúng danh sách chép ───────────
const SIM = mkdtempSync(path.join(tmpdir(), 'agk-consumer-'));
const git = (...a) => execFileSync('git', ['-C', SIM, '-c', 'user.email=t@t', '-c', 'user.name=t', ...a], { encoding: 'utf8' });

writeFileSync(path.join(SIM, 'package.json'), JSON.stringify({ name: 'consumer-sim', type: 'module' }, null, 2) + '\n');
for (const c of COPIES) {
  mkdirSync(path.join(SIM, c.dstDir), { recursive: true });
  copyFileSync(path.join(ROOT, c.src), path.join(SIM, c.dstDir, path.basename(c.src)));
}
mkdirSync(path.join(SIM, 'src'), { recursive: true });
writeFileSync(path.join(SIM, 'src', 'app.js'), 'export const x = 1;\n');
git('init', '-q');
git('add', '-A'); git('commit', '-qm', 'base');
const BASE_SHA = git('rev-parse', 'HEAD').trim();

// Workspace nghiệm thu tối thiểu nhưng LÀNH — mọi field cổng đòi đều thật.
const WS = path.join(SIM, '_acceptance', 'featx');
mkdirSync(WS, { recursive: true });
writeFileSync(path.join(SIM, '_acceptance', 'config.yaml'),
  'schema_version: 1\nenforcement: strict\ngap_probe: required\nrecheck: strict\n');
writeFileSync(path.join(WS, 'contract.md'),
  '---\nslug: featx\nstatus: implemented\nrisk_tier: T3\napproved_by: Manh\napproved_at: 2026-08-08\n---\n\n## Notes\n\nfixture sinh bởi consumer-esm.test.mjs\n');
writeFileSync(path.join(WS, 'gap-probe.md'),
  '---\nslug: featx\nat: 2026-08-08T00:00:00Z\nverdict: clean\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\nKhông còn lỗ đáng kể.\n');
writeFileSync(path.join(WS, 'run-log.jsonl'), '{"run_id":"ce-sim-1","kind":"eval"}\n');
git('add', '-A'); git('commit', '-qm', 'feature featx + workspace');
const HEAD_SHA = git('rev-parse', 'HEAD').trim();
const report = [
  '---', 'slug: featx', 'verdict: PASS', 'human_signoff: Manh Phan 2026-08-08',
  `verified_commit: ${HEAD_SHA}`, 'verified_at: 2026-08-08T00:00:00Z', '---', '',
  '## Evidence', '', '- eval: E1', '  run_id: ce-sim-1', '  exit_code: 0',
  '  verifier: scripts/pre-merge-check.sh', '  verified_at: 2026-08-08T00:00:00Z', '',
].join('\n');
writeFileSync(path.join(WS, 'evidence-report.md'), report);

const RECHECK_SIM = path.join(SIM, 'scripts', 'recheck-evidence.cjs');
const run = (cmd, args, opts = {}) => spawnSync(cmd, args, { encoding: 'utf8', ...opts });

// ── 3. Chiều XANH (kèm đối chứng nó-có-chấm-thật) ───────────────────────────
check('CE3 recheck (.cjs) exit 0 trên evidence lành trong repo type:module', () => {
  const r = run('node', [RECHECK_SIM, path.join(WS, 'evidence-report.md')]);
  assert.equal(r.status, 0, `recheck exit ${r.status}; stderr: ${r.stderr.slice(0, 300)}`);
  assert.ok(!/ReferenceError|require is not defined/.test(r.stderr), `ESM-scope error còn nguyên: ${r.stderr.slice(0, 200)}`);
});

check('CE4 đối chứng chấm-thật: bản tiêm exit_code: 2 → recheck exit 1 ghim "fails the evidence bar"', () => {
  const bad = path.join(WS, 'evidence-report-bad.md');
  writeFileSync(bad, report.replace('  exit_code: 0', '  exit_code: 2'));
  const r = run('node', [RECHECK_SIM, bad]);
  assert.equal(r.status, 1, `mong exit 1, được ${r.status}; stderr: ${r.stderr.slice(0, 300)}`);
  assert.match(r.stderr, /fails the evidence bar/, `đỏ nhưng sai thông điệp: ${r.stderr.slice(0, 300)}`);
});

check('CE5 pre-merge trong consumer type:module: exit 0, rules ran=3, KHÔNG một dòng NOT ENFORCED/fallback', () => {
  const r = run('bash', [path.join(SIM, 'scripts', 'pre-merge-check.sh'), SIM, '--base', BASE_SHA]);
  const out = r.stdout + r.stderr;
  assert.equal(r.status, 0, `pre-merge exit ${r.status}:\n${out.slice(0, 1500)}`);
  assert.match(out, /OK \[featx\]: PASS/, `thiếu dòng OK per-slug:\n${out.slice(0, 800)}`);
  assert.match(out, /rules ran=3 declared-off=0/, `sổ luật không trọn:\n${out.slice(0, 800)}`);
  assert.ok(!/NOT ENFORCED/.test(out), `còn lớp tắt tiếng:\n${out}`);
  assert.ok(!/not vendored|re-check unavailable/.test(out), `lớp recheck không sống:\n${out}`);
  assert.ok(!/not lib\/ac-line\.cjs/.test(out), `ac-line rơi về awk fallback trong repo ESM:\n${out}`);
});

check('CE5b vendored gap-probe CHẤM thật ở consumer: xoá gap-probe.md → pre-merge (required) VIOLATION đúng thông điệp (gap-probe S1 P1#2)', () => {
  const gp = path.join(WS, 'gap-probe.md');
  const saved = readFileSync(gp, 'utf8');
  try {
    rmSync(gp);
    const r = run('bash', [path.join(SIM, 'scripts', 'pre-merge-check.sh'), SIM, '--base', BASE_SHA]);
    const out = r.stdout + r.stderr;
    assert.equal(r.status, 1, `mong exit 1 (luật cắn), được ${r.status}:\n${out.slice(0, 800)}`);
    assert.match(out, /VIOLATION \[featx\]: chưa qua phản biện context sạch \(gap-probe\)/, `luật gap-probe không cắn ở consumer:\n${out.slice(0, 800)}`);
    assert.ok(!/NOT ENFORCED/.test(out), `luật cắn phải là phán CÓ-CHẠY, không phải NOT-ENFORCED:\n${out}`);
  } finally {
    writeFileSync(gp, saved);
  }
});

// ── 4. Chiều ĐỎ: đúng layout TRƯỚC vá (.js) phải nổ ReferenceError ──────────
check('CE6 red: cùng nội dung recheck nhưng đuôi .js trong type:module → ĐỎ đúng "require is not defined"', () => {
  const oldJs = path.join(SIM, 'scripts', 'recheck-evidence.js');
  copyFileSync(RECHECK_SIM, oldJs);
  const r = run('node', [oldJs, path.join(WS, 'evidence-report.md')]);
  assert.notEqual(r.status, 0, 'layout trước vá mà vẫn xanh — mô phỏng không tái tạo được lỗi lớp này');
  assert.match(r.stderr, /ReferenceError/, `đỏ nhưng không phải ReferenceError: ${r.stderr.slice(0, 300)}`);
  assert.match(r.stderr, /require is not defined/, `sai thông điệp: ${r.stderr.slice(0, 300)}`);
});

check('CE7 red: lib/gap-probe đuôi .js chạy classify trong type:module → cùng lớp ReferenceError', () => {
  const oldJs = path.join(SIM, 'lib', 'gap-probe.js');
  copyFileSync(path.join(SIM, 'lib', 'gap-probe.cjs'), oldJs);
  const r = run('node', [oldJs, 'classify', WS]);
  assert.notEqual(r.status, 0, 'gap-probe .js vẫn chạy được — mô phỏng sai');
  assert.match(r.stderr, /require is not defined/, `sai thông điệp: ${r.stderr.slice(0, 300)}`);
  // Đối chứng dương cùng repo, cùng nội dung, đuôi .cjs:
  const g = run('node', [path.join(SIM, 'lib', 'gap-probe.cjs'), 'classify', WS]);
  assert.equal(g.status, 0, `đối chứng .cjs phải xanh: ${g.stderr.slice(0, 200)}`);
  assert.match(g.stdout, /^ok\t/, `classify phải trả ok: "${g.stdout.slice(0, 80)}"`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
