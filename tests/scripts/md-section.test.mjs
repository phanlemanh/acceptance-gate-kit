// Luật ranh giới section markdown — bảng marker phải là thứ code THẬT SỰ đọc.
// Fixture code-sinh; mọi assertion âm tính có đối chứng dương cùng harness +
// ghim thông điệp nguyên văn (luật CLAUDE.md + 2 P0 của gap-probe S1).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require0 = (rel) => createRequire(import.meta.url)(path.join(ROOT_FOR_REQ, rel));

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const ROOT_FOR_REQ = ROOT;
const LIB = path.join(ROOT, 'lib', 'md-section.cjs');
const GATE_CARD = path.join(ROOT, 'scripts', 'gate-card.js');
const EVIDENCE_PAGE = path.join(ROOT, 'scripts', 'evidence-page.js');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };

// Rút bảng luật TỪ MARKER (khuôn P55: rút-từ-writer, không chép tay)
function boundaryTable(libText) {
  const m = libText.match(/<<<SECTION-BOUNDARY-TABLE\n([\s\S]*?)SECTION-BOUNDARY-TABLE>>>/);
  if (!m) throw new Error('KHONG rut duoc bang SECTION-BOUNDARY-TABLE');
  const out = {};
  for (const l of m[1].split('\n')) {
    const mm = l.match(/^\s*\/\/\s*([A-Za-z ]+?)\s*->\s*(any-heading|same-or-higher)\s*$/);
    if (mm) out[mm[1].trim()] = mm[2];
  }
  return out;
}

// ---------- fixture builders (code sinh, không chép tay) ----------
const ROW = (sev, tag) => `| ${sev} | evals | gap-${tag} | fail-${tag} | m-${tag} | fixed: ${tag} |`;
const TABLE = (...rows) => ['| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |', '|---|---|---|---|---|---|', ...rows].join('\n');

function gapProbe({ verdict = 'findings', rows = [ROW('P1', 'real')], tail = '' } = {}) {
  return `---\nslug: x\nat: 2026-07-25T00:00:00Z\nverdict: ${verdict}\np0: 0\np1: 1\np2: 0\n---\n\n# Gap-probe\n\n## Findings\n\n${TABLE(...rows)}\n${tail}`;
}
const GHOST_TAIL = `\n### Notes\n\n${TABLE(ROW('P0', 'ghost1'))}\n\n# Appendix\n\n${TABLE(ROW('P0', 'ghost2'))}\n`;

function contractWithSubheading(n = 5) {
  const acs = [];
  for (let i = 1; i <= n; i++) {
    if (i === 3) acs.push('### nhóm phụ\n');
    acs.push(`- AC-${i}: Given điều kiện ${i}, When hành động ${i}, Then kết quả ${i}.`);
  }
  return `---\nschema_version: 2\nfeature: "fixture"\nslug: fx\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n# Acceptance contract — fx\n\n## Criteria\n\n${acs.join('\n')}\n\n## Coverage\n\n- trục A: AC-1\n\n## Out of scope\n\n- không làm X\n- không làm Y\n`;
}

function mkWs(root, slug, { contract, probe, report } = {}) {
  const d = path.join(root, '_acceptance', slug);
  mkdirSync(d, { recursive: true });
  if (contract) writeFileSync(path.join(d, 'contract.md'), contract);
  if (probe) writeFileSync(path.join(d, 'gap-probe.md'), probe);
  if (report) writeFileSync(path.join(d, 'evidence-report.md'), report);
  return d;
}
const runCard = (root, slug, script = GATE_CARD, extra = []) =>
  spawnSync('node', [script, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });

// ---------- FSB5: bảng rút được từ marker + đột biến ----------
{
  const libText = readFileSync(LIB, 'utf8');
  check('FSB5 bảng rút từ marker khai đủ Findings + default', () => {
    const t = boundaryTable(libText);
    assert.equal(t['Findings'], 'any-heading');
    assert.equal(t['default'], 'same-or-higher');
  });
  check('FSB5 đối chứng đột biến: xoá marker → đúng thông điệp KHONG rut duoc bang', () => {
    assert.throws(() => boundaryTable(libText.replace('<<<SECTION-BOUNDARY-TABLE', 'XXX')),
      /KHONG rut duoc bang SECTION-BOUNDARY-TABLE/);
  });
}

// ---------- FSB1: 0 hàng ma + đối chứng dương ----------
{
  const root = mkdtempSync(path.join(tmpdir(), 'fsb1-'));
  mkWs(root, 'ghost', { contract: contractWithSubheading(2), probe: gapProbe({ tail: GHOST_TAIL }) });
  mkWs(root, 'plain', { contract: contractWithSubheading(2), probe: gapProbe() });
  const g = JSON.parse(runCard(root, 'ghost', GATE_CARD, ['--extract']).stdout);
  const p = JSON.parse(runCard(root, 'plain', GATE_CARD, ['--extract']).stdout);
  check('FSB1 bảng ở ### Notes / # Appendix KHÔNG thành hàng finding; dãy hàng == đối chứng dương', () => {
    assert.equal(g.gap_probe.rows.length, 1, `được ${g.gap_probe.rows.length} hàng`);
    assert.deepEqual(g.gap_probe.rows, p.gap_probe.rows);
    assert.ok(!JSON.stringify(g).includes('ghost1') && !JSON.stringify(g).includes('ghost2'));
  });
  rmSync(root, { recursive: true, force: true });
}

// ---------- FSB2: cờ mâu thuẫn clean không bắn oan + đối chứng dương ----------
{
  const CONFLICT = 'verdict clean nhưng bảng có finding';
  const root = mkdtempSync(path.join(tmpdir(), 'fsb2-'));
  mkWs(root, 'clean-ghost', { contract: contractWithSubheading(2), probe: gapProbe({ verdict: 'clean', rows: [], tail: GHOST_TAIL }) });
  mkWs(root, 'clean-real', { contract: contractWithSubheading(2), probe: gapProbe({ verdict: 'clean' }) });
  const a = runCard(root, 'clean-ghost').stdout;
  const b = runCard(root, 'clean-real').stdout;
  check('FSB2 clean + bảng ma ở đuôi → KHÔNG bắn cờ mâu thuẫn', () => assert.ok(!a.includes(CONFLICT)));
  check('FSB2 đối chứng dương: clean + hàng THẬT → CÓ bắn cờ mâu thuẫn', () => assert.ok(b.includes(CONFLICT)));
  rmSync(root, { recursive: true, force: true });
}

// ---------- FSB3: thẻ không cắt cụt AC sau sub-heading ----------
{
  const root = mkdtempSync(path.join(tmpdir(), 'fsb3-'));
  mkWs(root, 'subh', { contract: contractWithSubheading(5), probe: gapProbe() });
  const x = JSON.parse(runCard(root, 'subh', GATE_CARD, ['--extract']).stdout);
  check('FSB3 đủ 5 AC sau ### nhóm phụ (regression false-green card cụt)', () => {
    const ids = [...x.will_do, ...x.wont_do].map(v => v.id);
    assert.equal(ids.length, 5, `đọc được ${ids.length}: ${ids}`);
    assert.ok(ids.includes('AC-5'));
  });
  rmSync(root, { recursive: true, force: true });
}

// ---------- FSB4: evidence-page cũng không cắt cụt ----------
{
  const root = mkdtempSync(path.join(tmpdir(), 'fsb4-'));
  const evalBlocks = Array.from({ length: 5 }, (_, i) =>
    `- eval: E${i + 1}\n  criterion: AC-${i + 1}\n  executor: test\n  verdict: PASS\n  run_id: r${i + 1}\n  exit_code: 0`).join('\n\n');
  const evalTable = ['| Eval | Tiêu chí | Loại | Verdict |', '|---|---|---|---|',
    ...Array.from({ length: 5 }, (_, i) => `| E${i + 1} | AC-${i + 1} | test | PASS |`)].join('\n');
  const report = `---\nfeature_slug: fx\nverdict: PASS\nverified_by: fresh-context verification subagent\nenforcement_mode: strict\nbypass_used: false\nhuman_signoff:\n---\n\n# Evidence Report: fx\n\n${evalTable}\n\n## Evidence\n\n${evalBlocks}\n\n## Iterations\n\n- round 1: PASS\n`;
  mkWs(root, 'subh', { contract: contractWithSubheading(5), probe: gapProbe(), report });
  const r = spawnSync('node', [EVIDENCE_PAGE, '--root', root, '--slug', 'subh'], { encoding: 'utf8' });
  const html = readFileSync(path.join(root, '_acceptance', 'subh', 'evidence-page.html'), 'utf8');
  check('FSB4 evidence-page hiện đủ 5 AC sau sub-heading', () => {
    assert.equal(r.status, 0, r.stderr);
    for (let i = 1; i <= 5; i++) assert.ok(html.includes(`kết quả ${i}`), `thiếu TEXT của AC-${i} (section cắt cụt?)`);
  });
  rmSync(root, { recursive: true, force: true });
}

// ---------- FSB6: hết bản sao section() + call-site ô R×S ----------
{
  const hasOwnSection = (text, label) => { if (/function section\(/.test(text)) throw new Error(`van con dinh nghia section() rieng: ${label}`); };
  const gc = readFileSync(GATE_CARD, 'utf8'), ep = readFileSync(EVIDENCE_PAGE, 'utf8');
  check('FSB6 gate-card + evidence-page KHÔNG còn định nghĩa section() riêng, đều require lib', () => {
    hasOwnSection(gc, 'gate-card'); hasOwnSection(ep, 'evidence-page');
    assert.match(gc, /require\([^)]*md-section/);
    assert.match(ep, /require\([^)]*md-section/);
  });
  check('FSB6 ghim ô R×S: evidence-page KHÔNG có call-site section(…, Findings)', () =>
    assert.doesNotMatch(ep, /section\(\s*\w+\s*,\s*['"]Findings['"]/));
  check('FSB6 đối chứng đột biến: tiêm lại định nghĩa riêng → đúng thông điệp van con dinh nghia', () =>
    assert.throws(() => hasOwnSection(gc + '\nfunction section(t, h) { return []; }\n', 'gate-card'),
      /van con dinh nghia section\(\) rieng/));
  check('FSB6 đối chứng dương cùng harness: bản nguyên vẹn KHÔNG ném', () =>
    assert.doesNotThrow(() => { hasOwnSection(gc, 'gate-card'); hasOwnSection(ep, 'evidence-page'); }));
}

// ---------- FSB8: bảng marker ĐIỀU KHIỂN hành vi (không phải trang trí) ----------
{
  const root = mkdtempSync(path.join(tmpdir(), 'fsb8-'));
  const tree = path.join(root, 'tree');
  mkdirSync(path.join(tree, 'lib'), { recursive: true });
  mkdirSync(path.join(tree, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(tree, 'lib'), { recursive: true });
  cpSync(path.join(ROOT, 'scripts'), path.join(tree, 'scripts'), { recursive: true });
  const ws = path.join(root, 'ws');
  mkWs(ws, 'ghost', { contract: contractWithSubheading(2), probe: gapProbe({ tail: GHOST_TAIL }) });
  const copyCard = path.join(tree, 'scripts', 'gate-card.js');
  const intact = JSON.parse(runCard(ws, 'ghost', copyCard, ['--extract']).stdout);
  const libCopy = path.join(tree, 'lib', 'md-section.cjs');
  writeFileSync(libCopy, readFileSync(libCopy, 'utf8').replace('Findings -> any-heading', 'Findings -> same-or-higher'));
  const mutated = JSON.parse(runCard(ws, 'ghost', copyCard, ['--extract']).stdout);
  check('FSB8 đối chứng dương: bản sao NGUYÊN VẸN cho 1 hàng (0 hàng ma)', () =>
    assert.equal(intact.gap_probe.rows.length, 1));
  check('FSB8 đột biến Ô BẢNG → hàng ma XUẤT HIỆN (hành vi đi theo bảng, bảng không phải trang trí)', () => {
    // same-or-higher: `### Notes` (sâu hơn) lọt vào section, `# Appendix` (h1,
    // cao hơn) vẫn cắt → đúng 1 thật + 1 ma. Ghim theo NỘI DUNG, không chỉ số.
    // same-or-higher sau fix S4-r1: chỉ h2..h6 là ranh giới → cả `### Notes`
    // lẫn `# Appendix` đều KHÔNG cắt → 1 thật + 2 ma.
    assert.equal(mutated.gap_probe.rows.length, 3, `được ${mutated.gap_probe.rows.length}, mong 3 (1 thật + 2 ma)`);
    const dump = JSON.stringify(mutated);
    assert.ok(dump.includes('ghost1') && dump.includes('ghost2'), 'đột biến phải để lọt cả hai bảng đuôi');
    assert.ok(!JSON.stringify(intact).includes('ghost1'), 'bản nguyên vẹn không được có hàng ma');
  });
  rmSync(root, { recursive: true, force: true });
}

// ---- FSB9: dòng `# guidance` trong section VĂN XUÔI là CONTENT, không phải
// ranh giới — nếu coi h1 là boundary, hai cờ đỏ Gate 2 (non-discriminating,
// variance) biến mất khỏi thẻ. Regression do chính S4-r1 bắt (AC-8).
{
  const root = mkdtempSync(path.join(tmpdir(), 'fsb9-'));
  const report = ['---', 'feature_slug: fx', 'verdict: PASS', 'verified_by: fresh-context verification subagent',
    'enforcement_mode: strict', 'bypass_used: false', 'human_signoff:', '---', '',
    '# Evidence Report: fx', '',
    '| Eval | Tiêu chí | Loại | Verdict |', '|---|---|---|---|', '| E1 | AC-1 | test | PASS |', '',
    '## Evidence', '', '- eval: E1', '  criterion: AC-1', '  run_id: r1', '  exit_code: 0', '',
    '## Analyst', '',
    '# Non-discriminating evals: eval nào xanh cả trên bản gốc lẫn bản đột biến',
    '- E1 green-on-both — proves the harness, not the feature', '',
    '## Variance', '',
    '# Stochastic evals (runs > 1): ghi pass_rate',
    '- E1 pass_rate 3/5 (flaky)', ''].join('\n');
  mkWs(root, 'fx', { contract: contractWithSubheading(2).replace('status: draft', 'status: verified'), probe: gapProbe(), report });
  const out = runCard(root, 'fx').stdout;
  check('FSB9 dòng # guidance KHÔNG cắt section: cờ non-discriminating còn trên thẻ', () =>
    assert.ok(out.includes('green-on-both'), 'mất nội dung Analyst → mất cờ đỏ Gate 2'));
  check('FSB9 cờ variance (pass_rate) cũng còn', () =>
    assert.ok(out.includes('pass_rate 3/5'), 'mất nội dung Variance'));
  check('FSB9 đối chứng đột biến: coi h1 là ranh giới → nội dung Analyst biến mất', () => {
    const { section } = require0('lib/md-section.cjs');
    const rep = readFileSync(path.join(root, '_acceptance', 'fx', 'evidence-report.md'), 'utf8');
    assert.ok(section(rep, 'Analyst').join('\n').includes('green-on-both'));
    // luật any-heading (dành cho Findings) áp nhầm sẽ cắt ngay tại dòng `#`
    const cut = [];
    let inS = false;
    for (const l of rep.split('\n')) {
      const m = l.match(/^(#{1,6})\s/);
      if (m) { if (/^##\s+Analyst\b/.test(l)) { inS = true; continue; } if (inS) { inS = false; continue; } }
      if (inS) cut.push(l);
    }
    assert.ok(!cut.join('\n').includes('green-on-both'), 'đối chứng phải cho thấy luật sai LÀM MẤT nội dung');
  });
  rmSync(root, { recursive: true, force: true });
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
