// Lưới thường trực của hồ sơ loi-moi-cong-may-sinh (2.7): cờ fail-quiet của
// thẻ, cột SẼ/KHÔNG, luật rơi bậc, câu gộp máy-sinh, bảng định tuyến.
// Fixture CODE-SINH trong chính lần chạy; mọi chuỗi ghim RÚT từ hằng của
// scripts/gate-card.js (khuôn gmpick) — không gõ literal ở phía test.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
const SRC = readFileSync(GC, 'utf8');
const pick = name => {
  const m = SRC.match(new RegExp(`^const ${name}\\s*=\\s*'([^']*)';`, 'm'));
  if (!m) throw new Error('gate-card.js khong khai hang ' + name);
  return m[1];
};
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

function mkWs(slug, files, cfg) {
  const root = mkdtempSync(path.join(tmpdir(), 'lmcms-'));
  mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), cfg || 'schema_version: 1\ngap_probe: required\n');
  for (const [f, t] of Object.entries(files)) writeFileSync(path.join(root, '_acceptance', slug, f), t);
  return root;
}
const card = (root, slug, extra = []) => spawnSync('node', [GC, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });

const CONTRACT_G2 = `---
schema_version: 1
feature: F
slug: s
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: A
approved_at: 2026-09-01T00:00:00Z
---

## Criteria

- AC-1: Given a, When b, Then c.

## Out of scope

- bỏ X.
`;
const EVALS = `evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.scripts
    expected: xanh
`;
const REPORT_PASS = `---
schema_version: 2
feature_slug: s
verdict: PASS
failed_evals: []
verified_commit: 0000000
human_signoff:
---

# E

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: r1abc
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-01T00:00:00Z
`;
const G2 = review => ({ 'contract.md': CONTRACT_G2, 'evals.yaml': EVALS, 'evidence-report.md': REPORT_PASS, 'review-findings.md': review });
const ITEM = p => `- **Bat bien X**\n  Người dùng thấy gì: nguoi thay X\n  file: \`a.js\`\n  severity: medium\n  Đề xuất: ${p}\n`;
const OOC = body => `# Review\n\n## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.\n\n${body}\n`;

// ── Task 3: cờ vàng cho hai đường fail-quiet (AC-5, AC-6) ──
check('LM01 OOC van xuoi -> co vang suspect (chuoi rut tu hang)', () => {
  const r = mkWs('s', G2(OOC('**N1 — Bat bien X khong nam trong luoi thuong truc, chi tiet du dai.**')));
  const out = card(r, 's').stdout;
  if (!out.includes(pick('MSG_OOC_SUSPECT'))) die('thieu co: ' + pick('MSG_OOC_SUSPECT'));
});
check('LM02 doi chung duong: dung khuon -> KHONG co suspect, van in de xuat', () => {
  const r = mkWs('s', G2(OOC(ITEM('known-limits'))));
  const out = card(r, 's').stdout;
  if (out.includes(pick('MSG_OOC_SUSPECT'))) die('co oan tren muc dung khuon');
  if (!out.includes('Máy đề xuất: ghi vào hạn chế đã biết rồi ship.')) die('mat de xuat hop le');
});
check('LM03 token la -> in nguyen van + ba token hop le, KHONG «chua de xuat»', () => {
  const r = mkWs('s', G2(OOC(ITEM('ghi Known limits'))));
  const out = card(r, 's').stdout;
  if (!out.includes(pick('MSG_PROPOSAL_LA'))) die('thieu: ' + pick('MSG_PROPOSAL_LA'));
  if (!out.includes('ghi Known limits')) die('khong in nguyen van token la');
  if (out.includes('Máy chưa đề xuất hướng nào.')) die('van in cau sai cu');
});
check('LM03b doi chung duong: khong co truong De xuat -> van la «chua de xuat»', () => {
  const r = mkWs('s', G2(OOC('- **Bat bien Y**\n  Người dùng thấy gì: nguoi thay Y\n  file: `b.js`\n  severity: low\n')));
  const out = card(r, 's').stdout;
  if (!out.includes('Máy chưa đề xuất hướng nào.')) die('mat nhanh mac dinh that');
  if (out.includes(pick('MSG_PROPOSAL_LA'))) die('co token-la oan khi khong co truong');
});

console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-lmcms)`);
process.exit(failed ? 1 : 0);
