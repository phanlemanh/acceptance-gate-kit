#!/usr/bin/env node
// chup-crm-onehub.mjs — chụp ba tệp lộ trình THẬT của crm (nhánh onehub) vào fixture của hồ sơ road-map-de-dung, bằng code:
// đọc thẳng git của crm ở sha đã ghim, không chép tay. Ghi `nguon.json` (sha + đường) để người đọc lần lại.
//   node tests/scripts/chup-crm-onehub.mjs --crm ~/dev/crm [--sha b74ec7eae] [--truoc 55811c635]
// `--truoc <sha>` chụp thêm lộ trình OKR ở cha của commit ấy (crm #466: bốn mốc người chưa khai loại giữ việc đã giao).
// `--ra-soat <sha>` chụp lộ trình OKR ở bản hạt giống «rà soát không xét mốc qua ngày» đã đo (bốn mốc quá ngày chưa khép).
import { execFileSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DICH = path.join(HERE, 'fixtures', 'lo-trinh', 'crm-onehub-1017');
const a = process.argv.slice(2); const lay = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d; };
const crm = lay('--crm', null); const sha = lay('--sha', 'b74ec7eae'); const truoc = lay('--truoc', '55811c635'); const raSoat = lay('--ra-soat', 'b1666c3ac');
if (!crm) { console.error('cần --crm <đường tới kho crm>'); process.exit(2); }
const show = (rev, tep) => execFileSync('git', ['-C', crm, 'show', `${rev}:${tep}`], { encoding: 'utf8', maxBuffer: 1 << 28 });
const full = rev => execFileSync('git', ['-C', crm, 'rev-parse', rev], { encoding: 'utf8' }).trim();
const TEP = { okr: 'docs/plan/lo-trinh-okr.json', 'kho-tai-lieu': 'docs/plan/lo-trinh-kho-tai-lieu.json', 'viec-du-an': 'docs/plan/lo-trinh-viec-du-an.json' };
mkdirSync(DICH, { recursive: true });
for (const [ten, tep] of Object.entries(TEP)) writeFileSync(path.join(DICH, `${ten}.json`), JSON.stringify(JSON.parse(show(sha, tep)), null, 2) + '\n');
writeFileSync(path.join(DICH, 'okr-truoc-466.json'), JSON.stringify(JSON.parse(show(`${truoc}^`, TEP.okr)), null, 2) + '\n');
writeFileSync(path.join(DICH, 'okr-ra-soat-1017.json'), JSON.stringify(JSON.parse(show(raSoat, TEP.okr)), null, 2) + '\n');
writeFileSync(path.join(DICH, 'nguon.json'), JSON.stringify({ kho: 'crm', nhanh: 'onehub', sha: full(sha), tep: TEP, okr_truoc_466: { sha: full(`${truoc}^`), tep: TEP.okr }, okr_ra_soat_1017: { sha: full(raSoat), tep: TEP.okr } }, null, 2) + '\n');
console.log(`đã chụp ${Object.keys(TEP).length + 2} tệp vào ${path.relative(process.cwd(), DICH)} (crm ${full(sha).slice(0, 9)})`);
