// tests/scripts/ooc-tac-hai.test.mjs — K7 phía BÊN ĐỌC (AC-9d): thẻ Cổng Bằng chứng.
//   TH1 lib/out-of-contract.js đọc dòng `Tác hại:` (vắng → rỗng, đọc-cũ)
//   TH2 thẻ xếp mục behavior TRƯỚC measure, mục vắng harm xuống cuối
//   TH3 review-findings đời cũ (không dòng Tác hại) → thứ tự viết giữ nguyên, không cờ mới
//   TH_CASES=TH2 node tests/scripts/ooc-tac-hai.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const require = createRequire(import.meta.url);
const ooc = require(path.join(ROOT, 'lib', 'out-of-contract.js'));
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');

const ALL_IDS = ['TH1', 'TH2', 'TH3'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.TH_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'ooc-harm-'));

// Fixture RÚT TỪ KHUÔN bên VIẾT (marker OOC-ITEM-TEMPLATE trong acceptance-verify.js) —
// không gõ tay theo khuôn bên đọc. Writer đổi nhãn thì ca này đỏ, đúng seam
// LLM-viết→máy-đọc (hình dạng 3 của «thước phải gắn vào vật»).
const WF_SRC = readFileSync(path.join(ROOT, 'feature-loop', 'workflows', 'acceptance-verify.js'), 'utf8');
const OOC_TPL = (() => {
  const m = WF_SRC.match(/<<<OOC-ITEM-TEMPLATE\\n([\s\S]*?)\\nOOC-ITEM-TEMPLATE>>>/);
  if (!m) throw new Error('không rút được khuôn OOC-ITEM-TEMPLATE từ acceptance-verify.js — bên viết đổi marker?');
  return m[1].split('\\n').join('\n');
})();
const fillItem = vals => OOC_TPL.split('\n').map(l => l.replace(/\{(\w+)\}/g, (_, k) => (vals[k] !== undefined ? vals[k] : `{${k}}`))).join('\n');
// Mục KHÔNG khai harm = dòng `Tác hại:` vắng hẳn (hồ sơ đời cũ) — bỏ đúng dòng mang {harm}.
const item = (title, harm) => {
  const filled = fillItem({ title, plain: `hậu quả của ${title}.`, file: 'src/x.js', severity: 'medium', harm: harm || '', proposal: 'known-limits' });
  return harm ? filled : filled.split('\n').filter(l => !/^\s*Tác hại:/.test(l)).join('\n');
};
// Thứ tự VIẾT cố ý ngược thứ tự mong đợi — nếu thẻ giữ nguyên thứ tự viết thì TH2 đỏ.
const findingsMd = withHarm => [
  '## Ngoài hợp đồng — người quyết ở Gate 2', '',
  'Các lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.', '',
  item('F-do-chat-thuoc', withHarm ? 'measure' : null),
  item('F-hanh-vi-that', withHarm ? 'behavior' : null),
  item('F-khong-khai', null),
  '',
  'Cụm ngoài vùng phủ: cluster: n-a (không đo được — không eval nào khai paths, hoặc dưới ngưỡng cụm).',
].join('\n');

if (want('TH1')) {
  const id = 'TH1'; const before = failures;
  if (!/Tác hại: \{harm\}/.test(OOC_TPL)) fail(id, `khuôn bên viết không có dòng «Tác hại: {harm}» — bên đọc và bên viết đã trôi khỏi nhau:\n${OOC_TPL}`);
  const withH = ooc.parse(findingsMd(true));
  const noH = ooc.parse(findingsMd(false));
  const byTitle = (r, t) => r.findings.find(f => f.title === t) || {};
  if (byTitle(withH, 'F-hanh-vi-that').harm !== 'behavior') fail(id, `harm behavior không đọc được: ${JSON.stringify(byTitle(withH, 'F-hanh-vi-that'))}`);
  if (byTitle(withH, 'F-do-chat-thuoc').harm !== 'measure') fail(id, 'harm measure không đọc được');
  if (byTitle(withH, 'F-khong-khai').harm !== '') fail(id, `mục không khai harm phải trả rỗng, got ${JSON.stringify(byTitle(withH, 'F-khong-khai').harm)}`);
  if (noH.findings.some(f => f.harm)) fail(id, 'file đời cũ (0 dòng Tác hại) mà vẫn có harm — đọc nhầm');
  if (withH.findings.length !== 3 || noH.findings.length !== 3) fail(id, `số mục phải 3/3, got ${withH.findings.length}/${noH.findings.length}`);
  if (failures === before) pass(id, 'đọc Tác hại: behavior · measure · rỗng; file đời cũ không sinh harm giả');
}

// Thẻ Cổng Bằng chứng: dựng workspace verified rồi render HTML
const mkWs = md => {
  const r = tmp();
  W(r, '_acceptance/config.yaml', 'schema_version: 1\n');
  W(r, '_acceptance/x/contract.md', ['---', 'schema_version: 1', 'feature: x', 'slug: x', 'risk_tier: T2',
    'surfaces: [api]', 'status: verified', 'approved_by: Manh Phan', 'approved_at: 2026-09-08', '---', '',
    '## Criteria', '', '- AC-1: Given a, When b, Then c.', '', '## Out of scope', '', '- x', ''].join('\n'));
  W(r, '_acceptance/x/evals.yaml', 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n');
  W(r, '_acceptance/x/evidence-report.md', '---\nschema_version: 1\nfeature_slug: x\nverdict: PASS\n---\n\n## Evidence\n- eval: E1\n  run_id: x-E1-001\n  exit_code: 0\n  verifier: verify.sh\n  verified_at: 2026-09-08\n');
  W(r, '_acceptance/x/review-findings.md', md);
  return r;
};
const html = r => spawnSync(process.execPath, [GATE_CARD, '--root', r, '--slug', 'x'], { encoding: 'utf8' }).stdout.replace(/\x1b\[[0-9;]*m/g, '');
const orderOf = (h, titles) => titles.map(t => h.indexOf(t));

if (want('TH2')) {
  const id = 'TH2'; const before = failures;
  const r = mkWs(findingsMd(true));
  const h = html(r);
  const [iMeasure, iBehavior, iNone] = orderOf(h, ['F-do-chat-thuoc', 'F-hanh-vi-that', 'F-khong-khai']);
  if (iBehavior < 0 || iMeasure < 0 || iNone < 0) fail(id, `thẻ không in đủ ba mục (${iBehavior}/${iMeasure}/${iNone})`);
  else {
    if (!(iBehavior < iMeasure)) fail(id, 'mục behavior phải đứng TRƯỚC measure trên thẻ');
    if (!(iMeasure < iNone)) fail(id, 'mục vắng harm phải xuống cuối');
  }
  rmSync(r, { recursive: true, force: true });
  if (failures === before) pass(id, 'thẻ xếp behavior → measure → vắng harm');
}

if (want('TH3')) {
  const id = 'TH3'; const before = failures;
  const r = mkWs(findingsMd(false));
  const h = html(r);
  const [i1, i2, i3] = orderOf(h, ['F-do-chat-thuoc', 'F-hanh-vi-that', 'F-khong-khai']);
  if (i1 < 0 || i2 < 0 || i3 < 0) fail(id, 'thẻ đời-cũ không in đủ ba mục');
  else if (!(i1 < i2 && i2 < i3)) fail(id, 'file đời cũ phải GIỮ thứ tự viết (đọc-cũ), thẻ đang sắp lại');
  if (/Tác hại/.test(h)) fail(id, 'thẻ in nhãn Tác hại cho file đời cũ (không có dữ liệu)');
  rmSync(r, { recursive: true, force: true });
  if (failures === before) pass(id, 'file đời cũ: giữ thứ tự viết, không nhãn mới');
}

console.log(failures === 0 ? `ooc-tac-hai: OK (${ALL_IDS.filter(want).join(', ')})` : `ooc-tac-hai: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
