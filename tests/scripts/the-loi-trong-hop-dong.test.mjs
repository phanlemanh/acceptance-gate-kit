#!/usr/bin/env node
// Lượt chấm có thể trả PASS khi còn lỗi TRONG hợp đồng mức vừa (chỉ mức nặng mới tự trả lại). Lỗi ấy nằm ở mục
// «## Trong hợp đồng» của review-findings.md, mà thẻ Cổng Bằng chứng và trang bằng chứng trước đây không đọc: thẻ ghi
// «máy đã xong — ký nhanh» trong khi người ký không thấy lỗi. Gốc: _acceptance/do-tuong-phan-lab-oklab lượt chấm 2
// (PR 489 — lỗi AC-10), trước đó hạt giống docs/plans/2026-10-20-hat-giong-the-pass-giau-muc-trong-hop-dong.md.
//
// Chạy trọn: node tests/scripts/the-loi-trong-hop-dong.test.mjs
// Một nhóm:  TL_CASES=TL-1,TL-2 node tests/scripts/the-loi-trong-hop-dong.test.mjs   (khớp 0 ca → thoát 1)
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { runWorkflow } from '../workflows/harness.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const BASE = 'c8fa5a65'; // main ngay trước bản vá: chiều đỏ của lỗ chạy trên chính mã này.
const CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const PAGE = path.join(ROOT, 'scripts', 'evidence-page.js');
const WF = path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js');
const WF_SRC = fs.readFileSync(WF, 'utf8');
const req = createRequire(import.meta.url);

const TMP = fs.mkdtempSync(path.join(os.tmpdir(), 'tl-'));
process.on('exit', () => { try { fs.rmSync(TMP, { recursive: true, force: true }); } catch { /* dọn tạm */ } });

const AC_CAU = 'Given tệp giao diện có mã màu thô thật, When chạy bước chấm, Then mã màu vẫn bị chặn';
const CONTRACT = `---\nschema_version: 1\nfeature: Đo tương phản\nslug: demo\nrisk_tier: T2\nstatus: verified\n---\n## Criteria\n- AC-1: Given a, When b, Then c.\n- AC-10: ${AC_CAU}.\n## Out of scope\n`;
const report = (verdict = 'PASS') => `---\nschema_version: 2\nfeature_slug: demo\nverdict: ${verdict}\nfailed_evals: []\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff:\n---\n\n# Evidence Report: demo\n\n| Eval | Criterion | Executor | Verdict |\n|---|---|---|---|\n| E1 | AC-1 | script | PASS |\n\n## Evidence\n\n- eval: E1\n  run_id: minted-demo-E1-r2\n  exit_code: 0\n  baseline: n-a\n  verifier: config:executors.test.demo\n  verified_at: 2026-11-10T02:10:13Z\n  output: |\n    ok\n\n## Known limits\n\n## Ngoài hợp đồng\n`;

// Tiêu đề và chi tiết là văn kỹ thuật thật của lỗi AC-10 — phải KHÔNG tới mắt người ký trên thẻ.
const TITLE = 'Dấu `/` đã thoát trong regex bị coi là mở chú thích, S4 bỏ sót hex thô thật mà vẫn thoát 0';
const TITLE_ESC = 'Dấu <code>/</code>';
const DETAIL_KT = 'Điều kiện ở dòng 66 không loại ký tự thoát';
const PLAIN = 'Một số mã màu thô thật trong tệp giao diện bị bỏ sót, nên bước chấm vẫn báo sạch dù tệp còn lỗi.';
const muc = ({ plain = PLAIN, title = TITLE, sev = 'medium', ac = 'AC-10' } = {}) =>
  `- **${title}**\n${plain ? `  Người dùng thấy gì: ${plain}\n` : ''}  file: \`scripts/design-floor-s4.mjs:66\`\n  severity: ${sev}\n  AC: ${ac}\n  source: bugs\n  detail: ${DETAIL_KT}\n  rationale: AC-10 đòi không cắt quá tay.\n`;
const IN = (...items) => `## Trong hợp đồng\n\n${items.join('\n')}\n`;
const CUOI = '\nCụm ngoài vùng phủ: cluster: n-a (không đo được).\n';

let so = 0;
const hoSo = ({ findings, verdict = 'PASS', contract = CONTRACT } = {}) => {
  const root = path.join(TMP, `r${++so}`), dir = path.join(root, '_acceptance', 'demo');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'contract.md'), contract);
  fs.writeFileSync(path.join(dir, 'evidence-report.md'), report(verdict));
  if (findings != null) fs.writeFileSync(path.join(dir, 'review-findings.md'), findings);
  return root;
};
const the = (root, tep = CARD, them = []) => {
  const r = spawnSync('node', [tep, '--root', root, '--slug', 'demo', ...them], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`gate-card thoát ${r.status}: ${r.stderr}`);
  return r.stdout;
};
const trang = (root, tep = PAGE) => {
  const r = spawnSync('node', [tep, '--root', root, '--slug', 'demo'], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`evidence-page thoát ${r.status}: ${r.stderr}`);
  return fs.readFileSync(path.join(root, '_acceptance', 'demo', 'evidence-page.html'), 'utf8');
};
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const co = (t, s, ten) => { if (!t.includes(s)) throw new Error(`${ten}: thiếu «${s}»`); };
const khong = (t, s, ten) => { if (t.includes(s)) throw new Error(`${ten}: không được có «${s}»`); };
const MOI_KY = 'ký nhanh';

const CASES = [];
const test = (id, fn) => CASES.push({ id, fn });

// Chiều đỏ giữ vĩnh viễn: mã trước bản vá, cùng hồ sơ, đúng hai triệu chứng của lỗ.
test('TL-0-do', () => {
  const d = path.join(TMP, 'base');
  fs.mkdirSync(d);
  execFileSync('bash', ['-c', `git -C "${ROOT}" archive ${BASE} scripts lib feature-loop commands skills | tar -x -C "${d}"`]);
  const root = hoSo({ findings: IN(muc()) + CUOI });
  const c = the(root, path.join(d, 'scripts', 'gate-card.js'));
  co(c, MOI_KY, 'thẻ cũ phải còn lời mời ký nhanh (chiều đỏ)');
  khong(c, esc(PLAIN), 'thẻ cũ không được in lỗi (chiều đỏ)');
  khong(trang(root, path.join(d, 'scripts', 'evidence-page.js')), esc(PLAIN), 'trang cũ không được in lỗi (chiều đỏ)');
});

test('TL-1', () => {
  // PASS + một lỗi mức vừa: hết lời mời ký nhanh, câu tiếng sản phẩm có mặt, văn kỹ thuật thì không.
  const c = the(hoSo({ findings: IN(muc()) + CUOI }));
  khong(c, MOI_KY, 'thẻ');
  co(c, 'cần bạn quyết', 'thẻ');
  co(c, esc(PLAIN), 'thẻ');
  co(c, 'AC-10', 'thẻ');
  khong(c, TITLE_ESC, 'thẻ');
  khong(c, esc(TITLE), 'thẻ');
  khong(c, DETAIL_KT, 'thẻ');
  khong(c, 'không lỗi', 'thẻ');
});

test('TL-2', () => {
  // Mọi lỗi đều hiện, kể cả khi mục đầu đọc được và mục sau mức khác.
  const P2 = 'Người dùng thấy số liệu của tuần trước dù đã bấm tải lại.';
  const c = the(hoSo({ findings: IN(muc(), muc({ plain: P2, title: 'tieu de hai', sev: 'low', ac: 'AC-1' })) + CUOI }));
  co(c, esc(PLAIN), 'mục 1'); co(c, esc(P2), 'mục 2');
  co(c, 'còn 2 lỗi trong hợp đồng', 'nhãn đầu thẻ');
  co(c, 'Lỗi trong hợp đồng còn mở (2)', 'tiêu đề khối');
});

test('TL-3', () => {
  // Trang bằng chứng: khối đứng NGOÀI mọi mục gập, trước mục đầu tiên.
  const p = trang(hoSo({ findings: IN(muc()) + CUOI }));
  co(p, esc(PLAIN), 'trang');
  const i = p.indexOf('data-loi-trong-hop-dong'), j = p.indexOf('id="vi-sao"');
  if (i < 0 || j < 0 || i > j) throw new Error(`khối phải đứng trước mục gập đầu tiên (${i} / ${j})`);
  co(p, 'AC-10', 'trang');
  // Văn kỹ thuật chỉ ở phần gập của khối, không ở chỗ đọc đầu tiên.
  const cau = p.slice(i, p.indexOf('</section>', i));
  const lo = cau.indexOf(esc(TITLE));
  if (lo >= 0 && lo < cau.indexOf('<details')) throw new Error('tiêu đề kỹ thuật lộ trước phần gập');
});

test('TL-4', () => {
  // Hồ sơ chấm bằng bản kit trước khi có dòng tiếng sản phẩm (đúng hình ca thật): vẫn hiện, bằng chính lời tiêu chí đã
  // duyệt — không bao giờ lấy tiêu đề kỹ thuật lấp chỗ trống — và vẫn mất lời mời ký nhanh.
  const root = hoSo({ findings: IN(muc({ plain: '' })) + CUOI });
  const c = the(root);
  khong(c, MOI_KY, 'thẻ');
  co(c, esc(AC_CAU), 'thẻ');
  co(c, 'chưa có mô tả cho người đọc', 'thẻ');
  khong(c, esc(TITLE), 'thẻ');
  co(trang(root), esc(AC_CAU), 'trang');
});

test('TL-5', () => {
  // Sai khuôn phải kêu to chứ không lặng thành «không có lỗi» (cùng lớp với bộ đọc mục ngoài hợp đồng).
  for (const than of ['- [medium] thu viet khac khuon: `a.js` lam hong AC-1\n', 'Có một lỗi ở **màn tạo** làm hỏng AC-1.\n']) {
    const root = hoSo({ findings: `## Trong hợp đồng\n\n${than}` + CUOI });
    const c = the(root);
    khong(c, MOI_KY, `thẻ [${than.slice(0, 12)}]`);
    co(c, 'máy không đọc ra', `thẻ [${than.slice(0, 12)}]`);
    co(trang(root), 'máy không đọc ra', `trang [${than.slice(0, 12)}]`);
  }
});

test('TL-6', () => {
  // Không báo động giả: không có lỗi trong hợp đồng thì lời mời giữ nguyên.
  for (const f of [null, '', '## Trong hợp đồng\n\n(không có)\n' + CUOI, '## Trong hợp đồng\n\n' + CUOI, '## Ngoài hợp đồng — người quyết ở Gate 2\n\n(rỗng)\n']) {
    const root = hoSo({ findings: f });
    const c = the(root);
    co(c, MOI_KY, `thẻ [${f && f.slice(0, 24)}]`);
    khong(c, 'Lỗi trong hợp đồng còn mở', `thẻ [${f && f.slice(0, 24)}]`);
    khong(trang(root), 'data-loi-trong-hop-dong', `trang [${f && f.slice(0, 24)}]`);
  }
});

test('TL-7', () => {
  // Thẻ không được viết sẵn chữ quyết: ô ký vẫn trống, chỉ nói ký nghĩa là gì.
  const root = hoSo({ findings: IN(muc()) + CUOI });
  const c = the(root);
  co(c, 'ký hay trả: ___', 'dòng trả lời');
  co(c, 'giao kèm', 'hệ quả của chữ ký');
  const x = JSON.parse(the(root, CARD, ['--extract']));
  if (!x.in_contract || x.in_contract.findings.length !== 1 || x.in_contract.findings[0].plain !== PLAIN) throw new Error(`--extract thiếu lỗi: ${JSON.stringify(x.in_contract)}`);
  if (!x.routing.hoi.includes('ký hay trả')) throw new Error('--extract: mất câu hỏi ký hay trả');
});

test('TL-8', () => {
  // Thẻ đang đỏ (mức nặng làm phán quyết REJECT) cũng phải nói vì sao bằng tiếng sản phẩm.
  const c = the(hoSo({ verdict: 'REJECT', findings: IN(muc({ sev: 'high' })) + CUOI }));
  co(c, esc(PLAIN), 'thẻ REJECT');
});

// ── Bên VIẾT: khuôn của tác tử tổng hợp đi qua đúng bộ đọc, và tác tử phân loại được đòi câu tiếng sản phẩm. ──
const khuon = src => {
  const m = src.match(/<<<IC-ITEM-TEMPLATE\\n([\s\S]*?)IC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('không rút được IC-ITEM-TEMPLATE từ workflow');
  return m[1].replace(/\\n/g, '\n').replace(/\\`/g, '`');
};
const dien = (tpl, v) => tpl.replace(/\{(\w+)\}/g, (_, k) => (k in v ? v[k] : ''));

test('TL-9', () => {
  const doc = req(path.join(ROOT, 'scripts', 'loi-trong-hop-dong.cjs'));
  const M = { title: 'tieu de ky thuat', plain: PLAIN, file: 'src/x.ts:10', severity: 'medium', acRef: 'AC-10', detail: 'chi tiet', source: 'bugs', rationale: 'ly do' };
  const f = doc.parse('## Trong hợp đồng\n\n' + dien(khuon(WF_SRC), M) + '\n').findings;
  if (f.length !== 1) throw new Error(`bộ đọc ra ${f.length} mục, phải 1`);
  for (const [a, b] of [['title', 'title'], ['plain', 'plain'], ['file', 'file'], ['severity', 'severity'], ['ac', 'acRef'], ['detail', 'detail']]) {
    if (f[0][a] !== M[b]) throw new Error(`trường ${a} lệch: [${f[0][a]}] ≠ [${M[b]}]`);
  }
});

const VC = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
const argsGoc = {
  slug: 'demo', round: 1, riskTier: 'T2',
  evals: [{ id: 'E1', criterion: 'AC-1', executor: 'test', cmd: 'pnpm test', ref: 'config:executors.test.api', expected: 'pass' }],
  suiteCommands: ['npm run build'], diffBase: 'main', repoRoot: '/repo',
  personasPath: '/refs/judge-personas.md', templatePath: '/refs/evidence-report-template.md',
  contractPath: '/repo/_acceptance/demo/contract.md', invokedAt: '2026-10-14T03:00:00Z', invokedSha: VC,
};
const FIND = { title: 'regex bo sot', file: 'src/a.ts', line: 3, severity: 'medium', detail: 'chi tiet ky thuat' };
const traLoi = call => {
  const l = call.label;
  if (l.startsWith('machine:')) return { exitCode: 0, outputTail: 'all green\n__EXIT=0', runId: '', cannotRun: false };
  if (l.startsWith('judge:')) return { verdict: 'PASS', rationale: 'fits intent' };
  if (l.startsWith('review:')) return { findings: l === 'review:bugs' ? [FIND] : [] };
  if (l.startsWith('refute:')) return { refuted: false, reason: 'that' };
  if (l.startsWith('baseline:')) return { results: [] };
  if (l === 'triage') {
    const tid = (call.prompt.match(/"tid":"([^"]+)"/) || [])[1];
    return { contractUnreadable: false, triaged: [{ tid, title: FIND.title, file: FIND.file, inContract: true, acRef: 'AC-10', rationale: 'hong AC-10', plain: PLAIN, proposal: '', can_cu: '' }] };
  }
  if (l === 'synthesize:report') return { report: '# Evidence demo', findings: '## Trong hợp đồng\n' };
  return {};
};

test('TL-10', async () => {
  // Lượt chấm thật qua harness: lỗi mức vừa vẫn PASS (không đổi luật phán quyết), câu tiếng sản phẩm đi tới tác tử tổng hợp.
  const r = await runWorkflow(WF, argsGoc, traLoi);
  if (r.result.verdict !== 'PASS') throw new Error(`verdict ${r.result.verdict}, phải PASS`);
  if ((r.result.rejectFindings || []).length !== 1 || r.result.rejectFindings[0].plain !== PLAIN) throw new Error(`rejectFindings mất câu tiếng sản phẩm: ${JSON.stringify(r.result.rejectFindings)}`);
  const triage = r.calls.find(c => c.label === 'triage');
  co(triage.prompt, 'inContract=true: BAT BUOC viet them plain', 'lời nhắc phân loại');
  const synth = r.calls.find(c => c.label === 'synthesize:report');
  co(synth.prompt, PLAIN, 'lời nhắc tổng hợp');
  co(synth.prompt, '<<<IC-ITEM-TEMPLATE', 'lời nhắc tổng hợp');
});

const chon = (process.env.TL_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const chay = chon.length ? CASES.filter(c => chon.includes(c.id)) : CASES;
if (!chay.length) { console.log('FAIL: TL_CASES không khớp ca nào'); process.exit(1); }
let hong = 0;
for (const c of chay) {
  try { await c.fn(); console.log(`PASS: ${c.id}`); } catch (e) { hong++; console.log(`FAIL: ${c.id} — ${e.message}`); }
}
console.log(`TL Results: ${chay.length - hong} PASS · ${hong} FAIL`);
process.exit(hong ? 1 : 0);
