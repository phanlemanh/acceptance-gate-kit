// tests/scripts/w6-w8-pham-vi.test.mjs — K3 của gom-duc-ket-2-10-0 (AC-5).
//   PV1 W6 chỉ quét `## Criteria` (cặp cùng fixture: alias ngoài Criteria im, trong Criteria kêu)
//   PV2 định danh ASCII gạch nối là MỘT từ; ghép gạch nối tiếng Việt thì KHÔNG (ba chiều)
//   PV3 CONTEXT.md khai `_Allow_` cho từ đa nghĩa; hợp đồng thật của kit hết kêu vì chúng
//   PV4 W8 không còn nhánh token-lạ; nghĩa vụ + nhãn lạc chỗ vẫn kêu
//   PV5 suite bash: ca L47 đã gỡ, L42m chứng bản sao ĐÃ CHẠY bằng token_la
// Fixture code-sinh; đường dẫn suy từ import.meta.url; mỗi luật có cặp hai chiều.
//   PV_CASES=PV2 node tests/scripts/w6-w8-pham-vi.test.mjs
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..', '..');
const LINT = path.join(ROOT, 'scripts', 'eval-coverage-lint.js');

const ALL_IDS = ['PV1', 'PV2', 'PV3', 'PV4', 'PV5'];
if (process.argv.includes('--ids')) { console.log(ALL_IDS.join(' ')); process.exit(0); }
const only = (process.env.PV_CASES || '').split(',').map(s => s.trim()).filter(Boolean);
const want = id => only.length === 0 || only.includes(id);
let failures = 0;
const pass = (id, m) => console.log(`  PASS: ${id} — ${m}`);
const fail = (id, m) => { console.log(`  FAIL: ${id} — ${m}`); failures++; };
const tmp = () => mkdtempSync(path.join(tmpdir(), 'w6w8-'));
const W = (root, rel, s) => { const p = path.join(root, rel); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, s); return p; };

const CTX = [
  '# CONTEXT', '',
  '**Eval**:', 'Một phép đo của hợp đồng.', '_Avoid_: check', '',
  '**Contract**:', 'Bản chuẩn hoá yêu cầu.', '_Avoid_: thẻ', '',
  '**Cổng trước merge**:', 'Lưới CI.', '_Avoid_: pre-merge', '',
].join('\n');

// Hợp đồng fixture: ba vùng chữ (Context · Criteria · Notes) để đo PHẠM VI quét.
const contract = ({ ctx = '', crit = '- AC-1: Given a, When b, Then c.', notes = '' }) => [
  '---', 'schema_version: 1', 'feature: f', 'slug: feat-pv', 'risk_tier: T2',
  'surfaces: [api]', 'status: approved', 'approved_by: Manh Phan', 'approved_at: 2026-09-08', '---', '',
  '# Acceptance Contract: feat-pv', '', '## Context', '', ctx, '', '## Criteria', '', crit, '',
  '## Out of scope', '', '- x', '', '## Notes', '', notes, '',
].join('\n');
const EVALS = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: test\n    expected: "x"\n';

const mkRepo = ({ ctx, crit, notes, withCtxFile = true, surfaces }) => {
  const r = tmp();
  W(r, '_acceptance/config.yaml', 'schema_version: 1\n');
  let c = contract({ ctx, crit, notes });
  if (surfaces) c = c.replace(/^surfaces:.*$/m, `surfaces: [${surfaces}]`);
  W(r, '_acceptance/feat-pv/contract.md', c);
  W(r, '_acceptance/feat-pv/evals.yaml', EVALS);
  if (withCtxFile) W(r, 'CONTEXT.md', CTX);
  return r;
};
const lint = r => spawnSync(process.execPath, [LINT, r], { encoding: 'utf8' }).stdout;
const w6Lines = out => out.split('\n').filter(l => /\] W6 /.test(l));
const w6Has = (out, alias) => w6Lines(out).some(l => l.includes(`uses "${alias}"`));

// ─── PV1 — phạm vi quét = section Criteria ───────────────────────────────────
if (want('PV1')) {
  const id = 'PV1'; const before = failures;
  const outside = mkRepo({ ctx: 'Vòng trước dùng thẻ của cổng để trình.', notes: 'Ghi chú: thẻ cũ.' });
  const inside = mkRepo({ crit: '- AC-1: Given thẻ hiển thị, When mở, Then thấy.' });
  const oOut = lint(outside); const oIn = lint(inside);
  if (w6Has(oOut, 'thẻ')) fail(id, `alias NGOÀI Criteria vẫn kêu: ${w6Lines(oOut).join(' | ')}`);
  if (!w6Has(oIn, 'thẻ')) fail(id, `alias TRONG Criteria không kêu (phép đo chết?): ${JSON.stringify(w6Lines(oIn))}`);
  rmSync(outside, { recursive: true, force: true }); rmSync(inside, { recursive: true, force: true });
  if (failures === before) pass(id, 'W6 chỉ quét ## Criteria (cặp cùng fixture)');
}

// ─── PV2 — định danh ASCII gạch nối là một từ ────────────────────────────────
if (want('PV2')) {
  const id = 'PV2'; const before = failures;
  // (a) alias nằm trong ĐỊNH DANH ASCII → im
  const a = mkRepo({ crit: '- AC-1: Given eval `x`, When chạy ui-check, Then xanh.'.replace(/`x`/, 'x') });
  const oa = lint(a);
  if (w6Has(oa, 'check')) fail(id, `alias "check" kêu bên trong định danh ui-check: ${w6Lines(oa).join(' | ')}`);
  // (b) ghép gạch nối TIẾNG VIỆT không phải định danh → alias bên trong VẪN kêu
  const b = mkRepo({ crit: '- AC-1: Given thẻ-cổng-2 mở, When check-lại, Then xong.' });
  const ob = lint(b);
  if (!w6Has(ob, 'check')) fail(id, `"check-lại" phải kêu alias check (mù gạch nối): ${JSON.stringify(w6Lines(ob))}`);
  if (!w6Has(ob, 'thẻ')) fail(id, `"thẻ-cổng-2" phải kêu alias thẻ: ${JSON.stringify(w6Lines(ob))}`);
  // (c) alias TỰ LÀ định danh → vẫn khớp nguyên vẹn (mask không được nuốt nó)
  const c = mkRepo({ crit: '- AC-1: Given pre-merge chạy, When xong, Then xanh.' });
  const oc = lint(c);
  if (!w6Has(oc, 'pre-merge')) fail(id, `alias pre-merge (tự là định danh) không kêu: ${JSON.stringify(w6Lines(oc))}`);
  for (const r of [a, b, c]) rmSync(r, { recursive: true, force: true });
  if (failures === before) pass(id, 'ui-check im · check-lại/thẻ-cổng-2 kêu · pre-merge vẫn khớp (ba chiều)');
}

// ─── PV3 — _Allow_ cho từ đa nghĩa trong CONTEXT.md thật ─────────────────────
if (want('PV3')) {
  const id = 'PV3'; const before = failures;
  const ctx = readFileSync(path.join(ROOT, 'CONTEXT.md'), 'utf8');
  const allow = [...ctx.matchAll(/^_Allow_\s*:\s*(.+)$/gim)].flatMap(m => m[1].split(/[,;·]/).map(s => s.replace(/[`*_]/g, '').trim()));
  for (const w of ['thẻ', 'hook', 'engine', 'test', 'check', 'tag']) {
    if (!allow.some(a => a.toLowerCase() === w)) fail(id, `CONTEXT.md chưa khai _Allow_ cho từ đa nghĩa "${w}" (đang có: ${allow.join(', ')})`);
  }
  // cây thật: hợp đồng của kit hết kêu vì mấy từ đó
  const out = spawnSync(process.execPath, [LINT, ROOT], { encoding: 'utf8' }).stdout;
  const noisy = w6Lines(out).filter(l => /uses "(thẻ|hook|engine|test|check|tag)"/i.test(l));
  if (noisy.length) fail(id, `cây kit còn ${noisy.length} dòng W6 vì từ đa nghĩa: ${noisy.slice(0, 2).join(' | ')}`);
  if (failures === before) pass(id, `_Allow_ khai đủ 6 từ đa nghĩa; cây kit còn ${w6Lines(out).length} dòng W6 (từ 127)`);
}

// ─── PV4 — W8 bỏ nhánh token-lạ, giữ nghĩa vụ + lạc chỗ ──────────────────────
if (want('PV4')) {
  const id = 'PV4'; const before = failures;
  const EV_UI = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "x"\n';
  const EV_LAC = 'evals:\n  - id: E1\n    criterion: AC-1\n    executor: ui-check\n    layer: ui-observed\n    expected: "x"\n  - id: E2\n    criterion: AC-1\n    executor: test\n    layer: ui-observed\n    expected: "y"\n';
  const mk = (surfaces, evals) => { const r = mkRepo({ surfaces }); W(r, '_acceptance/feat-pv/evals.yaml', evals); return r; };
  const tokenLine = o => o.split('\n').filter(l => /W8 surfaces carry token/.test(l));
  const oblLine = o => o.split('\n').filter(l => /W8 surfaces include a human-visible/.test(l));
  const lacLine = o => o.split('\n').filter(l => /W8 .*lạc chỗ/.test(l));

  const r1 = mk('ui, kiosk', EV_UI); const o1 = lint(r1);
  if (tokenLine(o1).length) fail(id, `nhánh token-lạ vẫn nổ: ${tokenLine(o1)[0]}`);
  const r2 = mk('ui, kiosk', EVALS); const o2 = lint(r2);
  if (!oblLine(o2).length) fail(id, 'nghĩa vụ ui-check không kêu khi thiếu (răng chết cùng nhánh token?)');
  if (tokenLine(o2).length) fail(id, `nhánh token-lạ vẫn nổ (ca thiếu ui-check): ${tokenLine(o2)[0]}`);
  const r3 = mk('ui', EV_LAC); const o3 = lint(r3);
  if (!lacLine(o3).length) fail(id, 'nhãn lạc chỗ không kêu');
  for (const r of [r1, r2, r3]) rmSync(r, { recursive: true, force: true });
  if (failures === before) pass(id, 'token-lạ im; nghĩa vụ + lạc chỗ vẫn kêu (ba fixture)');
}

// ─── PV5 — suite bash đã theo luật mới ───────────────────────────────────────
if (want('PV5')) {
  const id = 'PV5'; const before = failures;
  const sh = readFileSync(path.join(ROOT, 'tests', 'scripts', 'run-tests.sh'), 'utf8');
  const l47Case = sh.split('\n').filter(l => /\bL47\b/.test(l) && /(mk_lnt|\bok\b|\bko\b|w8 )/.test(l));
  if (l47Case.length) fail(id, `ca L47 (token lạ) còn chạy trong suite dù nhánh đã gỡ: ${l47Case[0].trim().slice(0, 80)}`);
  const l42m = sh.split('\n').filter(l => /L42m/.test(l)).join('\n');
  if (!l42m) fail(id, 'không tìm thấy ca L42m');
  else if (!/token_la/.test(l42m)) fail(id, 'L42m chưa chứng bản sao ĐÃ CHẠY bằng token_la (chỉ đọc sự VẮNG của nhánh nghĩa vụ)');
  if (failures === before) pass(id, 'L47 đã gỡ; L42m chứng bản sao đã chạy');
}

console.log(failures === 0 ? `w6-w8-pham-vi: OK (${ALL_IDS.filter(want).join(', ')})` : `w6-w8-pham-vi: ${failures} FAILED`);
process.exit(failures === 0 ? 0 : 1);
