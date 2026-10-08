#!/usr/bin/env node
// Ca vĩnh viễn cho hồ sơ luot-sua-giu-du-dem-dung (07/10/2026), phía WORKFLOW. Tên ca = tên AC.
// Gốc: crm/_acceptance/don-okr-nhap-sai — S4 lượt 2 lộ (1) mục ngoài hợp đồng lượt trước biến
// khỏi bản findings, (2) khối ui-check carry mất ảnh + mô tả nên thẻ Cổng 2 báo không có bằng
// chứng nhìn-thấy. Workflow chạy THẬT qua harness.mjs (không chép hàm); tác tử tổng hợp do ca
// điều khiển — đúng chỗ lỗi gốc: tác tử BỎ SÓT.
//
// Chạy trọn: node tests/workflows/luot-sua-giu-du.test.mjs
// Một nhóm:  LSGD_CASES=AC-3 node tests/workflows/luot-sua-giu-du.test.mjs   (khớp 0 ca → thoát 1)
//
// Mutant: srcOverride (bản sao workflow trong bộ nhớ) — chuỗi tiêm phải ĐỔI được nguồn.
// Mọi đường dẫn suy từ vị trí tệp này; kho fixture code-sinh dưới thư mục tạm.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from './harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const WF_SRC = fs.readFileSync(WF, 'utf8');
const require_ = createRequire(import.meta.url);
const ooc = require_(path.join(ROOT, 'lib', 'out-of-contract.cjs'));
const core = require_(path.join(ROOT, 'lib', 'evidence-core.cjs'));

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'lsgd-wf-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });
const git = (cwd, ...a) => execFileSync('git', ['-C', cwd, ...a], { encoding: 'utf8' }).trim();
const w = (d, rel, s) => { fs.mkdirSync(path.dirname(path.join(d, rel)), { recursive: true }); fs.writeFileSync(path.join(d, rel), s); };
const CASES = [];
const test = (id, name, fn) => CASES.push({ id, name, fn });
const tiem = (tu, sang) => {
  if (!WF_SRC.includes(tu)) throw new Error(`chuoi tiem khong co trong workflow: ${tu.slice(0, 60)} — ban sao giong ban goc`);
  return WF_SRC.split(tu).join(sang);
};
const coThongDiep = (loi, ghim) => loi.some(l => l.includes(ghim));

const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const argsGoc = (over = {}) => ({
  slug: 'demo', round: 2, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }],
  suiteCommands: ['npm run build'], diffBase: 'main', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md',
  contractPath: '/repo/_acceptance/demo/contract.md', invokedAt: '2026-10-07T03:00:00Z', invokedSha: VC,
  ...over,
});
const traLoi = (synth) => (call) => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('ui:')) return { exitCode: 0, outputTail: 'asserted', runId: '', cannotRun: false, screenshotPath: 'evidence/E-step1.png' };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: [] };
  if (l.startsWith('refute:')) return { refuted: true, reason: 'not real' };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l.startsWith('triage')) return { contractUnreadable: false, triaged: [] };
  if (l === 'capture:provenance') return { bypass_used: false, enforcement_mode: 'strict', verified_commit: VC };
  if (l === 'synthesize:report') return synth;
  throw new Error('unexpected agent label: ' + l);
};

// ══ AC-3 · mục carry lên bản findings, đúng một lần, sổ nối lượt kế ═══════════════════════
const CARRIED = [
  { file: 'apps/api/test/x.spec.ts', title: 'Thu tu da bo khong duoc kiem', severity: 'medium', plain: 'Danh sách «Đã bỏ» có thể hiện sai thứ tự.', proposal: 'known-limits', fromRound: 1, tepDoi: false },
  { file: 'apps/api/test/y.spec.ts', title: 'Khong co nguoi xem hop le', severity: 'medium', plain: 'Chưa có kiểm tra người có quyền vẫn thấy mục.', proposal: 'known-limits', fromRound: 1, tepDoi: true },
];
const MUC = (title, file, plain = 'Người dùng thấy lỗi tươi.') => `- **${title}**\n  Người dùng thấy gì: ${plain}\n  file: \`${file}\`\n  severity: low\n  Đề xuất: known-limits\n`;
const HEAD = '## Ngoài hợp đồng — người quyết ở Gate 2\n\nCác lỗi dưới đây nằm ngoài phạm vi đã duyệt ở Cổng Phạm vi và CHƯA qua bác bỏ đối kháng — người quyết, máy không sửa và không chấm thứ máy không được sửa.\n\n';
const CUM = '\nCụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).\n';
const HINH = {
  'co-muc-tuoi': '# Review findings\n\n## Trong hợp đồng\n\n(rỗng)\n\n' + HEAD + MUC('Muc tuoi luot 2', 'src/z.js') + CUM,
  'muc-rong': '# Review findings\n\n## Trong hợp đồng\n\n(rỗng)\n\n## Ngoài hợp đồng — người quyết ở Gate 2\n\n(rỗng — không có lỗi ngoài phạm vi)\n' + CUM,
  'khong-muc': '# Review findings\n\n## Trong hợp đồng\n\n(rỗng)\n' + CUM,
};
async function chayAC3(findingsTacTu, src, carried = CARRIED) {
  const { result } = await runWorkflow(WF, argsGoc({ carriedFindings: carried }), traLoi({ report: '# Evidence demo', findings: findingsTacTu }), src);
  return result;
}
async function kiemAC3(src) {
  const loi = [];
  for (const [ten, txt] of Object.entries(HINH)) {
    const r = await chayAC3(txt, src);
    const p = ooc.parse(r.findings || '');
    const tim = t => p.findings.filter(f => f.title === t);
    const a = tim('Thu tu da bo khong duoc kiem (r1)');
    const b = tim('Khong co nguoi xem hop le (r1 · tệp đã đổi)');
    if (a.length !== 1 || b.length !== 1) { loi.push(`${ten}: mục carry không lên bản findings (a=${a.length}, b=${b.length}; đọc ra ${JSON.stringify(p.findings.map(f => f.title))})`); continue; }
    if (a[0].plain !== CARRIED[0].plain || a[0].file !== CARRIED[0].file || a[0].proposal !== 'known-limits') loi.push(`${ten}: mục a mất plain/file/proposal ${JSON.stringify(a[0])}`);
    if (p.suspect_empty) loi.push(`${ten}: cờ sai khuôn (suspect_empty)`);
    if (ten === 'co-muc-tuoi' && tim('Muc tuoi luot 2').length !== 1) loi.push(`${ten}: mục tươi mất`);
  }
  // Tác tử ĐÃ in mục carry a (cùng title + file) → đúng một lần.
  {
    const txt = '# Review findings\n\n' + HEAD + MUC('Thu tu da bo khong duoc kiem (r1)', CARRIED[0].file, CARRIED[0].plain) + CUM;
    const p = ooc.parse((await chayAC3(txt, src)).findings || '');
    const n = p.findings.filter(f => f.title.startsWith('Thu tu da bo khong duoc kiem')).length;
    if (n !== 1) loi.push(`tác tử đã in mục carry: xuất hiện ${n} lần, kỳ vọng 1`);
  }
  // Mục TƯƠI trùng tên ĐÚNG, khác tệp → mục carry vẫn lên đúng một lần (khoá có tệp).
  {
    const txt = '# Review findings\n\n' + HEAD + MUC('Khong co nguoi xem hop le', 'apps/api/src/xoa.ts') + CUM;
    const p = ooc.parse((await chayAC3(txt, src)).findings || '');
    const n = p.findings.filter(f => f.title === 'Khong co nguoi xem hop le (r1 · tệp đã đổi)').length;
    if (n !== 1) loi.push(`mục carry bị nuốt bởi mục tươi trùng tên (xuất hiện ${n} lần)`);
  }
  // Round-trip sổ: dòng finding của CHÍNH lượt này → carry-plan lượt kế.
  {
    const r = await chayAC3(HINH['co-muc-tuoi'], src);
    const d = fs.mkdtempSync(path.join(TMP, 'so-'));
    w(d, 'run-log.jsonl', r.runLog.join('\n') + '\n');
    w(d, 'evals.yaml', 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: x\n    paths: [lib/**]\n');
    w(d, 'contract.md', '- AC-1: Given x When y Then z\n');
    const cp = spawnSync(process.execPath, [path.join(ROOT, 'feature-loop', 'scripts', 'carry-plan.mjs'), '--run-log', path.join(d, 'run-log.jsonl'),
      '--evals', path.join(d, 'evals.yaml'), '--contract', path.join(d, 'contract.md'), '--round', '3', '--ag-root', ROOT, '--no-delta'], { encoding: 'utf8' });
    let cf = [];
    try { cf = JSON.parse(cp.stdout).carriedFindings || []; } catch { loi.push(`carry-plan lượt kế không in JSON (exit ${cp.status}): ${cp.stderr}`); }
    const tieuDe = cf.map(x => x.title).sort();
    if (JSON.stringify(tieuDe) !== JSON.stringify(CARRIED.map(c => c.title).sort())) loi.push(`mục carry rụng ở lượt kế (carry-plan lượt 3 thấy ${JSON.stringify(tieuDe)})`);
    else if (!cf.every(x => x.fromRound === 1)) loi.push(`fromRound lượt kế sai: ${JSON.stringify(cf.map(x => x.fromRound))}`);
  }
  return loi;
}
test('AC-3', 'mục ngoài hợp đồng carry lên bản findings do máy chèn, khoá title+file, sổ nối lượt kế', async () => {
  // Đối chứng dương: không carry → bản findings BẰNG HỆT chuỗi tác tử.
  for (const txt of Object.values(HINH)) {
    const r = await chayAC3(txt, undefined, []);
    if (r.findings !== txt) throw new Error('đối chứng dương hỏng: không carry mà bản findings bị đổi');
  }
  const moi = await kiemAC3();
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const dotBien = [
    ['gỡ bước chèn', tiem('chenMucCarry(report.findings, carriedFindings)', 'report.findings'), 'mục carry không lên bản findings'],
    ['khoá chỉ-tiêu-đề', tiem('x.file === tepC && ', ''), 'mục carry bị nuốt bởi mục tươi trùng tên'],
    ['bỏ dòng sổ carry', tiem('for (const c of carriedFindings) runLogLines.push(findingLine(', 'for (const c of []) runLogLines.push(findingLine('), 'mục carry rụng ở lượt kế'],
  ];
  const ra = [];
  for (const [ten, src, ghim] of dotBien) {
    const loi = await kiemAC3(src);
    if (!coThongDiep(loi, ghim)) throw new Error(`đột biến «${ten}» không đỏ đúng câu «${ghim}»: ${loi.join(' · ') || '(xanh)'}`);
    ra.push(`${ten} → «${ghim}»`);
  }
  return `ba hình dạng tác tử + trùng + va tên + sổ nối lượt 3 xanh; đỏ: ${ra.join(' · ')}`;
});

// ══ AC-12 · mục tươi CÙNG tệp, tiêu đề chứa tiêu đề carry (nâng phạm vi 07/10) ══════════════
async function kiemAC12(src) {
  const loi = [];
  const c = CARRIED[1];
  const txt = '# Review findings\n\n' + HEAD + MUC(`${c.title} o API xoa`, c.file) + CUM;
  const p = ooc.parse((await chayAC3(txt, src)).findings || '');
  const nCarry = p.findings.filter(f => f.title === `${c.title} (r1 · tệp đã đổi)`).length;
  const nTuoi = p.findings.filter(f => f.title === `${c.title} o API xoa`).length;
  if (nCarry !== 1) loi.push(`mục carry bị nuốt bởi mục tươi cùng tệp (xuất hiện ${nCarry} lần)`);
  if (nTuoi !== 1) loi.push(`mục tươi xuất hiện ${nTuoi} lần`);
  return loi;
}
test('AC-12', 'mục tươi cùng tệp có tiêu đề chứa tiêu đề carry không nuốt mục carry', async () => {
  // Đối chứng dương: tác tử đã in đúng «T (r1)» trên F → một lần.
  const c = CARRIED[1];
  const daIn = '# Review findings\n\n' + HEAD + MUC(`${c.title} (r1)`, c.file, c.plain) + CUM;
  const p0 = ooc.parse((await chayAC3(daIn)).findings || '');
  const n0 = p0.findings.filter(f => f.title.startsWith(c.title)).length;
  if (n0 !== 1) throw new Error(`đối chứng dương hỏng: tác tử đã in «${c.title} (r1)» mà xuất hiện ${n0} lần`);
  const moi = await kiemAC12();
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const sao = tiem("(x.title === c.title || (x.title.startsWith(c.title + ' (') && /^\\([rR]/.test(x.title.slice(c.title.length + 1))))", 'x.title.includes(c.title)');
  const loi = await kiemAC12(sao);
  if (!coThongDiep(loi, 'mục carry bị nuốt bởi mục tươi cùng tệp')) throw new Error(`đột biến khoá «chứa» không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return 'mục carry và mục tươi cùng tệp mỗi mục một lần; đã in đúng nhãn → một lần; khoá «chứa» đỏ đúng câu';
});

// ══ AC-5 · khối ui-check carry giữ khung; thẻ thấy; s4-args lượt kế đọc lại đúng từng byte ═══
const R = 'E2-2026-10-07-0902';
const KHUNG = { screenshot: 'evidence/E2-a.png', observed: 'Đã Read khung: danh sách hiện hai thẻ đang dùng và dòng gập «Đã bỏ (2)».\nDòng hai: ngăn mở có nút «Dùng lại», không chữ bị cắt.', networkObserved: 'clean' };
const E2 = { id: 'E2', criterion: 'AC-2', executor: 'ui-check', cmd: 'ui-check:E2', ref: 'config:executors.test.api', expected: 'thay danh sach', steps: ['mo trang'] };
const baoCaoTacTu = () => [
  '---', 'schema_version: 2', 'feature_slug: demo', 'verdict: PASS', 'enforcement_mode: strict', 'bypass_used: false', `verified_commit: ${VC}`, '---', '',
  '# Evidence Report: demo', '', '## Evidence', '',
  '- eval: E2', `  run_id: ${R}`, '  exit_code: 0', '  baseline: n-a', '  verifier: config:executors.test.api', '  verified_at: 2026-10-07T02:01:02Z',
  '  carried_from_round: 1', '  note: carry-forward tu round 1 — delta khong cham paths cua eval', '',
  '## Analyst', '', 'none', '',
].join('\n');
async function chayAC5(src, coKhung = true) {
  const carried = [{ id: 'E2', runId: R, fromRound: 1, verifiedAt: '2026-10-07T02:01:02Z', cmd: 'ui-check:E2', ...(coKhung ? KHUNG : {}) }];
  const { result } = await runWorkflow(WF, argsGoc({ evals: [...argsGoc().evals, E2], carriedEvals: carried }), traLoi({ report: baoCaoTacTu(), findings: '# Review findings\n' }), src);
  return result;
}
function khoiE2(report) {
  const dong = String(report).split('\n');
  const i = dong.findIndex(l => /^- eval: E2\s*$/.test(l));
  if (i === -1) return null;
  let j = i + 1;
  while (j < dong.length && !/^(-\s|#)/.test(dong[j])) j += 1;
  return dong.slice(i, j).join('\n');
}
function hoSoThe(report) {
  const d = fs.mkdtempSync(path.join(TMP, 'the-'));
  w(d, '_acceptance/demo/contract.md', '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nsurfaces: [ui]\nstatus: verified\n---\n\n- AC-1: Given a When b Then c\n- AC-2: Given a When b Then c\n');
  w(d, '_acceptance/demo/evals.yaml', 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    expected: pass\n  - id: E2\n    criterion: AC-2\n    executor: ui-check\n    layer: ui-observed\n    cmd: config:executors.test.api\n    steps: [mo trang]\n    expected: thay danh sach\n');
  w(d, '_acceptance/demo/evidence-report.md', report);
  const r = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'gate-card.js'), '--root', d, '--slug', 'demo', '--gate', '2', '--extract'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card exit ${r.status}: ${r.stderr}`);
  return JSON.parse(r.stdout).ui_observed;
}
async function kiemAC5(src) {
  const loi = [];
  const r = await chayAC5(src);
  const k = khoiE2(r.report || '');
  if (!k) return ['báo cáo không có khối E2'];
  const coSs = k.includes(`  screenshot: ${KHUNG.screenshot}`);
  const coObs = k.includes('  observed: |\n' + KHUNG.observed.split('\n').map(l => `    ${l}`).join('\n'));
  const coNet = k.includes(`  network_observed: ${KHUNG.networkObserved}`);
  if (!coSs || !coObs || !coNet) return [`khối carry mất khung (screenshot ${coSs} · observed ${coObs} · network ${coNet})`];
  const ev = core.evaluateEvidence(r.report, {});
  if (ev.observedFailures.length) loi.push(`evaluateEvidence báo observed: ${ev.observedFailures.join(' | ')}`);
  const ui = hoSoThe(r.report);
  if (!(ui.present === true && ui.passed === 1)) loi.push(`thẻ: ui_observed ${JSON.stringify(ui)}`);
  // Round-trip ba lượt: báo cáo này thành báo cáo lượt trước của s4-args lượt 3.
  const d = fs.mkdtempSync(path.join(TMP, 'rt-'));
  execFileSync('git', ['init', '-q', '-b', 'main', d]);
  git(d, 'config', 'user.email', 't@t.t'); git(d, 'config', 'user.name', 'T');
  w(d, '_acceptance/config.yaml', 'schema_version: 1\nexecutors:\n  test:\n    api: "echo x"\nfeature_loop:\n  suite_keys:\n    - executors.test.api\n');
  w(d, '_acceptance/demo/contract.md', '---\nschema_version: 1\nslug: demo\nrisk_tier: T2\nstatus: implemented\n---\n\n- AC-1: Given a When b Then c\n- AC-2: Given a When b Then c\n');
  w(d, '_acceptance/demo/evals.yaml', 'schema_version: 1\nfeature_slug: demo\nevals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    cmd: config:executors.test.api\n    paths: [src/**]\n    expected: pass\n  - id: E2\n    criterion: AC-2\n    executor: ui-check\n    cmd: config:executors.test.api\n    paths: [ui/**]\n    steps: [mo trang]\n    expected: thay danh sach\n');
  w(d, 'src/a.js', 'a\n'); w(d, 'ui/p.html', '<p>\n');
  fs.mkdirSync(path.join(d, '_acceptance/demo/evidence'), { recursive: true });
  fs.writeFileSync(path.join(d, '_acceptance/demo', KHUNG.screenshot), Buffer.from('89504e470d0a1a0a', 'hex'));
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'goc'); git(d, 'checkout', '-qb', 'vong');
  fs.appendFileSync(path.join(d, 'src/a.js'), 'b\n'); git(d, 'add', '-A'); git(d, 'commit', '-qm', 'luot 2');
  const s2 = git(d, 'rev-parse', 'HEAD');
  // Sổ lượt 2 = đúng dòng workflow phát, sha lượt 2 thay cho VC của harness.
  w(d, '_acceptance/demo/run-log.jsonl', r.runLog.map(l => l.split(VC).join(s2)).join('\n') + '\n');
  w(d, '_acceptance/demo/evidence-report.md', r.report + '\n## Iterations\n\nRound 1: REJECT.\nRound 2: PASS.\n');
  git(d, 'add', '-A'); git(d, 'commit', '-qm', 'ho so luot 2');
  fs.appendFileSync(path.join(d, 'src/a.js'), 'c\n'); git(d, 'add', '-A'); git(d, 'commit', '-qm', 'sua luot 3');
  const out = path.join(d, 'args.json');
  const s4 = spawnSync(process.execPath, [path.join(ROOT, 'feature-loop', 'scripts', 's4-args.mjs'), '--slug', 'demo', '--root', d, '--ag-root', ROOT, '--out', out, '--diff-base', 'main', '--carry-anchor', s2], { encoding: 'utf8' });
  if (s4.status !== 0) { loi.push(`s4-args lượt 3 exit ${s4.status}: ${String(s4.stderr).split('\n').filter(Boolean).slice(-2).join(' | ')}`); return loi; }
  const ce = (JSON.parse(fs.readFileSync(out, 'utf8')).carriedEvals || []).find(c => c.id === 'E2');
  if (!ce) loi.push('lượt 3: E2 không được carry');
  else if (ce.screenshot !== KHUNG.screenshot || ce.observed !== KHUNG.observed || ce.networkObserved !== KHUNG.networkObserved) loi.push(`lượt 3: khung lệch ${JSON.stringify({ s: ce.screenshot, o: ce.observed, n: ce.networkObserved })}`);
  return loi;
}
test('AC-5', 'khối ui-check carry giữ khung lượt gốc; thẻ thấy bằng chứng; lượt 3 đọc lại từng byte', async () => {
  // Đối chứng dương: carry KHÔNG khung → máy không bịa ảnh, thẻ báo 0.
  const r0 = await chayAC5(undefined, false);
  const k0 = khoiE2(r0.report || '') || '';
  if (/screenshot:/.test(k0)) throw new Error(`đối chứng dương hỏng: carry không khung mà khối có screenshot: ${k0}`);
  const ui0 = hoSoThe(r0.report);
  if (ui0.passed !== 0) throw new Error(`đối chứng dương hỏng: thẻ đếm ${ui0.passed} khi không có khung`);
  const moi = await kiemAC5();
  if (moi.length) throw new Error(`cây đang kiểm: ${moi.join(' · ')}`);
  const sao = tiem('chotTruongNguoi(chenKhungCarry(String((report && report.report) || \'\'), carriedForReport),', 'chotTruongNguoi(String((report && report.report) || \'\'),');
  const loi = await kiemAC5(sao);
  if (!coThongDiep(loi, 'khối carry mất khung')) throw new Error(`đột biến gỡ bước chèn không đỏ đúng câu: ${loi.join(' · ') || '(xanh)'}`);
  return 'khối E2 có đủ ba trường, observed không lỗi, thẻ present/passed 1, lượt 3 đọc lại khớp từng byte; không khung → không bịa; gỡ bước chèn đỏ đúng câu';
});

// ── chạy ─────────────────────────────────────────────────────────────────────
const CHON = (process.env.LSGD_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chay = CASES.filter(c => !CHON.length || CHON.includes(c.id));
if (!chay.length) { console.error(`luot-sua-giu-du (workflow): LSGD_CASES=${process.env.LSGD_CASES} khớp 0 ca`); process.exit(1); }
let pass = 0, fail = 0;
for (const c of chay) {
  try { const m = await c.fn(); console.log(`  PASS: ${c.id} — ${c.name}${m ? ` — ${m}` : ''}`); pass += 1; }
  catch (e) { console.log(`  FAIL: ${c.id} — ${c.name} — ${String(e && e.message || e)}`); fail += 1; }
}
console.log(`\nResults: ${pass} passed, ${fail} failed (luot-sua-giu-du workflow)`);
process.exit(fail ? 1 : 0);
