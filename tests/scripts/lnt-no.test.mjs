// tests/scripts/lnt-no.test.mjs — nợ C1 của hồ sơ lop-bang-chung-nhin-thay (gom-duc-ket-2-10-0, AC-2).
//   NO1 LNT_AVAILABLE đã gỡ (đối chứng dương: mốc CÓ nó)
//   NO2 NOTE pre-merge nêu ĐÚNG nguyên nhân (thiếu node · thiếu lib · lib lỗi exit n)
//   NO3 stripComment MỘT NGUỒN: ba bộ đọc surfaces + hai hàm cắt chú thích hội tụ
//   NO4 html() của ca kiểm bỏ mã thoát ANSI
// Fixture CODE-SINH trong chính lần chạy; đường dẫn suy từ import.meta.url; mỗi phép đo
// có cặp hai-chiều cùng fixture + thông điệp ghim (MEASURE-BIRTH-CLAUSE).
//   NO_CASES=NO3 node tests/scripts/lnt-no.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fileFromTemplate } from '../fixtures/from-template.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const require = createRequire(import.meta.url);
const LIB = path.join(ROOT, 'lib', 'lop-nhin-thay.cjs');
const NG = path.join(ROOT, 'lib', 'nguong-o-co-hoi.cjs');
const EVYAML = path.join(ROOT, 'lib', 'eval-yaml.cjs');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const CHECK = path.join(ROOT, 'scripts', 'pre-merge-check.sh');
const CONTRACT_TPL = path.join(ROOT, 'skills', 'acceptance', 'references', 'contract-template.md');
// Mốc BẤT BIẾN có `LNT_AVAILABLE` — commit đã thêm nó (`git log -S`), không phải nhánh di động.
const BASE_HAS_LNT_AVAILABLE = '0d5b2dd8';

const ALL_IDS = ['NO1', 'NO2', 'NO3', 'NO4'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.NO_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };
const eq = (id, got, exp, what) => { if (JSON.stringify(got) !== JSON.stringify(exp)) fail(id, `${what}: got ${JSON.stringify(got)} expected ${JSON.stringify(exp)}`); };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'lnt-no-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const git = (cwd, ...a) => spawnSync('git', ['-c', 'user.email=t@test.local', '-c', 'user.name=tester', '-c', 'commit.gpgsign=false', '-C', cwd, ...a], { encoding: 'utf8' });

const BODY = '\n# Acceptance Contract: x\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Out of scope\n\n- a\n';
const contractOf = (surfaces, status = 'draft') => {
  const t = fileFromTemplate(CONTRACT_TPL, 'CONTRACT-FRONTMATTER-TEMPLATE',
    { feature: 'x', slug: 'x', owner: 'o@x', risk_tier: 'T2', surfaces, status }, BODY);
  // khuôn để trống hai ô Cổng 1; hồ sơ sau `draft` phải có chúng, không thì pre-merge
  // dừng ở luật «bỏ Cổng 1» trước khi tới luật đang đo.
  return status === 'draft' ? t
    : t.replace(/^approved_by:.*$/m, 'approved_by: Manh Phan').replace(/^approved_at:.*$/m, 'approved_at: 2026-09-08');
};
// Dòng `surfaces:` là CHÍNH VẬT ĐO của NO3 (biến thể chú thích), nên fixture dựng từ khuôn
// rồi thay đúng dòng đó — phần còn lại vẫn code-sinh từ CONTRACT-FRONTMATTER-TEMPLATE.
const withSurfaceLine = (txt, line) => txt.replace(/^surfaces:.*$/m, line);
const EV_T = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n';

// ─── NO1 — LNT_AVAILABLE đã gỡ, mốc cũ CÓ (đối chứng dương) ──────────────────
if (want('NO1')) {
  const id = 'NO1'; const before = failures;
  const now = readFileSync(NG, 'utf8');
  const hits = (now.match(/LNT_AVAILABLE/g) || []).length;
  if (hits !== 0) fail(id, `lib/nguong-o-co-hoi.cjs còn ${hits} chỗ nhắc LNT_AVAILABLE (cờ không bộ đọc nào dùng)`);
  const old = spawnSync('git', ['-C', ROOT, 'show', `${BASE_HAS_LNT_AVAILABLE}:lib/nguong-o-co-hoi.cjs`], { encoding: 'utf8' });
  if (old.status !== 0) fail(id, `không đọc được mốc ${BASE_HAS_LNT_AVAILABLE} — đối chứng dương không chạy được`);
  else if (!/LNT_AVAILABLE/.test(old.stdout)) fail(id, `mốc ${BASE_HAS_LNT_AVAILABLE} không có LNT_AVAILABLE — phép đo vắng-mặt không phân biệt được`);
  // vật vẫn sống: bản hiện tại đọc-cũ được khi thiếu lop-nhin-thay.cjs (lý do cờ ra đời)
  const m = tmp(); mkdirSync(path.join(m, 'lib'), { recursive: true });
  for (const f of ['nguong-o-co-hoi.cjs', 'md-section.cjs']) cpSync(path.join(ROOT, 'lib', f), path.join(m, 'lib', f));
  const r = spawnSync(process.execPath, ['-e', `const n=require(${JSON.stringify(path.join(m, 'lib', 'nguong-o-co-hoi.cjs'))}); process.stdout.write(String(n.coNguoiDungCuoi('[ui]')))`], { encoding: 'utf8' });
  if (r.status !== 0 || r.stdout !== 'true') fail(id, `bản thiếu lop-nhin-thay.cjs không đọc-cũ được (exit ${r.status}, out "${r.stdout}", err ${String(r.stderr).split('\n')[0]})`);
  rmSync(m, { recursive: true, force: true });
  if (failures === before) pass(id, 'LNT_AVAILABLE đã gỡ; mốc 0d5b2dd8 có nó (đối chứng dương); đọc-cũ vẫn sống');
}

// ─── NO2 — NOTE pre-merge nêu đúng nguyên nhân ───────────────────────────────
if (want('NO2')) {
  const id = 'NO2'; const before = failures;
  // fixture git gated: hợp đồng mặt người nhìn, evals không ui-check, evidence PASS đã ký
  const R = tmp();
  W(R, '_acceptance/config.yaml', 'schema_version: 1\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  W(R, '_acceptance/x/contract.md', contractOf('ui', 'signed-off'));
  W(R, '_acceptance/x/evals.yaml', EV_T);
  W(R, 'verify.sh', '#!/bin/sh\nexit 0\n');
  git(R, 'init', '-q');
  git(R, 'add', '-A');
  git(R, 'commit', '-qm', 'impl');
  const vc = git(R, 'rev-parse', 'HEAD').stdout.trim();
  W(R, '_acceptance/x/evidence-report.md', `---\nschema_version: 1\nfeature_slug: x\nverdict: PASS\nverified_commit: ${vc}\nhuman_signoff: Manh 2026-09-08\n---\n\n## Evidence\n- eval: E1\n  run_id: x-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-09-08\n`);
  git(R, 'add', '-A');
  git(R, 'commit', '-qm', 'evidence');

  const mkKit = () => { const m = tmp(); cpSync(path.join(ROOT, 'lib'), path.join(m, 'lib'), { recursive: true }); cpSync(path.join(ROOT, 'scripts'), path.join(m, 'scripts'), { recursive: true }); return m; };
  const runCheck = (kit, env) => spawnSync('bash', [path.join(kit, 'scripts', 'pre-merge-check.sh'), R], { encoding: 'utf8', env: { ...process.env, ...env } });
  const lntNote = out => (String(out).split('\n').find(l => /NOTE \[x\]:.*(lớp nhìn-thấy|mặt người nhìn)/.test(l)) || '');

  // đối chứng dương: kit lành → NOTE nghĩa vụ (không phải NOTE «không kiểm được»)
  const kitOk = mkKit();
  const rOk = runCheck(kitOk, {});
  const nOk = lntNote(rOk.stdout);
  if (!/mặt người nhìn/.test(nOk)) fail(id, `kit lành không in NOTE nghĩa vụ (fixture hỏng?): ${JSON.stringify(nOk || rOk.stdout.slice(-300))}`);

  const cases = [
    ['thiếu node', () => mkKit(), { PATH: '/usr/bin:/bin' }, /thiếu node[;,.]/],
    ['thiếu lib', () => { const m = mkKit(); rmSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), { force: true }); return m; }, {}, /thiếu lib\/lop-nhin-thay\.cjs/],
    ['lib lỗi', () => { const m = mkKit(); writeFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), 'process.exit(7);\n'); return m; }, {}, /lib lỗi \(exit 7\)/],
  ];
  const seen = [];
  for (const [name, mk, env, re] of cases) {
    const kit = mk();
    const r = runCheck(kit, env);
    const note = lntNote(r.stdout);
    if (r.status !== 0) fail(id, `${name}: exit ${r.status} (NOTE không được chặn merge)`);
    if (!re.test(note)) fail(id, `${name}: NOTE không nêu đúng nguyên nhân — got ${JSON.stringify(note || r.stdout.slice(-300))}`);
    seen.push(note);
    rmSync(kit, { recursive: true, force: true });
  }
  if (new Set(seen).size !== seen.length) fail(id, `ba nguyên nhân dùng CHUNG một câu — không phân biệt được: ${JSON.stringify(seen)}`);
  rmSync(kitOk, { recursive: true, force: true }); rmSync(R, { recursive: true, force: true });
  if (failures === before) pass(id, 'NOTE lớp nhìn-thấy nêu ba nguyên nhân phân biệt được, exit 0, đối chứng dương xanh');
}

// ─── NO3 — stripComment một nguồn ────────────────────────────────────────────
if (want('NO3')) {
  const id = 'NO3'; const before = failures;
  const FIX = [
    ['surfaces: [ui] # c', true],
    ['surfaces: [ui]\t#c', true],
    ['surfaces: [ui]#x', false],   // `#` không có khoảng trắng đứng trước = DỮ LIỆU, không phải chú thích
    ['surfaces: [ui]', true],
  ];
  const mkWs = line => { const w = tmp(); W(w, '_acceptance/x/contract.md', withSurfaceLine(contractOf('ui'), line)); W(w, '_acceptance/x/evals.yaml', EV_T); return w; };

  // (a) ba bộ đọc THẬT trên cùng fixture — lib CLI · lint W8 nghĩa vụ · gate-card --extract
  const readers = [
    ['lib classify', w => { const r = spawnSync(process.execPath, [LIB, 'classify', path.join(w, '_acceptance', 'x')], { encoding: 'utf8' }); return r.stdout.split('\t')[0] === '1'; }],
    ['lint W8', w => /W8 surfaces include a human-visible UI/.test(spawnSync(process.execPath, [LINT, w], { encoding: 'utf8' }).stdout)],
    ['gate-card', w => { const r = spawnSync(process.execPath, [GATE_CARD, '--root', w, '--slug', 'x', '--extract'], { encoding: 'utf8' }); try { return !!JSON.parse(r.stdout).ui_observed.applicable; } catch (_) { return null; } }],
  ];
  for (const [line, expApplicable] of FIX) {
    const w = mkWs(line);
    for (const [rname, fn] of readers) eq(id, fn(w), expApplicable, `${rname} trên ${JSON.stringify(line)}`);
    rmSync(w, { recursive: true, force: true });
  }

  // (b) HAI ĐƯỜNG CẮT CHÚ THÍCH phải hội tụ: lib (frontLine) và đường `clean` của thẻ
  //     (nguong-o-co-hoi nhận chuỗi đã cắt). Đây là seam đã lệch: `\s*#` cắt cả `x#y`,
  //     `[ \t]+#` thì không — cùng hồ sơ, hai câu trả lời.
  const L = require(LIB); const N = require(NG); const EY = require(EVYAML);
  if (typeof EY.stripComment !== 'function') fail(id, 'lib/eval-yaml.cjs chưa xuất stripComment — chưa có MỘT nguồn cắt chú thích');
  for (const [line, expApplicable] of FIX) {
    const raw = line.replace(/^surfaces:\s*/, '');
    const viaLib = L.laMatNguoiNhin(L.frontLine(withSurfaceLine(contractOf('ui'), line), 'surfaces'));
    const viaThe = typeof EY.stripComment === 'function' ? N.coNguoiDungCuoi(EY.stripComment(raw)) : null;
    eq(id, viaLib, expApplicable, `frontLine trên ${JSON.stringify(line)}`);
    eq(id, viaThe, expApplicable, `stripComment+coNguoiDungCuoi trên ${JSON.stringify(line)}`);
  }

  // (c) chiều đỏ CỦA LỚP: bản sao tiêm lại regex cũ `\s*#` vào frontLine → hai đường
  //     bất đồng ở fixture `[ui]#x`; phép đo (b) phải bắt được điều đó.
  const m = tmp(); cpSync(path.join(ROOT, 'lib'), path.join(m, 'lib'), { recursive: true });
  const src = readFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), 'utf8');
  // Tiêm bằng cách ĐỔI LUẬT ở nguồn chung (không đụng call site): nếu lib còn tự viết
  // regex thì mutant vô hiệu và ca đỏ — đó chính là điều cần bắt.
  const MUT_REQ = "Object.assign({}, require('./eval-yaml.cjs'), { stripComment: s => String(s == null ? '' : s).replace(/\\s*#.*$/, '').trim() })";
  const mut = src.replace("require('./eval-yaml.cjs')", MUT_REQ);
  if (mut === src || !/stripComment/.test(src)) {
    fail(id, 'không tiêm được mutant — lop-nhin-thay.cjs chưa dùng stripComment của lib/eval-yaml.cjs (đường cắt vẫn viết tay)');
  } else {
    writeFileSync(path.join(m, 'lib', 'lop-nhin-thay.cjs'), mut);
    const LM = require(path.join(m, 'lib', 'lop-nhin-thay.cjs'));
    const line = 'surfaces: [ui]#x';
    const got = LM.laMatNguoiNhin(LM.frontLine(withSurfaceLine(contractOf('ui'), line), 'surfaces'));
    if (got !== true) fail(id, `mutant \\s*# không đổi kết quả trên "${line}" — phép đo (b) không phân biệt được hai luật cắt`);
  }
  rmSync(m, { recursive: true, force: true });
  if (failures === before) pass(id, 'ba bộ đọc + hai đường cắt hội tụ trên 4 fixture; mutant \\s*# bị bắt');
}

// ─── NO4 — html() bỏ mã thoát ANSI ───────────────────────────────────────────
if (want('NO4')) {
  const id = 'NO4'; const before = failures;
  const t = readFileSync(path.join(ROOT, 'tests', 'plugins', 'lop-nhin-thay.test.mjs'), 'utf8');
  const m = t.match(/^const html = ([^\n]+)$/m);
  if (!m) fail(id, 'không rút được helper html() từ tests/plugins/lop-nhin-thay.test.mjs');
  else if (!/\\x1b|\\u001[bB]|stripAnsi/.test(m[1])) fail(id, `html() không bỏ mã thoát: ${m[1]}`);
  // cặp hai chiều trên CÙNG chuỗi: helper phải sạch ESC, chuỗi thô thì không
  const strip = s => String(s).replace(/\x1b\[[0-9;]*m/g, '');
  const raw = '\x1b[31mX\x1b[0m';
  if (strip(raw) !== 'X') fail(id, 'luật bỏ ANSI sai');
  if (!/\x1b/.test(raw)) fail(id, 'fixture không có ESC — ca không phân biệt được');
  if (failures === before) pass(id, 'html() bỏ ANSI, chuỗi thô vẫn giữ (cặp hai chiều)');
}

console.log(failures === 0 ? `lnt-no: OK (${ALL_IDS.filter(want).join(', ')})` : `lnt-no: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
