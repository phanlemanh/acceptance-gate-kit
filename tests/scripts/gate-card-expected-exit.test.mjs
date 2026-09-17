// Lưới hồ sơ thuoc-co-cua AC-2: thẻ Cổng Bằng chứng đọc mã thoát ĐÃ KHAI (`expected_exit`)
// qua bộ đọc dùng chung `expectedExits` của lib/eval-yaml.cjs. Trước bản vá thẻ so cứng
// mã 0, nên một eval trả đúng giới hạn đã khai bị gọi «CHƯA đủ trường» — nói ngược
// `failed_evals` của chính báo cáo, đúng khoảnh khắc người ký (crm 16/09).
// Fixture CODE-SINH trong lượt chạy; ca đỏ dùng CHUNG fixture với ca xanh, chỉ khác mã.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(HERE, '..', '..');
const GC = path.join(ROOT, 'scripts', 'gate-card.js');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };

const DU = 'bằng chứng máy đầy đủ';
const CHUA_DU = 'CHƯA đủ trường';

const CONTRACT = `---
schema_version: 1
feature: F
slug: s
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: A
approved_at: 2026-09-01
---

## Criteria

- AC-1: Given a, When b, Then c.
- AC-2: Given d, When e, Then f.

## Out of scope

- bỏ X.
`;
const evalsOf = khai => `evals:
  - id: E1
    criterion: AC-1
    executor: test
    cmd: config:executors.test.scripts
    expected: xanh
  - id: E2
    criterion: AC-2
    executor: script
    cmd: config:executors.script.gioi_han
${khai ? '    expected_exit: 3\n' : ''}    expected: dat co gioi han ma 3
`;
const reportOf = ({ ma2 = '3', runId2 = 'r2abc' } = {}) => `---
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
| E2 | AC-2 | script | PASS |

## Evidence

- eval: E1
  run_id: r1abc
  exit_code: 0
  verifier: config:executors.test.scripts
  verified_at: 2026-09-01T00:00:00Z
- eval: E2
  run_id: ${runId2}
  exit_code: ${ma2}
  verifier: config:executors.script.gioi_han
  verified_at: 2026-09-01T00:00:00Z
`;

function ws({ khai = true, ma2, runId2 } = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'gx-'));
  const d = path.join(root, '_acceptance', 's');
  mkdirSync(d, { recursive: true });
  writeFileSync(path.join(root, '_acceptance', 'config.yaml'), 'schema_version: 1\ngap_probe: required\n');
  writeFileSync(path.join(d, 'contract.md'), CONTRACT);
  writeFileSync(path.join(d, 'evals.yaml'), evalsOf(khai));
  writeFileSync(path.join(d, 'evidence-report.md'), reportOf({ ma2, runId2 }));
  return root;
}
const the = (root, gc = GC) => {
  const r = spawnSync('node', [gc, '--root', root, '--slug', 's'], { encoding: 'utf8' });
  if (r.status !== 0) die(`gate-card thoat ${r.status}: ${(r.stderr || '').slice(0, 300)}`);
  return r.stdout.replace(/\x1b\[[0-9;]*m/g, '');
};
// Số «chưa đạt» mà thẻ in: «<đạt>/<tổng> phép kiểm máy đạt · <n> CHƯA đạt», hoặc dòng tất-cả-đạt.
const chuaDat = html => {
  const m = html.match(/(\d+)\/(\d+) phép kiểm máy đạt · (\d+) CHƯA đạt/);
  if (m) return Number(m[3]);
  if (/(\d+)\/\1 phép kiểm máy đều đạt/.test(html)) return 0;
  return die('the khong in dong dem phep kiem may nao');
};

check('GX1 doi chung duong — moi eval ma 0 thi the in bang chung may day du', () => {
  const h = the(ws({ ma2: '0' }));
  if (!h.includes(DU)) die(`thieu «${DU}»`);
  if (h.includes(CHUA_DU)) die(`co «${CHUA_DU}» tren bao cao lanh`);
});

check('GX2 ma 3 da khai va bao cao ghi ma 3 — the van day du, chua dat bang 0', () => {
  const h = the(ws({ ma2: '3' }));
  if (!h.includes(DU)) die(`thieu «${DU}» — the dem gioi han da khai thanh truot`);
  if (h.includes(CHUA_DU)) die(`the in «${CHUA_DU}» cho eval tra DUNG ma da khai`);
  if (chuaDat(h) !== 0) die(`so chua dat = ${chuaDat(h)}, can 0`);
});

check('GX3 chieu do cung fixture — bao cao ghi ma 1 khac ma da khai thi the co, chua dat bang 1', () => {
  const h = the(ws({ ma2: '1' }));
  if (!h.includes(CHUA_DU)) die(`thieu «${CHUA_DU}» khi ma 1 lech ma da khai 3`);
  if (chuaDat(h) !== 1) die(`so chua dat = ${chuaDat(h)}, can 1`);
});

check('GX4 eval thieu run_id that van bi co — sua nay khong noi ca doi chung co san', () => {
  const h = the(ws({ ma2: '3', runId2: '' }));
  if (!h.includes(CHUA_DU)) die(`thieu «${CHUA_DU}» khi E2 khong co run_id`);
});

check('GX5 mot nguon — thay expectedExits cua lib bang ban tra rong thi GX2 lat', () => {
  const t = mkdtempSync(path.join(tmpdir(), 'gx-mut-'));
  cpSync(path.join(ROOT, 'scripts'), path.join(t, 'scripts'), { recursive: true });
  cpSync(path.join(ROOT, 'lib'), path.join(t, 'lib'), { recursive: true });
  const f = path.join(t, 'lib', 'eval-yaml.cjs');
  const src = readFileSync(f, 'utf8');
  const KIM = 'function expectedExits(text) {';
  if (src.split(KIM).length - 1 !== 1) die('kim expectedExits khong khop dung mot lan trong nguon that');
  writeFileSync(f, src.replace(KIM, KIM + ' return { byId: new Map(), errs: [] };'));
  const hThat = the(ws({ ma2: '3' }));
  const hMut = the(ws({ ma2: '3' }), path.join(t, 'scripts', 'gate-card.js'));
  if (hThat.includes(CHUA_DU)) die('doi chung duong hong: ban that da co');
  if (!hMut.includes(CHUA_DU)) die('ban dot bien van khong co — the khong doc ma da khai qua expectedExits cua lib');
});

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
