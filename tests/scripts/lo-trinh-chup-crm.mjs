#!/usr/bin/env node
// lo-trinh-chup-crm.mjs — chụp bảng ô hồ sơ THẬT của crm vào fixture crm-okr (hồ sơ
// lo-trinh-tren-du-lieu-that, bước 1 kế hoạch). Fixture lát 1 khai ô hồ sơ bằng tay (`_nguon.ho_so`,
// Known limit Ngoài-6 của viec-ke-theo-plan) và khai sai hàng «1»; khối này do CODE sinh bằng đúng
// hàm xếp ô của bản đồ chạy trên một bản sao `_acceptance/` của crm. Slug không có thư mục thì vắng;
// hồ sơ có hợp đồng ghi `[ô, hạng]`.
//   node tests/scripts/lo-trinh-chup-crm.mjs --crm <bản sao crm> --nguon "<nhánh sha>"
import { readFileSync, writeFileSync, existsSync, statSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const KIT = path.resolve(HERE, '..', '..');
const FX = path.join(HERE, 'fixtures', 'lo-trinh', 'crm-okr.json');
const a = process.argv.slice(2);
const lay = k => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null; };
const crm = lay('--crm'); const nguon = lay('--nguon');
if (!crm || !nguon) { console.error('cần --crm <bản sao> --nguon "<nhánh sha>"'); process.exit(2); }
const { frontmatterField } = createRequire(import.meta.url)(path.join(KIT, 'lib', 'evidence-core.cjs'));
const PM = await import(pathToFileURL(path.join(KIT, 'scripts', 'product-map.mjs')).href);
const f = JSON.parse(readFileSync(FX, 'utf8'));
const acc = path.join(path.resolve(crm), '_acceptance');
const bang = {};
for (const h of f.hang) {
  const s = h && typeof h.slug === 'string' ? h.slug.trim() : '';
  if (!s || bang[s]) continue;
  const d = path.join(acc, s);
  if (!existsSync(d) || !statSync(d).isDirectory()) continue;
  // Hạng thật của hợp đồng đi kèm ô: hồ sơ giả của test mặc định T2, hàng crm khai T3 → cờ hạng giả.
  const c = existsSync(path.join(d, 'contract.md')) ? readFileSync(path.join(d, 'contract.md'), 'utf8') : null;
  const t = c == null ? '' : String(frontmatterField(c, 'risk_tier') || '').replace(/#.*$/, '').trim();
  bang[s] = t ? [PM.classify(d, s).key, t] : PM.classify(d, s).key;
}
f._nguon.ho_so_onehub = bang;
f._nguon.ho_so_onehub_nguon = nguon;
writeFileSync(FX, JSON.stringify(f, null, 2) + '\n');
console.log(`ghi ${Object.keys(bang).length} slug vào _nguon.ho_so_onehub`);
