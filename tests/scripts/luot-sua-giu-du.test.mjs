#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ luot-sua-giu-du-dem-dung (07/10/2026). Tên ca = tên AC.
// Gốc: crm/_acceptance/don-okr-nhap-sai — S4 lượt 2 ngày 07/10 lộ ba lỗ của kit:
//   (1) mục ngoài hợp đồng lượt trước rụng khi lượt sửa chạm tệp của nó (AC-1, AC-2);
//   (2) eval ui-check carry mất khung (bên đọc ở s4-args — AC-4; bên viết ở tests/workflows);
//   (3) thuoc-vat đếm nội dung nhập từ nhánh nền qua merge (AC-6..AC-9).
// AC-10: lời (prompt · SKILL · CHANGELOG).
//
// Chạy trọn: node tests/scripts/luot-sua-giu-du.test.mjs
// Một nhóm:  LSGD_CASES=AC-1,AC-4 node tests/scripts/luot-sua-giu-du.test.mjs  (khớp 0 ca → thoát 1)
//
// Mọi kho/sổ do MÃ SINH dưới một thư mục tạm dọn khi thoát; đường dẫn suy từ vị trí tệp này.
// Mỗi AC là MỘT hàm kiểm trả danh sách lỗi; cùng hàm chạy trên (i) cây đang kiểm — phải rỗng,
// (ii) bản sao bị phá — phải chứa thông điệp ghim, (iii) bản base `7b1afe1e` (main trước vòng,
// mốc bất biến) cho chiều đỏ lịch sử. Bản sao chỉ được tin khi chuỗi tiêm ĐỔI được nó.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const MOC_TRUOC = '7b1afe1e';
const DIRS = ['feature-loop', 'lib', 'scripts', 'skills'];

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lsgd-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });

const CASES = [];
const test = (id, name, fn) => CASES.push({ id, name, fn });
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const w = (d, rel, s) => { fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true }); fs.writeFileSync(path.join(d, rel), s); };
const a = (d, rel, s) => fs.appendFileSync(path.join(d, rel), s);
const commit = (d, msg) => { git(d, 'add', '-A'); git(d, 'commit', '-qm', msg); return git(d, 'rev-parse', 'HEAD'); };
const eqSet = (x, y) => JSON.stringify([...x].sort()) === JSON.stringify([...y].sort());

// ── bộ máy: cây đang kiểm · base · bản sao bị phá ───────────────────────────────
let BASE = null;
function banBase() {
  if (BASE) return BASE;
  const d = path.join(TMP, 'base');
  fs.mkdirSync(d);
  const r = spawnSync('bash', ['-o', 'pipefail', '-c', `git -C '${ROOT}' archive ${MOC_TRUOC} ${DIRS.join(' ')} | tar -x -C '${d}'`], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`khong dung duoc ban base ${MOC_TRUOC}: ${r.stderr}`);
  BASE = d;
  return d;
}
let demSao = 0;
function banSao(tep, tu, sang) {
  demSao += 1;
  const d = path.join(TMP, `sao-${demSao}`);
  for (const x of DIRS) fs.cpSync(path.join(ROOT, x), path.join(d, x), { recursive: true });
  const f = path.join(d, tep);
  const src = fs.readFileSync(f, 'utf8');
  const moi = typeof tu === 'string' ? src.split(tu).join(sang) : src.replace(tu, sang);
  if (moi === src) throw new Error(`chuoi tiem khong doi duoc ${tep} — ban sao giong ban goc, khong tin duoc chieu do`);
  fs.writeFileSync(f, moi);
  return d;
}
const coThongDiep = (loi, ghim) => loi.some(l => l.includes(ghim));

// ══ AC-1 · carry-plan mang mọi mục ngoài hợp đồng ═════════════════════════════
const SHA = 'a'.repeat(40);
function soAC1({ coSha = true } = {}) {
  const L = [];
  L.push({ ts: 't', ...(coSha ? { sha: SHA } : {}), round: 2, evalId: 'E1', run_id: 'E1-r2', exit_code: 0, cmd: 'x' });
  const f = (title, file, extra) => ({ ts: 't', sha: SHA, round: 2, kind: 'finding', file, title, severity: 'low', source: 'bugs', inContract: false, acRef: '', plain: `nguoi dung thay ${title}`, proposal: 'known-limits', khongBacBo: true, unverified: false, unclassified: false, ...extra });
  L.push(f('a', 'src/khong-doi.js'));
  L.push(f('b', 'src/doi.js'));
  L.push(f('c', 'src/khong-doi.js', { unclassified: true }));
  L.push(f('d', 'src/khong-doi.js', { inContract: true, acRef: 'AC-1' }));
  L.push(f('e', 'src/doi.js', { source: 'carried', carried_from_round: 1 }));
  return L.map(x => JSON.stringify(x)).join('\n') + '\n';
}
function chayCarryPlan(may, runLogText, delta) {
  const d = fs.mkdtempSync(path.join(TMP, 'cp-'));
  w(d, 'run-log.jsonl', runLogText);
  w(d, 'evals.yaml', 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: x\n    paths: [lib/**]\n');
  w(d, 'contract.md', '- AC-1: Given x When y Then z\n');
  const r = spawnSync(process.execPath, [path.join(may, 'feature-loop', 'scripts', 'carry-plan.mjs'),
    '--run-log', path.join(d, 'run-log.jsonl'), '--evals', path.join(d, 'evals.yaml'), '--contract', path.join(d, 'contract.md'),
    '--round', '3', '--ag-root', may, '--delta-files', delta.join(',')], { encoding: 'utf8' });
  if (r.status !== 0 && r.status !== 3) throw new Error(`carry-plan exit ${r.status}: ${r.stderr}`);
  return { exit: r.status, plan: JSON.parse(r.stdout) };
}
function kiemAC1(may) {
  const loi = [];
  for (const coSha of [true, false]) {
    const { exit, plan } = chayCarryPlan(may, soAC1({ coSha }), ['src/doi.js']);
    const nhan = coSha ? 'sổ đủ sha' : 'sổ thiếu sha (noCarry)';
    if (!coSha && exit !== 3) loi.push(`${nhan}: mã thoát ${exit}, kỳ vọng 3`);
    const cf = plan.carriedFindings || [];
    const tieuDe = cf.map(x => x.title);
    const thieu = ['a', 'b', 'e'].filter(t => !tieuDe.includes(t));
    const thua = tieuDe.filter(t => !['a', 'b', 'e'].includes(t));
    if (thieu.length) loi.push(`${nhan}: mục ngoài hợp đồng rụng: ${thieu.join(', ')}`);
    if (thua.length) loi.push(`${nhan}: mang sang mục không được mang: ${thua.join(', ')}`);
    const by = Object.fromEntries(cf.map(x => [x.title, x]));
    if (by.a && by.a.tepDoi !== false) loi.push(`${nhan}: a tepDoi=${by.a.tepDoi}, kỳ vọng false`);
    if (by.b && by.b.tepDoi !== true) loi.push(`${nhan}: b tepDoi=${by.b.tepDoi}, kỳ vọng true`);
    if (by.e && by.e.tepDoi !== true) loi.push(`${nhan}: e tepDoi=${by.e.tepDoi}, kỳ vọng true`);
    if (by.e && by.e.fromRound !== 1) loi.push(`${nhan}: e fromRound=${by.e.fromRound}, kỳ vọng 1`);
    if (by.b && (by.b.plain !== 'nguoi dung thay b' || by.b.proposal !== 'known-limits')) loi.push(`${nhan}: b mất plain/proposal`);
  }
  return loi;
}
test('AC-1', 'carry-plan: mục ngoài hợp đồng mang sang cả khi tệp bị sửa, có tepDoi', () => {
  const moi = kiemAC1(ROOT);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  // Đối chứng dương: (a) có ở cả base — base thật sự chạy và đọc được sổ.
  const { plan } = chayCarryPlan(banBase(), soAC1(), ['src/doi.js']);
  const tdBase = (plan.carriedFindings || []).map(x => x.title);
  if (!tdBase.includes('a')) throw new Error(`đối chứng dương hỏng: base không mang a (${JSON.stringify(tdBase)}) — base không chạy đúng sổ`);
  const loiBase = kiemAC1(banBase());
  if (!coThongDiep(loiBase, 'mục ngoài hợp đồng rụng: b, e')) throw new Error(`chiều đỏ lịch sử không đỏ đúng câu: ${loiBase.join(' · ')}`);
  return `bản mới {a,b,e} ở cả hai đường; base ${MOC_TRUOC} đỏ: «${loiBase.find(l => l.includes('rụng'))}»`;
});

// ══ AC-2 / AC-4 · s4-args ══════════════════════════════════════════════════════
const PNG = Buffer.from('89504e470d0a1a0a0000000d4948445200000001000000010806000000', 'hex');
const OBSERVED = ['Đã Read khung: danh sách hiện hai thẻ đang dùng và dòng gập «Đã bỏ (2)».', 'Dòng hai: ngăn mở có nút «Dùng lại», không chữ bị cắt.'];
function khoS4({ uiKhoi = 'du', anhCo = true, tuyetDoi = false } = {}) {
  const d = fs.mkdtempSync(path.join(TMP, 's4-'));
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  w(d, '_acceptance/config.yaml', 'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n');
  w(d, '_acceptance/demo/contract.md', '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n\n- AC-1: Given a When b Then c\n- AC-2: Given a When b Then c\n- AC-3: Given a When b Then c\n');
  w(d, '_acceptance/demo/evals.yaml', [
    'schema_version: 1', 'feature_slug: demo', 'evals:',
    '  - id: E1', '    criterion: AC-1', '    executor: test', '    cmd: config:executors.test.api', '    paths: [src/**]', '    expected: x',
    '  - id: E2', '    criterion: AC-2', '    executor: ui-check', '    cmd: config:executors.test.api', '    paths: [ui/**]', '    steps: [mo trang]', '    expected: thay danh sach',
    '  - id: E3', '    criterion: AC-3', '    executor: test', '    cmd: config:executors.test.api', '    paths: [lib/**]', '    expected: y', '',
  ].join('\n'));
  w(d, 'src/a.js', 'a\n'); w(d, 'ui/p.html', '<p>\n'); w(d, 'lib/l.js', 'l\n');
  w(d, '_acceptance/demo/run-log.jsonl', '');
  commit(d, 'goc');
  git(d, 'checkout', '-qb', 'vong');
  a(d, 'src/a.js', 'b\n');
  const s1 = commit(d, 'vat luot 1');
  const run = id => `${id}-2026-10-07-0902`;
  const dong = [
    { ts: '2026-10-07T02:01:02Z', sha: s1, round: 1, evalId: 'E1', run_id: run('E1'), exit_code: 0, cmd: 'echo x' },
    { ts: '2026-10-07T02:01:02Z', sha: s1, round: 1, evalId: 'E2', run_id: run('E2'), exit_code: 0, cmd: 'ui-check:E2' },
    { ts: '2026-10-07T02:01:02Z', sha: s1, round: 1, evalId: 'E3', run_id: run('E3'), exit_code: 0, cmd: 'echo x' },
    { ts: '2026-10-07T02:01:02Z', sha: s1, round: 1, kind: 'finding', file: 'src/a.js', title: 'Ngoai hop dong tren a', severity: 'low', source: 'bugs', inContract: false, acRef: '', plain: 'nguoi dung khong thay gi khac', proposal: 'known-limits', khongBacBo: true, unverified: false, unclassified: false },
  ];
  w(d, '_acceptance/demo/run-log.jsonl', dong.map(x => JSON.stringify(x)).join('\n') + '\n');
  const ANH = tuyetDoi ? path.join(d, '_acceptance/demo/evidence/E2-a.png') : 'evidence/E2-a.png';
  const khoiE2 = {
    du: [`- eval: E2`, `  run_id: ${run('E2')}`, `  exit_code: 0`, `  baseline: red`, `  verifier: config:executors.test.api`, `  verified_at: 2026-10-07T02:01:02Z`, `  screenshot: ${ANH}`, `  observed: |`, ...OBSERVED.map(l => `    ${l}`), `  network_observed: clean`],
    'run-lech': [`- eval: E2`, `  run_id: E2-khac-0001`, `  exit_code: 0`, `  verifier: config:executors.test.api`, `  verified_at: 2026-10-07T02:01:02Z`, `  screenshot: ${ANH}`, `  observed: |`, ...OBSERVED.map(l => `    ${l}`), `  network_observed: clean`],
    'thieu-observed': [`- eval: E2`, `  run_id: ${run('E2')}`, `  exit_code: 0`, `  verifier: config:executors.test.api`, `  verified_at: 2026-10-07T02:01:02Z`, `  screenshot: ${ANH}`, `  network_observed: clean`],
  }[uiKhoi];
  w(d, '_acceptance/demo/evidence-report.md', [
    '---', 'schema_version: 2', 'feature_slug: demo', 'verdict: REJECT', '---', '', '# Evidence Report: demo', '', '## Evidence', '',
    `- eval: E1`, `  run_id: ${run('E1')}`, `  exit_code: 0`, `  verifier: config:executors.test.api`, `  verified_at: 2026-10-07T02:01:02Z`, '',
    ...khoiE2, '',
    `- eval: E3`, `  run_id: ${run('E3')}`, `  exit_code: 0`, `  verifier: config:executors.test.api`, `  verified_at: 2026-10-07T02:01:02Z`, '',
    '## Iterations', '', 'Round 1: REJECT.', '',
  ].join('\n'));
  if (anhCo) { fs.mkdirSync(path.join(d, '_acceptance/demo/evidence'), { recursive: true }); fs.writeFileSync(path.join(d, '_acceptance/demo/evidence/E2-a.png'), PNG); }
  commit(d, 'ho so luot 1');
  a(d, 'src/a.js', 'c\n');
  commit(d, 'sua luot 2');
  return { d, anchor: s1, run };
}
function chayS4(may, d, anchor) {
  const out = path.join(d, 'args.json');
  const r = spawnSync(process.execPath, [path.join(may, 'feature-loop', 'scripts', 's4-args.mjs'), '--slug', 'demo', '--root', d, '--ag-root', may,
    '--out', out, '--diff-base', 'main', '--carry-anchor', anchor], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`s4-args exit ${r.status}: ${String(r.stderr).split('\n').filter(Boolean).slice(-3).join(' | ')}`);
  return { args: JSON.parse(fs.readFileSync(out, 'utf8')), stderr: r.stderr };
}

function kiemAC2(may) {
  const { d, anchor } = khoS4();
  const { args } = chayS4(may, d, anchor);
  const cf = (args.carriedFindings || []).find(x => x.title === 'Ngoai hop dong tren a');
  if (!cf) return ['s4-args làm rơi carriedFindings'];
  if (cf.tepDoi !== true) return [`carriedFindings mang mục nhưng tepDoi=${cf.tepDoi}, kỳ vọng true`];
  return [];
}
test('AC-2', 's4-args chuyển carriedFindings kèm tepDoi (round-trip carry-plan → s4-args)', () => {
  const moi = kiemAC2(ROOT);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const sao = banSao('feature-loop/scripts/s4-args.mjs', '  ...(carriedFindings ? { carriedFindings } : {}),\n', '');
  const loi = kiemAC2(sao);
  if (!coThongDiep(loi, 's4-args làm rơi carriedFindings')) throw new Error(`chiều đỏ không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return 'mục trên tệp bị sửa vào tệp args với tepDoi true; bản sao bỏ khoá đỏ đúng câu';
});

function kiemAC4(may) {
  const loi = [];
  // Ca khớp: đủ ba trường, giá trị bằng đúng khối.
  {
    const { d, anchor } = khoS4();
    const { args, stderr } = chayS4(may, d, anchor);
    const ce = Object.fromEntries((args.carriedEvals || []).map(c => [c.id, c]));
    if (!ce.E2) loi.push('khớp: E2 không được carry (fixture hỏng?)');
    else {
      if (ce.E2.screenshot !== 'evidence/E2-a.png') loi.push(`khớp: screenshot=${JSON.stringify(ce.E2.screenshot)}`);
      if (ce.E2.observed !== OBSERVED.join('\n')) loi.push(`khớp: observed=${JSON.stringify(ce.E2.observed)}`);
      if (ce.E2.networkObserved !== 'clean') loi.push(`khớp: networkObserved=${JSON.stringify(ce.E2.networkObserved)}`);
    }
    if (!ce.E3) loi.push('khớp: E3 không được carry (fixture hỏng?)');
    else if (['screenshot', 'observed', 'networkObserved'].some(k => k in ce.E3)) loi.push('eval test E3 bị gắn khung');
    if (/E3/.test(String(stderr).split('\n').filter(l => /khung/.test(l)).join('\n'))) loi.push('eval test E3 có dòng stderr khung');
  }
  // Ba ca phủ định trên cùng fixture.
  for (const [ten, opt, lyDo] of [['run_id lệch', { uiKhoi: 'run-lech' }, 'run_id lệch'], ['ảnh vắng', { anhCo: false }, 'ảnh vắng'], ['thiếu observed', { uiKhoi: 'thieu-observed' }, 'thiếu observed']]) {
    const { d, anchor } = khoS4(opt);
    const { args, stderr } = chayS4(may, d, anchor);
    const e2 = (args.carriedEvals || []).find(c => c.id === 'E2');
    if (!e2) { loi.push(`${ten}: E2 không được carry (fixture hỏng?)`); continue; }
    if (['screenshot', 'observed', 'networkObserved'].some(k => k in e2)) loi.push(ten === 'run_id lệch' ? 'gắn khung của lượt khác' : `${ten}: vẫn gắn khung`);
    const dongKhung = String(stderr).split('\n').filter(l => l.includes('E2') && l.includes(lyDo));
    if (dongKhung.length !== 1) loi.push(`${ten}: kỳ vọng đúng một dòng stderr gọi E2 + «${lyDo}», thấy ${dongKhung.length}`);
  }
  return loi;
}
test('AC-4', 's4-args gắn khung ui-check carry từ báo cáo lượt trước (cùng run_id, ảnh có thật, observed)', () => {
  const moi = kiemAC4(ROOT);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const sao = banSao('feature-loop/scripts/s4-args.mjs', /\/\/ <<<KHUNG-CUNG-RUN-ID[\s\S]*?\/\/ KHUNG-CUNG-RUN-ID>>>/, '');
  const loi = kiemAC4(sao);
  if (!coThongDiep(loi, 'gắn khung của lượt khác')) throw new Error(`chiều đỏ không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return 'khớp gắn đủ ba trường; run_id lệch · ảnh vắng · thiếu observed không gắn, mỗi ca một dòng; bản sao bỏ so run_id đỏ đúng câu';
});

// ══ AC-11 · đường ảnh tuyệt đối (nâng phạm vi 07/10 — 20/172 khối ảnh crm có dạng này) ════
function kiemAC11(may) {
  const loi = [];
  {
    const { d, anchor } = khoS4({ tuyetDoi: true });
    const { args } = chayS4(may, d, anchor);
    const e2 = (args.carriedEvals || []).find(c => c.id === 'E2');
    const ky = path.join(d, '_acceptance/demo/evidence/E2-a.png');
    if (!e2) loi.push('tuyệt đối có thật: E2 không được carry (fixture hỏng?)');
    else if (e2.screenshot !== ky || e2.observed !== OBSERVED.join('\n') || e2.networkObserved !== 'clean') loi.push(`đường ảnh tuyệt đối bị ghép sai (screenshot=${JSON.stringify(e2.screenshot)})`);
  }
  {
    const { d, anchor } = khoS4({ tuyetDoi: true, anhCo: false });
    const { args, stderr } = chayS4(may, d, anchor);
    const e2 = (args.carriedEvals || []).find(c => c.id === 'E2');
    if (e2 && 'screenshot' in e2) loi.push('tuyệt đối vắng: vẫn gắn khung');
    const n = String(stderr).split('\n').filter(l => l.includes('E2') && l.includes('ảnh vắng')).length;
    if (n !== 1) loi.push(`tuyệt đối vắng: kỳ vọng đúng một dòng «ảnh vắng», thấy ${n}`);
  }
  return loi;
}
test('AC-11', 's4-args gắn khung khi ảnh ghi đường tuyệt đối có thật; vắng thì nói ra', () => {
  const moi = kiemAC11(ROOT);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const duong = kiemAC4(ROOT);   // đối chứng dương: ca tương đối vẫn gắn trên CÙNG bản
  if (duong.length) throw new Error(`đối chứng dương (tương đối) hỏng: ${duong.join(' · ')}`);
  const sao = banSao('feature-loop/scripts/s4-args.mjs', /\/\/ <<<DUONG-ANH[\s\S]*?\/\/ DUONG-ANH>>>/, m => m.replace(/path\.resolve/g, 'path.join'));
  const loi = kiemAC11(sao);
  if (!coThongDiep(loi, 'đường ảnh tuyệt đối bị ghép sai')) throw new Error(`chiều đỏ không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return 'tuyệt đối có thật gắn đúng chuỗi; vắng → một dòng; tương đối vẫn gắn; bản sao path.join đỏ đúng câu';
});

// ══ AC-6..AC-9 · thuoc-vat ═════════════════════════════════════════════════════
// Kho do mã sinh. Nhánh `main` = nền; `vong` = vòng. Thước của hồ sơ demo = `_acceptance/demo/rang/a.mjs`.
const CHUNG0 = Array.from({ length: 10 }, (_, i) => `c${i + 1}`).join('\n') + '\n';
function khoTV(kieu) {
  const d = fs.mkdtempSync(path.join(TMP, `tv-${kieu}-`));
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  w(d, '_acceptance/config.yaml', 'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\nrisk_tiers:\n  t1_skip_globs:\n    - "docs/**"\n');
  w(d, '_acceptance/demo/contract.md', '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: draft\n---\n');
  w(d, '_acceptance/demo/evals.yaml', 'schema_version: 1\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n');
  w(d, '_acceptance/demo/rang/a.mjs', '// ca a\n');
  w(d, '_acceptance/demo/run-log.jsonl', '');
  w(d, 'src/a.js', '// a\n');
  w(d, 'src/chung.js', CHUNG0);
  commit(d, 'goc');
  git(d, 'checkout', '-qb', 'vong');
  a(d, 'src/a.js', '// vat truoc san\n'); commit(d, 'vat truoc san');
  const hd = path.join(d, '_acceptance/demo/contract.md');
  fs.writeFileSync(hd, fs.readFileSync(hd, 'utf8').replace('status: draft', 'status: implemented'));
  const san = commit(d, 'implemented');
  const sha = { san };
  // Việc của vòng — giống hệt ở mọi kiểu kho.
  a(d, '_acceptance/demo/rang/a.mjs', '// nhat 1\n'); commit(d, 'F1 thuoc');
  a(d, 'src/a.js', '// vat F2\n'); commit(d, 'F2 vat');
  w(d, 'src/chung.js', CHUNG0.replace('c1\n', 'c1x\nc0\n')); sha.r1 = commit(d, 'F3 chung truoc');
  if (kieu === 'B') {
    git(d, 'checkout', '-q', 'main');
    w(d, '_acceptance/khac/rang/x.mjs', '// rang khac\n'.repeat(4)); w(d, '_acceptance/khac/evals.yaml', 'evals: []\n'); commit(d, 'nen: ho so khac');
    w(d, 'src/nen.js', '// nen\n'.repeat(6)); a(d, 'src/chung.js', 'n1\nn2\nn3\nn4\nn5\n'); commit(d, 'nen: vat');
    w(d, '_acceptance/khac/rang/y.mjs', '// chi thuoc\n'); commit(d, 'nen: chi thuoc');
    git(d, 'checkout', '-q', 'vong');
    git(d, 'merge', '-q', '--no-ff', '-m', 'Merge main vao vong', 'main');
  }
  if (kieu === 'C') {
    git(d, 'checkout', '-qb', 'con');
    w(d, '_acceptance/demo/rang/b.mjs', '// nhat cua nhanh con\n'); commit(d, 'con: thuoc');
    git(d, 'checkout', '-q', 'vong');
  }
  w(d, 'src/chung.js', 'dau\n' + fs.readFileSync(path.join(d, 'src/chung.js'), 'utf8')); commit(d, 'F4 chung sau');
  a(d, 'src/a.js', '// lan F5\n'); a(d, '_acceptance/demo/rang/a.mjs', '// lan F5\n'); sha.r2 = commit(d, 'F5 lan');
  if (kieu === 'C') git(d, 'merge', '-q', '--no-ff', '-m', 'Merge con vao vong', 'con');
  sha.head = git(d, 'rev-parse', 'HEAD');
  return { d, sha };
}
function tvJson(may, d) {
  const r = spawnSync(process.execPath, [path.join(may, 'feature-loop', 'scripts', 'thuoc-vat.mjs'), '--root', d, '--slug', 'demo', '--ag-root', may, '--json'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`thuoc-vat exit ${r.status}: ${r.stderr}`);
  return { dem: JSON.parse(r.stdout), stdout: r.stdout };
}
function tvWrite(may, d) {
  const rl = path.join(d, '_acceptance/demo/run-log.jsonl');
  const truoc = fs.readFileSync(rl, 'utf8');
  const r = spawnSync(process.execPath, [path.join(may, 'feature-loop', 'scripts', 'thuoc-vat.mjs'), '--root', d, '--slug', 'demo', '--ag-root', may, '--write'], { encoding: 'utf8' });
  const sau = fs.readFileSync(rl, 'utf8');
  fs.writeFileSync(rl, truoc);   // trả sổ về như cũ — ca kế đọc cùng kho
  if (r.status !== 0) throw new Error(`thuoc-vat --write exit ${r.status}: ${r.stderr}`);
  const dong = sau.slice(truoc.length).split('\n').filter(Boolean).map(l => JSON.parse(l)).filter(o => o.kind === 'thuoc-vat');
  if (dong.length !== 1) throw new Error(`--write nối ${dong.length} dòng thuoc-vat, kỳ vọng 1`);
  const o = dong[0];
  return { vat: o.vat, thuoc: o.thuoc, hoSo: o.ho_so, nhat: o.nhat, lan: o.lan, tepThuoc: o.tep_thuoc };
}
const SO = ['vat', 'thuoc', 'hoSo', 'nhat', 'lan', 'tepThuoc'];
// Hằng viết trước của kho A (việc của vòng sau mốc sàn): F1 thuoc +1 · F2 vat +1 · F3 chung +2/−1 ·
// F4 chung +1 · F5 lẫn (vat +1, thuoc +1). Nhát = F1; lẫn = F5.
const KY_VONG_A = { vat: [5, 1], thuoc: [2, 0], hoSo: [0, 0], nhat: 1, lan: 1, tepThuoc: ['_acceptance/demo/rang/a.mjs'] };
function soSanh(x, y) { return SO.filter(k => JSON.stringify(x[k]) !== JSON.stringify(y[k])).map(k => `${k} ${JSON.stringify(x[k])}≠${JSON.stringify(y[k])}`); }

function kiemAC6(may, kA, kB) {
  const loi = [];
  const A = tvJson(may, kA.d).dem; const B = tvJson(may, kB.d).dem;
  const lechA = soSanh(A, KY_VONG_A);
  if (lechA.length) loi.push(`kho A lệch hằng viết trước: ${lechA.join(', ')}`);
  const lech = soSanh(B, A);
  if (lech.length) loi.push(`--json B≠A: ${lech.join(', ')}`);
  if ((B.tepThuoc || []).some(f => f.startsWith('_acceptance/khac/'))) loi.push(`đếm nội dung nhập từ nền (--json): ${B.tepThuoc.filter(f => f.startsWith('_acceptance/khac/')).join(', ')}`);
  const AW = tvWrite(may, kA.d); const BW = tvWrite(may, kB.d);
  const lechW = soSanh(BW, AW);
  if (lechW.length) loi.push(`--write B≠A: ${lechW.join(', ')}`);
  if ((BW.tepThuoc || []).some(f => f.startsWith('_acceptance/khac/'))) loi.push(`đếm nội dung nhập từ nền (--write): ${BW.tepThuoc.filter(f => f.startsWith('_acceptance/khac/')).join(', ')}`);
  return loi;
}
let KHO = null;
const khoTVs = () => (KHO ||= { A: khoTV('A'), B: khoTV('B'), C: khoTV('C') });

test('AC-6', 'thuoc-vat: merge từ nền không đổi số đếm (--json và --write)', () => {
  const { A, B } = khoTVs();
  const moi = kiemAC6(ROOT, A, B);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const loiBase = kiemAC6(banBase(), A, B);
  const can = ['đếm nội dung nhập từ nền (--json): _acceptance/khac/', 'đếm nội dung nhập từ nền (--write): _acceptance/khac/'];
  for (const c of can) if (!coThongDiep(loiBase, c)) throw new Error(`chiều đỏ lịch sử thiếu «${c}»: ${loiBase.join(' · ')}`);
  if (!coThongDiep(loiBase, 'rang/x.mjs')) throw new Error(`chiều đỏ lịch sử không gọi tên _acceptance/khac/rang/x.mjs: ${loiBase.join(' · ')}`);
  return `B = A = hằng (vat +5/−1, thuoc +2/−0, nhát 1, lẫn 1) ở cả hai chế độ; base đỏ: «${loiBase.find(l => l.includes('--json): '))}»`;
});

function kiemAC7(may, kB) {
  const B = tvJson(may, kB.d).dem;
  return JSON.stringify(B.vat) === JSON.stringify(KY_VONG_A.vat) ? [] : [`tệp chung đếm cả dòng của nền: vat ${JSON.stringify(B.vat)}, kỳ vọng ${JSON.stringify(KY_VONG_A.vat)}`];
}
test('AC-7', 'thuoc-vat: tệp vòng và nền cùng chạm chỉ đếm dòng của vòng', () => {
  const { B } = khoTVs();
  const moi = kiemAC7(ROOT, B);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const sao = banSao('feature-loop/scripts/thuoc-vat.mjs', /\/\/ <<<TEP-CHUNG[\s\S]*?\/\/ TEP-CHUNG>>>/, 'const tepChung = new Set();');
  const loi = kiemAC7(sao, B);
  if (!coThongDiep(loi, 'tệp chung đếm cả dòng của nền')) throw new Error(`chiều đỏ không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return `vat B = +5/−1 (chung.js +3/−1 của vòng); bản sao lấy ròng đỏ: «${loi[0]}»`;
});

function kiemAC8C(may, kC) {
  const C = tvJson(may, kC.d).dem;
  const ky = { ...KY_VONG_A, thuoc: [3, 0], nhat: 2, tepThuoc: ['_acceptance/demo/rang/a.mjs', '_acceptance/demo/rang/b.mjs'] };
  const lech = soSanh(C, ky);
  return lech.length ? [`nhánh con của vòng bị bỏ: ${lech.join(', ')}`] : [];
}
test('AC-8', 'thuoc-vat: nhánh con tách sau mốc sàn vẫn đếm; kho không merge giữ từng byte', () => {
  const { A, C } = khoTVs();
  const moi = kiemAC8C(ROOT, C);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const moiA = tvJson(ROOT, A.d).stdout; const baseA = tvJson(banBase(), A.d).stdout;
  if (moiA !== baseA) throw new Error(`kho không merge đổi stdout so base: ${baseA.trim()} → ${moiA.trim()}`);
  const sao = banSao('feature-loop/scripts/thuoc-vat.mjs', /\/\/ <<<CHA-NEN[\s\S]*?\/\/ CHA-NEN>>>/, 'const laChaNen = () => true;');
  const loi = kiemAC8C(sao, C);
  if (!coThongDiep(loi, 'nhánh con của vòng bị bỏ')) throw new Error(`chiều đỏ không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return `C: nhát 2 (có nhát nhánh con), thuoc +3; A bằng hệt base từng byte; bản sao coi mọi cha là nền đỏ`;
});

function giuaHaiLuot(may, k) {
  const rl = path.join(k.d, '_acceptance/demo/run-log.jsonl');
  const truoc = fs.readFileSync(rl, 'utf8');
  fs.writeFileSync(rl, [
    { kind: 'round-tally', round: 1, sha: k.sha.r1 }, { evalId: 'E1', round: 1, sha: k.sha.r1, run_id: 'E1-1' },
    { kind: 'round-tally', round: 2, sha: k.sha.r2 }, { evalId: 'E1', round: 2, sha: k.sha.r2, run_id: 'E1-2' },
  ].map(x => JSON.stringify(x)).join('\n') + '\n');
  const r = spawnSync(process.execPath, [path.join(may, 'feature-loop', 'scripts', 'thuoc-vat.mjs'), '--root', k.d, '--slug', 'demo', '--ag-root', may, '--giua-hai-luot'], { encoding: 'utf8' });
  fs.writeFileSync(rl, truoc);
  if (r.status !== 0) throw new Error(`--giua-hai-luot exit ${r.status}: ${r.stderr}`);
  return r.stdout.split('\n').filter(Boolean);
}
function kiemAC9(may, kB) {
  const tep = giuaHaiLuot(may, kB);
  const loi = [];
  if (!tep.includes('_acceptance/demo/rang/a.mjs')) loi.push(`đối chứng dương: thiếu tệp thước của vòng (${JSON.stringify(tep)})`);
  const khac = tep.filter(f => f.startsWith('_acceptance/khac/'));
  if (khac.length) loi.push(`in tệp thước nhập từ nền: ${khac.join(', ')}`);
  return loi;
}
test('AC-9', 'thuoc-vat --giua-hai-luot không in tệp thước nhập từ nền', () => {
  const { B } = khoTVs();
  const moi = kiemAC9(ROOT, B);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const loiBase = kiemAC9(banBase(), B);
  if (!coThongDiep(loiBase, '_acceptance/khac/rang/x.mjs')) throw new Error(`chiều đỏ lịch sử không gọi tên x.mjs: ${loiBase.join(' · ') || '(xanh)'}`);
  return `chỉ _acceptance/demo/rang/a.mjs; base đỏ: «${loiBase.find(l => l.includes('nhập từ nền'))}»`;
});

// ══ AC-10 · lời ═══════════════════════════════════════════════════════════════
function cauCam() {
  const src = git(ROOT, 'show', `${MOC_TRUOC}:feature-loop/workflows/acceptance-verify.js`);
  // Câu cấm của base: mệnh đề TUYET DOI KHONG … screenshot … carried — rút từ chính tệp base.
  return [...src.matchAll(/TUYET DOI KHONG ghi screenshot:\/observed: cho block carried[^:]*?\)/g)].map(m => m[0]);
}
function kiemAC10(may) {
  const loi = [];
  const cam = cauCam();
  const wf = fs.readFileSync(path.join(may, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
  for (const c of cam) if (wf.includes(c)) loi.push(`prompt còn câu cấm: «${c}»`);
  const skill = fs.readFileSync(path.join(may, 'feature-loop', 'skills', 'feature-loop', 'SKILL.md'), 'utf8');
  if (!skill.includes('(r<N> · tệp đã đổi)')) loi.push('SKILL thiếu nhãn «(r<N> · tệp đã đổi)» ở đoạn T5');
  const cl = fs.readFileSync(path.join(ROOT, 'CHANGELOG.md'), 'utf8');
  const chuaPhatHanh = cl.split(/\n## /).find(s => /^\[?Unreleased|^\[?Chưa phát hành/i.test(s)) || '';
  if (!chuaPhatHanh.includes('don-okr-nhap-sai')) loi.push('CHANGELOG mục chưa phát hành không nêu gốc don-okr-nhap-sai');
  return loi;
}
test('AC-10', 'lời: câu cấm chép khung gỡ khỏi prompt, SKILL nêu nhãn tệp đổi, CHANGELOG nêu gốc', () => {
  const cam = cauCam();
  if (cam.length < 1) throw new Error(`đối chứng dương hỏng: không rút được câu cấm nào từ ${MOC_TRUOC}`);
  const moi = kiemAC10(ROOT);
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const sao = banSao('feature-loop/workflows/acceptance-verify.js', '// <<<OOC-PROPOSAL-VALUES', `// ${cam[0]}\n// <<<OOC-PROPOSAL-VALUES`);
  const loi = kiemAC10(sao);
  if (!coThongDiep(loi, 'prompt còn câu cấm')) throw new Error(`chiều đỏ không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return `rút ${cam.length} câu từ base: «${cam[0]}» — vắng ở bản mới; bản sao còn câu đỏ`;
});

// ── chạy ─────────────────────────────────────────────────────────────────────
const CHON = (process.env.LSGD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chay = CASES.filter(c => !CHON.length || CHON.includes(c.id));
if (!chay.length) { console.error(`luot-sua-giu-du: LSGD_CASES=${process.env.LSGD_CASES} khớp 0 ca`); process.exit(1); }
let pass = 0, fail = 0;
for (const c of chay) {
  try { const m = c.fn(); console.log(`  PASS: ${c.id} — ${c.name}${m ? ` — ${m}` : ''}`); pass += 1; }
  catch (e) { console.log(`  FAIL: ${c.id} — ${c.name} — ${String(e && e.message || e)}`); fail += 1; }
}
console.log(`\nResults: ${pass} passed, ${fail} failed (luot-sua-giu-du)`);
process.exit(fail ? 1 : 0);
