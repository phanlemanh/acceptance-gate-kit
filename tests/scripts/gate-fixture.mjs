// gate-fixture.mjs — bộ dựng fixture CODE-SINH dùng chung cho các lưới thẻ (gate-card-lmcms,
// gate-card-goal, …). MỘT nguồn: hai lưới cùng đọc một khuôn workspace mà gate-card.js đòi —
// khuôn đổi thì cả hai đổi theo (bất biến «thước phải gắn vào vật», hình dạng (3): bên viết/bên
// đọc trôi khi mỗi test tự dựng fixture). Tách ra 03/09 (S4-r1 vu-trang-goal-luc-goi-ten).
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.join(HERE, '..', '..');
export const GC = path.join(ROOT, 'scripts', 'gate-card.js');
export const SRC = readFileSync(GC, 'utf8');
export function mkWs(slug, files, cfg) {
  const root = mkdtempSync(path.join(tmpdir(), 'lmcms-'));
  mkdirSync(path.join(root, '_acceptance', slug), { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), cfg || 'schema_version: 1\ngap_probe: required\n');
  for (const [f, t] of Object.entries(files)) writeFileSync(path.join(root, '_acceptance', slug, f), t);
  return root;
}
export const card = (root, slug, extra = []) => spawnSync('node', [GC, '--root', root, '--slug', slug, ...extra], { encoding: 'utf8' });

export const CONTRACT_G2 = `---
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
export const EVALS = `evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.scripts
    expected: xanh
`;
export const REPORT_PASS = `---
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
export const G2 = review => ({ 'contract.md': CONTRACT_G2, 'evals.yaml': EVALS, 'evidence-report.md': REPORT_PASS, 'review-findings.md': review });
export const ITEM = p => `- **Bat bien X**\n  Người dùng thấy gì: nguoi thay X\n  file: \`a.js\`\n  severity: medium\n  Đề xuất: ${p}\n`;
export const OOC = body => `# Review\n\n## Ngoài hợp đồng\n\nCác lỗi dưới đây là thật, nhưng nằm ngoài phạm vi đã duyệt ở Cổng 1 — người quyết, máy không tự sửa.\n\n${body}\n`;

export const extract = (root, slug, extra = []) => JSON.parse(spawnSync('node', [GC, '--root', root, '--slug', slug, '--extract', ...extra], { encoding: 'utf8' }).stdout);

export const G1 = probe => {
  const f = {
    'contract.md': `---\nschema_version: 1\nfeature: F\nslug: g\nrisk_tier: T2\nsurfaces: [cli]\nstatus: draft\n---\n\n## Criteria\n\n- AC-1: Given a, When b, Then c.\n\n## Coverage\n\n- trục A [thước CE: x].\n\n## Out of scope\n\n- x.\n`,
    'evals.yaml': EVALS,
    'decisions.jsonl': '',
  };
  if (probe !== null) f['gap-probe.md'] = probe;
  return f;
};
export const PROBE = v => `---\nslug: g\nat: 2026-09-01T00:00:00Z\nverdict: ${v}\np0: 0\np1: 0\np2: 0\n---\n\n## Findings\n\n| Sev | Artifact | Thiếu gì | Kịch bản fail | Thước đo | Xử lý |\n|---|---|---|---|---|---|\n`;
export const LEDGER = [
  '{"id":"d-1","type":"descope","stage":"S1","at":"2026-09-01T00:00:00Z","decision":"bo X","impact":"y"}',
  '{"id":"d-2","type":"seal","gate":1,"at":"2026-09-01T00:30:00Z"}',
  '{"id":"d-3","type":"fix","stage":"S4-r1","at":"2026-09-01T01:00:00Z","decision":"sua Z","impact":"w"}',
  '',
].join('\n');
// Ngoài-1 CÓ khuyến nghị (điền sẵn) · Ngoài-2 KHÔNG (để trống — người tự quyết)
export const REVIEW2 = OOC(ITEM('known-limits') + '\n' + '- **Bat bien Y**\n  Người dùng thấy gì: nguoi thay Y\n  file: `b.js`\n  severity: low\n');
export const G2FULL = () => { const f = G2(REVIEW2); f['decisions.jsonl'] = LEDGER; f['gap-probe.md'] = PROBE('findings').replace('p1: 0', 'p1: 2'); return f; };
