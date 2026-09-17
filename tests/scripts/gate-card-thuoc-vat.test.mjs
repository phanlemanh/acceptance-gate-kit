// Lưới hồ sơ thuoc-co-cua AC-13: một dòng vật · thước · nhát trên thẻ Cổng Bằng chứng.
// Seam bên-VIẾT → bên-ĐỌC: dòng `kind: thuoc-vat` do CHÍNH feature-loop/scripts/thuoc-vat.mjs
// --write ghi trên kho git code-sinh (tests/scripts/thuoc-vat-fixture.mjs); số mong đợi đọc
// ĐỘC LẬP qua `thuoc-vat.mjs --json`, không qua bên đọc của thẻ. Dòng là dòng BÁO: bản ghi
// định tuyến (routingLine) của hồ sơ đã ký không được đổi.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dungKho, SLUG, TEP } from './thuoc-vat-fixture.mjs';
import { routingLine } from './routing-baseline.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.join(HERE, '..', '..');
const GC = path.join(KIT, 'scripts', 'gate-card.js');
const TV = path.join(KIT, 'feature-loop', 'scripts', 'thuoc-vat.mjs');
const SRC = readFileSync(GC, 'utf8');
let passed = 0, failed = 0;
const check = (n, f) => { try { f(); passed++; console.log(`  PASS: ${n}`); } catch (e) { failed++; console.log(`  FAIL: ${n}\n    ${e.message}`); } };
const die = m => { throw new Error(m); };
const hang = ten => { const m = SRC.match(new RegExp(`const ${ten} = '([^']+)';`)); return m ? m[1] : die(`gate-card.js thieu hang ${ten}`); };
const HONG = hang('THUOC_VAT_HONG_FLAG');
const DONG_RE = /Vật \+(\d+)\/−(\d+) · thước \+(\d+)\/−(\d+) · nhát sửa thước (\d+) \(lẫn (\d+)\)/g;

const CONTRACT = `---
schema_version: 1
feature: F
slug: ${SLUG}
risk_tier: T2
surfaces: [cli]
status: verified
approved_by: A
approved_at: 2026-09-01
---

## Criteria

- AC-1: Given a, When b, Then c.

## Out of scope

- bỏ X.
`;
const report = signoff => `---
schema_version: 2
feature_slug: ${SLUG}
verdict: PASS
failed_evals: []
verified_commit: 0000000
human_signoff: ${signoff}
---

# E

| Eval | Criterion | Executor | Verdict |
|---|---|---|---|
| E1 | AC-1 | test | PASS |

## Evidence

- eval: E1
  run_id: r1abc
  exit_code: 0
  verifier: config:executors.test.api
  verified_at: 2026-09-01T00:00:00Z
`;

// Kho: kịch bản chuẩn của bộ đếm (S3 · mốc sàn · hai nhát · một commit vật), rồi hồ sơ Cổng 2.
function kho(signoff = '') {
  const { d } = dungKho(mkdtempSync(path.join(tmpdir(), 'gt-')));
  writeFileSync(path.join(d, TEP.hopDong), CONTRACT);
  writeFileSync(path.join(d, '_acceptance', SLUG, 'evidence-report.md'), report(signoff));
  return d;
}
const ghi = d => { const r = spawnSync(process.execPath, [TV, '--root', d, '--slug', SLUG, '--write', '--ag-root', KIT], { encoding: 'utf8' }); if (r.status !== 0) die('thuoc-vat --write loi: ' + r.stderr); };
const soDocLap = d => { const r = spawnSync(process.execPath, [TV, '--root', d, '--slug', SLUG, '--json', '--ag-root', KIT], { encoding: 'utf8' }); return JSON.parse(r.stdout); };
const the = d => { const r = spawnSync(process.execPath, [GC, '--root', d, '--slug', SLUG], { encoding: 'utf8' }); if (r.status !== 0) die('gate-card loi: ' + r.stderr); return r.stdout.replace(/\x1b\[[0-9;]*m/g, ''); };
const extract = d => JSON.parse(spawnSync(process.execPath, [GC, '--root', d, '--slug', SLUG, '--extract'], { encoding: 'utf8' }).stdout);

check('GT1 round-trip — dong do chinh bo dem ghi duoc the in thanh dung MOT dong vat · thuoc · nhat voi dung so', () => {
  const d = kho();
  ghi(d);
  const so = soDocLap(d);
  if (so.nhat !== 2) die(`doi chung duong hong: fixture can 2 nhat, bo dem doc ${so.nhat}`);
  const h = the(d);
  const m = [...h.matchAll(DONG_RE)];
  if (m.length !== 1) die(`the in ${m.length} dong vat-thuoc-nhat, can 1`);
  const got = m[0].slice(1).map(Number);
  const want = [so.vat[0], so.vat[1], so.thuoc[0], so.thuoc[1], so.nhat, so.lan];
  if (JSON.stringify(got) !== JSON.stringify(want)) die(`so tren the ${JSON.stringify(got)} khac so bo dem ${JSON.stringify(want)}`);
});

check('GT2 chieu im — run-log khong co dong dem: the khong in dong nao them, khong co', () => {
  const h = the(kho());
  if ([...h.matchAll(DONG_RE)].length) die('the in dong vat-thuoc-nhat khi run-log khong co dong dem');
  if (h.includes(HONG)) die('the co co hong khi khong co dong nao');
});

check('GT3 chieu do — dong dem hong: the khong in so bia, in mot co khong doc duoc dong dem', () => {
  const d = kho();
  ghi(d);
  const p = path.join(d, TEP.runLog);
  const src = readFileSync(p, 'utf8');
  if (!/"nhat":\d+/.test(src)) die('kim "nhat" khong co trong dong ben viet ghi');
  writeFileSync(p, src.replace(/"nhat":\d+/, '"nhat":'));
  const h = the(d);
  if ([...h.matchAll(DONG_RE)].length) die('the van in so tu dong hong');
  if (h.split(HONG).length - 1 !== 1) die('the khong in dung mot co khong doc duoc dong dem');
});

check('GT4 dong bao khong thanh o hoi — routingLine cua ho so da ky giong het: khong dong · co dong · go dong', () => {
  const d = kho('Mạnh 2026-09-17');
  const r0 = routingLine(SLUG, extract(d).routing);
  ghi(d);
  const j1 = extract(d);
  if (!j1.thuoc_vat || j1.thuoc_vat.nhat !== 2) die('doi chung duong hong: extract khong mang dong dem sau khi ghi');
  const r1 = routingLine(SLUG, j1.routing);
  const p = path.join(d, TEP.runLog);
  writeFileSync(p, readFileSync(p, 'utf8').split('\n').filter(l => !/"kind":"thuoc-vat"/.test(l)).join('\n'));
  const r2 = routingLine(SLUG, extract(d).routing);
  if (r0 !== r1 || r1 !== r2) die(`routing doi: ${JSON.stringify([r0, r1, r2])}`);
});

console.log(`\nResults: ${passed} passed, ${failed} failed (gate-card-thuoc-vat)`);
process.exit(failed ? 1 : 0);
